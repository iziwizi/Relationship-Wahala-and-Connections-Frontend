import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET /api/admin/enquiries — list all contact enquiries
export async function GET() {
  try {
    const enquiries = await prisma.contactEnquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ enquiries });
  } catch (error) {
    console.error("enquiries GET error:", error);
    return NextResponse.json({ error: "Failed to load enquiries" }, { status: 500 });
  }
}
