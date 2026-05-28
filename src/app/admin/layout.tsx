"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Globe,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings",  label: "Bookings",  icon: CalendarCheck },
  { href: "/admin/fleet",     label: "Fleet",     icon: Car },
  { href: "/admin/services",  label: "Services",  icon: MapPin },
  { href: "/admin/seo",       label: "SEO Pages", icon: Globe },
  { href: "/admin/settings",  label: "Settings",  icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [checked,    setChecked]    = useState(false);
  const [authed,     setAuthed]     = useState(false);
  const [sidebarOpen,setSidebarOpen]= useState(false);

  /* ─── login state ───────────────────────────────────────────────── */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [logging,  setLogging]  = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("adminAuth");
    if (stored === "true") setAuthed(true);
    setChecked(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLogging(true);
    setLoginErr("");
    try {
      const res  = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("adminAuth",     "true");
        sessionStorage.setItem("adminUsername", data.username);
        setAuthed(true);
      } else {
        setLoginErr(data.error || "Authentication failed");
      }
    } catch {
      setLoginErr("Network error – please try again");
    } finally {
      setLogging(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminUsername");
    setAuthed(false);
    router.push("/admin/dashboard");
  };

  /* ─── not yet checked ────────────────────────────────────────────── */
  if (!checked) return null;

  /* ─── login screen ───────────────────────────────────────────────── */
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-matte-black px-4">
        <div className="glass-panel border border-luxury-gold/20 rounded-2xl p-10 w-full max-w-sm flex flex-col gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="w-14 h-14 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
              <span className="text-luxury-gold font-serif text-2xl font-bold">F</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-white tracking-wide">FantasticLimo</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">Operator Terminal</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full bg-matte-black/80 border border-luxury-gold/20 text-white px-3 py-2.5 text-sm rounded focus:outline-none focus:border-luxury-gold/50"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-matte-black/80 border border-luxury-gold/20 text-white px-3 py-2.5 text-sm rounded focus:outline-none focus:border-luxury-gold/50"
              />
            </div>

            {loginErr && (
              <p className="text-red-400 text-xs bg-red-950/20 border border-red-900/30 px-3 py-2 rounded">
                {loginErr}
              </p>
            )}

            <button
              type="submit"
              disabled={logging}
              className="w-full bg-luxury-gold text-matte-black font-bold uppercase text-xs tracking-widest py-3 rounded hover:brightness-110 transition-all disabled:opacity-60 cursor-pointer"
            >
              {logging ? "Authenticating…" : "Enter Terminal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ─── admin shell ────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex bg-matte-black text-white">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40
          bg-[#0d0d0d] border-r border-luxury-gold/10
          flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-luxury-gold/10">
          <div className="w-9 h-9 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center shrink-0">
            <span className="text-luxury-gold font-serif text-base font-bold">F</span>
          </div>
          <div>
            <p className="text-white font-serif font-bold text-sm leading-tight">FantasticLimo</p>
            <p className="text-[9px] uppercase tracking-widest text-luxury-gold/60">Admin Panel</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
                  ${active
                    ? "bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-luxury-gold" : "text-gray-500 group-hover:text-gray-300"}`} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-luxury-gold/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-900/30 text-red-400 hover:bg-red-950/20 text-xs uppercase tracking-widest font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Lock Terminal
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-luxury-gold/10 bg-[#0d0d0d] sticky top-0 z-20">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 ml-auto">
            <div className="w-7 h-7 rounded-full bg-luxury-gold/20 border border-luxury-gold/30 flex items-center justify-center">
              <span className="text-luxury-gold text-xs font-bold uppercase">
                {(sessionStorage.getItem("adminUsername") || "A")[0]}
              </span>
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">
              {sessionStorage.getItem("adminUsername") || "admin"}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto ">
          {children}
        </main>
      </div>
    </div>
  );
}
