"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2, MapPin, Briefcase, Heart, ArrowRight,
  Loader2, Users, X, Sparkles, AlertCircle
} from "lucide-react";

interface MatchItem {
  id: string;
  firstName: string;
  age: number;
  location: string;
  profession: string;
  photo: string;
  shortDescription: string;
  compatibility: number;
  verified: boolean;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interestedIds, setInterestedIds] = useState<Set<string>>(new Set());
  const [actionFeedback, setActionFeedback] = useState<{ message: string; type: "success" | "info" } | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);
        const res = await fetch("/api/matches");
        const data = await res.json();
        if (res.ok && data.success) {
          setMatches(data.matches);
        } else {
          setError(data.error || "Failed to load matches.");
        }
      } catch (err) {
        console.error("[MatchesPage] fetch error:", err);
        setError("Network error loading matches.");
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  const handleNotInterested = async (matchId: string, name: string) => {
    // Optimistic UI removal
    setMatches((prev) => prev.filter((m) => m.id !== matchId));
    setActionFeedback({
      message: `${name} has been removed from your matches. We will recommend new intentional candidates for you.`,
      type: "info",
    });
    setTimeout(() => setActionFeedback(null), 5000);

    try {
      await fetch(`/api/matches/${matchId}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DECLINED" }),
      });
    } catch (err) {
      console.error("[Not Interested] Interaction error:", err);
    }
  };

  const handleExpressInterest = async (matchId: string, name: string) => {
    setInterestedIds((prev) => new Set(prev).add(matchId));
    setActionFeedback({
      message: `Interest expressed in ${name}! Our matchmaking desk will follow up discreetly.`,
      type: "success",
    });
    setTimeout(() => setActionFeedback(null), 5000);

    try {
      await fetch(`/api/matches/${matchId}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ACCEPTED" }),
      });
    } catch (err) {
      console.error("[Express Interest] Interaction error:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">My Matches</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Handpicked, vetted and intentional candidates selected for compatibility with your profile.
          </p>
        </div>

        {/* Feedback Alert */}
        {actionFeedback && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-sans transition-all animate-fadeIn ${
              actionFeedback.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-amber-50 border border-amber-200 text-amber-800"
            }`}
          >
            {actionFeedback.type === "success" ? (
              <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
            ) : (
              <Sparkles size={18} className="text-amber-600 flex-shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
        )}

        {loading && (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 size={24} className="animate-spin text-[#7b1d2a]" />
            <p className="font-sans text-sm">Loading your verified matches from database...</p>
          </div>
        )}

        {error && !loading && (
          <div className="py-12 text-center bg-white rounded-2xl border border-red-100 p-8">
            <AlertCircle size={28} className="mx-auto text-red-500 mb-2" />
            <p className="text-red-600 font-sans text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#e8e0d4] p-12 text-center space-y-3">
            <Users size={32} className="mx-auto text-gray-300" />
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">No Active Matches</h3>
            <p className="font-sans text-sm text-gray-500 max-w-sm mx-auto">
              Our matchmaking team is actively vetting and curating fresh intentional candidates for you. New recommendations will appear here.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#5c1520] transition-colors"
              >
                Review My Profile Details <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {matches.map((match) => {
              const isInterested = interestedIds.has(match.id);

              return (
                <article
                  key={match.id}
                  className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Photo Container - True Portrait 3:4 aspect ratio: guarantees head, face & shoulders are 100% visible */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={match.photo}
                      alt={`${match.firstName}'s portrait`}
                      fill
                      className="object-cover object-[center_15%] transition-transform duration-300 hover:scale-105"
                      unoptimized={
                        match.photo.startsWith("https://images.unsplash.com") ||
                        match.photo.startsWith("data:") ||
                        match.photo.startsWith("blob:")
                      }
                    />
                    {/* Compatibility Badge */}
                    <div className="absolute top-3 right-3 bg-[#7b1d2a]/90 backdrop-blur-sm text-white font-sans text-xs font-bold px-3 py-1 rounded-full shadow">
                      {match.compatibility}% Match
                    </div>
                    {match.verified && (
                      <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white font-sans text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                        <CheckCircle2 size={12} />
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Details Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-1">
                        {match.firstName}, {match.age}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 mb-1">
                        <MapPin size={13} className="text-[#7b1d2a] flex-shrink-0" />
                        <span className="font-sans text-xs">{match.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 mb-3">
                        <Briefcase size={13} className="text-[#c9962c] flex-shrink-0" />
                        <span className="font-sans text-xs">{match.profession}</span>
                      </div>
                      <p className="font-sans text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">
                        {match.shortDescription}
                      </p>
                    </div>

                    {/* Action Buttons Row with 'Not Interested' and 'Interested' */}
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {/* Not Interested Button */}
                        <button
                          type="button"
                          onClick={() => handleNotInterested(match.id, match.firstName)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 border border-gray-300 text-gray-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50/60 rounded-lg font-sans text-xs font-semibold transition-colors"
                          title="Dismiss candidate and request new recommendations"
                        >
                          <X size={14} className="text-gray-400 group-hover:text-red-600" />
                          <span>Not Interested</span>
                        </button>

                        {/* Interested Button */}
                        <button
                          type="button"
                          onClick={() => handleExpressInterest(match.id, match.firstName)}
                          disabled={isInterested}
                          className={`flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-lg font-sans text-xs font-semibold transition-colors ${
                            isInterested
                              ? "bg-green-50 border border-green-300 text-green-700 cursor-default"
                              : "border border-[#7b1d2a] text-[#7b1d2a] hover:bg-[#7b1d2a]/5"
                          }`}
                        >
                          {isInterested ? (
                            <>
                              <CheckCircle2 size={13} className="text-green-600" />
                              <span>Interest Sent</span>
                            </>
                          ) : (
                            <>
                              <Heart size={13} />
                              <span>Interested</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* View Full Profile CTA */}
                      <Link
                        href={`/dashboard/matches/${match.id}`}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#7b1d2a] text-white font-sans text-xs font-semibold py-2.5 rounded-lg hover:bg-[#5c1520] transition-colors shadow-sm"
                      >
                        <span>View Full Profile</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
