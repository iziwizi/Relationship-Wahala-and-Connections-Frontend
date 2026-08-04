// src/app/api/bookings/[reference]/route.ts
// GET Physical Booking details by booking reference for confirmation page

import { NextRequest, NextResponse } from "next/server";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;

    if (!reference) {
      return NextResponse.json({ error: "Booking reference required." }, { status: 400 });
    }

    if (!isDatabaseMode()) {
      return NextResponse.json({
        success: true,
        booking: {
          bookingReference: reference,
          customerName: "Valued Client",
          customerEmail: "client@example.com",
          customerPhone: "+234 800 000 0000",
          bookingDate: new Date().toISOString(),
          bookingTime: "10:00 AM",
          packageName: "Physical Matchmaking Package",
          amount: 30000,
          paymentStatus: "SUCCESSFUL",
          status: "CONFIRMED",
        },
      });
    }

    const { prisma } = await import("@/lib/db/prisma");
    const booking = await prisma.physicalBooking.findUnique({
      where: { bookingReference: reference },
      include: { package: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingReference: booking.bookingReference,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        bookingDate: booking.bookingDate.toISOString(),
        bookingTime: booking.bookingTime,
        packageName: booking.package.name,
        packageDescription: booking.package.description,
        amount: Number(booking.amount),
        currency: booking.currency,
        paymentStatus: booking.paymentStatus,
        status: booking.status,
        createdAt: booking.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[Booking GET API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch booking details." }, { status: 500 });
  }
}
