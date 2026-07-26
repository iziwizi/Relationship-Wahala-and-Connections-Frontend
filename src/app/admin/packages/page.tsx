"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";
import { demoPackages, MatchmakingPackage } from "@/data/demo/packages";
import { Plus, CheckCircle2, Star } from "lucide-react";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<MatchmakingPackage[]>(demoPackages);
  const [showNewModal, setShowNewModal] = useState(false);

  // New package form state
  const [newPkg, setNewPkg] = useState<Partial<MatchmakingPackage>>({
    name: "",
    description: "",
    price: 50000,
    currency: "NGN",
    durationDays: 30,
    matchAllowance: 5,
    features: ["Profile Verification", "Handpicked Matches"],
    isPopular: false,
    isActive: true,
  });

  const toggleActive = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const togglePopular = (id: string) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPopular: !p.isPopular } : p))
    );
  };

  const handleAddPackage = () => {
    if (!newPkg.name) return;
    const created: MatchmakingPackage = {
      id: "pkg-" + Date.now(),
      name: newPkg.name,
      slug: newPkg.name.toLowerCase().replace(/\s+/g, "-"),
      description: newPkg.description || "",
      price: Number(newPkg.price) || 0,
      currency: "NGN",
      durationDays: Number(newPkg.durationDays) || 30,
      matchAllowance: Number(newPkg.matchAllowance) || 5,
      features: newPkg.features || [],
      isPopular: !!newPkg.isPopular,
      isActive: true,
    };
    setPackages((prev) => [...prev, created]);
    setShowNewModal(false);
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-sans text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Package &amp; Subscription Management</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">
              Create, edit, price, and manage matchmaking subscription packages dynamically.
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#5c1520] transition-colors"
          >
            <Plus size={16} /> Create New Package
          </button>
        </div>

        {/* Package Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-sm relative ${
                !pkg.isActive ? "opacity-60 border-dashed border-gray-300" : "border-gray-200"
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 left-4 bg-[#c9962c] text-white text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
                  <Star size={10} /> Featured Package
                </span>
              )}

              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-serif font-bold text-base text-[#1a1a1a]">{pkg.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pkg.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="font-serif text-2xl font-bold text-[#7b1d2a] mb-2">
                  {formatNGN(pkg.price)}
                </p>
                <p className="font-sans text-xs text-gray-500 mb-4">{pkg.description}</p>

                <div className="bg-gray-50 p-3 rounded-lg text-xs font-sans space-y-1 mb-4">
                  <p><span className="font-semibold text-gray-700">Duration:</span> {pkg.durationDays} Days</p>
                  <p><span className="font-semibold text-gray-700">Match Allowance:</span> {pkg.matchAllowance} Matches</p>
                </div>

                <ul className="space-y-1.5 mb-6">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs font-sans text-gray-600">
                      <CheckCircle2 size={13} className="text-[#c9962c] flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => togglePopular(pkg.id)}
                  className={`text-[11px] font-bold font-sans px-2.5 py-1 rounded border ${
                    pkg.isPopular ? "border-[#c9962c] text-[#c9962c]" : "border-gray-200 text-gray-500"
                  }`}
                >
                  {pkg.isPopular ? "★ Featured" : "Make Featured"}
                </button>

                <button
                  onClick={() => toggleActive(pkg.id)}
                  className={`text-[11px] font-bold font-sans px-3 py-1 rounded text-white ${
                    pkg.isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {pkg.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Modal */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">Create New Package</h2>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Package Name</label>
                <input
                  type="text"
                  placeholder="e.g. EPMS Premium Gold"
                  value={newPkg.name}
                  onChange={(e) => setNewPkg((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Package summary..."
                  value={newPkg.description}
                  onChange={(e) => setNewPkg((p) => ({ ...p, description: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (NGN)</label>
                  <input
                    type="number"
                    value={newPkg.price}
                    onChange={(e) => setNewPkg((p) => ({ ...p, price: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={newPkg.durationDays}
                    onChange={(e) => setNewPkg((p) => ({ ...p, durationDays: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Match Allowance</label>
                <input
                  type="number"
                  value={newPkg.matchAllowance}
                  onChange={(e) => setNewPkg((p) => ({ ...p, matchAllowance: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPackage}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#7b1d2a] rounded-lg hover:bg-[#5c1520]"
                >
                  Save Package
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
