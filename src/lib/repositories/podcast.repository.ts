// src/lib/repositories/podcast.repository.ts
import { isDatabaseMode } from "@/lib/db/mode";
import { demoPodcasts, DemoPodcastEpisode } from "@/data/demo/cms";

export async function getAllPodcastEpisodes(): Promise<DemoPodcastEpisode[]> {
  if (!isDatabaseMode()) return demoPodcasts;
  const { prisma } = await import("@/lib/db/prisma");
  const episodes = await prisma.podcastEpisode.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return episodes.map((e) => ({
    id: e.id,
    title: e.title,
    slug: e.slug,
    description: e.description,
    youtubeUrl: e.youtubeUrl,
    youtubeVideoId: e.youtubeVideoId,
    thumbnail: e.thumbnail,
    duration: e.duration,
    views: e.views,
    publishedAt: e.publishedAt.toISOString().split("T")[0],
    featured: e.featured,
  }));
}
