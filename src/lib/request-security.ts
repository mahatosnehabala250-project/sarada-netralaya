import "server-only";

import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  const candidate = fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim();
  return candidate && /^[0-9a-fA-F.:]{3,64}$/.test(candidate) ? candidate : "unknown";
}

export function securityKey(scope: string, value: string): string {
  return createHash("sha256")
    .update(`${scope}:${value.trim().toLowerCase()}`)
    .digest("hex");
}

export function hashIp(ip: string): string {
  return securityKey("booking-ip", ip).slice(0, 32);
}

export type RateLimitResult = { ok: boolean; retryAfterSec: number };

/**
 * Atomic PostgreSQL-backed fixed-window limiter shared by every Vercel instance.
 * Keys are already one-way hashes, so raw IPs, emails, and references are never stored.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const rows = await db.$queryRaw<Array<{ count: number; resetAt: Date }>>`
    INSERT INTO "RateLimitBucket" ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, NOW() + (${windowSeconds} * INTERVAL '1 second'), NOW())
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW() THEN 1
        ELSE "RateLimitBucket"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimitBucket"."resetAt" <= NOW()
          THEN NOW() + (${windowSeconds} * INTERVAL '1 second')
        ELSE "RateLimitBucket"."resetAt"
      END,
      "updatedAt" = NOW()
    RETURNING "count", "resetAt"
  `;
  const row = rows[0];
  if (!row) throw new Error("Rate limiter returned no result");
  // Opportunistic cleanup: rarely sweep long-expired buckets so the table
  // never grows unbounded. Fire-and-forget — never blocks the request.
  if (Math.random() < 0.02) {
    db.rateLimitBucket
      .deleteMany({ where: { resetAt: { lt: new Date(Date.now() - 24 * 3600 * 1000) } } })
      .catch(() => {});
  }
  return {
    ok: row.count <= max,
    retryAfterSec: Math.max(1, Math.ceil((row.resetAt.getTime() - Date.now()) / 1000)),
  };
}

/* ------------------------------------------------------------------ */
/* Endpoint policies                                                   */
/* ------------------------------------------------------------------ */

// Booking creation: per-IP.
const BOOKING_MAX = 3;
const BOOKING_WINDOW_S = 10 * 60;
// Lookup (protects patient data): per-IP, stricter.
const LOOKUP_MAX = 5;
const LOOKUP_WINDOW_S = 10 * 60;
// Per-ref lockout: failed lookups against one ref lock it even across IPs.
const REF_FAIL_MAX = 5;
const REF_FAIL_WINDOW_S = 15 * 60;
// Login: per-IP and per-email.
const LOGIN_IP_MAX = 10;
const LOGIN_IP_WINDOW_S = 15 * 60;
const LOGIN_EMAIL_MAX = 5;
const LOGIN_EMAIL_WINDOW_S = 15 * 60;
// Password change attempts (already authenticated, but guards current-password
// brute force from a stolen session cookie).
const CHPW_MAX = 5;
const CHPW_WINDOW_S = 15 * 60;

/**
 * Fail-open wrapper: if the limiter itself errors (DB hiccup), allow the
 * request — the data query right after will surface the real failure, and
 * a broken limiter must never take bookings down with it.
 */
async function checkOrAllow(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  try {
    return await checkRateLimit(key, max, windowSeconds);
  } catch (error) {
    console.error("[rate-limit] check failed (allowing request):", error);
    return { ok: true, retryAfterSec: 0 };
  }
}

export function checkBookingRateLimit(ip: string): Promise<RateLimitResult> {
  return checkOrAllow(securityKey("booking-ip", ip), BOOKING_MAX, BOOKING_WINDOW_S);
}

export function checkLookupRateLimit(ip: string): Promise<RateLimitResult> {
  return checkOrAllow(securityKey("lookup-ip", ip), LOOKUP_MAX, LOOKUP_WINDOW_S);
}

export function checkChangePasswordRateLimit(ip: string): Promise<RateLimitResult> {
  return checkOrAllow(securityKey("chpw-ip", ip), CHPW_MAX, CHPW_WINDOW_S);
}

/** Login limiter: per-IP and per-email must both allow. */
export async function checkLoginRateLimit(
  ip: string,
  email: string,
): Promise<RateLimitResult> {
  const [byIp, byEmail] = await Promise.all([
    checkOrAllow(securityKey("login-ip", ip), LOGIN_IP_MAX, LOGIN_IP_WINDOW_S),
    checkOrAllow(securityKey("login-email", email), LOGIN_EMAIL_MAX, LOGIN_EMAIL_WINDOW_S),
  ]);
  if (!byIp.ok) return byIp;
  return byEmail;
}

/** On successful login, forgive earlier failed attempts for that email. */
export async function clearLoginFailures(email: string): Promise<void> {
  try {
    await db.rateLimitBucket.deleteMany({
      where: { key: securityKey("login-email", email) },
    });
  } catch {
    /* best-effort */
  }
}

/**
 * Read-only lockout check for a booking ref. Does NOT count as an attempt —
 * only recordRefFailure() increments.
 */
export async function checkRefLockout(
  ref: string,
): Promise<{ locked: boolean; retryAfterSec: number }> {
  try {
    const row = await db.rateLimitBucket.findUnique({
      where: { key: securityKey("ref-fail", ref) },
    });
    if (!row || row.resetAt <= new Date() || row.count < REF_FAIL_MAX) {
      return { locked: false, retryAfterSec: 0 };
    }
    return {
      locked: true,
      retryAfterSec: Math.max(1, Math.ceil((row.resetAt.getTime() - Date.now()) / 1000)),
    };
  } catch (error) {
    console.error("[ref-lockout] check failed (allowing request):", error);
    return { locked: false, retryAfterSec: 0 };
  }
}

/** Record a failed ref+phone lookup attempt against this ref. */
export async function recordRefFailure(ref: string): Promise<void> {
  try {
    await checkRateLimit(securityKey("ref-fail", ref), REF_FAIL_MAX, REF_FAIL_WINDOW_S);
  } catch {
    /* best-effort */
  }
}

/** Clear failed attempts after a successful lookup. */
export async function clearRefFailures(ref: string): Promise<void> {
  try {
    await db.rateLimitBucket.deleteMany({
      where: { key: securityKey("ref-fail", ref) },
    });
  } catch {
    /* best-effort */
  }
}