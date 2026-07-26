"use client";

import React, { useState } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { ChevronDown, HelpCircle, Search, MessageSquare } from "lucide-react";
import { demoFAQs } from "@/data/demo/cms";

const categories = ["All", "General", "Matchmaking", "EPMS", "Payments", "Privacy", "Account"];

export default function PublicFAQsPage() {
  const faqs = demoFAQs;
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16">
        <div className="bg-[#1a1a1a] text-white py-14 mb-12">
          <Container>
            <div className="max-w-3xl">
              <span className="font-sans text-xs font-semibold text-[#c9962c] uppercase tracking-widest">
                Got Questions?
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3">
                Frequently Asked Questions
              </h1>
              <p className="font-sans text-white/80 text-base leading-relaxed">
                Clear, transparent answers about our matchmaking process, EPMS executive service, verification, and payment options.
              </p>
            </div>
          </Container>
        </div>

        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Search & Category Filter */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions (e.g. EPMS, Paystack, verification, privacy)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-sans text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full font-sans text-xs font-semibold transition-all ${
                      activeCategory === cat
                        ? "bg-[#7b1d2a] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 border border-gray-200 text-center">
                  <HelpCircle size={40} className="text-gray-300 mx-auto mb-3" />
                  <h3 className="font-serif text-lg font-bold text-[#1a1a1a]">No matching questions found</h3>
                  <p className="font-sans text-xs text-gray-500 mt-1">Try adjusting your search terms or category selection.</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-[#1a1a1a] text-base hover:text-[#7b1d2a] transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <span className="bg-[#7b1d2a]/10 text-[#7b1d2a] text-xs font-sans font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0">
                            {faq.category}
                          </span>
                          {faq.question}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`text-[#7b1d2a] flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-0 font-sans text-sm text-gray-600 leading-relaxed border-t border-gray-100 mt-2 pt-4">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Still have questions banner */}
            <div className="bg-white rounded-2xl p-8 border border-[#e8e0d4] text-center space-y-3">
              <MessageSquare size={32} className="text-[#c9962c] mx-auto" />
              <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Still Have Questions?</h3>
              <p className="font-sans text-xs text-gray-600 max-w-md mx-auto">
                Our support and matchmaking team is ready to assist you with any questions or custom inquiries.
              </p>
              <Button href="/contact" variant="primary" size="md">
                Contact Customer Support
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
