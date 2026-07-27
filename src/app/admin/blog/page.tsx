"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Loader2, Star, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  featured: boolean;
  status: string;
  createdAt: string;
  category?: { name: string } | null;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadPosts = () => {
    setLoading(true);
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((data) => { if (data?.posts) setPosts(data.posts); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPosts(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post permanently?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch { /* ignore */ }
    finally { setDeleting(null); }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a1a1a]">Blog Posts</h1>
            <p className="font-sans text-xs text-gray-500 mt-1">
              {posts.length} post{posts.length !== 1 ? "s" : ""} in the database
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={loadPosts} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 rounded-lg font-sans text-xs text-gray-600 hover:bg-gray-200">
              <RefreshCw size={13} />
            </button>
            <Link href="/admin/blog/new" className="flex items-center gap-2 bg-[#7b1d2a] text-white font-sans text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#5c1520]">
              <Plus size={16} /> New Post
            </Link>
          </div>
        </div>

        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <input
            type="text"
            placeholder="Search posts by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-3 py-2 border border-gray-200 rounded-lg font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[#7b1d2a]"
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 flex items-center justify-center gap-2 text-gray-500 font-sans text-xs">
            <Loader2 size={18} className="animate-spin text-[#7b1d2a]" /> Loading from database...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="font-sans text-sm text-gray-500">{posts.length === 0 ? "No blog posts yet. Create your first post." : "No posts match your search."}</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Title</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide hidden md:table-cell">Author</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 font-bold text-gray-600 uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {post.featured && <Star size={12} className="text-[#c9962c] flex-shrink-0" />}
                        <span className="font-semibold text-[#1a1a1a] line-clamp-1">{post.title}</span>
                      </div>
                      <p className="text-gray-400 text-[10px] mt-0.5 line-clamp-1">{post.excerpt}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{post.category?.name || "Uncategorised"}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">{post.author}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${post.status === "PUBLISHED" ? "bg-green-100 text-green-700" : post.status === "DRAFT" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/resources/blog/${post.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-[#7b1d2a]" title="View">
                          <ExternalLink size={14} />
                        </Link>
                        <Link href={`/admin/blog/${post.id}/edit`} className="p-1.5 text-gray-400 hover:text-[#7b1d2a]" title="Edit">
                          <Edit3 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-40"
                          title="Delete"
                        >
                          {deleting === post.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
