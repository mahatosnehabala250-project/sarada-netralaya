"use client";

import { useEffect, useState } from "react";
import { Search, Phone, Loader2, Inbox, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { formatPhone, telHref } from "@/lib/utils";
import { formatDateLong } from "@/lib/ist";
import { AdminShell } from "@/components/admin/layout/admin-shell";

type Patient = {
  name: string; phone: string; age: number | null;
  totalAppointments: number; lastVisit: string; status: string;
  preferredDate: string; ref: string;
};

export function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/appointments?tab=all&take=1000", { cache: "no-store" });
        if (res.status === 401) { window.location.href = "/admin"; return; }
        const data = await res.json();
        // Group by phone
        const map = new Map<string, Patient>();
        for (const a of data.items || []) {
          if (map.has(a.phone)) {
            const p = map.get(a.phone)!;
            p.totalAppointments++;
            if (a.createdAt > p.lastVisit) { p.lastVisit = a.createdAt; p.preferredDate = a.preferredDate; p.status = a.status; p.ref = a.ref; }
          } else {
            map.set(a.phone, { name: a.name, phone: a.phone, age: a.age, totalAppointments: 1, lastVisit: a.createdAt, preferredDate: a.preferredDate, status: a.status, ref: a.ref });
          }
        }
        setPatients(Array.from(map.values()).sort((a, b) => b.lastVisit.localeCompare(a.lastVisit)));
      } catch { toast.error("Failed to load patients"); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = patients.filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.phone.includes(q));

  function exportCSV() {
    const header = "Name,Phone,Age,Total Appointments,Last Visit,Last Status\n";
    const rows = filtered.map(p => `"${p.name}","${p.phone}","${p.age ?? ""}","${p.totalAppointments}","${formatDateLong(p.preferredDate)}","${p.status}"`).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "patients.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Patients exported");
  }

  return (
    <AdminShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#374151]">Patients</h1>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} patients total</p>
        </div>
        <Button size="sm" onClick={exportCSV} className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
          <Download className="h-4 w-4 mr-1.5" /> Export CSV
        </Button>
      </div>

      <div className="relative max-w-xs mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone..." className="h-9 pl-9 border-slate-200" />
      </div>

      {loading ? (
        <div className="rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="divide-y divide-slate-100">{[0,1,2,3,4].map((i) => (<div key={i} className="flex items-center gap-4 px-4 py-4"><div className="h-10 w-10 rounded-full bg-slate-100" /><div className="flex-1 space-y-2"><div className="h-4 w-32 rounded bg-slate-100" /><div className="h-3 w-48 rounded bg-slate-50" /></div></div>))}</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl bg-white border border-slate-200 p-10 shadow-sm text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Inbox className="h-8 w-8" /></span>
          <h3 className="mt-4 text-lg font-bold text-[#374151]">No patients found</h3>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.phone} className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-[#3b82f6] font-bold text-sm">
                  {p.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#374151] truncate">{p.name}</div>
                  <a href={telHref(p.phone)} className="text-xs font-semibold text-[#3b82f6] hover:underline">{formatPhone(p.phone)}</a>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div><span className="text-slate-400">Age:</span> <span className="font-semibold text-[#374151]">{p.age ?? "—"}</span></div>
                <div><span className="text-slate-400">Visits:</span> <span className="font-semibold text-[#3b82f6]">{p.totalAppointments}</span></div>
              </div>
              <div className="mt-2 text-xs text-slate-500">Last: {formatDateLong(p.preferredDate)}</div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
