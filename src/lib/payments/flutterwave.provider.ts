// src/lib/payments/flutterwave.provider.ts
// Flutterwave payment provider implementation
// SECRET KEY MUST REMAIN SERVER-SIDE ONLY — never exposed to browser

import type { PaymentProvider, InitializePaymentInput, InitializePaymentResult, VerifyPaymentResult } from "./interface";

const FLW_BASE = "https://api.flutterwave.com/v3";

class FlutterwaveProvider implements PaymentProvider {
  name = "FLUTTERWAVE";

  private get secretKey(): string {
    const key = process.env.FLUTTERWAVE_SECRET_KEY;
    if (!key) throw new Error("FLUTTERWAVE_SECRET_KEY is not configured.");
    return key;
  }

  async initialize(input: InitializePaymentInput): Promise<InitializePaymentResult> {
    const response = await fetch(`${FLW_BASE}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: input.reference,
        amount: input.amount, // NGN (whole units for Flutterwave)
        currency: input.currency,
        redirect_url: input.callbackUrl,
        customer: { email: input.email },
        customizations: {
          title: "Relationship Wahala & Connections",
          description: `Subscription: ${input.packageName}`,
        },
        meta: {
          userId: input.userId,
          packageId: input.packageId,
        },
      }),
    });

    const data = await response.json() as { status: string; data?: { link: string } };

    if (data.status !== "success" || !data.data?.link) {
      throw new Error("Flutterwave initialization failed.");
    }

    return {
      authorizationUrl: data.data.link,
      reference: input.reference,
      provider: this.name,
    };
  }

  async verify(reference: string): Promise<VerifyPaymentResult> {
    // Flutterwave verifies by transaction ID or tx_ref
    const response = await fetch(
      `${FLW_BASE}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    );

    const data = await response.json() as {
      status: string;
      data?: {
        status: string;
        amount: number;
        currency: string;
        tx_ref: string;
        id: number;
      };
    };

    if (data.status !== "success" || !data.data) {
      return { reference, status: "failed", amount: 0, currency: "NGN" };
    }

    const tx = data.data;

    return {
      reference: tx.tx_ref,
      status: tx.status === "successful" ? "success" : "failed",
      amount: tx.amount,
      currency: tx.currency,
      providerTransactionId: String(tx.id),
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH || "";
    // Flutterwave uses verif-hash header (not HMAC) for basic webhook security
    return signature === secretHash;
  }
}

export const flutterwaveProvider = new FlutterwaveProvider();
