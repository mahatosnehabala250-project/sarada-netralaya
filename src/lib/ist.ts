// IST (Asia/Kolkata) date/time utilities.
// All user-facing date logic must use IST, never raw UTC strings.

import { format, parseISO } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

export const IST_TZ = "Asia/Kolkata";

/** Current time as a Date in IST semantics (offset applied). */
export function nowInIST(): Date {
  return toZonedTime(new Date(), IST_TZ);
}

/** Today's calendar date in IST as yyyy-MM-dd. */
export function todayISTString(): string {
  return format(nowInIST(), "yyyy-MM-dd");
}

/** Format a yyyy-MM-dd date string + slot into a readable IST label. */
export function formatDateLong(dateStr: string): string {
  // dateStr is already a calendar date in IST; parse as local then format
  const d = parseISO(dateStr);
  return format(d, "d MMMM yyyy");
}

/** Format an ISO createdAt timestamp to IST display string. */
export function formatCreatedAtIST(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return format(toZonedTime(d, IST_TZ), "d MMM yyyy, h:mm a");
}

/** Convert an IST yyyy-MM-dd calendar date + time to a Date (for sorting). */
export function istDateStringToDate(dateStr: string): Date {
  return parseISO(dateStr);
}

/** Relative "time ago" in IST terms (for display only). */
export function timeAgoIST(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return format(toZonedTime(d, IST_TZ), "d MMM yyyy");
}

/** Greeting based on IST hour. */
export function greetingIST(): string {
  const h = nowInIST().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  if (h < 21) return "Good Evening";
  return "Good Night";
}

/** Full readable today date in IST, e.g. "Monday, 15 July 2026". */
export function fullTodayIST(): string {
  return format(nowInIST(), "EEEE, d MMMM yyyy");
}

// re-export for convenience
export { fromZonedTime, toZonedTime };
