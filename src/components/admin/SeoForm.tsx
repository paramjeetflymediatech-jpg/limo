"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export type SeoEntry = {
  route?: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
};

const EMPTY_FORM: SeoEntry = {
  route: "/",
  title: "",
  description: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  canonicalUrl: "",
};

const inputCls = "w-full bg-white border border-gray-300 text-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D0A511] focus:ring-1 focus:ring-[#D0A511]/50";
const labelCls = "text-xs font-semibold text-gray-600 block mb-1";

interface SeoFormProps {
  initialData?: SeoEntry;
  isEdit?: boolean;
}

export default function SeoForm({ initialData, isEdit }: SeoFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<SeoEntry>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const toast = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const route = form.route?.trim().startsWith("/") ? form.route.trim() : `/${form.route?.trim() || ""}`;
    if (!route || route === "/") {
      if (!form.route || form.route.trim() === "") {
        toast("err", "Route cannot be empty.");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, route }),
      });

      if (res.ok) {
        toast("ok", isEdit ? "SEO Settings updated." : "SEO Page added.");
        setTimeout(() => {
          router.push("/admin/seo");
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
      {msg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded text-xs font-bold border shadow-xl ${msg.type === "ok" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {msg.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/seo" className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          {isEdit ? `Edit SEO: ${form.route}` : "Add New SEO Route"}
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isEdit && (
              <div className="md:col-span-2">
                <label className={labelCls}>Route URL Path *</label>
                <input
                  className={inputCls}
                  value={form.route || ""}
                  onChange={e => setForm(f => ({ ...f, route: e.target.value }))}
                  placeholder="e.g., /services/corporate-travel"
                  required
                />
                <p className="text-[10px] text-gray-400 mt-1">Must start with / (e.g. /about)</p>
              </div>
            )}

            <div className="md:col-span-2">
              <label className={labelCls}>Page Title ({"<title>"}) *</label>
              <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Fantastic Limo | Home" required />
            </div>
            
            <div className="md:col-span-2">
              <label className={labelCls}>Meta Description *</label>
              <textarea 
                className={`${inputCls} resize-none h-20`} 
                value={form.description} 
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                placeholder="Experience the pinnacle of luxury..." 
                maxLength={160}
                required 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className={labelCls}>Keywords (comma separated)</label>
              <input className={inputCls} value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} placeholder="luxury limo, chauffeur, vip transport" />
            </div>

            <div>
              <label className={labelCls}>Open Graph (OG) Title</label>
              <input className={inputCls} value={form.ogTitle} onChange={e => setForm(f => ({ ...f, ogTitle: e.target.value }))} placeholder="Defaults to Page Title if empty" />
            </div>

            <div>
              <label className={labelCls}>Canonical URL</label>
              <input className={inputCls} value={form.canonicalUrl} onChange={e => setForm(f => ({ ...f, canonicalUrl: e.target.value }))} placeholder="https://fantasticlimo.com/..." />
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Open Graph (OG) Description</label>
              <textarea 
                className={`${inputCls} resize-none h-16`} 
                value={form.ogDescription} 
                onChange={e => setForm(f => ({ ...f, ogDescription: e.target.value }))} 
                placeholder="Defaults to Meta Description if empty" 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className={labelCls}>Open Graph (OG) Image URL</label>
              <input className={inputCls} value={form.ogImage} onChange={e => setForm(f => ({ ...f, ogImage: e.target.value }))} placeholder="https://..." />
              {form.ogImage && <img src={form.ogImage} alt="og preview" className="mt-3 h-32 w-auto object-cover rounded-md border border-gray-200 shadow-sm" />}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
            <Link href="/admin/seo" className="px-6 py-2.5 border border-gray-200 text-gray-600 text-xs uppercase tracking-widest font-bold rounded-md hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#D0A511] text-white text-xs uppercase tracking-widest font-bold rounded-md hover:brightness-110 transition-all disabled:opacity-60 shadow-md flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save SEO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
