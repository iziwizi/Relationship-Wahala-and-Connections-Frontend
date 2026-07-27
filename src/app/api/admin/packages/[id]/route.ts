// src/app/api/admin/packages/[id]/route.ts
// GET & PUT package editing endpoint (SUPER_ADMIN authorized)

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { getPackageById, updatePackage } from "@/lib/repositories/packages.repository";
import { revalidatePath } from "next/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    const { id } = await params;
    const pkg = await getPackageById(id);

    if (!pkg) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, package: pkg });
  } catch (error) {
    console.error("[Admin Package GET ID API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch package." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await updatePackage(id, {
      ...(body.name && { name: body.name }),
      ...(body.slug && { slug: body.slug }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.price !== undefined && { price: Number(body.price) }),
      ...(body.durationDays !== undefined && { durationDays: Number(body.durationDays) }),
      ...(body.matchAllowance !== undefined && { matchAllowance: Number(body.matchAllowance) }),
      ...(body.features && { features: Array.isArray(body.features) ? body.features : [] }),
      ...(body.isPopular !== undefined && { isPopular: Boolean(body.isPopular) }),
      ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
    });

    if (!updated) {
      return NextResponse.json({ error: "Package update failed or ID invalid." }, { status: 400 });
    }

    revalidatePath("/pricing");
    revalidatePath("/admin/packages");

    return NextResponse.json({ success: true, package: updated });
  } catch (error) {
    console.error("[Admin Package PUT ID API] Error:", error);
    return NextResponse.json({ error: "Failed to update package." }, { status: 500 });
  }
}
