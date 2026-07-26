"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState } from "react";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "Relationship Wahala & Connections",
    contactEmail: "hello@relationshipwahala.com",
    contactPhone1: "+234 801 234 5678",
    contactPhone2: "+234 909 876 5432",
    address: "Lagos, Nigeria",
    requireVerificationBeforeMatching: true,
    currency: "NGN",
    facebookUrl: "https://facebook.com",
    instagramUrl: "https://instagram.com",
    youtubeUrl: "https://youtube.com",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-3.5 py-2 font-sans text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a] bg-white";
  const labelClass = "block font-sans text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1";

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Platform Settings</h1>
          <p className="font-sans text-xs text-gray-500 mt-1">
            Global system configuration, contact info, social links, and verification policies.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          {/* General Platform Info */}
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

          {/* Contact Details */}
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone Line 1</label>
                <input
                  type="text"
                  value={settings.contactPhone1}
                  onChange={(e) => setSettings({ ...settings, contactPhone1: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone Line 2</label>
                <input
                  type="text"
                  value={settings.contactPhone2}
                  onChange={(e) => setSettings({ ...settings, contactPhone2: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Verification Policies */}
          <div className="space-y-3">
            <h2 className="font-serif font-bold text-base text-[#1a1a1a] border-b pb-2">Matchmaking Policies</h2>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-sans text-xs font-bold text-[#1a1a1a]">Require Verification Before Matching</p>
                <p className="font-sans text-[11px] text-gray-500">Require Super Admin approval before member profile appears in candidate matches.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireVerificationBeforeMatching}
                onChange={(e) => setSettings({ ...settings, requireVerificationBeforeMatching: e.target.checked })}
                className="h-4 w-4 text-[#7b1d2a]"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex items-center justify-between border-t border-gray-100">
            {saved && <p className="font-sans text-xs text-green-600 font-bold">✓ Platform settings updated successfully!</p>}
            <button
              onClick={handleSave}
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
