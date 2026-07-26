// src/app/api/payments/webhook/paystack/route.ts
// Paystack webhook handler — idempotent, signature-verified

import { NextRequest, NextResponse } from "next/server";
import { paystackProvider } from "@/lib/payments/paystack.provider";
import { getPaymentByReference, logPaymentEvent } from "@/lib/repositories/payments.repository";
import { activateSubscription } from "@/lib/services/subscription.service";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-paystack-signature") || "";
  const rawBody = await req.text();

  // Verify webhook signature
  if (!paystackProvider.verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: { event: string; data?: { reference?: string; status?: string; amount?: number; id?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (event.event === "charge.success" && event.data?.reference) {
    const reference = event.data.reference;

    const paymentRecord = await getPaymentByReference(reference);
    if (!paymentRecord) {
      return NextResponse.json({ received: true }); // Not our transaction
    }

    const record = paymentRecord as unknown as {
      id: string;
      status: string;
      userId: string;
      packageId: string;
      amount: number | { toNumber(): number };
      package: { durationDays: number; matchAllowance: number };
    };

    const numericAmount = typeof record.amount === "number" ? record.amount : Number(record.amount);

    // Idempotency check
    if (record.status === "SUCCESSFUL") {
      return NextResponse.json({ received: true, note: "already_processed" });
    }

    await logPaymentEvent(record.id, "webhook.paystack.charge.success", event.data ?? {});

    // Verify amount
    const expectedKobo = numericAmount * 100;
    if (event.data.amount && Math.abs(event.data.amount - expectedKobo) > 1) {
      await logPaymentEvent(record.id, "webhook.amount.mismatch", {
        expected: expectedKobo,
        received: event.data.amount,
      });
      return NextResponse.json({ received: true, note: "amount_mismatch" });
    }

    await activateSubscription({
      userId: record.userId,
      packageId: record.packageId,
      paymentReference: reference,
      durationDays: record.package.durationDays,
      matchAllowance: record.package.matchAllowance,
      providerTransactionId: String(event.data.id || ""),
    });
  }

  return NextResponse.json({ received: true });
}
