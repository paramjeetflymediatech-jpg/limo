"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const CKEditorWrapper = dynamic(
  () => import("@/components/admin/CKEditorWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] bg-gray-50 border border-gray-200 rounded animate-pulse flex items-center justify-center text-xs text-gray-400">
        Loading editor...
      </div>
    ),
  }
);

type Service = {
  id: number; name: string; description: string; image: string;
  location: string; price: string; available: boolean;
  slug: string; tagline: string;
  bulletPoints: string; // JSON string
  featuresJson: string; // JSON string
};

type Feature = { title: string; description: string };

const EMPTY_FORM = {
  name: "", description: "", image: "", location: "", price: "",
  slug: "", tagline: "", bulletPoints: "", featuresJson: "",
  available: true,
};

const inputCls = "w-full bg-white border border-gray-300 text-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D0A511] focus:ring-1 focus:ring-[#D0A511]/50";
const labelCls = "text-xs font-semibold text-gray-600 block mb-1";

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

interface ServiceFormProps {
  initialData?: Service;
  isEdit?: boolean;
}

export default function ServiceForm({ initialData, isEdit }: ServiceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [bullets, setBullets] = useState<string[]>([""]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(isEdit ? true : false);

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setIsSlugManuallyEdited(true);
      setForm({
        name: initialData.name,
        description: initialData.description,
        image: initialData.image,
        location: initialData.location,
        price: initialData.price,
        slug: initialData.slug,
        tagline: initialData.tagline,
        bulletPoints: initialData.bulletPoints,
        featuresJson: initialData.featuresJson,
        available: initialData.available,
      });

      try {
        setFeatures(JSON.parse(initialData.featuresJson));
      } catch {
        setFeatures([]);
      }

      try {
        const parsedBullets = JSON.parse(initialData.bulletPoints);
        setBullets(parsedBullets.length > 0 ? parsedBullets : [""]);
      } catch {
        setBullets([""]);
      }
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
      setForm((f) => ({ ...f, image: d.url }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const plainText = form.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
    if (!plainText) {
      toast("err", "Description is required.");
      setSaving(false);
      return;
    }

    const body = {
      ...form,
      bulletPoints: JSON.stringify(bullets.filter((b) => b.trim())),
      featuresJson: JSON.stringify(features.filter((f) => f.title.trim())),
    };
    try {
      const url = isEdit && initialData ? `/api/services/${initialData.id}` : "/api/services";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast("ok", isEdit ? "Service updated." : "Service added.");
        setTimeout(() => {
          router.push("/admin/services");
          router.refresh();
        }, 1000);
      } else {
        const d = await res.json();
        toast("err", d.error || "Failed to save.");
      }
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
        <Link href="/admin/services" className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          {isEdit ? "Edit Service" : "Add New Service"}
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelCls}>Service Name *</label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => {
                  const nameVal = e.target.value;
                  setForm((f) => {
                    const updated = { ...f, name: nameVal };
                    if (!isSlugManuallyEdited) {
                      updated.slug = generateSlug(nameVal);
                    }
                    return updated;
                  });
                }}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Location *</label>
              <input className={inputCls} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="Dubai, London, New York" required />
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
                placeholder="airport-transfers"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Price</label>
              <input className={inputCls} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="$180/hr" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Tagline</label>
              <input className={inputCls} value={form.tagline} onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))} placeholder="VIP Arrivals & Departures" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <CKEditorWrapper
              value={form.description}
              onChange={(data) => setForm((f) => ({ ...f, description: data }))}
            />
          </div>

          <div>
            <label className={labelCls}>Image URL / Upload *</label>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://…" required />
              <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors">
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            {form.image && <img src={form.image} alt="preview" className="mt-3 h-32 w-auto object-cover rounded-md border border-gray-200 shadow-sm" />}
          </div>

          {/* Bullet points */}
          <div>
            <label className={labelCls}>Bullet Points (key selling points)</label>
            <div className="flex flex-col gap-2">
              {bullets.map((b, i) => (
                <div key={i} className="flex gap-2">
                  <input className={`${inputCls} flex-1`} value={b} onChange={(e) => setBullets((arr) => arr.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Bullet point ${i + 1}`} />
                  <button type="button" onClick={() => setBullets((arr) => arr.filter((_, j) => j !== i))} className="px-3 text-red-500 hover:text-red-700 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => setBullets((arr) => [...arr, ""])} className="text-sm font-semibold text-[#D0A511] hover:underline self-start mt-1 cursor-pointer">
                + Add bullet
              </button>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className={labelCls}>Feature Cards</label>
            <div className="flex flex-col gap-3">
              {features.map((f, i) => (
                <div key={i} className="border border-gray-200 bg-gray-50 rounded-md p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Feature {i + 1}</span>
                    <button type="button" onClick={() => setFeatures((arr) => arr.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input className={inputCls} placeholder="Title" value={f.title} onChange={(e) => setFeatures((arr) => arr.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
                  <textarea className={`${inputCls} resize-none h-20`} placeholder="Description" value={f.description} onChange={(e) => setFeatures((arr) => arr.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))} />
                </div>
              ))}
              <button type="button" onClick={() => setFeatures((arr) => [...arr, { title: "", description: "" }])} className="text-sm font-semibold text-[#D0A511] hover:underline self-start mt-1 cursor-pointer">
                + Add feature card
              </button>
            </div>
          </div>

          <hr className="border-gray-100 my-2" />

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="svc-avail" checked={form.available} onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))} className="accent-[#D0A511] w-4 h-4" />
            <label htmlFor="svc-avail" className="text-sm font-semibold text-gray-700 cursor-pointer">Active / Visible on site</label>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
            <Link href="/admin/services" className="px-6 py-2.5 border border-gray-200 text-gray-600 text-xs uppercase tracking-widest font-bold rounded-md hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#D0A511] text-white text-xs uppercase tracking-widest font-bold rounded-md hover:brightness-110 transition-all disabled:opacity-60 shadow-md">
              {saving ? "Saving…" : (isEdit ? "Update Service" : "Save Service")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
