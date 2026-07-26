// src/lib/payments/interface.ts
// Payment provider abstraction interface
// All providers implement this contract

export interface InitializePaymentInput {
  userId: string;
  packageId: string;
  packageName: string;
  amount: number; // in kobo/lowest currency unit for Paystack, pesewas for Flutterwave
  currency: string;
  email: string;
  callbackUrl: string;
  reference: string;
}

export interface InitializePaymentResult {
  authorizationUrl: string; // URL to redirect user to
  reference: string;
  provider: string;
}

export interface VerifyPaymentResult {
  reference: string;
  status: "success" | "failed" | "pending" | "abandoned";
  amount: number; // in lowest unit
  currency: string;
  providerTransactionId?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentProvider {
  name: string;
  initialize(input: InitializePaymentInput): Promise<InitializePaymentResult>;
  verify(reference: string): Promise<VerifyPaymentResult>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}
