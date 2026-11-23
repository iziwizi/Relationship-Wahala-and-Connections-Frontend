import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import PromotionalVideoPlayer from "@/components/sections/PromotionalVideoPlayer";
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
        <section className="py-20 lg:py-24 bg-[#7b1d2a] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-widest text-[#c9962c] bg-white/10 px-4 py-1.5 rounded-full">
                ABOUT RELATIONSHIP WAHALA &amp; CONNECTIONS
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">
                Where Love Meets Wisdom, Intention &amp; Clarity
              </h1>
              <p className="font-sans text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
                Based in the vibrant heart of Lagos, Nigeria, we are redefining how modern relationships are built, nurtured, and sustained.
              </p>
            </div>
          </Container>
        </section>

        {/* Who We Are */}
        <section className="py-20 bg-[#fbf5ec]">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8">
              <div>
                <SectionHeading eyebrow="WHO WE ARE" heading="More Than Just a Matchmaking Service" theme="dark" />
                <p className="font-sans text-gray-800 text-base sm:text-lg leading-relaxed mt-5">
                  Welcome to Relationship Wahala &amp; Connections, Nigeria&apos;s premier knowledge-based relationship and matchmaking platform.
                </p>
                <p className="font-sans text-gray-700 text-base sm:text-lg leading-relaxed mt-3">
                  We believe that finding love is only the beginning. Sustaining it requires wisdom, growth, understanding, and intentional action. That is why we are a relationship education hub and media platform committed to providing real, practical, and actionable solutions to the challenges of modern relationships and marriage.
                </p>
                <p className="font-sans text-gray-700 text-base sm:text-lg leading-relaxed mt-3">
                  Through our flagship video podcast, interactive digital resources, and expert-led discussions, we bring tough relationship conversations to light, breaking down cultural nuances and offering modern solutions to marital hurdles.
                </p>
              </div>

              {/* Core Philosophy Banner */}
              <div className="bg-[#7b1d2a] text-white rounded-3xl p-8 sm:p-10 border-l-8 border-[#c9962c] shadow-xl">
                <p className="font-serif text-[#c9962c] text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
                  OUR CORE PHILOSOPHY
                </p>
                <blockquote className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold italic leading-snug">
                  &ldquo;A great marriage doesn&apos;t happen by accident; it happens by education, intention, and effort.&rdquo;
                </blockquote>
              </div>
            </div>
          </Container>
        </section>

        {/* Official Video Presentation */}
        <PromotionalVideoPlayer
          eyebrow="BRAND DOCUMENTARY"
          title="Watch How We Bridge Hearts & Build Marriages"
          subtitle="A behind-the-scenes look at the mission, values, and heart behind Relationship Wahala & Connections."
          className="bg-white"
        />

        {/* Global Vision */}
        <section className="py-20 bg-white">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="bg-[#fbf5ec] p-8 sm:p-12 rounded-3xl border border-[#e8e0d4] shadow-sm">
                <div className="flex items-center gap-2 text-[#7b1d2a] font-sans text-xs sm:text-sm font-bold uppercase tracking-wider mb-3">
                  <Globe size={18} /> Bridging Distance &amp; Hearts
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] mb-4">
                  Connecting Africans Globally
                </h2>
                <p className="font-sans text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  While headquartered in Lagos, our community extends across the globe. We cater to singles living in Nigeria, the United Kingdom, the United States, Canada, and across the Diaspora who share traditional values and contemporary worldviews.
                </p>
                <p className="font-sans text-gray-700 text-base sm:text-lg leading-relaxed">
                  We leverage modern technology, vetted matchmaking algorithms, and personal relationship coaching to bridge continents and bring compatible hearts together.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-[#fbf5ec]">
          <Container>
            <div className="text-center mb-14">
              <SectionHeading eyebrow="WHY CHOOSE US" heading="Why Intentional Singles &amp; Couples Trust RWC" theme="dark" align="center" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {whyChooseUs.map(({ title, desc, icon: Icon }) => (
                <div key={title} className="bg-white p-7 sm:p-8 rounded-3xl border border-[#e8e0d4] shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-[#7b1d2a]/10 rounded-2xl flex items-center justify-center mb-5">
                    <Icon size={26} className="text-[#7b1d2a]" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1a1a1a] mb-3">{title}</h3>
                  <p className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-[#7b1d2a] text-white text-center">
          <Container>
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4 leading-tight">Let&apos;s Build Healthy Connections, Together</h2>
              <p className="font-sans text-white/90 text-base sm:text-lg leading-relaxed mb-8">
                Whether you are a single looking for a life partner in Nigeria or across the globe, or a couple seeking solutions to strengthen your bond.
              </p>
              <div className="flex justify-center gap-4">
                <Button href="/matchmaking/experience" variant="gold" size="lg" className="!px-8 !py-4 text-base font-bold shadow-xl">
                  Get Started Now <ArrowRight size={18} />
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
