// src/app/api/admin/bookings/route.ts
// GET list of physical bookings for Super Admin management

import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";
import { isDatabaseMode } from "@/lib/db/mode";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Admin privileges required." }, { status: 401 });
    }

    if (!isDatabaseMode()) {
      return NextResponse.json({
        success: true,
        bookings: [
          {
            id: "book-1",
            bookingReference: "RW-PHYS-A1B2C3",
            customerName: "Dr. Amina Bello",
            customerEmail: "amina@example.com",
            customerPhone: "+234 802 987 6543",
            bookingDate: new Date().toISOString(),
            bookingTime: "10:00 AM",
            amount: 30000,
            currency: "NGN",
            paymentStatus: "SUCCESSFUL",
            status: "CONFIRMED",
            package: { name: "Standard Matchmaking" },
            createdAt: new Date().toISOString(),
          },
        ],
      });
    }

    const { prisma } = await import("@/lib/db/prisma");
    const bookings = await prisma.physicalBooking.findMany({
      include: {
        package: {
          select: { name: true, price: true },
        },
        user: {
          select: { email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = bookings.map((b) => ({
      id: b.id,
      bookingReference: b.bookingReference,
      customerName: b.customerName,
      customerEmail: b.customerEmail,
      customerPhone: b.customerPhone,
      bookingDate: b.bookingDate.toISOString(),
      bookingTime: b.bookingTime,
      amount: Number(b.amount),
      currency: b.currency,
      paymentStatus: b.paymentStatus,
      paymentMethod: b.paymentMethod,
      status: b.status,
      notes: b.notes,
      package: {
        name: b.package.name,
        price: Number(b.package.price),
      },
      userEmail: b.user?.email || null,
      createdAt: b.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, bookings: formatted });
  } catch (error) {
    console.error("[Admin Bookings GET API] Error:", error);
    return NextResponse.json({ error: "Failed to fetch physical bookings." }, { status: 500 });
  }
}
