"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, ChevronRight, Eye, EyeOff, Lock, User } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [checked,     setChecked]     = useState(false);
  const [authed,      setAuthed]      = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ─── login state ───────────────────────────────────────────── */
  const [username,     setUsername]     = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginErr,     setLoginErr]     = useState("");
  const [logging,      setLogging]      = useState(false);

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
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, password }),
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

  /* ─── not yet checked ───────────────────────────────────────── */
  if (!checked) return null;

  /* ─── login screen ──────────────────────────────────────────── */
  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1920')",
          backgroundSize:     "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[220px] bg-luxury-gold/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md z-10">
          <div className="bg-white backdrop-blur-2xl border border-luxury-gold/25 rounded-2xl p-10 shadow-[0_0_80px_rgba(208,165,17,0.12)] flex flex-col gap-7">

            {/* Header */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 flex items-center justify-center shadow-[0_0_25px_rgba(208,165,17,0.2)]">
                <span className="text-luxury-gold font-serif text-3xl font-bold">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-white tracking-wide">FantasticLimo</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold/70 mt-1">Operator Terminal</p>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-luxury-gold/20" />
              <span className="text-[9px] uppercase tracking-widest text-gray-400">Secure Access</span>
              <div className="flex-1 h-px bg-luxury-gold/20" />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold/60" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className="w-full bg-white border border-luxury-gold/25 text-white pl-10 pr-4 py-3 text-sm rounded-lg focus:outline-none focus:border-luxury-gold/70 focus:shadow-[0_0_15px_rgba(208,165,17,0.15)] transition-all placeholder-gray-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxury-gold/60" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white border border-luxury-gold/25 text-white pl-10 pr-12 py-3 text-sm rounded-lg focus:outline-none focus:border-luxury-gold/70 focus:shadow-[0_0_15px_rgba(208,165,17,0.15)] transition-all placeholder-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {loginErr && (
                <p className="text-red-400 text-xs bg-red-950/30 border border-red-900/40 px-3 py-2 rounded-lg">
                  {loginErr}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={logging}
                className="w-full bg-luxury-gold text-white font-bold uppercase text-xs tracking-widest py-3.5 rounded-lg hover:brightness-125 hover:shadow-[0_0_30px_rgba(208,165,17,0.5)] shadow-[0_0_15px_rgba(208,165,17,0.25)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {logging ? "Authenticating…" : "Enter Terminal"}
              </button>
            </form>

            <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
              FantasticLimo · Admin Portal
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── admin shell ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">

      {/* Sidebar (separate component) */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-gray-400 hover:text-gray-700 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <span className="text-gray-400">Admin</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-700 font-medium capitalize">
                {pathname.split("/").filter(Boolean).pop() || "Dashboard"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live pulse */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
            <div className="w-px h-4 bg-gray-200" />
            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#D0A511]/15 border border-[#D0A511]/30 flex items-center justify-center">
                <span className="text-[#D0A511] text-xs font-bold uppercase">
                  {(sessionStorage.getItem("adminUsername") || "A")[0]}
                </span>
              </div>
              <span className="text-xs text-gray-500 hidden sm:block">
                {sessionStorage.getItem("adminUsername") || "admin"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
