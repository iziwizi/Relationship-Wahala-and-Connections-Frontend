import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Intentional Matchmaking | Relationship Wahala & Connections" };

export default function MatchmakingPage() {
  return (
    <ComingSoonPage
      title="Intentional Matchmaking"
      description="Our matchmaking service connects compatible singles locally and globally, focusing on shared values, vision, and long-term marital compatibility."
    />
  );
}
