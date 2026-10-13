"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { demoPackages, MatchmakingPackage } from "@/data/demo/packages";
import {
  CreditCard, Building2, Smartphone, CheckCircle2, ArrowLeft,
  Lock, ShieldCheck, AlertCircle, Loader2, Copy, CheckCheck
} from "lucide-react";
import Button from "@/components/ui/Button";

type PaymentMethod = "PAYSTACK" | "FLUTTERWAVE" | "BANK_TRANSFER";

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
}

const DEMO_BANK: BankDetails = {
  bankName: "First Bank of Nigeria",
  accountName: "Relationship Wahala and Connections Services",
  accountNumber: "2049581735",
  instructions: "Please include your full name and email in the transfer narration.",
};

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.packageId as string;

  const [pkg, setPkg] = useState<MatchmakingPackage | null>(
    demoPackages.find((p) => p.slug === slug) ?? null
  );
  const [bankDetails, setBankDetails] = useState<BankDetails>(DEMO_BANK);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [bankTransferRef, setBankTransferRef] = useState("");
  const [senderName, setSenderName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    async function loadLivePackage() {
      try {
        const res = await fetch("/api/admin/packages");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.packages) {
            const found = json.packages.find((p: MatchmakingPackage) => p.slug === slug || p.id === slug);
            if (found) setPkg(found);
          }
        }
      } catch (err) {
        console.error("Failed to load live package for checkout:", err);
      }
    }
    loadLivePackage();
  }, [slug]);

  React.useEffect(() => {
    async function loadLiveBankDetails() {
      try {
        const res = await fetch("/api/public/bank-details");
        if (res.ok) {
          const data = await res.json();
          if (data.bankName && data.accountNumber) {
            setBankDetails({
              bankName: data.bankName,
              accountName: data.accountName,
              accountNumber: data.accountNumber,
              instructions: data.instructions || DEMO_BANK.instructions,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load live bank details for checkout:", err);
      }
    }
    loadLiveBankDetails();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOnlinePayment = async (method: "PAYSTACK" | "FLUTTERWAVE") => {
    if (!pkg) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id, provider: method }),
      });
      const data = await res.json() as { authorizationUrl?: string; error?: string; demo?: boolean };

      if (!res.ok || data.error) {
        setError(data.error || "Payment initialization failed. Please try again.");
        return;
      }

      if (data.demo) {
        // Demo mode simulation
        setTimeout(() => {
          router.push("/dashboard/subscription?payment=demo_success");
        }, 1500);
        return;
      }

      window.location.assign(data.authorizationUrl!);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    if (!pkg) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/bank-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
          transferReference: bankTransferRef,
          senderName,
        }),
      });
      const data = await res.json() as { success?: boolean; error?: string };

      if (!res.ok || data.error) {
        setError(data.error || "Submission failed. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) {
    return (
      <div className="min-h-screen bg-[#fbf5ec] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3">Package Not Found</h1>
          <Link href="/pricing" className="text-[#7b1d2a] text-sm font-semibold underline">View Available Packages</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fbf5ec] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-10 max-w-md w-full text-center">
          <CheckCircle2 size={56} className="text-green-600 mx-auto mb-5" />
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3">Transfer Submitted!</h1>
          <p className="font-sans text-sm text-gray-600 mb-6">
            Our team will verify your bank transfer within 24 hours and activate your subscription.
            You will receive a notification once confirmed.
          </p>
          <Button href="/dashboard" variant="primary" size="lg" className="w-full justify-center">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf5ec] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/pricing" className="flex items-center gap-2 text-[#7b1d2a] font-sans text-sm font-semibold hover:opacity-80">
            <ArrowLeft size={16} /> Back to Packages
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-12 h-12">
                  <Image src="/images/logo.jpeg" alt="RWC Logo" fill className="object-contain rounded-md" />
                </div>
                <div>
                  <p className="font-serif font-bold text-[#1a1a1a] text-sm">Relationship Wahala</p>
                  <p className="font-sans text-xs text-[#c9962c] font-semibold">& Connections</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-3">
                <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">{pkg.name}</h2>
                <p className="font-sans text-xs text-gray-500">{pkg.description}</p>

                <div className="mt-4 space-y-2">
                  {pkg.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-[#7b1d2a] flex-shrink-0 mt-0.5" />
                      <p className="font-sans text-xs text-gray-700">{f}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-bold text-gray-700">Total</span>
                  <span className="font-serif text-2xl font-bold text-[#7b1d2a]">{formatNGN(pkg.price)}</span>
                </div>
                <p className="font-sans text-xs text-gray-400 mt-1">{pkg.durationDays} day membership · {pkg.currency}</p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 font-sans">
                <Lock size={14} />
                <span>256-bit SSL secured checkout</span>
              </div>
            </div>
          </div>

          {/* Right — Payment Methods */}
          <div className="lg:col-span-3 space-y-5">
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Choose Payment Method</h1>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                <p className="font-sans text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Paystack */}
            <div
              onClick={() => setSelectedMethod("PAYSTACK")}
              className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                selectedMethod === "PAYSTACK" ? "border-[#7b1d2a] shadow-md" : "border-gray-200 hover:border-[#7b1d2a]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00c3f7]/10 rounded-xl flex items-center justify-center">
                    <CreditCard size={20} className="text-[#00c3f7]" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-bold text-[#1a1a1a]">Paystack</p>
                    <p className="font-sans text-xs text-gray-500">Card · Bank Transfer · USSD · Pay with Bank</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "PAYSTACK" ? "border-[#7b1d2a] bg-[#7b1d2a]" : "border-gray-300"
                }`}>
                  {selectedMethod === "PAYSTACK" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              {selectedMethod === "PAYSTACK" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => handleOnlinePayment("PAYSTACK")}
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full justify-center"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : `Pay ${formatNGN(pkg.price)} with Paystack`}
                  </Button>
                </div>
              )}
            </div>

            {/* Flutterwave */}
            <div
              onClick={() => setSelectedMethod("FLUTTERWAVE")}
              className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                selectedMethod === "FLUTTERWAVE" ? "border-[#7b1d2a] shadow-md" : "border-gray-200 hover:border-[#7b1d2a]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Smartphone size={20} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-bold text-[#1a1a1a]">Flutterwave</p>
                    <p className="font-sans text-xs text-gray-500">Card · Mobile Money · Bank · USSD</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "FLUTTERWAVE" ? "border-[#7b1d2a] bg-[#7b1d2a]" : "border-gray-300"
                }`}>
                  {selectedMethod === "FLUTTERWAVE" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              {selectedMethod === "FLUTTERWAVE" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => handleOnlinePayment("FLUTTERWAVE")}
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full justify-center"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : `Pay ${formatNGN(pkg.price)} with Flutterwave`}
                  </Button>
                </div>
              )}
            </div>

            {/* Bank Transfer */}
            <div
              onClick={() => setSelectedMethod("BANK_TRANSFER")}
              className={`bg-white rounded-2xl border-2 p-5 cursor-pointer transition-all ${
                selectedMethod === "BANK_TRANSFER" ? "border-[#7b1d2a] shadow-md" : "border-gray-200 hover:border-[#7b1d2a]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#7b1d2a]/10 rounded-xl flex items-center justify-center">
                    <Building2 size={20} className="text-[#7b1d2a]" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-bold text-[#1a1a1a]">Bank Transfer</p>
                    <p className="font-sans text-xs text-gray-500">Direct bank transfer · Manual verification (24hrs)</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "BANK_TRANSFER" ? "border-[#7b1d2a] bg-[#7b1d2a]" : "border-gray-300"
                }`}>
                  {selectedMethod === "BANK_TRANSFER" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>

              {selectedMethod === "BANK_TRANSFER" && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                  {/* Bank Details */}
                  <div className="bg-[#fbf5ec] rounded-xl p-4 space-y-2.5">
                    <p className="font-sans text-xs font-bold text-gray-600 uppercase tracking-wider">Transfer Details</p>
                    {[
                      { label: "Bank Name", value: bankDetails.bankName },
                      { label: "Account Name", value: bankDetails.accountName },
                      { label: "Account Number", value: bankDetails.accountNumber },
                      { label: "Amount", value: formatNGN(pkg.price) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="font-sans text-xs text-gray-500">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-bold text-[#1a1a1a]">{value}</span>
                          <button onClick={() => copyToClipboard(value)} className="text-gray-400 hover:text-[#7b1d2a]">
                            {copied ? <CheckCheck size={12} className="text-green-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="font-sans text-xs text-gray-500">{bankDetails.instructions}</p>

                  <input
                    type="text"
                    placeholder="Your Full Name (as it appears on transfer)"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                  />
                  <input
                    type="text"
                    placeholder="Bank Transfer Reference / Session ID (optional)"
                    value={bankTransferRef}
                    onChange={(e) => setBankTransferRef(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                  />

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <p className="font-sans text-xs text-yellow-800">
                      ⚠️ Your subscription will only be activated after our team manually verifies your transfer (within 24 hours). Do not submit multiple times.
                    </p>
                  </div>

                  <Button
                    onClick={handleBankTransfer}
                    variant="primary"
                    size="lg"
                    disabled={loading || !senderName.trim()}
                    className="w-full justify-center"
                  >
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "I Have Made the Transfer"}
                  </Button>
                </div>
              )}
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-sans">
              <ShieldCheck size={14} className="text-[#c9962c]" />
              <span>100% secure payment processing. Your financial data is never stored on our servers.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
