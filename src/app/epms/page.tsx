import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "EPMS | Relationship Wahala & Connections" };

export default function EPMSPage() {
  return (
    <ComingSoonPage
      title="Executive Physical Matchmaking System"
      description="A premium, confidential and personalised matchmaking experience for the discerning individual. Private consultation, personality assessment, and expert guidance."
    />
  );
}
