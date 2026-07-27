// src/app/api/admin/dashboard/route.ts
// Returns live PostgreSQL metrics and queues for Super Admin Overview

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { getAdminDashboardData } from "@/lib/repositories/admin-dashboard.repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const data = await getAdminDashboardData();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("[Admin Dashboard API] Error:", error);
    return NextResponse.json(
      { error: "Failed to load admin dashboard data." },
      { status: 500 }
    );
  }
}
