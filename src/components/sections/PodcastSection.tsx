"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import VideoCard from "@/components/sections/VideoCard";
import Button from "@/components/ui/Button";
import { videos } from "@/data/videos";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/Reveal";

function YoutubeIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-red-600" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function PodcastSection() {
  return (
    <section className="py-20 bg-white">
      <Container>
        {/* Header row */}
        <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <SectionHeading
              eyebrow="RELATIONSHIP WAHALA TV"
              heading="Real Conversations. Real Solutions."
              theme="dark"
            />
            <p className="font-sans text-gray-500 text-sm mt-3">
              Watch our latest episodes on love, dating, marriage and everything in between.
            </p>
          </div>
          <Link
            href="/podcast"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-[#7b1d2a] font-sans text-sm font-semibold hover:text-[#5c1520] hover:gap-2.5 transition-all duration-200 group whitespace-nowrap"
            aria-label="Watch all episodes"
          >
            Watch All Episodes
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </FadeUp>

        {/* Video grid + YouTube card */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5" staggerDelay={0.09}>
          {/* 4 video cards */}
          {videos.map((video) => (
            <StaggerItem key={video.id} className="lg:col-span-1">
              <VideoCard video={video} />
            </StaggerItem>
          ))}

          {/* YouTube subscribe card */}
          <StaggerItem className="sm:col-span-2 lg:col-span-1">
            <div className="bg-[#7b1d2a] rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[280px] h-full gap-4">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md">
                <YoutubeIcon size={30} />
              </div>
              <div>
                <p className="font-serif text-white text-base font-bold leading-tight mb-1">
                  Subscribe to Our YouTube Channel
                </p>
                <p className="font-sans text-white/75 text-xs">
                  New episodes every week!
                </p>
              </div>
              <Button
                href="https://youtube.com"
                variant="gold"
                size="sm"
                external
                className="w-full"
              >
                Subscribe Now
              </Button>
            </div>
          </StaggerItem>
        </Stagger>
      </Container>
    </section>
  );
}
