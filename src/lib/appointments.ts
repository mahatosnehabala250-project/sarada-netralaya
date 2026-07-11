// Appointment helpers: reference generation, validation, time slots.

import { createHash } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { todayISTString } from "@/lib/ist";

export const DEPARTMENTS = ["eye_care", "optical"] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const TIME_SLOTS = [
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "3:00 PM – 5:00 PM",
  "5:00 PM – 7:30 PM",
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
    const exists = await db.appointment.findUnique({ where: { ref } });
    if (!exists) return ref;
  }
  // Fallback with timestamp suffix to guarantee uniqueness
  return String(Date.now()).slice(-6);
}

/** In-memory IP rate limiter: max N bookings per IP per window. */
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function checkRateLimit(ipKey: string): {
  ok: boolean;
  retryAfterSec: number;
} {
  const now = Date.now();
  const entry = rateMap.get(ipKey);
  if (!entry || entry.resetAt < now) {
    rateMap.set(ipKey, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  entry.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** Hash an IP for storage (privacy). Uses a static salt — not for security. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`sn::${ip}`).digest("hex").slice(0, 16);
}
