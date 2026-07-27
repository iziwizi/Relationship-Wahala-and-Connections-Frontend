"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { CheckCircle2, Crown, ArrowRight, Star, Loader2, CalendarDays, Users, ShieldCheck } from "lucide-react";

interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  matchAllowance: number;
  features: string[];
  isPopular: boolean;
}

interface ActiveSubscription {
  id: string;
  packageId: string;
  packageName: string;
  packageDescription: string;
  packagePrice: number;
  packageDurationDays: number;
  packageFeatures: string[];
  matchesRemaining: number;
  status: string;
  startDate: string;
  endDate: string;
}

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

function daysRemaining(endDateStr: string): number {
  const endDate = new Date(endDateStr);
  const now = new Date();
  const diff = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

export default function SubscriptionPage() {
  const [sub, setSub] = useState<ActiveSubscription | null>(null);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/user/subscription");
        const data = await res.json();
        if (res.ok && data.success) {
          setSub(data.subscription);
          setPackages(data.packages);
        }
      } catch (err) {
        console.error("[SubscriptionPage] fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Subscription</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Manage your matchmaking plan and explore upgrade options.
          </p>
        </div>

        {loading && (
          <div className="py-10 flex items-center justify-center gap-2 text-gray-400">
            <Loader2 size={20} className="animate-spin text-[#7b1d2a]" />
            <span className="font-sans text-sm">Loading subscription...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Current Plan or No Plan Banner */}
            {sub ? (
              <div className="bg-gradient-to-br from-[#7b1d2a] to-[#5c1520] rounded-2xl p-6 lg:p-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="font-sans text-xs font-semibold text-green-300">Active</span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white">{sub.packageName}</h2>
                    <p className="font-sans text-white/75 text-sm mt-1">{sub.packageDescription}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl px-5 py-3 text-right flex-shrink-0">
                    <p className="font-sans text-xs text-white/70 uppercase tracking-wider">Plan Value</p>
                    <p className="font-serif text-2xl font-bold text-[#c9962c]">{formatNGN(sub.packagePrice)}</p>
                    <p className="font-sans text-xs text-white/60">per {sub.packageDurationDays} days</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/15">
                  {[
                    { label: "Matches Left", value: sub.matchesRemaining, icon: Users },
                    { label: "Days Remaining", value: daysRemaining(sub.endDate), icon: CalendarDays },
                    { label: "Expires", value: new Date(sub.endDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "2-digit" }), icon: ShieldCheck },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label}>
                      <Icon size={14} className="text-white/50 mb-1" />
                      <p className="font-serif text-xl font-bold text-white">{value}</p>
                      <p className="font-sans text-xs text-white/60">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#fbf5ec] border border-[#e8e0d4] rounded-2xl p-6 text-center space-y-2">
                <Crown size={28} className="mx-auto text-[#c9962c]" />
                <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">No Active Subscription</h2>
                <p className="font-sans text-sm text-gray-500 max-w-sm mx-auto">
                  Choose a plan below to unlock your matches and begin your intentional matchmaking journey.
                </p>
              </div>
            )}

            {/* Upgrade Section */}
            {packages.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-bold text-[#1a1a1a] mb-5">
                  {sub ? "Upgrade Your Plan" : "Choose a Plan"}
                </h2>
                <div className="grid sm:grid-cols-3 gap-5">
                  {packages.map((pkg) => {
                    const isCurrent = sub?.packageId === pkg.id;
                    const isPopular = pkg.isPopular;

                    return (
                      <div
                        key={pkg.id}
                        className={`relative rounded-2xl border-2 p-6 flex flex-col ${
                          isPopular
                            ? "border-[#c9962c] bg-white shadow-xl"
                            : isCurrent
                            ? "border-green-300 bg-green-50/50"
                            : "border-[#e8e0d4] bg-white"
                        }`}
                      >
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c9962c] text-white font-sans text-[11px] font-bold px-4 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
                            <Star size={11} /> Most Popular
                          </div>
                        )}
                        {isCurrent && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white font-sans text-[11px] font-bold px-4 py-1 rounded-full whitespace-nowrap">
                            ✓ Current Plan
                          </div>
                        )}

                        <div className="mb-5">
                          {isPopular && <Crown size={22} className="text-[#c9962c] mb-2" />}
                          <h3 className="font-serif text-base font-bold text-[#1a1a1a] leading-snug mb-1">{pkg.name}</h3>
                          <p className="font-sans text-xs text-gray-500 leading-relaxed">{pkg.description}</p>
                        </div>

                        <div className="mb-5">
                          <p className="font-serif text-3xl font-bold text-[#7b1d2a]">{formatNGN(pkg.price)}</p>
                          <p className="font-sans text-xs text-gray-400 mt-0.5">
                            per {pkg.durationDays} days · up to {pkg.matchAllowance} matches
                          </p>
                        </div>

                        <ul className="space-y-2.5 flex-1 mb-6">
                          {pkg.features.map((feat) => (
                            <li key={feat} className="flex items-start gap-2">
                              <CheckCircle2 size={15} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                              <span className="font-sans text-xs text-gray-600 leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {isCurrent ? (
                          <div className="text-center font-sans text-xs font-semibold text-green-600 bg-green-100 py-2.5 rounded-lg">
                            Current Active Plan
                          </div>
                        ) : (
                          <Link
                            href={`/dashboard/subscription/checkout?pkg=${pkg.id}`}
                            className={`w-full flex items-center justify-center gap-2 font-sans text-sm font-bold py-2.5 rounded-xl transition-colors ${
                              isPopular
                                ? "bg-[#c9962c] text-white hover:bg-[#b8882a]"
                                : "bg-[#7b1d2a] text-white hover:bg-[#5c1520]"
                            }`}
                          >
                            {isPopular ? "Upgrade to EPMS" : "Select Plan"} <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
