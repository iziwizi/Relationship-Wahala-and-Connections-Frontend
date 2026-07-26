"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { demoMatches } from "@/data/demo/matches";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2, MapPin, Briefcase, BookOpen,
  Heart, ArrowLeft, Globe
} from "lucide-react";

export default function MatchProfilePage({ params }: { params: { id: string } }) {
  const match = demoMatches.find((m) => m.id === params.id);
  if (!match) notFound();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Back Button */}
        <Link
          href="/dashboard/matches"
          className="inline-flex items-center gap-2 font-sans text-sm text-gray-500 hover:text-[#7b1d2a] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Matches
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden">
          <div className="relative h-64 sm:h-80 w-full">
            <Image
              src={match.photo}
              alt={`${match.firstName}'s profile photo`}
              fill
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Compatibility overlay */}
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
              <div className="bg-[#7b1d2a] text-white rounded-xl px-4 py-2 text-center">
                <p className="font-serif text-2xl font-bold text-[#c9962c]">{match.compatibility}%</p>
                <p className="font-sans text-[10px] font-semibold">Compatibility</p>
              </div>
            </div>
          </div>

          {/* Info Row */}
          <div className="px-6 py-4 border-b border-[#f0e8dc]">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-sans">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#7b1d2a]" />
                {match.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase size={14} className="text-[#7b1d2a]" />
                {match.profession}
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-[#7b1d2a]" />
                {match.education}
              </div>
              <div className="flex items-center gap-1.5">
                <Globe size={14} className="text-[#7b1d2a]" />
                {match.religion}
              </div>
            </div>
          </div>

          {/* About */}
          <div className="px-6 py-5 border-b border-[#f0e8dc]">
            <h2 className="font-serif text-base font-bold text-[#1a1a1a] mb-3">About {match.firstName}</h2>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">{match.about}</p>
          </div>

          {/* Interests */}
          <div className="px-6 py-5 border-b border-[#f0e8dc]">
            <h2 className="font-serif text-base font-bold text-[#1a1a1a] mb-3">Interests & Hobbies</h2>
            <div className="flex flex-wrap gap-2">
              {match.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-[#7b1d2a]/10 text-[#7b1d2a] font-sans text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Relationship Intentions */}
          <div className="px-6 py-5 border-b border-[#f0e8dc]">
            <h2 className="font-serif text-base font-bold text-[#1a1a1a] mb-2">
              Relationship Intentions
            </h2>
            <p className="font-sans text-sm text-gray-600">{match.relationshipIntentions}</p>
          </div>

          {/* Photo Gallery */}
          {match.gallery.length > 1 && (
            <div className="px-6 py-5 border-b border-[#f0e8dc]">
              <h2 className="font-serif text-base font-bold text-[#1a1a1a] mb-3">Gallery</h2>
              <div className="grid grid-cols-3 gap-3">
                {match.gallery.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                    <Image
                      src={photo}
                      alt={`${match.firstName} photo ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="px-6 py-5 flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-bold py-3 rounded-xl hover:bg-[#5c1520] transition-colors">
              <Heart size={16} />
              I&apos;m Interested
            </button>
            <Link
              href="/dashboard/matches"
              className="flex-1 flex items-center justify-center gap-2 border border-[#7b1d2a] text-[#7b1d2a] font-sans text-sm font-semibold py-3 rounded-xl hover:bg-[#7b1d2a]/5 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Matches
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
