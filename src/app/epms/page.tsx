import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { Crown, CheckCircle2, ShieldCheck, ArrowRight, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Executive Physical Matchmaking System (EPMS) | Relationship Wahala & Connections",
  description:
    "A premium, confidential and highly personalized matchmaking experience for discerning individuals seeking a marriage-focused partner.",
};

const epmsPillars = [
  { title: "Private 1-on-1 Consultation", desc: "In-depth consultation with a dedicated senior relationship coach to define your exact relationship requirements." },
  { title: "Rigorous Background Verification", desc: "Comprehensive identity, career, and background checks ensuring complete security and trust." },
  { title: "In-Depth Personality Assessment", desc: "Psychological, values, and genotype alignment to eliminate incompatibilities before introductions." },
  { title: "Physical & Virtual Date Hosting", desc: "Discreet date coordination at premium partner venues or hosted virtual introductions for diaspora clients." },
  { title: "Pre-Marital Coaching Included", desc: "Expert guidance before, during, and after introductions to ensure effective communication and growth." },
  { title: "Ongoing Match Advice & Support", desc: "Continuous feedback sessions and personalized guidance throughout your matchmaking journey." },
];

export default function EPMSPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        {/* EPMS Hero */}
        <section className="py-20 lg:py-24 bg-gradient-to-br from-[#7b1d2a] via-[#5c1520] to-[#111111] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 bg-[#c9962c]/20 border border-[#c9962c]/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Crown size={32} className="text-[#c9962c]" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-[#c9962c] bg-white/10 px-4 py-1.5 rounded-full">
                PREMIUM EXECUTIVE SERVICE
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">
                Executive Physical Matchmaking System (EPMS)
              </h1>
              <p className="font-sans text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                A highly confidential, physical, and personalized matchmaking experience designed for discerning executives, professionals, and high-net-worth individuals.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button href="/matchmaking/physical" variant="gold" size="lg" className="!px-6 !py-3.5 text-sm sm:text-base font-bold shadow-lg">
                  Explore Physical Packages <ArrowRight size={18} />
                </Button>
                <Button href="/contact?service=epms" variant="outline" size="lg" className="!px-6 !py-3.5 text-sm sm:text-base font-bold">
                  Enquire via Contact Form
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Pillars Grid */}
        <section className="py-20 lg:py-24 bg-[#fbf5ec]">
          <Container>
            <div className="text-center mb-14">
              <SectionHeading eyebrow="THE EPMS EXPERIENCE" heading="White-Glove Matchmaking Excellence" theme="dark" align="center" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {epmsPillars.map(({ title, desc }) => (
                <div key={title} className="bg-white p-7 sm:p-8 rounded-3xl border border-[#e8e0d4] shadow-sm hover:shadow-md transition-shadow">
                  <CheckCircle2 size={26} className="text-[#c9962c] mb-4" />
                  <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">{title}</h3>
                  <p className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Confidentiality Commitment */}
        <section className="py-20 bg-white">
          <Container>
            <div className="bg-[#111111] text-white p-8 sm:p-12 lg:p-16 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 shadow-xl">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-[#c9962c] font-sans text-xs sm:text-sm font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck size={20} /> Complete Discretion Guaranteed
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  Your Reputation &amp; Privacy Are Fully Protected
                </h2>
                <p className="font-sans text-white/80 text-base leading-relaxed">
                  EPMS profiles are never visible online or shared without prior written consent. All introductions are handled privately by your senior matchmaker.
                </p>
              </div>
              <Button href="/matchmaking/physical" variant="gold" size="lg" className="whitespace-nowrap !px-8 !py-4 text-base font-bold shadow-xl">
                Book Consultation <Calendar size={18} />
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
