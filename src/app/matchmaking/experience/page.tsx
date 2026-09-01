"use client";

import React from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Laptop, Users, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function MatchmakingExperiencePage() {
  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-20 flex-1 flex items-center">
        <Container className="max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-[#7b1d2a]/10 border border-[#7b1d2a]/20 px-4 py-1.5 rounded-full mb-4"
            >
              <Heart size={14} className="text-[#7b1d2a]" fill="#7b1d2a" />
              <span className="font-sans text-xs sm:text-sm font-bold text-[#7b1d2a] uppercase tracking-wider">
                Tailored Matchmaking Options
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-serif text-[#1a1a1a] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4"
            >
              Choose Your Matchmaking Experience
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="font-sans text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto"
            >
              Whether you prefer a seamless online matching journey or an in-person, executive consultation service, we provide intentional guidance tailored to your lifestyle.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-5xl mx-auto">
            {/* Card One: Online Matchmaking */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e8e0d4] shadow-lg flex flex-col justify-between hover:shadow-2xl hover:border-[#7b1d2a]/30 transition-all duration-300 group"
            >
              <div>
                <div className="w-16 h-16 bg-[#fbf5ec] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Laptop size={34} className="text-[#7b1d2a]" />
                </div>

                <h2 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                  Online Matchmaking
                </h2>

                <p className="font-sans text-gray-600 text-base sm:text-lg leading-relaxed mb-6 min-h-[56px]">
                  Complete everything online. Browse vetted matches, communicate digitally, and build genuine connections on your own schedule. Ideal for members across Nigeria and the Diaspora.
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 font-sans text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                    <ShieldCheck size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                    <span>Complete registration and match exploration 100% online</span>
                  </li>
                  <li className="flex items-start gap-3 font-sans text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                    <ShieldCheck size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                    <span>Browse compatible profiles &amp; communicate digitally</span>
                  </li>
                  <li className="flex items-start gap-3 font-sans text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                    <ShieldCheck size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                    <span>Ideal for members in Lagos, nationwide &amp; Global Diaspora</span>
                  </li>
                </ul>
              </div>

              <Button
                href="/register"
                variant="primary"
                size="lg"
                className="w-full justify-center !py-3.5 text-sm sm:text-base font-bold shadow-md gap-2 group-hover:bg-[#5c1520] transition-colors"
              >
                <span>Continue Online</span>
                <ArrowRight size={18} />
              </Button>
            </motion.div>

            {/* Card Two: Physical Matchmaking */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#c9962c]/40 shadow-lg flex flex-col justify-between hover:shadow-2xl hover:border-[#c9962c] transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-4 right-4 bg-[#fbf5ec] border border-[#c9962c]/30 text-[#c9962c] font-sans text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                In-Person &amp; Executive
              </div>

              <div>
                <div className="w-16 h-16 bg-[#fbf5ec] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users size={34} className="text-[#c9962c]" />
                </div>

                <h2 className="font-serif text-[#1a1a1a] text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                  Physical Matchmaking
                </h2>

                <p className="font-sans text-gray-600 text-base sm:text-lg leading-relaxed mb-6 min-h-[56px]">
                  Meet with our professional matchmaking team in person. Receive personalized consultations, intensive background vetting, curated physical introductions, and a discreet, high-privacy experience.
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 font-sans text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                    <ShieldCheck size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                    <span>Meet with our matchmaking team in person in Lagos</span>
                  </li>
                  <li className="flex items-start gap-3 font-sans text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                    <ShieldCheck size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                    <span>Receive 1-on-1 consultation &amp; curated introductions</span>
                  </li>
                  <li className="flex items-start gap-3 font-sans text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                    <ShieldCheck size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                    <span>Discreet, concierge-style executive experience</span>
                  </li>
                </ul>
              </div>

              <Button
                href="/matchmaking/physical"
                variant="gold"
                size="lg"
                className="w-full justify-center !py-3.5 text-sm sm:text-base font-bold shadow-md gap-2"
              >
                <span>Book Physical Consultation</span>
                <ArrowRight size={18} />
              </Button>
            </motion.div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
