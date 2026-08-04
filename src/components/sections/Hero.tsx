"use client";

import React from "react";
import Image from "next/image";
import { Heart, Play, Calendar, Globe, Users, Lock, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";
import { motion, useReducedMotion } from "framer-motion";

const featureBadges = [
  { icon: BookOpen, label: "Knowledge", sublabel: "Driven" },
  { icon: Globe, label: "Global", sublabel: "Connections" },
  { icon: Users, label: "Vetted &", sublabel: "Intentional" },
  { icon: Lock, label: "100%", sublabel: "Confidential" },
];

export default function Hero() {
  const reduce = useReducedMotion();

  const ease = [0.16, 1, 0.3, 1] as const;

  const fadeUp = (delay: number) => ({
    initial: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease },
  });

  return (
    <section className="relative min-h-screen bg-[#1a1a1a] overflow-hidden flex items-center">
      {/* Background image — right side */}
      <div className="absolute inset-0">
        {/* Dark overlay gradient from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#1a1a1a]/85 to-[#1a1a1a]/30 z-10" />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-transparent to-transparent z-10" />
        <Image
          src="/images/hero-couple.jpg"
          alt="A beautiful Nigerian couple, representing intentional love and lasting relationships"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[75vh]">
          {/* Left — Copy */}
          <div className="flex flex-col justify-center min-w-0">
            {/* Headline */}
            <motion.h1
              className="font-serif text-white text-2xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold leading-[1.2] mb-6 max-w-xl lg:max-w-2xl xl:max-w-3xl"
              {...fadeUp(0.1)}
            >
              {/* Mobile: each sentence on its own line */}
              <span className="lg:hidden">
                <span className="block">Find <span className="text-[#c9962c]">Love.</span></span>
                <span className="block">Build Lasting Relationships.</span>
                <span className="block">Create a Successful <span className="text-[#c9962c]">Marriage.</span></span>
              </span>
              {/* Desktop: clean 3-line sentence layout matching left column */}
              <span className="hidden lg:inline">
                Find <span className="text-[#c9962c]">Love.</span><br className="hidden lg:block" />
                Build Lasting Relationships.<br className="hidden lg:block" />
                Create a Successful <span className="text-[#c9962c]">Marriage.</span>
              </span>
            </motion.h1>

            {/* Body copy */}
            <motion.p
              className="font-sans text-white/80 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 max-w-lg"
              {...fadeUp(0.3)}
            >
              Nigeria&apos;s premier knowledge-based relationship and matchmaking
              platform, helping intentional singles and couples build healthy,
              lasting relationships.
            </motion.p>

            {/* CTA Buttons — 2 buttons row 1 on mobile, 3rd button full-width row 2. Single horizontal row on desktop */}
            <motion.div
              className="grid grid-cols-2 lg:flex lg:flex-nowrap items-center gap-2 sm:gap-3 w-full"
              {...fadeUp(0.45)}
            >
              <Button
                href="/matchmaking/experience"
                variant="primary"
                size="md"
                className="col-span-1 gap-1.5 sm:gap-2 !px-2.5 sm:!px-4 !text-[11px] sm:!text-xs lg:!text-sm justify-center whitespace-nowrap"
              >
                <Heart size={14} className="flex-shrink-0" />
                Find Your Life Partner
              </Button>
              <Button
                href="/podcast"
                variant="outline"
                size="md"
                className="col-span-1 gap-1.5 sm:gap-2 !px-2.5 sm:!px-4 !text-[11px] sm:!text-xs lg:!text-sm justify-center whitespace-nowrap"
              >
                <Play size={14} className="flex-shrink-0" />
                Watch Our Podcast
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="md"
                className="col-span-2 lg:col-span-1 gap-1.5 sm:gap-2 !px-2.5 sm:!px-4 !text-[11px] sm:!text-xs lg:!text-sm justify-center whitespace-nowrap !border-white/20 !bg-white/10 hover:!bg-white/20"
              >
                <Calendar size={14} className="flex-shrink-0" />
                Book a Consultation
              </Button>
            </motion.div>
          </div>

          {/* Right — Space occupied by photography */}
          <div className="hidden lg:flex items-end justify-end h-full pb-0" />
        </div>

        {/* Feature badges panel — bottom right */}
        <motion.div
          className="mt-8 lg:mt-0 lg:absolute lg:bottom-12 lg:right-8 xl:right-16"
          {...fadeUp(0.6)}
        >
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-3.5 sm:p-5 grid grid-cols-4 gap-3 sm:gap-6 lg:gap-8 w-full lg:w-auto">
            {featureBadges.map(({ icon: Icon, label, sublabel }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/30 flex items-center justify-center">
                  <Icon size={15} className="text-white/90" />
                </div>
                <div>
                  <p className="font-sans text-white text-[11px] sm:text-xs font-semibold leading-tight">{label}</p>
                  <p className="font-sans text-white/70 text-[10px] sm:text-xs leading-tight">{sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
