import type { Metadata } from "next";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | Relationship Wahala & Connections",
  description:
    "Learn how Relationship Wahala & Connections protects your privacy, personal data, profile confidentiality, and matchmaking information.",
};

// NOTE TO DEVELOPER / LEGAL ADVISOR:
// This document outlines the privacy commitments of Relationship Wahala & Connections.
// Prior to official production commercial launch, the final text must be reviewed and approved by the client's legal counsel.

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        <section className="py-16 bg-[#fbf5ec]">
          <Container>
            <div className="max-w-4xl mx-auto space-y-8 bg-white p-8 sm:p-12 rounded-2xl border border-[#e8e0d4] shadow-sm">
              <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">Privacy Policy</h1>
              <p className="font-sans text-xs text-gray-400">Last updated: July 2026</p>

              <div className="prose font-sans text-sm text-gray-700 space-y-6 leading-relaxed">
                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">1. Commitment to Confidentiality</h2>
                  <p>
                    At Relationship Wahala &amp; Connections (RWC), we prioritize your complete privacy and personal confidentiality. Unlike open social platforms, RWC operates a closed, vetted matchmaking ecosystem. Your profile is shared exclusively with verified, compatible candidates.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">2. Information We Collect</h2>
                  <p>
                    We collect personal information required to facilitate intentional matchmaking, including account credentials, contact information, background details, education, career, lifestyle preferences, and profile photographs.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">3. How Your Information Is Used</h2>
                  <p>
                    Your data is used solely for background verification, compatibility evaluation, confidential match introductions, and internal platform communication. We never sell or broadcast your personal data to third-party marketers.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">4. Data Protection &amp; Security</h2>
                  <p>
                    We employ industry-standard encryption, secure session protocols, and strict access controls to safeguard your profile and payment records.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-lg font-bold text-[#7b1d2a] mb-2">5. Contact Us</h2>
                  <p>
                    If you have privacy concerns or wish to request data deletion, contact us at <a href="mailto:hello@relationshipwahala.com" className="text-[#7b1d2a] font-semibold underline">hello@relationshipwahala.com</a>.
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
