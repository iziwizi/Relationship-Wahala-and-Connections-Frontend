"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Save, Loader2, CheckCircle, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import MediaUploader from "@/components/ui/MediaUploader";

export default function AdminEditSuccessStoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [displayNames, setDisplayNames] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [story, setStory] = useState("");
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/success-stories/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.story) {
          const s = data.story;
          setDisplayNames(s.displayNames || "");
          setTitle(s.title || "");
          setLocation(s.location || "");
          setWeddingDate(s.weddingDate || "");
          setPhotoUrl(s.photoUrl || "");
          setStory(s.story || "");
          setFeatured(s.featured || false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/success-stories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayNames, title, location, weddingDate, photoUrl, story, featured }),
      });
      if (res.ok) {
        showToast("success", "Success story updated successfully.");
        setTimeout(() => router.push("/admin/success-stories"), 1200);
      } else {
        const err = await res.json();
        showToast("error", err.error || "Failed to update success story.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-[#7b1d2a]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg font-sans text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {toast.msg}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link href="/admin/success-stories" className="text-gray-500 hover:text-[#7b1d2a]">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Edit Success Story</h1>
            <p className="font-sans text-xs text-gray-500">Update story details or privacy display settings.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5 font-sans text-xs">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Display Names</label>
              <input
                type="text"
                required
                value={displayNames}
                onChange={(e) => setDisplayNames(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Story Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Wedding Date</label>
              <input
                type="text"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Couple Photo</label>
            <MediaUploader
              value={photoUrl}
              onChange={setPhotoUrl}
              label="Upload Couple Photo"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Testimonial Story</label>
            <textarea
              rows={4}
              required
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 text-[#7b1d2a] rounded"
            />
            <label htmlFor="featured" className="font-semibold text-gray-700">Set as Featured Story</label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Button href="/admin/success-stories" variant="outline" size="md">Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Updating...</> : <><Save size={16} /> Save Changes</>}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
