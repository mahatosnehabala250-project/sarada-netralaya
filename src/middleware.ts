// Centralized auth middleware — protects all /admin and /api/admin routes.
// Runs on the Edge Runtime, so it uses the Web Crypto API (not Node's crypto)
// to verify the HMAC-signed session cookie. This mirrors src/lib/auth.ts
// (which uses Node crypto in the Node.js runtime for issuing sessions).

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "sn_owner_session";
const DEV_FALLBACK = "dev-only-secret-change-me-in-production";
const MIN_SECRET_LENGTH = 32;

/** Get SESSION_SECRET — fail-closed in production if missing/weak. */
function getSecret(): string | null {
  const env = process.env.SESSION_SECRET;
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    if (!env || env.length < MIN_SECRET_LENGTH || env === DEV_FALLBACK) {
      return null; // fail-closed
    }
    return env;
  }
  return env && env.length >= MIN_SECRET_LENGTH ? env : DEV_FALLBACK;
}

/** Base64url-encode an ArrayBuffer (no padding) — matches Node's 'base64url'. */
function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode a base64url string to its UTF-8 text. */
function fromBase64UrlToString(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/** Constant-time string compare. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Verify the session cookie signature and expiry using Web Crypto (HMAC-SHA256). */
async function verifySession(token: string): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;
  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return false;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const macBuf = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(body)
    );
    const expected = toBase64Url(macBuf);
    if (!safeEqual(sig, expected)) return false;

    const payload = JSON.parse(fromBase64UrlToString(body));
    if (typeof payload.exp !== "number") return false;
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const isAuthed = token ? await verifySession(token) : false;

  // Allow login + logout endpoints without auth
  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // API routes — return 401 JSON when not authenticated
  if (pathname.startsWith("/api/admin/")) {
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // Admin pages — the page handler also verifies auth for SSR (defense in depth).
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
