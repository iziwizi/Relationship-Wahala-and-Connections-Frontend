import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// PATCH /api/admin/users/[id] — suspend or reactivate a member
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body; // "suspend" | "reactivate"

    // Prevent modifying super admins
    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (target.role === "SUPER_ADMIN") {
      return NextResponse.json({ error: "Super admin accounts cannot be suspended" }, { status: 403 });
    }

    const newIsActive = action === "reactivate";
    const user = await prisma.user.update({ where: { id }, data: { isActive: newIsActive } });

    return NextResponse.json({ success: true, isActive: user.isActive });
  } catch (error) {
    console.error("admin/users/[id] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
  }
}
