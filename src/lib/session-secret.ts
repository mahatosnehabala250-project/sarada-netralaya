// Centralized SESSION_SECRET resolution.
//
// SECURITY: In production we MUST fail-closed if SESSION_SECRET is missing or
// too weak — otherwise an attacker who reads the source code can forge session
// cookies signed with the publicly-known dev fallback.
//
// This module is import-safe from both Node.js runtime (route handlers,
// server components) and Edge runtime (middleware) — it only reads
// process.env and performs string checks.

const DEV_FALLBACK = "dev-only-secret-change-me-in-production";
const MIN_SECRET_LENGTH = 32;

let cached: string | null = null;

/**
 * Returns the SESSION_SECRET. In production, throws if the env var is missing
 * or shorter than MIN_SECRET_LENGTH — this is intentional fail-closed
 * behavior. In dev, falls back to a known dev-only value so the app still
 * runs without configuration.
 */
export function getSessionSecret(): string {
  if (cached) return cached;

  const env = process.env.SESSION_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    if (!env || env.length < MIN_SECRET_LENGTH || env === DEV_FALLBACK) {
      throw new Error(
        "SESSION_SECRET must be set to a strong random string " +
          `(>= ${MIN_SECRET_LENGTH} chars) in production. ` +
          "Generate one with: `openssl rand -base64 48`."
      );
    }
    cached = env;
    return cached;
  }

  // Dev: allow fallback so local setup works without env vars.
  cached = env && env.length >= MIN_SECRET_LENGTH ? env : DEV_FALLBACK;
  return cached;
}

/**
 * Safe variant for middleware — never throws. Returns null if the secret
 * is unusable, so middleware can fail-closed by treating null as "deny".
 */
export function getSessionSecretSafe(): string | null {
  try {
    return getSessionSecret();
  } catch {
    return null;
  }
}
