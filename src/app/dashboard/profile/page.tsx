"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  CheckCircle2, PencilLine, Save, X, Loader2, AlertCircle,
  User, Briefcase, Heart, BookOpen, MapPin, Phone, Calendar,
  Globe, Shield, Sparkles, Smile
} from "lucide-react";
import MediaUploader from "@/components/ui/MediaUploader";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // Basic Details
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    gender: "Female",
    maritalStatus: "Single (Never Married)",
    nationality: "Nigerian",
    stateOfOrigin: "",
    currentCityState: "",
    currentCountry: "Nigeria",

    // Education & Career
    educationLevel: "Bachelor's Degree",
    profession: "",
    employmentStatus: "Employed Full-time",
    religion: "Christian",

    // Lifestyle
    smoking: "Never",
    drinking: "Socially",
    hasChildren: "No",
    wantsChildren: "Yes",

    // Intentions & Bio
    aboutMe: "",
    relationshipGoal: "Marriage within 1-2 years",
    keyValues: "Faith, Honesty, Respect, Communication",
    interestsHobbies: "Reading, Fitness, Travel, Cooking",

    // Primary Avatar
    avatar: "",
  });

  // Load real profile from database API
  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.user?.profile && isMounted) {
            const p = data.user.profile;
            const primaryPhoto =
              p.photos?.find((ph: { isPrimary: boolean; url: string }) => ph.isPrimary)?.url ||
              p.photos?.[0]?.url ||
              data.user.avatar ||
              "";

            let dobString = "";
            if (p.dateOfBirth) {
              dobString = new Date(p.dateOfBirth).toISOString().split("T")[0];
            }

            setFormData({
              firstName: p.firstName || data.user.firstName || "",
              lastName: p.lastName || data.user.lastName || "",
              phone: p.phone || data.user.phone || "",
              dateOfBirth: dobString,
              gender: p.gender || "Female",
              maritalStatus: p.maritalStatus || "Single (Never Married)",
              nationality: p.nationality || "Nigerian",
              stateOfOrigin: p.stateOfOrigin || "",
              currentCityState: p.currentCityState || "",
              currentCountry: p.currentCountry || "Nigeria",
              educationLevel: p.educationLevel || "Bachelor's Degree",
              profession: p.profession || "",
              employmentStatus: p.employmentStatus || "Employed Full-time",
              religion: p.religion || "Christian",
              smoking: p.smoking || "Never",
              drinking: p.drinking || "Socially",
              hasChildren: p.hasChildren || "No",
              wantsChildren: p.wantsChildren || "Yes",
              aboutMe: p.aboutMe || "",
              relationshipGoal: p.relationshipGoal || "Marriage within 1-2 years",
              keyValues: Array.isArray(p.keyValues)
                ? p.keyValues.join(", ")
                : p.keyValues || "Faith, Honesty, Respect, Communication",
              interestsHobbies: Array.isArray(p.interestsHobbies)
                ? p.interestsHobbies.join(", ")
                : p.interestsHobbies || "Reading, Fitness, Travel, Cooking",
              avatar: primaryPhoto,
            });
            return;
          }
        }
      } catch (err) {
        console.error("Failed to fetch live user profile:", err);
      } finally {
        if (isMounted) setLoading(false);
      }

      // Fallback to auth context
      if (user && isMounted) {
        setFormData((prev) => ({
          ...prev,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: (user as any).phone || "",
          profession: (user as any).profession || user.educationCareer?.occupation || "",
          currentCityState: typeof (user as any).location === "string" ? (user as any).location : user.location?.city ? `${user.location.city}, ${user.location.state}` : "",
          aboutMe: user.aboutMe || "",
          avatar: user.avatar || "",
        }));
      }
    }

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleAvatarChange = async (url: string) => {
    setUploadingPhoto(true);
    setFormData((prev) => ({ ...prev, avatar: url }));
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: url }),
      });
      if (refreshUser) refreshUser();
      setSaveSuccess("Profile photo updated successfully!");
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err) {
      console.error("Failed to update avatar:", err);
      setSaveError("Failed to update profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const payload = {
        ...formData,
        keyValues: formData.keyValues.split(",").map((s) => s.trim()).filter(Boolean),
        interestsHobbies: formData.interestsHobbies.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSaveSuccess("All profile information saved and persisted successfully!");
        setEditing(false);
        if (refreshUser) refreshUser();
        setTimeout(() => setSaveSuccess(null), 4000);
      } else {
        setSaveError(data.error || "Failed to save profile details.");
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      setSaveError("Error saving profile details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;
    const diff = Date.now() - dob.getTime();
    const ageDt = new Date(diff);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
  };

  const age = calculateAge(formData.dateOfBirth);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">My Profile</h1>
            <p className="font-sans text-sm text-gray-500 mt-0.5">
              Your confidential matchmaking profile — verified and managed with professional discretion.
            </p>
          </div>
          <button
            onClick={() => {
              setEditing(!editing);
              setSaveSuccess(null);
              setSaveError(null);
            }}
            className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#5c1520] transition-colors self-start sm:self-auto shadow-sm"
          >
            {editing ? <X size={15} /> : <PencilLine size={15} />}
            <span>{editing ? "Cancel Editing" : "Edit Profile"}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-xs sm:text-sm font-sans animate-fadeIn">
            <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs sm:text-sm font-sans animate-fadeIn">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Profile Hero Card */}
        <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden">
          {/* Cover Banner */}
          <div className="h-28 sm:h-32 bg-gradient-to-r from-[#7b1d2a] via-[#9b2535] to-[#5c1520]" />

          <div className="px-6 pt-0 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14 mb-3">
              {/* Avatar overlapping cover - Always top-aligned to preserve head and face */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-gray-100">
                {formData.avatar ? (
                  <Image
                    src={formData.avatar}
                    alt="Profile photo"
                    fill
                    className="object-cover object-top"
                    unoptimized={formData.avatar.startsWith("data:") || formData.avatar.startsWith("blob:")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-xl">
                    {formData.firstName?.[0] || user?.firstName?.[0] || "U"}
                  </div>
                )}
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 size={20} className="text-white animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Identity Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                  {formData.firstName || user?.firstName || "Member"}{" "}
                  {formData.lastName || user?.lastName || ""}
                  {age ? `, ${age}` : ""}
                </h2>
                <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 text-xs px-2.5 py-0.5 rounded-full font-sans font-semibold">
                  <CheckCircle2 size={13} className="text-green-600" />
                  Verified Member
                </span>
                <span className="bg-[#7b1d2a]/10 text-[#7b1d2a] font-sans text-xs font-semibold px-3 py-0.5 rounded-full sm:ml-auto">
                  Profile {user?.profileCompletion || 100}% Complete
                </span>
              </div>
              <p className="font-sans text-sm text-gray-500">
                {formData.profession || "Intentional Member"} · {formData.currentCityState || "Lagos, Nigeria"}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Photo Widget */}
        <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Profile Photo Upload</h3>
              <p className="font-sans text-xs text-gray-500 mt-0.5">
                Upload a clear portrait to enhance your matchmaking visibility. Head and facial framing is automatically preserved.
              </p>
            </div>
          </div>
          <MediaUploader
            value={formData.avatar}
            onChange={handleAvatarChange}
            bucket="profile-photos"
            label="Upload Main Profile Photo"
          />
        </div>

        {/* View / Edit Mode */}
        {editing ? (
          /* EDIT FORM */
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-6"
          >
            <div className="border-b pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Edit Full Profile</h3>
                <p className="font-sans text-xs text-gray-500">
                  Update your personal, career, and lifestyle information. All changes persist permanently.
                </p>
              </div>
            </div>

            {/* Section 1: Personal & Contact */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-bold text-[#7b1d2a] uppercase tracking-wider flex items-center gap-2">
                <User size={15} /> 1. Personal &amp; Contact Details
              </h4>
              <div className="grid sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData((p) => ({ ...p, gender: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Marital Status</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => setFormData((p) => ({ ...p, maritalStatus: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="Single (Never Married)">Single (Never Married)</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Current City &amp; State</label>
                  <input
                    type="text"
                    value={formData.currentCityState}
                    onChange={(e) => setFormData((p) => ({ ...p, currentCityState: e.target.value }))}
                    placeholder="e.g. Lekki, Lagos"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">State of Origin</label>
                  <input
                    type="text"
                    value={formData.stateOfOrigin}
                    onChange={(e) => setFormData((p) => ({ ...p, stateOfOrigin: e.target.value }))}
                    placeholder="e.g. Delta State, Nigeria"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Education & Career */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-serif text-sm font-bold text-[#7b1d2a] uppercase tracking-wider flex items-center gap-2">
                <Briefcase size={15} /> 2. Education &amp; Career
              </h4>
              <div className="grid sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Highest Education Level</label>
                  <select
                    value={formData.educationLevel}
                    onChange={(e) => setFormData((p) => ({ ...p, educationLevel: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="High School">High School</option>
                    <option value="Diploma / OND / HND">Diploma / OND / HND</option>
                    <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                    <option value="Master's Degree">Master&apos;s Degree</option>
                    <option value="Doctorate / PhD">Doctorate / PhD</option>
                    <option value="Professional Certification">Professional Certification</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Profession / Occupation</label>
                  <input
                    type="text"
                    value={formData.profession}
                    onChange={(e) => setFormData((p) => ({ ...p, profession: e.target.value }))}
                    placeholder="e.g. Software Consultant, Fashion Designer"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Employment Status</label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => setFormData((p) => ({ ...p, employmentStatus: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="Employed Full-time">Employed Full-time</option>
                    <option value="Self-Employed / Business Owner">Self-Employed / Business Owner</option>
                    <option value="Civil Servant">Civil Servant</option>
                    <option value="Professional Practice">Professional Practice</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Religion / Faith</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData((p) => ({ ...p, religion: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="Christian">Christian</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Lifestyle & Family */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-serif text-sm font-bold text-[#7b1d2a] uppercase tracking-wider flex items-center gap-2">
                <Smile size={15} /> 3. Lifestyle &amp; Family
              </h4>
              <div className="grid sm:grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Smoking</label>
                  <select
                    value={formData.smoking}
                    onChange={(e) => setFormData((p) => ({ ...p, smoking: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="Never">Never</option>
                    <option value="Occasionally">Occasionally</option>
                    <option value="Socially">Socially</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Drinking</label>
                  <select
                    value={formData.drinking}
                    onChange={(e) => setFormData((p) => ({ ...p, drinking: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="Never">Never</option>
                    <option value="Socially">Socially</option>
                    <option value="Regularly">Regularly</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Do You Have Children?</label>
                  <select
                    value={formData.hasChildren}
                    onChange={(e) => setFormData((p) => ({ ...p, hasChildren: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="No">No</option>
                    <option value="Yes (1 child)">Yes (1 child)</option>
                    <option value="Yes (2 children)">Yes (2 children)</option>
                    <option value="Yes (3+ children)">Yes (3+ children)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Do You Want Children?</label>
                  <select
                    value={formData.wantsChildren}
                    onChange={(e) => setFormData((p) => ({ ...p, wantsChildren: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value="Yes">Yes</option>
                    <option value="Yes (2-3 children)">Yes (2-3 children)</option>
                    <option value="Maybe / Open to discussion">Maybe / Open to discussion</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Intentions, About & Values */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-serif text-sm font-bold text-[#7b1d2a] uppercase tracking-wider flex items-center gap-2">
                <Heart size={15} /> 4. Intentions, Bio &amp; Core Values
              </h4>
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Relationship Goal</label>
                  <input
                    type="text"
                    value={formData.relationshipGoal}
                    onChange={(e) => setFormData((p) => ({ ...p, relationshipGoal: e.target.value }))}
                    placeholder="e.g. Marriage within 1-2 years"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">About Me</label>
                  <textarea
                    rows={4}
                    value={formData.aboutMe}
                    onChange={(e) => setFormData((p) => ({ ...p, aboutMe: e.target.value }))}
                    placeholder="Share your background, personality, and what makes you unique..."
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">
                      Core Values (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.keyValues}
                      onChange={(e) => setFormData((p) => ({ ...p, keyValues: e.target.value }))}
                      placeholder="e.g. Faith, Integrity, Loyalty, Respect"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">
                      Interests &amp; Hobbies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.interestsHobbies}
                      onChange={(e) => setFormData((p) => ({ ...p, interestsHobbies: e.target.value }))}
                      placeholder="e.g. Reading, Travel, Cooking, Music"
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7b1d2a] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-5 py-2.5 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#7b1d2a] text-white rounded-lg text-sm font-bold hover:bg-[#5c1520] flex items-center gap-2 shadow-sm transition-colors"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>Save Profile Details</span>
              </button>
            </div>
          </form>
        ) : (
          /* VIEW MODE: COMPREHENSIVE CATEGORIZED CARDS */
          <div className="space-y-6">
            {/* About Me Section */}
            <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6">
              <div className="flex items-center justify-between mb-3 border-b pb-3">
                <h3 className="font-serif text-base font-bold text-[#1a1a1a] flex items-center gap-2">
                  <User size={16} className="text-[#7b1d2a]" /> About Me
                </h3>
                <button
                  onClick={() => setEditing(true)}
                  className="text-[#7b1d2a] hover:text-[#5c1520] p-1.5 rounded-lg hover:bg-[#7b1d2a]/5 transition-colors"
                  title="Edit About Me"
                >
                  <PencilLine size={16} />
                </button>
              </div>
              {loading ? (
                <div className="py-4 flex items-center gap-2 text-gray-400 text-xs font-sans">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Loading profile...</span>
                </div>
              ) : (
                <p className="font-sans text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {formData.aboutMe || "No about summary provided yet. Click 'Edit Profile' to share your story, background, and vision."}
                </p>
              )}
            </div>

            {/* 2-Column Info Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Personal & Contact */}
              <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#1a1a1a] border-b pb-2 flex items-center gap-2">
                  <User size={15} className="text-[#7b1d2a]" /> Personal Details
                </h3>
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Full Name</span>
                    <span className="font-bold text-gray-800">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Gender</span>
                    <span className="font-medium text-gray-800">{formData.gender}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Age</span>
                    <span className="font-medium text-gray-800">{age ? `${age} years old` : "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Marital Status</span>
                    <span className="font-medium text-gray-800">{formData.maritalStatus}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Location</span>
                    <span className="font-medium text-gray-800">{formData.currentCityState || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">State of Origin</span>
                    <span className="font-medium text-gray-800">{formData.stateOfOrigin || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400 uppercase tracking-wide">Nationality</span>
                    <span className="font-medium text-gray-800">{formData.nationality}</span>
                  </div>
                </div>
              </div>

              {/* Education & Career */}
              <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#1a1a1a] border-b pb-2 flex items-center gap-2">
                  <Briefcase size={15} className="text-[#7b1d2a]" /> Education &amp; Career
                </h3>
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Education</span>
                    <span className="font-medium text-gray-800">{formData.educationLevel}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Profession</span>
                    <span className="font-bold text-gray-800">{formData.profession || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Employment</span>
                    <span className="font-medium text-gray-800">{formData.employmentStatus}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400 uppercase tracking-wide">Religion</span>
                    <span className="font-medium text-gray-800">{formData.religion || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Lifestyle & Family */}
              <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#1a1a1a] border-b pb-2 flex items-center gap-2">
                  <Smile size={15} className="text-[#7b1d2a]" /> Lifestyle &amp; Family
                </h3>
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Smoking</span>
                    <span className="font-medium text-gray-800">{formData.smoking}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Drinking</span>
                    <span className="font-medium text-gray-800">{formData.drinking}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-400 uppercase tracking-wide">Has Children</span>
                    <span className="font-medium text-gray-800">{formData.hasChildren}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-400 uppercase tracking-wide">Wants Children</span>
                    <span className="font-medium text-gray-800">{formData.wantsChildren}</span>
                  </div>
                </div>
              </div>

              {/* Intentions & Values */}
              <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-4">
                <h3 className="font-serif text-sm font-bold text-[#1a1a1a] border-b pb-2 flex items-center gap-2">
                  <Heart size={15} className="text-[#7b1d2a]" /> Intentions &amp; Values
                </h3>
                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide block mb-1">Relationship Goal</span>
                    <span className="font-bold text-[#7b1d2a]">{formData.relationshipGoal}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 uppercase tracking-wide block mb-2">Core Values</span>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.keyValues.split(",").map((v) => (
                        <span key={v} className="bg-[#7b1d2a]/10 text-[#7b1d2a] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                          {v.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400 uppercase tracking-wide block mb-2">Interests &amp; Hobbies</span>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.interestsHobbies.split(",").map((h) => (
                        <span key={h} className="bg-[#c9962c]/10 text-[#966b18] text-[11px] font-semibold px-2.5 py-1 rounded-full">
                          {h.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
