import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { Users, Heart, BookOpen, Mic, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Services | Relationship Wahala & Connections",
  description:
    "Explore our full range of relationship services including intentional matchmaking, pre-marital counseling, relationship problem solving, and video podcast education.",
};

const mainServices = [
  {
    id: "intentional-matchmaking",
    title: "Intentional Matchmaking",
    tagline: "Connecting compatible singles locally and globally based on shared values and marital vision.",
    description:
      "We connect compatible singles locally and globally, focusing on shared values, vision, and long-term marital compatibility. Every candidate undergoes vetting to ensure you spend time only with intentional, marriage-ready individuals.",
    bullets: [
      "Vetted & verified profile screening",
      "Values, genotype & personality alignment",
      "Local & Diaspora matchmaking access",
      "100% Confidentiality & professional discretion",
    ],
    icon: Users,
    ctaText: "Start Matchmaking",
    ctaHref: "/register",
    bg: "bg-white",
  },
  {
    id: "pre-marital-counseling",
    title: "Pre-Marital Counseling",
    tagline: "Discover hidden layers, identify red flags, and build a solid foundation before 'I do'.",
    description:
      "We help you discover the hidden parts of each other, identify and address potential red flags, and work on how your individual weaknesses and strengths can complement one another—long before you say 'I do.'",
    bullets: [
      "1-on-1 & Couple counseling sessions",
      "Communication & conflict management frameworks",
      "Financial, cultural & family expectation alignment",
      "Red-flag evaluation and resolution coaching",
    ],
    icon: Heart,
    ctaText: "Book Counseling Session",
    ctaHref: "/contact?service=counseling",
    bg: "bg-[#fbf5ec]",
  },
  {
    id: "relationship-solutions",
    title: "Relationship & Marital Problem Solving (Knowledge-Based Solutions)",
    tagline: "Actionable digital content, resources, and practical guides to navigate courtship and marriage.",
    description:
      "We provide educational content, digital resources, and practical guides to help singles and couples navigate everything from the dating phase to the complexities of marriage.",
    bullets: [
      "Interactive digital relationship guides",
      "Conflict resolution step-by-step toolkits",
      "Marriage enhancement workshops & webinars",
      "Expert-backed relational wisdom",
    ],
    icon: BookOpen,
    ctaText: "Explore Resources",
    ctaHref: "/resources",
    bg: "bg-white",
  },
  {
    id: "video-podcast",
    title: "The Video Podcast (Relationship Education)",
    tagline: "Raw, insightful, and expert-driven conversations on love, dating, conflict resolution, and marital success.",
    description:
      "Our interactive multimedia platform where we host raw, insightful, and expert-driven conversations about complexities of love, dating & relationships, conflict resolution, and marital success.",
    bullets: [
      "Weekly episode releases on YouTube & streaming platforms",
      "Expert guest interviews & couple case studies",
      "Cultural nuances & modern courtship hurdles decoded",
      "Free access for all members & audience",
    ],
    icon: Mic,
    ctaText: "Watch Podcast Episodes",
    ctaHref: "/podcast",
    bg: "bg-[#fbf5ec]",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        {/* Services Hero */}
        <section className="py-20 bg-[#7b1d2a] text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#c9962c] bg-white/10 px-3.5 py-1 rounded-full">
                OUR COMPREHENSIVE SERVICES
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6 leading-tight">
                Everything You Need for a Healthy Relationship &amp; Marriage Journey
              </h1>
              <p className="font-sans text-white/80 text-base sm:text-lg leading-relaxed">
                From guided matchmaking and pre-marital counseling to educational resources and video podcast media.
              </p>
            </div>
          </Container>
        </section>

        {/* Services List */}
        <section className="py-16">
          <Container>
            <div className="space-y-12">
              {mainServices.map((srv) => {
                const Icon = srv.icon;

                return (
                  <div
                    key={srv.id}
                    id={srv.id}
                    className={`p-8 sm:p-10 rounded-2xl border border-[#e8e0d4] shadow-sm ${srv.bg}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                      <div className="flex-1">
                        <div className="w-12 h-12 bg-[#7b1d2a] text-white rounded-xl flex items-center justify-center mb-4">
                          <Icon size={24} />
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">
                          {srv.title}
                        </h2>
                        <p className="font-sans text-[#7b1d2a] font-semibold text-sm mb-4">
                          {srv.tagline}
                        </p>
                        <p className="font-sans text-gray-600 text-sm leading-relaxed mb-6">
                          {srv.description}
                        </p>

                        <div className="grid sm:grid-cols-2 gap-3 mb-6">
                          {srv.bullets.map((b) => (
                            <div key={b} className="flex items-start gap-2">
                              <CheckCircle2 size={16} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                              <span className="font-sans text-xs text-gray-700 font-medium">{b}</span>
                            </div>
                          ))}
                        </div>

                        <Button href={srv.ctaHref} variant="primary" size="md">
                          {srv.ctaText} <ArrowRight size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
