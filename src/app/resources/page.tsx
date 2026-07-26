import React from "react";
import Link from "next/link";
import { BookOpen, Video, FileText, Heart, Calendar, HelpCircle, ArrowRight } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";

const resourceCategories = [
  {
    title: "Relationship Blog",
    description: "In-depth articles on intentional dating, communication, and preparing for marriage.",
    icon: BookOpen,
    href: "/resources/blog",
    count: "5 Articles",
    color: "bg-[#7b1d2a]",
  },
  {
    title: "Video Podcast",
    description: "Watch Faruq and guest experts unpack real relationship challenges.",
    icon: Video,
    href: "/podcast",
    count: "4 Episodes",
    color: "bg-[#c9962c]",
  },
  {
    title: "Relationship Guides",
    description: "Step-by-step guides on pre-marital readiness, finances, and conflict resolution.",
    icon: FileText,
    href: "/resources/guides",
    count: "5 Guides",
    color: "bg-[#7b1d2a]",
  },
  {
    title: "Success Stories",
    description: "Inspiring testimonials from couples who built lasting marriages with RWC.",
    icon: Heart,
    href: "/resources/success-stories",
    count: "5 Stories",
    color: "bg-[#c9962c]",
  },
  {
    title: "Upcoming Events",
    description: "Join live masterclasses, virtual mixers, and pre-marital workshops.",
    icon: Calendar,
    href: "/resources/events",
    count: "3 Events",
    color: "bg-[#7b1d2a]",
  },
  {
    title: "Frequently Asked Questions",
    description: "Find clear answers regarding our matchmaking, EPMS, payments, and privacy.",
    icon: HelpCircle,
    href: "/resources/faqs",
    count: "10 FAQs",
    color: "bg-[#c9962c]",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16">
        {/* Page Hero */}
        <div className="bg-[#1a1a1a] text-white py-16 mb-12">
          <Container>
            <div className="max-w-3xl">
              <span className="font-sans text-xs font-semibold text-[#c9962c] uppercase tracking-widest">
                Knowledge &amp; Wisdom Hub
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-4">
                Relationship Resources &amp; Education
              </h1>
              <p className="font-sans text-white/80 text-base sm:text-lg leading-relaxed">
                Empowering intentional singles and married couples with practical advice, expert podcasts, comprehensive guides, and success stories.
              </p>
            </div>
          </Container>
        </div>

        <Container>
          {/* Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resourceCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.title}
                  href={cat.href}
                  className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${cat.color} text-white rounded-xl flex items-center justify-center`}>
                        <Icon size={22} />
                      </div>
                      <span className="font-sans text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {cat.count}
                      </span>
                    </div>

                    <h2 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2 group-hover:text-[#7b1d2a] transition-colors">
                      {cat.title}
                    </h2>
                    <p className="font-sans text-sm text-gray-600 leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 font-sans text-xs font-semibold text-[#7b1d2a] group-hover:gap-3 transition-all">
                    <span>Explore Section</span>
                    <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Featured Knowledge Banner */}
          <div className="mt-16 bg-white rounded-2xl border border-[#e8e0d4] p-8 md:p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="font-sans text-xs font-bold text-[#7b1d2a] uppercase tracking-wider">
                Featured Pre-Marital Resource
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1a1a1a] mt-2 mb-3">
                5 Crucial Pre-Marital Conversations Every Couple Must Have
              </h3>
              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                Before saying &quot;I do&quot;, learn how to navigate financial clarity, family boundaries, genotype checks, and career plans.
              </p>
            </div>
            <Link
              href="/resources/blog/5-crucial-pre-marital-conversations-nigerian-couples"
              className="inline-flex items-center justify-center gap-2 bg-[#7b1d2a] text-white px-6 py-3.5 rounded-xl font-sans text-sm font-semibold hover:bg-[#5c1520] transition-colors whitespace-nowrap"
            >
              Read Article Now
              <ArrowRight size={16} />
            </Link>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
