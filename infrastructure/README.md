# 🐳 Infrastructure Management

This project manages the database and shared infrastructure for the JobTracker monorepo.

## 🐘 Database Migrations

Database migrations are defined as plain SQL files in the `sql/` directory.

### Running Migrations

You can run these migrations manually using Nx from the root of the workspace:

```bash
npx nx run infrastructure:migrate
```

**How it works:**
1.  **Script:** `scripts/migrate.ts` connects to the PostgreSQL `db` service.
2.  **Configuration:** Uses settings from your `.env` file (User, Password, Database).
3.  **Tracking:** Creates a `_migrations` table to track which files have already been applied to avoid re-runs.
4.  **Transaction:** Each migration file is executed within its own SQL transaction (BEGIN/COMMIT).

### Sync Backend Integration

The `apps/sync-backend` Quarkus service also contains Flyway migrations in `src/main/resources/db/migration`. 
**Important:** Ensure any new tables or schema changes added to `infrastructure/sql` are also reflected in the `sync-backend` Flyway migrations if you want the Java app to manage them during deployment.

### 🛠️ Troubleshooting

If you cannot connect to the database:
1.  Verify the `db` service is running: `docker compose ps`.
2.  Check your `.env` settings against the defaults in `docker-compose.yml`.
3.  Ensure you are running the command from **within the dev container**.
