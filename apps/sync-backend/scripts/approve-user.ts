import { PrismaPg } from '@prisma/adapter-pg';
import * as crypto from 'node:crypto';
import pg from 'pg';

import 'dotenv/config';

import { PrismaClient } from '../src/generated/prisma/index.js';

async function approveUser() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: npx tsx apps/sync-backend/scripts/approve-user.ts <email>');
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

    // 1. Find the application
    const application = await prisma.betaApplication.findUnique({
      where: { email },
    });

    if (!application) {
      console.error(`Error: No beta application found for email: ${email}`);
      process.exit(1);
    }

    if (application.status === 'APPROVED') {
      const existingToken = await prisma.betaToken.findFirst({
        where: { issuedToEmail: email },
      });
      console.log(`User ${email} is already approved.`);
      if (existingToken) {
        console.log(`Existing Token: ${existingToken.token}`);
      }
      process.exit(0);
    }

    // 2. Generate token (2-byte hex = 4 characters, plus prefix)
    const token = `BETA-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    // 3. Update application and create token in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.betaApplication.update({
        where: { email },
        data: { status: 'APPROVED' },
      });

      await tx.betaToken.create({
        data: {
          token,
          issuedToEmail: email,
          maxUses: 1,
          notes: 'Generated via CLI approve-user.ts',
        },
      });
    });

    console.log('------------------------------------------');
    console.log('✅ Application Approved Successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Token: ${token}`);
    console.log('------------------------------------------');
    console.log('You can now send this token to the user.');
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

approveUser();
