---
name: backend-workflow
description: Guidelines and information on backend architecture (Node.js, Fastify, Prisma 7), database client configuration, and starting the development server.
---

# Backend Architecture and Development Workflow

The backend application is located under `apps/sync-backend` and has been migrated from Java/Quarkus to a modern Node.js/Fastify/Prisma stack.

## 1. Key Technologies

- **Fastify**: High-performance web framework.
- **Prisma 7**: Modern ORM using **Driver Adapters** (`@prisma/adapter-pg`) for improved performance and portability.
- **tsx**: TypeScript execution engine for development.

## 2. Development Workflow

- The backend is run directly within the **dev container** (no separate service container required).
- **Environment Variables**: Variables (like `DATABASE_URL`) are pre-configured in the `docker-compose.yml` for the `dev` service.
- **Starting the Server**: Use one of the following commands from the workspace root:
  - Using npm:
    ```bash
    npm run start:backend
    ```
  - Using Nx directly:
    ```bash
    npx nx run sync-backend:dev
    ```

## 3. Prisma Setup

- The Prisma client is generated into the default location in `node_modules/@prisma/client`.
- It uses the modern client engine architecture with the `pg` driver adapter.
- Configuration for the adapter is located in [prisma.ts](file:///home/daveteply/git/job-tracker/apps/sync-backend/src/plugins/prisma.ts).
