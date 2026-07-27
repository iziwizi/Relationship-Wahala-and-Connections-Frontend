import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// POST /api/admin/matches/introduce — create an admin-initiated MatchInteraction
export async function POST(request: NextRequest) {
  try {
    const { requesterId, targetId } = await request.json();

    if (!requesterId || !targetId) {
      return NextResponse.json({ error: "requesterId and targetId are required" }, { status: 400 });
    }

    if (requesterId === targetId) {
      return NextResponse.json({ error: "Cannot introduce a member to themselves" }, { status: 400 });
    }

    // Check if already introduced
    const existing = await prisma.matchInteraction.findUnique({
      where: { requesterId_targetId: { requesterId, targetId } },
    });

    if (existing) {
      return NextResponse.json({ error: "These members have already been introduced." }, { status: 409 });
    }

    // Create the introduction
    const interaction = await prisma.matchInteraction.create({
      data: {
        requesterId,
        targetId,
        status: "PENDING",
        compatibilityScore: 85,
        initiatedByAdmin: true,
      },
    });

    // Notify both members
    const [requesterProfile, targetProfile] = await Promise.all([
      prisma.profile.findUnique({ where: { userId: requesterId } }),
      prisma.profile.findUnique({ where: { userId: targetId } }),
    ]);

    await prisma.notification.createMany({
      data: [
        {
          userId: requesterId,
          title: "New Match Introduction! 💑",
          message: `You've been introduced to ${targetProfile?.firstName || "a member"} by our matchmaking team. Check your matches!`,
          link: "/dashboard/matches",
        },
        {
          userId: targetId,
          title: "New Match Introduction! 💑",
          message: `You've been introduced to ${requesterProfile?.firstName || "a member"} by our matchmaking team. Check your matches!`,
          link: "/dashboard/matches",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      interaction,
      message: `Introduction created between ${requesterProfile?.firstName || "Member"} and ${targetProfile?.firstName || "Member"}. Both members have been notified.`,
    });
  } catch (error) {
    console.error("matches/introduce error:", error);
    return NextResponse.json({ error: "Failed to create introduction" }, { status: 500 });
  }
}
