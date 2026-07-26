// src/lib/repositories/guides.repository.ts
import { isDatabaseMode } from "@/lib/db/mode";
import { demoGuides, DemoGuide } from "@/data/demo/cms";

export async function getAllGuides(): Promise<DemoGuide[]> {
  if (!isDatabaseMode()) return demoGuides;
  try {
    const { prisma } = await import("@/lib/db/prisma");
    const guides = await prisma.guide.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
    return guides.map((g) => ({
      id: g.id,
      title: g.title,
      slug: g.slug,
      excerpt: g.excerpt,
      content: g.content,
      category: g.category,
      featuredImage: g.featuredImage || "/images/service-resources.jpg",
      publishedAt: g.publishedAt.toISOString().split("T")[0],
      featured: g.featured,
    }));
  } catch (err) {
    console.warn("[Guides Repository] DB query failed, falling back to demo data:", err);
    return demoGuides;
  }
}

export async function getGuideBySlug(slug: string): Promise<DemoGuide | null> {
  if (!isDatabaseMode()) {
    return demoGuides.find((g) => g.slug === slug) ?? null;
  }
  try {
    const { prisma } = await import("@/lib/db/prisma");
    const g = await prisma.guide.findUnique({ where: { slug } });
    if (!g) return null;
    return {
      id: g.id,
      title: g.title,
      slug: g.slug,
      excerpt: g.excerpt,
      content: g.content,
      category: g.category,
      featuredImage: g.featuredImage || "/images/service-resources.jpg",
      publishedAt: g.publishedAt.toISOString().split("T")[0],
      featured: g.featured,
    };
  } catch (err) {
    console.warn("[Guides Repository] DB query failed, falling back to demo data:", err);
    return demoGuides.find((g) => g.slug === slug) ?? null;
  }
}
