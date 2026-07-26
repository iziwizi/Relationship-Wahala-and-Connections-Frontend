import React from "react";
import { Heart, GraduationCap, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="py-20 bg-[#fbf5ec] overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — Heading */}
          <div className="animate-fade-in-up">
            <h2 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl lg:text-[2.25rem] xl:text-[2.5rem] font-bold leading-[1.25] mb-4 max-w-2xl">
              <span className="block lg:inline">Ready for a Relationship Built on</span>{" "}
              <br className="hidden lg:block" />
              <span className="block lg:inline">Knowledge and Intention?</span>
            </h2>
            <p className="font-sans text-gray-600 text-base leading-relaxed">
              Take the next step towards love, growth and a lasting marriage.
            </p>
          </div>

          {/* Right — Two cards */}
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Card 1 — I'm Looking for Love */}
            <div className="bg-white rounded-2xl p-6 border border-[#e8e0d4] shadow-sm flex flex-col items-center text-center gap-4 card-hover-lift">
              <div className="w-14 h-14 bg-[#fbf5ec] rounded-full flex items-center justify-center">
                <Heart size={26} className="text-[#7b1d2a]" fill="#7b1d2a" />
              </div>
              <div>
                <h3 className="font-serif text-[#1a1a1a] text-lg font-bold mb-2">
                  I&apos;m Looking for Love
                </h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed">
                  Join our matchmaking community and meet intentional singles.
                </p>
              </div>
              <Button href="/register" variant="primary" size="md" className="w-full mt-auto">
                Get Started Now
                <ArrowRight size={14} />
              </Button>
            </div>

            {/* Card 2 — I Want to Learn */}
            <div className="bg-white rounded-2xl p-6 border border-[#e8e0d4] shadow-sm flex flex-col items-center text-center gap-4 card-hover-lift">
              <div className="w-14 h-14 bg-[#fbf5ec] rounded-full flex items-center justify-center">
                <GraduationCap size={26} className="text-[#c9962c]" />
              </div>
              <div>
                <h3 className="font-serif text-[#1a1a1a] text-lg font-bold mb-2">
                  I Want to Learn
                </h3>
                <p className="font-sans text-gray-500 text-sm leading-relaxed">
                  Watch our video podcast and gain practical relationship knowledge.
                </p>
              </div>
              <Button href="/podcast" variant="gold" size="md" className="w-full mt-auto">
                Watch Now
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
