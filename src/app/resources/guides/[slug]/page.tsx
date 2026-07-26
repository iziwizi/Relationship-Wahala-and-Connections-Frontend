import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getGuideBySlug } from "@/lib/repositories/guides.repository";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuideDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16">
        <Container>
          <div className="mb-6">
            <Link
              href="/resources/guides"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold text-[#7b1d2a] hover:opacity-80"
            >
              <ArrowLeft size={14} /> Back to Guides
            </Link>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-10">
            <div className="mb-6">
              <span className="bg-[#7b1d2a]/10 text-[#7b1d2a] font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {guide.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a1a1a] mt-3 mb-3">
                {guide.title}
              </h1>
              <p className="font-sans text-gray-600 text-sm leading-relaxed mb-4 italic border-l-4 border-[#c9962c] pl-4">
                {guide.excerpt}
              </p>
            </div>

            <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-8">
              <Image src={guide.featuredImage} alt={guide.title} fill className="object-cover" priority />
            </div>

            <div className="prose prose-stone max-w-none font-sans text-gray-800 text-sm sm:text-base leading-relaxed space-y-4">
              {guide.content.split("\n").map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("### ")) {
                  return (
                    <h3 key={index} className="font-serif text-xl font-bold text-[#1a1a1a] mt-6 mb-2">
                      {trimmed.replace("### ", "")}
                    </h3>
                  );
                }
                return <p key={index}>{trimmed}</p>;
              })}
            </div>

            <div className="mt-12 p-6 bg-[#fbf5ec] border border-[#e8e0d4] rounded-2xl text-center space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#1a1a1a]">Need Professional Relationship Coaching?</h3>
              <p className="font-sans text-xs text-gray-600 max-w-lg mx-auto">
                Schedule a 1-on-1 counseling session or join our Executive Physical Matchmaking Service today.
              </p>
              <Button href="/register" variant="primary" size="md">
                Register for Matchmaking
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
