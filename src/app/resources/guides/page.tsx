import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import { getAllGuides } from "@/lib/repositories/guides.repository";

export default async function PublicGuidesPage() {
  const guides = await getAllGuides();

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16">
        <div className="bg-[#1a1a1a] text-white py-14 mb-12">
          <Container>
            <div className="max-w-3xl">
              <span className="font-sans text-xs font-semibold text-[#c9962c] uppercase tracking-widest">
                Educational Toolkits
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3">
                Relationship Guides
              </h1>
              <p className="font-sans text-white/80 text-base leading-relaxed">
                Step-by-step guides, diagnostic checklists, and frameworks for pre-marital preparation and lasting marriage.
              </p>
            </div>
          </Container>
        </div>

        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="relative h-48">
                    <Image src={guide.featuredImage} alt={guide.title} fill className="object-cover" />
                    <span className="absolute top-3 left-3 bg-[#7b1d2a] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {guide.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <h2 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2 hover:text-[#7b1d2a] transition-colors">
                      <Link href={`/resources/guides/${guide.slug}`}>{guide.title}</Link>
                    </h2>
                    <p className="font-sans text-xs text-gray-600 leading-relaxed mb-4">
                      {guide.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <Link
                    href={`/resources/guides/${guide.slug}`}
                    className="w-full bg-[#fbf5ec] border border-[#e8e0d4] text-[#7b1d2a] font-sans text-xs font-semibold py-2.5 rounded-xl inline-flex items-center justify-center gap-2 hover:bg-[#7b1d2a] hover:text-white transition-all"
                  >
                    Read Full Guide <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
