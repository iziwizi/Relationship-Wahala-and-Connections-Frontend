"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Search } from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "SUPER_ADMIN";
  subscription: string;
  status: "ACTIVE" | "SUSPENDED";
  verified: boolean;
  registeredDate: string;
}

const mockUsers: UserRecord[] = [
  { id: "u-101", name: "Daniel Okonkwo", email: "demo@relationshipwahala.com", role: "MEMBER", subscription: "Standard Matchmaking", status: "ACTIVE", verified: true, registeredDate: "2026-06-15" },
  { id: "u-102", name: "Amara Nwosu", email: "amara@example.com", role: "MEMBER", subscription: "Standard Matchmaking", status: "ACTIVE", verified: true, registeredDate: "2026-07-20" },
  { id: "u-103", name: "Zainab Bello", email: "zainab@example.com", role: "MEMBER", subscription: "EPMS Premium", status: "ACTIVE", verified: true, registeredDate: "2026-07-18" },
  { id: "u-104", name: "Dr. Chioma Eke", email: "chioma@example.com", role: "MEMBER", subscription: "Global VIP", status: "ACTIVE", verified: true, registeredDate: "2026-07-10" },
  { id: "u-105", name: "Super Admin", email: "admin@relationshipwahala.com", role: "SUPER_ADMIN", subscription: "N/A System", status: "ACTIVE", verified: true, registeredDate: "2026-01-01" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(mockUsers);
  const [search, setSearch] = useState("");

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" } : u))
    );
  };

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">User Management</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">View, search, and manage registered members and account statuses.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-gray-50 uppercase text-[11px] font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3">Member</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Active Subscription</th>
                <th className="px-5 py-3">Registered Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#1a1a1a]">{u.name}</p>
                    <p className="text-gray-400 text-[11px]">{u.email}</p>
                  </td>
                  <td className="px-5 py-4 font-bold text-[#7b1d2a]">{u.role}</td>
                  <td className="px-5 py-4 text-gray-700">{u.subscription}</td>
                  <td className="px-5 py-4 text-gray-500">{u.registeredDate}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${u.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {u.role !== "SUPER_ADMIN" && (
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`px-3 py-1.5 rounded text-[11px] font-bold text-white transition-colors ${
                          u.status === "ACTIVE" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        {u.status === "ACTIVE" ? "Suspend Member" : "Reactivate Member"}
                      </button>
                    )}
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
