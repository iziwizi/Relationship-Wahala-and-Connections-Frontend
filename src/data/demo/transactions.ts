// Demo Transactions Schema & Data
// IMPORTANT ARCHITECTURE NOTICE: Production payment confirmations must ALWAYS come from backend gateway webhooks / API verification.

export interface Transaction {
  reference: string;
  packageId: string;
  packageName: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: string;
  status: "Successful" | "Pending" | "Failed";
}

export const demoTransactions: Transaction[] = [
  {
    reference: "RWC-TX-2026-90412",
    packageId: "pkg-basic",
    packageName: "Standard Matchmaking Package",
    amount: 45000,
    currency: "NGN",
    date: "2026-06-15",
    paymentMethod: "Online Card Payment (Paystack/Flutterwave)",
    status: "Successful",
  },
  {
    reference: "RWC-TX-2026-78105",
    packageId: "pkg-basic",
    packageName: "Standard Matchmaking Package",
    amount: 45000,
    currency: "NGN",
    date: "2026-05-15",
    paymentMethod: "Online Card Payment",
    status: "Successful",
  },
];
