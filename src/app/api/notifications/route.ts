// src/app/api/notifications/route.ts
// Handles fetching user notifications and marking notifications as read from PostgreSQL

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!isDatabaseMode()) {
      return NextResponse.json({
        success: true,
        notifications: [
          {
            id: "notif-demo-1",
            title: "Welcome to Relationship Wahala",
            message: "Explore intentional matches and complete your profile.",
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
        unreadCount: 1,
      });
    }

    const { prisma } = await import("@/lib/db/prisma");

    const notifications = await prisma.notification.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: session.userId, isRead: false },
    });

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("[Notifications GET API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!isDatabaseMode()) {
      return NextResponse.json({ success: true });
    }

    const { prisma } = await import("@/lib/db/prisma");
    const body = await req.json() as { notificationId?: string; markAllRead?: boolean };

    if (body.markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: session.userId, isRead: false },
        data: { isRead: true },
      });
    } else if (body.notificationId) {
      await prisma.notification.update({
        where: { id: body.notificationId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Notifications PUT API] Error:", error);
    return NextResponse.json({ error: "Failed to update notification state." }, { status: 500 });
  }
}
