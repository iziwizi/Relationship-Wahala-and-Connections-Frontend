"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect, useCallback } from "react";
import { MatchmakingPackage } from "@/data/demo/packages";
import {
  Plus, CheckCircle2, Star, Edit3, Loader2, Trash2,
  Filter, Laptop, Users, X, AlertCircle, Info,
} from "lucide-react";
import Link from "next/link";

function formatNGN(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(amount);
}

type ToastType = "success" | "error" | "info";
interface Toast { id: number; type: ToastType; message: string }

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<MatchmakingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"ALL" | "ONLINE" | "PHYSICAL">("ALL");
  const [actionId, setActionId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const [newPkg, setNewPkg] = useState<Partial<MatchmakingPackage>>({
    name: "",
    description: "",
    price: 30000,
    currency: "NGN",
    durationDays: 30,
    matchAllowance: 5,
    features: ["Profile Verification", "Handpicked Matches"],
    isPopular: false,
    isActive: true,
    type: "ONLINE",
  });

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 6000);
  }, []);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/packages");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setPackages(json.packages);
        else addToast("error", json.error || "Failed to load packages.");
      } else {
        addToast("error", "Failed to load packages from server.");
      }
    } catch {
      addToast("error", "Network error. Could not load packages.");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchPackages(); }, [fetchPackages]);

  const toggleActive = async (id: string, currentActive: boolean) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPackages((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !currentActive } : p));
        addToast("success", `Package ${!currentActive ? "activated" : "deactivated"} successfully.`);
      } else {
        addToast("error", json.error || "Failed to update package status.");
      }
    } catch {
      addToast("error", "Network error updating package status.");
    } finally {
      setActionId(null);
    }
  };

  const togglePopular = async (id: string, currentPopular: boolean) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPopular: !currentPopular }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setPackages((prev) => prev.map((p) => p.id === id ? { ...p, isPopular: !currentPopular } : p));
        addToast("success", `Package ${!currentPopular ? "marked as featured" : "unfeatured"}.`);
      } else {
        addToast("error", json.error || "Failed to update featured status.");
      }
    } catch {
      addToast("error", "Network error updating featured status.");
    } finally {
      setActionId(null);
    }
  };

  const handleDeletePackage = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?\n\nIf this package has linked subscriptions or payments, it will be deactivated instead of permanently deleted.`)) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (res.ok && json.success) {
        if (json.deleted) {
          // Hard deleted
          setPackages((prev) => prev.filter((p) => p.id !== id));
          addToast("success", `"${name}" permanently deleted.`);
        } else if (json.softDeleted) {
          // Soft deleted — deactivated due to FK constraint
          setPackages((prev) => prev.map((p) => p.id === id ? { ...p, isActive: false } : p));
          addToast("info", json.message || `"${name}" has linked records and was deactivated instead of deleted.`);
        }
      } else {
        addToast("error", json.error || "Failed to delete package.");
      }
    } catch {
      addToast("error", "Network error deleting package.");
    } finally {
      setActionId(null);
    }
  };

  const handleAddPackage = async () => {
    if (!newPkg.name?.trim() || !newPkg.description?.trim()) {
      addToast("error", "Package name and description are required.");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPkg),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        await fetchPackages();
        setShowNewModal(false);
        setNewPkg({
          name: "", description: "", price: 30000, currency: "NGN",
          durationDays: 30, matchAllowance: 5,
          features: ["Profile Verification", "Handpicked Matches"],
          isPopular: false, isActive: true, type: "ONLINE",
        });
        addToast("success", `Package "${json.package?.name || newPkg.name}" created successfully!`);
      } else {
        addToast("error", json.error || "Failed to create package.");
      }
    } catch {
      addToast("error", "Network error creating package.");
    } finally {
      setCreating(false);
    }
  };

  const filteredPackages = packages.filter((p) =>
    typeFilter === "ALL" ? true : p.type === typeFilter
  );

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-sans text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]";

  return (
    <AdminLayout>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-sans font-medium animate-fade-in ${
              t.type === "success" ? "bg-green-50 border-green-200 text-green-800"
              : t.type === "error" ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            {t.type === "success" ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
              : t.type === "error" ? <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              : <Info size={16} className="flex-shrink-0 mt-0.5" />}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Package &amp; Subscription Management</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">
              Create, edit, price, and manage Online &amp; Physical matchmaking packages stored in PostgreSQL.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchPackages}
              disabled={loading}
              className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 font-sans text-xs font-bold px-3 py-2.5 rounded-xl hover:bg-gray-200 transition-colors"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null} Refresh
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#5c1520] transition-colors"
            >
              <Plus size={16} /> Create New Package
            </button>
          </div>
        </div>

        {/* Type Filter */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-400 ml-2" />
          <span className="font-sans text-xs font-bold text-gray-500 uppercase mr-2">Filter:</span>
          {(["ALL", "ONLINE", "PHYSICAL"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded-xl font-sans text-xs font-bold transition-all ${
                typeFilter === t ? "bg-[#7b1d2a] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "ALL" ? "All Packages" : t === "ONLINE" ? "Online Packages" : "Physical Packages"}
            </button>
          ))}
          <span className="ml-auto font-sans text-xs text-gray-400">{filteredPackages.length} package{filteredPackages.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center gap-2 text-gray-500 font-sans text-xs bg-white rounded-2xl border border-gray-200">
            <Loader2 size={18} className="animate-spin text-[#7b1d2a]" />
            Loading packages from PostgreSQL...
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-12 text-center text-gray-500 font-sans text-sm bg-white rounded-2xl border border-gray-200">
            {packages.length === 0 ? "No packages found. Create your first package above." : "No packages match the current filter."}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between shadow-sm relative transition-all ${
                  !pkg.isActive ? "opacity-55 border-dashed border-gray-300" : "border-gray-200"
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute -top-3 left-4 bg-[#c9962c] text-white text-[10px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
                    <Star size={10} /> Featured
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1 ${
                        pkg.type === "PHYSICAL" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {pkg.type === "PHYSICAL" ? <Users size={10} /> : <Laptop size={10} />}
                        {pkg.type || "ONLINE"}
                      </span>
                      <h3 className="font-serif font-bold text-base text-[#1a1a1a]">{pkg.name}</h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${pkg.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="font-serif text-2xl font-bold text-[#7b1d2a] mb-2">{formatNGN(pkg.price)}</p>
                  <p className="font-sans text-xs text-gray-500 mb-4 line-clamp-2">{pkg.description}</p>

                  <div className="bg-gray-50 p-3 rounded-lg text-xs font-sans space-y-1 mb-4">
                    <p><span className="font-semibold text-gray-700">Duration:</span> {pkg.durationDays} Days</p>
                    <p><span className="font-semibold text-gray-700">Matches:</span> {pkg.matchAllowance === 9999 ? "Unlimited" : `Up to ${pkg.matchAllowance}`}</p>
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

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                  <Link
                    href={`/admin/packages/${pkg.id}/edit`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold font-sans px-3 py-1.5 bg-[#7b1d2a] text-white rounded-lg hover:bg-[#5c1520]"
                  >
                    <Edit3 size={12} /> Edit
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => togglePopular(pkg.id, Boolean(pkg.isPopular))}
                      disabled={actionId === pkg.id}
                      title={pkg.isPopular ? "Remove Featured" : "Mark as Featured"}
                      className={`text-[11px] font-bold font-sans px-2 py-1 rounded border transition-colors ${
                        pkg.isPopular ? "border-[#c9962c] text-[#c9962c] bg-amber-50" : "border-gray-200 text-gray-500 hover:border-gray-300"
                      } disabled:opacity-50`}
                    >
                      {pkg.isPopular ? "★ Featured" : "Feature"}
                    </button>

                    <button
                      onClick={() => toggleActive(pkg.id, Boolean(pkg.isActive))}
                      disabled={actionId === pkg.id}
                      className={`text-[11px] font-bold font-sans px-2.5 py-1 rounded text-white transition-colors disabled:opacity-50 ${
                        pkg.isActive ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {actionId === pkg.id ? <Loader2 size={11} className="animate-spin inline" /> : null}
                      {pkg.isActive ? " Hide" : " Show"}
                    </button>

                    <button
                      onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                      disabled={actionId === pkg.id}
                      title="Delete Package"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    >
                      {actionId === pkg.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create New Package Modal */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl flex flex-col max-h-[85vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-[#1a1a1a]">Create New Package</h2>
                <button onClick={() => setShowNewModal(false)} className="p-1 text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Package Type *</label>
                  <select
                    value={newPkg.type || "ONLINE"}
                    onChange={(e) => setNewPkg((p) => ({ ...p, type: e.target.value as "ONLINE" | "PHYSICAL" }))}
                    className={inputClass}
                  >
                    <option value="ONLINE">Online Matchmaking</option>
                    <option value="PHYSICAL">Physical Matchmaking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Package Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Online Package"
                    value={newPkg.name}
                    onChange={(e) => setNewPkg((p) => ({ ...p, name: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description *</label>
                  <textarea
                    rows={2}
                    placeholder="Short description of what this package includes..."
                    value={newPkg.description}
                    onChange={(e) => setNewPkg((p) => ({ ...p, description: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (NGN) *</label>
                    <input
                      type="number"
                      min={0}
                      value={newPkg.price}
                      onChange={(e) => setNewPkg((p) => ({ ...p, price: Number(e.target.value) }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min={1}
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
                    min={0}
                    value={newPkg.matchAllowance}
                    onChange={(e) => setNewPkg((p) => ({ ...p, matchAllowance: Number(e.target.value) }))}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Included Features</label>
                    <button
                      type="button"
                      onClick={() => setNewPkg((p) => ({ ...p, features: [...(p.features || []), ""] }))}
                      className="text-[11px] font-bold text-[#7b1d2a] hover:underline"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {(newPkg.features || []).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Feature description..."
                          value={feat}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewPkg((p) => {
                              const updated = [...(p.features || [])];
                              updated[idx] = val;
                              return { ...p, features: updated };
                            });
                          }}
                          className={inputClass}
                        />
                        <button
                          type="button"
                          onClick={() => setNewPkg((p) => ({ ...p, features: (p.features || []).filter((_, i) => i !== idx) }))}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={Boolean(newPkg.isPopular)}
                    onChange={(e) => setNewPkg((p) => ({ ...p, isPopular: e.target.checked }))}
                    className="w-4 h-4 text-[#c9962c] rounded"
                  />
                  Mark as Featured / Most Popular
                </label>
              </div>

              <div className="flex gap-3 justify-end p-4 border-t border-gray-100">
                <button
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPackage}
                  disabled={creating}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#7b1d2a] rounded-lg hover:bg-[#5c1520] flex items-center gap-1.5 disabled:opacity-70"
                >
                  {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
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
