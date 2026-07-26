"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fbf5ec] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#7b1d2a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-sans text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
