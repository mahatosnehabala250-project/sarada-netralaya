"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogIn, Loader2, ArrowLeft, Lock, Mail, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";
import { SITE } from "@/lib/site-info";

export function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Login failed");
        return;
      }
      toast.success("Welcome back! Loading dashboard...");
      // Hard navigation is more reliable than router.refresh() for
      // cookie-based session changes — guarantees the new cookie is sent.
      window.location.href = "/admin";
    } catch {
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
    // Note: setLoading(false) intentionally omitted on success — the page
    // will navigate away, so the spinner stays visible until redirect.
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#052f3f] via-[#074860] to-[#0b6e8f]">
      {/* decorative */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-400/15 blur-[100px]" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#0ea5e9]/12 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <Image src="/images/logo.png" alt="Sarada Netralaya" width={72} height={48} className="shrink-0" />
            <h1 className="mt-5 text-2xl font-bold text-white tracking-tight">Sarada Netralaya</h1>
            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Owner Dashboard · Secure Access
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white shadow-2xl shadow-black/30 overflow-hidden ring-1 ring-black/5">
            {/* gradient header strip */}
            <div className="bg-gradient-to-r from-[#0b6e8f] to-[#084f67] px-6 py-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                <Lock className="h-5 w-5 text-white" />
              </span>
              <div>
                <h2 className="text-base font-bold text-white">Secure Login</h2>
                <p className="text-[11px] text-white/70 mt-0.5">Enter your credentials to continue</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                  Email
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@saradanetralaya.in"
                    className="h-11 pl-9 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f] focus-visible:bg-white focus-visible:ring-[#0b6e8f]/25"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pl-9 pr-10 bg-slate-50 border-slate-200 focus-visible:border-[#0b6e8f] focus-visible:bg-white focus-visible:ring-[#0b6e8f]/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0b6e8f] transition-colors"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#0b6e8f] hover:bg-[#084f67] text-white font-semibold shadow-md shadow-[#0b6e8f]/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Demo creds — only shown in development, never in production */}
          {process.env.NODE_ENV !== "production" && (
            <div className="mt-4 rounded-xl bg-white/[0.06] backdrop-blur-sm border border-white/10 p-3.5 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold uppercase tracking-wider text-[10px] mb-1.5">
                <Lock className="h-3 w-3" /> Demo Credentials (Dev Only)
              </div>
              <div className="grid grid-cols-2 gap-2 text-white/70">
                <div>
                  <span className="text-white/40">Email:</span>
                  <br />
                  <code className="text-emerald-300 font-mono text-[11px]">owner@saradanetralaya.in</code>
                </div>
                <div>
                  <span className="text-white/40">Password:</span>
                  <br />
                  <code className="text-emerald-300 font-mono text-[11px]">Sarada@2026</code>
                </div>
              </div>
              <p className="mt-2 text-[10px] text-white/35">Set OWNER_EMAIL / OWNER_PASSWORD in production via Vercel env vars.</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
