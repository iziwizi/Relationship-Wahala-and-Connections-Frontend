"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, User, Users, Sliders, CreditCard,
  Receipt, MessageSquare, Settings, LogOut, Menu, X,
  ShieldCheck, Crown, Bell, CheckCircle2, Sparkles
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
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { label: "Payments", href: "/dashboard/payments", icon: Receipt },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, badge: "2" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const mockNotifications = [
  { id: "n-1", title: "Profile Verification Approved", time: "10 mins ago", read: false, icon: CheckCircle2 },
  { id: "n-2", title: "New Recommended Match: Amara (94%)", time: "2 hours ago", read: false, icon: Sparkles },
  { id: "n-3", title: "Welcome to Standard Matchmaking", time: "1 day ago", read: true, icon: Crown },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-white border-b border-[#e8e0d4] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative w-9 h-9">
            <Image src="/images/logo.jpeg" alt="Logo" fill className="object-contain" />
          </div>
          <div>
            <p className="font-serif font-bold text-[#7b1d2a] text-xs leading-tight">RELATIONSHIP WAHALA</p>
            <p className="font-sans text-[8px] text-[#c9962c] tracking-widest uppercase font-semibold">Member Portal</p>
          </div>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-gray-700">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#5c1520] text-white flex flex-col justify-between transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/images/logo.jpeg" alt="Logo" fill className="object-contain rounded-md" />
              </div>
              <div>
                <p className="font-serif font-bold text-white text-xs leading-tight">RELATIONSHIP WAHALA</p>
                <p className="font-serif font-bold text-white text-xs leading-tight">&amp; CONNECTIONS</p>
                <p className="font-sans text-[9px] text-[#c9962c] tracking-widest uppercase font-semibold">Member Portal</p>
              </div>
            </Link>
          </div>

          <nav className="px-3 py-6 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-sans text-sm font-medium transition-colors ${
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
        <div className="hidden lg:flex items-center justify-between bg-white border-b border-[#e8e0d4] px-8 py-4">
          <div>
            <h2 className="font-serif text-[#1a1a1a] text-xl font-bold">Intentional Matchmaking Portal</h2>
            <p className="font-sans text-xs text-gray-500">Where Love Meets Clarity and Wisdom</p>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Interactive Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#7b1d2a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl py-3 z-50">
                  <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-serif font-bold text-sm text-[#1a1a1a]">Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="font-sans text-[11px] font-semibold text-[#7b1d2a] hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                    {notifications.map((n) => {
                      const Icon = n.icon;
                      return (
                        <div key={n.id} className={`p-3.5 flex items-start gap-3 ${!n.read ? "bg-[#fbf5ec]/60" : ""}`}>
                          <Icon size={16} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-sans text-xs font-semibold text-[#1a1a1a]">{n.title}</p>
                            <p className="font-sans text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 bg-[#fbf5ec] px-3 py-1.5 rounded-full border border-[#e8e0d4]">
              <ShieldCheck size={16} className="text-[#c9962c]" />
              <span className="font-sans text-xs text-gray-700 font-medium">Verified Profile</span>
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
