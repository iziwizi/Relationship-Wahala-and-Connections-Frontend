"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Search, Loader2, RefreshCw, CheckCircle2, XCircle, Crown } from "lucide-react";

interface UserRecord {
  id: string;
  email: string;
  role: "MEMBER" | "SUPER_ADMIN";
  isActive: boolean;
  createdAt: string;
  profile: { firstName: string; lastName: string; status: string } | null;
  activeSubscription: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => { if (data?.users) setUsers(data.users); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleToggleStatus = async (user: UserRecord) => {
    if (user.role === "SUPER_ADMIN") return;
    const action = user.isActive ? "suspend" : "reactivate";
    setActionInProgress(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers((prev) =>
          prev.map((u) => u.id === user.id ? { ...u, isActive: data.isActive } : u)
        );
        showToast(`Member ${action === "suspend" ? "suspended" : "reactivated"} successfully.`);
      } else {
        showToast(data.error || "Action failed. Please try again.", "error");
      }
    } catch {
      showToast("Network error. Please try again.", "error");
    } finally {
      setActionInProgress(null);
    }
  };

  const filtered = users.filter((u) => {
    const name = u.profile ? `${u.profile.firstName} ${u.profile.lastName}` : "";
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const displayName = (u: UserRecord) =>
    u.profile ? `${u.profile.firstName} ${u.profile.lastName}`.trim() : "(No Profile)";

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 z-[999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg font-sans text-sm text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {toast.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {toast.message}
          </div>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">User Management</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">
              {loading ? "Loading..." : `${users.length} account${users.length !== 1 ? "s" : ""} in database — PostgreSQL`}
            </p>
          </div>
          <button onClick={loadUsers} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-lg font-sans text-xs text-gray-600 hover:bg-gray-200">
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 flex items-center justify-center gap-2 text-gray-500 font-sans text-xs">
            <Loader2 size={18} className="animate-spin text-[#7b1d2a]" /> Loading from PostgreSQL...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="font-sans text-sm text-gray-500">
              {users.length === 0 ? "No users found." : "No users match your search."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Member</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide hidden md:table-cell">Subscription</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {user.role === "SUPER_ADMIN" && <Crown size={11} className="text-[#c9962c]" />}
                        <div>
                          <p className="font-semibold text-[#1a1a1a]">{displayName(user)}</p>
                          <p className="text-gray-400 text-[10px]">
                            {user.role === "SUPER_ADMIN"
                              ? "Super Admin"
                              : user.profile?.status || "No Profile"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{user.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                      {user.activeSubscription || (
                        <span className="italic text-gray-400">No Active Subscription</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {user.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user.role !== "SUPER_ADMIN" ? (
                        <button
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionInProgress === user.id}
                          className={`px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold flex items-center gap-1 ml-auto ${
                            user.isActive
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          } disabled:opacity-50`}
                        >
                          {actionInProgress === user.id ? (
                            <Loader2 size={11} className="animate-spin" />
                          ) : user.isActive ? (
                            <XCircle size={11} />
                          ) : (
                            <CheckCircle2 size={11} />
                          )}
                          {user.isActive ? "Suspend Member" : "Reactivate Member"}
                        </button>
                      ) : (
                        <span className="text-gray-300 text-[10px] italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
