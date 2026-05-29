"use client";

import React, { useEffect, useState } from "react";
import { CalendarCheck, AlertCircle, CheckCircle2, Trash2, Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";

type Booking = {
  id: string; name: string; email: string; phone: string;
  pickup: string; dropoff: string; dateTime: string;
  vehicle: string; passengers: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  Pending: "text-yellow-400 bg-yellow-950/30 border-yellow-900/40",
  Confirmed: "text-blue-400  bg-blue-950/30  border-blue-900/40",
  Completed: "text-green-400 bg-green-950/30 border-green-900/40",
  Cancelled: "text-red-400   bg-red-950/30   border-red-900/40",
};

const PER_PAGE = 15;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.json())
      .then(d => setBookings(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as Booking["status"] } : b));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as Booking["status"] } : null);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm(`Delete booking ${id}?`)) return;
    const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBookings(prev => prev.filter(b => b.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  const filtered = bookings.filter(b => {
    const matchFilter = filter === "All" || b.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.id.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const inputCls = "bg-matte-black/60 border border-luxury-gold/15 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-luxury-gold/40";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <CalendarCheck className="w-5 h-5 text-luxury-gold" />
        <h1 className="text-2xl font-serif font-bold text-white">Bookings</h1>
        <span className="ml-auto text-xs text-gray-500">{bookings.length} total</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input
            className={`${inputCls} pl-8 w-full`}
            placeholder="Search ID, client, email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-3 py-2 rounded text-[10px] uppercase tracking-widest font-bold border transition-all cursor-pointer ${filter === s
                ? "bg-luxury-gold text-matte-black border-luxury-gold"
                : "border-luxury-gold/20 text-gray-400 hover:border-luxury-gold/40"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="glass-panel rounded-xl border border-luxury-gold/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 uppercase tracking-widest border-b border-luxury-gold/10">
                    <th className="text-left px-5 py-3">ID</th>
                    <th className="text-left px-5 py-3">Client</th>
                    <th className="text-left px-5 py-3 hidden sm:table-cell">Vehicle</th>
                    <th className="text-left px-5 py-3 hidden lg:table-cell">Date & Time</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500">No bookings found.</td>
                    </tr>
                  )}
                  {paginated.map(b => (
                    <tr key={b.id} className="border-b border-luxury-gold/5 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3 font-mono text-luxury-gold">{b.id}</td>
                      <td className="px-5 py-3 text-white">{b.name}</td>
                      <td className="px-5 py-3 text-gray-400 hidden sm:table-cell">{b.vehicle}</td>
                      <td className="px-5 py-3 text-gray-400 hidden lg:table-cell">{b.dateTime}</td>
                      <td className="px-5 py-3">
                        <select
                          value={b.status}
                          onChange={e => updateStatus(b.id, e.target.value)}
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border bg-transparent cursor-pointer ${STATUS_COLORS[b.status] ?? ""}`}
                        >
                          {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => (
                            <option key={s} value={s} className="bg-matte-black text-white">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 flex items-center gap-2">
                        <button onClick={() => setSelected(b)} className="text-gray-400 hover:text-luxury-gold transition-colors cursor-pointer" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteBooking(b.id)} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded border border-luxury-gold/20 disabled:opacity-30 hover:border-luxury-gold/50 cursor-pointer">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded border border-luxury-gold/20 disabled:opacity-30 hover:border-luxury-gold/50 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="glass-panel border border-luxury-gold/20 rounded-2xl p-8 w-full max-w-lg flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-white">Booking {selected.id}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${STATUS_COLORS[selected.status] ?? ""}`}>
                {selected.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              {[
                ["Client", selected.name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Vehicle", selected.vehicle],
                ["Passengers", selected.passengers],
                ["Date/Time", selected.dateTime],
                ["Pickup", selected.pickup],
                ["Dropoff", selected.dropoff],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-gray-500 text-[10px] uppercase tracking-widest">{l}</p>
                  <p className="text-white mt-0.5">{v || "—"}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 border-t border-luxury-gold/10 pt-4">
              {["Confirmed", "Completed", "Cancelled"].map(s => (
                <button key={s} onClick={() => updateStatus(selected.id, s)}
                  className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold border border-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold/10 rounded transition-all cursor-pointer">
                  Mark {s}
                </button>
              ))}
              <button onClick={() => setSelected(null)}
                className="px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold bg-luxury-gold text-matte-black rounded hover:brightness-110 cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
