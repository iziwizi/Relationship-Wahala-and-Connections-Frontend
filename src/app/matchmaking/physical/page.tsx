"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { CheckCircle2, Star, Loader2, Calendar, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { MatchmakingPackage } from "@/data/demo/packages";
import { motion } from "framer-motion";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PhysicalPackagesPage() {
  const [packages, setPackages] = useState<MatchmakingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPhysicalPackages() {
      try {
        const res = await fetch("/api/packages?type=PHYSICAL");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.packages)) {
            setPackages(json.packages);
          }
        }
      } catch (err) {
        console.error("Error loading physical packages:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPhysicalPackages();
  }, []);

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-20 flex-1">
        <Container className="max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#c9962c]/10 border border-[#c9962c]/30 px-4 py-1.5 rounded-full mb-4"
            >
              <Calendar size={15} className="text-[#c9962c]" />
              <span className="font-sans text-xs sm:text-sm font-bold text-[#c9962c] uppercase tracking-wider">
                In-Person &amp; Executive Matchmaking
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-[#1a1a1a] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
            >
              Select Your Physical Matchmaking Package
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-sans text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto"
            >
              Experience personalized, confidential, and executive matchmaking with our team in Lagos. Choose the tier that best matches your expectations.
            </motion.p>
          </div>

          {loading ? (
            <div className="p-16 text-center text-gray-500 font-sans text-base bg-white rounded-3xl border border-gray-200 shadow-sm flex items-center justify-center gap-3 max-w-xl mx-auto">
              <Loader2 size={24} className="animate-spin text-[#7b1d2a]" />
              <span>Loading physical packages...</span>
            </div>
          ) : packages.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-sans text-base bg-white rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto">
              No physical matchmaking packages available at the moment. Please contact support.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-5xl mx-auto">
              {packages.map((pkg, idx) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  whileHover={{ y: -6 }}
                  className={`bg-white rounded-3xl p-8 sm:p-10 border flex flex-col justify-between shadow-lg relative transition-all duration-300 ${
                    pkg.isPopular
                      ? "border-2 border-[#c9962c] shadow-2xl ring-4 ring-[#c9962c]/10"
                      : "border-[#e8e0d4] hover:shadow-xl hover:border-[#7b1d2a]/30"
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#c9962c] text-white font-sans text-xs sm:text-sm font-bold px-5 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                      <Star size={14} fill="white" /> Most Popular Choice
                    </span>
                  )}

                  <div>
                    {/* Package Title — Increased Font Size */}
                    <h2 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                      {pkg.name}
                    </h2>

                    {/* Description — Increased Font Size */}
                    <p className="font-sans text-gray-600 text-sm sm:text-base mb-6 leading-relaxed min-h-[48px]">
                      {pkg.description}
                    </p>

                    {/* Price Section — Increased Font Size */}
                    <div className="mb-6 border-y border-gray-100 py-5">
                      <p className="font-serif text-4xl sm:text-5xl font-bold text-[#7b1d2a] tracking-tight">
                        {formatNGN(pkg.price)}
                      </p>
                    </div>

                    {/* Features List — Increased Font Size */}
                    <ul className="space-y-4 mb-8">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 font-sans text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                          <CheckCircle2 size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Booking Button */}
                  <Link href={`/matchmaking/physical/book?packageId=${pkg.id}`}>
                    <Button
                      variant={pkg.isPopular ? "gold" : "primary"}
                      size="lg"
                      className="w-full justify-center !py-3.5 text-sm sm:text-base font-bold shadow-md gap-2"
                    >
                      <span>Select Package &amp; Book</span>
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
