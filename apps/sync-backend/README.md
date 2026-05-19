# ⚙️ Sync Backend

A high-performance Node.js synchronization backend for local-first applications, built with Fastify, Prisma, and PostgreSQL.

## 🏗️ Architecture

The `sync-backend` serves as the central synchronization hub for the Vireo ecosystem. It implements a custom synchronization protocol to ensure data consistency between the local RxDB instances in the frontend and the central PostgreSQL database.

### Key Components

- **Fastify:** High-performance web framework for handling API requests and WebSocket connections.
- **Prisma:** Modern ORM used for type-safe database access and automated migrations.
- **PostgreSQL:** Reliable relational database for persistent storage.
- **Swagger/OpenAPI:** Automated API documentation for easy integration and testing.

## 🛠️ Tech Stack

- **Framework:** [Fastify 5.8](https://www.fastify.io/)
- **ORM:** [Prisma 7](https://www.prisma.io/)
- **Database:** PostgreSQL 16
- **Language:** TypeScript 6

## 🏃 Getting Started

### Local Development

1. Ensure the database is running:

   ```bash
   docker compose up db -d
   ```

2. Setup the environment (install deps + generate Prisma client):

   ```bash
   npm run setup
   ```

3. Start the development server:
   ```bash
   npx nx run sync-backend:dev
   ```

## 📖 API Documentation

Once the server is running, you can access the interactive Swagger UI at:
`http://localhost:8080/documentation`

## 🔗 Workspace Commands

You can manage the backend from the root directory using Nx:

- `npm run start`: Starts both the backend and frontend.
- `npm run start:backend`: Starts only the backend.
- `npx nx run sync-backend:prisma-migrate`: Creates and applies a new database migration.
- `npx nx test sync-backend`: Runs unit tests for the backend.
