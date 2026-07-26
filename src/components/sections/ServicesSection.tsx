"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/sections/ServiceCard";
import { services } from "@/data/services";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/Reveal";

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white">
      <Container>
        {/* Header row */}
        <FadeUp className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <SectionHeading
            eyebrow="OUR SERVICES"
            heading="Everything You Need for a<br/>Healthy Relationship Journey"
            theme="dark"
          />
          <Link
            href="/services"
            className="flex-shrink-0 inline-flex items-center gap-1.5 text-[#7b1d2a] font-sans text-sm font-semibold hover:text-[#5c1520] hover:gap-2.5 transition-all duration-200 group"
            aria-label="Explore all services"
          >
            Explore All Services
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </FadeUp>

        {/* Service cards grid */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard service={service} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
