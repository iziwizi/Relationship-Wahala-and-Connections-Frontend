import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// PATCH /api/admin/enquiries/[id] — update status and/or notes
// If a response (notes) is saved and a registered member submitted the enquiry,
// create an in-app Notification for that member.
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

    // If admin saved a response (notes), try to notify the member
    if (notes && notes.trim()) {
      try {
        // Look up member by email (ContactEnquiry.email matches User.email)
        const memberUser = await prisma.user.findUnique({
          where: { email: updated.email },
          select: { id: true },
        });
        if (memberUser) {
          await prisma.notification.create({
            data: {
              userId: memberUser.id,
              title: "Response to Your Enquiry",
              message: `Our team has responded to your enquiry: "${notes.slice(0, 120)}${notes.length > 120 ? "..." : ""}"`,
              link: "/dashboard/notifications",
            },
          });
        }
      } catch (notifErr) {
        // Non-fatal — don't fail the PATCH if notification creation fails
        console.error("enquiry notification error:", notifErr);
      }
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    console.error("enquiries PATCH error:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}
