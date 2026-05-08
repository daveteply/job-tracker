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

const syncRoutes: FastifyPluginAsync = async (server) => {
  server.post('/pull', async (request, reply) => {
    const userId = request.headers['x-user-id'] as string;
    if (!userId) {
      return reply.code(400).send({ error: 'X-User-Id header is required' });
    }

    const { collection, checkpoint, limit } = PullRequestSchema.parse(request.body);

    const lastTimestamp = checkpoint?.serverTimestamp ?? BigInt(0);

    // Prisma doesn't support >= with UUID sort easily in one go if we want strict ordering
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

    if (!userId) {
      return reply.code(400).send({ error: 'X-User-Id header is required' });
    }
    if (!collection) {
      return reply.code(400).send({ error: 'collection query param is required' });
    }

    const rows = PushRequestSchema.parse(request.body);

    // Using a transaction to ensure all events are saved
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

    // Return conflicts
    return [];
  });
};

export default syncRoutes;
