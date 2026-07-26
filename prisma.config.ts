// prisma.config.ts — Prisma 7 connection configuration
// This file manages the database URL outside of schema.prisma
// Uses @prisma/adapter-pg for the pg driver adapter

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Database URL is read from environment variables at CLI/migration time.
  // At runtime, the connection is established via the PrismaPg adapter in src/lib/db/prisma.ts
});
