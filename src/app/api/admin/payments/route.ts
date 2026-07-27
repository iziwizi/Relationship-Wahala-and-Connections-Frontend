// src/app/api/admin/payments/route.ts
// Super Admin payment logs endpoint — returns real Payment records from PostgreSQL

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

    if (!isDatabaseMode()) {
      return NextResponse.json({ success: true, payments: [] });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status");

    const { PrismaClient } = await import("@/generated/prisma");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const pg = await import("pg");

    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
    const pool = new pg.default.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
      const where: any = {};
      if (statusParam && statusParam !== "ALL") {
        where.status = statusParam;
      }

      const payments = await prisma.payment.findMany({
        where,
        include: {
          user: {
            include: {
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          package: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      const formatted = payments.map((p) => ({
        id: p.id,
        reference: p.reference,
        memberName: p.user?.profile
          ? `${p.user.profile.firstName} ${p.user.profile.lastName || ""}`.trim()
          : p.user?.email || "Unknown",
        memberEmail: p.user?.email,
        packageName: p.package?.name || "Matchmaking Plan",
        amount: typeof p.amount === "number" ? p.amount : Number(p.amount),
        currency: p.currency,
        provider: p.provider,
        status: p.status,
        bankProofUrl: p.bankTransferProofUrl,
        createdAt: p.createdAt.toISOString(),
      }));

      return NextResponse.json({ success: true, payments: formatted });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("[Admin Payments API]", error);
    return NextResponse.json({ error: "Failed to fetch payment records." }, { status: 500 });
  }
}
