"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2, MapPin, Briefcase, BookOpen,
  Heart, ArrowLeft, Loader2, AlertCircle
} from "lucide-react";

interface MatchProfile {
  id: string;
  firstName: string;
  age: number;
  gender: string;
  maritalStatus: string;
  nationality: string;
  location: string;
  educationLevel: string;
  profession: string;
  employmentStatus: string;
  religion: string;
  smoking: string;
  drinking: string;
  hasChildren: string;
  wantsChildren: string;
  aboutMe: string;
  keyValues: string[];
  interestsHobbies: string[];
  relationshipGoal: string;
  photos: string[];
  primaryPhoto: string;
  verified: boolean;
  preferences?: {
    ageMin: number;
    ageMax: number;
    location?: string;
    educationLevel?: string;
    religion?: string;
  } | null;
}

export default function MatchProfilePage() {
  const params = useParams();
  const id = params?.id as string;

  const [match, setMatch] = useState<MatchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatch() {
      if (!id) return;
      try {
        const res = await fetch(`/api/matches/${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setMatch(data.match);
        } else {
          setError(data.error || "This match profile is unavailable or you do not have access.");
        }
      } catch (err) {
        console.error("[MatchProfile] fetch error:", err);
        setError("Network error loading profile.");
      } finally {
        setLoading(false);
      }
    }
    fetchMatch();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <Link
          href="/dashboard/matches"
          className="inline-flex items-center gap-2 font-sans text-sm text-gray-500 hover:text-[#7b1d2a] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Matches
        </Link>

        {loading && (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 size={24} className="animate-spin text-[#7b1d2a]" />
            <p className="font-sans text-sm">Loading profile from database...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-white rounded-2xl border border-red-100 p-10 text-center space-y-3">
            <AlertCircle size={28} className="mx-auto text-red-400" />
            <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">Profile Unavailable</h3>
            <p className="font-sans text-sm text-gray-500 max-w-sm mx-auto">{error}</p>
            <Link
              href="/dashboard/matches"
              className="inline-flex items-center gap-2 text-[#7b1d2a] font-sans text-sm font-semibold hover:underline"
            >
              <ArrowLeft size={14} /> Return to Matches
            </Link>
          </div>
        )}

        {match && !loading && (
          <>
            {/* Hero Card */}
            <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden">
              <div className="relative h-64 sm:h-80 w-full">
                <Image
                  src={match.primaryPhoto}
                  alt={`${match.firstName}'s profile photo`}
                  fill
                  className="object-cover object-top"
                  unoptimized={match.primaryPhoto.startsWith("https://images.unsplash.com")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <div>
                    <h1 className="font-serif text-3xl font-bold text-white">
                      {match.firstName}, {match.age}
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1">
                      {match.verified && (
                        <div className="flex items-center gap-1 bg-green-500/90 text-white font-sans text-xs font-bold px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 size={11} />
                          Verified Profile
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white font-sans text-xs font-bold px-3 py-2 rounded-xl border border-white/30 hover:bg-white/30 transition-colors">
                    <Heart size={14} />
                    Express Interest
                  </button>
                </div>
              </div>

              {/* Quick details */}
              <div className="px-6 py-4 flex flex-wrap gap-4 border-b border-[#f0e8dc]">
                <span className="flex items-center gap-1.5 font-sans text-xs text-gray-600">
                  <MapPin size={14} className="text-[#7b1d2a]" />
                  {match.location}
                </span>
                <span className="flex items-center gap-1.5 font-sans text-xs text-gray-600">
                  <Briefcase size={14} className="text-[#7b1d2a]" />
                  {match.profession}
                </span>
                <span className="flex items-center gap-1.5 font-sans text-xs text-gray-600">
                  <BookOpen size={14} className="text-[#7b1d2a]" />
                  {match.educationLevel}
                </span>
              </div>

              {/* About */}
              <div className="px-6 py-5">
                <h2 className="font-serif text-base font-bold text-[#1a1a1a] mb-2">About</h2>
                <p className="font-sans text-sm text-gray-600 leading-relaxed">{match.aboutMe}</p>
              </div>
            </div>

            {/* Profile sections */}
            <div className="grid sm:grid-cols-2 gap-5">
              {/* Basic Info */}
              <div className="bg-white rounded-xl border border-[#e8e0d4] p-5 space-y-3">
                <h3 className="font-serif text-sm font-bold text-[#1a1a1a]">Background</h3>
                {[
                  ["Marital Status", match.maritalStatus],
                  ["Nationality", match.nationality],
                  ["Religion", match.religion],
                  ["Employment", match.employmentStatus],
                  ["Children", match.hasChildren],
                  ["Wants Children", match.wantsChildren],
                  ["Smoking", match.smoking],
                  ["Drinking", match.drinking],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-start gap-2 border-b border-[#f0e8dc] pb-2 last:border-0">
                    <span className="font-sans text-[11px] text-gray-400 uppercase tracking-wide">{label}</span>
                    <span className="font-sans text-xs text-[#1a1a1a] font-medium text-right">{value || "—"}</span>
                  </div>
                ))}
              </div>

              {/* Intentions */}
              <div className="bg-white rounded-xl border border-[#e8e0d4] p-5 space-y-3">
                <h3 className="font-serif text-sm font-bold text-[#1a1a1a]">Intentions</h3>
                <p className="font-sans text-xs text-gray-600 leading-relaxed">{match.relationshipGoal}</p>

                {match.keyValues.length > 0 && (
                  <div>
                    <p className="font-sans text-[11px] text-gray-400 uppercase tracking-wide mb-2">Core Values</p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.keyValues.map((v) => (
                        <span key={v} className="bg-[#7b1d2a]/10 text-[#7b1d2a] text-[10px] font-semibold font-sans px-2 py-1 rounded-full">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {match.interestsHobbies.length > 0 && (
                  <div>
                    <p className="font-sans text-[11px] text-gray-400 uppercase tracking-wide mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.interestsHobbies.map((h) => (
                        <span key={h} className="bg-[#c9962c]/10 text-[#c9962c] text-[10px] font-semibold font-sans px-2 py-1 rounded-full">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
