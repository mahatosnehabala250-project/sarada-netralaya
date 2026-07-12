"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, Lock, ArrowLeft, Loader2, Check, Shield, KeyRound, EyeOff,
  AlertCircle, User, Mail, Calendar, Bell, Building2, Phone, Clock,
  ChevronRight, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { SITE, ADDRESS, PHONES, EMAIL, HOURS } from "@/lib/site-info";

type Tab = "account" | "security" | "clinic";

export function AdminSettings() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("security");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const strength = passwordStrength(next);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!current || !next || !confirm) {
      toast.error("Please fill in all fields");
      return;
    }
    if (next.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (next !== confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (next === current) {
      toast.error("New password must be different from current");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to change password");
        return;
      }
      toast.success("Password changed successfully!");
      setCurrent(""); setNext(""); setConfirm("");
      setTimeout(() => router.push("/admin"), 1500);
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#063b4f] via-[#074860] to-[#0b6e8f] relative overflow-hidden">
      {/* ambient background */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-400/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#0ea5e9]/12 blur-[100px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "28px 28px" }} />

      {/* Top bar */}
      <header className="relative border-b border-white/10 backdrop-blur-sm bg-white/[0.03]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors group">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/15 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </span>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b6e8f] to-[#10b981] shadow-lg shadow-emerald-900/30">
              <Eye className="h-4.5 w-4.5 text-white" strokeWidth={2.3} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#063b4f]" />
            </span>
            <div className="leading-none">
              <div className="text-sm font-bold text-white">Sarada Netralaya</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-emerald-300/70 mt-0.5 font-semibold">Settings</div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-8 lg:py-10">
        {/* Page title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-[0.14em]">
            <Sparkles className="h-3.5 w-3.5" /> Configuration
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Owner Settings
          </h1>
          <p className="mt-2 text-sm text-white/55 max-w-xl">
            Manage your account security and view clinic information. All changes take effect immediately.
          </p>
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6">
          {/* Tab sidebar */}
          <aside className="lg:sticky lg:top-6 self-start">
            <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              <TabButton active={tab === "security"} onClick={() => setTab("security")} icon={Shield} label="Security" desc="Password & access" />
              <TabButton active={tab === "account"} onClick={() => setTab("account")} icon={User} label="Account" desc="Profile info" />
              <TabButton active={tab === "clinic"} onClick={() => setTab("clinic")} icon={Building2} label="Clinic" desc="Business details" />
            </nav>
          </aside>

          {/* Tab content */}
          <div className="min-w-0">
            {tab === "security" && (
              <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
                {/* Change password card */}
                <div className="rounded-2xl bg-white shadow-2xl shadow-black/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0b6e8f] to-[#084f67] px-6 py-4 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                      <KeyRound className="h-5 w-5 text-white" />
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-white">Change Password</h2>
                      <p className="text-[11px] text-white/70 mt-0.5">Keep your account secure with a strong password</p>
                    </div>
                  </div>

                  <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="current" className="text-sm font-semibold text-slate-700">
                        Current Password
                      </Label>
                      <div className="relative mt-1.5">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="current"
                          type={showCur ? "text" : "password"}
                          value={current}
                          onChange={(e) => setCurrent(e.target.value)}
                          placeholder="Enter current password"
                          className="h-11 pl-9 pr-10 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f] focus-visible:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCur((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b6e8f] transition-colors"
                          aria-label={showCur ? "Hide" : "Show"}
                        >
                          {showCur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new" className="text-sm font-semibold text-slate-700">
                        New Password
                      </Label>
                      <div className="relative mt-1.5">
                        <KeyRound className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="new"
                          type={showNew ? "text" : "password"}
                          value={next}
                          onChange={(e) => setNext(e.target.value)}
                          placeholder="At least 6 characters"
                          className="h-11 pl-9 pr-10 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f] focus-visible:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNew((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b6e8f] transition-colors"
                          aria-label={showNew ? "Hide" : "Show"}
                        >
                          {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {/* Strength meter */}
                      {next && (
                        <div className="mt-2.5">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                  i < strength.score ? strength.color : "bg-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                          <p className={`mt-1.5 text-[11px] font-medium ${strength.text}`}>
                            {strength.label}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirm" className="text-sm font-semibold text-slate-700">
                        Confirm New Password
                      </Label>
                      <div className="relative mt-1.5">
                        <Check className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="confirm"
                          type={showNew ? "text" : "password"}
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          placeholder="Re-enter new password"
                          className="h-11 pl-9 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f] focus-visible:bg-white"
                        />
                        {confirm && next === confirm && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                      {confirm && next !== confirm && (
                        <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-600">
                          <AlertCircle className="h-3 w-3" /> Passwords do not match
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={saving || !current || !next || !confirm || next !== confirm}
                      className="w-full h-11 bg-[#0b6e8f] hover:bg-[#084f67] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#0b6e8f]/20"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                        </>
                      ) : (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" /> Update Password
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="bg-amber-50 border-t border-amber-100 px-6 py-3.5 text-xs text-amber-800 flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>
                      <strong>Note:</strong> Password changes apply to this server. In production (Vercel), set <code className="font-mono bg-amber-100 px-1 rounded">OWNER_PASSWORD</code> in the Vercel dashboard.
                    </span>
                  </div>
                </div>

                {/* Security tips */}
                <div className="rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 p-5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-emerald-300" /> Security Tips
                  </h3>
                  <ul className="space-y-2 text-xs text-white/60">
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      Use at least 8 characters with a mix of letters, numbers, and symbols
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      Don't reuse passwords from other accounts
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      Your session expires after 7 days for security
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      Always log out from shared computers
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {tab === "account" && (
              <div className="rounded-2xl bg-white shadow-2xl shadow-black/20 overflow-hidden animate-[fadeIn_0.25s_ease-out]">
                <div className="bg-gradient-to-r from-[#0b6e8f] to-[#084f67] px-6 py-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <User className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-white">Account Information</h2>
                    <p className="text-[11px] text-white/70 mt-0.5">Your owner profile details</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <InfoRow icon={Mail} label="Email Address" value="owner@saradanetralaya.in" />
                  <InfoRow icon={Lock} label="Password" value="•••••••• (hidden)" />
                  <InfoRow icon={Calendar} label="Session Duration" value="7 days after login" />
                  <InfoRow icon={Shield} label="Role" value="Owner (full access)" />
                </div>
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-3.5 text-xs text-slate-500">
                  To change your email, update the <code className="font-mono bg-slate-200 px-1 rounded">OWNER_EMAIL</code> environment variable in Vercel.
                </div>
              </div>
            )}

            {tab === "clinic" && (
              <div className="rounded-2xl bg-white shadow-2xl shadow-black/20 overflow-hidden animate-[fadeIn_0.25s_ease-out]">
                <div className="bg-gradient-to-r from-[#0b6e8f] to-[#084f67] px-6 py-4 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                    <Building2 className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-white">Clinic Information</h2>
                    <p className="text-[11px] text-white/70 mt-0.5">Business details shown on the website</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <InfoRow icon={Building2} label="Clinic Name" value={SITE.name} />
                  <InfoRow icon={Phone} label="Primary Phone" value={PHONES.primary} />
                  <InfoRow icon={Phone} label="Secondary Phone" value={PHONES.secondary} />
                  <InfoRow icon={Mail} label="Email" value={EMAIL} />
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      <Building2 className="h-3.5 w-3.5" /> Address
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{ADDRESS.full}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      <Clock className="h-3.5 w-3.5" /> Opening Hours
                    </div>
                    <ul className="space-y-1">
                      {HOURS.map((h) => (
                        <li key={h.day} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 font-medium">{h.day}</span>
                          <span className={`font-semibold ${h.time === "Closed" ? "text-rose-500" : "text-[#084f67]"}`}>{h.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-slate-50 border-t border-slate-100 px-6 py-3.5 text-xs text-slate-500">
                  To update clinic info, edit <code className="font-mono bg-slate-200 px-1 rounded">src/lib/site-info.ts</code> in the codebase.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function TabButton({
  active, onClick, icon: Icon, label, desc,
}: { active: boolean; onClick: () => void; icon: typeof User; label: string; desc: string }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-left transition-all whitespace-nowrap ${
        active
          ? "bg-white/15 backdrop-blur-sm ring-1 ring-white/15 text-white"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
        active ? "bg-emerald-500/25 text-emerald-300" : "bg-white/5 text-white/50 group-hover:text-white"
      }`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="hidden lg:block">
        <div className="text-sm font-semibold leading-tight">{label}</div>
        <div className="text-[10px] text-white/40 mt-0.5">{desc}</div>
      </div>
      <span className="lg:hidden text-sm font-semibold">{label}</span>
      {active && <ChevronRight className="hidden lg:block h-4 w-4 ml-auto text-white/40" />}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0b6e8f]/10 text-[#0b6e8f]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
        <div className="text-sm font-semibold text-slate-800 truncate">{value}</div>
      </div>
    </div>
  );
}

function passwordStrength(pw: string): {
  score: number; label: string; color: string; text: string;
} {
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
