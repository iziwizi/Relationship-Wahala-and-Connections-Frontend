// src/app/api/matches/[id]/interact/route.ts
// Records candidate feedback: "DECLINED" (Not Interested) or "ACCEPTED" (Interested)

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const action = body.action || "DECLINED";

    const status =
      action === "not_interested" || action === "DECLINED" || action === "pass"
        ? "DECLINED"
        : "ACCEPTED";

    if (!isDatabaseMode()) {
      return NextResponse.json({
        success: true,
        status,
        message: status === "DECLINED" ? "Candidate dismissed." : "Interest expressed.",
      });
    }

    const { prisma } = await import("@/lib/db/prisma");

    // Resolve target userId in case id passed is profileId or userId
    let targetUserId = id;
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      const profile = await prisma.profile.findUnique({ where: { id } });
      if (profile) {
        targetUserId = profile.userId;
      }
    }

    // Upsert MatchInteraction in PostgreSQL
    await prisma.matchInteraction.upsert({
      where: {
        requesterId_targetId: {
          requesterId: session.userId,
          targetId: targetUserId,
        },
      },
      create: {
        requesterId: session.userId,
        targetId: targetUserId,
        status,
      },
      update: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      status,
      message: status === "DECLINED" ? "Candidate dismissed." : "Interest expressed.",
    });
  } catch (error) {
    console.error("[Match Interact API] Error:", error);
    return NextResponse.json({ error: "Failed to record match interaction." }, { status: 500 });
  }
}
