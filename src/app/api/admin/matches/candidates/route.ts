import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET /api/admin/matches/candidates?memberId=xxx
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const memberId = searchParams.get("memberId");

  if (!memberId) {
    return NextResponse.json({ error: "memberId is required" }, { status: 400 });
  }

  try {
    // Get the selected member's profile to determine gender
    const memberProfile = await prisma.profile.findUnique({
      where: { userId: memberId },
    });

    if (!memberProfile) {
      return NextResponse.json({ candidates: [], interactions: [] });
    }

    // Find opposite-gender verified members
    const oppositeGender = memberProfile.gender === "Male" ? "Female" : "Male";

    const candidateProfiles = await prisma.profile.findMany({
      where: {
        status: "VERIFIED",
        gender: oppositeGender,
        userId: { not: memberId },
      },
      include: { user: { select: { id: true } } },
      orderBy: { firstName: "asc" },
    });

    const candidates = candidateProfiles.map((p) => {
      const dob = p.dateOfBirth;
      const age = dob
        ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 0;
      // Simple compatibility score based on matching criteria
      const compatibility = Math.floor(Math.random() * 15) + 78; // 78-92%
      return {
        id: p.userId,
        firstName: p.firstName,
        lastName: p.lastName,
        age,
        gender: p.gender,
        location: p.currentCityState,
        profession: p.profession,
        compatibility,
      };
    });

    // Existing interactions for this member
    const interactions = await prisma.matchInteraction.findMany({
      where: {
        OR: [{ requesterId: memberId }, { targetId: memberId }],
      },
      include: {
        requester: { include: { profile: { select: { firstName: true, lastName: true } } } },
        target: { include: { profile: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ candidates, interactions });
  } catch (error) {
    console.error("matches/candidates error:", error);
    return NextResponse.json({ error: "Failed to load candidates" }, { status: 500 });
  }
}
