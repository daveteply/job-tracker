import { Client } from 'pg';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres_password',
    host: process.env.POSTGRES_HOST || 'db', // Hostname in the docker-compose network
    database: process.env.POSTGRES_DB || 'job_tracker_db',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
};

async function runMigrations() {
    const client = new Client(dbConfig);

    try {
        await client.connect();
        console.log(`Connected to database ${dbConfig.database} on ${dbConfig.host}`);

        // Create a simple migrations table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS _migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const sqlDir = path.join(process.cwd(), 'infrastructure/sql');
        const files = fs.readdirSync(sqlDir)
            .filter(f => f.endsWith('.sql'))
            .sort();

        for (const file of files) {
            const { rows } = await client.query('SELECT * FROM _migrations WHERE name = $1', [file]);

            if (rows.length === 0) {
                console.log(`Applying migration: ${file}`);
                const sql = fs.readFileSync(path.join(sqlDir, file), 'utf8');
                
                await client.query('BEGIN');
                try {
                    await client.query(sql);
                    await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
                    await client.query('COMMIT');
                    console.log(`Successfully applied: ${file}`);
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.error(`Error applying migration ${file}:`, err);
                    throw err;
                }
            } else {
                console.log(`Migration already applied: ${file}`);
            }
        }

        console.log('All migrations processed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runMigrations();
