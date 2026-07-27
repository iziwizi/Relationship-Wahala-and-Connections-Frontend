import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET /api/admin/matches/members — list all verified members for the dropdown
export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      where: { status: "VERIFIED" },
      include: { user: { select: { id: true, email: true } } },
      orderBy: { firstName: "asc" },
    });

    const members = profiles.map((p) => {
      const dob = p.dateOfBirth;
      const age = dob
        ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
        : 0;
      return {
        id: p.userId,
        profileId: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        age,
        gender: p.gender,
        location: p.currentCityState,
        profession: p.profession,
      };
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("matches/members error:", error);
    return NextResponse.json({ error: "Failed to load members" }, { status: 500 });
  }
}
