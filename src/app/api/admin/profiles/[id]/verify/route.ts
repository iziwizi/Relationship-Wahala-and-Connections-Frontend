// src/app/api/admin/profiles/[id]/verify/route.ts
// Handles profile moderation actions (Approve, Reject, Suspend) with PostgreSQL persistence

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { updateProfileStatus } from "@/lib/repositories/users.repository";
import { revalidatePath } from "next/cache";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json() as { status: "VERIFIED" | "REJECTED" | "SUSPENDED"; reason?: string };

    if (!body.status || !["VERIFIED", "REJECTED", "SUSPENDED"].includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid status parameter." },
        { status: 400 }
      );
    }

    const updated = await updateProfileStatus(id, body.status, session.userId, body.reason);

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update profile or profile not found." },
        { status: 400 }
      );
    }

    // Server-side revalidation of admin paths
    revalidatePath("/admin");
    revalidatePath("/admin/profiles");

    return NextResponse.json({
      success: true,
      message: `Profile status updated to ${body.status}`,
      profile: {
        id: updated.id,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error("[Admin Verify Profile API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error updating profile status." },
      { status: 500 }
    );
  }
}
