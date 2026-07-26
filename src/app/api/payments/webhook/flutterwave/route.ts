// src/app/api/payments/webhook/flutterwave/route.ts
// Flutterwave webhook handler — idempotent, hash-verified

import { NextRequest, NextResponse } from "next/server";
import { flutterwaveProvider } from "@/lib/payments/flutterwave.provider";
import { getPaymentByReference, logPaymentEvent } from "@/lib/repositories/payments.repository";
import { activateSubscription } from "@/lib/services/subscription.service";

export async function POST(req: NextRequest) {
  const verif = req.headers.get("verif-hash") || "";
  const rawBody = await req.text();

  if (!flutterwaveProvider.verifyWebhookSignature(rawBody, verif)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: { event: string; data?: { tx_ref?: string; status?: string; amount?: number; id?: number } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (event.event === "charge.completed" && event.data?.tx_ref && event.data.status === "successful") {
    const reference = event.data.tx_ref;

    const paymentRecord = await getPaymentByReference(reference);
    if (!paymentRecord) return NextResponse.json({ received: true });

    const record = paymentRecord as unknown as {
      id: string;
      status: string;
      userId: string;
      packageId: string;
      amount: number | { toNumber(): number };
      package: { durationDays: number; matchAllowance: number };
    };

    const numericAmount = typeof record.amount === "number" ? record.amount : Number(record.amount);

    if (record.status === "SUCCESSFUL") {
      return NextResponse.json({ received: true, note: "already_processed" });
    }

    await logPaymentEvent(record.id, "webhook.flutterwave.charge.completed", event.data ?? {});

    if (event.data.amount && Math.abs(event.data.amount - numericAmount) > 1) {
      await logPaymentEvent(record.id, "webhook.amount.mismatch", {
        expected: numericAmount,
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
