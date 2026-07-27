import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// PATCH /api/admin/enquiries/[id] — update status and/or notes
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.contactEnquiry.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ enquiry: updated });
  } catch (error) {
    console.error("enquiries PATCH error:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}
