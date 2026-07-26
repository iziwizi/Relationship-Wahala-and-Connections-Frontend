import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { Globe, Heart, ShieldCheck, BookOpen, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Relationship Wahala & Connections",
  description:
    "Learn about our story, mission, and the founders behind Relationship Wahala & Connections — Nigeria's premier knowledge-based relationship and matchmaking platform.",
};

const whyChooseUs = [
  {
    title: "A Knowledge-First Approach",
    desc: "We don't just match profiles; we prepare hearts. Through our video podcast, counseling, and digital resources, we give you the tools to build a relationship that lasts.",
    icon: BookOpen,
  },
  {
    title: "Global Reach with African Roots",
    desc: "Proudly based in Lagos, Nigeria, we understand rich cultural dynamics while bridging geographical gaps to connect intentional singles worldwide.",
    icon: Globe,
  },
  {
    title: "Proactive Red-Flag Resolution",
    desc: "We help couples uncover hidden layers, address red flags early, and align strengths before making a lifelong marital commitment.",
    icon: Heart,
  },
  {
    title: "Vetted, Intentional Community",
    desc: "Strict verification ensures your time is invested only in high-quality, like-minded connections genuinely ready for marriage.",
    icon: Users,
  },
  {
    title: "100% Confidentiality & Discretion",
    desc: "Your privacy is our utmost priority. Every stage of your matchmaking journey is handled with professional discretion.",
    icon: ShieldCheck,
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        {/* About Hero */}
        <section className="py-20 bg-[#7b1d2a] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#c9962c] bg-white/10 px-3.5 py-1 rounded-full">
                ABOUT RELATIONSHIP WAHALA &amp; CONNECTIONS
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">
                Where Love Meets Wisdom, Intention &amp; Clarity
              </h1>
              <p className="font-sans text-white/80 text-base sm:text-lg leading-relaxed">
                Based in the vibrant heart of Lagos, Nigeria, we are redefining how modern relationships are built, nurtured, and sustained.
              </p>
            </div>
          </Container>
        </section>

        {/* Who We Are */}
        <section className="py-16 bg-[#fbf5ec]">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <SectionHeading eyebrow="WHO WE ARE" heading="More Than Just a Matchmaking Service" theme="dark" />
                <p className="font-sans text-gray-700 text-base leading-relaxed mt-4">
                  Welcome to Relationship Wahala and Connections, Nigeria&apos;s premier knowledge-based relationship and matchmaking platform.
                </p>
                <p className="font-sans text-gray-600 text-base leading-relaxed mt-3">
                  We believe that finding love is only the beginning. Sustaining it requires wisdom, growth, understanding, and intentional action. That is why we are a relationship education hub and media platform committed to providing real, practical, and actionable solutions to the challenges of modern relationships and marriage.
                </p>
                <p className="font-sans text-gray-600 text-base leading-relaxed mt-3">
                  Through our flagship video podcast, interactive digital resources, and expert-led discussions, we bring tough relationship conversations to light, breaking down cultural nuances and offering modern solutions to marital hurdles.
                </p>
              </div>

              {/* Core Philosophy Banner */}
              <div className="bg-[#7b1d2a] text-white rounded-2xl p-8 border-l-8 border-[#c9962c] shadow-lg">
                <p className="font-serif text-[#c9962c] text-xs font-bold uppercase tracking-widest mb-2">
                  OUR CORE PHILOSOPHY
                </p>
                <blockquote className="font-serif text-xl sm:text-2xl font-bold italic leading-snug">
                  &ldquo;A great marriage doesn&apos;t happen by accident; it happens by education, intention, and effort.&rdquo;
                </blockquote>
              </div>
            </div>
          </Container>
        </section>

        {/* Global Vision & Founders */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Global Vision */}
              <div className="bg-[#fbf5ec] p-8 rounded-2xl border border-[#e8e0d4]">
                <div className="w-12 h-12 bg-[#7b1d2a]/10 rounded-xl flex items-center justify-center mb-5">
                  <Globe size={24} className="text-[#7b1d2a]" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#1a1a1a] mb-4">Our Global Vision</h2>
                <p className="font-sans text-gray-600 text-sm leading-relaxed">
                  While our roots are firmly planted in the rich, community-driven culture of Nigeria, our vision knows no borders. In an increasingly interconnected world, distance, tribe, colour or culture should never be a barrier to finding a soulmate. We specialize in connecting intentional individuals in Nigeria with potential partners across the globe, creating a safe, vetted, and culturally rich bridge for international love and companionship.
                </p>
              </div>

              {/* Meet the Founders */}
              <div className="bg-[#1a1a1a] text-white p-8 rounded-2xl border border-white/10">
                <div className="w-12 h-12 bg-[#c9962c]/20 rounded-xl flex items-center justify-center mb-5">
                  <Users size={24} className="text-[#c9962c]" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-white mb-4">Meet the Founders</h2>
                <p className="font-sans text-white/80 text-sm leading-relaxed mb-4">
                  Relationship Wahala and Connections was co-founded by a visionary duo driven by a shared passion for human connection and relational wellness. Combining unique backgrounds in media production, relationship counseling, and strategic problem-solving, the founders bring both expertise and heart.
                </p>
                <p className="font-sans text-white/70 text-xs italic">
                  Driven by the realities of modern romance and principles of successful marriages, they serve as visionaries behind both the matchmaking network and the video podcast.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-[#fbf5ec]">
          <Container>
            <div className="text-center mb-12">
              <SectionHeading eyebrow="WHY CHOOSE US" heading="Why Intentional Singles &amp; Couples Trust RWC" theme="dark" align="center" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyChooseUs.map(({ title, desc, icon: Icon }) => (
                <div key={title} className="bg-white p-6 rounded-2xl border border-[#e8e0d4] shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#7b1d2a]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={22} className="text-[#7b1d2a]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1a1a1a] mb-2">{title}</h3>
                  <p className="font-sans text-xs text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-[#7b1d2a] text-white text-center">
          <Container>
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl font-bold mb-4">Let&apos;s Build Healthy Connections, Together</h2>
              <p className="font-sans text-white/80 text-sm leading-relaxed mb-6">
                Whether you are a single looking for a life partner in Nigeria or across the globe, or a couple seeking solutions to strengthen your bond.
              </p>
              <div className="flex justify-center gap-4">
                <Button href="/register" variant="gold" size="lg">
                  Get Started Now <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
