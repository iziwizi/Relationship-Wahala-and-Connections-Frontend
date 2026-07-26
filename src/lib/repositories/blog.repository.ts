// src/lib/repositories/blog.repository.ts
import { isDatabaseMode } from "@/lib/db/mode";
import { demoBlogPosts, DemoBlogPost } from "@/data/demo/cms";

export async function getAllBlogPosts(): Promise<DemoBlogPost[]> {
  if (!isDatabaseMode()) return demoBlogPosts;
  const { prisma } = await import("@/lib/db/prisma");
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    category: "General",
    author: p.author,
    publishedAt: p.publishedAt.toISOString().split("T")[0],
    featuredImage: p.featuredImage || "/images/service-counseling.jpg",
    featured: p.featured,
  }));
}

export async function getBlogPostBySlug(slug: string): Promise<DemoBlogPost | null> {
  if (!isDatabaseMode()) {
    return demoBlogPosts.find((p) => p.slug === slug) ?? null;
  }
  const { prisma } = await import("@/lib/db/prisma");
  const p = await prisma.blogPost.findUnique({ where: { slug } });
  if (!p) return null;
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    category: "General",
    author: p.author,
    publishedAt: p.publishedAt.toISOString().split("T")[0],
    featuredImage: p.featuredImage || "/images/service-counseling.jpg",
    featured: p.featured,
  };
}
