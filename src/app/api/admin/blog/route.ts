import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET /api/admin/blog — list all blog posts
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("admin/blog GET error:", error);
    return NextResponse.json({ error: "Failed to load blog posts" }, { status: 500 });
  }
}

// POST /api/admin/blog — create blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, featuredImage, author, status, featured, categoryId } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        featuredImage: featuredImage || null,
        author: author || "Relationship Wahala Team",
        status: status || "PUBLISHED",
        featured: featured || false,
        categoryId: categoryId || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("admin/blog POST error:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}
