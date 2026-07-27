"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, XCircle, Loader2, Eye, ExternalLink } from "lucide-react";
import Image from "next/image";

interface PaymentRecord {
  id: string;
  reference: string;
  memberName: string;
  memberEmail?: string;
  packageName: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  bankProofUrl?: string;
  createdAt: string;
}

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setPayments(json.payments || []);
        }
      }
    } catch (err) {
      console.error("[AdminPayments] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleReview = async (id: string, action: "approve" | "reject") => {
    const confirmMsg = action === "approve"
      ? "Are you sure you want to approve this payment and activate the member's subscription?"
      : "Are you sure you want to reject this payment?";

    if (!confirm(confirmMsg)) return;

    setReviewingId(id);
    try {
      const res = await fetch(`/api/admin/payments/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        fetchPayments();
      } else {
        alert("Failed to review payment.");
      }
    } catch (err) {
      console.error("[AdminPayments] review error:", err);
    } finally {
      setReviewingId(null);
    }
  };

  const filtered = payments.filter(
    (tx) => filterStatus === "ALL" || tx.status.toUpperCase() === filterStatus.toUpperCase()
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Payment Gateway & Bank Audit Logs</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Server-verified Paystack &amp; Flutterwave transactions, plus manual bank transfer approvals.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {["ALL", "PENDING_REVIEW", "SUCCESSFUL", "PENDING", "REJECTED", "FAILED"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-colors ${
                  filterStatus === s ? "bg-[#7b1d2a] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s === "PENDING_REVIEW" ? "Pending Review ⏳" : s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-200 self-start sm:self-auto">
            <ShieldCheck size={16} /> PostgreSQL Audit Mode
          </div>
        </div>

        {/* Payment Records Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center gap-2 text-gray-500 font-sans text-xs">
              <Loader2 size={18} className="animate-spin text-[#7b1d2a]" />
              Loading real transaction records...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs font-sans">
              No transactions match the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-gray-50 uppercase text-[11px] font-bold text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3">Reference</th>
                    <th className="px-5 py-3">Member</th>
                    <th className="px-5 py-3">Package</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Provider</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4 font-mono font-bold text-[#1a1a1a]">{tx.reference}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-800">{tx.memberName}</p>
                        <p className="text-[10px] text-gray-400">{tx.memberEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-700">{tx.packageName}</td>
                      <td className="px-5 py-4 font-bold text-[#7b1d2a]">{formatNGN(tx.amount)}</td>
                      <td className="px-5 py-4 text-gray-500 uppercase font-semibold">{tx.provider}</td>
                      <td className="px-5 py-4 text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "2-digit",
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`font-bold px-2.5 py-1 rounded-full text-[10px] ${
                            tx.status === "SUCCESSFUL"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "PENDING_REVIEW"
                              ? "bg-amber-100 text-amber-800"
                              : tx.status === "REJECTED" || tx.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        {tx.bankProofUrl && (
                          <button
                            onClick={() => setSelectedProof(tx.bankProofUrl!)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-[11px] font-bold"
                            title="View Receipt"
                          >
                            <Eye size={14} /> Receipt
                          </button>
                        )}

                        {tx.status === "PENDING_REVIEW" && (
                          <>
                            <button
                              disabled={reviewingId === tx.id}
                              onClick={() => handleReview(tx.id, "approve")}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[11px] font-bold inline-flex items-center gap-1"
                            >
                              {reviewingId === tx.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                              Approve
                            </button>
                            <button
                              disabled={reviewingId === tx.id}
                              onClick={() => handleReview(tx.id, "reject")}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold inline-flex items-center gap-1"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Proof Preview Modal */}
        {selectedProof && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#1a1a1a]">Bank Transfer Proof</h3>
                <button
                  onClick={() => setSelectedProof(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden border">
                <Image src={selectedProof} alt="Bank transfer receipt" fill className="object-contain" />
              </div>

              <div className="flex justify-end gap-2">
                <a
                  href={selectedProof}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-sans text-xs font-bold rounded-lg inline-flex items-center gap-1"
                >
                  Open Full Image <ExternalLink size={12} />
                </a>
                <button
                  onClick={() => setSelectedProof(null)}
                  className="px-4 py-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold rounded-lg hover:bg-[#5c1520]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
