import "server-only";

import { createHash, randomInt } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { addDaysIST, isValidISTDate, todayISTString } from "@/lib/ist";
import {
  DOCTOR_IDS,
  TIME_SLOTS,
} from "@/lib/appointment-shared";

export * from "@/lib/appointment-shared";

const MAX_BOOKING_DAYS_AHEAD = 180;

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "Name is too long"),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  age: z.union([z.string(), z.number()]).optional().transform((value, ctx) => {
    if (value === undefined || value === "") return null;
    const age = Number(value);
    if (!Number.isInteger(age) || age < 0 || age > 130) {
      ctx.addIssue({ code: "custom", message: "Enter a valid whole-number age" });
      return z.NEVER;
    }
    return age;
  }),
  doctor: z.enum(DOCTOR_IDS, { error: "Please choose a doctor" }),
  preferredDate: z.string().refine((date) => {
    if (!isValidISTDate(date)) return false;
    return date >= todayISTString() && date <= addDaysIST(MAX_BOOKING_DAYS_AHEAD);
  }, `Choose a valid date within the next ${MAX_BOOKING_DAYS_AHEAD} days`),
  timeSlot: z.string().refine((slot) => TIME_SLOTS.includes(slot as never), {
    error: "Please choose a time slot",
  }),
  note: z.string().trim().max(500, "Please keep the note under 500 characters")
    .optional().transform((value) => value || null),
  website: z.string().max(0, "spam detected").optional().transform(() => undefined),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingParsed = z.output<typeof bookingSchema>;

export function generateBookingRef(): string {
  return String(randomInt(10_000_000, 100_000_000));
}

/** Generate a unique 8-digit booking reference, retrying on rare collisions. */
export async function generateUniqueRef(): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const ref = generateBookingRef();
    const exists = await db.appointment.findUnique({
      where: { ref },
      select: { id: true },
    });
    if (!exists) return ref;
  }
  // Practically unreachable (90M keyspace); timestamp tail guarantees progress.
  return String(Date.now()).slice(-8);
}

/**
 * Stable hash of the booking's identifying fields — used to absorb
 * double-submits that arrive without an idempotency key.
 */
export function computeRequestHash(d: {
  name: string;
  phone: string;
  doctor: string;
  preferredDate: string;
  timeSlot: string;
}): string {
  return createHash("sha256")
    .update(
      [d.name.trim().toLowerCase(), d.phone, d.doctor, d.preferredDate, d.timeSlot].join("|"),
    )
    .digest("hex");
}