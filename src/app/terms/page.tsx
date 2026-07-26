import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Terms of Use | Relationship Wahala & Connections" };

export default function TermsPage() {
  return (
    <ComingSoonPage
      title="Terms of Use"
      description="By using Relationship Wahala & Connections, you agree to our terms and conditions. Please read these carefully."
    />
  );
}
