"use client";

/**
 * 404 / not-found boundary. Branded, info-safe — never reveals routing
 * internals or available routes to attackers probing the URL space.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4" aria-hidden>
          👁️
        </div>
        <h1 className="text-3xl font-bold text-[#0a3d4a] mb-2">Page not found</h1>
        <p className="text-sm text-slate-600 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-2 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#10b981] hover:bg-[#059669] text-white px-5 py-2.5 text-sm font-bold min-h-[44px]"
          >
            Back to Home
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white text-[#0a3d4a] px-5 py-2.5 text-sm font-bold hover:bg-slate-50 min-h-[44px]"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
