## Backend Architecture (Node.js Migration)

The `apps/sync-backend` has been migrated from Java/Quarkus to Node.js/Fastify/Prisma.

### Key Technologies

- **Fastify**: High-performance web framework.
- **Prisma 7**: Modern ORM using **Driver Adapters** (`@prisma/adapter-pg`) for improved performance and portability.
- **tsx**: TypeScript execution engine for development.

### Development Workflow

- The backend is now run directly within the **dev container** instead of a separate service.
- Use `npm run start:backend` (or `npx nx run sync-backend:dev`) to start the server.
- Environment variables (like `DATABASE_URL`) are pre-configured in `docker-compose.yml` for the `dev` service.

### Prisma Setup

- The Prisma client is generated into the default location in `node_modules/@prisma/client`.
- It uses the modern "client" engine architecture with the `pg` driver adapter.
- Configuration for the adapter is located in `apps/sync-backend/src/plugins/prisma.ts`.

- **Minimize `any`:** Avoid using the `any` type. Prefer explicit types, interfaces, or generics. If a type is unknown, use `unknown`.
- **Type Safety:** Prioritize structural integrity and type safety. Use type guards and explicit language features instead of casting or suppressing warnings.
