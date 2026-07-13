"use client";

/**
 * Route-level error boundary. Catches errors thrown by any route segment
 * (server or client component) and renders a branded, info-safe error UI
 * inside the default app shell.
 *
 * SECURITY: error details (message, stack) are logged server-side only.
 * The user sees a generic message + the error digest (which is safe to
 * share with support — it's a hash, not the raw error).
 */

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side log only — never expose to the client.
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl mb-4" aria-hidden>
          ⚠️
        </div>
        <h1 className="text-2xl font-bold text-[#0a3d4a] mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          An unexpected error occurred while loading this page. Please try
          again. If the problem persists, call us at{" "}
          <a
            href="tel:+917091090014"
            className="text-[#0b6e8f] font-semibold hover:underline"
          >
            +91 70910 90014
          </a>
          .
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-xl bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 text-sm font-bold min-h-[44px]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0a3d4a] px-5 py-2.5 text-sm font-bold hover:bg-slate-50 min-h-[44px]"
          >
            Back to Home
          </Link>
        </div>
        {error.digest && (
          <p className="mt-6 text-[11px] text-slate-400 font-mono">
            Reference: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
