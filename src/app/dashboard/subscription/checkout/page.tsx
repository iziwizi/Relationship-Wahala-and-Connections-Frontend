"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import {
  Crown, CheckCircle2, ShieldCheck, ArrowLeft, CreditCard,
  Building2, Copy, Check, Loader2, AlertCircle, Sparkles
} from "lucide-react";
import MediaUploader from "@/components/ui/MediaUploader";

interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  matchAllowance: number;
  features: string[];
  isPopular: boolean;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
  paystackEnabled: boolean;
  flutterwaveEnabled: boolean;
}

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pkgId = searchParams.get("pkg");

  const [pkg, setPkg] = useState<PackageItem | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "First Bank of Nigeria",
    accountName: "Relationship Wahala & Connections Ltd",
    accountNumber: "3012345678",
    instructions: "Please include your full name in transfer narration.",
    paystackEnabled: false,
    flutterwaveEnabled: false,
  });
  const [loadingPkg, setLoadingPkg] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"PAYSTACK" | "FLUTTERWAVE" | "BANK_TRANSFER">("BANK_TRANSFER");
  
  // Bank transfer submission state
  const [transferRef, setTransferRef] = useState("");
  const [senderName, setSenderName] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [submittingBank, setSubmittingBank] = useState(false);
  const [bankSuccess, setBankSuccess] = useState(false);
  
  // Online payment init state
  const [initLoading, setInitLoading] = useState(false);
  const [gatewayMsg, setGatewayMsg] = useState<string | null>(null);

  // Copy state
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedName, setCopiedName] = useState(false);

  useEffect(() => {
    async function initData() {
      try {
        // Fetch public bank details
        const bankRes = await fetch("/api/public/bank-details");
        if (bankRes.ok) {
          const bData = await bankRes.json();
          setBankDetails(bData);
          if (bData.paystackEnabled) setPaymentMethod("PAYSTACK");
          else if (bData.flutterwaveEnabled) setPaymentMethod("FLUTTERWAVE");
          else setPaymentMethod("BANK_TRANSFER");
        }

        // Fetch package details
        if (pkgId) {
          const subRes = await fetch("/api/user/subscription");
          if (subRes.ok) {
            const sData = await subRes.json();
            if (sData.success && Array.isArray(sData.packages)) {
              const found = sData.packages.find((p: PackageItem) => p.id === pkgId);
              if (found) setPkg(found);
            }
          }
        }
      } catch (err) {
        console.error("[Checkout] Error loading initial data:", err);
      } finally {
        setLoadingPkg(false);
      }
    }
    initData();
  }, [pkgId]);

  const copyToClipboard = (text: string, type: "acc" | "name") => {
    navigator.clipboard.writeText(text);
    if (type === "acc") {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedName(true);
      setTimeout(() => setCopiedName(false), 2000);
    }
  };

  const handleOnlinePayment = async (provider: "PAYSTACK" | "FLUTTERWAVE") => {
    if (!pkg) return;
    setInitLoading(true);
    setGatewayMsg(null);

    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id, provider }),
      });

      const data = await res.json();

      if (res.ok && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        setGatewayMsg(data.error || "Online card payment is temporarily unavailable. Please choose Bank Transfer.");
      }
    } catch (err) {
      console.error("[Checkout] Payment init error:", err);
      setGatewayMsg("Online card payment is temporarily unavailable. Please choose Bank Transfer.");
    } finally {
      setInitLoading(false);
    }
  };

  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) return;
    setSubmittingBank(true);

    try {
      const res = await fetch("/api/payments/bank-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: pkg.id,
          transferReference: transferRef,
          senderName,
          bankProofUrl: proofUrl,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBankSuccess(true);
      } else {
        alert(data.error || "Failed to submit bank transfer notification.");
      }
    } catch (err) {
      console.error("[Checkout] Bank submit error:", err);
      alert("Error submitting bank transfer notification. Please try again.");
    } finally {
      setSubmittingBank(false);
    }
  };

  if (loadingPkg) {
    return (
      <DashboardLayout>
        <div className="py-20 flex items-center justify-center gap-2 text-gray-500 font-sans text-sm">
          <Loader2 size={20} className="animate-spin text-[#7b1d2a]" />
          Loading checkout session...
        </div>
      </DashboardLayout>
    );
  }

  if (!pkgId || !pkg) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto py-16 text-center space-y-4">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <h1 className="font-serif text-xl font-bold text-[#1a1a1a]">Package Not Found</h1>
          <p className="font-sans text-sm text-gray-500">
            The subscription package you selected could not be found or is no longer available.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/subscription"
              className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#5c1520] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Subscription Plans
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/subscription"
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Subscription Checkout</h1>
              <p className="font-sans text-xs text-gray-500">Complete your intentional matchmaking upgrade.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 font-bold">
            <ShieldCheck size={16} /> 256-Bit SSL Encrypted
          </div>
        </div>

        {bankSuccess ? (
          <div className="bg-white rounded-2xl border border-green-200 p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">Bank Transfer Submitted!</h2>
            <p className="font-sans text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Your payment notification for <strong className="text-[#7b1d2a]">{pkg.name}</strong> has been received. Our team will verify the transfer and activate your subscription within 24 hours.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                href="/dashboard/payments"
                className="bg-gray-100 text-gray-700 font-sans text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gray-200"
              >
                View Payment History
              </Link>
              <Link
                href="/dashboard"
                className="bg-[#7b1d2a] text-white font-sans text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#5c1520]"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Package Summary */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl border border-[#e8e0d4] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#c9962c]">
                  <Crown size={20} />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider">Selected Plan</span>
                </div>

                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">{pkg.name}</h3>
                  <p className="font-sans text-xs text-gray-500 mt-1 leading-relaxed">{pkg.description}</p>
                </div>

                <div className="bg-[#fbf5ec] p-4 rounded-xl">
                  <p className="font-serif text-2xl font-bold text-[#7b1d2a]">{formatNGN(pkg.price)}</p>
                  <p className="font-sans text-[11px] text-gray-500 mt-0.5">
                    Valid for {pkg.durationDays} days · Up to {pkg.matchAllowance} matches
                  </p>
                </div>

                <div>
                  <p className="font-sans text-xs font-bold text-gray-700 uppercase mb-2">Included Features:</p>
                  <ul className="space-y-2">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs font-sans text-gray-600">
                        <CheckCircle2 size={14} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Payment Options */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-[#e8e0d4] p-6 shadow-sm space-y-6">
                <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">Choose Payment Method</h2>

                {/* Method selector */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => { setPaymentMethod("PAYSTACK"); setGatewayMsg(null); }}
                    className={`p-4 rounded-xl border-2 text-left font-sans transition-all flex flex-col justify-between gap-2 ${
                      paymentMethod === "PAYSTACK"
                        ? "border-[#7b1d2a] bg-[#7b1d2a]/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard size={18} className={paymentMethod === "PAYSTACK" ? "text-[#7b1d2a]" : "text-gray-400"} />
                      {bankDetails.paystackEnabled && (
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1a1a1a]">Paystack</p>
                      <p className="text-[10px] text-gray-500">Debit Card / USSD / Bank</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPaymentMethod("FLUTTERWAVE"); setGatewayMsg(null); }}
                    className={`p-4 rounded-xl border-2 text-left font-sans transition-all flex flex-col justify-between gap-2 ${
                      paymentMethod === "FLUTTERWAVE"
                        ? "border-[#7b1d2a] bg-[#7b1d2a]/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard size={18} className={paymentMethod === "FLUTTERWAVE" ? "text-[#7b1d2a]" : "text-gray-400"} />
                      {bankDetails.flutterwaveEnabled && (
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1a1a1a]">Flutterwave</p>
                      <p className="text-[10px] text-gray-500">Cards / Mobile Money</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPaymentMethod("BANK_TRANSFER"); setGatewayMsg(null); }}
                    className={`p-4 rounded-xl border-2 text-left font-sans transition-all flex flex-col justify-between gap-2 ${
                      paymentMethod === "BANK_TRANSFER"
                        ? "border-[#7b1d2a] bg-[#7b1d2a]/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <Building2 size={18} className={paymentMethod === "BANK_TRANSFER" ? "text-[#7b1d2a]" : "text-gray-400"} />
                    <div>
                      <p className="text-xs font-bold text-[#1a1a1a]">Bank Transfer</p>
                      <p className="text-[10px] text-gray-500">Direct Bank Deposit</p>
                    </div>
                  </button>
                </div>

                {gatewayMsg && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 font-sans text-xs flex items-start gap-2">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-amber-600" />
                    <span>{gatewayMsg}</span>
                  </div>
                )}

                {/* Paystack Panel */}
                {paymentMethod === "PAYSTACK" && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-gray-50 rounded-xl text-xs font-sans text-gray-600 leading-relaxed">
                      You will be redirected securely to Paystack to complete your payment of <strong>{formatNGN(pkg.price)}</strong>.
                    </div>
                    <button
                      type="button"
                      disabled={initLoading}
                      onClick={() => handleOnlinePayment("PAYSTACK")}
                      className="w-full bg-[#7b1d2a] text-white font-sans text-sm font-bold py-3 rounded-xl hover:bg-[#5c1520] transition-colors flex items-center justify-center gap-2"
                    >
                      {initLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                      <span>Pay {formatNGN(pkg.price)} via Paystack</span>
                    </button>
                  </div>
                )}

                {/* Flutterwave Panel */}
                {paymentMethod === "FLUTTERWAVE" && (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 bg-gray-50 rounded-xl text-xs font-sans text-gray-600 leading-relaxed">
                      You will be redirected securely to Flutterwave to complete your payment of <strong>{formatNGN(pkg.price)}</strong>.
                    </div>
                    <button
                      type="button"
                      disabled={initLoading}
                      onClick={() => handleOnlinePayment("FLUTTERWAVE")}
                      className="w-full bg-[#7b1d2a] text-white font-sans text-sm font-bold py-3 rounded-xl hover:bg-[#5c1520] transition-colors flex items-center justify-center gap-2"
                    >
                      {initLoading ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
                      <span>Pay {formatNGN(pkg.price)} via Flutterwave</span>
                    </button>
                  </div>
                )}

                {/* Bank Transfer Panel */}
                {paymentMethod === "BANK_TRANSFER" && (
                  <div className="space-y-6 pt-2">
                    {/* Bank account details card */}
                    <div className="bg-[#fbf5ec] border border-[#e8e0d4] rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 text-[#7b1d2a]">
                        <Building2 size={18} />
                        <h3 className="font-serif font-bold text-sm">Official Bank Account Details</h3>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs font-sans">
                        <div className="bg-white p-3 rounded-xl border border-[#e8e0d4]">
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Bank Name</p>
                          <p className="font-bold text-[#1a1a1a] text-sm mt-0.5">{bankDetails.bankName}</p>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-[#e8e0d4] flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Account Number</p>
                            <p className="font-mono font-bold text-[#7b1d2a] text-base mt-0.5">{bankDetails.accountNumber}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bankDetails.accountNumber, "acc")}
                            className="p-2 text-gray-500 hover:text-[#7b1d2a] transition-colors"
                            title="Copy Account Number"
                          >
                            {copiedAcc ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                          </button>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-[#e8e0d4] sm:col-span-2 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Account Name</p>
                            <p className="font-bold text-[#1a1a1a] text-sm mt-0.5">{bankDetails.accountName}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(bankDetails.accountName, "name")}
                            className="p-2 text-gray-500 hover:text-[#7b1d2a] transition-colors"
                            title="Copy Account Name"
                          >
                            {copiedName ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>

                      {bankDetails.instructions && (
                        <p className="text-[11px] font-sans text-gray-600 leading-relaxed italic bg-white/60 p-3 rounded-xl">
                          💡 {bankDetails.instructions}
                        </p>
                      )}
                    </div>

                    {/* Bank transfer notification form */}
                    <form onSubmit={handleBankSubmit} className="space-y-4 border-t pt-4">
                      <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">Submit Transfer Evidence</h3>

                      <div className="grid sm:grid-cols-2 gap-4 text-xs font-sans">
                        <div>
                          <label className="block font-bold text-gray-700 uppercase mb-1">Payer / Sender Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="Full name on bank account"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#7b1d2a]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-gray-700 uppercase mb-1">Transfer Reference / Narration</label>
                          <input
                            type="text"
                            placeholder="e.g. Ref / Session ID"
                            value={transferRef}
                            onChange={(e) => setTransferRef(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#7b1d2a]"
                          />
                        </div>
                      </div>

                      <MediaUploader
                        value={proofUrl}
                        onChange={setProofUrl}
                        bucket="cms-media"
                        label="Upload Transfer Receipt / Screenshot"
                      />

                      <button
                        type="submit"
                        disabled={submittingBank}
                        className="w-full bg-[#7b1d2a] text-white font-sans text-sm font-bold py-3 rounded-xl hover:bg-[#5c1520] transition-colors flex items-center justify-center gap-2"
                      >
                        {submittingBank ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        <span>Submit Transfer Notification</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-sans text-gray-500">Loading checkout page...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
