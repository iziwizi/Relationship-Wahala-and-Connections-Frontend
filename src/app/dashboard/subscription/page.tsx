"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { demoPackages } from "@/data/demo/packages";
import { CheckCircle2, Crown, ArrowRight, Star } from "lucide-react";

const ACTIVE_PACKAGE_ID = "pkg-basic";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default function SubscriptionPage() {
  const activePkg = demoPackages.find((p) => p.id === ACTIVE_PACKAGE_ID)!;

  // Demo subscription status
  const membershipInfo = {
    profilesRemaining: 8,
    daysRemaining: 22,
    expiryDate: "2026-08-17",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Subscription</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Manage your matchmaking plan and explore upgrade options.
          </p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-gradient-to-br from-[#7b1d2a] to-[#5c1520] rounded-2xl p-6 lg:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="font-sans text-xs font-semibold text-green-300">Active</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-white">{activePkg.name}</h2>
              <p className="font-sans text-white/75 text-sm mt-1">{activePkg.description}</p>
            </div>
            <div className="bg-white/10 rounded-xl px-5 py-3 text-right flex-shrink-0">
              <p className="font-sans text-xs text-white/70 uppercase tracking-wider">Plan Value</p>
              <p className="font-serif text-2xl font-bold text-[#c9962c]">{formatNGN(activePkg.price)}</p>
              <p className="font-sans text-xs text-white/60">per {activePkg.durationDays} days</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/15">
            {[
              { label: "Profiles Remaining", value: membershipInfo.profilesRemaining },
              { label: "Days Remaining", value: membershipInfo.daysRemaining },
              { label: "Expiry Date", value: membershipInfo.expiryDate },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-serif text-xl font-bold text-white">{value}</p>
                <p className="font-sans text-xs text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Section */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[#1a1a1a] mb-5">
            Upgrade Your Plan
          </h2>

          <div className="grid sm:grid-cols-3 gap-5">
            {demoPackages.map((pkg) => {
              const isCurrent = pkg.id === ACTIVE_PACKAGE_ID;
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
                  {/* Badges */}
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

                  {/* Plan Header */}
                  <div className="mb-5">
                    {isPopular && (
                      <Crown size={22} className="text-[#c9962c] mb-2" />
                    )}
                    <h3 className="font-serif text-base font-bold text-[#1a1a1a] leading-snug mb-1">
                      {pkg.name}
                    </h3>
                    <p className="font-sans text-xs text-gray-500 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <p className="font-serif text-3xl font-bold text-[#7b1d2a]">
                      {formatNGN(pkg.price)}
                    </p>
                    <p className="font-sans text-xs text-gray-400 mt-0.5">
                      per {pkg.durationDays} days · up to {pkg.matchAllowance} matches
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                        <span className="font-sans text-xs text-gray-600 leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isCurrent ? (
                    <div className="text-center font-sans text-xs font-semibold text-green-600 bg-green-100 py-2.5 rounded-lg">
                      Current Active Plan
                    </div>
                  ) : (
                    <button className={`w-full flex items-center justify-center gap-2 font-sans text-sm font-bold py-2.5 rounded-xl transition-colors ${
                      isPopular
                        ? "bg-[#c9962c] text-white hover:bg-[#b8882a]"
                        : "bg-[#7b1d2a] text-white hover:bg-[#5c1520]"
                    }`}>
                      {isPopular ? "Upgrade to EPMS" : "Select Plan"} <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
