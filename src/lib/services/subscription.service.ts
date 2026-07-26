// src/lib/services/subscription.service.ts
// Central subscription activation service
// ONE authoritative place — called after any verified payment (Paystack, Flutterwave, Bank Transfer)

import { isDatabaseMode } from "@/lib/db/mode";

interface ActivateSubscriptionInput {
  userId: string;
  packageId: string;
  paymentReference: string;
  durationDays: number;
  matchAllowance: number;
  providerTransactionId?: string;
}

export async function activateSubscription(input: ActivateSubscriptionInput): Promise<{ success: boolean; message: string }> {
  if (!isDatabaseMode()) {
    return { success: true, message: "Demo mode — subscription activation simulated." };
  }

  const { prisma } = await import("@/lib/db/prisma");

  // 1. Check idempotency — if already SUCCESSFUL, don't activate twice
  const payment = await prisma.payment.findUnique({
    where: { reference: input.paymentReference },
  });

  if (!payment) {
    return { success: false, message: "Payment record not found." };
  }

  if (payment.status === "SUCCESSFUL") {
    return { success: true, message: "Payment already processed. Subscription active." };
  }

  // 2. Run in a transaction for atomicity
  await prisma.$transaction(async (tx) => {
    // Mark payment successful
    await tx.payment.update({
      where: { reference: input.paymentReference },
      data: {
        status: "SUCCESSFUL",
        providerTransactionId: input.providerTransactionId,
        verifiedAt: new Date(),
      },
    });

    // Deactivate any existing active subscription (business rule: one active at a time)
    await tx.subscription.updateMany({
      where: { userId: input.userId, status: "ACTIVE" },
      data: { status: "CANCELLED" },
    });

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + input.durationDays * 24 * 60 * 60 * 1000);

    // Create new subscription
    const subscription = await tx.subscription.create({
      data: {
        userId: input.userId,
        packageId: input.packageId,
        status: "ACTIVE",
        startDate,
        endDate,
        matchesRemaining: input.matchAllowance,
        activatedByPaymentId: payment.id,
      },
    });

    // Log activation event
    await tx.paymentEvent.create({
      data: {
        paymentId: payment.id,
        eventType: "subscription.activated",
        payload: { subscriptionId: subscription.id, endDate: endDate.toISOString() },
      },
    });

    // Create notification for member
    await tx.notification.create({
      data: {
        userId: input.userId,
        title: "Subscription Activated",
        message: `Your matchmaking subscription has been activated. You have ${input.matchAllowance} matches available.`,
        link: "/dashboard/subscription",
      },
    });
  });

  return { success: true, message: "Subscription activated successfully." };
}

export async function getActiveSubscription(userId: string) {
  if (!isDatabaseMode()) return null;
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.subscription.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { package: true },
    orderBy: { createdAt: "desc" },
  });
}
