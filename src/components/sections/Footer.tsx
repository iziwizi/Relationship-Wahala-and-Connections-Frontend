import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Matchmaking", href: "/matchmaking" },
  { label: "EPMS", href: "/epms" },
  { label: "Podcast", href: "/podcast" },
];

const resourceLinks = [
  { label: "Blog", href: "/resources/blog" },
  { label: "Relationship Guides", href: "/resources/guides" },
  { label: "Success Stories", href: "/resources/success-stories" },
  { label: "Events", href: "/resources/events" },
  { label: "FAQs", href: "/resources/faqs" },
  { label: "Contact Us", href: "/contact" },
];

// Custom Social SVG Icons
function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z" />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#5c1520]">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 — Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5" aria-label="Relationship Wahala & Connections Home">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/logo.jpeg"
                  alt="Relationship Wahala & Connections logo"
                  fill
                  className="object-contain rounded-sm"
                />
              </div>
              <div>
                <p className="font-serif font-bold text-white text-sm leading-tight">
                  RELATIONSHIP
                </p>
                <p className="font-serif font-bold text-white text-sm leading-tight">
                  WAHALA &amp; CONNECTIONS
                </p>
                <p className="font-sans text-[10px] text-[#c9962c] tracking-widest uppercase leading-tight">
                  Where Love Meets Wisdom
                </p>
              </div>
            </Link>
            <p className="font-sans text-white/70 text-sm leading-relaxed mb-6">
              We are a relationship education hub and matchmaking platform committed
              to helping individuals and couples build healthy, lasting relationships.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#c9962c] rounded-full flex items-center justify-center text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#c9962c] rounded-full flex items-center justify-center text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#c9962c] rounded-full flex items-center justify-center text-white transition-colors duration-200"
                aria-label="YouTube"
              >
                <YoutubeIcon size={16} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#c9962c] rounded-full flex items-center justify-center text-white transition-colors duration-200"
                aria-label="TikTok"
              >
                <TikTokIcon size={16} />
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="font-sans font-bold text-white text-sm tracking-wider uppercase mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-sans text-white/70 text-sm hover:text-[#c9962c] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div>
            <h3 className="font-sans font-bold text-white text-sm tracking-wider uppercase mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {resourceLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-sans text-white/70 text-sm hover:text-[#c9962c] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h3 className="font-sans font-bold text-white text-sm tracking-wider uppercase mb-5">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                <span className="font-sans text-white/70 text-sm">Lagos, Nigeria</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:hello@relationshipwahala.com"
                  className="font-sans text-white/70 text-sm hover:text-[#c9962c] transition-colors duration-200 break-all"
                >
                  hello@relationshipwahala.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <a
                    href="tel:+2348012345678"
                    className="block font-sans text-white/70 text-sm hover:text-[#c9962c] transition-colors duration-200"
                  >
                    +234 801 234 5678
                  </a>
                  <a
                    href="tel:+2349098765432"
                    className="block font-sans text-white/70 text-sm hover:text-[#c9962c] transition-colors duration-200"
                  >
                    +234 909 876 5432
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-white/50 text-xs text-center sm:text-left">
            &copy; {currentYear} Relationship Wahala &amp; Connections. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="font-sans text-white/50 text-xs hover:text-white/80 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-white/30 text-xs">|</span>
            <Link
              href="/terms"
              className="font-sans text-white/50 text-xs hover:text-white/80 transition-colors duration-200"
            >
              Terms of Use
            </Link>
            <span className="text-white/30 text-xs">|</span>
            <a
              href="https://mujteknify.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[#c9962c] text-xs hover:underline font-semibold"
            >
              Powered by MUJTEKNIFY
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
