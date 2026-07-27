import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const guides = await prisma.guide.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, guides });
  } catch (error) {
    console.error("admin/guides GET error:", error);
    return NextResponse.json({ error: "Failed to load guides" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, category, featuredImage, featured, status } = body;
    if (!title || !content) return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    const guide = await prisma.guide.create({
      data: { title, slug, excerpt: excerpt || "", content, category: category || "Marriage", featuredImage: featuredImage || null, featured: featured || false, status: status || "PUBLISHED" },
    });
    return NextResponse.json({ success: true, guide });
  } catch (error) {
    console.error("admin/guides POST error:", error);
    return NextResponse.json({ error: "Failed to create guide" }, { status: 500 });
  }
}
