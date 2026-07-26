import React from "react";
import Image from "next/image";
import { Heart, MapPin, Calendar, Quote, ShieldCheck } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getAllSuccessStories } from "@/lib/repositories/success-stories.repository";

export default async function PublicSuccessStoriesPage() {
  const stories = await getAllSuccessStories();

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16">
        {/* Banner */}
        <div className="bg-[#1a1a1a] text-white py-14 mb-12">
          <Container>
            <div className="max-w-3xl">
              <span className="font-sans text-xs font-semibold text-[#c9962c] uppercase tracking-widest">
                Real Testimonials &amp; Marriages
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3">
                Success Stories
              </h1>
              <p className="font-sans text-white/80 text-base leading-relaxed">
                Read inspiring stories of couples who found intentional love, navigated long-distance courtship, and built lasting marriages.
              </p>
            </div>
          </Container>
        </div>

        <Container>
          {/* Privacy Note */}
          <div className="mb-10 bg-white rounded-2xl p-5 border border-[#e8e0d4] shadow-sm flex items-center gap-4">
            <ShieldCheck size={24} className="text-[#c9962c] flex-shrink-0" />
            <p className="font-sans text-xs text-gray-600">
              <strong>Client Confidentiality &amp; Privacy:</strong> To protect our members&apos; privacy, display names and details are published with explicit consent or anonymised per client preference.
            </p>
          </div>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <div key={story.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative h-60">
                    <Image src={story.photoUrl} alt={story.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="font-serif text-lg font-bold">{story.displayNames}</p>
                      <div className="flex items-center gap-3 text-xs opacity-90 font-sans mt-0.5">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {story.location}</span>
                        {story.weddingDate && (
                          <span className="flex items-center gap-1"><Calendar size={12} /> {story.weddingDate}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <Quote size={24} className="text-[#c9962c] opacity-60 mb-2" />
                    <h3 className="font-serif text-base font-bold text-[#1a1a1a] mb-2">{story.title}</h3>
                    <p className="font-sans text-xs text-gray-600 leading-relaxed italic">
                      &quot;{story.story}&quot;
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-100 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs text-[#7b1d2a] font-semibold flex items-center gap-1">
                      <Heart size={12} fill="#7b1d2a" /> Verified Match
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center bg-white rounded-2xl p-10 border border-[#e8e0d4] shadow-sm max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">Begin Your Own Success Story</h2>
            <p className="font-sans text-sm text-gray-600">
              Join Nigeria&apos;s premier intentional matchmaking platform today.
            </p>
            <Button href="/register" variant="primary" size="lg" className="justify-center">
              Start Matchmaking Journey
            </Button>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
