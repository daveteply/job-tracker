import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';

import prismaPlugin from './plugins/prisma.js';
import syncRoutes from './routes/sync.js';

const server = Fastify({
  logger: true,
});

async function main() {
  // Register Plugins
  await server.register(cors, {
    origin: true,
  });

  await server.register(swagger, {
    openapi: {
      info: {
        title: 'Sync Backend API',
        description: 'Local-first synchronization backend',
        version: '1.0.0',
      },
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/documentation',
  });

  await server.register(prismaPlugin);

  // Register Routes
  await server.register(syncRoutes, { prefix: '/sync' });

  // Health Check
  server.get('/health', async () => {
    return { status: 'UP' };
  });

  try {
    const port = Number(process.env.PORT) || 8080;
    const host = process.env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    console.log(`Server listening at http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
