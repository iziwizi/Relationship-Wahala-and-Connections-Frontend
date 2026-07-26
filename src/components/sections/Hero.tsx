import React from "react";
import Image from "next/image";
import { Heart, Play, Calendar, Globe, Users, Lock, BookOpen } from "lucide-react";
import Button from "@/components/ui/Button";

const featureBadges = [
  { icon: BookOpen, label: "Knowledge", sublabel: "First Approach" },
  { icon: Globe, label: "Global", sublabel: "Connections" },
  { icon: Users, label: "Vetted &", sublabel: "Intentional" },
  { icon: Lock, label: "100%", sublabel: "Confidential" },
];

export default function Hero() {
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
          <div className="flex flex-col justify-center">
            {/* Headline — 5 intentional lines on desktop */}
            <h1 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold leading-[1.2] mb-6 max-w-xl">
              Find <span className="text-[#c9962c]">Love.</span>
              <br className="hidden md:inline" />
              Build Lasting
              <br className="hidden md:inline" />
              Relationships.
              <br className="hidden md:inline" />
              Create a Successful
              <br className="hidden md:inline" />
              <span className="text-[#c9962c]">Marriage.</span>
            </h1>

            {/* Body copy */}
            <p className="font-sans text-white/80 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
              Nigeria&apos;s premier knowledge-based relationship and matchmaking
              platform, helping intentional singles and couples build healthy,
              lasting relationships.
            </p>

            {/* CTA Buttons — 3 buttons on one single horizontal line on desktop */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 sm:gap-3 w-full">
              <Button href="/register" variant="primary" size="md" className="gap-2 !px-4 sm:!px-5 whitespace-nowrap">
                <Heart size={16} />
                Find Your Life Partner
              </Button>
              <Button href="/podcast" variant="outline" size="md" className="gap-2 !px-4 sm:!px-5 whitespace-nowrap">
                <Play size={16} />
                Watch Our Podcast
              </Button>
              <Button href="/contact" variant="secondary" size="md" className="gap-2 !px-4 sm:!px-5 whitespace-nowrap !border-white/20 !bg-white/10 hover:!bg-white/20">
                <Calendar size={16} />
                Book a Consultation
              </Button>
            </div>
          </div>

          {/* Right — Space occupied by photography */}
          <div className="hidden lg:flex items-end justify-end h-full pb-0" />
        </div>

        {/* Feature badges panel — bottom right */}
        <div className="mt-8 lg:mt-0 lg:absolute lg:bottom-12 lg:right-8 xl:right-16">
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-5 grid grid-cols-4 sm:grid-cols-4 gap-6 lg:gap-8 w-full lg:w-auto">
            {featureBadges.map(({ icon: Icon, label, sublabel }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                  <Icon size={18} className="text-white/90" />
                </div>
                <div>
                  <p className="font-sans text-white text-xs font-semibold leading-tight">
                    {label}
                  </p>
                  <p className="font-sans text-white/70 text-xs leading-tight">
                    {sublabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
