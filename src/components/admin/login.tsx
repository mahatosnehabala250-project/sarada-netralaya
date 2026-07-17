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
        setLoading(false);
        return;
      }
      toast.success("Welcome back! Loading dashboard...");
      window.location.href = "/admin";
    } catch {
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      {/* Top bar with logo */}
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-md px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/images/logo.png" alt="Sarada Netralaya" width={40} height={27} className="shrink-0" />
            <div className="leading-none">
              <span className="text-sm font-bold text-[#374151]">Sarada Netralaya</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Owner Dashboard</span>
            </div>
          </div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0047AB]">
            <ArrowLeft className="h-3.5 w-3.5" /> Website
          </Link>
        </div>
      </header>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-lg shadow-[#0047AB]/5 overflow-hidden">
            {/* Header */}
            <div className="bg-[#0047AB] px-6 py-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <Lock className="h-5 w-5 text-white" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">Secure Login</h2>
                  <p className="text-[11px] text-white/70 mt-0.5">Enter your credentials to continue</p>
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-[#374151]">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="email" type="email" autoComplete="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} placeholder="saradanetralayajsr@gmail.com"
                    className="h-11 pl-9 bg-slate-50 border-slate-200 focus-visible:border-[#0047AB] focus-visible:bg-white focus-visible:ring-[#0047AB]/20" />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-[#374151]">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input id="password" type={showPw ? "text" : "password"} autoComplete="current-password"
                    value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="h-11 pl-9 pr-10 bg-slate-50 border-slate-200 focus-visible:border-[#0047AB] focus-visible:bg-white focus-visible:ring-[#0047AB]/20" />
                  <button type="button" onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0047AB] transition-colors"
                    aria-label={showPw ? "Hide password" : "Show password"}>
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={loading}
                className="w-full h-11 bg-[#0047AB] hover:bg-[#003a8c] text-white font-semibold shadow-md shadow-[#0047AB]/20">
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
              </Button>
            </form>
          </div>

          {process.env.NODE_ENV !== "production" && (
            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs">
              <div className="flex items-center gap-1.5 text-[#0047AB] font-bold uppercase tracking-wider text-[10px] mb-1.5">
                <Lock className="h-3 w-3" /> Demo Credentials (Dev Only)
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div><span className="text-slate-400">Email:</span><br /><code className="text-[#0047AB] font-mono text-[11px]">owner@saradanetralaya.in</code></div>
                <div><span className="text-slate-400">Password:</span><br /><code className="text-[#0047AB] font-mono text-[11px]">Sarada@2026</code></div>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0047AB]">
              <ArrowLeft className="h-4 w-4" /> Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
