"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Eye, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { demoGuides, DemoGuide } from "@/data/demo/cms";

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState<DemoGuide[]>(demoGuides);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuides = guides.filter((g) =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this guide?")) {
      setGuides(guides.filter((g) => g.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Relationship Guides Management</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">Manage educational toolkits and checklists for members.</p>
          </div>
          <Button href="/admin/guides/new" variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Create New Guide
          </Button>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search guides by title or category..."
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
                  <th className="p-4">Guide Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredGuides.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-[#1a1a1a] max-w-xs truncate">
                      {g.title}
                      {g.featured && (
                        <span className="ml-2 bg-[#c9962c]/10 text-[#c9962c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{g.category}</td>
                    <td className="p-4 text-gray-600">{g.publishedAt}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/resources/guides/${g.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-500 hover:text-[#7b1d2a] inline-block"
                        title="View Public"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/guides/${g.id}/edit`}
                        className="p-1.5 text-blue-600 hover:text-blue-800 inline-block"
                        title="Edit Guide"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(g.id)}
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
