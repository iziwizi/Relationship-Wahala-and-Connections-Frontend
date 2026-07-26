"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Save, User, Lock, Bell, Shield, Eye } from "lucide-react";

const sections = [
  { id: "account", label: "Account Information", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "email-prefs", label: "Email Preferences", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "visibility", label: "Profile Visibility", icon: Eye },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("account");
  const [saved, setSaved] = useState(false);
  const [emailPrefs, setEmailPrefs] = useState({
    matchAlerts: true,
    weeklyDigest: true,
    tips: true,
    promotions: false,
  });
  const [visibility, setVisibility] = useState("Matched Users Only");

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 font-sans text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a] focus:border-transparent bg-white";
  const labelClass = "block font-sans text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Settings</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Manage your account and privacy preferences.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Section Sidebar */}
          <div className="hidden sm:flex flex-col gap-1 w-52 flex-shrink-0">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActiveSection(id); setSaved(false); }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-sans text-sm text-left transition-colors ${
                  activeSection === id
                    ? "bg-[#7b1d2a] text-white font-semibold"
                    : "text-gray-600 hover:bg-[#7b1d2a]/5 hover:text-[#7b1d2a]"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm p-6 space-y-5">
              {/* Account Information */}
              {activeSection === "account" && (
                <>
                  <h2 className="font-serif text-base font-bold text-[#1a1a1a]">Account Information</h2>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>First Name</label>
                        <input type="text" defaultValue={user?.firstName} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <input type="text" defaultValue={user?.lastName} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input type="email" defaultValue={user?.email} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input type="tel" placeholder="+234 800 000 0000" className={inputClass} />
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              {activeSection === "password" && (
                <>
                  <h2 className="font-serif text-base font-bold text-[#1a1a1a]">Change Password</h2>
                  <p className="font-sans text-xs text-gray-500">
                    Production: Password changes require backend verification and a secure email confirmation link.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Current Password</label>
                      <input type="password" placeholder="••••••••" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>New Password</label>
                      <input type="password" placeholder="••••••••" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className={inputClass} />
                    </div>
                  </div>
                </>
              )}

              {/* Email Preferences */}
              {activeSection === "email-prefs" && (
                <>
                  <h2 className="font-serif text-base font-bold text-[#1a1a1a]">Email Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { key: "matchAlerts", label: "New Match Alerts", desc: "Get notified when a new compatible match is found." },
                      { key: "weeklyDigest", label: "Weekly Digest", desc: "A weekly summary of your activity and top matches." },
                      { key: "tips", label: "Relationship Tips", desc: "Expert advice on building intentional relationships." },
                      { key: "promotions", label: "Promotions & Offers", desc: "Upgrade discounts and promotional content." },
                    ].map(({ key, label, desc }) => (
                      <div key={key} className="flex items-center justify-between py-3 border-b border-[#f0e8dc] last:border-0">
                        <div>
                          <p className="font-sans text-sm font-semibold text-[#1a1a1a]">{label}</p>
                          <p className="font-sans text-xs text-gray-500">{desc}</p>
                        </div>
                        <button
                          onClick={() => setEmailPrefs((p) => ({ ...p, [key]: !p[key as keyof typeof emailPrefs] }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            emailPrefs[key as keyof typeof emailPrefs] ? "bg-[#7b1d2a]" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              emailPrefs[key as keyof typeof emailPrefs] ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Privacy */}
              {activeSection === "privacy" && (
                <>
                  <h2 className="font-serif text-base font-bold text-[#1a1a1a]">Privacy Settings</h2>
                  <p className="font-sans text-xs text-gray-500 mb-3">
                    Relationship Wahala &amp; Connections is committed to your complete confidentiality. Your profile information is shared only with verified, active members.
                  </p>
                  <div className="space-y-3 text-sm font-sans text-gray-700">
                    {[
                      "My profile is only visible to verified, matched members.",
                      "My contact details are never shared directly with other members.",
                      "I can request full data deletion at any time.",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 p-3 bg-[#fbf5ec] rounded-lg">
                        <span className="text-[#c9962c] font-bold">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Profile Visibility */}
              {activeSection === "visibility" && (
                <>
                  <h2 className="font-serif text-base font-bold text-[#1a1a1a]">Profile Visibility</h2>
                  <div className="space-y-2">
                    {["Matched Users Only", "All Verified Members", "Hidden (Pause Matching)"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setVisibility(opt)}
                        className={`w-full text-left flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                          visibility === opt
                            ? "border-[#7b1d2a] bg-[#7b1d2a]/5"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${visibility === opt ? "border-[#7b1d2a] bg-[#7b1d2a]" : "border-gray-300"}`} />
                        <span className={`font-sans text-sm ${visibility === opt ? "text-[#7b1d2a] font-semibold" : "text-gray-700"}`}>{opt}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Save Button */}
              <div className="pt-4 flex items-center justify-between border-t border-[#f0e8dc]">
                {saved && <p className="font-sans text-sm text-green-600 font-semibold">✓ Settings saved!</p>}
                <div className="ml-auto flex gap-3">
                  {activeSection === "account" && (
                    <button
                      onClick={logout}
                      className="font-sans text-sm text-red-600 hover:text-red-700 font-semibold px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#5c1520] transition-colors"
                  >
                    <Save size={15} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
