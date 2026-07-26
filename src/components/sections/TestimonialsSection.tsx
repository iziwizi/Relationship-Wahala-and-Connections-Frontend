"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-[#7b1d2a] overflow-hidden">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <SectionHeading
            eyebrow="SUCCESS STORIES"
            heading="Love Stories That Inspire"
            theme="light"
            align="center"
          />
          <p className="font-sans text-white/70 text-sm mt-3 max-w-xl mx-auto">
            Real stories from intentional couples who built healthy, lasting marriages through Relationship Wahala &amp; Connections.
          </p>
        </div>

        {/* Continuous Marquee / Slider Container */}
        <div className="relative group">
          {/* Left Arrow Controls */}
          <button
            onClick={handlePrev}
            className="hidden md:flex absolute -left-5 lg:-left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-[#1a1a1a]/80 hover:bg-[#c9962c] border border-white/20 rounded-full items-center justify-center text-white transition-all shadow-lg"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Marquee track wrapper */}
          <div className="overflow-hidden py-4">
            <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
              {/* Duplicate array twice for seamless infinite marquee loop */}
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={`${testimonial.id}-${idx}`}
                  className="w-[300px] sm:w-[360px] flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 lg:p-8 flex flex-col justify-between hover:border-[#c9962c] transition-colors duration-300"
                >
                  <div>
                    <Quote size={28} className="text-[#c9962c] mb-4 flex-shrink-0" />
                    <p className="font-sans text-white/90 text-sm leading-relaxed mb-6">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#c9962c]">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.avatarAlt}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-sans text-white font-bold text-sm leading-tight">
                        {testimonial.name}
                      </p>
                      <p className="font-sans text-white/60 text-xs leading-tight mt-0.5">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow Controls */}
          <button
            onClick={handleNext}
            className="hidden md:flex absolute -right-5 lg:-right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-[#1a1a1a]/80 hover:bg-[#c9962c] border border-white/20 rounded-full items-center justify-center text-white transition-all shadow-lg"
            aria-label="Next testimonial"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Indicator dots for mobile accessibility */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                activeIndex === i ? "bg-[#c9962c] w-6" : "bg-white/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
