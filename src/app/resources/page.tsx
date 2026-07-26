import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";

import { BookOpen, Heart, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Relationship Resources & Guides | Relationship Wahala",
  description:
    "Explore relationship guides, dating advice, pre-marital toolkits, communication strategies, and conflict resolution resources.",
};

const resourceCategories = [
  {
    title: "Pre-Marital Preparation",
    desc: "Uncover hidden layers, evaluate compatibility, discuss finances, and address red flags before marriage.",
    articles: ["10 Red Flags to Address Before Saying 'I Do'", "Financial Compatibility: Questions Every Couple Must Ask"],
    icon: ShieldCheck,
  },
  {
    title: "Communication & Conflict",
    desc: "Practical frameworks for healthy dialogue, emotional regulation, and resolving disagreements with respect.",
    articles: ["How to De-escalate Marital Conflicts", "5 Myths About Emotional Maturity in Relationships"],
    icon: MessageSquare,
  },
  {
    title: "Intentional Dating & Courtship",
    desc: "Navigating modern romance with clarity, boundaries, and alignment with shared marital values.",
    articles: ["Dating with Purpose: Transitioning from Casual to Marriage-Bound", "The Importance of Genotype Alignment"],
    icon: Heart,
  },
  {
    title: "Marriage & Relational Growth",
    desc: "Actionable guides on maintaining intimacy, mutual respect, and long-term marital success.",
    articles: ["Sustaining Passion After Years of Marriage", "Building Family Traditions Across Cultural Differences"],
    icon: BookOpen,
  },
];

export default function ResourcesPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        <section className="py-20 bg-[#7b1d2a] text-white text-center">
          <Container>
            <div className="max-w-3xl mx-auto">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#c9962c] bg-white/10 px-3.5 py-1 rounded-full">
                KNOWLEDGE-BASED SOLUTIONS
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-6">
                Relationship Guides &amp; Educational Resources
              </h1>
              <p className="font-sans text-white/80 text-base leading-relaxed">
                Practical, expert-backed tools designed to help singles and couples build healthy, lasting relationships.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-[#fbf5ec]">
          <Container>
            <div className="grid md:grid-cols-2 gap-8">
              {resourceCategories.map(({ title, desc, articles, icon: Icon }) => (
                <div key={title} className="bg-white p-8 rounded-2xl border border-[#e8e0d4] shadow-sm">
                  <div className="w-12 h-12 bg-[#7b1d2a]/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={24} className="text-[#7b1d2a]" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">{title}</h2>
                  <p className="font-sans text-xs text-gray-600 mb-6 leading-relaxed">{desc}</p>
                  <div className="space-y-3 pt-4 border-t border-[#f0e8dc]">
                    {articles.map((art) => (
                      <div key={art} className="flex items-center justify-between font-sans text-xs text-[#7b1d2a] font-semibold hover:underline cursor-pointer">
                        <span>{art}</span>
                        <ArrowRight size={14} />
                      </div>
                    ))}
                  </div>
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
