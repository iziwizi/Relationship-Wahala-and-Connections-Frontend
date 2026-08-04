"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserCheck, Heart, Package,
  CreditCard, MessageSquare, Settings, LogOut, Menu, X, ShieldAlert,
  FileText, Video, BookOpen, Star, Calendar, HelpCircle, ChevronDown
} from "lucide-react";

interface AdminSidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

const mainAdminItems: AdminSidebarItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Profile Verification", href: "/admin/profiles", icon: UserCheck },
  { label: "Matchmaking Control", href: "/admin/matches", icon: Heart },
  { label: "Physical Bookings", href: "/admin/bookings", icon: Calendar },
  { label: "Packages Management", href: "/admin/packages", icon: Package },
  { label: "Payment Logs", href: "/admin/payments", icon: CreditCard },
  { label: "Contact Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Platform Settings", href: "/admin/settings", icon: Settings },
];

const cmsAdminItems: AdminSidebarItem[] = [
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Podcast Episodes", href: "/admin/podcast", icon: Video },
  { label: "Relationship Guides", href: "/admin/guides", icon: BookOpen },
  { label: "Success Stories", href: "/admin/success-stories", icon: Star },
  { label: "Events & Mixers", href: "/admin/events", icon: Calendar },
  { label: "FAQs Manager", href: "/admin/faqs", icon: HelpCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(true);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/admin/profiles/pending-count")
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.count === "number") setPendingCount(data.count);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-[#1a1a1a] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image src="/images/logo.jpeg" alt="Logo" fill className="object-contain rounded-sm" />
          </div>
          <div>
            <p className="font-serif font-bold text-[#c9962c] text-xs">SUPER ADMIN PORTAL</p>
          </div>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-white">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111111] text-white flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src="/images/logo.jpeg" alt="Logo" fill className="object-contain rounded-md" />
            </div>
            <div>
              <p className="font-serif font-bold text-white text-xs leading-tight">RELATIONSHIP WAHALA</p>
              <p className="font-sans text-[10px] text-[#c9962c] font-bold tracking-widest uppercase">Super Admin</p>
            </div>
          </div>

          {/* Core Operations Group */}
          <div className="px-3 pt-4 pb-2">
            <p className="px-4 font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Operations &amp; Members
            </p>
            <nav className="space-y-1">
              {mainAdminItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-sans text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[#7b1d2a] text-white font-semibold border-l-4 border-[#c9962c]"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={isActive ? "text-[#c9962c]" : "text-white/70"} />
                      <span>{item.label}</span>
                    </div>
                    {item.href === "/admin/profiles" && pendingCount !== null && pendingCount > 0 && (
                      <span className="bg-[#c9962c] text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {pendingCount} Pending
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Content Management Group */}
          <div className="px-3 pt-2 pb-6 border-t border-white/10">
            <button
              onClick={() => setCmsOpen(!cmsOpen)}
              className="w-full px-4 py-2 flex items-center justify-between font-sans text-[10px] font-bold text-[#c9962c] uppercase tracking-widest hover:text-white transition-colors"
            >
              <span>Content Management (CMS)</span>
              <ChevronDown size={14} className={`transition-transform ${cmsOpen ? "rotate-180" : ""}`} />
            </button>

            {cmsOpen && (
              <nav className="mt-1 space-y-1">
                {cmsAdminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-2 rounded-xl font-sans text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#7b1d2a]/80 text-white font-semibold border-l-4 border-[#c9962c]"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={15} className={isActive ? "text-[#c9962c]" : "text-white/60"} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          <div className="flex items-center gap-2 mb-3 text-xs font-sans text-white/80">
            <ShieldAlert size={16} className="text-[#c9962c]" />
            <span className="font-semibold">Super Admin Privileges</span>
          </div>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-sans text-xs font-medium transition-colors"
          >
            <LogOut size={14} />
            <span>Exit Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4">
          <div>
            <h2 className="font-serif text-[#1a1a1a] text-xl font-bold">Platform Super Admin Dashboard</h2>
            <p className="font-sans text-xs text-gray-500">System Management, CMS &amp; Matchmaking Operations</p>
          </div>
          <div className="flex items-center gap-2 bg-[#7b1d2a]/10 text-[#7b1d2a] px-3 py-1.5 rounded-full text-xs font-bold font-sans">
            ● Live Operational Mode
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
