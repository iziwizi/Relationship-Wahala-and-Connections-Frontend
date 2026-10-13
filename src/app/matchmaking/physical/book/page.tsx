"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Loader2,
  Lock,
  Copy,
  CheckCheck,
  AlertCircle
} from "lucide-react";
import { MatchmakingPackage } from "@/data/demo/packages";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Daytime appointment time slots
const DAYTIME_TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  instructions: string;
}

const DEFAULT_BANK_DETAILS: BankDetails = {
  bankName: "First Bank of Nigeria",
  accountName: "Relationship Wahala & Connections Ltd",
  accountNumber: "3012345678",
  instructions: "Please include your full name or booking reference in transfer narration.",
};

function BookPhysicalAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const packageId = searchParams.get("packageId");

  const [selectedPackage, setSelectedPackage] = useState<MatchmakingPackage | null>(null);
  const [loadingPackage, setLoadingPackage] = useState(true);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("10:00 AM");

  // Customer form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PAYSTACK" | "FLUTTERWAVE" | "BANK_TRANSFER">("BANK_TRANSFER");

  // Bank details & copy feedback
  const [bankDetails, setBankDetails] = useState<BankDetails>(DEFAULT_BANK_DETAILS);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load selected package
  useEffect(() => {
    async function loadPackage() {
      try {
        const res = await fetch("/api/packages?type=PHYSICAL");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.packages)) {
            const found = json.packages.find((p: MatchmakingPackage) => p.id === packageId) || json.packages[0];
            setSelectedPackage(found || null);
          }
        }
      } catch (err) {
        console.error("Error loading package details:", err);
      } finally {
        setLoadingPackage(false);
      }
    }
    loadPackage();
  }, [packageId]);

  // Load bank details for direct deposit
  useEffect(() => {
    async function fetchBankInfo() {
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
      } catch (e) {
        console.warn("Using default bank info:", e);
      }
    }
    fetchBankInfo();
  }, []);

  // Generate calendar grid for current month — all future days (Mon-Sun) are bookable
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
    const totalDays = lastDayOfMonth.getDate();

    const days: { date: Date; isCurrentMonth: boolean; isWeekend: boolean; isPast: boolean }[] = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Padding previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1, 12, 0, 0);
      const dayNum = prevDate.getDay();
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isWeekend: dayNum === 0 || dayNum === 6,
        isPast: prevDate < today,
      });
    }

    // Current month days — noon (12:00:00) local time avoids timezone day rollback
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d, 12, 0, 0);
      const dayNum = date.getDay();
      days.push({
        date,
        isCurrentMonth: true,
        isWeekend: dayNum === 0 || dayNum === 6,
        isPast: date < today,
      });
    }

    return days;
  }, [currentMonth]);

  // Preselect the first available upcoming date if none selected
  useEffect(() => {
    if (!selectedDate) {
      const firstAvailable = calendarDays.find((d) => d.isCurrentMonth && !d.isPast);
      if (firstAvailable) {
        setSelectedDate(firstAvailable.date);
      }
    }
  }, [calendarDays, selectedDate]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!selectedDate) {
      setErrorMsg("Please select an appointment date.");
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMsg("Please fill in your name, email, and phone number.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage?.id,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          bookingDate: selectedDate.toISOString(),
          bookingTime: selectedTime,
          notes,
          paymentMethod,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success && json.booking) {
        // Navigate to booking confirmation page with booking reference
        router.push(`/matchmaking/physical/confirmation?reference=${json.booking.bookingReference}`);
      } else {
        setErrorMsg(json.error || "Failed to complete booking. Please try again.");
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setErrorMsg("Network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf5ec] flex flex-col justify-between">
      <Header />

      <main className="pt-28 pb-20 flex-1">
        <Container className="max-w-6xl">
          {/* Top Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-gray-600 hover:text-[#7b1d2a] mb-3"
            >
              <ChevronLeft size={16} /> Back to Physical Packages
            </button>
            <h1 className="font-serif text-[#1a1a1a] text-2xl sm:text-4xl font-bold">
              Book Physical Consultation
            </h1>
            <p className="font-sans text-xs sm:text-sm text-gray-600 mt-1">
              Select your preferred consultation date, daytime slot, and enter your details to finalize your appointment.
            </p>
          </div>

          {loadingPackage ? (
            <div className="p-16 text-center text-gray-500 font-sans text-sm bg-white rounded-3xl border border-gray-200 shadow-sm flex items-center justify-center gap-3">
              <Loader2 size={20} className="animate-spin text-[#7b1d2a]" />
              <span>Loading package details...</span>
            </div>
          ) : !selectedPackage ? (
            <div className="p-12 text-center text-gray-500 font-sans text-sm bg-white rounded-3xl border border-gray-200">
              Selected package not found. Please select a valid package.
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Calendar & Time Slots & Form */}
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Date Selection — All Future Dates Available */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e0d4] shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-[#7b1d2a]">
                      <CalendarIcon size={20} />
                      <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">
                        1. Select Consultation Date
                      </h2>
                    </div>
                    <span className="text-[11px] font-sans font-bold text-[#c9962c] bg-[#fbf5ec] px-3 py-1 rounded-full uppercase tracking-wider">
                      Weekdays &amp; Weekends Available
                    </span>
                  </div>

                  {/* Calendar Month Navigation */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-serif font-bold text-base text-[#1a1a1a]">
                      {currentMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 text-gray-600 hover:text-[#7b1d2a] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 text-gray-600 hover:text-[#7b1d2a] hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid Header */}
                  <div className="grid grid-cols-7 text-center font-sans text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    <span className="text-[#7b1d2a]">Sun</span>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span className="text-[#7b1d2a]">Sat</span>
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {calendarDays.map((item, index) => {
                      const isSelectable = item.isCurrentMonth && !item.isPast;
                      const isSelected =
                        selectedDate &&
                        item.date.toDateString() === selectedDate.toDateString();

                      return (
                        <button
                          key={index}
                          type="button"
                          disabled={!isSelectable}
                          onClick={() => {
                            if (isSelectable) {
                              setSelectedDate(item.date);
                              setErrorMsg("");
                            }
                          }}
                          className={`h-10 sm:h-12 rounded-xl text-xs sm:text-sm font-sans font-semibold flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-[#7b1d2a] text-white shadow-md scale-105"
                              : isSelectable
                              ? item.isWeekend
                                ? "bg-[#fbf5ec] text-[#1a1a1a] hover:bg-[#c9962c]/20 border border-[#c9962c]/40 font-bold"
                                : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
                              : "bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100"
                          }`}
                        >
                          {item.date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  <p className="font-sans text-[11px] text-gray-500 mt-4 text-center italic">
                    Note: Consultations are held throughout the week and weekends at our private executive suites.
                  </p>
                </div>

                {/* 2. Daytime Time Slot Selection */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e0d4] shadow-sm">
                  <div className="flex items-center gap-2 text-[#7b1d2a] mb-6 pb-4 border-b border-gray-100">
                    <Clock size={20} />
                    <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">
                      2. Select Daytime Time Slot
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DAYTIME_TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-sans font-bold flex items-center justify-center gap-2 border transition-all ${
                            isSelected
                              ? "bg-[#7b1d2a] text-white border-[#7b1d2a] shadow-md"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-[#7b1d2a]/50 hover:bg-white"
                          }`}
                        >
                          <Clock size={14} className={isSelected ? "text-white" : "text-[#c9962c]"} />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Customer Details Form */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e0d4] shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-[#7b1d2a] mb-4 pb-3 border-b border-gray-100">
                    <User size={20} />
                    <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">
                      3. Customer Contact Details
                    </h2>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-bold text-gray-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Amina Bello"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl font-sans text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-xs font-bold text-gray-700 uppercase mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. amina@example.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl font-sans text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-xs font-bold text-gray-700 uppercase mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-3 text-gray-400" />
                        <input
                          type="tel"
                          required
                          placeholder="08066689080"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl font-sans text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-bold text-gray-700 uppercase mb-1">
                      Consultation Notes / Preferences (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Any specific requests or background details..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl font-sans text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
                    />
                  </div>
                </div>

                {/* 4. Payment Method & Account Details */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e0d4] shadow-sm space-y-5">
                  <div className="flex items-center gap-2 text-[#7b1d2a] mb-2 pb-3 border-b border-gray-100">
                    <CreditCard size={20} />
                    <h2 className="font-serif font-bold text-lg text-[#1a1a1a]">
                      4. Choose Payment Method
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("BANK_TRANSFER")}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        paymentMethod === "BANK_TRANSFER"
                          ? "border-[#7b1d2a] bg-[#fbf5ec] ring-2 ring-[#7b1d2a]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Building2 size={22} className="text-[#7b1d2a] mb-2" />
                      <div>
                        <p className="font-sans text-xs font-bold text-[#1a1a1a]">Direct Bank Deposit</p>
                        <p className="font-sans text-[10px] text-gray-500">Official Bank Account Transfer</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("PAYSTACK")}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        paymentMethod === "PAYSTACK"
                          ? "border-[#7b1d2a] bg-[#fbf5ec] ring-2 ring-[#7b1d2a]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard size={22} className="text-[#7b1d2a] mb-2" />
                      <div>
                        <p className="font-sans text-xs font-bold text-[#1a1a1a]">Paystack</p>
                        <p className="font-sans text-[10px] text-gray-500">Debit Cards &amp; Instant USSD</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("FLUTTERWAVE")}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        paymentMethod === "FLUTTERWAVE"
                          ? "border-[#7b1d2a] bg-[#fbf5ec] ring-2 ring-[#7b1d2a]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard size={22} className="text-[#c9962c] mb-2" />
                      <div>
                        <p className="font-sans text-xs font-bold text-[#1a1a1a]">Flutterwave</p>
                        <p className="font-sans text-[10px] text-gray-500">Cards &amp; Mobile Money</p>
                      </div>
                    </button>
                  </div>

                  {/* Direct Bank Account Details Card */}
                  {paymentMethod === "BANK_TRANSFER" && (
                    <div className="bg-[#fbf5ec] border border-[#e8e0d4] rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#e8e0d4]">
                        <span className="font-sans text-xs font-bold text-[#7b1d2a] uppercase tracking-wider">
                          Official Bank Account Details
                        </span>
                        <span className="text-[11px] font-sans font-semibold text-green-700 bg-green-100 px-2.5 py-0.5 rounded-full">
                          Verified Account
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3 text-xs font-sans">
                        <div className="bg-white p-3 rounded-xl border border-gray-200">
                          <p className="text-gray-500 text-[11px]">Bank Name</p>
                          <p className="font-bold text-gray-900 mt-0.5">{bankDetails.bankName}</p>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-gray-200 sm:col-span-2">
                          <p className="text-gray-500 text-[11px]">Account Name</p>
                          <p className="font-bold text-gray-900 mt-0.5">{bankDetails.accountName}</p>
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#7b1d2a]/30 flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-[11px] font-sans">Account Number</p>
                          <p className="font-mono font-bold text-lg text-[#7b1d2a] tracking-wide">
                            {bankDetails.accountNumber}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bankDetails.accountNumber)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7b1d2a] text-white rounded-lg text-xs font-bold hover:bg-[#5c1520] transition-colors"
                        >
                          {copiedAccount ? (
                            <>
                              <CheckCheck size={14} className="text-green-300" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              <span>Copy Number</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="font-sans text-[11px] text-gray-600">
                        {bankDetails.instructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Order Summary Card */}
              <div className="lg:col-span-4 lg:sticky lg:top-28">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e0d4] shadow-lg space-y-6">
                  <h3 className="font-serif font-bold text-lg text-[#1a1a1a] border-b pb-3">
                    Booking Summary
                  </h3>

                  <div>
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#c9962c] bg-[#fbf5ec] px-2.5 py-1 rounded-full">
                      Physical Package
                    </span>
                    <h4 className="font-serif text-xl font-bold text-[#1a1a1a] mt-2">
                      {selectedPackage.name}
                    </h4>
                    <p className="font-serif text-3xl font-bold text-[#7b1d2a] mt-2">
                      {formatNGN(selectedPackage.price)}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl space-y-2 font-sans text-xs text-gray-700 border border-gray-100">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Date:</span>
                      <span className="font-bold text-[#1a1a1a]">
                        {selectedDate
                          ? selectedDate.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Not selected"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Time Slot:</span>
                      <span className="font-bold text-[#7b1d2a]">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-500">Payment:</span>
                      <span className="font-bold text-gray-900">
                        {paymentMethod === "BANK_TRANSFER"
                          ? "Direct Bank Deposit"
                          : paymentMethod === "PAYSTACK"
                          ? "Paystack Gateway"
                          : "Flutterwave Gateway"}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {selectedPackage.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-sans text-gray-600">
                        <CheckCircle2 size={14} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-sans text-red-600 font-medium flex items-center gap-2">
                      <AlertCircle size={15} className="flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting || !selectedDate}
                    className="w-full justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Confirming Appointment...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Confirm &amp; Proceed ({formatNGN(selectedPackage.price)})</span>
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-sans text-gray-500 text-center">
                    <ShieldCheck size={14} className="text-green-600" />
                    <span>256-Bit SSL Encrypted &amp; Confidential</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default function BookPhysicalAppointmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbf5ec] flex items-center justify-center">
          <Loader2 className="animate-spin text-[#7b1d2a]" size={32} />
        </div>
      }
    >
      <BookPhysicalAppointmentContent />
    </Suspense>
  );
}
