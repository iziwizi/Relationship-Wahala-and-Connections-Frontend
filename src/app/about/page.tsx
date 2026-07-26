import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "About Us | Relationship Wahala & Connections" };

export default function AboutPage() {
  return (
    <ComingSoonPage
      title="About Us"
      description="Learn about our story, our mission, and the team behind Relationship Wahala & Connections — Nigeria's premier knowledge-based relationship platform."
    />
  );
}
