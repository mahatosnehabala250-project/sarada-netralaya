"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, LogIn, Loader2, ArrowLeft, Lock, Mail, EyeOff } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#063b4f] via-[#084f67] to-[#0b6e8f]">
      {/* decorative */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#10b981]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#0ea5e9]/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="text-center mb-8">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0b6e8f] to-[#10b981] shadow-lg shadow-black/20">
              <Eye className="h-7 w-7 text-white" strokeWidth={2.3} />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-white">Sarada Netralaya</h1>
            <p className="text-sm text-white/60">Owner Dashboard · Sign in</p>
          </div>

          {/* Card */}
          <div className="rounded-2xl bg-white shadow-2xl shadow-black/20 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="h-4 w-4 text-[#0b6e8f]" />
              <h2 className="text-lg font-bold text-[#084f67]">Secure Login</h2>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-[#084f67]">
                  Email
                </Label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0b6e8f]/50" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@saradanetralaya.in"
                    className="h-11 pl-9 border-[#0b6e8f]/20 focus-visible:ring-[#0b6e8f]/30 focus-visible:border-[#0b6e8f]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-semibold text-[#084f67]">
                  Password
                </Label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0b6e8f]/50" />
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pl-9 pr-10 border-[#0b6e8f]/20 focus-visible:ring-[#0b6e8f]/30 focus-visible:border-[#0b6e8f]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0b6e8f]/50 hover:text-[#0b6e8f]"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#0b6e8f] hover:bg-[#084f67] text-white font-semibold"
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

            <div className="mt-5 rounded-lg bg-[#0b6e8f]/5 border border-[#0b6e8f]/10 p-3 text-xs text-[#0f2f3a]/60">
              <p className="font-semibold text-[#084f67] mb-0.5">Demo credentials</p>
              <p>Email: <code className="text-[#0b6e8f]">owner@saradanetralaya.in</code></p>
              <p>Password: <code className="text-[#0b6e8f]">Sarada@2026</code></p>
              <p className="mt-1 text-[10px] text-[#0f2f3a]/45">Set OWNER_EMAIL / OWNER_PASSWORD in production.</p>
            </div>
          </div>

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
