"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import MediaUploader from "@/components/ui/MediaUploader";

export default function AdminNewPodcastPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [youtubeVideoId, setYoutubeVideoId] = useState("dQw4w9WgXcQ");
  const [thumbnail, setThumbnail] = useState("/images/video-thumb-1.jpg");
  const [duration, setDuration] = useState("45 mins");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      alert("Podcast episode created successfully!");
      router.push("/admin/podcast");
    }, 800);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-3">
          <Link href="/admin/podcast" className="text-gray-500 hover:text-[#7b1d2a]">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Add New Podcast Episode</h1>
            <p className="font-sans text-xs text-gray-500">Publish a new Relationship Wahala TV YouTube video episode.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5 font-sans text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Episode Title</label>
            <input
              type="text"
              required
              placeholder="e.g. EP 05: Navigating Money & Family in Marriage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">YouTube URL</label>
              <input
                type="text"
                required
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">YouTube Video ID</label>
              <input
                type="text"
                required
                value={youtubeVideoId}
                onChange={(e) => setYoutubeVideoId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <MediaUploader
                value={thumbnail}
                onChange={setThumbnail}
                bucket="cms-media"
                label="Podcast Episode Thumbnail Image"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Duration (e.g. 45 mins)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Episode Description</label>
            <textarea
              rows={4}
              required
              placeholder="Summary of episode topics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            <label htmlFor="featured" className="font-semibold text-gray-700">Set as Featured Episode on Homepage</label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Button href="/admin/podcast" variant="outline" size="md">Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Episode</>}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
