"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function logout() {
    try { await fetch("/api/admin/logout", { method: "POST" }); } catch {}
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Sidebar (desktop) — sticky */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen">
        <AdminSidebar onLogout={logout} />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 max-w-[80vw] flex flex-col bg-white border-r border-slate-200">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 text-slate-400 hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
            <AdminSidebar onLogout={logout} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-white border-b border-slate-200 px-4 h-14">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5 text-[#374151]" />
          </button>
          <span className="font-bold text-sm text-[#374151]">Sarada Netralaya</span>
          <div className="w-5" />
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
