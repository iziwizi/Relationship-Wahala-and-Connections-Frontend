// src/lib/db/mode.ts
// Central switch: DEMO mode (no DB) vs DATABASE mode (Prisma/Supabase active)
// When DATABASE_URL is present and contains real credentials (not placeholders), database mode is enabled.

export const isDatabaseMode = (): boolean => {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;

  // Placeholder detection — stay in DEMO mode if URL contains dummy/template strings
  if (
    url.includes("YOUR-PROJECT-REF") ||
    url.includes("YOUR-PASSWORD") ||
    url.includes("user:password") ||
    url.startsWith("postgres://user:")
  ) {
    return false;
  }

  return true;
};

export const DB_MODE = isDatabaseMode();
