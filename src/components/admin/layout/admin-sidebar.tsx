"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CalendarDays, Users, BarChart3, Settings, ExternalLink,
  LogOut, Eye, Star, Search, Home,
} from "lucide-react";
import { SITE } from "@/lib/site-info";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
  { label: "Patients", href: "/admin/patients", icon: Users },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const LINK_ITEMS = [
  { label: "View Website", href: "/", icon: ExternalLink },
  { label: "Book Appointment", href: "/book", icon: CalendarDays },
  { label: "Gallery", href: "/gallery", icon: Eye },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "Track Appointment", href: "/track", icon: Search },
];

export function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <Image src="/images/logo.png" alt="Sarada Netralaya" width={36} height={24} className="shrink-0" />
          <div className="leading-none">
            <div className="text-sm font-bold text-[#374151]">Sarada Netralaya</div>
            <div className="text-[10px] text-slate-400 mt-0.5">We Care, We Cure</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main</div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#3b82f6] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6]"
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}

        <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Links</div>
        {LINK_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6] transition-colors"
          >
            <item.icon className="h-4 w-4 text-slate-400 group-hover:text-[#3b82f6]" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <div className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3b82f6] text-white text-xs font-bold">SN</span>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-sm font-semibold text-[#374151] truncate">Sarada Owner</div>
            <div className="text-[11px] text-slate-400 truncate">{SITE.domain}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );
}
