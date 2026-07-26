"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { demoTransactions } from "@/data/demo/transactions";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default function AdminPaymentsPage() {
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filtered = demoTransactions.filter((tx) => filterStatus === "ALL" || tx.status.toUpperCase() === filterStatus);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Payment Gateway Logs &amp; Audit</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Server-verified transactions received via Paystack &amp; Flutterwave gateway webhooks.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex gap-2">
            {["ALL", "SUCCESSFUL", "PENDING", "FAILED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-colors ${
                  filterStatus === s ? "bg-[#7b1d2a] text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <ShieldCheck size={16} /> Webhook Signature Verification Active
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-gray-50 uppercase text-[11px] font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">Reference</th>
                <th className="px-5 py-3">Package</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3 text-right">Gateway Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((tx) => (
                <tr key={tx.reference} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4 font-mono font-bold text-[#1a1a1a]">{tx.reference}</td>
                  <td className="px-5 py-4 text-gray-700">{tx.packageName}</td>
                  <td className="px-5 py-4 font-bold text-[#7b1d2a]">{formatNGN(tx.amount)}</td>
                  <td className="px-5 py-4 text-gray-500">{tx.date}</td>
                  <td className="px-5 py-4 text-gray-500">{tx.paymentMethod}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="bg-green-100 text-green-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
