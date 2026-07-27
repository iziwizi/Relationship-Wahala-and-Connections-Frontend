import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guide = await prisma.guide.findUnique({ where: { id } });
    if (!guide) return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    return NextResponse.json({ success: true, guide });
  } catch (error) {
    console.error("admin/guides/[id] GET error:", error);
    return NextResponse.json({ error: "Failed to load guide" }, { status: 500 });
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
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.featuredImage !== undefined) updateData.featuredImage = body.featuredImage || null;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.status !== undefined) updateData.status = body.status;
    const guide = await prisma.guide.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, guide });
  } catch (error) {
    console.error("admin/guides/[id] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update guide" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.guide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("admin/guides/[id] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete guide" }, { status: 500 });
  }
}
