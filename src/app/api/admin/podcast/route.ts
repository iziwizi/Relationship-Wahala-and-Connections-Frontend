import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const episodes = await prisma.podcastEpisode.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, episodes });
  } catch (error) {
    console.error("admin/podcast GET error:", error);
    return NextResponse.json({ error: "Failed to load episodes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, youtubeUrl, youtubeVideoId, thumbnail, duration, featured, status } = body;
    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: "Title and YouTube URL are required" }, { status: 400 });
    }
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    const episode = await prisma.podcastEpisode.create({
      data: { title, slug, description: description || "", youtubeUrl, youtubeVideoId: youtubeVideoId || "", thumbnail: thumbnail || "", duration: duration || "0:00", featured: featured || false, status: status || "PUBLISHED" },
    });
    return NextResponse.json({ success: true, episode });
  } catch (error) {
    console.error("admin/podcast POST error:", error);
    return NextResponse.json({ error: "Failed to create episode" }, { status: 500 });
  }
}
