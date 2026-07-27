import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// GET /api/admin/users — list all users with profile + subscription info
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      include: {
        profile: { select: { firstName: true, lastName: true, status: true } },
        subscriptions: {
          where: { status: "ACTIVE" },
          include: { package: { select: { name: true } } },
          orderBy: { startDate: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt.toISOString(),
      profile: u.profile
        ? { firstName: u.profile.firstName, lastName: u.profile.lastName, status: u.profile.status }
        : null,
      activeSubscription: u.subscriptions[0]?.package?.name || null,
    }));

    return NextResponse.json({ success: true, users: formatted });
  } catch (error) {
    console.error("admin/users GET error:", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
