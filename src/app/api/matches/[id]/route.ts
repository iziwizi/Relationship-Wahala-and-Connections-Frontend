// src/app/api/matches/[id]/route.ts
// Retrieves a single database-backed match profile with privacy enforcement

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function GET(
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

    if (!isDatabaseMode()) {
      return NextResponse.json({ error: "Match not found in demo mode." }, { status: 404 });
    }

    const { prisma } = await import("@/lib/db/prisma");

    const targetUser = await prisma.user.findFirst({
      where: {
        OR: [{ id }, { profile: { id } }],
        role: "MEMBER",
        profile: { status: "VERIFIED" },
      },
      include: {
        profile: {
          include: {
            photos: true,
            preferences: true,
          },
        },
      },
    });

    if (!targetUser || !targetUser.profile) {
      return NextResponse.json(
        { error: "Match profile not found or unavailable." },
        { status: 404 }
      );
    }

    const p = targetUser.profile;
    const primaryPhoto = p.photos.find((photo) => photo.isPrimary)?.url || p.photos[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80";

    let age = 28;
    if (p.dateOfBirth) {
      const birthYear = new Date(p.dateOfBirth).getFullYear();
      age = new Date().getFullYear() - birthYear;
    }

    // PRIVACY: Omit email, phone, passwordHash, rejectionReason, admin IDs
    return NextResponse.json({
      success: true,
      match: {
        id: targetUser.id,
        firstName: p.firstName,
        age,
        gender: p.gender,
        maritalStatus: p.maritalStatus,
        nationality: p.nationality,
        location: p.currentCityState,
        educationLevel: p.educationLevel,
        profession: p.profession,
        employmentStatus: p.employmentStatus,
        religion: p.religion,
        smoking: p.smoking,
        drinking: p.drinking,
        hasChildren: p.hasChildren,
        wantsChildren: p.wantsChildren,
        aboutMe: p.aboutMe,
        keyValues: p.keyValues,
        interestsHobbies: p.interestsHobbies,
        relationshipGoal: p.relationshipGoal,
        photos: p.photos.map((photo) => photo.url),
        primaryPhoto,
        verified: p.status === "VERIFIED",
        preferences: p.preferences
          ? {
              ageMin: p.preferences.ageMin,
              ageMax: p.preferences.ageMax,
              location: p.preferences.location,
              educationLevel: p.preferences.educationLevel,
              religion: p.preferences.religion,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("[Match Detail API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch match details." }, { status: 500 });
  }
}
