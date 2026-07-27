"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { navItems } from "@/data/navigation";
import Button from "@/components/ui/Button";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0" aria-label="Relationship Wahala & Connections Home">
            <div className="relative w-12 h-12">
              <Image
                src="/images/logo.jpeg"
                alt="Relationship Wahala & Connections logo"
                fill
                className="object-contain rounded-sm"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-serif font-bold text-[#7b1d2a] text-sm leading-tight">
                RELATIONSHIP
              </p>
              <p className="font-serif font-bold text-[#7b1d2a] text-sm leading-tight">
                WAHALA &amp; CONNECTIONS
              </p>
              <p className="font-sans text-[10px] text-[#c9962c] tracking-widest uppercase leading-tight">
                Where Love Meets Wisdom
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className="flex items-center gap-1 px-3 py-2 font-sans text-sm font-medium text-gray-700 hover:text-[#7b1d2a] transition-colors duration-200 rounded"
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 font-sans text-sm font-medium text-gray-700 hover:text-[#7b1d2a] transition-colors duration-200 rounded block"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 font-sans text-sm text-gray-700 hover:text-[#7b1d2a] hover:bg-[#fbf5ec] transition-colors duration-150"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button href="/login" variant="outline" size="sm" className="!text-gray-700 !border-gray-300 !bg-transparent hover:!bg-gray-50">
              Sign In
            </Button>
            <Button href="/register" variant="primary" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => {
              setMobileOpen((prev) => {
                if (prev) setOpenDropdown(null);
                return !prev;
              });
            }}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-[#7b1d2a] hover:bg-gray-100 transition-colors"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg max-h-[calc(100dvh-4.5rem)] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isExpanded = openDropdown === `mobile-${item.label}`;

              return (
                <div key={item.label}>
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown((prev) => (prev === `mobile-${item.label}` ? null : `mobile-${item.label}`))
                      }
                      className="w-full flex items-center justify-between py-3 px-3 font-sans text-sm font-medium text-gray-800 hover:text-[#7b1d2a] hover:bg-[#fbf5ec] rounded-md transition-colors text-left"
                      aria-expanded={isExpanded}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-[#7b1d2a]" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-3 px-3 font-sans text-sm font-medium text-gray-800 hover:text-[#7b1d2a] hover:bg-[#fbf5ec] rounded-md transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}

                  {hasChildren && isExpanded && (
                    <div className="pl-4 border-l-2 border-[#7b1d2a]/30 ml-3 mt-1 mb-2 space-y-1">
                      {item.children?.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => {
                            setOpenDropdown(null);
                            setMobileOpen(false);
                          }}
                          className="block py-2 px-3 font-sans text-sm text-gray-600 hover:text-[#7b1d2a] hover:bg-[#fbf5ec] rounded transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
              <Button href="/login" variant="outline" size="md" className="!text-gray-700 !border-gray-300 !bg-transparent w-full">
                Sign In
              </Button>
              <Button href="/register" variant="primary" size="md" className="w-full">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
