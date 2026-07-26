"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import Link from "next/link";
import {
  Users, UserCheck, CreditCard, Sparkles, AlertCircle, ArrowRight
} from "lucide-react";

const adminStats = [
  { label: "Total Members", value: "142", subtext: "+12% this month", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "New Registrations", value: "18", subtext: "Past 7 days", icon: Sparkles, color: "text-[#7b1d2a]", bg: "bg-[#7b1d2a]/10" },
  { label: "Pending Profile Verification", value: "4", subtext: "Requires review", icon: UserCheck, color: "text-[#c9962c]", bg: "bg-[#c9962c]/10" },
  { label: "Active Subscriptions", value: "64", subtext: "32 EPMS Premium", icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Successful Payments", value: "₦3,850,000", subtext: "Verified via gateway", icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
  { label: "Matchmaking Connections", value: "38", subtext: "Active introductions", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
];

const pendingProfiles = [
  { id: "prof-1", name: "Amara Nwosu", age: 29, location: "Lagos", profession: "Marketing Executive", dateSubmitted: "2026-07-25", status: "PENDING_VERIFICATION" },
  { id: "prof-2", name: "Zainab Bello", age: 28, location: "Abuja", profession: "Legal Practitioner", dateSubmitted: "2026-07-24", status: "PENDING_VERIFICATION" },
  { id: "prof-3", name: "Dr. Chioma Eke", age: 31, location: "Lagos", profession: "Consultant Physician", dateSubmitted: "2026-07-24", status: "PENDING_VERIFICATION" },
  { id: "prof-4", name: "Kemi Adeleke", age: 30, location: "London, UK", profession: "Financial Analyst", dateSubmitted: "2026-07-23", status: "PENDING_VERIFICATION" },
];

export default function AdminOverviewPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Admin Operations Overview</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">Platform management, verification queue, and matchmaking control center.</p>
        </div>

        {/* 6 Key Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {adminStats.map(({ label, value, subtext, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className="font-serif text-2xl font-bold text-[#1a1a1a]">{value}</p>
              <p className="font-sans text-xs font-semibold text-gray-800 mt-0.5">{label}</p>
              <p className="font-sans text-[11px] text-gray-400 mt-1">{subtext}</p>
            </div>
          ))}
        </div>

        {/* Pending Verification Queue */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-[#c9962c]" />
              <h2 className="font-serif text-base font-bold text-[#1a1a1a]">Pending Profile Verification Queue</h2>
            </div>
            <Link href="/admin/profiles" className="font-sans text-xs font-bold text-[#7b1d2a] hover:underline flex items-center gap-1">
              View All Queue <ArrowRight size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left font-sans text-[11px] text-gray-500 uppercase font-bold">
                <tr>
                  <th className="px-5 py-3">Member Name</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Profession</th>
                  <th className="px-5 py-3">Date Submitted</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans text-xs">
                {pendingProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4 font-bold text-[#1a1a1a]">{p.name}, {p.age}</td>
                    <td className="px-5 py-4 text-gray-600">{p.location}</td>
                    <td className="px-5 py-4 text-gray-600">{p.profession}</td>
                    <td className="px-5 py-4 text-gray-500">{p.dateSubmitted}</td>
                    <td className="px-5 py-4">
                      <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        PENDING VERIFICATION
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href="/admin/profiles"
                        className="bg-[#7b1d2a] text-white px-3 py-1.5 rounded-md font-semibold text-[11px] hover:bg-[#5c1520] transition-colors"
                      >
                        Review Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
