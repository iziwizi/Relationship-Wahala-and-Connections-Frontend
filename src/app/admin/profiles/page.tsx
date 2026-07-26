"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Search } from "lucide-react";

interface AdminProfileItem {
  id: string;
  name: string;
  email: string;
  age: number;
  location: string;
  profession: string;
  submittedAt: string;
  status: "DRAFT" | "SUBMITTED" | "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | "SUSPENDED";
}

const mockProfiles: AdminProfileItem[] = [
  { id: "prof-1", name: "Amara Nwosu", email: "amara@example.com", age: 29, location: "Lagos, Nigeria", profession: "Marketing Executive", submittedAt: "2026-07-25", status: "PENDING_VERIFICATION" },
  { id: "prof-2", name: "Zainab Bello", email: "zainab@example.com", age: 28, location: "Abuja, Nigeria", profession: "Legal Practitioner", submittedAt: "2026-07-24", status: "PENDING_VERIFICATION" },
  { id: "prof-3", name: "Dr. Chioma Eke", email: "chioma@example.com", age: 31, location: "Lagos, Nigeria", profession: "Consultant Physician", submittedAt: "2026-07-24", status: "VERIFIED" },
  { id: "prof-4", name: "Daniel Okonkwo", email: "demo@relationshipwahala.com", age: 32, location: "Lagos, Nigeria", profession: "Senior Technology Consultant", submittedAt: "2026-06-15", status: "VERIFIED" },
  { id: "prof-5", name: "Kemi Adeleke", email: "kemi@example.com", age: 30, location: "London, UK", profession: "Financial Analyst", submittedAt: "2026-07-23", status: "PENDING_VERIFICATION" },
];

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>(mockProfiles);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const updateStatus = (id: string, newStatus: AdminProfileItem["status"]) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const filtered = profiles.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Profile Verification &amp; Moderation</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Review member profiles, inspect background details, approve verified badges or reject incomplete profiles.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search member name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
            {["ALL", "PENDING_VERIFICATION", "VERIFIED", "REJECTED", "SUSPENDED"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-sans text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === st
                    ? "bg-[#7b1d2a] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-gray-50 uppercase text-[11px] font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Location &amp; Profession</th>
                <th className="px-5 py-3">Submitted Date</th>
                <th className="px-5 py-3">Verification Status</th>
                <th className="px-5 py-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#1a1a1a]">{p.name}, {p.age}</p>
                    <p className="text-gray-400 text-[11px]">{p.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    <p>{p.profession}</p>
                    <p className="text-gray-400 text-[11px]">{p.location}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{p.submittedAt}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.status === "VERIFIED"
                          ? "bg-green-100 text-green-800"
                          : p.status === "PENDING_VERIFICATION"
                          ? "bg-amber-100 text-amber-800"
                          : p.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.status === "VERIFIED" && <ShieldCheck size={12} />}
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status !== "VERIFIED" && (
                        <button
                          onClick={() => updateStatus(p.id, "VERIFIED")}
                          className="inline-flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle2 size={12} /> Approve
                        </button>
                      )}
                      {p.status !== "REJECTED" && (
                        <button
                          onClick={() => updateStatus(p.id, "REJECTED")}
                          className="inline-flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold hover:bg-red-700 transition-colors"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      )}
                      {p.status !== "SUSPENDED" && (
                        <button
                          onClick={() => updateStatus(p.id, "SUSPENDED")}
                          className="inline-flex items-center gap-1 bg-gray-600 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold hover:bg-gray-700 transition-colors"
                        >
                          <AlertTriangle size={12} /> Suspend
                        </button>
                      )}
                    </div>
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
