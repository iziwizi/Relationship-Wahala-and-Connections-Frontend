"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Save, Building2, CreditCard, ShieldCheck, Loader2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [loadingBank, setLoadingBank] = useState(true);
  const [savingBank, setSavingBank] = useState(false);

  const [settings, setSettings] = useState({
    platformName: "Relationship Wahala & Connections",
    contactEmail: "hello@relationshipwahala.com",
    contactPhone1: "+234 801 234 5678",
    contactPhone2: "+234 909 876 5432",
    address: "Lagos, Nigeria",
    requireVerificationBeforeMatching: true,
    currency: "NGN",
  });

  const [bankSettings, setBankSettings] = useState({
    bankName: "First Bank of Nigeria",
    accountName: "Relationship Wahala & Connections Ltd",
    accountNumber: "3012345678",
    instructions: "Please include your full name in transfer narration.",
    paystackConfigured: false,
    flutterwaveConfigured: false,
  });

  useEffect(() => {
    async function loadBankSettings() {
      try {
        const res = await fetch("/api/admin/settings/bank");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setBankSettings(data);
          }
        }
      } catch (err) {
        console.error("Failed to load bank settings:", err);
      } finally {
        setLoadingBank(false);
      }
    }
    loadBankSettings();
  }, []);

  const handleSaveGeneral = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBank(true);
    try {
      const res = await fetch("/api/admin/settings/bank", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankSettings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        alert("Failed to save bank settings.");
      }
    } catch (err) {
      console.error("Failed to save bank settings:", err);
    } finally {
      setSavingBank(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3.5 py-2 font-sans text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a] bg-white";
  const labelClass = "block font-sans text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1";

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Platform &amp; Payment Settings</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Global system configuration, bank transfer details, payment gateways, and policies.
          </p>
        </div>

        {/* Bank & Payment Gateways Settings Section */}
        <div className="bg-white rounded-2xl border border border-[#c9962c]/30 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-[#7b1d2a]">
              <Building2 size={20} />
              <h2 className="font-serif font-bold text-base text-[#1a1a1a]">Payment Settings &amp; Bank Transfer Config</h2>
            </div>
            <span className="text-[10px] font-sans font-bold text-[#c9962c] bg-[#fbf5ec] px-2.5 py-1 rounded-full uppercase tracking-wider">
              PostgreSQL Persisted
            </span>
          </div>

          {/* Gateway Status Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#7b1d2a]" />
                <div>
                  <p className="font-sans text-xs font-bold text-[#1a1a1a]">Paystack Gateway</p>
                  <p className="font-sans text-[10px] text-gray-500">Live API Key Status</p>
                </div>
              </div>
              <span
                className={`font-sans text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  bankSettings.paystackConfigured
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {bankSettings.paystackConfigured ? "Configured ✓" : "Not Configured"}
              </span>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#7b1d2a]" />
                <div>
                  <p className="font-sans text-xs font-bold text-[#1a1a1a]">Flutterwave Gateway</p>
                  <p className="font-sans text-[10px] text-gray-500">Live API Key Status</p>
                </div>
              </div>
              <span
                className={`font-sans text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  bankSettings.flutterwaveConfigured
                    ? "bg-green-100 text-green-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {bankSettings.flutterwaveConfigured ? "Configured ✓" : "Not Configured"}
              </span>
            </div>
          </div>

          {loadingBank ? (
            <div className="py-6 text-center text-xs font-sans text-gray-400 flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-[#7b1d2a]" /> Loading bank settings...
            </div>
          ) : (
            <form onSubmit={handleSaveBank} className="space-y-4">
              <h3 className="font-serif text-xs font-bold uppercase text-gray-500 tracking-wider">Bank Transfer Deposit Info</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Bank Name</label>
                  <input
                    type="text"
                    required
                    value={bankSettings.bankName}
                    onChange={(e) => setBankSettings({ ...bankSettings, bankName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Account Number</label>
                  <input
                    type="text"
                    required
                    value={bankSettings.accountNumber}
                    onChange={(e) => setBankSettings({ ...bankSettings, accountNumber: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Account Name</label>
                <input
                  type="text"
                  required
                  value={bankSettings.accountName}
                  onChange={(e) => setBankSettings({ ...bankSettings, accountName: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Optional Payment Instructions / Narration Advice</label>
                <textarea
                  rows={2}
                  value={bankSettings.instructions}
                  onChange={(e) => setBankSettings({ ...bankSettings, instructions: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingBank}
                  className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#5c1520] transition-colors"
                >
                  {savingBank ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>Save Bank Transfer Settings</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* General Settings Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-base text-[#1a1a1a] border-b pb-2">General Platform Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Platform Name</label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Default Currency</label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-serif font-bold text-base text-[#1a1a1a] border-b pb-2">Public Contact Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Contact Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Office Address</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-gray-100">
            {saved && <p className="font-sans text-xs text-green-600 font-bold">✓ Platform settings updated successfully!</p>}
            <button
              onClick={handleSaveGeneral}
              className="ml-auto inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#5c1520] transition-colors"
            >
              <Save size={15} /> Save Platform Settings
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
