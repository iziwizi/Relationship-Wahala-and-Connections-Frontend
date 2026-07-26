import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Privacy Policy | Relationship Wahala & Connections" };

export default function PrivacyPage() {
  return (
    <ComingSoonPage
      title="Privacy Policy"
      description="Our privacy policy explains how we collect, use, and protect your personal information. Your privacy and confidentiality are our top priority."
    />
  );
}
