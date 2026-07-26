"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { Plus, Edit3, Trash2, Eye, Search } from "lucide-react";
import Button from "@/components/ui/Button";
import { demoBlogPosts, DemoBlogPost } from "@/data/demo/cms";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<DemoBlogPost[]>(demoBlogPosts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Blog Content Management</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">Create, edit, and publish relationship articles for the website.</p>
          </div>
          <Button href="/admin/blog/new" variant="primary" size="sm" className="gap-2">
            <Plus size={16} /> Create New Article
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search articles by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full font-sans text-xs text-gray-900 focus:outline-none"
          />
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Article Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Author</th>
                  <th className="p-4">Published Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-bold text-[#1a1a1a] max-w-xs truncate">
                      {post.title}
                      {post.featured && (
                        <span className="ml-2 bg-[#c9962c]/10 text-[#c9962c] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600">{post.category}</td>
                    <td className="p-4 text-gray-600">{post.author}</td>
                    <td className="p-4 text-gray-600">{post.publishedAt}</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-800 font-semibold px-2.5 py-1 rounded-full text-[10px]">
                        Published
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        href={`/resources/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-500 hover:text-[#7b1d2a] inline-block"
                        title="View Public"
                      >
                        <Eye size={16} />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-1.5 text-blue-600 hover:text-blue-800 inline-block"
                        title="Edit Article"
                      >
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
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
