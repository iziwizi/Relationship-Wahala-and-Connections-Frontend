"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Save, Loader2, CheckCircle, XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import MediaUploader from "@/components/ui/MediaUploader";

export default function AdminNewEventPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [registrationUrl, setRegistrationUrl] = useState("/register");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, eventDate, eventTime, location, isOnline, registrationUrl, description, image }),
      });
      if (res.ok) {
        showToast("success", "Event created successfully.");
        setTimeout(() => router.push("/admin/events"), 1200);
      } else {
        const err = await res.json();
        showToast("error", err.error || "Failed to create event.");
      }
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
          <Link href="/admin/events" className="text-gray-500 hover:text-[#7b1d2a]">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Create New Event</h1>
            <p className="font-sans text-xs text-gray-500">Add a physical workshop or virtual matchmaking mixer.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5 font-sans text-xs">
          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Intentional Singles &amp; Couples Masterclass 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Event Date (YYYY-MM-DD)</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Event Time (e.g. 10:00 AM WAT)</label>
              <input
                type="text"
                required
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Location / Venue</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Registration URL</label>
            <input
              type="text"
              value={registrationUrl}
              onChange={(e) => setRegistrationUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Event Image</label>
            <MediaUploader
              value={image}
              onChange={setImage}
              label="Upload Event Image"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={4}
              required
              placeholder="Detailed description of topics, speakers, and agenda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isOnline"
              checked={isOnline}
              onChange={(e) => setIsOnline(e.target.checked)}
              className="h-4 w-4 text-[#7b1d2a] rounded"
            />
            <label htmlFor="isOnline" className="font-semibold text-gray-700">Virtual / Online Event (Zoom, Webinar, etc.)</label>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Button href="/admin/events" variant="outline" size="md">Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={submitting}>
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Event</>}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
