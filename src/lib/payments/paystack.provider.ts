// src/lib/payments/paystack.provider.ts
// Paystack payment provider implementation
// SECRET KEY MUST REMAIN SERVER-SIDE ONLY — never exposed to browser

import crypto from "crypto";
import type { PaymentProvider, InitializePaymentInput, InitializePaymentResult, VerifyPaymentResult } from "./interface";

const PAYSTACK_BASE = "https://api.paystack.co";

class PaystackProvider implements PaymentProvider {
  name = "PAYSTACK";

  private get secretKey(): string {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
    return key;
  }

  async initialize(input: InitializePaymentInput): Promise<InitializePaymentResult> {
    const amountKobo = Math.round(input.amount * 100); // NGN → kobo

    const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: amountKobo,
        currency: input.currency,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: {
          userId: input.userId,
          packageId: input.packageId,
          packageName: input.packageName,
        },
      }),
    });

    const data = await response.json() as { status: boolean; data?: { authorization_url: string; reference: string } };

    if (!data.status || !data.data) {
      throw new Error("Paystack initialization failed.");
    }

    return {
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      provider: this.name,
    };
  }

  async verify(reference: string): Promise<VerifyPaymentResult> {
    const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${this.secretKey}` },
    });

    const data = await response.json() as {
      status: boolean;
      data?: {
        status: string;
        amount: number;
        currency: string;
        reference: string;
        id: string;
        metadata?: Record<string, unknown>;
      };
    };

    if (!data.status || !data.data) {
      return { reference, status: "failed", amount: 0, currency: "NGN" };
    }

    const tx = data.data;

    return {
      reference: tx.reference,
      status: tx.status === "success" ? "success" : tx.status === "abandoned" ? "abandoned" : "failed",
      amount: tx.amount, // kobo
      currency: tx.currency,
      providerTransactionId: String(tx.id),
      metadata: tx.metadata,
    };
  }

  verifyWebhookSignature(payload: string, signature: string): boolean {
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY || "";
    const hash = crypto.createHmac("sha512", secret).update(payload).digest("hex");
    return hash === signature;
  }
}

export const paystackProvider = new PaystackProvider();
