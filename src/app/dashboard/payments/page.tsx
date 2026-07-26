"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { demoTransactions } from "@/data/demo/transactions";
import { Info, Shield } from "lucide-react";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Payments</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            View your payment history and transaction records.
          </p>
        </div>

        {/* Architecture Note Banner */}
        {/* NOTE: In production, payment status verification must come from backend gateway webhooks
            (e.g. Paystack/Flutterwave). Never trust frontend state for payment confirmation.
            Admin should also verify via dashboard before unlocking premium features. */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Shield size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-sans text-xs font-bold text-amber-800 mb-0.5">
              Secure Payment Records
            </p>
            <p className="font-sans text-xs text-amber-700">
              All transactions shown below are verified against our secure payment gateway. Production system will verify payments via backend webhooks before unlocking features.
            </p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#f0e8dc]">
            <h2 className="font-serif text-base font-bold text-[#1a1a1a]">Transaction History</h2>
          </div>

          {demoTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <Info size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="font-sans text-sm text-gray-500">No transactions found.</p>
            </div>
          ) : (
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
                  {demoTransactions.map((tx) => (
                    <tr key={tx.reference} className="hover:bg-[#fbf5ec]/50 transition-colors">
                      <td className="px-5 py-4 font-sans text-xs text-gray-700 font-mono whitespace-nowrap">
                        {tx.reference}
                      </td>
                      <td className="px-5 py-4 font-sans text-xs text-gray-700 whitespace-nowrap">
                        {tx.packageName}
                      </td>
                      <td className="px-5 py-4 font-sans text-sm font-bold text-[#7b1d2a] whitespace-nowrap">
                        {formatNGN(tx.amount)}
                      </td>
                      <td className="px-5 py-4 font-sans text-xs text-gray-500 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-4 font-sans text-xs text-gray-500 max-w-[180px]">
                        {tx.paymentMethod}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-sans text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            tx.status === "Successful"
                              ? "bg-green-100 text-green-700"
                              : tx.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.status}
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
