import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function getPrismaClient(): PrismaClient {
  let dbUrl = process.env.DATABASE_URL;

  // On Vercel serverless functions, /var/task is read-only.
  // Copy SQLite dev.db to /tmp/dev.db so SQLite can read & write on serverless lambdas.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDbPath = '/tmp/dev.db';
    if (!fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
      const possibleSeedPaths = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), 'dev.db'),
      ];

      for (const seedPath of possibleSeedPaths) {
        if (fs.existsSync(/*turbopackIgnore: true*/ seedPath)) {
          try {
            fs.copyFileSync(seedPath, tmpDbPath);
            break;
          } catch (e) {
            console.error('[DealDisha Prisma] Error copying SQLite DB to /tmp:', e);
          }
        }
      }
    }
    dbUrl = `file:${tmpDbPath}`;
  }

  return new PrismaClient({
    datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

