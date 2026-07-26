import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Services | Relationship Wahala & Connections" };

export default function ServicesPage() {
  return (
    <ComingSoonPage
      title="Our Services"
      description="Explore our full range of relationship services including intentional matchmaking, pre-marital counseling, relationship solutions, and our video podcast."
    />
  );
}
