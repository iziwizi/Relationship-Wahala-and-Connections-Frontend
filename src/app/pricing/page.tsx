"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { CheckCircle2, Crown, Star, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { MatchmakingPackage } from "@/data/demo/packages";
import { motion } from "framer-motion";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PricingPage() {
  const [packages, setPackages] = useState<MatchmakingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOnlinePackages() {
      try {
        const res = await fetch("/api/packages?type=ONLINE");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.packages)) {
            setPackages(json.packages);
          }
        }
      } catch (err) {
        console.error("Error loading online packages:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOnlinePackages();
  }, []);

  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        {/* Hero Section */}
        <section className="py-20 lg:py-24 bg-[#7b1d2a] text-white text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

          <Container>
            <div className="max-w-3xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full mb-4"
              >
                <Sparkles size={16} className="text-[#c9962c]" />
                <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-[#c9962c]">
                  Transparent Matchmaking Packages
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-6 leading-tight"
              >
                Invest in Your Marital Journey
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-sans text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto"
              >
                Choose the online or physical matchmaking tier that aligns with your timeline, preferences, and intentional relationship goals.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 flex justify-center gap-4 flex-wrap"
              >
                <Button href="/matchmaking/experience" variant="gold" size="lg" className="!px-6 !py-3.5 text-sm sm:text-base font-bold shadow-lg">
                  Explore Online vs Physical Options
                </Button>
              </motion.div>
            </div>
          </Container>
        </section>

        {/* Pricing Cards Section */}
        <section className="py-20 lg:py-24 bg-[#fbf5ec]">
          <Container className="max-w-7xl">
            {loading ? (
              <div className="p-16 text-center text-gray-500 font-sans text-base bg-white rounded-3xl border border-gray-200 shadow-sm flex items-center justify-center gap-3 max-w-xl mx-auto">
                <Loader2 size={24} className="animate-spin text-[#7b1d2a]" />
                <span>Loading matchmaking packages...</span>
              </div>
            ) : packages.length === 0 ? (
              <div className="p-12 text-center text-gray-500 font-sans text-base bg-white rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto">
                No active online packages found. Please check back shortly.
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
                {packages.map((pkg, idx) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.12 }}
                    whileHover={{ y: -6 }}
                    className={`relative bg-white rounded-3xl p-8 sm:p-10 border-2 flex flex-col justify-between shadow-md transition-all duration-300 ${
                      pkg.isPopular
                        ? "border-[#c9962c] shadow-2xl scale-[1.03] z-10 ring-4 ring-[#c9962c]/10"
                        : "border-[#e8e0d4] hover:shadow-xl hover:border-[#7b1d2a]/30"
                    }`}
                  >
                    {pkg.isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c9962c] text-white font-sans text-xs sm:text-sm font-bold px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md uppercase tracking-wider">
                        <Star size={14} fill="white" /> Recommended Tier
                      </div>
                    )}

                    <div>
                      {pkg.isPopular && (
                        <div className="w-12 h-12 bg-[#c9962c]/10 rounded-2xl flex items-center justify-center mb-4 text-[#c9962c]">
                          <Crown size={28} />
                        </div>
                      )}

                      {/* Package Title — Increased Font Size */}
                      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-3 leading-snug">
                        {pkg.name}
                      </h2>

                      {/* Package Description — Increased Font Size */}
                      <p className="font-sans text-sm sm:text-base text-gray-600 mb-6 leading-relaxed min-h-[48px]">
                        {pkg.description}
                      </p>

                      {/* Price Section — Increased Font Size */}
                      <div className="mb-6 pb-6 border-b border-[#f0e8dc]">
                        <p className="font-serif text-4xl sm:text-5xl font-bold text-[#7b1d2a] tracking-tight">
                          {formatNGN(pkg.price)}
                        </p>
                        <p className="font-sans text-sm sm:text-base font-semibold text-gray-500 mt-2">
                          Valid for {pkg.durationDays} days · {pkg.matchAllowance === 9999 ? "Unlimited matches" : `up to ${pkg.matchAllowance} matches`}
                        </p>
                      </div>

                      {/* Features List — Increased Font Size & spacing */}
                      <ul className="space-y-4 mb-8">
                        {pkg.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                            <span className="font-sans text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button
                      href="/matchmaking/experience"
                      variant={pkg.isPopular ? "gold" : "primary"}
                      size="lg"
                      className="w-full justify-center !py-3.5 text-sm sm:text-base font-bold shadow-md gap-2"
                    >
                      <span>Get Started</span>
                      <ArrowRight size={18} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
