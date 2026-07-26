"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-scroll timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
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

        {/* Carousel Container */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 sm:-left-6 lg:-left-12 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-[#1a1a1a]/80 hover:bg-[#c9962c] border border-white/20 rounded-full flex items-center justify-center text-white transition-all shadow-lg focus:outline-none"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Testimonial Card Display */}
          <div className="overflow-hidden px-2 py-4">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0 px-2 sm:px-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-10 flex flex-col justify-between shadow-xl min-h-[260px]">
                    <div>
                      <Quote size={32} className="text-[#c9962c] mb-4 flex-shrink-0" />
                      <p className="font-sans text-white/90 text-sm sm:text-base leading-relaxed mb-6 italic">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#c9962c]">
                        <Image
                          src={item.avatar}
                          alt={item.avatarAlt}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-sans text-white font-bold text-base leading-tight">
                          {item.name}
                        </p>
                        <p className="font-sans text-white/60 text-xs leading-tight mt-1">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute -right-4 sm:-right-6 lg:-right-12 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-[#1a1a1a]/80 hover:bg-[#c9962c] border border-white/20 rounded-full flex items-center justify-center text-white transition-all shadow-lg focus:outline-none"
            aria-label="Next testimonial"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Clickable Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? "bg-[#c9962c] w-8" : "bg-white/30 w-2.5 hover:bg-white/50"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
