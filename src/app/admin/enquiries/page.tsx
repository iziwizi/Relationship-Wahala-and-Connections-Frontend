"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";


interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  date: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
}

const mockEnquiries: EnquiryItem[] = [
  { id: "e-1", name: "Bisi Adebayo", email: "bisi@example.com", phone: "+234 803 111 2222", category: "EPMS", message: "I would like to schedule a private EPMS consultation for myself and my brother.", date: "2026-07-25", status: "NEW" },
  { id: "e-2", name: "Chidi Nnamdi", email: "chidi@example.com", phone: "+234 805 333 4444", category: "Pre-Marital Counseling", message: "My fiancée and I want to book 4 pre-marital counseling sessions before our wedding in December.", date: "2026-07-24", status: "IN_PROGRESS" },
  { id: "e-3", name: "Aisha Mohammed", email: "aisha@example.com", phone: "+234 802 555 6666", category: "Matchmaking", message: "Interested in your Global Diaspora VIP package. Please reach out.", date: "2026-07-23", status: "RESOLVED" },
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(mockEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(mockEnquiries[0]);

  const updateStatus = (id: string, status: EnquiryItem["status"]) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Contact Enquiries &amp; Support</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Review incoming member messages, service requests, and update support workflow status.
          </p>
        </div>

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
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    e.status === "NEW" ? "bg-red-100 text-red-700" :
                    e.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {e.status}
                  </span>
                </div>
                <p className="font-sans text-xs font-semibold text-[#7b1d2a]">{e.category}</p>
                <p className="font-sans text-xs text-gray-500 line-clamp-1 mt-1">{e.message}</p>
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
                    <p className="font-sans text-xs text-gray-500">{selectedEnquiry.email} · {selectedEnquiry.phone}</p>
                    <p className="font-sans text-xs text-[#7b1d2a] font-bold mt-1">Category: {selectedEnquiry.category}</p>
                  </div>
                  <span className="font-sans text-xs text-gray-400">{selectedEnquiry.date}</span>
                </div>

                <div>
                  <h3 className="font-serif text-sm font-bold text-gray-700 mb-2">Enquiry Message</h3>
                  <div className="bg-gray-50 p-4 rounded-xl font-sans text-xs text-gray-800 leading-relaxed">
                    {selectedEnquiry.message}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="font-sans text-xs text-gray-500 font-semibold">Workflow Actions:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedEnquiry.id, "IN_PROGRESS")}
                      className="bg-yellow-600 text-white font-sans text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-yellow-700"
                    >
                      Set In Progress
                    </button>
                    <button
                      onClick={() => updateStatus(selectedEnquiry.id, "RESOLVED")}
                      className="bg-green-600 text-white font-sans text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-700"
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
      </div>
    </AdminLayout>
  );
}
