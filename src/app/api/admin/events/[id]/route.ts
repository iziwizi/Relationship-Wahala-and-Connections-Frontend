import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    // Serialize eventDate to string for the form
    return NextResponse.json({ success: true, event: { ...event, eventDate: event.eventDate.toISOString().split("T")[0] } });
  } catch (error) {
    console.error("admin/events/[id] GET error:", error);
    return NextResponse.json({ error: "Failed to load event" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData: Record<string, unknown> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.eventDate !== undefined) updateData.eventDate = new Date(body.eventDate);
    if (body.eventTime !== undefined) updateData.eventTime = body.eventTime;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.isOnline !== undefined) updateData.isOnline = body.isOnline;
    if (body.registrationUrl !== undefined) updateData.registrationUrl = body.registrationUrl || null;
    if (body.image !== undefined) updateData.image = body.image || null;
    if (body.status !== undefined) updateData.status = body.status;
    const event = await prisma.event.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("admin/events/[id] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin/events/[id] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
