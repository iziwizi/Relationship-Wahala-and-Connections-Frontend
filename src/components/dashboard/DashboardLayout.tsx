"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  User,
  Users,
  Sliders,
  CreditCard,
  Receipt,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Crown,
  Bell,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: "/dashboard/profile", icon: User },
  { label: "My Matches", href: "/dashboard/matches", icon: Users, badge: "3 New" },
  { label: "Match Preferences", href: "/dashboard/preferences", icon: Sliders },
  { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { label: "Payments", href: "/dashboard/payments", icon: Receipt },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: "2" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col lg:flex-row">
      {/* Mobile Top Navigation Header */}
      <header className="lg:hidden bg-white border-b border-[#e8e0d4] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative w-9 h-9">
            <Image
              src="/images/logo.jpeg"
              alt="Relationship Wahala & Connections logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <p className="font-serif font-bold text-[#7b1d2a] text-xs leading-tight">
              RELATIONSHIP WAHALA
            </p>
            <p className="font-sans text-[8px] text-[#c9962c] tracking-widest uppercase font-semibold">
              Member Dashboard
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#5c1520] text-white flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Sidebar Header Logo */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/images/logo.jpeg"
                  alt="Relationship Wahala & Connections logo"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <div>
                <p className="font-serif font-bold text-white text-xs leading-tight">
                  RELATIONSHIP WAHALA
                </p>
                <p className="font-serif font-bold text-white text-xs leading-tight">
                  &amp; CONNECTIONS
                </p>
                <p className="font-sans text-[9px] text-[#c9962c] tracking-widest uppercase font-semibold">
                  Member Portal
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-6 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-sans text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "bg-[#7b1d2a] text-white font-semibold border-l-4 border-[#c9962c]"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-[#c9962c]" : "text-white/75"} />
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

        {/* Sidebar Footer — Authenticated User Card & Logout */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#c9962c]">
              <Image
                src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"}
                alt="User avatar"
                fill
                className="object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="font-sans text-sm font-semibold text-white truncate">
                {user ? `${user.firstName} ${user.lastName}` : "Daniel Okonkwo"}
              </p>
              <div className="flex items-center gap-1">
                <Crown size={12} className="text-[#c9962c]" />
                <span className="font-sans text-[10px] text-white/70">Standard Member</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-sans text-xs font-medium transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar for desktop */}
        <div className="hidden lg:flex items-center justify-between bg-white border-b border-[#e8e0d4] px-8 py-4">
          <div>
            <h2 className="font-serif text-[#1a1a1a] text-xl font-bold">
              Intentional Matchmaking Portal
            </h2>
            <p className="font-sans text-xs text-gray-500">
              Where Love Meets Clarity and Wisdom
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/messages"
              className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#7b1d2a] rounded-full" />
            </Link>

            <div className="flex items-center gap-2 bg-[#fbf5ec] px-3 py-1.5 rounded-full border border-[#e8e0d4]">
              <ShieldCheck size={16} className="text-[#c9962c]" />
              <span className="font-sans text-xs text-gray-700 font-medium">Verified Profile</span>
            </div>
          </div>
        </div>

        {/* Page Children */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
