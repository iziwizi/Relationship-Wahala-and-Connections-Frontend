import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Matchmaking Packages | Relationship Wahala & Connections" };

export default function PricingPage() {
  return (
    <ComingSoonPage
      title="Matchmaking Packages"
      description="Choose the matchmaking package that's right for you. Our packages are designed to give you the best chance of finding your life partner."
    />
  );
}
