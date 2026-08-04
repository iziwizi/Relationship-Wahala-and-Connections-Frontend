"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { CheckCircle2, Star, Loader2, Calendar, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MatchmakingPackage } from "@/data/demo/packages";

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
        <Container className="max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-[#c9962c]/10 border border-[#c9962c]/30 px-4 py-1.5 rounded-full mb-4">
              <Calendar size={14} className="text-[#c9962c]" />
              <span className="font-sans text-xs font-semibold text-[#c9962c] uppercase tracking-wider">
                In-Person &amp; Executive Matchmaking
              </span>
            </div>

            <h1 className="font-serif text-[#1a1a1a] text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Select Your Physical Matchmaking Package
            </h1>

            <p className="font-sans text-gray-600 text-base sm:text-lg leading-relaxed">
              Experience personalized, confidential, and professional matchmaking with our team. Choose the tier that best matches your expectations.
            </p>
          </div>

          {loading ? (
            <div className="p-16 text-center text-gray-500 font-sans text-sm bg-white rounded-3xl border border-gray-200 shadow-sm flex items-center justify-center gap-3 max-w-xl mx-auto">
              <Loader2 size={20} className="animate-spin text-[#7b1d2a]" />
              <span>Loading physical packages from PostgreSQL...</span>
            </div>
          ) : packages.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-sans text-sm bg-white rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto">
              No physical matchmaking packages available at the moment. Please contact support.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-3xl p-8 sm:p-10 border flex flex-col justify-between shadow-lg relative transition-all duration-300 ${
                    pkg.isPopular
                      ? "border-2 border-[#c9962c] shadow-xl"
                      : "border-[#e8e0d4]"
                  }`}
                >
                  {pkg.isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c9962c] text-white font-sans text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                      <Star size={12} fill="white" /> Most Popular Choice
                    </span>
                  )}

                  <div>
                    <h2 className="font-serif text-[#1a1a1a] text-2xl font-bold mb-2">
                      {pkg.name}
                    </h2>
                    <p className="font-sans text-gray-500 text-xs sm:text-sm mb-6 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="mb-6 border-y border-gray-100 py-4">
                      <p className="font-serif text-3xl sm:text-4xl font-bold text-[#7b1d2a]">
                        {formatNGN(pkg.price)}
                      </p>
                    </div>

                    <ul className="space-y-3.5 mb-8">
                      {pkg.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3 font-sans text-xs sm:text-sm text-gray-700">
                          <CheckCircle2 size={18} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={`/matchmaking/physical/book?packageId=${pkg.id}`}>
                    <Button
                      variant={pkg.isPopular ? "gold" : "primary"}
                      size="lg"
                      className="w-full justify-center gap-2"
                    >
                      <span>Select Package &amp; Book</span>
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
