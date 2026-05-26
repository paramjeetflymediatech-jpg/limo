"use client";

import React, { useEffect, useState } from "react";
import { Globe, Plus, Trash2, Save, CheckCircle2, AlertCircle, Upload, X } from "lucide-react";

type SeoEntry = {
  title: string; description: string; keywords: string;
  ogTitle: string; ogDescription: string; ogImage: string; canonicalUrl: string;
};
type SeoMap = Record<string, SeoEntry>;

const EMPTY: SeoEntry = { title: "", description: "", keywords: "", ogTitle: "", ogDescription: "", ogImage: "", canonicalUrl: "" };
const inputCls  = "w-full bg-matte-black/60 border border-luxury-gold/15 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold/40";
const labelCls  = "text-[10px] uppercase tracking-widest text-gray-400 block mb-1";

export default function SeoPage() {
  const [seoMap,     setSeoMap]     = useState<SeoMap>({});
  const [routes,     setRoutes]     = useState<string[]>([]);
  const [selected,   setSelected]   = useState("/");
  const [form,       setForm]       = useState<SeoEntry>(EMPTY);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [msg,        setMsg]        = useState<{ type:"ok"|"err"; text:string }|null>(null);
  const [newRoute,   setNewRoute]   = useState("");
  const [addingPage, setAddingPage] = useState(false);

  useEffect(() => {
    fetch("/api/seo")
      .then(r => r.json())
      .then((d: SeoMap) => {
        setSeoMap(d);
        const r = Object.keys(d);
        setRoutes(r);
        if (r.length > 0) {
          setSelected(r[0]);
          setForm(d[r[0]]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toast = (type:"ok"|"err", text:string) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3500); };

  const selectRoute = (r: string) => {
    setSelected(r);
    setForm(seoMap[r] ?? EMPTY);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: selected, ...form }),
      });
      if (res.ok) {
        setSeoMap(m => ({ ...m, [selected]: form }));
        toast("ok", "SEO saved.");
      } else { const d = await res.json(); toast("err", d.error || "Failed to save."); }
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete SEO for "${selected}"?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/seo?route=${encodeURIComponent(selected)}`, { method: "DELETE" });
      if (res.ok) {
        const newMap = { ...seoMap }; delete newMap[selected];
        setSeoMap(newMap);
        const newRoutes = routes.filter(r => r !== selected);
        setRoutes(newRoutes);
        const next = newRoutes[0] ?? "";
        setSelected(next);
        setForm(next ? newMap[next] : EMPTY);
        toast("ok", "Route deleted.");
      } else { const d = await res.json(); toast("err", d.error || "Failed to delete."); }
    } finally { setDeleting(false); }
  };

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    const route = newRoute.trim().startsWith("/") ? newRoute.trim() : `/${newRoute.trim()}`;
    if (!route || seoMap[route]) { toast("err", "Route already exists or is invalid."); return; }
    const stub: SeoEntry = { title: "", description: "", keywords: "", ogTitle: "", ogDescription: "", ogImage: "", canonicalUrl: "" };
    const res = await fetch("/api/seo", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ route, ...stub }) });
    if (res.ok) {
      setSeoMap(m => ({ ...m, [route]: stub }));
      setRoutes(r => [...r, route]);
      setSelected(route);
      setForm(stub);
      setNewRoute("");
      setAddingPage(false);
      toast("ok", `Page "${route}" added.`);
    } else { toast("err", "Failed to add page."); }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {msg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded text-xs font-bold border shadow-xl ${msg.type === "ok" ? "bg-green-950/80 border-green-900/40 text-green-400" : "bg-red-950/80 border-red-900/40 text-red-400"}`}>
          {msg.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Globe className="w-5 h-5 text-luxury-gold" />
        <h1 className="text-2xl font-serif font-bold text-white">SEO Pages</h1>
        <button onClick={() => setAddingPage(true)} className="ml-auto flex items-center gap-2 px-4 py-2 bg-luxury-gold text-matte-black text-[10px] uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <Plus className="w-3.5 h-3.5" /> New Page
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Route list */}
          <div className="glass-panel rounded-xl border border-luxury-gold/10 p-4 flex flex-col gap-2 lg:col-span-1">
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Routes</p>
            {routes.map(r => (
              <button
                key={r}
                onClick={() => selectRoute(r)}
                className={`text-left px-3 py-2 rounded text-xs font-mono transition-all cursor-pointer ${selected === r ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                {r}
              </button>
            ))}
            {routes.length === 0 && <p className="text-gray-500 text-xs">No routes. Add one.</p>}
          </div>

          {/* SEO form */}
          <div className="lg:col-span-3">
            {selected ? (
              <form onSubmit={handleSave} className="glass-panel rounded-xl border border-luxury-gold/10 p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono text-luxury-gold">{selected}</p>
                  <button type="button" onClick={handleDelete} disabled={deleting} className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-red-400 hover:text-red-300 cursor-pointer disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><label className={labelCls}>Page Title ({"<title>"})</label><input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required /></div>
                  <div className="sm:col-span-2"><label className={labelCls}>Meta Description</label><textarea className={`${inputCls} resize-none h-16`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required /></div>
                  <div className="sm:col-span-2"><label className={labelCls}>Keywords (comma separated)</label><input className={inputCls} value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} /></div>
                  <div><label className={labelCls}>OG Title</label><input className={inputCls} value={form.ogTitle} onChange={e => setForm(f => ({ ...f, ogTitle: e.target.value }))} /></div>
                  <div><label className={labelCls}>Canonical URL</label><input className={inputCls} value={form.canonicalUrl} onChange={e => setForm(f => ({ ...f, canonicalUrl: e.target.value }))} placeholder="https://…" /></div>
                  <div className="sm:col-span-2"><label className={labelCls}>OG Description</label><textarea className={`${inputCls} resize-none h-14`} value={form.ogDescription} onChange={e => setForm(f => ({ ...f, ogDescription: e.target.value }))} /></div>
                  <div className="sm:col-span-2"><label className={labelCls}>OG Image URL</label><input className={inputCls} value={form.ogImage} onChange={e => setForm(f => ({ ...f, ogImage: e.target.value }))} placeholder="https://…" /></div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-luxury-gold text-matte-black text-xs uppercase tracking-widest font-bold rounded hover:brightness-110 cursor-pointer disabled:opacity-60">
                    <Save className="w-3.5 h-3.5" />
                    {saving ? "Saving…" : "Save SEO"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="glass-panel rounded-xl border border-luxury-gold/10 py-16 text-center text-gray-500 text-sm">
                Select a route to edit or add a new page.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add page modal */}
      {addingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="glass-panel border border-luxury-gold/20 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">New SEO Page</h2>
              <button onClick={() => setAddingPage(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddPage} className="flex flex-col gap-4">
              <div>
                <label className={labelCls}>Route / URL Path</label>
                <input className={inputCls} value={newRoute} onChange={e => setNewRoute(e.target.value)} placeholder="/your-page-slug" required />
                <p className="text-[10px] text-gray-500 mt-1">Must start with / (e.g. /services/airport-transfers)</p>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setAddingPage(false)} className="px-4 py-2 border border-luxury-gold/20 text-luxury-gold text-xs uppercase tracking-widest font-bold rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-luxury-gold text-matte-black text-xs uppercase tracking-widest font-bold rounded hover:brightness-110 cursor-pointer">Add Page</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
