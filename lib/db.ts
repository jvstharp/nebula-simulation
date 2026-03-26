import { PrismaClient } from '@prisma/client';
// Use pg from the adapter's bundled version to avoid @types/pg conflicts
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Pool } = require('pg') as typeof import('pg');
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  // Cast to any to bypass @types/pg version mismatch between standalone and bundled
  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
