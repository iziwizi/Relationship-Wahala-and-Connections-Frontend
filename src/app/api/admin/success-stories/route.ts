import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const stories = await prisma.successStory.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, stories });
  } catch (error) {
    console.error("admin/success-stories GET error:", error);
    return NextResponse.json({ error: "Failed to load stories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, displayNames, location, weddingDate, story, photoUrl, featured, status } = body;
    if (!title || !story) return NextResponse.json({ error: "Title and story are required" }, { status: 400 });
    const slug = displayNames
      ? displayNames.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now()
      : "story-" + Date.now();
    const record = await prisma.successStory.create({
      data: { title, slug, displayNames: displayNames || "", location: location || "", weddingDate: weddingDate || null, story, photoUrl: photoUrl || "", featured: featured || false, status: status || "PUBLISHED" },
    });
    return NextResponse.json({ success: true, story: record });
  } catch (error) {
    console.error("admin/success-stories POST error:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
