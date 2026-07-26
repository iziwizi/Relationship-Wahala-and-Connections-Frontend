import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/ComingSoonPage";

export const metadata: Metadata = { title: "Admin | Relationship Wahala & Connections" };

export default function AdminPage() {
  return (
    <ComingSoonPage
      title="Super Admin Dashboard"
      description="Platform administration area. Manage users, profiles, matchmaking, packages, payments, content and platform settings."
    />
  );
}
