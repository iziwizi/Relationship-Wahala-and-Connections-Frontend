import React from "react";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#7b1d2a]">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <SectionHeading
            eyebrow="SUCCESS STORIES"
            heading="Love Stories That Inspire"
            theme="light"
            align="center"
          />
        </div>

        {/* Testimonials + Arrows */}
        <div className="relative">
          {/* Left arrow */}
          <button
            className="hidden md:flex absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full items-center justify-center text-white transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-6 lg:p-8 flex flex-col"
              >
                {/* Quote icon */}
                <Quote size={28} className="text-[#c9962c] mb-4 flex-shrink-0" />

                {/* Quote text */}
                <p className="font-sans text-white/90 text-sm leading-relaxed flex-1 mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-white/20">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.avatarAlt}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <p className="font-sans text-white font-semibold text-sm leading-tight">
                      &mdash; {testimonial.name}
                    </p>
                    <p className="font-sans text-white/60 text-xs leading-tight mt-0.5">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            className="hidden md:flex absolute -right-4 lg:-right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full items-center justify-center text-white transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </Container>
    </section>
  );
}
