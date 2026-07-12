"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, Lock, ArrowLeft, Loader2, Check, Shield, KeyRound, EyeOff,
  AlertCircle, User, Mail, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";

export function AdminSettings() {
  const router = useRouter();
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
    <div className="min-h-screen bg-gradient-to-br from-[#063b4f] via-[#084f67] to-[#0b6e8f]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#10b981]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#0ea5e9]/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          {/* Brand */}
          <div className="text-center mb-8">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b6e8f] to-[#10b981] shadow-lg shadow-black/20">
              <Shield className="h-7 w-7 text-white" strokeWidth={2.3} />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-white">Owner Settings</h1>
            <p className="text-sm text-white/60">Manage your account security</p>
          </div>

          {/* Account info card */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-5 mb-5">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-300" /> Account Information
            </h2>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 text-white/50" />
                <span className="text-white/60">Email:</span>
                <span className="text-white font-medium">owner@saradanetralaya.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Lock className="h-4 w-4 text-white/50" />
                <span className="text-white/60">Password:</span>
                <span className="text-white font-medium">•••••••• (hidden)</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Calendar className="h-4 w-4 text-white/50" />
                <span className="text-white/60">Session:</span>
                <span className="text-white font-medium">7 days after login</span>
              </div>
            </div>
          </div>

          {/* Change password card */}
          <div className="rounded-2xl bg-white shadow-2xl shadow-black/20 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <KeyRound className="h-5 w-5 text-[#0b6e8f]" />
              <h2 className="text-lg font-bold text-[#084f67]">Change Password</h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Current password */}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b6e8f]"
                  >
                    {showCur ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New password */}
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b6e8f]"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength meter */}
                {next && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < strength.score ? strength.color : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`mt-1 text-[11px] font-medium ${strength.text}`}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm new password */}
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
                  <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-rose-600">
                    <AlertCircle className="h-3 w-3" /> Passwords do not match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={saving || !current || !next || !confirm || next !== confirm}
                className="w-full h-11 bg-[#0b6e8f] hover:bg-[#084f67] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="mt-5 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold mb-0.5">Note</p>
                <p>Changing the password here updates it for this server only. In production (Vercel), set the <code className="font-mono">OWNER_PASSWORD</code> environment variable in the Vercel dashboard instead.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Website
            </Link>
          </div>
        </div>
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
