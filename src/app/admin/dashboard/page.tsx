"use client";

import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, CalendarCheck, Car, MapPin, Globe,
  Clock, AlertCircle, CheckCircle2, DollarSign, TrendingUp,
} from "lucide-react";

type Booking  = { id: string; name: string; status: string; vehicle: string; dateTime: string; pickup: string; dropoff: string; };
type Fleet    = { id: string; name: string; available: boolean; };
type Service  = { id: number; name: string; available: boolean; };

const STATUS_COLORS: Record<string, string> = {
  Pending:   "text-yellow-400 bg-yellow-950/30 border-yellow-900/40",
  Confirmed: "text-blue-400  bg-blue-950/30  border-blue-900/40",
  Completed: "text-green-400 bg-green-950/30 border-green-900/40",
  Cancelled: "text-red-400   bg-red-950/30   border-red-900/40",
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fleet,    setFleet]    = useState<Fleet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/bookings").then(r => r.json()),
      fetch("/api/fleet").then(r => r.json()),
      fetch("/api/services").then(r => r.json()),
    ]).then(([b, f, s]) => {
      setBookings(Array.isArray(b) ? b : []);
      setFleet(Array.isArray(f) ? f : []);
      setServices(Array.isArray(s) ? s : []);
    }).finally(() => setLoading(false));
  }, []);

  const pending       = bookings.filter(b => b.status === "Pending").length;
  const confirmed     = bookings.filter(b => b.status === "Confirmed").length;
  const activeFleet   = fleet.filter(f => f.available).length;
  const activeServices= services.filter(s => s.available).length;

  const kpis = [
    { label: "Total Bookings",    value: bookings.length, icon: CalendarCheck, color: "text-luxury-gold" },
    { label: "Pending Review",    value: pending,          icon: AlertCircle,   color: "text-yellow-400" },
    { label: "Active Fleet",      value: `${activeFleet}/${fleet.length}`, icon: Car, color: "text-blue-400" },
    { label: "Active Services",   value: activeServices,   icon: MapPin,        color: "text-green-400" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Page heading */}
      <div className="flex items-center gap-3">
        <LayoutDashboard className="w-5 h-5 text-luxury-gold" />
        <h1 className="text-2xl font-serif font-bold text-white">Dashboard</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {kpis.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass-panel rounded-xl p-6 border border-luxury-gold/10 flex flex-col gap-3">
                <Icon className={`w-5 h-5 ${color}`} />
                <div>
                  <p className="text-3xl font-bold font-serif text-white">{value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 mt-1">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent bookings */}
          <div className="glass-panel rounded-xl border border-luxury-gold/10 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-luxury-gold/10">
              <CalendarCheck className="w-4 h-4 text-luxury-gold" />
              <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Recent Bookings</h2>
            </div>

            {bookings.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">No bookings yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 uppercase tracking-widest border-b border-luxury-gold/10">
                      <th className="text-left px-6 py-3">ID</th>
                      <th className="text-left px-6 py-3">Client</th>
                      <th className="text-left px-6 py-3 hidden md:table-cell">Vehicle</th>
                      <th className="text-left px-6 py-3 hidden lg:table-cell">Date</th>
                      <th className="text-left px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 10).map(b => (
                      <tr key={b.id} className="border-b border-luxury-gold/5 hover:bg-white/2 transition-colors">
                        <td className="px-6 py-3 font-mono text-luxury-gold">{b.id}</td>
                        <td className="px-6 py-3 text-white">{b.name}</td>
                        <td className="px-6 py-3 text-gray-400 hidden md:table-cell">{b.vehicle}</td>
                        <td className="px-6 py-3 text-gray-400 hidden lg:table-cell">{b.dateTime}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${STATUS_COLORS[b.status] ?? ""}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Fleet quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Fleet */}
            <div className="glass-panel rounded-xl border border-luxury-gold/10 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-luxury-gold">
                <Car className="w-4 h-4" />
                <h2 className="text-xs uppercase tracking-widest font-semibold">Fleet Status</h2>
              </div>
              {fleet.length === 0 ? (
                <p className="text-gray-500 text-sm">No vehicles registered.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {fleet.slice(0, 6).map(v => (
                    <div key={v.id} className="flex items-center justify-between">
                      <span className="text-gray-300 text-xs">{v.name}</span>
                      <span className={`text-[10px] uppercase font-bold ${v.available ? "text-green-400" : "text-red-400"}`}>
                        {v.available ? "Online" : "Offline"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Services */}
            <div className="glass-panel rounded-xl border border-luxury-gold/10 p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-luxury-gold">
                <MapPin className="w-4 h-4" />
                <h2 className="text-xs uppercase tracking-widest font-semibold">Services</h2>
              </div>
              {services.length === 0 ? (
                <p className="text-gray-500 text-sm">No services registered.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {services.slice(0, 6).map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <span className="text-gray-300 text-xs">{s.name}</span>
                      <span className={`text-[10px] uppercase font-bold ${s.available ? "text-green-400" : "text-red-400"}`}>
                        {s.available ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
