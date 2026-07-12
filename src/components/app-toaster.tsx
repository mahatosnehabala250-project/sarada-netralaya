"use client";

import { useEffect, useState } from "react";
import { subscribe, dismiss, type ToastItem, type ToastType } from "@/lib/toast";

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
  loading: "⟳",
};

const STYLES: Record<ToastType, { bg: string; border: string; icon: string; iconBg: string }> = {
  success: {
    bg: "bg-white border-emerald-200",
    border: "border-l-emerald-500",
    icon: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  error: {
    bg: "bg-white border-rose-200",
    border: "border-l-rose-500",
    icon: "text-rose-600",
    iconBg: "bg-rose-100",
  },
  info: {
    bg: "bg-white border-sky-200",
    border: "border-l-sky-500",
    icon: "text-sky-600",
    iconBg: "bg-sky-100",
  },
  warning: {
    bg: "bg-white border-amber-200",
    border: "border-l-amber-500",
    icon: "text-amber-600",
    iconBg: "bg-amber-100",
  },
  loading: {
    bg: "bg-white border-slate-200",
    border: "border-l-slate-400",
    icon: "text-slate-500",
    iconBg: "bg-slate-100",
  },
};

export function AppToaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsub = subscribe(setToasts);
    return unsub;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const s = STYLES[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 w-full rounded-xl border ${s.bg} ${s.border} border-l-4 shadow-lg shadow-black/10 px-4 py-3 animate-[toast-in_0.25s_ease-out]`}
            role={t.type === "error" ? "alert" : "status"}
            aria-live={t.type === "error" ? "assertive" : "polite"}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${s.iconBg} ${s.icon} text-sm font-bold`}
            >
              {t.type === "loading" ? (
                <span className="block h-3.5 w-3.5 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
              ) : (
                ICONS[t.type]
              )}
            </span>
            <p className="flex-1 text-sm font-medium text-slate-800 leading-snug pt-0.5">
              {t.message}
            </p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Dismiss notification"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
