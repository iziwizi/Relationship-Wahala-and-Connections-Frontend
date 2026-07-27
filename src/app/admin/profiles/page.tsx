"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Search, Loader2 } from "lucide-react";

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

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<AdminProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profiles");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setProfiles(json.profiles);
        }
      }
    } catch (err) {
      console.error("Failed to fetch profiles:", err);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id: string, newStatus: AdminProfileItem["status"]) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/profiles/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setProfiles((prev) =>
            prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
          );
          setToastMessage(`Profile successfully marked as ${newStatus}`);
          setTimeout(() => setToastMessage(null), 4000);
        }
      } else {
        alert("Failed to update profile status on server.");
      }
    } catch (err) {
      console.error("Error updating profile status:", err);
      alert("An error occurred while updating profile status.");
    } finally {
      setUpdatingId(null);
    }
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

        {toastMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-sans p-4 rounded-xl flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="font-bold text-green-700">✕</button>
          </div>
        )}

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
          {loading ? (
            <div className="p-12 flex items-center justify-center gap-2 text-gray-500 font-sans text-xs">
              <Loader2 size={18} className="animate-spin text-[#7b1d2a]" />
              Loading member profiles from database...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs font-sans">
              No profiles found matching the current criteria.
            </div>
          ) : (
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
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#1a1a1a]">{p.profession}</p>
                      <p className="text-gray-400 text-[11px]">{p.location}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{p.submittedAt}</td>
                    <td className="px-5 py-4">
                      {p.status === "VERIFIED" && (
                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          <ShieldCheck size={12} /> VERIFIED
                        </span>
                      )}
                      {p.status === "PENDING_VERIFICATION" && (
                        <span className="inline-flex items-center gap-1 text-yellow-800 bg-yellow-50 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          <AlertTriangle size={12} /> PENDING
                        </span>
                      )}
                      {p.status === "REJECTED" && (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          <XCircle size={12} /> REJECTED
                        </span>
                      )}
                      {p.status === "SUSPENDED" && (
                        <span className="inline-flex items-center gap-1 text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          SUSPENDED
                        </span>
                      )}
                      {p.status === "SUBMITTED" && (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full font-bold text-[10px]">
                          SUBMITTED
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {updatingId === p.id ? (
                        <span className="text-xs text-gray-400">Updating...</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {p.status !== "VERIFIED" && (
                            <button
                              onClick={() => updateStatus(p.id, "VERIFIED")}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-[11px]"
                            >
                              Approve
                            </button>
                          )}
                          {p.status !== "REJECTED" && (
                            <button
                              onClick={() => updateStatus(p.id, "REJECTED")}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-semibold text-[11px]"
                            >
                              Reject
                            </button>
                          )}
                          {p.status !== "SUSPENDED" && (
                            <button
                              onClick={() => updateStatus(p.id, "SUSPENDED")}
                              className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded font-semibold text-[11px]"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
