"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import {
  CheckCircle2,
  Mail,
  Phone,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Home,
  Loader2,
  Building2,
  Copy,
  CheckCheck,
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
  paymentMethod?: string;
  status: string;
}

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
}

const DEFAULT_BANK_DETAILS: BankDetails = {
  bankName: "First Bank of Nigeria",
  accountName: "Relationship Wahala and Connections Services",
  accountNumber: "2049581735",
  instructions: "Please include your booking reference number in your transfer description.",
};

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
  const [bankDetails, setBankDetails] = useState<BankDetails>(DEFAULT_BANK_DETAILS);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
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

  useEffect(() => {
    async function loadBankInfo() {
      try {
        const res = await fetch("/api/public/bank-details");
        if (res.ok) {
          const data = await res.json();
          if (data.bankName && data.accountNumber) {
            setBankDetails({
              bankName: data.bankName,
              accountName: data.accountName,
              accountNumber: data.accountNumber,
              instructions: data.instructions || DEFAULT_BANK_DETAILS.instructions,
            });
          }
        }
      } catch (err) {
        console.warn("Using fallback bank details:", err);
      }
    }
    loadBankInfo();
  }, []);

  const copyToClipboard = (text: string, type: "account" | "ref") => {
    navigator.clipboard.writeText(text);
    if (type === "account") {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const whatsappMessage = booking
    ? encodeURIComponent(
        `Hello Relationship Wahala & Connections, I have booked a physical matchmaking consultation for ${booking.packageName} (Booking Ref: ${booking.bookingReference}, Amount: ${formatNGN(booking.amount)}). Please find my proof of transfer attached.`
      )
    : encodeURIComponent(
        `Hello Relationship Wahala & Connections, I have completed a physical matchmaking consultation booking.`
      );

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
                  Appointment Reserved
                </span>
                <h1 className="font-serif text-[#1a1a1a] text-3xl sm:text-4xl font-bold mt-4 mb-3">
                  Consultation Booking Confirmed!
                </h1>
                <p className="font-sans text-gray-700 text-base sm:text-lg max-w-xl mx-auto font-medium">
                  Thank you for booking your executive physical matchmaking consultation with Relationship Wahala &amp; Connections.
                </p>
              </div>

              {/* Official Bank Account Details Card for Payment */}
              <div className="bg-[#fbf5ec] border border-[#e8e0d4] rounded-3xl p-6 sm:p-8 text-left space-y-4 max-w-2xl mx-auto shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#e8e0d4]">
                  <div className="flex items-center gap-2 text-[#7b1d2a]">
                    <Building2 size={20} />
                    <h2 className="font-serif font-bold text-base sm:text-lg text-[#1a1a1a]">
                      Official Bank Account Details
                    </h2>
                  </div>
                  <span className="text-[11px] font-sans font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    Bank Transfer
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-xs font-sans">
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                    <p className="text-gray-500 font-semibold text-[11px]">Bank Name</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{bankDetails.bankName}</p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                    <p className="text-gray-500 font-semibold text-[11px]">Account Name</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{bankDetails.accountName}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-[#7b1d2a]/30 flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-[11px] font-sans uppercase font-bold tracking-wider">
                      Account Number
                    </p>
                    <p className="font-mono font-bold text-xl sm:text-2xl text-[#7b1d2a] tracking-wider mt-0.5">
                      {bankDetails.accountNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bankDetails.accountNumber, "account")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7b1d2a] text-white rounded-xl text-xs font-bold hover:bg-[#5c1520] transition-colors shadow-sm"
                  >
                    {copiedAccount ? (
                      <>
                        <CheckCheck size={15} className="text-green-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} />
                        <span>Copy Account</span>
                      </>
                    )}
                  </button>
                </div>

                {booking && (
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between text-xs font-sans">
                    <div>
                      <p className="text-gray-500 text-[11px]">Transfer Narration / Ref</p>
                      <p className="font-mono font-bold text-sm text-gray-900">{booking.bookingReference}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(booking.bookingReference, "ref")}
                      className="text-gray-500 hover:text-[#7b1d2a] font-semibold flex items-center gap-1 text-xs"
                    >
                      {copiedRef ? <CheckCheck size={14} className="text-green-600" /> : <Copy size={14} />}
                      <span>{copiedRef ? "Copied" : "Copy Ref"}</span>
                    </button>
                  </div>
                )}

                <p className="font-sans text-xs text-gray-600 leading-relaxed pt-1">
                  💡 {bankDetails.instructions} After initiating transfer, please click the green <strong>WhatsApp Support</strong> button below to send your payment receipt for instant confirmation.
                </p>
              </div>

              {/* Booking Details Summary Card */}
              {booking && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left space-y-4 max-w-2xl mx-auto font-sans">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Booking Reference</p>
                      <p className="font-mono font-bold text-base text-[#7b1d2a]">
                        {booking.bookingReference}
                      </p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                      RESERVED
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
                      <p className="text-gray-500 font-semibold">Amount to Pay:</p>
                      <p className="font-bold text-gray-900 text-sm">{formatNGN(booking.amount)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informational Alerts */}
              <div className="grid sm:grid-cols-3 gap-4 text-left">
                <div className="bg-[#fbf5ec] p-4 rounded-2xl border border-[#e8e0d4] space-y-1">
                  <div className="flex items-center gap-2 text-[#7b1d2a] font-sans font-bold text-xs">
                    <Phone size={14} />
                    <span>Direct Follow-up</span>
                  </div>
                  <p className="font-sans text-xs text-gray-600">
                    Our lead matchmaker will contact you on 08066689080 to confirm your consultation schedule.
                  </p>
                </div>

                <div className="bg-[#fbf5ec] p-4 rounded-2xl border border-[#e8e0d4] space-y-1">
                  <div className="flex items-center gap-2 text-[#7b1d2a] font-sans font-bold text-xs">
                    <Mail size={14} />
                    <span>Confirmation Email</span>
                  </div>
                  <p className="font-sans text-xs text-gray-600">
                    A copy of your booking schedule and receipt instructions has been sent to your email.
                  </p>
                </div>

                <div className="bg-[#fbf5ec] p-4 rounded-2xl border border-[#e8e0d4] space-y-1">
                  <div className="flex items-center gap-2 text-[#7b1d2a] font-sans font-bold text-xs">
                    <MapPin size={14} />
                    <span>Private Venue Notice</span>
                  </div>
                  <p className="font-sans text-xs text-gray-600">
                    The exact meeting suite location will be sent to your email and phone prior to the appointment.
                  </p>
                </div>
              </div>

              {/* Venue Privacy Notice */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs font-sans text-amber-900 max-w-2xl mx-auto flex items-start gap-3 text-left">
                <ShieldCheck size={20} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold mb-0.5">Confidential Executive Venue</p>
                  <p>
                    For discretion and safety, our meeting locations are shared privately with booked clients.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
                <a
                  href={`https://wa.me/2348066689080?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white font-sans text-xs font-bold px-6 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-md"
                >
                  <MessageCircle size={16} />
                  <span>Send Receipt on WhatsApp</span>
                </a>

                <a
                  href="tel:08066689080"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#5c1520] transition-colors shadow-md"
                >
                  <Phone size={16} />
                  <span>Call 08066689080</span>
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
