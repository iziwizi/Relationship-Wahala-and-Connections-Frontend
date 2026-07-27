"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Info, Shield, Loader2, CreditCard, Building2 } from "lucide-react";

interface Payment {
  id: string;
  reference: string;
  packageName: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  createdAt: string;
}

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

function statusClass(status: string) {
  switch (status) {
    case "SUCCESSFUL": return "bg-green-100 text-green-700";
    case "PENDING": return "bg-yellow-100 text-yellow-700";
    case "PENDING_REVIEW": return "bg-blue-100 text-blue-700";
    case "FAILED": return "bg-red-100 text-red-700";
    case "CANCELLED": return "bg-gray-100 text-gray-600";
    default: return "bg-gray-100 text-gray-600";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "SUCCESSFUL": return "Successful";
    case "PENDING": return "Pending";
    case "PENDING_REVIEW": return "Pending Review";
    case "FAILED": return "Failed";
    case "CANCELLED": return "Cancelled";
    default: return status;
  }
}

function providerLabel(provider: string) {
  switch (provider) {
    case "PAYSTACK": return "Paystack";
    case "FLUTTERWAVE": return "Flutterwave";
    case "BANK_TRANSFER": return "Bank Transfer";
    default: return provider;
  }
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/user/payments");
        const data = await res.json();
        if (res.ok && data.success) {
          setPayments(data.payments);
        } else {
          setError(data.error || "Failed to load payment history.");
        }
      } catch (err) {
        console.error("[PaymentsPage] fetch error:", err);
        setError("Network error loading payments.");
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Payments</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            View your verified payment history and transaction records.
          </p>
        </div>

        {/* Security notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-sans text-xs font-bold text-amber-800 mb-0.5">Secure Payment Records</p>
            <p className="font-sans text-xs text-amber-700">
              All transactions below are verified against our secure payment gateway. Payments are confirmed via backend webhooks before features are unlocked.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0e8dc]">
            <h2 className="font-serif text-base font-bold text-[#1a1a1a]">Transaction History</h2>
          </div>

          {loading && (
            <div className="p-12 flex items-center justify-center gap-2 text-gray-400">
              <Loader2 size={20} className="animate-spin text-[#7b1d2a]" />
              <span className="font-sans text-sm">Loading transactions...</span>
            </div>
          )}

          {error && !loading && (
            <div className="p-10 text-center">
              <p className="font-sans text-sm text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && payments.length === 0 && (
            <div className="p-12 text-center">
              <CreditCard size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="font-sans text-sm text-gray-500">No payment transactions found.</p>
              <p className="font-sans text-xs text-gray-400 mt-1">
                Transactions will appear here after you subscribe to a plan.
              </p>
            </div>
          )}

          {!loading && !error && payments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fbf5ec]">
                  <tr>
                    {["Reference", "Package", "Amount", "Date", "Method", "Status"].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left font-sans text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0e8dc]">
                  {payments.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#fbf5ec]/50 transition-colors">
                      <td className="px-5 py-4 font-sans text-xs text-gray-700 font-mono whitespace-nowrap">
                        {tx.reference}
                      </td>
                      <td className="px-5 py-4 font-sans text-xs text-gray-700 whitespace-nowrap max-w-[160px] truncate">
                        {tx.packageName}
                      </td>
                      <td className="px-5 py-4 font-sans text-sm font-bold text-[#7b1d2a] whitespace-nowrap">
                        {formatNGN(tx.amount)}
                      </td>
                      <td className="px-5 py-4 font-sans text-xs text-gray-500 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 font-sans text-xs text-gray-500 whitespace-nowrap">
                        {providerLabel(tx.provider)}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center font-sans text-[11px] font-bold px-2.5 py-1 rounded-full ${statusClass(tx.status)}`}>
                          {statusLabel(tx.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
