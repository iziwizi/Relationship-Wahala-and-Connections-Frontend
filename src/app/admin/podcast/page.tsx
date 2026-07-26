"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, PlayCircle, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { demoPodcasts, DemoPodcastEpisode } from "@/data/demo/cms";

export default function AdminPodcastPage() {
  const [episodes, setEpisodes] = useState<DemoPodcastEpisode[]>(demoPodcasts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEpisodes = episodes.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this podcast episode?")) {
      setEpisodes(episodes.filter((e) => e.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Podcast Content Management</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">Manage YouTube video podcast episodes, thumbnails, and descriptions.</p>
          </div>
          <Button href="/admin/podcast/new" variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Add New Episode
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search podcast episodes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full font-sans text-xs text-gray-900 focus:outline-none"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Episode Title</th>
                  <th className="p-4">YouTube ID</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Views</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEpisodes.map((ep) => (
                  <tr key={ep.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-[#1a1a1a] max-w-xs truncate">
                      {ep.title}
                      {ep.featured && (
                        <span className="ml-2 bg-[#c9962c]/10 text-[#c9962c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 font-mono text-[11px]">{ep.youtubeVideoId}</td>
                    <td className="p-4 text-gray-600">{ep.duration}</td>
                    <td className="p-4 text-gray-600">{ep.views}</td>
                    <td className="p-4 text-gray-600">{ep.publishedAt}</td>
                    <td className="p-4 text-right space-x-2">
                      <a
                        href={ep.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-red-600 hover:text-red-800 inline-block"
                        title="Watch on YouTube"
                      >
                        <PlayCircle size={16} />
                      </a>
                      <Link
                        href={`/admin/podcast/${ep.id}/edit`}
                        className="p-1.5 text-blue-600 hover:text-blue-800 inline-block"
                        title="Edit Episode"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(ep.id)}
                        className="p-1.5 text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
