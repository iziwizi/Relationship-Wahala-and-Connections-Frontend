"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState } from "react";
import { Save } from "lucide-react";

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const countries = ["Nigeria", "United Kingdom", "United States", "Canada", "Ghana", "South Africa", "Other"];

export default function PreferencesPage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    ageMin: "26",
    ageMax: "36",
    location: "Lagos",
    country: "Nigeria",
    relationshipGoal: "Marriage within 1-2 years",
    educationMin: "Bachelor's Degree",
    religion: "Christian",
    lifestyle: "Non-smoker preferred",
    relocation: "Open to relocation",
  });

  const handleChange = (key: string, value: string) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => setSaved(true);

  const fieldClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 font-sans text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#7b1d2a] focus:border-transparent bg-white";
  const labelClass = "block font-sans text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Match Preferences</h1>
          <p className="font-sans text-sm text-gray-500 mt-1">
            Help us find your most compatible matches by defining your ideal partner criteria.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm divide-y divide-[#f0e8dc]">
          {/* Age Range */}
          <div className="p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Preferred Age Range</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Minimum Age</label>
                <input
                  type="number"
                  min={18}
                  max={70}
                  value={prefs.ageMin}
                  onChange={(e) => handleChange("ageMin", e.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Maximum Age</label>
                <input
                  type="number"
                  min={18}
                  max={70}
                  value={prefs.ageMax}
                  onChange={(e) => handleChange("ageMax", e.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Preferred Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>State / Region</label>
                <select value={prefs.location} onChange={(e) => handleChange("location", e.target.value)} className={fieldClass}>
                  <option value="">Any State</option>
                  {nigerianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <select value={prefs.country} onChange={(e) => handleChange("country", e.target.value)} className={fieldClass}>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Relationship Goal */}
          <div className="p-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Relationship Goal</h3>
            <div>
              <label className={labelClass}>What are you looking for?</label>
              <select value={prefs.relationshipGoal} onChange={(e) => handleChange("relationshipGoal", e.target.value)} className={fieldClass}>
                <option>Marriage within 6 months</option>
                <option>Marriage within 1-2 years</option>
                <option>Marriage within 2-3 years</option>
                <option>Intentional long-term relationship leading to marriage</option>
              </select>
            </div>
          </div>

          {/* Education */}
          <div className="p-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Education Preference</h3>
            <div>
              <label className={labelClass}>Minimum Education Level</label>
              <select value={prefs.educationMin} onChange={(e) => handleChange("educationMin", e.target.value)} className={fieldClass}>
                <option>No Minimum</option>
                <option>Secondary School</option>
                <option>Diploma / OND / HND</option>
                <option>Bachelor&apos;s Degree</option>
                <option>Master&apos;s Degree</option>
                <option>Doctorate / PhD</option>
                <option>Professional Certification</option>
              </select>
            </div>
          </div>

          {/* Religion */}
          <div className="p-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Religion Preference</h3>
            <div>
              <label className={labelClass}>Preferred Religion</label>
              <select value={prefs.religion} onChange={(e) => handleChange("religion", e.target.value)} className={fieldClass}>
                <option>No Preference</option>
                <option>Christian</option>
                <option>Muslim</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="p-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Lifestyle Preferences</h3>
            <div>
              <label className={labelClass}>Lifestyle Expectations</label>
              <select value={prefs.lifestyle} onChange={(e) => handleChange("lifestyle", e.target.value)} className={fieldClass}>
                <option>No Preference</option>
                <option>Non-smoker preferred</option>
                <option>Non-drinker preferred</option>
                <option>Non-smoker & Non-drinker preferred</option>
              </select>
            </div>
          </div>

          {/* Relocation */}
          <div className="p-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Relocation Preference</h3>
            <div className="flex flex-wrap gap-3">
              {["Must stay in Nigeria", "Open to relocation", "Diaspora welcome", "Any Location"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleChange("relocation", opt)}
                  className={`px-4 py-2 rounded-lg font-sans text-sm font-semibold border transition-colors ${
                    prefs.relocation === opt
                      ? "bg-[#7b1d2a] text-white border-[#7b1d2a]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#7b1d2a]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <p className="font-sans text-sm text-green-600 font-semibold">✓ Preferences saved!</p>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#5c1520] transition-colors"
          >
            <Save size={16} />
            Save Preferences
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
