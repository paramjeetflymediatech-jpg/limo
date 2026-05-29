"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Globe,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings",  label: "Bookings",   icon: CalendarCheck   },
  { href: "/admin/fleet",     label: "Fleet",      icon: Car             },
  { href: "/admin/services",  label: "Services",   icon: MapPin          },
  { href: "/admin/seo",       label: "SEO Pages",  icon: Globe           },
  { href: "/admin/settings",  label: "Settings",   icon: Settings        },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({ open, onClose, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40 flex flex-col
          bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:shrink-0
        `}
      >
        {/* ── Brand ─────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D0A511]/10 border border-[#D0A511]/30 flex items-center justify-center shrink-0">
              <span className="text-[#D0A511] font-serif text-base font-bold">F</span>
            </div>
            <div>
              <p className="text-gray-900 font-serif font-bold text-sm leading-tight">FantasticLimo</p>
              <p className="text-[9px] uppercase tracking-widest text-[#D0A511]/70 mt-0.5">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Nav ───────────────────────────────── */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 px-3 mb-3 font-semibold">
            Navigation
          </p>

          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${active
                    ? "bg-[#D0A511]/10 text-[#D0A511]"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
              >
                {/* Active left bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#D0A511] rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active ? "text-[#D0A511]" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3 h-3 text-[#D0A511]/50" />}
              </Link>
            );
          })}
        </nav>

        {/* ── Logout ────────────────────────────── */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 group cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
