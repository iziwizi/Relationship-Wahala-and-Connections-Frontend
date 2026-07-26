// src/lib/db/prisma.ts
// Prisma 7 + @prisma/adapter-pg singleton for Next.js / Vercel serverless
// Uses the pg Pool driver adapter as required by Prisma 7 architecture

import { PrismaClient } from "../../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var _prismaClient: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // No DATABASE_URL — return a client that will fail gracefully.
    // App runs in DEMO mode without a live DB connection.
    return new PrismaClient();
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Singleton — reuse in development to avoid exhausting connections
export const prisma = global._prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global._prismaClient = prisma;
}

export default prisma;
