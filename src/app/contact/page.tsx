"use client";

import React, { useState } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { MapPin, Mail, Phone, CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Enquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-3 font-sans text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a] focus:border-transparent bg-white";

  return (
    <>
      <Header />
      <main className="pt-20 bg-white">
        <section className="py-16 bg-[#7b1d2a] text-white text-center">
          <Container>
            <div className="max-w-2xl mx-auto">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#c9962c] bg-white/10 px-3.5 py-1 rounded-full">
                WE ARE HERE TO HELP
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-4 mb-4">
                Get in Touch with Our Team
              </h1>
              <p className="font-sans text-white/80 text-sm leading-relaxed">
                Have questions about our intentional matchmaking, EPMS, pre-marital counseling, or video podcast? We&apos;d love to hear from you.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-[#fbf5ec]">
          <Container>
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-[#e8e0d4] shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#7b1d2a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-[#7b1d2a]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">Office Address</h3>
                    <p className="font-sans text-xs text-gray-600 mt-1">Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#e8e0d4] shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#7b1d2a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-[#7b1d2a]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">Email Us</h3>
                    <a href="mailto:hello@relationshipwahalaandconnections.com" className="font-sans text-xs text-[#7b1d2a] font-semibold mt-1 block">
                      hello@relationshipwahalaandconnections.com
                    </a>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#e8e0d4] shadow-sm flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#7b1d2a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-[#7b1d2a]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#1a1a1a]">Call / WhatsApp</h3>
                    <a href="tel:08066689080" className="font-sans text-xs text-gray-700 font-semibold mt-1 block hover:text-[#7b1d2a]">
                      08066689080
                    </a>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-[#e8e0d4] shadow-sm">
                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                      <CheckCircle2 size={36} />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#1a1a1a]">Thank You for Contacting Us!</h2>
                    <p className="font-sans text-sm text-gray-600 max-w-md mx-auto">
                      We have received your message. A member of our relationship team will review your enquiry and get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="font-sans text-xs font-bold text-[#7b1d2a] underline mt-4"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h2 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">Send Us a Message</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Daniel Okonkwo"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="daniel@example.com"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="08066689080"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Enquiry Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className={inputClass}
                        >
                          <option value="General Enquiry">General Enquiry</option>
                          <option value="Matchmaking">Matchmaking Services</option>
                          <option value="EPMS">Executive Physical Matchmaking (EPMS)</option>
                          <option value="Counseling">Pre-Marital Counseling</option>
                          <option value="Podcast/Media">Podcast / Media Enquiries</option>
                          <option value="Technical Support">Technical Support</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Your Message *</label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we assist you on your relationship journey?"
                        className={inputClass}
                      />
                    </div>

                    <Button type="submit" variant="primary" size="lg" className="w-full justify-center">
                      Send Message <Send size={16} />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
