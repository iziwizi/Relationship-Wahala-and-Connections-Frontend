// src/app/api/auth/register/route.ts
// Handles new member registration — creates User + Profile + MatchPreference atomically

import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { signSession, SESSION_COOKIE, SESSION_DURATION_MS } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";
import { createUserWithProfile, emailExists } from "@/lib/repositories/users.repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, unknown>;

    const email = (body.email as string)?.toLowerCase().trim();
    const password = body.password as string;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    if (isDatabaseMode()) {
      const exists = await emailExists(email);
      if (exists) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }
    }

    const passwordHash = await hashPassword(password);

    const dob = body.dateOfBirth
      ? new Date(body.dateOfBirth as string)
      : new Date(Date.now() - 30 * 365 * 24 * 60 * 60 * 1000);

    const user = await createUserWithProfile({
      email,
      passwordHash,
      firstName: (body.firstName as string) || "",
      lastName: (body.lastName as string) || "",
      phone: (body.phone as string) || "",
      dateOfBirth: dob,
      gender: (body.gender as string) || "",
      maritalStatus: (body.maritalStatus as string) || "Single (Never Married)",
      nationality: (body.nationality as string) || "Nigerian",
      stateOfOrigin: body.stateOfOrigin as string | undefined,
      currentCityState: (body.currentStateCity as string) || "",
      currentCountry: (body.currentCountry as string) || "Nigeria",
      educationLevel: (body.educationLevel as string) || "",
      profession: (body.profession as string) || "",
      employmentStatus: (body.employmentStatus as string) || "",
      religion: body.religion as string | undefined,
      smoking: (body.smoking as string) || "Never",
      drinking: (body.drinking as string) || "Never",
      hasChildren: (body.hasChildren as string) || "No",
      wantsChildren: (body.wantsChildren as string) || "Yes",
      aboutMe: (body.aboutMe as string) || "",
      keyValues: Array.isArray(body.myValues)
        ? body.myValues as string[]
        : [(body.myValues as string) || ""],
      interestsHobbies: Array.isArray(body.interestsHobbies)
        ? body.interestsHobbies as string[]
        : [(body.interestsHobbies as string) || ""],
      relationshipGoal: (body.relationshipGoal as string) || "Marriage",
      prefAgeMin: Number(body.prefAgeMin) || 25,
      prefAgeMax: Number(body.prefAgeMax) || 45,
      prefLocation: body.prefLocation as string | undefined,
      photoUrl: (body.photoUrl as string) || undefined,
    });

    const token = await signSession({
      userId: user.id,
      email,
      role: "MEMBER",
      firstName: (body.firstName as string) || "Member",
    });

    const response = NextResponse.json({ success: true, userId: user.id });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Register API]", error);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
