"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { CheckCircle2, PencilLine, Save, X, Loader2, AlertCircle } from "lucide-react";
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
    firstName: "",
    lastName: "",
    profession: "",
    currentCityState: "",
    aboutMe: "",
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
              "";

            setFormData({
              firstName: p.firstName || data.user.firstName || "",
              lastName: p.lastName || data.user.lastName || "",
              profession: p.profession || "",
              currentCityState: p.currentCityState || "",
              aboutMe: p.aboutMe || "",
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
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          profession: (user as any).profession || "",
          currentCityState: (user as any).location || "",
          aboutMe: (user as any).aboutMe || "",
          avatar: user.avatar || "",
        });
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
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSaveSuccess("Profile details saved successfully!");
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">My Profile</h1>
            <p className="font-sans text-sm text-gray-500 mt-1">
              Your private matchmaking profile — visible only to your matched candidates.
            </p>
          </div>
          <button
            onClick={() => {
              setEditing(!editing);
              setSaveSuccess(null);
              setSaveError(null);
            }}
            className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#5c1520] transition-colors"
          >
            {editing ? <X size={15} /> : <PencilLine size={15} />}
            <span>{editing ? "Cancel Editing" : "Edit Profile"}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-800 text-xs sm:text-sm font-sans">
            <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs sm:text-sm font-sans">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Profile Hero Card */}
        <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden">
          {/* Cover Banner */}
          <div className="h-28 sm:h-32 bg-gradient-to-r from-[#7b1d2a] via-[#9b2535] to-[#5c1520]" />

          <div className="px-6 pt-0 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14 mb-2">
              {/* Avatar overlapping cover */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-gray-100">
                {formData.avatar ? (
                  <Image
                    src={formData.avatar}
                    alt="Profile photo"
                    fill
                    className="object-cover"
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
                </h2>
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                <span className="bg-[#7b1d2a]/10 text-[#7b1d2a] font-sans text-xs font-semibold px-3 py-0.5 rounded-full ml-auto">
                  Profile {user?.profileCompletion || 80}% Complete
                </span>
              </div>
              <p className="font-sans text-sm text-gray-500">
                {formData.profession || "Intentional Member"} ·{" "}
                {formData.currentCityState || "Lagos, Nigeria"}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Photo Widget */}
        <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-3">
          <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Profile Photo Upload</h3>
          <p className="font-sans text-xs text-gray-500">
            Upload a clear, recent portrait to enhance your matchmaking visibility.
          </p>
          <MediaUploader
            value={formData.avatar}
            onChange={handleAvatarChange}
            bucket="profile-photos"
            label="Upload Main Profile Photo"
          />
        </div>

        {/* Edit Form */}
        {editing ? (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-4"
          >
            <h3 className="font-serif text-base font-bold text-[#1a1a1a] border-b pb-3">
              Edit Profile Details
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Profession</label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) => setFormData((p) => ({ ...p, profession: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Location</label>
                <input
                  type="text"
                  value={formData.currentCityState}
                  onChange={(e) => setFormData((p) => ({ ...p, currentCityState: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                About Me
              </label>
              <textarea
                rows={4}
                value={formData.aboutMe}
                onChange={(e) => setFormData((p) => ({ ...p, aboutMe: e.target.value }))}
                placeholder="Share your personality, vision, and what matters to you..."
                className="w-full border rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-[#7b1d2a] text-white rounded-lg text-xs font-bold hover:bg-[#5c1520] flex items-center gap-1.5 shadow-sm transition-colors"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        ) : (
          /* About Me View */
          <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-[#1a1a1a]">About Me</h3>
              <button
                onClick={() => setEditing(true)}
                className="text-[#7b1d2a] hover:text-[#5c1520] p-1 rounded-lg hover:bg-[#7b1d2a]/5 transition-colors"
                title="Edit About Me"
              >
                <PencilLine size={16} />
              </button>
            </div>
            {loading ? (
              <div className="py-4 flex items-center gap-2 text-gray-400 text-xs font-sans">
                <Loader2 size={14} className="animate-spin" />
                <span>Loading profile bio...</span>
              </div>
            ) : (
              <p className="font-sans text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {formData.aboutMe || "No about information provided yet. Click the edit button above to share your background and vision."}
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
