// src/app/api/packages/route.ts
// Public API route to fetch active packages by type (ONLINE or PHYSICAL)

import { NextRequest, NextResponse } from "next/server";
import { getActivePackages } from "@/lib/repositories/packages.repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get("type")?.toUpperCase();
    const type = typeParam === "PHYSICAL" || typeParam === "ONLINE" ? typeParam : undefined;

    const packages = await getActivePackages(type);
    return NextResponse.json({ success: true, packages });
  } catch (error) {
    console.error("[Packages Public GET API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch packages." }, { status: 500 });
  }
}
