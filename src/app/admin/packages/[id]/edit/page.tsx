"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react";

interface PackageData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number;
  matchAllowance: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  type?: "ONLINE" | "PHYSICAL";
}

export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [formData, setFormData] = useState<PackageData>({
    id: "",
    name: "",
    slug: "",
    description: "",
    price: 0,
    currency: "NGN",
    durationDays: 30,
    matchAllowance: 5,
    features: [],
    isPopular: false,
    isActive: true,
    type: "ONLINE",
  });

  useEffect(() => {
    async function loadPackage() {
      try {
        const res = await fetch(`/api/admin/packages/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setFormData(json.package);
          }
        }
      } catch (err) {
        console.error("Failed to load package:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          alert("Package updated successfully in PostgreSQL!");
          window.location.assign("/admin/packages");
        }
      } else {
        alert("Failed to update package.");
      }
    } catch (err) {
      console.error("Error saving package:", err);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
    setNewFeature("");
  };

  const removeFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-sans text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]";

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/packages"
              className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Edit Matchmaking Package</h1>
              <p className="font-sans text-xs text-gray-500">Update pricing, included features, duration, type, and visibility.</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center gap-2 text-gray-500 font-sans text-sm bg-white rounded-2xl border border-gray-200">
            <Loader2 size={18} className="animate-spin text-[#7b1d2a]" />
            Loading package details from database...
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Package Type</label>
                <select
                  value={formData.type || "ONLINE"}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as "ONLINE" | "PHYSICAL" }))}
                  className={inputClass}
                >
                  <option value="ONLINE">Online Matchmaking</option>
                  <option value="PHYSICAL">Physical Matchmaking</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Package Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Price (NGN)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData((p) => ({ ...p, price: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Package Description</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className={inputClass}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Duration (Days)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.durationDays}
                  onChange={(e) => setFormData((p) => ({ ...p, durationDays: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Match Allowance</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.matchAllowance}
                  onChange={(e) => setFormData((p) => ({ ...p, matchAllowance: Number(e.target.value) }))}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Features List */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Included Features</label>
              <div className="space-y-2 mb-3">
                {formData.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-sans text-gray-800">
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add feature item..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-[#7b1d2a] text-white rounded-xl text-xs font-bold hover:bg-[#5c1520] flex items-center gap-1 whitespace-nowrap"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* Toggles */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-6 text-xs font-sans font-semibold text-gray-800">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 text-[#7b1d2a] rounded border-gray-300 focus:ring-[#7b1d2a]"
                />
                <span>Active Package</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData((p) => ({ ...p, isPopular: e.target.checked }))}
                  className="w-4 h-4 text-[#c9962c] rounded border-gray-300 focus:ring-[#c9962c]"
                />
                <span>Featured / Most Popular</span>
              </label>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <Link
                href="/admin/packages"
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-sans text-xs font-semibold rounded-xl hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#7b1d2a] text-white font-sans text-xs font-bold rounded-xl hover:bg-[#5c1520] transition-colors flex items-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
