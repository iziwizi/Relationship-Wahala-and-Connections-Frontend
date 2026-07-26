"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserCheck, Heart, Package,
  CreditCard, MessageSquare, Settings, LogOut, Menu, X, ShieldAlert
} from "lucide-react";

interface AdminSidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

const adminItems: AdminSidebarItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Profile Verification", href: "/admin/profiles", icon: UserCheck, badge: "4 Pending" },
  { label: "Matchmaking Control", href: "/admin/matches", icon: Heart },
  { label: "Packages Management", href: "/admin/packages", icon: Package },
  { label: "Payment Logs", href: "/admin/payments", icon: CreditCard },
  { label: "Contact Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { label: "Platform Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
        <div>
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

          {/* Nav Items */}
          <nav className="px-3 py-6 space-y-1">
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-sans text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#7b1d2a] text-white font-semibold border-l-4 border-[#c9962c]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-[#c9962c]" : "text-white/70"} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#c9962c] text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
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
            <p className="font-sans text-xs text-gray-500">System Management &amp; Matchmaking Operations</p>
          </div>
          <div className="flex items-center gap-2 bg-[#7b1d2a]/10 text-[#7b1d2a] px-3 py-1.5 rounded-full text-xs font-bold font-sans">
            ● Live System
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
