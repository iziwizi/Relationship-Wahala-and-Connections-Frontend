// src/app/api/user/profile/route.ts
// Handles member profile fetching & updates with PostgreSQL persistence

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";
import { getUserById } from "@/lib/repositories/users.repository";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (!isDatabaseMode()) {
      return NextResponse.json({ success: true, profile: null });
    }

    const user = await getUserById(session.userId);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("[User Profile GET API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile." }, { status: 500 });
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
      return NextResponse.json({ success: true, note: "Demo mode update simulation" });
    }

    const { prisma } = await import("@/lib/db/prisma");
    const body = await req.json();

    const existingUser = await getUserById(session.userId);

    if (!existingUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const profileData: Record<string, unknown> = {};
    if (body.firstName) profileData.firstName = body.firstName;
    if (body.lastName) profileData.lastName = body.lastName;
    if (body.phone) profileData.phone = body.phone;
    if (body.profession) profileData.profession = body.profession;
    if (body.currentCityState) profileData.currentCityState = body.currentCityState;
    if (body.aboutMe) profileData.aboutMe = body.aboutMe;
    if (body.relationshipGoal) profileData.relationshipGoal = body.relationshipGoal;
    if (body.maritalStatus) profileData.maritalStatus = body.maritalStatus;

    // Handle photo update
    if (body.avatar) {
      const existingProfile = existingUser.profile;
      if (existingProfile) {
        // Upsert primary photo
        await prisma.photo.deleteMany({ where: { profileId: existingProfile.id, isPrimary: true } });
        await prisma.photo.create({
          data: {
            profileId: existingProfile.id,
            url: body.avatar,
            isPrimary: true,
          },
        });
      }
    }

    // Calculate real completion score based on non-empty fields
    let completion = 50;
    if (body.firstName || existingUser.profile?.firstName) completion += 10;
    if (body.profession || existingUser.profile?.profession) completion += 10;
    if (body.aboutMe || existingUser.profile?.aboutMe) completion += 15;
    if (body.avatar || existingUser.profile?.photos?.length) completion += 15;
    profileData.profileCompletion = Math.min(completion, 100);

    if (existingUser.profile) {
      await prisma.profile.update({
        where: { id: existingUser.profile.id },
        data: profileData,
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    return NextResponse.json({ success: true, message: "Profile updated successfully." });
  } catch (error) {
    console.error("[User Profile PUT API] Error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
