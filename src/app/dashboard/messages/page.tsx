"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Messages</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Conversations with your matches will appear here.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="w-20 h-20 bg-[#7b1d2a]/8 rounded-full flex items-center justify-center mb-6">
            <MessageSquare size={36} className="text-[#7b1d2a]/40" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#1a1a1a] mb-3">
            No Conversations Yet
          </h2>
          <p className="font-sans text-sm text-gray-500 max-w-md leading-relaxed">
            Your conversations will appear here when you connect with a match.
            Browse your recommended matches and express interest to start a conversation.
          </p>
          <div className="mt-6 inline-block">
            <Link
              href="/dashboard/matches"
              className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#5c1520] transition-colors"
            >
              Browse My Matches
            </Link>
          </div>
          <p className="mt-6 font-sans text-xs text-gray-400">
            💬 Private, moderated and secure messaging — coming to your active matches soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
