"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { demoStats } from "@/data/demo/stats";
import { demoMatches } from "@/data/demo/matches";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, Users, Sparkles, MessageSquare, CheckCircle2,
  Circle, Clock, ChevronRight, ArrowRight, Crown
} from "lucide-react";

const journeySteps = [
  { label: "Account Created", status: "done" },
  { label: "Profile Information", status: "done" },
  { label: "Match Preferences", status: "done" },
  { label: "Profile Verification", status: "pending" },
  { label: "Active Matching", status: "inprogress" },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: "Profile Views", value: demoStats.profileViews, icon: Eye, color: "text-[#7b1d2a]", bg: "bg-[#7b1d2a]/10" },
    { label: "Potential Matches", value: demoStats.potentialMatches, icon: Users, color: "text-[#c9962c]", bg: "bg-[#c9962c]/10" },
    { label: "New Matches", value: demoStats.newMatches, icon: Sparkles, color: "text-green-600", bg: "bg-green-50" },
    { label: "Active Conversations", value: demoStats.activeConversations, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  const topMatches = demoMatches.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
            Welcome back, {user?.firstName || "Daniel"} 👋
          </h1>
          <p className="font-sans text-gray-500 text-sm mt-1">
            Your journey to an intentional and lasting relationship continues here.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl p-5 border border-[#e8e0d4] shadow-sm">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <p className={`font-serif text-3xl font-bold ${color}`}>{value}</p>
              <p className="font-sans text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column — Profile completion + Journey */}
          <div className="lg:col-span-1 space-y-5">
            {/* Profile Completion */}
            <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6">
              <h3 className="font-serif text-base font-bold text-[#1a1a1a] mb-4">
                Profile Completion
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#c9962c] flex-shrink-0">
                  <Image
                    src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"}
                    alt="Profile photo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-sm text-[#1a1a1a] truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="font-sans text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="mb-2 flex justify-between items-center">
                <span className="font-sans text-xs text-gray-500">Profile Strength</span>
                <span className="font-sans text-xs font-bold text-[#7b1d2a]">{user?.profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div
                  className="bg-[#7b1d2a] h-2 rounded-full transition-all"
                  style={{ width: `${user?.profileCompletion}%` }}
                />
              </div>
              <Link
                href="/dashboard/profile"
                className="w-full flex items-center justify-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-semibold py-2.5 rounded-lg hover:bg-[#5c1520] transition-colors"
              >
                Complete My Profile
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Matchmaking Journey */}
            <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6">
              <h3 className="font-serif text-base font-bold text-[#1a1a1a] mb-5">
                Your Matchmaking Journey
              </h3>
              <div className="space-y-4">
                {journeySteps.map((step, index) => (
                  <div key={step.label} className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {step.status === "done" ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : step.status === "pending" ? (
                        <Clock size={20} className="text-[#c9962c]" />
                      ) : (
                        <Circle size={20} className="text-blue-400" />
                      )}
                    </div>
                    {/* Connector line */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-sans text-sm ${step.status === "done" ? "text-gray-500" : "text-[#1a1a1a] font-semibold"}`}>
                          {index + 1}. {step.label}
                        </p>
                        <span className={`font-sans text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          step.status === "done" ? "bg-green-100 text-green-700" :
                          step.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>
                          {step.status === "done" ? "Done" : step.status === "pending" ? "Pending" : "In Progress"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EPMS Upgrade Card */}
            <div className="bg-gradient-to-br from-[#7b1d2a] to-[#5c1520] rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Crown size={18} className="text-[#c9962c]" />
                <p className="font-serif font-bold text-sm">Upgrade to EPMS</p>
              </div>
              <p className="font-sans text-xs text-white/80 leading-relaxed mb-4">
                Get a dedicated personal matchmaker, background verification and in-depth compatibility coaching.
              </p>
              <Link
                href="/dashboard/subscription"
                className="inline-flex items-center gap-1.5 bg-[#c9962c] text-white font-sans text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#b8882a] transition-colors"
              >
                Explore EPMS <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Column — Recommended Matches */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">
                  Recommended Matches
                </h3>
                <Link
                  href="/dashboard/matches"
                  className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#7b1d2a] hover:text-[#5c1520]"
                >
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              <div className="space-y-4">
                {topMatches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center gap-4 p-4 bg-[#fbf5ec] rounded-xl border border-[#e8e0d4] hover:border-[#7b1d2a]/30 transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow">
                      <Image
                        src={match.photo}
                        alt={`${match.firstName}'s profile`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-sans font-bold text-sm text-[#1a1a1a]">
                          {match.firstName}, {match.age}
                        </p>
                        {match.verified && (
                          <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="font-sans text-xs text-gray-500 truncate">
                        {match.location} · {match.profession}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-sans text-sm font-bold text-[#7b1d2a]">
                        {match.compatibility}%
                      </div>
                      <div className="font-sans text-[10px] text-gray-400">Match</div>
                      <Link
                        href={`/dashboard/matches/${match.id}`}
                        className="mt-1.5 inline-block bg-[#7b1d2a] text-white font-sans text-[11px] font-semibold px-3 py-1 rounded-md hover:bg-[#5c1520] transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
