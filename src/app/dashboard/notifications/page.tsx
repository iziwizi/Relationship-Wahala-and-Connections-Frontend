"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Bell, CheckCheck, Loader2, Info, AlertTriangle, ShieldCheck } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setNotifications(json.notifications || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const markSingleRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Notifications</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">
              Account updates, matchmaking status, verification notices, and system alerts.
            </p>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 text-xs font-semibold font-sans text-[#7b1d2a] hover:text-[#5c1520] border border-[#7b1d2a]/20 px-3 py-1.5 rounded-lg hover:bg-[#fbf5ec]"
            >
              <CheckCheck size={14} /> Mark all as read
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 flex items-center justify-center gap-2 text-gray-500 font-sans text-xs">
              <Loader2 size={18} className="animate-spin text-[#7b1d2a]" />
              Loading notifications from database...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs font-sans">
              <Bell size={24} className="mx-auto text-gray-300 mb-2" />
              You have no notifications at this time.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 font-sans text-xs">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markSingleRead(n.id)}
                  className={`p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                    !n.isRead ? "bg-[#fbf5ec]/50 font-medium" : "bg-white text-gray-600"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#7b1d2a]/10 text-[#7b1d2a] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {n.title.includes("Verified") ? (
                      <ShieldCheck size={16} className="text-green-600" />
                    ) : n.title.includes("Revision") ? (
                      <AlertTriangle size={16} className="text-yellow-600" />
                    ) : (
                      <Info size={16} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-[#1a1a1a]">{n.title}</p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(n.createdAt).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                  </div>

                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#7b1d2a] flex-shrink-0 mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
