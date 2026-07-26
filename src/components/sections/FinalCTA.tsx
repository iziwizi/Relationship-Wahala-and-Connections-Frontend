import React from "react";
import { Heart, GraduationCap, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/Reveal";

export default function FinalCTA() {
  return (
    <section className="py-20 bg-[#fbf5ec] overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left — Heading (Allocated 7 cols for mathematical 2-line desktop fit) */}
          <FadeUp className="lg:col-span-7">
            <h2 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl lg:text-[2.1rem] xl:text-[2.45rem] font-bold leading-[1.25] mb-4">
              <span className="lg:whitespace-nowrap">Ready for a Relationship Built on</span>
              <br className="hidden lg:block" />
              <span className="lg:whitespace-nowrap">Knowledge and Intention?</span>
            </h2>
            <p className="font-sans text-gray-600 text-base leading-relaxed max-w-xl">
              Take the next step towards love, growth and a lasting marriage.
            </p>
          </FadeUp>

          {/* Right — Two cards (Allocated 5 cols) */}
          <Stagger className="lg:col-span-5 grid sm:grid-cols-2 gap-4 sm:gap-5" staggerDelay={0.12}>
            {/* Card 1 — I'm Looking for Love */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e0d4] shadow-sm flex flex-col items-center text-center gap-4 card-hover-lift">
                <div className="w-14 h-14 bg-[#fbf5ec] rounded-full flex items-center justify-center">
                  <Heart size={24} className="text-[#7b1d2a]" fill="#7b1d2a" />
                </div>
                <div>
                  <h3 className="font-serif text-[#1a1a1a] text-base sm:text-lg font-bold mb-1.5">
                    I&apos;m Looking for Love
                  </h3>
                  <p className="font-sans text-gray-500 text-xs sm:text-sm leading-relaxed">
                    Join our matchmaking community and meet intentional singles.
                  </p>
                </div>
                <Button href="/register" variant="primary" size="md" className="w-full mt-auto">
                  Get Started
                  <ArrowRight size={14} />
                </Button>
              </div>
            </StaggerItem>

            {/* Card 2 — I Want to Learn */}
            <StaggerItem>
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e8e0d4] shadow-sm flex flex-col items-center text-center gap-4 card-hover-lift">
                <div className="w-14 h-14 bg-[#fbf5ec] rounded-full flex items-center justify-center">
                  <GraduationCap size={24} className="text-[#c9962c]" />
                </div>
                <div>
                  <h3 className="font-serif text-[#1a1a1a] text-base sm:text-lg font-bold mb-1.5">
                    I Want to Learn
                  </h3>
                  <p className="font-sans text-gray-500 text-xs sm:text-sm leading-relaxed">
                    Watch our video podcast and gain practical relationship knowledge.
                  </p>
                </div>
                <Button href="/podcast" variant="gold" size="md" className="w-full mt-auto">
                  Watch Now
                  <ArrowRight size={14} />
                </Button>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
