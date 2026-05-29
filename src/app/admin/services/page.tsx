"use client";

import React, { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Pencil, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Service = {
  id: number; name: string; description: string; image: string;
  location: string; price: string; available: boolean;
  slug: string; tagline: string;
  bulletPoints: string; // JSON string
  featuresJson: string; // JSON string
};

const PER_PAGE = 9;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  }, []);

  const toast = (type: "ok" | "err", text: string) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3500); };

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
  const paginated = services.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
        <Link href="/admin/services/new" className="ml-auto flex items-center gap-2 px-4 py-2 bg-luxury-gold text-matte-black text-[10px] uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(208,165,17,0.15)]">
          <Plus className="w-3.5 h-3.5" /> Add Service
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : services.length === 0 ? (
        <div className="glass-panel rounded-xl border border-luxury-gold/10 py-16 text-center text-gray-500 text-sm">
          No services yet. <Link href="/admin/services/new" className="text-luxury-gold underline cursor-pointer">Add one.</Link>
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
                  <Link href={`/admin/services/edit/${s.id}`} className="flex-1 py-2.5 flex items-center justify-center text-[10px] text-gray-400 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all border-x border-luxury-gold/10 cursor-pointer">
                    <Pencil className="w-3.5 h-3.5 mx-auto" />
                  </Link>
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


    </div>
  );
}
