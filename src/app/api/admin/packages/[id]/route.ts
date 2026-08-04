// src/app/api/admin/packages/[id]/route.ts
// GET, PUT & DELETE package endpoint (SUPER_ADMIN authorized)
// DELETE: attempts hard delete; if FK constraint exists, soft-deletes (isActive=false) instead.

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { getPackageById, updatePackage, deletePackage } from "@/lib/repositories/packages.repository";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

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
      ...(body.type && { type: body.type }),
      ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
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

export async function DELETE(
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

    // Verify the package exists first
    const existing = await getPackageById(id);
    if (!existing) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    try {
      // Attempt hard delete from PostgreSQL
      await deletePackage(id);

      revalidatePath("/pricing");
      revalidatePath("/admin/packages");

      return NextResponse.json({ success: true, deleted: true, message: "Package permanently deleted." });
    } catch (deleteError: unknown) {
      // FK constraint: package has linked subscriptions, payments, or bookings
      // Fall back to soft delete — deactivate the package instead
      const isConstraintError =
        deleteError instanceof Error &&
        (deleteError.message.includes("Foreign key constraint") ||
          deleteError.message.includes("foreign key") ||
          deleteError.message.includes("violates") ||
          // Prisma error code for FK constraint violation
          (deleteError as { code?: string }).code === "P2003" ||
          (deleteError as { code?: string }).code === "P2014");

      if (isConstraintError) {
        // Soft-delete: deactivate the package so it no longer appears publicly
        await updatePackage(id, { isActive: false });

        revalidatePath("/pricing");
        revalidatePath("/admin/packages");

        return NextResponse.json({
          success: true,
          deleted: false,
          softDeleted: true,
          message:
            "This package has linked subscriptions or payment records and cannot be permanently deleted. It has been deactivated and hidden from the public instead.",
        });
      }

      // Unknown error — rethrow
      throw deleteError;
    }
  } catch (error) {
    console.error("[Admin Package DELETE ID API] Error:", error);
    return NextResponse.json({ error: "Failed to delete package. Please try again." }, { status: 500 });
  }
}
