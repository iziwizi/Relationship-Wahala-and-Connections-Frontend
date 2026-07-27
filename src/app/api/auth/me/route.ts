// src/app/api/auth/me/route.ts
// Returns current session user & profile data from HttpOnly cookie and PostgreSQL

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";
import { getUserById } from "@/lib/repositories/users.repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const session = await verifySession(token);

  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  if (!isDatabaseMode()) {
    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
        firstName: session.firstName,
      },
    });
  }

  try {
    const dbUser = await getUserById(session.userId);

    if (!dbUser) {
      return NextResponse.json({
        user: {
          id: session.userId,
          email: session.email,
          role: session.role,
          firstName: session.firstName,
        },
      });
    }

    const p = dbUser.profile;
    const primaryPhoto = p?.photos?.find((photo) => photo.isPrimary)?.url || p?.photos?.[0]?.url;

    return NextResponse.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
        firstName: p?.firstName || session.firstName,
        lastName: p?.lastName || "",
        phone: p?.phone || "",
        status: p?.status || "PENDING_VERIFICATION",
        profileCompletion: p?.profileCompletion ?? 75,
        avatar: primaryPhoto || null,
        profession: p?.profession || "",
        location: p?.currentCityState || "",
      },
    });
  } catch (err) {
    console.error("[api/auth/me] Error fetching user profile:", err);
    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
        firstName: session.firstName,
      },
    });
  }
}
