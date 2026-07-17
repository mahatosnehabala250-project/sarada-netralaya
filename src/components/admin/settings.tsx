"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock, Loader2, Check, Shield, KeyRound, EyeOff, Eye,
  AlertCircle, User, Mail, Calendar, Building2, Phone, Clock,
  ChevronRight, IndianRupee, Save, Stethoscope, GraduationCap, Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { SITE, ADDRESS, PHONES, EMAIL, HOURS, DOCTORS } from "@/lib/site-info";

type Tab = "security" | "account" | "clinic" | "doctors" | "fees";
const VALID_TABS: Tab[] = ["security", "account", "clinic", "doctors", "fees"];

export function AdminSettings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = VALID_TABS.includes(searchParams.get("tab") as Tab)
    ? (searchParams.get("tab") as Tab)
    : "account";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feeSaving, setFeeSaving] = useState(false);

  // Per-department consultation fees (drive the dashboard revenue estimate)
  const [eyeCareFee, setEyeCareFee] = useState("500");
  const [opticalFee, setOpticalFee] = useState("300");
  const [feesLoading, setFeesLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/fees", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (active && d?.fees) {
          setEyeCareFee(String(d.fees.eye_care));
          setOpticalFee(String(d.fees.optical));
        }
      })
      .catch(() => {})
      .finally(() => { if (active) setFeesLoading(false); });
    return () => { active = false; };
  }, []);

  const strength = passwordStrength(next);

  function goTab(t: Tab) {
    setTab(t);
    router.replace(`/admin/settings?tab=${t}`, { scroll: false });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!current || !next || !confirm) { toast.error("Please fill in all fields"); return; }
    if (next.length < 12) { toast.error("New password must be at least 12 characters"); return; }
    if (next !== confirm) { toast.error("New passwords do not match"); return; }
    if (next === current) { toast.error("New password must be different from current"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to change password"); return; }
      toast.success("Password changed successfully!");
      setCurrent(""); setNext(""); setConfirm("");
      setTimeout(() => router.push("/admin"), 1500);
    } catch { toast.error("Network error"); }
    finally { setSaving(false); }
  }

  async function saveFees() {
    setFeeSaving(true);
    try {
      const res = await fetch("/api/admin/fees", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eye_care: Number(eyeCareFee) || 0, optical: Number(opticalFee) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Failed to save fees"); return; }
      setEyeCareFee(String(data.fees.eye_care));
      setOpticalFee(String(data.fees.optical));
      toast.success("Consultation fees saved!");
    } catch { toast.error("Network error"); }
    finally { setFeeSaving(false); }
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[#374151] mb-6">Owner Settings</h1>

        <div className="grid lg:grid-cols-[220px_1fr] gap-6">
          {/* Tab sidebar */}
          <aside className="lg:sticky lg:top-20 self-start">
            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              <TabButton active={tab === "account"} onClick={() => goTab("account")} icon={User} label="Account" desc="Profile info" />
              <TabButton active={tab === "security"} onClick={() => goTab("security")} icon={Shield} label="Security" desc="Password & access" />
              <TabButton active={tab === "doctors"} onClick={() => goTab("doctors")} icon={Stethoscope} label="Doctors" desc="Surgeons at the clinic" />
              <TabButton active={tab === "clinic"} onClick={() => goTab("clinic")} icon={Building2} label="Clinic" desc="Branches & hours" />
              <TabButton active={tab === "fees"} onClick={() => goTab("fees")} icon={IndianRupee} label="Fees" desc="Consultation charges" />
            </nav>
          </aside>

          {/* Tab content */}
          <div className="min-w-0">
            {tab === "security" && (
              <div className="space-y-5">
                <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-[#0047AB] px-6 py-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
                      <KeyRound className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-white">Change Password</h2>
                      <p className="text-[11px] text-white/70 mt-0.5">Keep your account secure with a strong password</p>
                    </div>
                  </div>

                  <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-[#374151]">Current Password</Label>
                      <div className="relative mt-1.5">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input type={showCur ? "text" : "password"} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password"
                          className="h-11 pl-9 pr-10 bg-slate-50 border-slate-200 focus-visible:border-[#0047AB] focus-visible:bg-white" />
                        <button type="button" onClick={() => setShowCur((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0047AB]">
                          {showCur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-[#374151]">New Password</Label>
                      <div className="relative mt-1.5">
                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input type={showNew ? "text" : "password"} value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 12 characters"
                          className="h-11 pl-9 pr-10 bg-slate-50 border-slate-200 focus-visible:border-[#0047AB] focus-visible:bg-white" />
                        <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0047AB]">
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {next && (
                        <div className="mt-2.5">
                          <div className="flex gap-1">{[0,1,2,3].map((i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < strength.score ? strength.color : "bg-slate-200"}`} />)}</div>
                          <p className={`mt-1.5 text-[11px] font-medium ${strength.text}`}>{strength.label}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-[#374151]">Confirm New Password</Label>
                      <div className="relative mt-1.5">
                        <Check className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input type={showNew ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password"
                          className="h-11 pl-9 bg-slate-50 border-slate-200 focus-visible:border-[#0047AB] focus-visible:bg-white" />
                        {confirm && next === confirm && <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />}
                      </div>
                      {confirm && next !== confirm && <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-600"><AlertCircle className="h-3 w-3" /> Passwords do not match</p>}
                    </div>

                    <Button type="submit" disabled={saving || !current || !next || !confirm || next !== confirm}
                      className="w-full h-11 bg-[#0047AB] hover:bg-[#003a8c] text-white font-semibold shadow-md shadow-[#0047AB]/20">
                      {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : <><KeyRound className="mr-2 h-4 w-4" /> Update Password</>}
                    </Button>
                  </form>

                  <div className="bg-amber-50 border-t border-amber-100 px-6 py-3.5 text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>Password changes apply to this server. In production, set <code className="font-mono bg-amber-100 px-1 rounded">OWNER_PASSWORD</code> in Vercel env vars.</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <h3 className="text-sm font-bold text-[#374151] flex items-center gap-2 mb-3"><Shield className="h-4 w-4 text-[#0047AB]" /> Security Tips</h3>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Use at least 12 characters with letters, numbers, and symbols</li>
                    <li className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Don't reuse passwords from other accounts</li>
                    <li className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Session expires after 7 days for security</li>
                    <li className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Always log out from shared computers</li>
                  </ul>
                </div>
              </div>
            )}

            {tab === "account" && (
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#0047AB] px-6 py-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15"><User className="h-5 w-5 text-white" /></span>
                  <div><h2 className="text-base font-bold text-white">Account Information</h2><p className="text-[11px] text-white/70 mt-0.5">Your owner profile details</p></div>
                </div>
                <div className="p-6 space-y-4">
                  <InfoRow icon={Mail} label="Email Address" value={EMAIL} />
                  <InfoRow icon={Lock} label="Password" value="•••••••• (hidden)" />
                  <InfoRow icon={Calendar} label="Session Duration" value="7 days after login" />
                  <InfoRow icon={Shield} label="Role" value="Owner (full access)" />
                </div>
              </div>
            )}

            {tab === "doctors" && (
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#0047AB] px-6 py-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15"><Stethoscope className="h-5 w-5 text-white" /></span>
                  <div><h2 className="text-base font-bold text-white">Doctors</h2><p className="text-[11px] text-white/70 mt-0.5">Surgeons currently at Sarada Netralaya</p></div>
                </div>
                <div className="p-6 space-y-4">
                  {DOCTORS.map((doc) => (
                    <div key={doc.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0047AB] text-white"><User className="h-5 w-5" /></span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-[#374151]">{doc.name}</div>
                          <div className="text-xs text-[#0047AB] font-semibold mt-0.5">{doc.role} · {doc.experience}</div>
                          <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-600">
                            <GraduationCap className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" /> {doc.qualifications}
                          </div>
                          <div className="mt-1 flex items-start gap-1.5 text-xs text-slate-500">
                            <Award className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" /> {doc.training}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {doc.expertise.map((e) => (
                              <span key={e} className="inline-flex items-center rounded-md bg-[#0047AB]/8 px-2 py-1 text-[11px] font-medium text-[#0047AB]">{e}</span>
                            ))}
                          </div>
                          <div className="mt-2 text-[11px] text-slate-400">{doc.surgeries} surgeries performed</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>To add, remove, or edit a doctor&apos;s profile shown here and on the public website, contact your developer — this list is currently managed in code for accuracy.</span>
                  </div>
                </div>
              </div>
            )}

            {tab === "clinic" && (
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#0047AB] px-6 py-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15"><Building2 className="h-5 w-5 text-white" /></span>
                  <div><h2 className="text-base font-bold text-white">Clinic Information</h2><p className="text-[11px] text-white/70 mt-0.5">Branches & business details</p></div>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Branches</div>
                    <div className="space-y-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-2 mb-1"><span className="flex h-6 w-6 items-center justify-center rounded bg-[#0047AB] text-white text-[10px] font-bold">1</span><span className="text-sm font-bold text-[#374151]">Baradwari (Main Branch)</span></div>
                        <p className="text-xs text-slate-600 ml-8">{ADDRESS.full}</p>
                        <div className="ml-8 mt-1 flex gap-3 text-xs"><a href={`tel:${PHONES.primaryTel}`} className="text-[#0047AB] font-semibold">{PHONES.primary}</a><a href={`tel:${PHONES.secondaryTel}`} className="text-[#0047AB] font-semibold">{PHONES.secondary}</a></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Opening Hours</div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
                      {HOURS.map((h) => (
                        <div key={h.day} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 font-medium">{h.day}</span>
                          <span className={`font-semibold ${h.time === "Closed" ? "text-rose-500" : "text-[#374151]"}`}>{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Contact</div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-slate-400" /><a href={`mailto:${EMAIL}`} className="text-[#0047AB] font-semibold break-all">{EMAIL}</a></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "fees" && (
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-[#0047AB] px-6 py-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15"><IndianRupee className="h-5 w-5 text-white" /></span>
                  <div><h2 className="text-base font-bold text-white">Consultation Fees</h2><p className="text-[11px] text-white/70 mt-0.5">Per-department fee · drives the dashboard revenue estimate</p></div>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-slate-600">Set the consultation fee for each department. The dashboard&apos;s <b>Est. Revenue (Month)</b> = completed visits this month × the fee for that department.</p>
                  {feesLoading ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm py-4"><Loader2 className="h-4 w-4 animate-spin" /> Loading current fees…</div>
                  ) : (
                    <>
                      <FeeRow label="Eye Care — Consultation Fee" value={eyeCareFee} onChange={setEyeCareFee} />
                      <FeeRow label="Optical — Consultation Fee" value={opticalFee} onChange={setOpticalFee} />
                    </>
                  )}
                  <div className="pt-2">
                    <Button onClick={saveFees} disabled={feeSaving || feesLoading}
                      className="bg-[#0047AB] hover:bg-[#003a8c] text-white font-semibold">
                      {feeSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Fees</>}
                    </Button>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-xs text-emerald-800 flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>Saved to your database — changes apply immediately across all devices. Revenue shown is an estimate based on completed consultations.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
    </>
  );
}

function TabButton({ active, onClick, icon: Icon, label, desc }: { active: boolean; onClick: () => void; icon: typeof User; label: string; desc: string }) {
  return (
    <button onClick={onClick}
      className={`group flex items-center gap-3 rounded-lg px-3.5 py-3 text-left transition-all whitespace-nowrap ${active ? "bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/20" : "text-slate-500 hover:text-[#0047AB] hover:bg-slate-50"}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-400 group-hover:text-[#0047AB]"}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="hidden lg:block"><div className="text-sm font-semibold leading-tight">{label}</div><div className="text-[10px] text-current opacity-60 mt-0.5">{desc}</div></div>
      <span className="lg:hidden text-sm font-semibold">{label}</span>
      {active && <ChevronRight className="hidden lg:block h-4 w-4 ml-auto opacity-40" />}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB]"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div><div className="text-sm font-semibold text-[#374151] truncate">{value}</div></div>
    </div>
  );
}

function FeeRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0047AB]/10 text-[#0047AB]"><IndianRupee className="h-4 w-4" /></span>
      <div className="flex-1 min-w-0">
        <Label className="text-sm font-semibold text-[#374151]">{label}</Label>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-slate-400 text-sm font-semibold">₹</span>
        <Input type="text" value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} inputMode="numeric"
          className="w-28 h-10 text-right bg-white border-slate-200 focus-visible:border-[#0047AB] font-semibold text-[#374151]" />
      </div>
    </div>
  );
}

function passwordStrength(pw: string): { score: number; label: string; color: string; text: string } {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: "Too short", color: "bg-rose-500", text: "text-rose-600" },
    { label: "Weak", color: "bg-rose-500", text: "text-rose-600" },
    { label: "Fair", color: "bg-amber-500", text: "text-amber-600" },
    { label: "Good", color: "bg-sky-500", text: "text-sky-600" },
    { label: "Strong", color: "bg-emerald-500", text: "text-emerald-600" },
  ];
  return { score, ...levels[score] };
}
