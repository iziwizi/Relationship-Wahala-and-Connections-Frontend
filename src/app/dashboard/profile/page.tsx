"use client";

import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { demoUser } from "@/data/demo/user";
import Image from "next/image";
import { CheckCircle2, PencilLine, Camera, Save, X, Loader2 } from "lucide-react";
import MediaUploader from "@/components/ui/MediaUploader";

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || demoUser.firstName,
    lastName: user?.lastName || demoUser.lastName,
    profession: (user as any)?.profession || demoUser.educationCareer.occupation,
    currentCityState: (user as any)?.location || demoUser.location.city,
    aboutMe: demoUser.aboutMe,
    avatar: user?.avatar || demoUser.avatar,
  });

  const handleAvatarChange = async (url: string) => {
    setUploadingPhoto(true);
    setFormData((prev) => ({ ...prev, avatar: url }));
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: url }),
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to update avatar:", err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Profile details saved successfully!");
        setEditing(false);
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Error saving profile details.");
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
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#5c1520] transition-colors"
          >
            {editing ? <X size={15} /> : <PencilLine size={15} />}
            <span>{editing ? "Cancel Editing" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Profile Hero Card */}
        <div className="bg-white rounded-2xl border border-[#e8e0d4] shadow-sm overflow-hidden">
          {/* Cover Banner */}
          <div className="h-28 sm:h-32 bg-gradient-to-r from-[#7b1d2a] via-[#9b2535] to-[#5c1520]" />
          
          <div className="px-6 pt-0 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14 mb-2">
              {/* Avatar overlapping cover */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-gray-100">
                <Image
                  src={formData.avatar || demoUser.avatar}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
                {uploadingPhoto && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 size={20} className="text-white animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Identity Info — cleanly inside white content section */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                  {user?.firstName || formData.firstName} {user?.lastName || formData.lastName}
                </h2>
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                <span className="bg-[#7b1d2a]/10 text-[#7b1d2a] font-sans text-xs font-semibold px-3 py-0.5 rounded-full ml-auto">
                  Profile {user?.profileCompletion || 75}% Complete
                </span>
              </div>
              <p className="font-sans text-sm text-gray-500">
                {formData.profession || demoUser.educationCareer.occupation} · {formData.currentCityState || demoUser.location.city}
              </p>
            </div>
          </div>
        </div>

        {/* Upload Photo Widget */}
        <div className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-3">
          <h3 className="font-serif text-base font-bold text-[#1a1a1a]">Profile Photo Upload</h3>
          <p className="font-sans text-xs text-gray-500">Upload a clear, recent portrait to enhance your matchmaking visibility.</p>
          <MediaUploader
            value={formData.avatar}
            onChange={handleAvatarChange}
            bucket="profile-photos"
            label="Upload Main Profile Photo"
          />
        </div>

        {/* Edit Form */}
        {editing ? (
          <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-[#e8e0d4] shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-base font-bold text-[#1a1a1a] border-b pb-3">Edit Profile Details</h3>
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
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">About Me</label>
              <textarea
                rows={3}
                value={formData.aboutMe}
                onChange={(e) => setFormData((p) => ({ ...p, aboutMe: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-xs font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-[#7b1d2a] text-white rounded-lg text-xs font-bold hover:bg-[#5c1520] flex items-center gap-1"
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
              <button onClick={() => setEditing(true)} className="text-[#7b1d2a] hover:text-[#5c1520]">
                <PencilLine size={16} />
              </button>
            </div>
            <p className="font-sans text-sm text-gray-600 leading-relaxed">{formData.aboutMe || demoUser.aboutMe}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
