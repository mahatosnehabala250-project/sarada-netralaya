// Owner authentication — simple signed-cookie session.
// Passwords are verified via bcrypt (constant-time, never stored plaintext).
//
// SECURITY MODEL:
// - Session token = base64url(payload).base64url(HMAC-SHA256(payload, secret))
// - Tamper-proof: any change to payload invalidates the signature.
// - Expiry is checked both in payload and via cookie maxAge.
// - Password changes invalidate sessions issued BEFORE the change
//   (see passwordChangedAt check below).
// - SESSION_SECRET is required in production (fail-closed).

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { getOwnerEmail, verifyPassword, getSessionVersion } from "@/lib/owner-settings";
import { getSessionSecret } from "@/lib/session-secret";

const SESSION_COOKIE = "sn_owner_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** Constant-time string compare. Returns false (not throws) on length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Verify owner credentials — email via constant-time, password via bcrypt. */
export async function verifyOwnerCredentials(email: string, password: string): Promise<boolean> {
  const emailMatch = safeEqual(email.trim().toLowerCase(), getOwnerEmail().toLowerCase());
  if (!emailMatch) return false;
  return verifyPassword(password);
}

/** Create a signed session token and set the httpOnly cookie. */
export async function createOwnerSession(version?: number): Promise<void> {
  const secret = getSessionSecret();
  const issued = Date.now();
  const payload = {
    email: getOwnerEmail(),
    issued,
    exp: issued + SESSION_MAX_AGE * 1000,
    version: version ?? await getSessionVersion(),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  const token = `${body}.${sig}`;
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // strict: admin cookie is never needed cross-site. Blocks CSRF on
    // top-level navigations from external origins (defense-in-depth).
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Verify the current session cookie. Returns true only if:
 *  - signature is valid (constant-time compare)
 *  - expiry is in the future
 *  - issued-at is not before the most recent password change (if any)
 */
export async function isOwnerAuthenticated(): Promise<boolean> {
  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    // Production misconfiguration — fail closed.
    return false;
  }

  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return false;

  let payload: { issued?: number; exp?: number; email?: string; version?: number };
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return false;
  }
  if (
    typeof payload.exp !== "number"
    || typeof payload.issued !== "number"
    || typeof payload.version !== "number"
  ) {
    return false;
  }
  if (Date.now() > payload.exp) return false;
  if (payload.email !== getOwnerEmail()) return false;

  try {
    return payload.version === await getSessionVersion();
  } catch (error) {
    console.error("[auth/session-version] failed", error);
    return false;
  }
}

/** Clear the session cookie (logout). */
export async function clearOwnerSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export { SESSION_COOKIE };
export { getOwnerEmail as OWNER_EMAIL };
