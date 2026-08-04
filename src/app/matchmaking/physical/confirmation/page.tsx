"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import {
  CheckCircle2,
  Mail,
  Phone,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Home,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface BookingDetails {
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  bookingTime: string;
  packageName: string;
  packageDescription?: string;
  amount: number;
  currency?: string;
  paymentStatus: string;
  status: string;
}

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      if (!reference) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/bookings/${reference}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.booking) {
            setBooking(json.booking);
          }
        }
      } catch (err) {
        console.error("Failed to load booking details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [reference]);

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-20 flex-1 flex items-center">
        <Container className="max-w-4xl">
          {loading ? (
            <div className="p-16 text-center text-gray-500 font-sans text-sm bg-white rounded-3xl border border-gray-200 shadow-sm flex items-center justify-center gap-3">
              <Loader2 size={20} className="animate-spin text-[#7b1d2a]" />
              <span>Verifying your booking confirmation...</span>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8e0d4] shadow-xl text-center space-y-8">
              {/* Success Badge */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-700">
                <CheckCircle2 size={44} />
              </div>

              {/* Title & Messages */}
              <div>
                <span className="text-xs font-sans font-bold text-[#c9962c] uppercase tracking-widest bg-[#fbf5ec] px-4 py-1.5 rounded-full">
                  Appointment Confirmed
                </span>
                <h1 className="font-serif text-[#1a1a1a] text-3xl sm:text-4xl font-bold mt-4 mb-3">
                  Booking Successful!
                </h1>
                <p className="font-sans text-gray-700 text-base sm:text-lg max-w-xl mx-auto font-medium">
                  Thank you for booking your physical matchmaking consultation with Relationship Wahala &amp; Connections.
                </p>
              </div>

              {/* Informational Alerts */}
              <div className="grid sm:grid-cols-3 gap-4 text-left">
                <div className="bg-[#fbf5ec] p-4 rounded-2xl border border-[#e8e0d4] space-y-1">
                  <div className="flex items-center gap-2 text-[#7b1d2a] font-sans font-bold text-xs">
                    <Phone size={14} />
                    <span>We&apos;ll contact you shortly</span>
                  </div>
                  <p className="font-sans text-xs text-gray-600">
                    Our lead matchmaker will reach out to confirm your consultation schedule.
                  </p>
                </div>

                <div className="bg-[#fbf5ec] p-4 rounded-2xl border border-[#e8e0d4] space-y-1">
                  <div className="flex items-center gap-2 text-[#7b1d2a] font-sans font-bold text-xs">
                    <Mail size={14} />
                    <span>Confirmation email sent</span>
                  </div>
                  <p className="font-sans text-xs text-gray-600">
                    A copy of your receipt and appointment details has been dispatched to your inbox.
                  </p>
                </div>

                <div className="bg-[#fbf5ec] p-4 rounded-2xl border border-[#e8e0d4] space-y-1">
                  <div className="flex items-center gap-2 text-[#7b1d2a] font-sans font-bold text-xs">
                    <MapPin size={14} />
                    <span>Venue Details Notice</span>
                  </div>
                  <p className="font-sans text-xs text-gray-600">
                    The exact meeting location will be sent to your email after confirmation.
                  </p>
                </div>
              </div>

              {/* Booking Details Card */}
              {booking && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left space-y-4 max-w-2xl mx-auto font-sans">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Reference Number</p>
                      <p className="font-mono font-bold text-base text-[#7b1d2a]">
                        {booking.bookingReference}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                      CONFIRMED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500 font-semibold">Client Name:</p>
                      <p className="font-bold text-gray-900">{booking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold">Package:</p>
                      <p className="font-bold text-gray-900">{booking.packageName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold">Date &amp; Time:</p>
                      <p className="font-bold text-[#7b1d2a]">
                        {new Date(booking.bookingDate).toDateString()} at {booking.bookingTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-semibold">Amount Paid:</p>
                      <p className="font-bold text-gray-900">{formatNGN(booking.amount)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Venue Privacy Notice */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs font-sans text-amber-900 max-w-2xl mx-auto flex items-start gap-3 text-left">
                <ShieldCheck size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-0.5">Confidential Consultation Venue</p>
                  <p>
                    The exact meeting location will be sent to your email after confirmation. For privacy and security reasons, our private consultation venues are disclosed exclusively to confirmed attendees.
                  </p>
                </div>
              </div>

              {/* Contact Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
                <a
                  href="tel:+2348012345678"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#5c1520] transition-colors"
                >
                  <Phone size={16} />
                  <span>Call Us Immediately</span>
                </a>

                <a
                  href="https://wa.me/2348012345678?text=Hello%20Relationship%20Wahala%20Team%2C%20I%20have%20completed%20a%20physical%20matchmaking%20booking."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white font-sans text-xs font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Support</span>
                </a>

                <Link
                  href="/"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-sans text-xs font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Home size={16} />
                  <span>Return Home</span>
                </Link>
              </div>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbf5ec] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#7b1d2a]" size={32} />
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
