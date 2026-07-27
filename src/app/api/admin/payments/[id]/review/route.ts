// src/app/api/admin/payments/[id]/review/route.ts
// Super Admin payment review handler (Approve / Reject)

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentId } = await params;
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const { action, note } = (await req.json()) as { action: "approve" | "reject"; note?: string };

    if (!paymentId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action parameters." }, { status: 400 });
    }

    if (!isDatabaseMode()) {
      return NextResponse.json({ success: true, message: `Payment ${action}d (demo mode)` });
    }

    const { PrismaClient } = await import("@/generated/prisma");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const pg = await import("pg");

    const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
    const pool = new pg.default.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { package: true },
      });

      if (!payment) {
        return NextResponse.json({ error: "Payment record not found." }, { status: 404 });
      }

      if (action === "approve") {
        // 1. Update Payment status to SUCCESSFUL
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: "SUCCESSFUL",
            approvedByAdminId: session.userId,
            approvalNote: note || "Approved by Super Admin",
            verifiedAt: new Date(),
          },
        });

        // 2. Activate Subscription for member
        const durationDays = payment.package?.durationDays || 30;
        const matchAllowance = payment.package?.matchAllowance || 5;
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

        // Deactivate previous active subscriptions for user
        await prisma.subscription.updateMany({
          where: { userId: payment.userId, status: "ACTIVE" },
          data: { status: "EXPIRED" },
        });

        await prisma.subscription.create({
          data: {
            userId: payment.userId,
            packageId: payment.packageId,
            status: "ACTIVE",
            startDate,
            endDate,
            matchesRemaining: matchAllowance,
          },
        });

        // 3. Create Notification for member
        await prisma.notification.create({
          data: {
            userId: payment.userId,
            title: "Subscription Activated! 🎉",
            message: `Your payment for ${payment.package?.name || "Matchmaking Plan"} has been verified and approved. Your subscription is now active!`,
            link: "/dashboard/subscription",
          },
        });

        return NextResponse.json({ success: true, message: "Payment approved and subscription activated." });
      } else {
        // Reject
        await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: "REJECTED",
            approvedByAdminId: session.userId,
            approvalNote: note || "Rejected by Super Admin",
          },
        });

        await prisma.notification.create({
          data: {
            userId: payment.userId,
            title: "Bank Transfer Review Notice",
            message: note
              ? `Your payment submission was reviewed: ${note}`
              : "Your bank transfer submission could not be verified. Please contact support or resubmit.",
            link: "/dashboard/payments",
          },
        });

        return NextResponse.json({ success: true, message: "Payment rejected." });
      }
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("[Admin Payment Review API]", error);
    return NextResponse.json({ error: "Failed to process payment review." }, { status: 500 });
  }
}
