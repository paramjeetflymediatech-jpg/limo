"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Plus, Trash2, X, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

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

const inputCls = "w-full bg-white border border-gray-300 text-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D0A511] focus:ring-1 focus:ring-[#D0A511]/50";
const labelCls = "text-xs font-semibold text-gray-600 block mb-1";

interface FleetFormProps {
  initialData?: Vehicle;
  isEdit?: boolean;
}

export default function FleetForm({ initialData, isEdit }: FleetFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const multiFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      let parsedImages: string[] = [];
      try {
        if (initialData.imagesJson) parsedImages = JSON.parse(initialData.imagesJson);
      } catch (e) { }

      let parsedAmenities: string[] = [];
      try {
        if (initialData.amenitiesJson) {
          parsedAmenities = JSON.parse(initialData.amenitiesJson);
        } else {
          parsedAmenities = [...STANDARD_AMENITIES.slice(0, 5)];
        }
      } catch (e) {
        parsedAmenities = [...STANDARD_AMENITIES.slice(0, 5)];
      }

      setForm({
        name: initialData.name,
        category: initialData.category,
        image: initialData.image,
        description: initialData.description,
        price: initialData.price,
        passengers: initialData.passengers,
        luggage: initialData.luggage,
        available: initialData.available,
        images: parsedImages,
        amenities: parsedAmenities,
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

      const url = isEdit && initialData ? `/api/fleet/${initialData.id}` : "/api/fleet";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      
      if (res.ok) {
        toast("ok", isEdit ? "Vehicle updated." : "Vehicle added.");
        setTimeout(() => {
          router.push("/admin/fleet");
          router.refresh();
        }, 1000);
      } else {
        const d = await res.json();
        toast("err", d.error || "Failed to save vehicle.");
      }
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl">
      {/* Toast */}
      {msg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded text-xs font-bold border shadow-xl ${msg.type === "ok" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {msg.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/fleet" className="p-2 border border-gray-200 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          {isEdit ? "Edit Vehicle" : "Add New Vehicle"}
        </h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelCls}>Name *</label><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
            <div><label className={labelCls}>Category *</label><input className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required /></div>
            <div><label className={labelCls}>Price *</label><input className={inputCls} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="$200/hr" required /></div>
            <div><label className={labelCls}>Passengers</label><input type="number" className={inputCls} value={form.passengers} onChange={e => setForm(f => ({ ...f, passengers: +e.target.value }))} min={1} /></div>
            <div><label className={labelCls}>Luggage</label><input type="number" className={inputCls} value={form.luggage} onChange={e => setForm(f => ({ ...f, luggage: +e.target.value }))} min={0} /></div>
            
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="avail" checked={form.available} onChange={e => setForm(f => ({ ...f, available: e.target.checked }))} className="accent-[#D0A511] w-4 h-4" />
              <label htmlFor="avail" className="text-sm font-semibold text-gray-700 cursor-pointer">Available / Online</label>
            </div>
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea className={`${inputCls} resize-none h-24`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>

          <div>
            <label className={labelCls}>Image URL / Upload (Primary) *</label>
            <div className="flex gap-2">
              <input className={`${inputCls} flex-1`} value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://…" required />
              <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium transition-colors">
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            {form.image && <img src={form.image} alt="preview" className="mt-3 h-32 w-auto object-cover rounded-md border border-gray-200 shadow-sm" />}
          </div>

          {/* Multiple photos uploads */}
          <div>
            <label className={labelCls}>Additional Gallery Images</label>
            
            <div className="flex gap-2 mt-2 mb-4">
              <input 
                id="gallery-url-input"
                type="text" 
                className={`${inputCls} flex-1`} 
                placeholder="Paste image URL here..." 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                     e.preventDefault();
                     const input = e.target as HTMLInputElement;
                     if (input.value.trim()) {
                       setForm(f => ({ ...f, images: [...f.images, input.value.trim()] }));
                       input.value = "";
                     }
                  }
                }}
              />
              <button 
                type="button"
                onClick={() => {
                  const input = document.getElementById("gallery-url-input") as HTMLInputElement;
                  if (input && input.value.trim()) {
                    setForm(f => ({ ...f, images: [...f.images, input.value.trim()] }));
                    input.value = "";
                  }
                }}
                className="px-4 py-2 border border-[#D0A511] text-[#D0A511] rounded-md hover:bg-[#D0A511]/5 text-sm font-semibold transition-colors"
              >
                Add URL
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200 group bg-gray-50 shadow-sm">
                  <img src={img} className="w-full h-full object-cover" alt="Gallery thumbnail" />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => multiFileRef.current?.click()}
                className="w-24 h-24 rounded-md border border-dashed border-gray-300 hover:border-[#D0A511] flex flex-col items-center justify-center text-gray-500 hover:text-[#D0A511] transition-colors text-xs gap-1 cursor-pointer bg-gray-50 hover:bg-[#D0A511]/5"
              >
                <Plus className="w-5 h-5" />
                <span>Upload</span>
              </button>
            </div>
            <input ref={multiFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUploadAdditional} />
          </div>

          <hr className="border-gray-100 my-2" />

          {/* Amenities checklist & custom input */}
          <div>
            <label className={labelCls}>Amenities Included</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
              {STANDARD_AMENITIES.map(amenity => (
                <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer p-2 border border-gray-100 rounded-md hover:bg-gray-50">
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
                    className="accent-[#D0A511] w-4 h-4"
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="text-xs font-semibold text-gray-600 block mb-2">Add Custom Amenity</label>
              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  id="custom-amenity-input"
                  placeholder="e.g. Starlight Headliner, Heated Seats"
                  className={inputCls}
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
                  className="px-4 py-2 border border-[#D0A511] text-[#D0A511] rounded-md hover:bg-[#D0A511]/5 text-sm font-semibold transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Selected Custom Amenities Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {form.amenities.filter(a => !STANDARD_AMENITIES.includes(a)).map(amenity => (
                  <span key={amenity} className="inline-flex items-center gap-1.5 bg-[#D0A511]/10 border border-[#D0A511]/20 text-[#D0A511] px-3 py-1 rounded-full text-xs font-medium">
                    {amenity}
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, amenities: f.amenities.filter(a => a !== amenity) }))}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
            <Link href="/admin/fleet" className="px-6 py-2.5 border border-gray-200 text-gray-600 text-xs uppercase tracking-widest font-bold rounded-md hover:bg-gray-50 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#D0A511] text-white text-xs uppercase tracking-widest font-bold rounded-md hover:brightness-110 transition-all disabled:opacity-60 shadow-md">
              {saving ? "Saving…" : (isEdit ? "Update Vehicle" : "Save Vehicle")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
