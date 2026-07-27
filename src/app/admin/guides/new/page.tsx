"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Save, Loader2, CheckCircle, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import MediaUploader from "@/components/ui/MediaUploader";

export default function AdminNewGuidePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Pre-Marital Preparation");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featured, setFeatured] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, excerpt, content, featuredImage, featured }),
      });
      if (res.ok) {
        showToast("success", "Guide created and published successfully.");
        setTimeout(() => router.push("/admin/guides"), 1200);
      } else {
        const err = await res.json();
        showToast("error", err.error || "Failed to create guide.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg font-sans text-sm font-semibold text-white ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {toast.msg}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link href="/admin/guides" className="text-gray-500 hover:text-[#7b1d2a]">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Create New Guide</h1>
            <p className="font-sans text-xs text-gray-500">Publish a new educational guide or diagnostic toolkit.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5 font-sans text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Guide Title</label>
            <input
              type="text"
              required
              placeholder="e.g. The Ultimate Pre-Marital Readiness Checklist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            >
              <option>Dating &amp; Courtship</option>
              <option>Marriage</option>
              <option>Communication</option>
              <option>Conflict Resolution</option>
              <option>Pre-Marital Preparation</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Featured Image</label>
            <MediaUploader
              value={featuredImage}
              onChange={setFeaturedImage}
              label="Upload Featured Image"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Excerpt / Summary</label>
            <textarea
              rows={2}
              required
              placeholder="Short summary of the guide..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Guide Body Content</label>
            <textarea
              rows={10}
              required
              placeholder="Write guide content. Use line breaks or ### for subheadings..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
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
            <label htmlFor="featured" className="font-semibold text-gray-700">Set as Featured Guide</label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Button href="/admin/guides" variant="outline" size="md">Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save &amp; Publish Guide</>}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
