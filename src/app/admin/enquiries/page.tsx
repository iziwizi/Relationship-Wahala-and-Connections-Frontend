"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Loader2, RefreshCw, CheckCircle, XCircle, Send } from "lucide-react";

interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  category: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  notes: string | null;
  createdAt: string;
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [responseText, setResponseText] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const loadEnquiries = () => {
    setLoading(true);
    fetch("/api/admin/enquiries")
      .then((r) => r.json())
      .then((data) => {
        if (data?.enquiries) {
          setEnquiries(data.enquiries);
          if (data.enquiries.length > 0 && !selectedEnquiry) {
            setSelectedEnquiry(data.enquiries[0]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync responseText when selectedEnquiry changes
  useEffect(() => {
    setResponseText(selectedEnquiry?.notes || "");
  }, [selectedEnquiry?.id]);

  const updateStatus = async (id: string, status: EnquiryItem["status"]) => {
    setUpdatingStatus(id);
    try {
      const res = await fetch(`/api/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
        if (selectedEnquiry?.id === id) setSelectedEnquiry((prev) => prev ? { ...prev, status } : null);
        showToast("success", `Status updated to ${status.replace("_", " ")}.`);
      } else {
        showToast("error", "Failed to update status.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const sendResponse = async () => {
    if (!selectedEnquiry || !responseText.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: responseText, status: "RESOLVED" }),
      });
      if (res.ok) {
        const updated = { ...selectedEnquiry, notes: responseText, status: "RESOLVED" as const };
        setEnquiries((prev) => prev.map((e) => (e.id === selectedEnquiry.id ? updated : e)));
        setSelectedEnquiry(updated);
        showToast("success", "Response saved. Enquiry marked as Resolved.");
      } else {
        showToast("error", "Failed to save response.");
      }
    } catch {
      showToast("error", "Network error.");
    } finally {
      setSending(false);
    }
  };

  const statusColors: Record<string, string> = {
    NEW: "bg-red-100 text-red-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg font-sans text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {toast.msg}
          </div>
        )}

        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Contact Enquiries &amp; Support</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">
              Review incoming member messages, service requests, and update support workflow status.
            </p>
          </div>
          <button
            onClick={loadEnquiries}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg font-sans text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={28} className="animate-spin text-[#7b1d2a]" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="font-sans text-sm text-gray-500">No enquiries found in the database.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
              {enquiries.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEnquiry(e)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedEnquiry?.id === e.id ? "bg-[#7b1d2a]/5 border-l-4 border-[#7b1d2a]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-[#1a1a1a]">{e.name}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusColors[e.status] || "bg-gray-100 text-gray-600"}`}>
                      {e.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-sans text-xs font-semibold text-[#7b1d2a]">{e.category}</p>
                  <p className="font-sans text-xs text-gray-500 line-clamp-1 mt-1">{e.message}</p>
                  <p className="font-sans text-[10px] text-gray-400 mt-1">
                    {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </button>
              ))}
            </div>

            {/* Details */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              {selectedEnquiry ? (
                <div className="space-y-5">
                  <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-[#1a1a1a]">{selectedEnquiry.name}</h2>
                      <p className="font-sans text-xs text-gray-500">{selectedEnquiry.email}{selectedEnquiry.phone ? ` · ${selectedEnquiry.phone}` : ""}</p>
                      <p className="font-sans text-xs text-[#7b1d2a] font-bold mt-1">Category: {selectedEnquiry.category}</p>
                    </div>
                    <span className="font-sans text-xs text-gray-400">
                      {new Date(selectedEnquiry.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-sm font-bold text-gray-700 mb-2">Enquiry Message</h3>
                    <div className="bg-gray-50 p-4 rounded-xl font-sans text-xs text-gray-800 leading-relaxed">
                      {selectedEnquiry.message}
                    </div>
                  </div>

                  {/* Response Section */}
                  <div>
                    <h3 className="font-serif text-sm font-bold text-gray-700 mb-2">Admin Response / Notes</h3>
                    <textarea
                      rows={4}
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Write your response or internal notes here..."
                      className="w-full border border-gray-300 rounded-xl p-3 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                    />
                    <button
                      onClick={sendResponse}
                      disabled={sending || !responseText.trim()}
                      className="mt-2 flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#5c1520] transition-colors disabled:opacity-50"
                    >
                      {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      {sending ? "Saving..." : "Save Response & Mark Resolved"}
                    </button>
                  </div>

                  {/* Status Actions */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-sans text-xs text-gray-500 font-semibold">Update Status:</span>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => updateStatus(selectedEnquiry.id, "IN_PROGRESS")}
                        disabled={updatingStatus === selectedEnquiry.id || selectedEnquiry.status === "IN_PROGRESS"}
                        className="bg-yellow-600 text-white font-sans text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                      >
                        Set In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(selectedEnquiry.id, "RESOLVED")}
                        disabled={updatingStatus === selectedEnquiry.id || selectedEnquiry.status === "RESOLVED"}
                        className="bg-green-600 text-white font-sans text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="font-sans text-xs text-gray-400">Select an enquiry from the list to view details.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
