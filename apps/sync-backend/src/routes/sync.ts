import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import { Prisma } from '../generated/prisma/index.js';

const CheckpointSchema = z.object({
  serverTimestamp: z.union([z.string(), z.number(), z.bigint()]).transform((v) => BigInt(v)),
  id: z.string(),
});

const PullRequestSchema = z.object({
  collection: z.string(),
  checkpoint: CheckpointSchema.nullable().optional(),
  limit: z.number().optional().default(100),
});

const PushRowSchema = z.object({
  newDocumentState: z.record(z.string(), z.any()),
  assumedMasterState: z.record(z.string(), z.any()).nullable().optional(),
});

const PushRequestSchema = z.array(PushRowSchema);

// In-memory cache for user authorization
const authCache = new Map<string, { isActive: boolean; expires: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const syncRoutes: FastifyPluginAsync = async (server) => {
  // Authorization Hook
  server.addHook('preHandler', async (request, reply) => {
    const userId = request.headers['x-user-id'] as string;
    const userEmail = request.headers['x-user-email'] as string;

    if (!userId) {
      return reply.code(400).send({ error: 'X-User-Id header is required' });
    }

    // Check cache first
    const cached = authCache.get(userId);
    if (cached && cached.expires > Date.now()) {
      if (!cached.isActive) {
        return reply.code(403).send({ error: 'notAuthorized' });
      }
      return;
    }

    // Check database
    let user = await server.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user && userEmail) {
      // Auto-provision if email is approved in beta applications
      const application = await server.prisma.betaApplication.findUnique({
        where: { email: userEmail, status: 'APPROVED' },
      });

      if (application) {
        try {
          user = await server.prisma.user.create({
            data: {
              id: userId,
              email: userEmail,
              plan: 'beta',
              isActive: true,
              lastLoginAt: new Date(),
            },
          });
        } catch (e) {
          // Handle potential race condition if user was created between check and create
          user = await server.prisma.user.findUnique({ where: { id: userId } });
        }
      }
    }

    if (!user || !user.isActive) {
      authCache.set(userId, { isActive: false, expires: Date.now() + CACHE_TTL });
      return reply.code(403).send({ error: 'notAuthorized' });
    }

    // Success: update cache and last login
    authCache.set(userId, { isActive: true, expires: Date.now() + CACHE_TTL });

    // Background update last login at (don't await to keep response fast)
    server.prisma.user
      .update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      })
      .catch((err) => server.log.error(err));
  });

  server.post('/pull', async (request, reply) => {
    const userId = request.headers['x-user-id'] as string;
    const { collection, checkpoint, limit } = PullRequestSchema.parse(request.body);

    const lastTimestamp = checkpoint?.serverTimestamp ?? BigInt(0);

    const events = await server.prisma.syncEvent.findMany({
      where: {
        userId,
        collectionName: collection,
        serverTimestamp: {
          gte: lastTimestamp,
        },
      },
      orderBy: [{ serverTimestamp: 'asc' }, { id: 'asc' }],
      take: limit,
    });

    const documents = events.map((e) => e.payload as Record<string, unknown>);
    let nextCheckpoint = null;

    if (events.length > 0) {
      const last = events[events.length - 1];
      nextCheckpoint = {
        serverTimestamp: last.serverTimestamp.toString(),
        id: last.id,
      };
    }

    return { documents, checkpoint: nextCheckpoint };
  });

  server.post('/push', async (request, reply) => {
    const userId = request.headers['x-user-id'] as string;
    const { collection } = request.query as { collection?: string };

    if (!collection) {
      return reply.code(400).send({ error: 'collection query param is required' });
    }

    const rows = PushRequestSchema.parse(request.body);

    await server.prisma.$transaction(
      rows.map((row) => {
        const doc = row.newDocumentState;
        return server.prisma.syncEvent.create({
          data: {
            userId,
            collectionName: collection,
            documentId: String(doc.id),
            payload: doc as unknown as Prisma.InputJsonValue,
            eventOp: 'UPSERT',
            version: typeof doc.version === 'number' ? doc.version : 1,
            serverTimestamp: BigInt(Date.now()),
          },
        });
      }),
    );

    return [];
  });
};

export default syncRoutes;
