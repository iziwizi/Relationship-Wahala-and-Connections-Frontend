// src/app/api/auth/login/route.ts
// Server-side member login — validates credentials, issues JWT session cookie

import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { signSession, SESSION_COOKIE, SESSION_DURATION_MS } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";
import { getUserByEmail, updateLastLogin } from "@/lib/repositories/users.repository";

// Demo credentials for when DB is not connected
const DEMO_CREDENTIALS = {
  member: { email: "demo@relationshipwahala.com", password: "Demo@123", id: "demo-user-101", firstName: "Daniel", role: "MEMBER" as const },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let userId: string;
    let userEmail: string;
    let firstName: string;
    let role: "MEMBER" | "SUPER_ADMIN";

    if (!isDatabaseMode()) {
      // Demo mode — check hardcoded credentials
      const demo = DEMO_CREDENTIALS.member;
      if (normalizedEmail !== demo.email || password !== demo.password) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }
      userId = demo.id;
      userEmail = demo.email;
      firstName = demo.firstName;
      role = demo.role;
    } else {
      // Database mode — validate against real DB
      let user;
      try {
        user = await getUserByEmail(normalizedEmail);
      } catch (dbErr) {
        // Sanitised: never expose connection strings or DB internals to the browser
        const errMsg = dbErr instanceof Error ? dbErr.message : String(dbErr);
        console.error("[Login API] Database error:", errMsg.replace(/postgres:\/\/[^@]+@[^/]+/g, "postgres://***@***"));
        return NextResponse.json(
          { error: "Unable to sign in right now. Please try again shortly." },
          { status: 503 }
        );
      }

      if (!user || !user.isActive) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      if (user.role === "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Admin accounts must sign in via the Admin Portal." },
          { status: 403 }
        );
      }

      let valid = false;
      try {
        valid = await verifyPassword(password, user.passwordHash);
      } catch (hashErr) {
        console.error("[Login API] Password verification error:", hashErr instanceof Error ? hashErr.message : "unknown");
        return NextResponse.json(
          { error: "Unable to sign in right now. Please try again shortly." },
          { status: 503 }
        );
      }

      if (!valid) {
        return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
      }

      userId = user.id;
      userEmail = user.email;
      firstName = user.profile?.firstName ?? "Member";
      role = user.role;

      // Non-blocking — don't fail login if this throws
      updateLastLogin(user.id).catch((e: unknown) => {
        console.error("[Login API] updateLastLogin failed:", e instanceof Error ? e.message : "unknown");
      });
    }

    // Sign JWT session
    const token = await signSession({ userId, email: userEmail, role, firstName });

    const response = NextResponse.json({
      success: true,
      user: { id: userId, email: userEmail, firstName, role },
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
    console.error("[Login API] Unhandled error:", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      { error: "Unable to sign in right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
