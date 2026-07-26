// middleware.ts — Next.js Edge Middleware for server-side route protection
// Runs on the Edge Runtime (no Node.js APIs — jose is Edge-compatible)

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";

const MEMBER_PROTECTED = ["/dashboard"];
const ADMIN_PROTECTED = ["/admin"];
const ADMIN_EXCLUDED = ["/admin/login"]; // Admin login is public

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ─── Admin routes ──────────────────────────────────────
  const isAdminPath = ADMIN_PROTECTED.some((p) => pathname.startsWith(p));
  const isAdminLoginPage = ADMIN_EXCLUDED.some((p) => pathname === p);

  if (isAdminPath && !isAdminLoginPage) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  }

  // ─── Member dashboard routes ───────────────────────────
  const isMemberPath = MEMBER_PROTECTED.some((p) => pathname.startsWith(p));

  if (isMemberPath) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Prevent SUPER_ADMIN from accessing member dashboard
    if (session.role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
