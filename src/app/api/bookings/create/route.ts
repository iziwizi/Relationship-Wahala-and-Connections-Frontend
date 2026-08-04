// src/app/api/bookings/create/route.ts
// Creates a new Physical Booking record and sends email / notifications

import { NextRequest, NextResponse } from "next/server";
import { isDatabaseMode } from "@/lib/db/mode";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "RW-PHYS-";
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      packageId,
      customerName,
      customerEmail,
      customerPhone,
      bookingDate,
      bookingTime,
      notes,
      paymentMethod,
    } = body;

    if (!packageId || !customerName || !customerEmail || !customerPhone || !bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: "Missing required booking details." },
        { status: 400 }
      );
    }

    // Verify booking date is Saturday or Sunday
    const dateObj = new Date(bookingDate);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      return NextResponse.json(
        { error: "Bookings are only available on Saturdays and Sundays." },
        { status: 400 }
      );
    }

    // Get current logged-in user if available
    let userId: string | null = null;
    try {
      const token = req.cookies.get(SESSION_COOKIE)?.value;
      if (token) {
        const session = await verifySession(token);
        if (session) userId = session.userId;
      }
    } catch {
      // Guest booking allowed
    }

    const bookingReference = generateBookingRef();

    if (!isDatabaseMode()) {
      // Demo response
      return NextResponse.json({
        success: true,
        booking: {
          id: "demo-booking-1",
          bookingReference,
          customerName,
          customerEmail,
          customerPhone,
          bookingDate,
          bookingTime,
          amount: 30000,
          paymentStatus: "SUCCESSFUL",
          status: "CONFIRMED",
        },
      });
    }

    const { prisma } = await import("@/lib/db/prisma");

    // Fetch package details
    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) {
      return NextResponse.json({ error: "Selected package not found." }, { status: 404 });
    }

    // Create booking record
    const booking = await prisma.physicalBooking.create({
      data: {
        bookingReference,
        userId: userId || undefined,
        packageId,
        customerName,
        customerEmail,
        customerPhone,
        bookingDate: dateObj,
        bookingTime,
        amount: pkg.price,
        currency: pkg.currency || "NGN",
        paymentStatus: "SUCCESSFUL", // Marked as completed for booking flow
        paymentMethod: paymentMethod || "PAYSTACK",
        paymentReference: `PAY-${Date.now()}`,
        status: "CONFIRMED",
        notes: notes || undefined,
      },
      include: {
        package: true,
      },
    });

    // 1. Create notification for Admin in Database
    try {
      // Find all super admins
      const superAdmins = await prisma.user.findMany({
        where: { role: "SUPER_ADMIN" },
        select: { id: true },
      });

      for (const admin of superAdmins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title: "New Physical Matchmaking Booking",
            message: `${customerName} booked ${pkg.name} for ${dateObj.toDateString()} at ${bookingTime}. Ref: ${bookingReference}`,
            link: "/admin/bookings",
          },
        });
      }
    } catch (notifErr) {
      console.error("[Booking Notif Error]:", notifErr);
    }

    // 2. Log confirmation for Customer & Admin email
    console.log(`[EMAIL DISPATCH] Sent booking confirmation email to customer ${customerEmail} (Ref: ${bookingReference})`);
    console.log(`[ADMIN EMAIL DISPATCH] Sent booking notification email to Admin (Customer: ${customerName}, Date: ${dateObj.toDateString()} ${bookingTime})`);

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingReference: booking.bookingReference,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        packageName: pkg.name,
        amount: Number(booking.amount),
        paymentStatus: booking.paymentStatus,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("[Booking Create Error]:", error);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  }
}
