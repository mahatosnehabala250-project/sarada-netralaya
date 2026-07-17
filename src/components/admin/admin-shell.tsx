"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3, CalendarDays, Users, FileText, Settings,
  ExternalLink, Eye, Headphones, LogOut, Menu, X as CloseIcon,
  RefreshCw, Bell,
} from "lucide-react";
import { PHONES } from "@/lib/site-info";

const NAV_ITEMS = [
  { href: "/admin", icon: BarChart3, label: "Dashboard", exact: true },
  { href: "/admin/appointments", icon: CalendarDays, label: "Appointments" },
  { href: "/admin/patients", icon: Users, label: "Patients" },
  { href: "/admin/reports", icon: FileText, label: "Reports" },
];

const SITE_LINKS = [
  { href: "/", icon: ExternalLink, label: "View Website" },
  { href: "/gallery", icon: Eye, label: "Gallery" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname.startsWith(href);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/appointments?tab=all&status=pending&department=all&doctor=all&q=", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (active && d?.kpis) setPendingCount(d.kpis.pending ?? 0); })
      .catch(() => {});
    return () => { active = false; };
  }, [pathname]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const logout = useCallback(async () => {
    try { await fetch("/api/admin/logout", { method: "POST" }); } catch {}
    router.refresh();
  }, [router]);

  const pageTitle = NAV_ITEMS.find((n) => isActive(pathname, n.href, n.exact))?.label
    ?? (pathname.startsWith("/admin/settings") ? "Settings" : "Admin");

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30">
        <SidebarInner pathname={pathname} onLogout={logout} />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 max-w-[80vw] flex flex-col bg-white border-r border-slate-200">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 z-10">
              <CloseIcon className="h-5 w-5" />
            </button>
            <SidebarInner pathname={pathname} onLogout={logout} />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        {/* Mobile topbar */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-slate-200 px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5 text-[#374151]" />
          </button>
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={28} height={19} />
            <span className="font-bold text-sm text-[#374151]">Sarada Netralaya</span>
          </div>
          <Link href="/admin/appointments?status=pending" className="relative" aria-label="Pending appointments">
            <Bell className="h-5 w-5 text-slate-500" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white">{pendingCount}</span>
            )}
          </Link>
        </header>

        {/* Desktop topbar */}
        <header className="hidden lg:flex sticky top-0 z-20 items-center gap-4 bg-white border-b border-slate-200 px-6 h-14">
          <div className="min-w-0">
            <h1 className="text-base font-bold text-[#374151] leading-tight">{pageTitle}</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Link href="/admin/appointments?status=pending" title="Pending appointments"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-[#3b82f6] hover:border-[#3b82f6] transition-colors">
              <Bell className="h-4 w-4" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white border-2 border-white">{pendingCount}</span>
              )}
            </Link>
            <div className="flex items-center gap-2 pl-1">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white text-xs font-bold">AU</span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-[#374151]">Admin User</div>
              </div>
              <button onClick={logout} title="Logout" className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarInner({ pathname, onLogout }: { pathname: string; onLogout: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-4 border-b border-slate-100">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image src="/images/logo.png" alt="Sarada Netralaya" width={38} height={26} className="shrink-0" />
          <div className="leading-none">
            <div className="text-sm font-bold text-[#374151]">Sarada Netralaya</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Owner Dashboard</div>
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Main</div>
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#3b82f6] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6]"
              }`}>
              <item.icon className={`h-[18px] w-[18px] ${active ? "" : "text-slate-400 group-hover:text-[#3b82f6]"}`} />
              {item.label}
            </Link>
          );
        })}

        <Link href="/admin/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            pathname.startsWith("/admin/settings")
              ? "bg-[#3b82f6] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6]"
          }`}>
          <Settings className={`h-[18px] w-[18px] ${pathname.startsWith("/admin/settings") ? "" : "text-slate-400"}`} />
          Settings
        </Link>

        <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Site</div>
        {SITE_LINKS.map((item) => (
          <a key={item.href} href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#3b82f6] transition-colors">
            <item.icon className="h-[18px] w-[18px] text-slate-400" />
            {item.label}
          </a>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <a href={`https://wa.me/${PHONES.whatsapp}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-xl bg-[#3b82f6]/5 border border-[#3b82f6]/10 px-3 py-2.5 hover:bg-[#3b82f6]/10 transition-colors">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6] text-white"><Headphones className="h-4 w-4" /></span>
          <div className="leading-tight min-w-0">
            <div className="text-[12px] font-bold text-[#374151]">Need Help?</div>
            <div className="text-[10px] text-slate-400">Get quick support</div>
          </div>
        </a>
        <button onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-100 transition-colors">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );
}
