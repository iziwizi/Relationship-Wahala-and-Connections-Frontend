import React from "react";
import Link from "next/link";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

interface ComingSoonPageProps {
  title: string;
  description: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fbf5ec] flex items-center justify-center pt-20">
        <div className="max-w-2xl mx-auto px-6 text-center py-20">
          <div className="w-16 h-16 bg-[#7b1d2a]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-[#7b1d2a] rounded-full" />
          </div>
          <h1 className="font-serif text-[#7b1d2a] text-4xl font-bold mb-4">{title}</h1>
          <p className="font-sans text-gray-600 text-lg leading-relaxed">{description}</p>
          <div className="mt-8 inline-block bg-[#7b1d2a] text-white font-sans text-sm px-6 py-3 rounded-sm">
            <Link href="/">← Back to Home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
