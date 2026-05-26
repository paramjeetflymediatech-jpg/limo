"use client";

import React, { useState } from "react";
import { Settings, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

const inputCls = "w-full bg-matte-black/60 border border-luxury-gold/15 text-white rounded px-3 py-2.5 text-sm focus:outline-none focus:border-luxury-gold/40";
const labelCls = "text-[10px] uppercase tracking-widest text-gray-400 block mb-1";

export default function SettingsPage() {
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showPw,     setShowPw]     = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [msg,        setMsg]        = useState<{ type:"ok"|"err"; text:string }|null>(null);

  const username = typeof window !== "undefined"
    ? sessionStorage.getItem("adminUsername") || "admin"
    : "admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setMsg({ type: "err", text: "New passwords do not match." }); return; }
    if (newPw.length < 6)    { setMsg({ type: "err", text: "New password must be at least 6 characters." }); return; }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, currentPassword: currentPw, newPassword: newPw }),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setMsg({ type: "ok", text: "Password updated successfully." });
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      } else {
        setMsg({ type: "err", text: d.error || "Failed to update password." });
      }
    } catch {
      setMsg({ type: "err", text: "Network error. Please try again." });
    } finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Settings className="w-5 h-5 text-luxury-gold" />
        <h1 className="text-2xl font-serif font-bold text-white">Settings</h1>
      </div>

      {/* Account info */}
      <div className="glass-panel rounded-xl border border-luxury-gold/10 p-6 flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-widest text-luxury-gold">Operator Account</p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 flex items-center justify-center">
            <span className="text-luxury-gold font-serif font-bold text-base uppercase">{username[0]}</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{username}</p>
            <p className="text-[10px] text-gray-500">Administrator</p>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="glass-panel rounded-xl border border-luxury-gold/10 p-6 flex flex-col gap-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-luxury-gold mb-0.5">Security</p>
          <h2 className="text-white font-serif font-bold">Change Password</h2>
          <p className="text-gray-500 text-xs mt-1">Passwords are stored as SHA-256 hashes in the database.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} className={inputCls} value={currentPw} onChange={e => setCurrentPw(e.target.value)} required placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 cursor-pointer">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className={labelCls}>New Password</label>
            <input type={showPw ? "text" : "password"} className={inputCls} value={newPw} onChange={e => setNewPw(e.target.value)} required placeholder="Min. 6 characters" />
          </div>

          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input type={showPw ? "text" : "password"} className={inputCls} value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required placeholder="Re-enter new password" />
          </div>

          {msg && (
            <div className={`flex items-center gap-2 text-xs px-3 py-2.5 rounded border ${msg.type === "ok" ? "bg-green-950/30 border-green-900/30 text-green-400" : "bg-red-950/30 border-red-900/30 text-red-400"}`}>
              {msg.type === "ok" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {msg.text}
            </div>
          )}

          <button type="submit" disabled={saving} className="w-full py-3 bg-luxury-gold text-matte-black text-xs uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all cursor-pointer disabled:opacity-60 mt-1">
            {saving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
