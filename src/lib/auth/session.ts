// src/lib/auth/session.ts
// Server-side JWT session management using jose (Edge Runtime compatible)
// Used in API routes and middleware for auth validation

import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rwc-dev-secret-change-in-production-min32chars";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export const SESSION_COOKIE = "rwc_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: "MEMBER" | "SUPER_ADMIN";
  firstName: string;
  iat?: number;
  exp?: number;
}

export async function signSession(payload: Omit<SessionPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
