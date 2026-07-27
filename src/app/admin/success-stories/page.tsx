"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Loader2, Star, RefreshCw } from "lucide-react";
import Link from "next/link";

interface SuccessStory {
  id: string;
  title: string;
  displayNames: string;
  location: string;
  weddingDate: string | null;
  featured: boolean;
  status: string;
  createdAt: string;
}

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadStories = () => {
    setLoading(true);
    fetch("/api/admin/success-stories")
      .then((r) => r.json())
      .then((data) => { if (data?.stories) setStories(data.stories); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStories(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this success story permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/success-stories/${id}`, { method: "DELETE" });
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch { /* ignore */ }
    finally { setDeleting(null); }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Success Stories</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">{stories.length} stor{stories.length !== 1 ? "ies" : "y"} in the database</p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadStories} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-lg font-sans text-xs text-gray-600 hover:bg-gray-200">
              <RefreshCw size={13} />
            </button>
            <Link href="/admin/success-stories/new" className="flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#5c1520]">
              <Plus size={16} /> New Story
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 flex items-center justify-center gap-2 text-gray-500 font-sans text-xs">
            <Loader2 size={18} className="animate-spin text-[#7b1d2a]" /> Loading from database...
          </div>
        ) : stories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="font-sans text-sm text-gray-500">No success stories yet. Add your first story.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Couple</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide hidden sm:table-cell">Location</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide hidden md:table-cell">Wedding Date</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stories.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {s.featured && <Star size={12} className="text-[#c9962c] flex-shrink-0" />}
                        <div>
                          <p className="font-semibold text-[#1a1a1a]">{s.displayNames}</p>
                          <p className="text-gray-400 text-[10px]">{s.title}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{s.location}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">{s.weddingDate || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/success-stories/${s.id}/edit`} className="p-1.5 text-gray-400 hover:text-[#7b1d2a]">
                          <Edit3 size={14} />
                        </Link>
                        <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id} className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-40">
                          {deleting === s.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
