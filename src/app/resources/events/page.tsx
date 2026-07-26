import React from "react";
import Image from "next/image";
import { Calendar, Clock, MapPin, Globe, ArrowRight } from "lucide-react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { getAllEvents } from "@/lib/repositories/events.repository";

export default async function PublicEventsPage() {
  const events = await getAllEvents();

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col">
      <Header />

      <main className="flex-grow pt-28 pb-16">
        <div className="bg-[#1a1a1a] text-white py-14 mb-12">
          <Container>
            <div className="max-w-3xl">
              <span className="font-sans text-xs font-semibold text-[#c9962c] uppercase tracking-widest">
                Workshops &amp; Mixers
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3">
                Events &amp; Webinars
              </h1>
              <p className="font-sans text-white/80 text-base leading-relaxed">
                Join live relationship masterclasses, pre-marital financial workshops, and exclusive virtual mixers.
              </p>
            </div>
          </Container>
        </div>

        <Container>
          <div className="space-y-8 max-w-4xl mx-auto">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow grid md:grid-cols-3">
                <div className="relative h-48 md:h-auto">
                  <Image src={event.image} alt={event.title} fill className="object-cover" />
                  <span className={`absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    event.isOnline ? "bg-blue-600" : "bg-[#7b1d2a]"
                  }`}>
                    {event.isOnline ? "Virtual Event" : "Physical Event"}
                  </span>
                </div>

                <div className="p-6 md:col-span-2 flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1a1a1a] mb-2">{event.title}</h2>
                    <p className="font-sans text-xs text-gray-600 leading-relaxed mb-4">{event.description}</p>

                    <div className="grid sm:grid-cols-2 gap-2 text-xs font-sans text-gray-600 mb-6 bg-[#fbf5ec] p-3.5 rounded-xl border border-[#e8e0d4]">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#7b1d2a]" />
                        <span>{event.eventDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-[#c9962c]" />
                        <span>{event.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        {event.isOnline ? <Globe size={14} className="text-blue-600" /> : <MapPin size={14} className="text-[#7b1d2a]" />}
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Button href={event.registrationUrl} variant="primary" size="sm" className="gap-1.5">
                      Reserve Seat / Register <ArrowRight size={14} />
                    </Button>
                  </div>
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
