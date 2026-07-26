// src/lib/payments/registry.ts
// Central payment provider registry
// UI components and API routes use this to get the correct provider

import { paystackProvider } from "./paystack.provider";
import { flutterwaveProvider } from "./flutterwave.provider";
import type { PaymentProvider } from "./interface";

export type ProviderKey = "PAYSTACK" | "FLUTTERWAVE" | "BANK_TRANSFER";

export const paymentProviders: Record<Exclude<ProviderKey, "BANK_TRANSFER">, PaymentProvider> = {
  PAYSTACK: paystackProvider,
  FLUTTERWAVE: flutterwaveProvider,
};

export function getProvider(key: Exclude<ProviderKey, "BANK_TRANSFER">): PaymentProvider {
  const provider = paymentProviders[key];
  if (!provider) throw new Error(`Payment provider "${key}" is not registered.`);
  return provider;
}

// Returns enabled providers based on environment config
export function getEnabledProviders(): ProviderKey[] {
  const enabled: ProviderKey[] = [];
  if (process.env.PAYSTACK_SECRET_KEY) enabled.push("PAYSTACK");
  if (process.env.FLUTTERWAVE_SECRET_KEY) enabled.push("FLUTTERWAVE");
  // Bank transfer is always available unless explicitly disabled
  if (process.env.DISABLE_BANK_TRANSFER !== "true") enabled.push("BANK_TRANSFER");
  // In demo mode, show all options
  if (enabled.length === 0) return ["PAYSTACK", "FLUTTERWAVE", "BANK_TRANSFER"];
  return enabled;
}
