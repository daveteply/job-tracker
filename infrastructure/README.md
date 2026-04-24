# 🐳 Infrastructure Management

This project manages the database and shared infrastructure for the JobTracker monorepo.

## 🐘 Database Migrations

JobTracker uses **Flyway** for database migrations. These are managed within the `apps/sync-backend` project to ensure the schema is always in sync with the backend application.

### Location

Migrations are defined as SQL files located in:
`apps/sync-backend/src/main/resources/db/migration`

### Running Migrations

Migrations are automatically applied when the `sync-backend` application starts.

- **Development:** Running `npx nx dev sync-backend` or `npm run start` will trigger migrations on startup.
- **First-time Setup:** The `npm run setup` command in the root directory clears build artifacts and builds the backend, which is a good way to ensure everything is clean before starting.

### 🛠️ Troubleshooting

If you cannot connect to the database or migrations are failing:
1.  Verify the `db` service is running: `docker compose ps`.
2.  Check your `.env` settings against the defaults in `docker-compose.yml`.
3.  Ensure you are running commands from **within the dev container**.
4.  Check the `sync-backend` logs for Flyway output to identify specific SQL errors.
