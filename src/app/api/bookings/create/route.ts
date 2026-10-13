// src/app/api/bookings/create/route.ts
// Creates a new Physical Booking record and sends email / notifications

import { NextRequest, NextResponse } from "next/server";
import { isDatabaseMode } from "@/lib/db/mode";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { sendBookingConfirmationEmail, sendEmail } from "@/lib/email/email.service";

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

    // Validate booking date
    const dateObj = new Date(bookingDate);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid appointment date selected." },
        { status: 400 }
      );
    }

    // Strict Saturday & Sunday only validation (check both UTC and local interpretations to prevent timezone mismatches)
    const utcDay = dateObj.getUTCDay(); // 0 is Sunday, 6 is Saturday
    const localDay = dateObj.getDay();
    const isWeekend = utcDay === 0 || utcDay === 6 || localDay === 0 || localDay === 6;

    if (!isWeekend) {
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
      // Demo response with email dispatch
      try {
        await sendBookingConfirmationEmail({
          to: customerEmail,
          customerName,
          bookingReference,
          packageName: "Physical Matchmaking Package",
          bookingDate: dateObj.toDateString(),
          bookingTime,
          amount: 30000,
          paymentMethod: paymentMethod || "BANK_TRANSFER",
          bankDetails: {
            bankName: "First Bank of Nigeria",
            accountName: "Relationship Wahala and Connections Services",
            accountNumber: "2049581735",
          },
        });
      } catch (err) {
        console.error("[Demo Booking Email Error]:", err);
      }

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
        paymentStatus: "SUCCESSFUL",
        paymentMethod: paymentMethod || "BANK_TRANSFER",
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

    // 2. Dispatch real booking confirmation email to customer
    try {
      await sendBookingConfirmationEmail({
        to: customerEmail,
        customerName,
        bookingReference,
        packageName: pkg.name,
        bookingDate: dateObj.toDateString(),
        bookingTime,
        amount: Number(booking.amount),
        paymentMethod: paymentMethod || "BANK_TRANSFER",
        bankDetails: {
          bankName: "First Bank of Nigeria",
          accountName: "Relationship Wahala and Connections Services",
          accountNumber: "2049581735",
        },
      });
      console.log(`[EMAIL DISPATCH] Successfully sent booking confirmation email to customer ${customerEmail} (Ref: ${bookingReference})`);
    } catch (emailErr) {
      console.error("[Booking Email Error]:", emailErr);
    }

    // 3. Dispatch notification email to Admin
    try {
      const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "hello@relationshipwahalaandconnections.com";
      await sendEmail({
        to: adminEmail,
        subject: `New Physical Consultation Booking (${bookingReference}) — ${customerName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #7b1d2a;">New Physical Consultation Booking Received</h2>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
            <p><strong>Package:</strong> ${pkg.name}</p>
            <p><strong>Scheduled Date:</strong> ${dateObj.toDateString()} at ${bookingTime}</p>
            <p><strong>Amount:</strong> ₦${Number(booking.amount).toLocaleString()}</p>
            <p><strong>Booking Reference:</strong> ${bookingReference}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod || "BANK_TRANSFER"}</p>
            <p><strong>Notes:</strong> ${notes || "None provided"}</p>
          </div>
        `,
      });
      console.log(`[ADMIN EMAIL DISPATCH] Sent booking notification email to Admin for ${customerName}`);
    } catch (adminEmailErr) {
      console.error("[Admin Email Error]:", adminEmailErr);
    }

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
