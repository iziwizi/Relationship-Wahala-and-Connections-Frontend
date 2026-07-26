// src/app/api/auth/admin-login/route.ts
// Super Admin login — role-restricted to SUPER_ADMIN only

import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { signSession, SESSION_COOKIE, SESSION_DURATION_MS } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";
import { getUserByEmail, updateLastLogin } from "@/lib/repositories/users.repository";

const DEMO_ADMIN = {
  email: "admin@relationshipwahala.com",
  password: "Admin@123",
  id: "demo-admin-001",
  firstName: "Super Admin",
};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json() as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let userId: string, userEmail: string, firstName: string;

    if (!isDatabaseMode()) {
      if (normalizedEmail !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
        return NextResponse.json({ error: "Access denied. Invalid admin credentials." }, { status: 401 });
      }
      userId = DEMO_ADMIN.id;
      userEmail = DEMO_ADMIN.email;
      firstName = DEMO_ADMIN.firstName;
    } else {
      const user = await getUserByEmail(normalizedEmail);

      if (!user || user.role !== "SUPER_ADMIN" || !user.isActive) {
        return NextResponse.json({ error: "Access denied. Invalid admin credentials." }, { status: 401 });
      }

      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) {
        return NextResponse.json({ error: "Access denied. Invalid admin credentials." }, { status: 401 });
      }

      userId = user.id;
      userEmail = user.email;
      firstName = user.profile?.firstName ?? "Admin";
      await updateLastLogin(user.id);
    }

    const token = await signSession({
      userId,
      email: userEmail,
      role: "SUPER_ADMIN",
      firstName,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: userId, email: userEmail, firstName, role: "SUPER_ADMIN" },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_MS / 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Admin Login API]", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
