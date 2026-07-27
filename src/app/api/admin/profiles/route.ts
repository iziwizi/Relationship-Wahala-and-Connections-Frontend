// src/app/api/admin/profiles/route.ts
// Returns list of all profiles for Super Admin moderation

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { getAllProfiles } from "@/lib/repositories/users.repository";

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

    const rawProfiles = await getAllProfiles();

    const profiles = rawProfiles.map((p) => {
      const birthYear = p.dateOfBirth ? new Date(p.dateOfBirth).getFullYear() : 1995;
      const age = new Date().getFullYear() - birthYear;

      return {
        id: p.id,
        name: `${p.firstName} ${p.lastName}`.trim(),
        email: p.user.email,
        age,
        location: p.currentCityState,
        profession: p.profession,
        submittedAt: p.createdAt.toISOString().split("T")[0],
        status: p.status,
      };
    });

    return NextResponse.json({ success: true, profiles });
  } catch (error) {
    console.error("[Admin Profiles API] Error:", error);
    return NextResponse.json(
      { error: "Failed to load profiles." },
      { status: 500 }
    );
  }
}
