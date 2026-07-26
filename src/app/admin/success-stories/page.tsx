"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { demoSuccessStories, DemoSuccessStory } from "@/data/demo/cms";

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<DemoSuccessStory[]>(demoSuccessStories);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStories = stories.filter((s) =>
    s.displayNames.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this success story?")) {
      setStories(stories.filter((s) => s.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Success Stories Management</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">Manage verified marriage testimonials and client success stories.</p>
          </div>
          <Button href="/admin/success-stories/new" variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Add Success Story
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search stories by couple names or title..."
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
                  <th className="p-4">Couple Display Names</th>
                  <th className="p-4">Story Title</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Wedding Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStories.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-[#1a1a1a]">
                      {s.displayNames}
                      {s.featured && (
                        <span className="ml-2 bg-[#c9962c]/10 text-[#c9962c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 max-w-xs truncate">{s.title}</td>
                    <td className="p-4 text-gray-600">{s.location}</td>
                    <td className="p-4 text-gray-600">{s.weddingDate || "N/A"}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/admin/success-stories/${s.id}/edit`}
                        className="p-1.5 text-blue-600 hover:text-blue-800 inline-block"
                        title="Edit Story"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
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
