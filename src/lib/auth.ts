// Owner authentication — simple cookie session.
// Single owner account configured via env vars (OWNER_EMAIL / OWNER_PASSWORD),
// or a runtime-overridable password (see owner-settings.ts). No public signup.

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { getOwnerEmail, getOwnerPassword } from "@/lib/owner-settings";

const SESSION_COOKIE = "sn_owner_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "dev-only-secret-change-me-in-production";

/** Constant-time string compare. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Verify owner credentials. */
export function verifyOwnerCredentials(email: string, password: string): boolean {
  return (
    safeEqual(email.trim().toLowerCase(), getOwnerEmail().toLowerCase()) &&
    safeEqual(password, getOwnerPassword())
  );
}

/** Create a signed session token and set the httpOnly cookie. */
export async function createOwnerSession(): Promise<void> {
  const payload = {
    email: getOwnerEmail(),
    issued: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SESSION_SECRET).update(body).digest("base64url");
  const token = `${body}.${sig}`;
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Verify the current session cookie. Returns true if valid (non-expired). */
export async function isOwnerAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = createHmac("sha256", SESSION_SECRET)
    .update(body)
    .digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number") return false;
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
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
