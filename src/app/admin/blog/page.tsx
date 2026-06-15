"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Pencil, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  author: string;
  published: boolean;
  createdAt: string;
};

const PER_PAGE = 9;

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/blog").then(r => r.json()).then(d => setPosts(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  }, []);

  const toast = (type: "ok" | "err", text: string) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3500); };

  const togglePublished = async (p: BlogPost) => {
    const res = await fetch(`/api/blog/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !p.published }) });
    if (res.ok) { 
      const saved = await res.json(); 
      setPosts(sv => sv.map(x => x.id === p.id ? saved : x)); 
      toast("ok", `Post ${saved.published ? "published" : "unpublished"} successfully`);
    } else {
      toast("err", "Failed to update status");
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts(sv => sv.filter(p => p.id !== id));
      toast("ok", "Post deleted successfully");
    } else {
      toast("err", "Failed to delete post");
    }
  };

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const paginated = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {msg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded text-xs font-bold border shadow-xl ${msg.type === "ok" ? "bg-green-950/80 border-green-900/40 text-green-400" : "bg-red-950/80 border-red-900/40 text-red-400"}`}>
          {msg.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-luxury-gold" />
        <h1 className="text-2xl font-serif font-bold text-gray-900">Blog Posts</h1>
        <Link href="/admin/blog/new" className="ml-auto flex items-center gap-2 px-4 py-2 bg-luxury-gold text-matte-black text-[10px] uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(208,165,17,0.15)]">
          <Plus className="w-3.5 h-3.5" /> Add Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-16 text-center text-gray-500 text-sm shadow-sm">
          No blog posts yet. <Link href="/admin/blog/new" className="text-luxury-gold underline cursor-pointer">Write one.</Link>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginated.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            {p.coverImage ? (
                              <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No Img</div>
                            )}
                          </div>
                          <div>
                            <div className="font-serif font-bold text-gray-900 line-clamp-1 break-all">{p.title}</div>
                            <div className="text-[10px] text-luxury-gold uppercase tracking-widest mt-0.5">{p.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{p.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${p.published ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                          {p.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => togglePublished(p)} className="p-2 text-gray-400 hover:text-luxury-gold hover:bg-[#D0A511]/10 rounded transition-colors" title={p.published ? "Unpublish" : "Publish"}>
                            <BookOpen className="w-4 h-4" />
                          </button>
                          <Link href={`/admin/blog/edit/${p.id}`} className="p-2 text-gray-400 hover:text-luxury-gold hover:bg-[#D0A511]/10 rounded transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button onClick={() => deletePost(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-gray-500 bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-sm">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded border border-gray-200 disabled:opacity-30 hover:border-luxury-gold hover:text-luxury-gold cursor-pointer transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded border border-gray-200 disabled:opacity-30 hover:border-luxury-gold hover:text-luxury-gold cursor-pointer transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
