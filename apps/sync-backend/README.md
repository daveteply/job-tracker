# ⚙️ Sync Backend

A Node.js synchronization backend for local-first applications, built with Fastify, Prisma, and PostgreSQL.

## 🛠️ Tech Stack

- **Framework:** [Fastify](https://www.fastify.io/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Language:** TypeScript

## 🏃 Getting Started

### Local Development

1. Ensure the database is running:
   ```bash
   docker compose up db -d
   ```

2. Generate the Prisma client:
   ```bash
   npx nx run sync-backend:prisma-generate
   ```

3. Start the development server:
   ```bash
   npx nx dev sync-backend
   ```

## 📖 API Documentation

Once the server is running, you can access the Swagger UI at:
`http://localhost:8080/documentation`

## 🔗 Workspace Commands

You can also manage the backend from the root directory:

- `npm run start`: Starts both the backend and frontend.
- `npm run start:backend`: Starts only the backend.
