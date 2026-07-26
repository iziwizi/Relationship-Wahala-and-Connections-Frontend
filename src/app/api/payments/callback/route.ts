// src/app/api/payments/callback/route.ts
// Handles post-payment redirect from Paystack/Flutterwave
// Verifies payment server-side BEFORE activating subscription

import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/payments/registry";
import { getPaymentByReference, updatePaymentStatus, logPaymentEvent } from "@/lib/repositories/payments.repository";
import { activateSubscription } from "@/lib/services/subscription.service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider") as "PAYSTACK" | "FLUTTERWAVE" | null;
  const reference = searchParams.get("reference") || searchParams.get("trxref");

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!reference || !provider || !["PAYSTACK", "FLUTTERWAVE"].includes(provider)) {
    return NextResponse.redirect(`${baseUrl}/dashboard/subscription?payment=invalid`);
  }

  try {
    const paymentRecord = await getPaymentByReference(reference);

    if (!paymentRecord) {
      return NextResponse.redirect(`${baseUrl}/dashboard/subscription?payment=not_found`);
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

    // Already processed — avoid double activation
    if (record.status === "SUCCESSFUL") {
      return NextResponse.redirect(`${baseUrl}/dashboard/subscription?payment=already_processed`);
    }

    await logPaymentEvent(
      record.id,
      "callback.received",
      { provider, reference }
    );

    const paymentProvider = getProvider(provider);
    const verification = await paymentProvider.verify(reference);

    if (verification.status !== "success") {
      await updatePaymentStatus(reference, "FAILED");
      return NextResponse.redirect(`${baseUrl}/dashboard/subscription?payment=failed`);
    }

    // Verify amount matches what we expect (prevent price manipulation)
    const expectedAmountLowestUnit = provider === "PAYSTACK"
      ? numericAmount * 100
      : numericAmount;

    if (Math.abs(verification.amount - expectedAmountLowestUnit) > 1) {
      await updatePaymentStatus(reference, "FAILED");
      await logPaymentEvent(record.id, "amount.mismatch", {
        expected: expectedAmountLowestUnit,
        received: verification.amount,
      });
      return NextResponse.redirect(`${baseUrl}/dashboard/subscription?payment=amount_mismatch`);
    }

    // All good — activate subscription
    await activateSubscription({
      userId: record.userId,
      packageId: record.packageId,
      paymentReference: reference,
      durationDays: record.package.durationDays,
      matchAllowance: record.package.matchAllowance,
      providerTransactionId: verification.providerTransactionId,
    });

    return NextResponse.redirect(`${baseUrl}/dashboard/subscription?payment=success`);
  } catch (error) {
    console.error("[Payment Callback]", error);
    return NextResponse.redirect(`${baseUrl}/dashboard/subscription?payment=error`);
  }
}
