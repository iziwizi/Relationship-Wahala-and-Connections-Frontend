"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { demoMatches } from "@/data/demo/matches";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin, Briefcase, Heart, ArrowRight } from "lucide-react";

export default function MatchesPage() {
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

        {/* Matches Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {demoMatches.map((match) => (
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
                />
                {/* Compatibility Badge */}
                <div className="absolute top-3 right-3 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-2.5 py-1 rounded-full">
                  {match.compatibility}% Match
                </div>
                {/* Verified Badge */}
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
      </div>
    </DashboardLayout>
  );
}
