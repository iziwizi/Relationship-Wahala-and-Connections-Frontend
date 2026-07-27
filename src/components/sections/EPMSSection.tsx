"use client";

import React from "react";
import { Crown, CheckCircle, ArrowRight, Globe } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { FadeUp } from "@/components/motion/Reveal";

const epmsFeatures = [
  "Private Consultation",
  "Background Verification",
  "Personality Assessment",
  "Professional Guidance",
  "Compatibility Matching",
  "Ongoing Relationship Support",
];

// Fixed position coordinates for global network nodes background
const networkNodes = [
  { top: "15%", left: "20%" },
  { top: "25%", left: "45%" },
  { top: "30%", left: "80%" },
  { top: "40%", left: "15%" },
  { top: "50%", left: "60%" },
  { top: "60%", left: "35%" },
  { top: "70%", left: "75%" },
  { top: "80%", left: "25%" },
  { top: "85%", left: "90%" },
  { top: "20%", left: "65%" },
  { top: "45%", left: "85%" },
  { top: "65%", left: "50%" },
  { top: "75%", left: "10%" },
  { top: "10%", left: "40%" },
  { top: "90%", left: "55%" },
];

export default function EPMSSection() {
  return (
    <section className="py-20 bg-[#f9f3ea]">
      <Container>
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Left — EPMS Card */}
          <FadeUp delay={0} className="h-full">
          <div className="bg-[#7b1d2a] rounded-2xl p-8 lg:p-10 flex flex-col justify-between text-white h-full min-h-[420px]">
            <div>
              {/* Icon */}
              <div className="w-14 h-14 bg-[#c9962c]/20 border border-[#c9962c]/40 rounded-xl flex items-center justify-center mb-6">
                <Crown size={28} className="text-[#c9962c]" />
              </div>

              <h2 className="font-serif text-white text-2xl md:text-3xl font-bold leading-tight mb-4">
                Executive Physical
                <br />
                Matchmaking System (EPMS)
              </h2>

              <p className="font-sans text-white/80 text-sm leading-relaxed mb-8">
                A premium, confidential and personalised matchmaking experience
                for the discerning individual.
              </p>

              {/* Features grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-8">
                {epmsFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-2.5">
                    <CheckCircle size={14} className="text-[#c9962c] flex-shrink-0" />
                    <span className="font-sans text-white/90 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Button
              href="/epms"
              variant="gold"
              size="md"
              className="self-start"
            >
              Join EPMS Now
              <ArrowRight size={15} />
            </Button>
          </div>
          </FadeUp>

          {/* Right — Global Vision Card */}
          <FadeUp delay={0.15} className="h-full">
          <div className="bg-[#111111] rounded-2xl p-8 lg:p-10 flex flex-col justify-between h-full min-h-[420px] relative overflow-hidden">
            {/* Decorative network background */}
            <div className="absolute inset-0 opacity-15">
              {networkNodes.map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-[#c9962c] rounded-full"
                  style={{
                    top: pos.top,
                    left: pos.left,
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              {/* Globe icon */}
              <div className="w-14 h-14 bg-[#c9962c]/15 border border-[#c9962c]/30 rounded-xl flex items-center justify-center mb-6">
                <Globe size={28} className="text-[#c9962c]" />
              </div>

              <h2 className="font-serif text-white text-2xl md:text-3xl font-bold leading-tight mb-4">
                Our Global Vision
              </h2>

              <p className="font-sans text-white/75 text-sm leading-relaxed mb-8">
                While rooted in Lagos, Nigeria, our vision knows no borders. We
                connect intentional individuals across Nigeria and around the
                world, creating meaningful, culturally rich and lasting
                relationships.
              </p>

              {/* Highlighted tagline */}
              <div>
                <p className="font-serif text-[#c9962c] text-2xl md:text-3xl font-bold leading-tight">
                  Local Roots.
                  <br />
                  Global Connections.
                </p>
              </div>
            </div>
          </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
