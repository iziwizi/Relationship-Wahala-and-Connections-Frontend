// src/app/api/payments/initialize/route.ts
// Initialises a payment with Paystack or Flutterwave
// SECRET KEY stays server-side — client receives only the redirect URL

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { getProvider } from "@/lib/payments/registry";
import { createPaymentRecord } from "@/lib/repositories/payments.repository";
import { getPackageById } from "@/lib/repositories/packages.repository";

function generateReference(provider: string): string {
  return `RWC-${provider.substring(0, 3).toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { packageId, provider } = await req.json() as { packageId: string; provider: "PAYSTACK" | "FLUTTERWAVE" };

    if (!packageId || !provider || !["PAYSTACK", "FLUTTERWAVE"].includes(provider)) {
      return NextResponse.json({ error: "Invalid request parameters." }, { status: 400 });
    }

    const pkg = await getPackageById(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    const reference = generateReference(provider);
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const callbackUrl = `${baseUrl}/api/payments/callback?provider=${provider}&reference=${reference}`;

    // Create payment record first (PENDING)
    await createPaymentRecord({
      userId: session.userId,
      packageId: pkg.id,
      reference,
      amount: pkg.price,
      currency: pkg.currency,
      provider,
    });

    // If demo mode (no real keys), return mock URL
    if (!process.env.PAYSTACK_SECRET_KEY && !process.env.FLUTTERWAVE_SECRET_KEY) {
      return NextResponse.json({
        authorizationUrl: `/checkout/demo?package=${pkg.slug}&reference=${reference}`,
        reference,
        provider,
        demo: true,
      });
    }

    const paymentProvider = getProvider(provider);
    const result = await paymentProvider.initialize({
      userId: session.userId,
      packageId: pkg.id,
      packageName: pkg.name,
      amount: pkg.price,
      currency: pkg.currency,
      email: session.email,
      callbackUrl,
      reference,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Payment Initialize]", error);
    return NextResponse.json({ error: "Payment initialization failed." }, { status: 500 });
  }
}
