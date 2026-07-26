import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Register | Relationship Wahala & Connections" };

export default function RegisterPage() {
  return (
    <ComingSoonPage
      title="Join Our Community"
      description="Create your account and join a community of intentional singles and couples committed to building healthy, lasting relationships."
    />
  );
}
