// src/lib/db/mode.ts
// Central switch: DEMO mode (no DB) vs DATABASE mode (Prisma/Supabase active)
// When DATABASE_URL is present and non-empty, database mode is enabled.

export const isDatabaseMode = (): boolean => {
  return !!(
    process.env.DATABASE_URL &&
    process.env.DATABASE_URL.trim() !== "" &&
    !process.env.DATABASE_URL.startsWith("postgres://user:")  // still placeholder
  );
};

export const DB_MODE = isDatabaseMode();
