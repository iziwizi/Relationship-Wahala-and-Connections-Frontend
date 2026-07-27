import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const record = await prisma.successStory.findUnique({ where: { id } });
    if (!record) return NextResponse.json({ error: "Story not found" }, { status: 404 });
    return NextResponse.json({ success: true, story: record });
  } catch (error) {
    console.error("admin/success-stories/[id] GET error:", error);
    return NextResponse.json({ error: "Failed to load story" }, { status: 500 });
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
    if (body.displayNames !== undefined) updateData.displayNames = body.displayNames;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.weddingDate !== undefined) updateData.weddingDate = body.weddingDate || null;
    if (body.story !== undefined) updateData.story = body.story;
    if (body.photoUrl !== undefined) updateData.photoUrl = body.photoUrl || "";
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.status !== undefined) updateData.status = body.status;
    const record = await prisma.successStory.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, story: record });
  } catch (error) {
    console.error("admin/success-stories/[id] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update story" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.successStory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin/success-stories/[id] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
