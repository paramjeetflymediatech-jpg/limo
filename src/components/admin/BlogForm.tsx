"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const CKEditorWrapper = dynamic(
  () => import("@/components/admin/CKEditorWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-50 border border-gray-200 rounded animate-pulse flex items-center justify-center text-xs text-gray-400">
        Loading editor...
      </div>
    ),
  }
);

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
};

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  author: "Admin",
  published: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

const inputCls = "w-full bg-white border border-gray-300 text-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D0A511] focus:ring-1 focus:ring-[#D0A511]/50";
const labelCls = "text-xs font-semibold text-gray-600 block mb-1";

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

interface BlogFormProps {
  initialData?: BlogPost;
  isEdit?: boolean;
}

export default function BlogForm({ initialData, isEdit }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEdit ? true : false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setIsSlugManuallyEdited(true);
      setForm({
        title: initialData.title,
        slug: initialData.slug,
        excerpt: initialData.excerpt,
        content: initialData.content,
        coverImage: initialData.coverImage || "",
        author: initialData.author,
        published: initialData.published,
        seoTitle: initialData.seoTitle || "",
        seoDescription: initialData.seoDescription || "",
        seoKeywords: initialData.seoKeywords || "",
      });
    }
  }, [initialData]);

  const toast = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const d = await res.json();
      setForm((f) => ({ ...f, coverImage: d.url }));
    } else {
      toast("err", "Failed to upload image.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!form.content.trim()) {
      toast("err", "Content is required.");
      setSaving(false);
      return;
    }

    try {
      const url = isEdit && initialData ? `/api/blog/${initialData.id}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast("ok", isEdit ? "Post updated." : "Post added.");
        setTimeout(() => {
          router.push("/admin/blog");
          router.refresh();
        }, 1000);
      } else {
        const d = await res.json();
        toast("err", d.error || "Failed to save.");
      }
    } catch (err) {
      toast("err", "A network error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Toast */}
      {msg && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded text-xs font-bold border shadow-xl ${
            msg.type === "ok" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {msg.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          {isEdit ? "Edit Post" : "Add New Post"}
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Post Title *</label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => {
                  const titleVal = e.target.value;
                  setForm((f) => {
                    const updated = { ...f, title: titleVal };
                    if (!isSlugManuallyEdited) {
                      updated.slug = generateSlug(titleVal);
                    }
                    return updated;
                  });
                }}
                required
              />
            </div>
            <div>
              <label className={labelCls}>URL Slug *</label>
              <input
                className={inputCls}
                value={form.slug}
                onChange={(e) => {
                  const slugVal = e.target.value;
                  setIsSlugManuallyEdited(slugVal.length > 0);
                  setForm((f) => ({ ...f, slug: slugVal }));
                }}
                placeholder="my-blog-post"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Author</label>
              <input className={inputCls} value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="Admin" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Excerpt</label>
              <textarea 
                className={`${inputCls} resize-none h-20`} 
                value={form.excerpt} 
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} 
                placeholder="A short summary of the blog post..." 
                maxLength={300}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Content *</label>
            <CKEditorWrapper
              value={form.content}
              onChange={(data) => setForm((f) => ({ ...f, content: data }))}
            />
          </div>

          <div>
            <label className={labelCls}>Cover Image URL / Upload</label>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} value={form.coverImage} onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))} placeholder="https://…" />
              <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors">
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            {form.coverImage && <img src={form.coverImage} alt="cover preview" className="mt-3 h-48 w-auto object-cover rounded-md border border-gray-200 shadow-sm" />}
          </div>

          <hr className="border-gray-100 my-4" />
          
          <div>
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Search Engine Optimization (SEO)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={labelCls}>SEO Title (Defaults to Post Title if empty)</label>
                <input
                  className={inputCls}
                  value={form.seoTitle}
                  onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
                  placeholder="Optimized Title for Search Engines"
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>SEO Description (Defaults to Excerpt if empty)</label>
                <textarea 
                  className={`${inputCls} resize-none h-20`} 
                  value={form.seoDescription} 
                  onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} 
                  placeholder="Meta description for search results..." 
                  maxLength={160}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>SEO Keywords (Comma separated)</label>
                <input
                  className={inputCls}
                  value={form.seoKeywords}
                  onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))}
                  placeholder="luxury, transport, limo..."
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100 my-2" />

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="post-avail" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="accent-[#D0A511] w-4 h-4" />
            <label htmlFor="post-avail" className="text-sm font-semibold text-gray-700 cursor-pointer">Published (Visible on site)</label>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
            <Link href="/admin/blog" className="px-6 py-2.5 border border-gray-200 text-gray-600 text-xs uppercase tracking-widest font-bold rounded-md hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#D0A511] text-white text-xs uppercase tracking-widest font-bold rounded-md hover:brightness-110 transition-all disabled:opacity-60 shadow-md">
              {saving ? "Saving…" : (isEdit ? "Update Post" : "Save Post")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
