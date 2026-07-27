"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin, Briefcase, Heart, ArrowRight, Loader2, Users } from "lucide-react";

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

  useEffect(() => {
    async function fetchMatches() {
      try {
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

        {loading && (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 size={24} className="animate-spin text-[#7b1d2a]" />
            <p className="font-sans text-sm">Loading your matches from database...</p>
          </div>
        )}

        {error && !loading && (
          <div className="py-12 text-center bg-white rounded-2xl border border-red-100 p-8">
            <p className="text-red-600 font-sans text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#e8e0d4] p-12 text-center space-y-3">
            <Users size={32} className="mx-auto text-gray-300" />
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">No Matches Yet</h3>
            <p className="font-sans text-sm text-gray-500 max-w-sm mx-auto">
              Our matchmaking team is handpicking intentional candidates for you. You will be notified when your first matches are ready.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#5c1520] transition-colors"
              >
                Complete My Profile <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {matches.map((match) => (
              <article
                key={match.id}
                className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Photo */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={match.photo}
                    alt={`${match.firstName}'s profile photo`}
                    fill
                    className="object-cover"
                    unoptimized={match.photo.startsWith("https://images.unsplash.com")}
                  />
                  {/* Compatibility Badge */}
                  <div className="absolute top-3 right-3 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-2.5 py-1 rounded-full">
                    {match.compatibility}% Match
                  </div>
                  {match.verified && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      Verified
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-1">
                    {match.firstName}, {match.age}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <MapPin size={12} className="flex-shrink-0" />
                    <span className="font-sans text-xs">{match.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 mb-3">
                    <Briefcase size={12} className="flex-shrink-0" />
                    <span className="font-sans text-xs">{match.profession}</span>
                  </div>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {match.shortDescription}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/matches/${match.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#7b1d2a] text-white font-sans text-xs font-semibold py-2.5 rounded-lg hover:bg-[#5c1520] transition-colors"
                    >
                      View Profile <ArrowRight size={13} />
                    </Link>
                    <button className="flex items-center gap-1.5 border border-[#7b1d2a] text-[#7b1d2a] font-sans text-xs font-semibold px-3 py-2.5 rounded-lg hover:bg-[#7b1d2a]/5 transition-colors">
                      <Heart size={14} />
                      Interested
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
