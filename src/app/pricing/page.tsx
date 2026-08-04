import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getActivePackages } from "@/lib/repositories/packages.repository";
import { CheckCircle2, Crown, Star, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Matchmaking Packages & Pricing | Relationship Wahala",
  description:
    "Explore our intentional matchmaking subscription packages including Standard Matchmaking, Executive Physical Matchmaking (EPMS), and Global Diaspora VIP.",
};

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default async function PricingPage() {
  const activePackages = await getActivePackages("ONLINE");

  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        <section className="py-20 bg-[#7b1d2a] text-white text-center">
          <Container>
            <div className="max-w-3xl mx-auto">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#c9962c] bg-white/10 px-3.5 py-1 rounded-full">
                TRANSPARENT MATCHMAKING PACKAGES
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                Invest in Your Marital Journey
              </h1>
              <p className="font-sans text-white/80 text-base leading-relaxed">
                Choose the online or physical matchmaking tier that aligns with your timeline, preferences, and guided support needs.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Button href="/matchmaking/experience" variant="gold" size="md">
                  Explore Physical vs Online Options
                </Button>
              </div>
            </div>
          </Container>
        </section>

        <section className="py-20 bg-[#fbf5ec]">
          <Container>
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {activePackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative bg-white rounded-2xl border-2 p-8 flex flex-col justify-between shadow-sm transition-all duration-300 ${
                    pkg.isPopular ? "border-[#c9962c] shadow-xl scale-102" : "border-[#e8e0d4]"
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c9962c] text-white font-sans text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <Star size={12} /> Recommended Tier
                    </div>
                  )}

                  <div>
                    {pkg.isPopular && <Crown size={24} className="text-[#c9962c] mb-3" />}
                    <h2 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">{pkg.name}</h2>
                    <p className="font-sans text-xs text-gray-500 mb-6 leading-relaxed">{pkg.description}</p>

                    <div className="mb-6 pb-6 border-b border-[#f0e8dc]">
                      <p className="font-serif text-3xl font-bold text-[#7b1d2a]">{formatNGN(pkg.price)}</p>
                      <p className="font-sans text-xs text-gray-400 mt-1">
                        Valid for {pkg.durationDays} days · up to {pkg.matchAllowance} matches
                      </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                          <span className="font-sans text-xs text-gray-700 font-medium leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button href="/register" variant={pkg.isPopular ? "gold" : "primary"} size="md" className="w-full justify-center">
                    Get Started <ArrowRight size={15} />
                  </Button>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
