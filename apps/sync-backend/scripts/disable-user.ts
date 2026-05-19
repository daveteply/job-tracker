import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

import 'dotenv/config';

async function disableUser() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: npx tsx apps/sync-backend/scripts/disable-user.ts <email>');
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new pg.Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();

    // 1. Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`Error: No user found with email: ${email}`);
      process.exit(1);
    }

    if (!user.isActive) {
      console.log(`User ${email} is already disabled.`);
      process.exit(0);
    }

    // 2. Disable the user
    await prisma.user.update({
      where: { email },
      data: { isActive: false },
    });

    console.log('------------------------------------------');
    console.log('✅ User Disabled Successfully!');
    console.log(`📧 Email: ${email}`);
    console.log('------------------------------------------');
    console.log('The user can no longer perform back-end sync operations.');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

disableUser();
