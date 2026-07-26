import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Heart, BookOpen, Mic, ArrowRight } from "lucide-react";
import type { Service } from "@/data/services";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Users,
  Heart,
  BookOpen,
  Mic,
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] ?? Users;

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {/* Icon badge */}
        <div className="absolute top-4 left-4 w-10 h-10 bg-[#7b1d2a] rounded-full flex items-center justify-center shadow-md">
          <Icon size={18} className="text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-[#1a1a1a] text-lg font-bold mb-3 leading-snug">
          {service.title}
        </h3>
        <p className="font-sans text-gray-600 text-sm leading-relaxed flex-1">
          {service.description}
        </p>
        <Link
          href={service.ctaHref}
          className="inline-flex items-center gap-1.5 text-[#7b1d2a] font-sans text-sm font-semibold mt-4 hover:text-[#5c1520] hover:gap-2.5 transition-all duration-200 group"
          aria-label={`${service.ctaLabel} about ${service.title}`}
        >
          {service.ctaLabel}
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </div>
    </article>
  );
}
