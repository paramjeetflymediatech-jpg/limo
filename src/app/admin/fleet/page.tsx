"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Car, Plus, Trash2, Pencil, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

type Vehicle = {
  id: string; name: string; category: string; image: string;
  description: string; price: string; passengers: number;
  luggage: number; available: boolean; imagesJson?: string;
  amenitiesJson?: string;
};

const PER_PAGE = 9;

export default function FleetPage() {
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/fleet")
      .then(r => r.json())
      .then(d => setFleet(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const toast = (type: "ok" | "err", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const toggleAvail = async (v: Vehicle) => {
    const res = await fetch(`/api/fleet/${v.id}`, { 
      method: "PUT", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ ...v, available: !v.available }) 
    });
    if (res.ok) { 
      const saved = await res.json(); 
      setFleet(f => f.map(x => x.id === v.id ? saved : x)); 
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    const res = await fetch(`/api/fleet/${id}`, { method: "DELETE" });
    if (res.ok) setFleet(f => f.filter(v => v.id !== id));
  };

  const totalPages = Math.max(1, Math.ceil(fleet.length / PER_PAGE));
  const paginated = fleet.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Toast */}
      {msg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded text-xs font-bold border shadow-xl ${msg.type === "ok" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {msg.type === "ok" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#D0A511]/10 border border-[#D0A511]/20 flex items-center justify-center">
          <Car className="w-5 h-5 text-[#D0A511]" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Fleet Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage your luxury vehicles and categories</p>
        </div>
        
        <Link 
          href="/admin/fleet/new" 
          className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-[#D0A511] text-white text-[11px] uppercase tracking-widest font-bold rounded-md hover:brightness-110 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#D0A511] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {fleet.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-gray-500 text-sm shadow-sm">
              No vehicles yet. <Link href="/admin/fleet/new" className="text-[#D0A511] font-medium hover:underline">Add one.</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map(v => (
                <div key={v.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden bg-gray-100 group">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className={`absolute top-3 right-3 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border ${v.available ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                      {v.available ? "Online" : "Offline"}
                    </span>
                  </div>
                  
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-[#D0A511] font-semibold">{v.category}</p>
                    <h3 className="font-serif font-bold text-gray-900 text-lg leading-tight">{v.name}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mt-1">{v.description}</p>
                    
                    <div className="flex gap-4 text-xs text-gray-600 mt-auto pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1 font-medium">👥 {v.passengers}</span>
                      <span className="flex items-center gap-1 font-medium">🧳 {v.luggage}</span>
                      <span className="ml-auto text-[#D0A511] font-bold text-sm">{v.price}</span>
                    </div>
                  </div>
                  
                  <div className="flex border-t border-gray-200 bg-gray-50">
                    <button onClick={() => toggleAvail(v)} className="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#D0A511] hover:bg-[#D0A511]/5 transition-all">
                      {v.available ? "Set Offline" : "Set Online"}
                    </button>
                    <Link href={`/admin/fleet/edit/${v.id}`} className="flex-1 flex items-center justify-center py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all border-x border-gray-200">
                      <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                    </Link>
                    <button onClick={() => deleteVehicle(v.id)} className="flex-1 py-3 flex items-center justify-center text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all">
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-500 mt-4 border-t border-gray-200 pt-4">
              <span>Page <span className="font-medium text-gray-900">{page}</span> of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 rounded-md border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
