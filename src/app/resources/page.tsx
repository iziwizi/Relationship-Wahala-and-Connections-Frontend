import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Resources | Relationship Wahala & Connections" };

export default function ResourcesPage() {
  return (
    <ComingSoonPage
      title="Relationship Resources"
      description="Access our blog, relationship guides, success stories, events and FAQs — all designed to help you build healthy, lasting relationships."
    />
  );
}
