import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Contact Us | Relationship Wahala & Connections" };

export default function ContactPage() {
  return (
    <ComingSoonPage
      title="Contact Us"
      description="Get in touch with the Relationship Wahala & Connections team. We'd love to hear from you and help you on your relationship journey."
    />
  );
}
