"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapPin, Plus, Trash2, Pencil, X, Upload, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

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

const inputCls  = "w-full bg-matte-black/60 border border-luxury-gold/15 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold/40";
const labelCls  = "text-[10px] uppercase tracking-widest text-gray-400 block mb-1";
const PER_PAGE  = 9;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [bullets,  setBullets]  = useState<string[]>([]);
  const [editing,  setEditing]  = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [page,     setPage]     = useState(1);
  const [msg,      setMsg]      = useState<{ type:"ok"|"err"; text:string }|null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  }, []);

  const toast = (type:"ok"|"err", text:string) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3500); };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFeatures([]);
    setBullets([""]);
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (s: Service) => {
    setForm({ name: s.name, description: s.description, image: s.image, location: s.location, price: s.price, slug: s.slug, tagline: s.tagline, bulletPoints: s.bulletPoints, featuresJson: s.featuresJson, available: s.available });
    try { setFeatures(JSON.parse(s.featuresJson)); } catch { setFeatures([]); }
    try { setBullets(JSON.parse(s.bulletPoints)); } catch { setBullets([""]); }
    setEditing(s);
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) { const d = await res.json(); setForm(f => ({ ...f, image: d.url })); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = {
      ...form,
      bulletPoints: JSON.stringify(bullets.filter(b => b.trim())),
      featuresJson: JSON.stringify(features.filter(f => f.title.trim())),
    };
    try {
      const url    = editing ? `/api/services/${editing.id}` : "/api/services";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        const saved = await res.json();
        if (editing) setServices(sv => sv.map(s => s.id === editing.id ? saved : s));
        else setServices(sv => [...sv, saved]);
        setShowForm(false);
        toast("ok", editing ? "Service updated." : "Service added.");
      } else {
        const d = await res.json();
        toast("err", d.error || "Failed to save.");
      }
    } finally { setSaving(false); }
  };

  const toggleAvail = async (s: Service) => {
    const res = await fetch(`/api/services/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...s, available: !s.available }) });
    if (res.ok) { const saved = await res.json(); setServices(sv => sv.map(x => x.id === s.id ? saved : x)); }
  };

  const deleteService = async (id: number) => {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) setServices(sv => sv.filter(s => s.id !== id));
  };

  const totalPages = Math.max(1, Math.ceil(services.length / PER_PAGE));
  const paginated  = services.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
        <MapPin className="w-5 h-5 text-luxury-gold" />
        <h1 className="text-2xl font-serif font-bold text-white">Services</h1>
        <button onClick={openAdd} className="ml-auto flex items-center gap-2 px-4 py-2 bg-luxury-gold text-matte-black text-[10px] uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <Plus className="w-3.5 h-3.5" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : services.length === 0 ? (
        <div className="glass-panel rounded-xl border border-luxury-gold/10 py-16 text-center text-gray-500 text-sm">
          No services yet. <button onClick={openAdd} className="text-luxury-gold underline cursor-pointer">Add one.</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginated.map(s => (
              <div key={s.id} className="glass-panel border border-luxury-gold/10 rounded-xl overflow-hidden flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${s.available ? "bg-green-950/80 text-green-400 border-green-900/40" : "bg-red-950/80 text-red-400 border-red-900/40"}`}>
                    {s.available ? "Active" : "Inactive"}
                  </span>
                  <span className="absolute top-2 right-2 text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30">
                    {s.location}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-1.5 flex-1">
                  <p className="text-[9px] uppercase tracking-widest text-luxury-gold">{s.slug}</p>
                  <h3 className="font-serif font-bold text-white text-sm">{s.name}</h3>
                  <p className="text-gray-500 text-[10px] italic">{s.tagline}</p>
                  <p className="text-gray-400 text-[11px] line-clamp-2 mt-1">{s.description}</p>
                  <p className="text-luxury-gold text-xs font-bold mt-auto pt-2">{s.price}</p>
                </div>
                <div className="flex border-t border-luxury-gold/10">
                  <button onClick={() => toggleAvail(s)} className="flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all cursor-pointer">
                    {s.available ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => openEdit(s)} className="flex-1 py-2.5 text-[10px] text-gray-400 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all border-x border-luxury-gold/10 cursor-pointer">
                    <Pencil className="w-3.5 h-3.5 mx-auto" />
                  </button>
                  <button onClick={() => deleteService(s.id)} className="flex-1 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-1.5 rounded border border-luxury-gold/20 disabled:opacity-30 hover:border-luxury-gold/50 cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1.5 rounded border border-luxury-gold/20 disabled:opacity-30 hover:border-luxury-gold/50 cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 py-10 overflow-y-auto">
          <div className="glass-panel border border-luxury-gold/20 rounded-2xl p-8 w-full max-w-2xl flex flex-col gap-5 my-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">{editing ? "Edit Service" : "Add Service"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-5">
              {/* Basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Service Name *</label><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                <div><label className={labelCls}>Location *</label><input className={inputCls} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Dubai, London, New York" required /></div>
                <div><label className={labelCls}>URL Slug *</label><input className={inputCls} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="airport-transfers" required /></div>
                <div><label className={labelCls}>Price</label><input className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="$180/hr" /></div>
                <div className="sm:col-span-2"><label className={labelCls}>Tagline</label><input className={inputCls} value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="VIP Arrivals & Departures" /></div>
              </div>

              <div>
                <label className={labelCls}>Description *</label>
                <textarea className={`${inputCls} resize-none h-20`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>

              {/* Image */}
              <div>
                <label className={labelCls}>Image URL / Upload</label>
                <div className="flex gap-2">
                  <input className={`${inputCls} flex-1`} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://…" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 border border-luxury-gold/20 text-luxury-gold rounded hover:bg-luxury-gold/10 text-xs cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                {form.image && <img src={form.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded border border-luxury-gold/10" />}
              </div>

              {/* Bullet points */}
              <div>
                <label className={labelCls}>Bullet Points (key selling points)</label>
                <div className="flex flex-col gap-2">
                  {bullets.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <input className={`${inputCls} flex-1`} value={b} onChange={e => setBullets(arr => arr.map((x,j) => j===i ? e.target.value : x))} placeholder={`Bullet point ${i+1}`} />
                      <button type="button" onClick={() => setBullets(arr => arr.filter((_,j) => j !== i))} className="text-red-400 hover:text-red-300 cursor-pointer"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setBullets(arr => [...arr, ""])} className="text-xs text-luxury-gold hover:underline self-start cursor-pointer">+ Add bullet</button>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className={labelCls}>Feature Cards</label>
                <div className="flex flex-col gap-3">
                  {features.map((f, i) => (
                    <div key={i} className="border border-luxury-gold/10 rounded p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-luxury-gold">Feature {i+1}</span>
                        <button type="button" onClick={() => setFeatures(arr => arr.filter((_,j) => j!==i))} className="text-red-400 hover:text-red-300 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                      </div>
                      <input className={inputCls} placeholder="Title" value={f.title} onChange={e => setFeatures(arr => arr.map((x,j) => j===i ? { ...x, title: e.target.value } : x))} />
                      <textarea className={`${inputCls} resize-none h-14`} placeholder="Description" value={f.description} onChange={e => setFeatures(arr => arr.map((x,j) => j===i ? { ...x, description: e.target.value } : x))} />
                    </div>
                  ))}
                  <button type="button" onClick={() => setFeatures(arr => [...arr, { title: "", description: "" }])} className="text-xs text-luxury-gold hover:underline self-start cursor-pointer">+ Add feature card</button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="svc-avail" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="accent-luxury-gold" />
                <label htmlFor="svc-avail" className="text-xs text-gray-300">Active / Visible on site</label>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-luxury-gold/10">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-luxury-gold/20 text-luxury-gold text-xs uppercase tracking-widest font-bold rounded hover:bg-white/5 cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-luxury-gold text-matte-black text-xs uppercase tracking-widest font-bold rounded hover:brightness-110 cursor-pointer disabled:opacity-60">
                  {saving ? "Saving…" : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
