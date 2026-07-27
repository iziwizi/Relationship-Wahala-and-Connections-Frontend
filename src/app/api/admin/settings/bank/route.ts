// src/app/api/admin/settings/bank/route.ts
// Super Admin bank transfer settings API endpoint

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    let bankName = "First Bank of Nigeria";
    let accountName = "Relationship Wahala & Connections Ltd";
    let accountNumber = "3012345678";
    let instructions = "Please include your full name in transfer narration.";

    if (isDatabaseMode()) {
      const { PrismaClient } = await import("@/generated/prisma");
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const pg = await import("pg");

      const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
      const pool = new pg.default.Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      const prisma = new PrismaClient({ adapter });

      try {
        const settings = await prisma.platformSetting.findMany({
          where: {
            key: {
              in: [
                "bank_name",
                "bank_account_name",
                "bank_account_number",
                "bank_transfer_instructions",
              ],
            },
          },
        });

        const map = new Map(settings.map((s) => [s.key, s.value]));
        if (map.has("bank_name")) bankName = map.get("bank_name")!;
        if (map.has("bank_account_name")) accountName = map.get("bank_account_name")!;
        if (map.has("bank_account_number")) accountNumber = map.get("bank_account_number")!;
        if (map.has("bank_transfer_instructions")) instructions = map.get("bank_transfer_instructions")!;
      } finally {
        await prisma.$disconnect();
      }
    }

    const paystackConfigured = Boolean(process.env.PAYSTACK_SECRET_KEY);
    const flutterwaveConfigured = Boolean(process.env.FLUTTERWAVE_SECRET_KEY);

    return NextResponse.json({
      success: true,
      bankName,
      accountName,
      accountNumber,
      instructions,
      paystackConfigured,
      flutterwaveConfigured,
    });
  } catch (error) {
    console.error("[Admin Bank Settings GET]", error);
    return NextResponse.json({ error: "Failed to load bank settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const { bankName, accountName, accountNumber, instructions } = await req.json();

    if (!bankName || !accountName || !accountNumber) {
      return NextResponse.json({ error: "Bank name, account name, and account number are required." }, { status: 400 });
    }

    if (isDatabaseMode()) {
      const { PrismaClient } = await import("@/generated/prisma");
      const { PrismaPg } = await import("@prisma/adapter-pg");
      const pg = await import("pg");

      const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
      const pool = new pg.default.Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      const prisma = new PrismaClient({ adapter });

      try {
        const updates = [
          { key: "bank_name", value: bankName },
          { key: "bank_account_name", value: accountName },
          { key: "bank_account_number", value: accountNumber },
          { key: "bank_transfer_instructions", value: instructions || "" },
        ];

        for (const item of updates) {
          await prisma.platformSetting.upsert({
            where: { key: item.key },
            update: { value: item.value },
            create: { key: item.key, value: item.value },
          });
        }
      } finally {
        await prisma.$disconnect();
      }
    }

    return NextResponse.json({ success: true, message: "Bank transfer settings updated successfully." });
  } catch (error) {
    console.error("[Admin Bank Settings PUT]", error);
    return NextResponse.json({ error: "Failed to update bank settings." }, { status: 500 });
  }
}
