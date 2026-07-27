import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const episode = await prisma.podcastEpisode.findUnique({ where: { id } });
    if (!episode) return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    return NextResponse.json({ success: true, episode });
  } catch (error) {
    console.error("admin/podcast/[id] GET error:", error);
    return NextResponse.json({ error: "Failed to load episode" }, { status: 500 });
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
    if (body.youtubeUrl !== undefined) updateData.youtubeUrl = body.youtubeUrl;
    if (body.youtubeVideoId !== undefined) updateData.youtubeVideoId = body.youtubeVideoId;
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail || "";
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.status !== undefined) updateData.status = body.status;
    const episode = await prisma.podcastEpisode.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, episode });
  } catch (error) {
    console.error("admin/podcast/[id] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update episode" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.podcastEpisode.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin/podcast/[id] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete episode" }, { status: 500 });
  }
}
