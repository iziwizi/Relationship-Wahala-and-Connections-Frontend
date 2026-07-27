"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { MatchmakingPackage } from "@/data/demo/packages";
import { Plus, CheckCircle2, Star, Edit3, Loader2 } from "lucide-react";
import Link from "next/link";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<MatchmakingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [creating, setCreating] = useState(false);

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

  useEffect(() => {
    fetchPackages();
  }, []);

  async function fetchPackages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/packages");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setPackages(json.packages);
        }
      }
    } catch (err) {
      console.error("Failed to load packages:", err);
    } finally {
      setLoading(false);
    }
  }

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        setPackages((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isActive: !currentActive } : p))
        );
      }
    } catch (err) {
      console.error("Error toggling package status:", err);
    }
  };

  const togglePopular = async (id: string, currentPopular: boolean) => {
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPopular: !currentPopular }),
      });
      if (res.ok) {
        setPackages((prev) =>
          prev.map((p) => (p.id === id ? { ...p, isPopular: !currentPopular } : p))
        );
      }
    } catch (err) {
      console.error("Error toggling featured status:", err);
    }
  };

  const handleAddPackage = async () => {
    if (!newPkg.name || !newPkg.description) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPkg),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          fetchPackages();
          setShowNewModal(false);
          setNewPkg({
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
        }
      }
    } catch (err) {
      console.error("Error creating package:", err);
    } finally {
      setCreating(false);
    }
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

        {loading ? (
          <div className="p-12 flex items-center justify-center gap-2 text-gray-500 font-sans text-xs bg-white rounded-2xl border border-gray-200">
            <Loader2 size={18} className="animate-spin text-[#7b1d2a]" />
            Loading subscription packages from PostgreSQL...
          </div>
        ) : (
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
                  <Link
                    href={`/admin/packages/${pkg.id}/edit`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold font-sans px-3 py-1 bg-[#7b1d2a] text-white rounded hover:bg-[#5c1520]"
                  >
                    <Edit3 size={12} /> Edit
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePopular(pkg.id, Boolean(pkg.isPopular))}
                      className={`text-[11px] font-bold font-sans px-2.5 py-1 rounded border ${
                        pkg.isPopular ? "border-[#c9962c] text-[#c9962c]" : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {pkg.isPopular ? "★ Featured" : "Featured"}
                    </button>

                    <button
                      onClick={() => toggleActive(pkg.id, Boolean(pkg.isActive))}
                      className={`text-[11px] font-bold font-sans px-3 py-1 rounded text-white ${
                        pkg.isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {pkg.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
                  disabled={creating}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#7b1d2a] rounded-lg hover:bg-[#5c1520] flex items-center gap-1"
                >
                  {creating ? <Loader2 size={14} className="animate-spin" /> : null}
                  <span>Save Package</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
