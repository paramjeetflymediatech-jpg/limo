"use client";

import React, { useEffect, useState, useRef } from "react";
import { Car, Plus, Trash2, Pencil, X, Upload, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

type Vehicle = {
  id: string; name: string; category: string; image: string;
  description: string; price: string; passengers: number;
  luggage: number; available: boolean; imagesJson?: string;
  amenitiesJson?: string;
};

type FormState = Omit<Vehicle, "id"> & {
  images: string[];
  amenities: string[];
};

const STANDARD_AMENITIES = [
  "High-Speed Wi-Fi",
  "Discreet Privacy Glass",
  "Premium Audio System",
  "Chilled Mineral Water",
  "Professional Chauffeur",
  "Dual Zone Climate Control"
];

const EMPTY: FormState = {
  name: "", category: "", image: "", description: "",
  price: "", passengers: 4, luggage: 2, available: true,
  images: [],
  amenities: ["High-Speed Wi-Fi", "Discreet Privacy Glass", "Premium Audio System", "Chilled Mineral Water", "Professional Chauffeur"],
};

const inputCls = "w-full bg-matte-black/60 border border-luxury-gold/15 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold/40";
const labelCls = "text-[10px] uppercase tracking-widest text-gray-400 block mb-1";
const PER_PAGE = 9;

export default function FleetPage() {
  const [fleet,    setFleet]    = useState<Vehicle[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState<FormState>(EMPTY);
  const [editing,  setEditing]  = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ type: "ok"|"err"; text: string } | null>(null);
  const [page,     setPage]     = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const multiFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/fleet").then(r => r.json()).then(d => setFleet(Array.isArray(d) ? d : [])).finally(() => setLoading(false));
  }, []);

  const toast = (type: "ok"|"err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (v: Vehicle) => {
    let parsedImages: string[] = [];
    try {
      if (v.imagesJson) {
        parsedImages = JSON.parse(v.imagesJson);
      }
    } catch (e) {
      console.error("Failed to parse imagesJson:", e);
    }

    let parsedAmenities: string[] = [];
    try {
      if (v.amenitiesJson) {
        parsedAmenities = JSON.parse(v.amenitiesJson);
      } else {
        parsedAmenities = ["High-Speed Wi-Fi", "Discreet Privacy Glass", "Premium Audio System", "Chilled Mineral Water", "Professional Chauffeur"];
      }
    } catch (e) {
      console.error("Failed to parse amenitiesJson:", e);
      parsedAmenities = ["High-Speed Wi-Fi", "Discreet Privacy Glass", "Premium Audio System", "Chilled Mineral Water", "Professional Chauffeur"];
    }

    setForm({
      name: v.name,
      category: v.category,
      image: v.image,
      description: v.description,
      price: v.price,
      passengers: v.passengers,
      luggage: v.luggage,
      available: v.available,
      images: parsedImages,
      amenities: parsedAmenities,
    });
    setEditing(v);
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) { const d = await res.json(); setForm(f => ({ ...f, image: d.url })); }
  };

  const handleUploadAdditional = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append("file", files[i]);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const d = await res.json();
        uploadedUrls.push(d.url);
      }
    }
    
    if (uploadedUrls.length > 0) {
      setForm(f => ({ ...f, images: [...f.images, ...uploadedUrls] }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        imagesJson: JSON.stringify(form.images),
        amenitiesJson: JSON.stringify(form.amenities),
      };
      delete (payload as any).images;
      delete (payload as any).amenities;

      const url    = editing ? `/api/fleet/${editing.id}` : "/api/fleet";
      const method = editing ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        const saved = await res.json();
        if (editing) setFleet(f => f.map(v => v.id === editing.id ? saved : v));
        else setFleet(f => [...f, saved]);
        setShowForm(false);
        toast("ok", editing ? "Vehicle updated." : "Vehicle added.");
      } else {
        const d = await res.json();
        toast("err", d.error || "Failed to save vehicle.");
      }
    } finally { setSaving(false); }
  };

  const toggleAvail = async (v: Vehicle) => {
    const res = await fetch(`/api/fleet/${v.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, available: !v.available }) });
    if (res.ok) { const saved = await res.json(); setFleet(f => f.map(x => x.id === v.id ? saved : x)); }
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    const res = await fetch(`/api/fleet/${id}`, { method: "DELETE" });
    if (res.ok) setFleet(f => f.filter(v => v.id !== id));
  };

  const totalPages = Math.max(1, Math.ceil(fleet.length / PER_PAGE));
  const paginated  = fleet.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
        <Car className="w-5 h-5 text-luxury-gold" />
        <h1 className="text-2xl font-serif font-bold text-white">Fleet Management</h1>
        <button onClick={openAdd} className="ml-auto flex items-center gap-2 px-4 py-2 bg-luxury-gold text-matte-black text-[10px] uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <Plus className="w-3.5 h-3.5" /> Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {fleet.length === 0 ? (
            <div className="glass-panel rounded-xl border border-luxury-gold/10 py-16 text-center text-gray-500 text-sm">
              No vehicles yet. <button onClick={openAdd} className="text-luxury-gold underline cursor-pointer">Add one.</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map(v => (
                <div key={v.id} className="glass-panel border border-luxury-gold/10 rounded-xl overflow-hidden flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 right-2 text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${v.available ? "bg-green-950/80 text-green-400 border-green-900/40" : "bg-red-950/80 text-red-400 border-red-900/40"}`}>
                      {v.available ? "Online" : "Offline"}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <p className="text-[9px] uppercase tracking-widest text-luxury-gold">{v.category}</p>
                    <h3 className="font-serif font-bold text-white text-sm">{v.name}</h3>
                    <p className="text-gray-400 text-[11px] line-clamp-2">{v.description}</p>
                    <div className="flex gap-3 text-[10px] text-gray-500 mt-auto pt-2">
                      <span>👥 {v.passengers}</span>
                      <span>🧳 {v.luggage}</span>
                      <span className="ml-auto text-luxury-gold font-bold">{v.price}</span>
                    </div>
                  </div>
                  <div className="flex border-t border-luxury-gold/10">
                    <button onClick={() => toggleAvail(v)} className="flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all cursor-pointer">
                      {v.available ? "Set Offline" : "Set Online"}
                    </button>
                    <button onClick={() => openEdit(v)} className="flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-luxury-gold hover:bg-luxury-gold/5 transition-all border-x border-luxury-gold/10 cursor-pointer">
                      <Pencil className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button onClick={() => deleteVehicle(v.id)} className="flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-red-400 hover:bg-red-950/10 transition-all cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
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
          <div className="glass-panel border border-luxury-gold/20 rounded-2xl p-8 w-full max-w-xl flex flex-col gap-5 my-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">{editing ? "Edit Vehicle" : "Add Vehicle"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className={labelCls}>Name *</label><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
                <div><label className={labelCls}>Category *</label><input className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required /></div>
                <div><label className={labelCls}>Price</label><input className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="$200/hr" /></div>
                <div><label className={labelCls}>Passengers</label><input type="number" className={inputCls} value={form.passengers} onChange={e => setForm(f => ({ ...f, passengers: +e.target.value }))} min={1} /></div>
                <div><label className={labelCls}>Luggage</label><input type="number" className={inputCls} value={form.luggage} onChange={e => setForm(f => ({ ...f, luggage: +e.target.value }))} min={0} /></div>
                <div className="flex items-center gap-2 pt-4">
                  <input type="checkbox" id="avail" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="accent-luxury-gold" />
                  <label htmlFor="avail" className="text-xs text-gray-300">Available / Online</label>
                </div>
              </div>

              <div>
                <label className={labelCls}>Description *</label>
                <textarea className={`${inputCls} resize-none h-20`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              </div>

              <div>
                <label className={labelCls}>Image URL / Upload (Primary)</label>
                <div className="flex gap-2">
                  <input className={`${inputCls} flex-1`} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://…" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 border border-luxury-gold/20 text-luxury-gold rounded hover:bg-luxury-gold/10 text-xs cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                {form.image && <img src={form.image} alt="preview" className="mt-2 h-24 w-full object-cover rounded border border-luxury-gold/10" />}
              </div>

              {/* Multiple photos uploads */}
              <div>
                <label className={labelCls}>Additional Gallery Images</label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded overflow-hidden border border-luxury-gold/25 group bg-matte-black">
                      <img src={img} className="w-full h-full object-cover" alt="Gallery thumbnail" />
                      <button
                        type="button"
                        onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                        className="absolute inset-0 bg-red-950/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => multiFileRef.current?.click()}
                    className="w-20 h-20 rounded border border-dashed border-luxury-gold/30 hover:border-luxury-gold/60 flex flex-col items-center justify-center text-gray-500 hover:text-luxury-gold transition-colors text-[9px] gap-1 cursor-pointer bg-matte-black/40"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
                <input ref={multiFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUploadAdditional} />
              </div>

              {/* Amenities checklist & custom input */}
              <div>
                <label className={labelCls}>Amenities Included</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {STANDARD_AMENITIES.map(amenity => (
                    <label key={amenity} className="flex items-center gap-2 text-[11px] text-gray-300">
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(amenity)}
                        onChange={e => {
                          if (e.target.checked) {
                            setForm(f => ({ ...f, amenities: [...f.amenities, amenity] }));
                          } else {
                            setForm(f => ({ ...f, amenities: f.amenities.filter(a => a !== amenity) }));
                          }
                        }}
                        className="accent-luxury-gold"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
                
                <div className="mt-3">
                  <label className="text-[9px] uppercase tracking-wider text-gray-500 block mb-1">Add Custom Amenity</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="custom-amenity-input"
                      placeholder="e.g. Starlight Headliner, Heated Seats"
                      className="flex-1 bg-matte-black/60 border border-luxury-gold/15 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-luxury-gold/40"
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val && !form.amenities.includes(val)) {
                            setForm(f => ({ ...f, amenities: [...f.amenities, val] }));
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("custom-amenity-input") as HTMLInputElement;
                        const val = input?.value.trim();
                        if (val && !form.amenities.includes(val)) {
                          setForm(f => ({ ...f, amenities: [...f.amenities, val] }));
                          input.value = "";
                        }
                      }}
                      className="px-3 py-1.5 border border-luxury-gold/20 text-luxury-gold rounded hover:bg-luxury-gold/10 text-xs cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Selected Amenities Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.amenities.filter(a => !STANDARD_AMENITIES.includes(a)).map(amenity => (
                      <span key={amenity} className="inline-flex items-center gap-1 bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold px-2 py-0.5 rounded text-[10px]">
                        {amenity}
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, amenities: f.amenities.filter(a => a !== amenity) }))}
                          className="hover:text-red-400 font-bold"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 border border-luxury-gold/20 text-luxury-gold text-xs uppercase tracking-widest font-bold rounded hover:bg-white/5 cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 bg-luxury-gold text-matte-black text-xs uppercase tracking-widest font-bold rounded hover:brightness-110 cursor-pointer disabled:opacity-60">
                  {saving ? "Saving…" : "Save Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
