import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { ShieldCheck, Globe, Lock, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Intentional Matchmaking | Relationship Wahala & Connections",
  description:
    "Discover intentional, vetted matchmaking in Nigeria and globally. We connect compatible singles based on shared values, vision, and long-term marital compatibility.",
};

const howItWorks = [
  { step: "01", title: "Create Your Profile", desc: "Complete our thorough 8-step intentional matchmaking profile detailing your background, values, and relationship intentions." },
  { step: "02", title: "Background & Vetting", desc: "Our team verifies your profile information to maintain a safe, high-quality community of marriage-ready individuals." },
  { step: "03", title: "Compatibility Matching", desc: "We evaluate shared values, genotype, lifestyle, and relationship timelines to find your most compatible match." },
  { step: "04", title: "Guided Connection", desc: "Receive confidential match introductions with full privacy protection and ongoing relationship guidance." },
];

export default function MatchmakingPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        {/* Matchmaking Hero */}
        <section className="py-20 lg:py-24 bg-gradient-to-br from-[#7b1d2a] via-[#5c1520] to-[#1a1a1a] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-[#c9962c] bg-white/10 px-4 py-1.5 rounded-full">
                INTENTIONAL MARRIAGE MATCHMAKING
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">
                Tired of Casual Dating? Find Love Built for Marriage.
              </h1>
              <p className="font-sans text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                We specialize in connecting intentional singles in Nigeria and across the globe who are ready for serious, lasting relationships.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="/matchmaking/experience" variant="gold" size="lg" className="!px-6 !py-3.5 text-sm sm:text-base font-bold shadow-lg">
                  Get Started <Sparkles size={18} />
                </Button>
                <Button href="/pricing" variant="outline" size="lg" className="!px-6 !py-3.5 text-sm sm:text-base font-bold">
                  View Matchmaking Packages
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-24 bg-[#fbf5ec]">
          <Container>
            <div className="text-center mb-14">
              <SectionHeading eyebrow="OUR PROCESS" heading="How Guided Matchmaking Works" theme="dark" align="center" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {howItWorks.map(({ step, title, desc }) => (
                <div key={step} className="bg-white p-6 sm:p-7 rounded-3xl border border-[#e8e0d4] shadow-sm relative hover:shadow-md transition-shadow">
                  <span className="font-serif text-4xl font-bold text-[#c9962c]/35 block mb-3">{step}</span>
                  <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">{title}</h3>
                  <p className="font-sans text-sm text-gray-700 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Key Pillars */}
        <section className="py-20 lg:py-24 bg-white">
          <Container>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-[#fbf5ec] p-8 rounded-3xl border border-[#e8e0d4]">
                <ShieldCheck size={36} className="text-[#7b1d2a] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3">Strict Profile Vetting</h3>
                <p className="font-sans text-base text-gray-700 leading-relaxed">
                  Every member is vetted for identity, background, and sincere relationship intentions so your time is protected.
                </p>
              </div>

              <div className="bg-[#fbf5ec] p-8 rounded-3xl border border-[#e8e0d4]">
                <Globe size={36} className="text-[#7b1d2a] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3">Local &amp; Global Connections</h3>
                <p className="font-sans text-base text-gray-700 leading-relaxed">
                  Whether in Lagos, Abuja, London, or Toronto, distance is no barrier to finding a compatible African partner.
                </p>
              </div>

              <div className="bg-[#fbf5ec] p-8 rounded-3xl border border-[#e8e0d4]">
                <Lock size={36} className="text-[#7b1d2a] mb-4" />
                <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-3">100% Confidentiality</h3>
                <p className="font-sans text-base text-gray-700 leading-relaxed">
                  Your profile data is never broadcast publicly. Introductions take place with strict privacy and mutual consent.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Final Conversion CTA */}
        <section className="py-20 bg-[#7b1d2a] text-white text-center">
          <Container>
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 leading-tight">Ready to Meet Your Compatible Partner?</h2>
              <p className="font-sans text-white/90 text-base sm:text-lg leading-relaxed mb-8">
                Join our vetted community of intentional singles and take the first step towards a loving, lasting marriage.
              </p>
              <Button href="/matchmaking/experience" variant="gold" size="lg" className="!px-8 !py-4 text-base font-bold shadow-xl">
                Get Started Now <ArrowRight size={18} />
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
