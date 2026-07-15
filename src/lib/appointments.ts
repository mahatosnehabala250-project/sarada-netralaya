// Appointment helpers: reference generation, validation, time slots.

import { createHash } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { todayISTString } from "@/lib/ist";

export const DEPARTMENTS = ["eye_care", "optical"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const TIME_SLOTS = [
  "9:30 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "3:00 PM – 5:00 PM",
  "5:00 PM – 7:00 PM",
] as const;

export const STATUSES = ["pending", "confirmed", "done", "cancelled"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_META: Record<
  Status,
  { label: string; emoji: string; badge: string; dot: string }
> = {
  pending: {
    label: "Pending",
    emoji: "⏳",
    badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    emoji: "📌",
    badge: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900",
    dot: "bg-sky-500",
  },
  done: {
    label: "Done",
    emoji: "✅",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
    dot: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    emoji: "✕",
    badge: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
    dot: "bg-rose-500",
  },
};

export const DEPT_LABEL: Record<Department, string> = {
  eye_care: "Eye Care",
  optical: "Optical",
};

/** Zod schema for booking input (server + client shared). */
export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  age: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null || v === "") return null;
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) ? n : null;
    })
    .refine((v) => v === null || (v >= 0 && v <= 130), "Enter a valid age"),
  department: z.enum(DEPARTMENTS, {
    error: "Please choose a department",
  }),
  preferredDate: z
    .string()
    .min(1, "Please choose a preferred date")
    .refine((d) => {
      // no past dates (IST). d is yyyy-MM-dd
      return d >= todayISTString();
    }, "Please choose today or a future date"),
  timeSlot: z.string().refine((s) => TIME_SLOTS.includes(s as never), {
    error: "Please choose a time slot",
  }),
  note: z
    .string()
    .trim()
    .max(500, "Please keep the note under 500 characters")
    .optional()
    .transform((v) => (v ? v : null)),
  // honeypot — must be empty
  website: z
    .string()
    .max(0, "spam detected")
    .optional()
    .transform(() => undefined),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingParsed = z.output<typeof bookingSchema>;

/** Generate a unique 6-digit booking reference, retrying on rare collisions. */
export async function generateUniqueRef(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const ref = String(Math.floor(100000 + Math.random() * 900000));
    try {
      const exists = await db.appointment.findUnique({ where: { ref } });
      if (!exists) return ref;
    } catch {
      // Table may not exist yet (serverless cold start) — just return the ref
      return ref;
    }
  }
  // Fallback with timestamp suffix to guarantee uniqueness
  return String(Date.now()).slice(-6);
}

/* ------------------------------------------------------------------ */
/* Rate limiting                                                       */
/* ------------------------------------------------------------------ */
//
// NOTE: This is an in-memory limiter. On Vercel serverless, each function
// instance has its own counter, so the effective limit is higher in
// practice. For production-grade protection, back this with Upstash Redis
// or Vercel KV. The current implementation is defense-in-depth — it still
// significantly raises the cost of brute-force enumeration.

interface RateEntry {
  count: number;
  resetAt: number;
}

// Per-IP rate limit for booking creation.
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// Per-IP rate limit for the lookup endpoint (stricter — protects PHI).
const LOOKUP_RATE_LIMIT_MAX = 5;
const LOOKUP_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

// Per-ref lockout: after this many failed lookup attempts against a single
// ref, the ref is locked out (even with the correct phone) for the window.
// This protects targeted enumeration even if the attacker rotates IPs.
const REF_LOCKOUT_MAX_FAILURES = 5;
const REF_LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

interface RefLockEntry {
  failures: number;
  firstFailedAt: number;
  lockedUntil: number;
}

const rateMapInstance: Map<string, RateEntry> = new Map();
const refLockMap: Map<string, RefLockEntry> = new Map();

export function checkRateLimit(ipKey: string): {
  ok: boolean;
  retryAfterSec: number;
} {
  return checkRateLimitWith(ipKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
}

export function checkLookupRateLimit(ipKey: string): {
  ok: boolean;
  retryAfterSec: number;
} {
  return checkRateLimitWith(ipKey, LOOKUP_RATE_LIMIT_MAX, LOOKUP_RATE_LIMIT_WINDOW_MS);
}

function checkRateLimitWith(
  ipKey: string,
  max: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = rateMapInstance.get(ipKey);
  if (!entry || entry.resetAt < now) {
    rateMapInstance.set(ipKey, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  if (entry.count >= max) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  entry.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/**
 * Check whether a given booking ref is currently locked out due to too many
 * failed lookup attempts. Returns { locked, retryAfterSec }.
 */
export function checkRefLockout(ref: string): {
  locked: boolean;
  retryAfterSec: number;
} {
  const entry = refLockMap.get(ref);
  if (!entry) return { locked: false, retryAfterSec: 0 };
  const now = Date.now();
  if (entry.lockedUntil > now) {
    return {
      locked: true,
      retryAfterSec: Math.ceil((entry.lockedUntil - now) / 1000),
    };
  }
  // Window expired — reset.
  if (entry.firstFailedAt + REF_LOCKOUT_WINDOW_MS < now) {
    refLockMap.delete(ref);
  }
  return { locked: false, retryAfterSec: 0 };
}

/**
 * Record a failed lookup attempt against a ref. Locks the ref once the
 * threshold is hit.
 */
export function recordRefFailure(ref: string): void {
  const now = Date.now();
  let entry = refLockMap.get(ref);
  if (!entry || entry.firstFailedAt + REF_LOCKOUT_WINDOW_MS < now) {
    entry = {
      failures: 1,
      firstFailedAt: now,
      lockedUntil: 0,
    };
  } else {
    entry.failures += 1;
    if (entry.failures >= REF_LOCKOUT_MAX_FAILURES) {
      entry.lockedUntil = now + REF_LOCKOUT_WINDOW_MS;
    }
  }
  refLockMap.set(ref, entry);
}

/** Reset failures for a ref after a successful lookup. */
export function clearRefFailures(ref: string): void {
  refLockMap.delete(ref);
}

/** Hash an IP for storage (privacy). Uses a static salt — not for security. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`sn::${ip}`).digest("hex").slice(0, 16);
}
