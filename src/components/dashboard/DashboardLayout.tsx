"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard, User, Users, Sliders, CreditCard,
  Receipt, MessageSquare, Settings, LogOut, Menu, X,
  ShieldCheck, Crown, Bell, CheckCircle2, Sparkles, Info
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
  { label: "My Matches", href: "/dashboard/matches", icon: Users },
  { label: "Match Preferences", href: "/dashboard/preferences", icon: Sliders },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { label: "Payments", href: "/dashboard/payments", icon: Receipt },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface DbNotification {
  id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);
  const notifRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Load notifications from database
  useEffect(() => {
    async function loadNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const json = await res.json();
          if (json.success) setNotifications(json.notifications || []);
        }
      } catch (err) {
        console.error("[DashboardLayout] notifications fetch error:", err);
      } finally {
        setNotifLoading(false);
      }
    }
    loadNotifications();
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
  };

  const handleNotifClick = async (notif: DbNotification) => {
    if (!notif.isRead) await markRead(notif.id);
    setNotifOpen(false);
    const dest = notif.link || "/dashboard/notifications";
    router.push(dest);
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

        {/* Mobile right: bell + hamburger */}
        <div className="flex items-center gap-1">
          {/* Mobile Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-gray-600 hover:text-[#7b1d2a]"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#7b1d2a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mobile notification dropdown */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl py-3 z-50 max-h-[70vh] overflow-y-auto">
                <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#1a1a1a]">Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="font-sans text-[11px] font-semibold text-[#7b1d2a] hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-center text-xs font-sans text-gray-400 py-6">No notifications.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {notifications.slice(0, 5).map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleNotifClick(n)}
                        className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${!n.isRead ? "bg-[#fbf5ec]/60" : ""}`}
                      >
                        <Info size={14} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-sans text-xs font-semibold text-[#1a1a1a]">{n.title}</p>
                          <p className="font-sans text-[10px] text-gray-400 mt-0.5 line-clamp-1">{n.message}</p>
                        </div>
                        {!n.isRead && <span className="w-2 h-2 bg-[#7b1d2a] rounded-full flex-shrink-0 mt-1 ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
                <div className="px-4 pt-2 border-t border-gray-100">
                  <Link
                    href="/dashboard/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="block text-center font-sans text-xs font-semibold text-[#7b1d2a] hover:underline py-1"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen((prev) => {
              if (prev) { /* closing */ }
              return !prev;
            })}
            className="p-2 text-gray-700"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
                  {/* Notifications badge from real data */}
                  {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                    <span className="bg-[#c9962c] text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#c9962c] flex-shrink-0">
              <Image
                src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"}
                alt="User avatar"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="overflow-hidden">
              <p className="font-sans text-sm font-semibold text-white truncate">
                {user ? `${user.firstName} ${user.lastName || ""}`.trim() : "Member"}
              </p>
              <div className="flex items-center gap-1">
                <Crown size={12} className="text-[#c9962c]" />
                <span className="font-sans text-[10px] text-white/70">Member</span>
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

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between bg-white border-b border-[#e8e0d4] px-8 py-4">
          <div>
            <h2 className="font-serif text-[#1a1a1a] text-xl font-bold">Intentional Matchmaking Portal</h2>
            <p className="font-sans text-xs text-gray-500">Where Love Meets Clarity and Wisdom</p>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Desktop Notification Bell */}
            <div className="relative" ref={notifRef}>
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

              {/* Desktop Notification Dropdown */}
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
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs font-sans text-gray-400 py-6">No notifications.</p>
                  ) : (
                    <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
                      {notifications.slice(0, 5).map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 ${!n.isRead ? "bg-[#fbf5ec]/60" : ""}`}
                        >
                          <Info size={14} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="font-sans text-xs font-semibold text-[#1a1a1a]">{n.title}</p>
                            <p className="font-sans text-[10px] text-gray-400 mt-0.5 line-clamp-1">{n.message}</p>
                          </div>
                          {!n.isRead && <span className="w-2 h-2 bg-[#7b1d2a] rounded-full flex-shrink-0 mt-1" />}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="px-4 pt-2 border-t border-gray-100">
                    <Link
                      href="/dashboard/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="block text-center font-sans text-xs font-semibold text-[#7b1d2a] hover:underline py-1"
                    >
                      View all notifications
                    </Link>
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

        <main className="p-4 sm:p-6 lg:p-8 flex-1 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
