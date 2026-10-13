// src/app/api/public/bank-details/route.ts
// Exposes bank transfer details and payment gateway status publicly for checkout

import { NextResponse } from "next/server";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let bankName = "First Bank of Nigeria";
    let accountName = "Relationship Wahala and Connections Services";
    let accountNumber = "2049581735";
    let instructions = "Please include your booking reference number in transfer narration.";

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

    const paystackEnabled = Boolean(process.env.PAYSTACK_SECRET_KEY);
    const flutterwaveEnabled = Boolean(process.env.FLUTTERWAVE_SECRET_KEY);

    return NextResponse.json({
      bankName,
      accountName,
      accountNumber,
      instructions,
      paystackEnabled,
      flutterwaveEnabled,
    });
  } catch (error) {
    console.error("[Public Bank Details API]", error);
    return NextResponse.json(
      {
        bankName: "First Bank of Nigeria",
        accountName: "Relationship Wahala & Connections Ltd",
        accountNumber: "3012345678",
        instructions: "Please include your full name in transfer narration.",
        paystackEnabled: Boolean(process.env.PAYSTACK_SECRET_KEY),
        flutterwaveEnabled: Boolean(process.env.FLUTTERWAVE_SECRET_KEY),
      },
      { status: 200 }
    );
  }
}
