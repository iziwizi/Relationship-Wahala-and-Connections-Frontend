// src/app/api/user/payments/route.ts
// Returns the authenticated member's payment history and active subscription from the real database.

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!isDatabaseMode()) {
      return NextResponse.json({
        success: true,
        payments: [],
        subscription: null,
      });
    }

    const { prisma } = await import("@/lib/db/prisma");

    // Fetch payments
    const payments = await prisma.payment.findMany({
      where: { userId: session.userId },
      include: { package: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    // Fetch active subscription
    const subscription = await prisma.subscription.findFirst({
      where: { userId: session.userId, status: "ACTIVE" },
      include: { package: true },
      orderBy: { startDate: "desc" },
    });

    const formattedPayments = payments.map((p) => ({
      id: p.id,
      reference: p.reference,
      packageName: p.package?.name ?? "Matchmaking Plan",
      amount: Number(p.amount),
      currency: p.currency,
      provider: p.provider,
      status: p.status,
      createdAt: p.createdAt.toISOString(),
    }));

    const formattedSubscription = subscription
      ? {
          id: subscription.id,
          packageName: subscription.package.name,
          packageDescription: subscription.package.description,
          packagePrice: Number(subscription.package.price),
          packageDurationDays: subscription.package.durationDays,
          packageFeatures: subscription.package.features,
          matchesRemaining: subscription.matchesRemaining,
          status: subscription.status,
          startDate: subscription.startDate.toISOString(),
          endDate: subscription.endDate.toISOString(),
        }
      : null;

    return NextResponse.json({
      success: true,
      payments: formattedPayments,
      subscription: formattedSubscription,
    });
  } catch (error) {
    console.error("[User Payments API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch payment data." }, { status: 500 });
  }
}
