import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Video Podcast | Relationship Wahala & Connections" };

export default function PodcastPage() {
  return (
    <ComingSoonPage
      title="Relationship Wahala TV"
      description="Raw, insightful and expert-driven conversations about love, dating, marriage, conflict resolution and marital success. New episodes every week."
    />
  );
}
