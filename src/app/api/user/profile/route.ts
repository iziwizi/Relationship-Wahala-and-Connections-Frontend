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
      return NextResponse.json({ success: true, user: null });
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

    // Personal details
    if (typeof body.firstName === "string") profileData.firstName = body.firstName.trim();
    if (typeof body.lastName === "string") profileData.lastName = body.lastName.trim();
    if (typeof body.phone === "string") profileData.phone = body.phone.trim();
    if (typeof body.gender === "string") profileData.gender = body.gender.trim();
    if (typeof body.maritalStatus === "string") profileData.maritalStatus = body.maritalStatus.trim();
    if (typeof body.nationality === "string") profileData.nationality = body.nationality.trim();
    if (typeof body.stateOfOrigin === "string") profileData.stateOfOrigin = body.stateOfOrigin.trim();
    if (typeof body.currentCityState === "string") profileData.currentCityState = body.currentCityState.trim();
    if (typeof body.currentCountry === "string") profileData.currentCountry = body.currentCountry.trim();
    if (body.dateOfBirth) {
      const parsedDate = new Date(body.dateOfBirth);
      if (!isNaN(parsedDate.getTime())) {
        profileData.dateOfBirth = parsedDate;
      }
    }

    // Education & Career
    if (typeof body.educationLevel === "string") profileData.educationLevel = body.educationLevel.trim();
    if (typeof body.profession === "string") profileData.profession = body.profession.trim();
    if (typeof body.employmentStatus === "string") profileData.employmentStatus = body.employmentStatus.trim();
    if (typeof body.religion === "string") profileData.religion = body.religion.trim();

    // Lifestyle
    if (typeof body.smoking === "string") profileData.smoking = body.smoking.trim();
    if (typeof body.drinking === "string") profileData.drinking = body.drinking.trim();
    if (typeof body.hasChildren === "string") profileData.hasChildren = body.hasChildren.trim();
    if (typeof body.wantsChildren === "string") profileData.wantsChildren = body.wantsChildren.trim();

    // About & Intentions
    if (typeof body.aboutMe === "string") profileData.aboutMe = body.aboutMe.trim();
    if (typeof body.relationshipGoal === "string") profileData.relationshipGoal = body.relationshipGoal.trim();

    // Array fields
    if (Array.isArray(body.keyValues)) {
      profileData.keyValues = body.keyValues.map((v: unknown) => String(v).trim()).filter(Boolean);
    } else if (typeof body.keyValues === "string") {
      profileData.keyValues = body.keyValues.split(",").map((v: string) => v.trim()).filter(Boolean);
    }

    if (Array.isArray(body.interestsHobbies)) {
      profileData.interestsHobbies = body.interestsHobbies.map((v: unknown) => String(v).trim()).filter(Boolean);
    } else if (typeof body.interestsHobbies === "string") {
      profileData.interestsHobbies = body.interestsHobbies.split(",").map((v: string) => v.trim()).filter(Boolean);
    }

    // Calculate completion score accurately
    let score = 30;
    if (profileData.firstName || existingUser.profile?.firstName) score += 10;
    if (profileData.phone || existingUser.profile?.phone) score += 10;
    if (profileData.profession || existingUser.profile?.profession) score += 10;
    if (profileData.currentCityState || existingUser.profile?.currentCityState) score += 10;
    if (profileData.aboutMe || existingUser.profile?.aboutMe) score += 15;
    if (body.avatar || existingUser.profile?.photos?.length) score += 15;
    profileData.profileCompletion = Math.min(score, 100);

    let profileId = existingUser.profile?.id;

    if (existingUser.profile) {
      await prisma.profile.update({
        where: { id: existingUser.profile.id },
        data: profileData,
      });
    } else {
      const created = await prisma.profile.create({
        data: {
          userId: session.userId,
          firstName: (profileData.firstName as string) || session.firstName || "Member",
          lastName: (profileData.lastName as string) || "",
          phone: (profileData.phone as string) || "",
          dateOfBirth: (profileData.dateOfBirth as Date) || new Date("1995-01-01"),
          gender: (profileData.gender as string) || "Not specified",
          maritalStatus: (profileData.maritalStatus as string) || "Single (Never Married)",
          nationality: (profileData.nationality as string) || "Nigerian",
          stateOfOrigin: (profileData.stateOfOrigin as string) || "",
          currentCityState: (profileData.currentCityState as string) || "Lagos, Nigeria",
          currentCountry: (profileData.currentCountry as string) || "Nigeria",
          educationLevel: (profileData.educationLevel as string) || "Bachelor's Degree",
          profession: (profileData.profession as string) || "Professional",
          employmentStatus: (profileData.employmentStatus as string) || "Employed Full-time",
          religion: (profileData.religion as string) || "Christian",
          smoking: (profileData.smoking as string) || "Never",
          drinking: (profileData.drinking as string) || "Socially",
          hasChildren: (profileData.hasChildren as string) || "No",
          wantsChildren: (profileData.wantsChildren as string) || "Yes",
          aboutMe: (profileData.aboutMe as string) || "",
          keyValues: (profileData.keyValues as string[]) || ["Honesty", "Family", "Faith"],
          interestsHobbies: (profileData.interestsHobbies as string[]) || ["Reading", "Travel"],
          relationshipGoal: (profileData.relationshipGoal as string) || "Marriage within 1-2 years",
          profileCompletion: (profileData.profileCompletion as number) || 80,
          status: "SUBMITTED",
        },
      });
      profileId = created.id;
    }

    // Handle primary photo update
    if (body.avatar && profileId) {
      await prisma.photo.deleteMany({ where: { profileId, isPrimary: true } });
      await prisma.photo.create({
        data: {
          profileId,
          url: body.avatar,
          isPrimary: true,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");

    const updatedUser = await getUserById(session.userId);
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("[User Profile PUT API] Error:", error);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
