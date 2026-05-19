# 🐳 Infrastructure Management

This project manages the database and shared infrastructure for the Vireo monorepo.

## 🐘 Database Migrations

Vireo uses **Prisma Migrations** to manage the PostgreSQL database schema. These migrations are handled within the `apps/sync-backend` project to ensure the schema is always in sync with the backend application code.

### Location

Migrations are defined as SQL files and a `schema.prisma` file located in:
`apps/sync-backend/prisma/`

### Running Migrations

Migrations are typically managed using the Prisma CLI through Nx commands.

- **Development:** Running `npm run setup` will generate the Prisma client. To apply migrations or create new ones during development, use:
  ```bash
  npx nx run sync-backend:prisma-migrate
  ```
- **Production/Deployment:** In a production environment, migrations are applied using:
  ```bash
  npx nx run sync-backend:prisma-deploy
  ```

### 🛠️ Troubleshooting

If you cannot connect to the database or migrations are failing:

1.  **Verify Database Status:** Ensure the `db` service is running in Docker: `docker compose ps`.
2.  **Check Environment Variables:** Verify your `.env` file has the correct `DATABASE_URL` (it should match the one used by the `dev` service in `docker-compose.yml`).
3.  **Dev Container:** Ensure you are running all commands from **within the VS Code Dev Container**.
4.  **Prisma Logs:** Check the terminal output when running `prisma-migrate` for specific error messages from the Prisma engine.
5.  **Direct Database Access:** You can use **PGAdmin** at `http://localhost:5050` to inspect the database state and the `_prisma_migrations` table.
