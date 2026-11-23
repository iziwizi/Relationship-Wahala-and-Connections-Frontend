"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2, MapPin, Briefcase, BookOpen,
  Heart, ArrowLeft, Loader2, AlertCircle, X, Sparkles
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
  const router = useRouter();
  const id = params?.id as string;

  const [match, setMatch] = useState<MatchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interested, setInterested] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  const handleNotInterested = async () => {
    try {
      await fetch(`/api/matches/${id}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DECLINED" }),
      });
      router.push("/dashboard/matches");
    } catch (err) {
      console.error("[Not Interested] error:", err);
      router.push("/dashboard/matches");
    }
  };

  const handleExpressInterest = async () => {
    setInterested(true);
    setFeedback("Interest expressed! Our matchmaking team has received your request.");
    try {
      await fetch(`/api/matches/${id}/interact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ACCEPTED" }),
      });
    } catch (err) {
      console.error("[Express Interest] error:", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/dashboard/matches"
          className="inline-flex items-center gap-2 font-sans text-sm text-gray-500 hover:text-[#7b1d2a] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Matches
        </Link>

        {feedback && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-xs sm:text-sm font-sans animate-fadeIn">
            <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

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
            {/* Hero Profile Card - True Portrait Framing: Head & Face Always 100% Captured on Desktop & Mobile */}
            <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
                {/* Dedicated Portrait Photo Container: 3:4 aspect ratio guarantees head is never zoomed or cut off */}
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-gray-100 border border-[#e8e0d4]">
                  <Image
                    src={match.primaryPhoto}
                    alt={`${match.firstName}'s portrait photo`}
                    fill
                    className="object-cover object-[center_15%]"
                    unoptimized={
                      match.primaryPhoto.startsWith("https://images.unsplash.com") ||
                      match.primaryPhoto.startsWith("data:") ||
                      match.primaryPhoto.startsWith("blob:")
                    }
                  />
                  {match.verified && (
                    <div className="absolute top-3 left-3 bg-green-600/90 backdrop-blur-sm text-white font-sans text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                      <CheckCircle2 size={12} />
                      Verified Profile
                    </div>
                  )}
                </div>

                {/* Identity, Highlights & Action Column */}
                <div className="flex-1 flex flex-col justify-between self-stretch space-y-4 text-center md:text-left">
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
                      {match.firstName}, {match.age}
                    </h1>

                    {/* Quick Badges */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-sans text-gray-600 my-3">
                      <span className="flex items-center gap-1 bg-[#fbf5ec] px-3 py-1.5 rounded-lg border border-[#e8e0d4]">
                        <MapPin size={13} className="text-[#7b1d2a]" /> {match.location}
                      </span>
                      <span className="flex items-center gap-1 bg-[#fbf5ec] px-3 py-1.5 rounded-lg border border-[#e8e0d4]">
                        <Briefcase size={13} className="text-[#c9962c]" /> {match.profession}
                      </span>
                      <span className="flex items-center gap-1 bg-[#fbf5ec] px-3 py-1.5 rounded-lg border border-[#e8e0d4]">
                        <BookOpen size={13} className="text-[#7b1d2a]" /> {match.educationLevel}
                      </span>
                    </div>

                    {/* Personal Summary */}
                    <div className="bg-[#fbf5ec]/70 rounded-xl p-4 border border-[#e8e0d4] text-left mt-3">
                      <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#7b1d2a] mb-1.5">
                        About {match.firstName}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {match.aboutMe}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Not Interested & Interested */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleNotInterested}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 border border-gray-300 text-gray-700 hover:text-red-700 hover:border-red-300 hover:bg-red-50/60 rounded-xl font-sans text-xs font-bold transition-colors shadow-sm"
                      title="Dismiss candidate"
                    >
                      <X size={15} /> Not Interested
                    </button>
                    <button
                      type="button"
                      onClick={handleExpressInterest}
                      disabled={interested}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-sans text-xs font-bold transition-colors shadow-sm ${
                        interested
                          ? "bg-green-600 text-white border border-green-500"
                          : "bg-[#7b1d2a] text-white hover:bg-[#5c1520]"
                      }`}
                    >
                      {interested ? <CheckCircle2 size={15} /> : <Heart size={15} />}
                      {interested ? "Interest Sent" : "Express Interest"}
                    </button>
                  </div>
                </div>
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

                {match.keyValues && match.keyValues.length > 0 && (
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

                {match.interestsHobbies && match.interestsHobbies.length > 0 && (
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

            {/* Bottom Decision Bar */}
            <div className="bg-white rounded-xl border border-[#e8e0d4] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <span className="font-sans text-xs text-gray-500">
                Are you interested in connecting with {match.firstName}?
              </span>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleNotInterested}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50/50 rounded-lg text-xs font-semibold transition-colors"
                >
                  <X size={14} /> Not Interested
                </button>
                <button
                  type="button"
                  onClick={handleExpressInterest}
                  disabled={interested}
                  className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold transition-colors ${
                    interested
                      ? "bg-green-600 text-white"
                      : "bg-[#7b1d2a] text-white hover:bg-[#5c1520] shadow-sm"
                  }`}
                >
                  {interested ? <CheckCircle2 size={14} /> : <Heart size={14} />}
                  {interested ? "Interest Sent" : "Interested"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
