// src/lib/repositories/success-stories.repository.ts
import { isDatabaseMode } from "@/lib/db/mode";
import { demoSuccessStories, DemoSuccessStory } from "@/data/demo/cms";

export async function getAllSuccessStories(): Promise<DemoSuccessStory[]> {
  if (!isDatabaseMode()) return demoSuccessStories;
  try {
    const { prisma } = await import("@/lib/db/prisma");
    const stories = await prisma.successStory.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });
    return stories.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      displayNames: s.displayNames,
      location: s.location,
      weddingDate: s.weddingDate || "",
      story: s.story,
      photoUrl: s.photoUrl,
      featured: s.featured,
    }));
  } catch (err) {
    console.warn("[Success Stories Repository] DB query failed, falling back to demo data:", err);
    return demoSuccessStories;
  }
}
