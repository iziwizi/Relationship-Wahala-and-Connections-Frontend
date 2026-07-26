import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Use | Relationship Wahala & Connections",
  description:
    "Read the Terms of Use for Relationship Wahala & Connections — guidelines for intentional matchmaking, member conduct, and platform services.",
};

// NOTE TO DEVELOPER / LEGAL ADVISOR:
// This document outlines the terms and conditions governing Relationship Wahala & Connections.
// Prior to official production commercial launch, the final text must be reviewed and approved by the client's legal counsel.

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        <section className="py-16 bg-[#fbf5ec]">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-[#e8e0d4] shadow-sm">
              <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">Terms of Use</h1>
              <p className="font-sans text-xs text-gray-400">Last updated: July 2026</p>

              <div className="prose font-sans text-sm text-gray-700 space-y-6 leading-relaxed">
                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">1. Acceptance of Terms</h2>
                  <p>
                    By registering or using Relationship Wahala &amp; Connections (RWC), you agree to comply with these Terms of Use. RWC is designed exclusively for intentional singles seeking genuine marital relationships and relational education.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">2. Member Eligibility &amp; Authenticity</h2>
                  <p>
                    All members must be at least 18 years of age. You agree to provide accurate, honest, and truthful information regarding your identity, marital status, background, and intentions. Providing false information is grounds for immediate account suspension.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">3. Member Conduct &amp; Zero Tolerance</h2>
                  <p>
                    RWC maintains zero tolerance for harassment, fraudulent behavior, vulgarity, or solicitation. Members must treat all candidates with dignity, respect, and discretion.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">4. Subscriptions &amp; Payments</h2>
                  <p>
                    Matchmaking packages and EPMS services are billed according to selected plan terms. Subscriptions grant access to match allowances and guided matchmaking features.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">5. Governing Law</h2>
                  <p>
                    These terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
                  </p>
                </section>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
