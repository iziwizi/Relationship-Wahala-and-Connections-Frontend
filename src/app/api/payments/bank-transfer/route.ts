// src/app/api/payments/bank-transfer/route.ts
// Bank transfer payment submission — creates PENDING_REVIEW payment record
// Subscription is NOT activated until admin manually approves

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { createPaymentRecord, updatePaymentStatus } from "@/lib/repositories/payments.repository";
import { getPackageById } from "@/lib/repositories/packages.repository";

function generateBankRef(): string {
  return `RWC-BNK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { packageId, transferReference, senderName, bankProofUrl } =
      await req.json() as {
        packageId: string;
        transferReference?: string;
        senderName?: string;
        bankProofUrl?: string;
      };

    if (!packageId) {
      return NextResponse.json({ error: "Package is required." }, { status: 400 });
    }

    const pkg = await getPackageById(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    const reference = generateBankRef();

    const payment = await createPaymentRecord({
      userId: session.userId,
      packageId: pkg.id,
      reference,
      amount: pkg.price,
      currency: pkg.currency,
      provider: "BANK_TRANSFER",
      metadata: { transferReference, senderName },
    });

    // Immediately move to PENDING_REVIEW
    await updatePaymentStatus(reference, "PENDING_REVIEW", {
      bankTransferProofUrl: bankProofUrl,
    });

    return NextResponse.json({
      success: true,
      reference: (payment as { reference: string }).reference,
      message: "Your transfer notification has been submitted. Our team will verify and activate your subscription within 24 hours.",
    });
  } catch (error) {
    console.error("[Bank Transfer]", error);
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });
  }
}
