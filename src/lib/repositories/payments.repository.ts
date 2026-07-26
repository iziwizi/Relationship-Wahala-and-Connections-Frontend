// src/lib/repositories/payments.repository.ts
// Payment data access — creates and updates payment records

import { isDatabaseMode } from "@/lib/db/mode";
import type { Prisma } from "@/generated/prisma";

export type PaymentProviderType = "PAYSTACK" | "FLUTTERWAVE" | "BANK_TRANSFER";
export type PaymentStatusType =
  | "PENDING" | "PROCESSING" | "SUCCESSFUL" | "FAILED"
  | "CANCELLED" | "PENDING_REVIEW" | "REJECTED";

export interface CreatePaymentInput {
  userId: string;
  packageId: string;
  reference: string;
  amount: number;
  currency: string;
  provider: PaymentProviderType;
  metadata?: Record<string, unknown>;
}

export async function createPaymentRecord(data: CreatePaymentInput) {
  if (!isDatabaseMode()) {
    return { id: `demo-pay-${Date.now()}`, reference: data.reference };
  }
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.payment.create({
    data: {
      userId: data.userId,
      packageId: data.packageId,
      reference: data.reference,
      amount: data.amount,
      currency: data.currency,
      provider: data.provider,
      status: "PENDING",
      metadata: (data.metadata ?? {}) as Prisma.InputJsonValue,
    },
  });
}

export async function getPaymentByReference(reference: string) {
  if (!isDatabaseMode()) return null;
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.payment.findUnique({
    where: { reference },
    include: { user: true, package: true },
  });
}

export async function updatePaymentStatus(
  reference: string,
  status: PaymentStatusType,
  extra?: {
    providerTransactionId?: string;
    verifiedAt?: Date;
    bankTransferProofUrl?: string;
    approvedByAdminId?: string;
    approvalNote?: string;
  }
) {
  if (!isDatabaseMode()) return;
  const { prisma } = await import("@/lib/db/prisma");
  await prisma.payment.update({
    where: { reference },
    data: {
      status,
      ...(extra?.providerTransactionId && { providerTransactionId: extra.providerTransactionId }),
      ...(extra?.verifiedAt && { verifiedAt: extra.verifiedAt }),
      ...(extra?.bankTransferProofUrl && { bankTransferProofUrl: extra.bankTransferProofUrl }),
      ...(extra?.approvedByAdminId && { approvedByAdminId: extra.approvedByAdminId }),
      ...(extra?.approvalNote && { approvalNote: extra.approvalNote }),
    },
  });
}

export async function logPaymentEvent(
  paymentId: string,
  eventType: string,
  payload?: Record<string, unknown>
) {
  if (!isDatabaseMode()) return;
  const { prisma } = await import("@/lib/db/prisma");
  await prisma.paymentEvent.create({
    data: {
      paymentId,
      eventType,
      payload: (payload ?? {}) as Prisma.InputJsonValue,
    },
  });
}

export async function getPaymentsByUser(userId: string) {
  if (!isDatabaseMode()) {
    const { demoTransactions } = await import("@/data/demo/transactions");
    return demoTransactions;
  }
  const { prisma } = await import("@/lib/db/prisma");
  return prisma.payment.findMany({
    where: { userId },
    include: { package: true },
    orderBy: { createdAt: "desc" },
  });
}
