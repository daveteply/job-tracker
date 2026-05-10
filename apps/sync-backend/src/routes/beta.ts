import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const ApplySchema = z.object({
  email: z.email(),
  name: z.string().optional(),
  reason: z.string().optional(),
});

const ValidateSchema = z.object({
  token: z.string(),
  email: z.email(),
});

const betaRoutes: FastifyPluginAsync = async (server) => {
  // Submit a beta application
  server.post('/apply', async (request, reply) => {
    const { email, name, reason } = ApplySchema.parse(request.body);

    await server.prisma.betaApplication.upsert({
      where: { email },
      create: {
        email,
        name,
        reason,
        status: 'PENDING',
      },
      update: {
        name,
        reason,
      },
    });

    return { success: true };
  });

  // Validate an invite token
  server.post('/validate', async (request, reply) => {
    const { token, email } = ValidateSchema.parse(request.body);

    const betaToken = await server.prisma.betaToken.findUnique({
      where: { token: token.toUpperCase() },
    });

    if (!betaToken) {
      return reply.code(400).send({ error: 'invalidCode' });
    }

    if (betaToken.expiresAt && betaToken.expiresAt < new Date()) {
      return reply.code(400).send({ error: 'expiredCode' });
    }

    if (betaToken.uses >= betaToken.maxUses) {
      return reply.code(400).send({ error: 'usedCode' });
    }

    // Mark application as approved so sync can proceed later
    await server.prisma.$transaction([
      server.prisma.betaToken.update({
        where: { id: betaToken.id },
        data: { uses: { increment: 1 } },
      }),
      server.prisma.betaApplication.upsert({
        where: { email },
        create: {
          email,
          status: 'APPROVED',
        },
        update: {
          status: 'APPROVED',
        },
      }),
    ]);

    return { success: true };
  });
};

export default betaRoutes;
