// src/app/api/admin/packages/route.ts
// GET list of packages & POST create package (SUPER_ADMIN authorized)

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { getAllPackages, createPackage } from "@/lib/repositories/packages.repository";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    const packages = await getAllPackages();
    return NextResponse.json({ success: true, packages });
  } catch (error) {
    console.error("[Admin Packages GET API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch packages." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || body.price === undefined || !body.description) {
      return NextResponse.json({ error: "Name, description and price are required." }, { status: 400 });
    }

    const created = await createPackage({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: Number(body.price),
      durationDays: Number(body.durationDays || 30),
      matchAllowance: Number(body.matchAllowance || 5),
      features: Array.isArray(body.features) ? body.features : [],
      isPopular: Boolean(body.isPopular),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      type: body.type === "PHYSICAL" ? "PHYSICAL" : "ONLINE",
      sortOrder: Number(body.sortOrder || 0),
    });

    return NextResponse.json({ success: true, package: created });
  } catch (error) {
    console.error("[Admin Packages POST API] Error:", error);
    return NextResponse.json({ error: "Failed to create package." }, { status: 500 });
  }
}
