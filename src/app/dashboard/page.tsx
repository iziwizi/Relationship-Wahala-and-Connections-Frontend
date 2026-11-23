"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import {
  Eye, Users, Sparkles, MessageSquare, CheckCircle2,
  Circle, Clock, ChevronRight, ArrowRight, Crown, Loader2
} from "lucide-react";

const journeySteps = [
  { label: "Account Created", key: "account", statusFn: () => "done" as const },
  { label: "Profile Information", key: "profile", statusFn: (completion: number) => completion >= 50 ? "done" as const : "pending" as const },
  { label: "Match Preferences", key: "prefs", statusFn: () => "pending" as const },
  { label: "Profile Verification", key: "verify", statusFn: (completion: number, status: string) => status === "VERIFIED" ? "done" as const : "pending" as const },
  { label: "Active Matching", key: "matching", statusFn: (completion: number, status: string, matchCount: number) => matchCount > 0 ? "inprogress" as const : "pending" as const },
];

interface MatchPreview {
  id: string;
  firstName: string;
  age: number;
  location: string;
  profession: string;
  photo: string;
  compatibility: number;
  verified: boolean;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [matchCount, setMatchCount] = useState(0);
  const [topMatches, setTopMatches] = useState<MatchPreview[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await fetch("/api/matches");
        const data = await res.json();
        if (res.ok && data.success) {
          setMatchCount(data.count);
          setTopMatches(data.matches.slice(0, 3));
        }
      } catch (err) {
        console.error("[Dashboard] fetch matches error:", err);
      } finally {
        setMatchesLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const completion = user?.profileCompletion ?? 0;
  const profileStatus = (user as any)?.status ?? "PENDING_VERIFICATION";

  const stats = [
    { label: "Potential Matches", value: matchCount, icon: Users, color: "text-[#c9962c]", bg: "bg-[#c9962c]/10" },
    { label: "Profile Complete", value: `${completion}%`, icon: Eye, color: "text-[#7b1d2a]", bg: "bg-[#7b1d2a]/10" },
    { label: "Recommended", value: topMatches.length, icon: Sparkles, color: "text-green-600", bg: "bg-green-50" },
    { label: "Messages", value: 0, icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
            Welcome back, {user?.firstName || "Member"} 👋
          </h1>
          <p className="font-sans text-gray-500 text-sm mt-1">
            Your journey to an intentional and lasting relationship continues here.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-xl p-4 border border-[#e8e0d4] shadow-sm min-w-0">
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon size={18} className={color} />
              </div>
              <p className={`font-serif text-2xl font-bold ${color} truncate`}>{value}</p>
              <p className="font-sans text-xs text-gray-500 mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-5 min-w-0">
            {/* Profile Completion */}
            <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-5 min-w-0">
              <h3 className="font-serif text-base font-bold text-[#1a1a1a] mb-4">Profile Completion</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#c9962c] flex-shrink-0 bg-gray-100">
                  <Image
                    src={user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"}
                    alt="Profile photo"
                    fill
                    className="object-cover object-top"
                    unoptimized
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
                <span className="font-sans text-xs font-bold text-[#7b1d2a]">{completion}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                <div
                  className="bg-[#7b1d2a] h-2 rounded-full transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <Link
                href="/dashboard/profile"
                className="w-full flex items-center justify-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-semibold py-2.5 rounded-lg hover:bg-[#5c1520] transition-colors"
              >
                Complete My Profile <ChevronRight size={14} />
              </Link>
            </div>

            {/* Matchmaking Journey */}
            <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-5 min-w-0">
              <h3 className="font-serif text-base font-bold text-[#1a1a1a] mb-4">Your Matchmaking Journey</h3>
              <div className="space-y-3">
                {journeySteps.map((step, index) => {
                  const status = step.key === "matching"
                    ? step.statusFn(completion, profileStatus, matchCount)
                    : step.key === "verify"
                    ? step.statusFn(completion, profileStatus, matchCount)
                    : step.key === "profile"
                    ? step.statusFn(completion, profileStatus, matchCount)
                    : "done";
                  return (
                    <div key={step.label} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {status === "done" ? (
                          <CheckCircle2 size={18} className="text-green-500" />
                        ) : status === "inprogress" ? (
                          <Circle size={18} className="text-blue-400" />
                        ) : (
                          <Clock size={18} className="text-[#c9962c]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className={`font-sans text-xs ${status === "done" ? "text-gray-500" : "text-[#1a1a1a] font-semibold"} truncate`}>
                            {index + 1}. {step.label}
                          </p>
                          <span className={`font-sans text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                            status === "done" ? "bg-green-100 text-green-700" :
                            status === "inprogress" ? "bg-blue-100 text-blue-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {status === "done" ? "Done" : status === "inprogress" ? "Active" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* EPMS Upgrade Card */}
            <div className="bg-gradient-to-br from-[#7b1d2a] to-[#5c1520] rounded-xl p-5 text-white min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} className="text-[#c9962c] flex-shrink-0" />
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
          <div className="lg:col-span-2 min-w-0">
            <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-5 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Recommended Matches</h3>
                <Link
                  href="/dashboard/matches"
                  className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[#7b1d2a] hover:text-[#5c1520]"
                >
                  View All <ArrowRight size={13} />
                </Link>
              </div>

              {matchesLoading && (
                <div className="py-8 flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 size={18} className="animate-spin text-[#7b1d2a]" />
                  <span className="font-sans text-xs">Loading matches...</span>
                </div>
              )}

              {!matchesLoading && topMatches.length === 0 && (
                <div className="py-8 text-center space-y-2">
                  <Users size={24} className="mx-auto text-gray-300" />
                  <p className="font-sans text-xs text-gray-500">
                    Your matches are being handpicked. You will be notified when they are ready.
                  </p>
                </div>
              )}

              {!matchesLoading && topMatches.length > 0 && (
                <div className="space-y-3">
                  {topMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center gap-3 p-3 bg-[#fbf5ec] rounded-xl border border-[#e8e0d4] hover:border-[#7b1d2a]/30 transition-colors min-w-0"
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow bg-gray-100">
                        <Image
                          src={match.photo}
                          alt={`${match.firstName}'s profile`}
                          fill
                          className="object-cover object-top"
                          unoptimized={match.photo.startsWith("https://images.unsplash.com")}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="font-sans font-bold text-sm text-[#1a1a1a] truncate">
                            {match.firstName}, {match.age}
                          </p>
                          {match.verified && (
                            <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="font-sans text-xs text-gray-500 truncate">
                          {match.location} · {match.profession}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 pl-2">
                        <div className="font-sans text-xs font-bold text-[#7b1d2a]">{match.compatibility}%</div>
                        <div className="font-sans text-[10px] text-gray-400">Match</div>
                        <Link
                          href={`/dashboard/matches/${match.id}`}
                          className="mt-1 inline-block bg-[#7b1d2a] text-white font-sans text-[10px] font-semibold px-2 py-1 rounded hover:bg-[#5c1520] transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
