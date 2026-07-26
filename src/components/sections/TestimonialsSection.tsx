"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";
import { FadeUp } from "@/components/motion/Reveal";

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "paused";
    }
  };

  const handleMouseLeave = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <section className="py-20 bg-[#7b1d2a] overflow-hidden">
      <Container>
        {/* Section Header */}
        <FadeUp className="text-center mb-12">
          <SectionHeading
            eyebrow="SUCCESS STORIES"
            heading="Love Stories That Inspire"
            theme="light"
            align="center"
          />
          <p className="font-sans text-white/70 text-sm mt-3 max-w-xl mx-auto">
            Real stories from intentional couples who built healthy, lasting marriages through Relationship Wahala &amp; Connections.
          </p>
        </FadeUp>

        {/* Marquee Slider — hover pause via direct ref */}
        <div
          className="relative overflow-hidden py-4"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div ref={trackRef} className="animate-marquee">
            {[...testimonials, ...testimonials].map((testimonial, idx) => (
              <div
                key={`${testimonial.id}-${idx}`}
                className="w-[280px] sm:w-[340px] md:w-[360px] flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 lg:p-8 flex flex-col justify-between hover:border-[#c9962c] transition-all duration-300 mx-3"
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
      </Container>
    </section>
  );
}
