import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, events });
  } catch (error) {
    console.error("admin/events GET error:", error);
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, eventDate, eventTime, location, isOnline, registrationUrl, image, status } = body;
    if (!title || !eventDate) return NextResponse.json({ error: "Title and event date are required" }, { status: 400 });
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    const event = await prisma.event.create({
      data: {
        title, slug, description: description || "", eventDate: new Date(eventDate),
        eventTime: eventTime || "TBD", location: location || "", isOnline: isOnline || false,
        registrationUrl: registrationUrl || null, image: image || null, status: status || "PUBLISHED",
      },
    });
    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("admin/events POST error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
