// src/app/api/admin/bookings/[id]/route.ts
// PATCH/DELETE physical booking status or details for Super Admin

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function PATCH(
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
    const { status, paymentStatus, notes } = body;

    if (!isDatabaseMode()) {
      return NextResponse.json({ success: true });
    }

    const { prisma } = await import("@/lib/db/prisma");
    const updated = await prisma.physicalBooking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("[Admin Booking PATCH API] Error:", error);
    return NextResponse.json({ error: "Failed to update booking." }, { status: 500 });
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

    if (!isDatabaseMode()) {
      return NextResponse.json({ success: true });
    }

    const { prisma } = await import("@/lib/db/prisma");
    await prisma.physicalBooking.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Booking DELETE API] Error:", error);
    return NextResponse.json({ error: "Failed to delete booking." }, { status: 500 });
  }
}
