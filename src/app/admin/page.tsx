"use client";

import React from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Users, UserCheck, CreditCard, Building2, MessageSquare,
  FileText, Video, Heart, ArrowRight
} from "lucide-react";

const stats = [
  { label: "Total Registered Members", value: "1,248", change: "+12% this month", icon: Users, color: "bg-blue-50 text-blue-600", href: "/admin/users" },
  { label: "Pending Verifications", value: "4", change: "Requires review", icon: UserCheck, color: "bg-yellow-50 text-yellow-600", href: "/admin/profiles" },
  { label: "Active Subscriptions", value: "342", change: "+8 new today", icon: Heart, color: "bg-purple-50 text-purple-600", href: "/admin/packages" },
  { label: "Successful Payments", value: "₦14,850,000", change: "This month", icon: CreditCard, color: "bg-green-50 text-green-600", href: "/admin/payments" },
  { label: "Pending Bank Transfers", value: "2", change: "Manual review", icon: Building2, color: "bg-orange-50 text-orange-600", href: "/admin/payments" },
  { label: "New Enquiries", value: "5", change: "24hr response target", icon: MessageSquare, color: "bg-pink-50 text-pink-600", href: "/admin/enquiries" },
  { label: "Published Blog Articles", value: "5", change: "CMS Active", icon: FileText, color: "bg-[#7b1d2a]/10 text-[#7b1d2a]", href: "/admin/blog" },
  { label: "Podcast Episodes", value: "4", change: "YouTube sync", icon: Video, color: "bg-red-50 text-red-600", href: "/admin/podcast" },
];

const pendingVerifications = [
  { id: "prof-1", name: "Chinedu Okeke", profession: "Financial Analyst", date: "Today, 09:30 AM", location: "Lagos, Nigeria" },
  { id: "prof-2", name: "Amina Yusuf", profession: "Architect", date: "Yesterday, 04:15 PM", location: "Abuja, Nigeria" },
  { id: "prof-3", name: "Babajide Soyinka", profession: "Petroleum Engineer", date: "Yesterday, 02:00 PM", location: "Port Harcourt, Rivers" },
  { id: "prof-4", name: "Grace Adeleke", profession: "Software Engineer", date: "Jul 24, 2026", location: "London, UK (Diaspora)" },
];

const pendingTransfers = [
  { ref: "RWC-BNK-17850-891", user: "Kemi Balogun", package: "Executive Physical Matchmaking (EPMS)", amount: "₦150,000", date: "Today, 11:20 AM" },
  { ref: "RWC-BNK-17850-642", user: "Tayo Adeyemi", package: "Standard Matchmaking", amount: "₦45,000", date: "Yesterday, 06:40 PM" },
];

const recentEnquiries = [
  { id: "enq-1", name: "Bisi Adebayo", email: "bisi@example.com", category: "EPMS Consultation", status: "New", date: "Today, 10:00 AM" },
  { id: "enq-2", name: "David Mensah", email: "david@example.com", category: "Diaspora Package", status: "New", date: "Yesterday, 05:30 PM" },
];

export default function AdminOverviewPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-[#1a1a1a] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-sans text-xs font-semibold text-[#c9962c] uppercase tracking-widest">
              SUPER ADMIN OPERATIONAL COMMAND
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1">Welcome back, Super Admin</h1>
            <p className="font-sans text-white/70 text-xs sm:text-sm mt-1">
              Real-time platform overview: profile verifications, bank transfer approvals, and content operations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/profiles"
              className="bg-[#7b1d2a] text-white px-4 py-2.5 rounded-xl font-sans text-xs font-semibold hover:bg-[#5c1520] transition-colors whitespace-nowrap"
            >
              Review 4 Pending Profiles
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-sans text-xs font-semibold text-gray-500">{stat.label}</span>
                    <div className={`w-9 h-9 ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#1a1a1a] group-hover:text-[#7b1d2a] transition-colors">
                    {stat.value}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-sans">
                  <span className="text-gray-400">{stat.change}</span>
                  <ArrowRight size={12} className="text-[#7b1d2a] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Operational Queues Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Queue 1: Profiles Awaiting Verification */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck size={20} className="text-[#7b1d2a]" />
                <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">Profiles Awaiting Verification</h2>
              </div>
              <Link href="/admin/profiles" className="font-sans text-xs text-[#7b1d2a] font-semibold hover:underline">
                View All (4)
              </Link>
            </div>

            <div className="space-y-3">
              {pendingVerifications.map((prof) => (
                <div key={prof.id} className="p-3.5 bg-[#fbf5ec] border border-[#e8e0d4] rounded-xl flex items-center justify-between text-xs font-sans">
                  <div>
                    <p className="font-bold text-[#1a1a1a]">{prof.name}</p>
                    <p className="text-gray-500 text-[11px]">{prof.profession} • {prof.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{prof.date}</span>
                    <Link
                      href="/admin/profiles"
                      className="bg-[#7b1d2a] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#5c1520]"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Queue 2: Pending Bank Transfers */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Building2 size={20} className="text-orange-600" />
                <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">Pending Bank Transfers</h2>
              </div>
              <Link href="/admin/payments" className="font-sans text-xs text-[#7b1d2a] font-semibold hover:underline">
                Payment Audit Log
              </Link>
            </div>

            <div className="space-y-3">
              {pendingTransfers.map((tx) => (
                <div key={tx.ref} className="p-3.5 bg-orange-50/60 border border-orange-200/60 rounded-xl flex items-center justify-between text-xs font-sans">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#1a1a1a]">{tx.user}</p>
                      <span className="bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {tx.amount}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-0.5">{tx.package}</p>
                  </div>
                  <Link
                    href="/admin/payments"
                    className="bg-orange-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-orange-700 whitespace-nowrap"
                  >
                    Review &amp; Approve
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Queue 3: Recent Enquiries & CMS Quick Links */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enquiries Queue */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-[#7b1d2a]" />
                <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">Recent Website Enquiries</h2>
              </div>
              <Link href="/admin/enquiries" className="font-sans text-xs text-[#7b1d2a] font-semibold hover:underline">
                View All Enquiries
              </Link>
            </div>

            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-3.5 bg-gray-50 rounded-xl flex items-center justify-between text-xs font-sans">
                  <div>
                    <p className="font-bold text-[#1a1a1a]">{enq.name} ({enq.email})</p>
                    <p className="text-gray-500 text-[11px]">Category: {enq.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-[10px]">{enq.date}</span>
                    <Link href="/admin/enquiries" className="text-[#7b1d2a] font-semibold hover:underline">
                      Manage →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CMS Shortcuts */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#1a1a1a] border-b border-gray-100 pb-3">
              CMS Management Shortcuts
            </h2>

            <div className="space-y-2 font-sans text-xs">
              <Link href="/admin/blog/new" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-[#7b1d2a]/10 rounded-xl transition-colors font-medium">
                <span className="flex items-center gap-2"><FileText size={16} className="text-[#7b1d2a]" /> Create Blog Article</span>
                <ArrowRight size={14} className="text-gray-400" />
              </Link>
              <Link href="/admin/podcast/new" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-[#7b1d2a]/10 rounded-xl transition-colors font-medium">
                <span className="flex items-center gap-2"><Video size={16} className="text-red-600" /> Add Podcast Episode</span>
                <ArrowRight size={14} className="text-gray-400" />
              </Link>
              <Link href="/admin/guides/new" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-[#7b1d2a]/10 rounded-xl transition-colors font-medium">
                <span className="flex items-center gap-2"><FileText size={16} className="text-[#c9962c]" /> Publish Guide</span>
                <ArrowRight size={14} className="text-gray-400" />
              </Link>
              <Link href="/admin/success-stories/new" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-[#7b1d2a]/10 rounded-xl transition-colors font-medium">
                <span className="flex items-center gap-2"><Heart size={16} className="text-purple-600" /> Add Success Story</span>
                <ArrowRight size={14} className="text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
