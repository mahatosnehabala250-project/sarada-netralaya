// Centralized auth middleware — protects all /admin and /api/admin routes.
// Runs on Node.js runtime (not Edge) because it uses Node's crypto module.

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

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
  // Dev: allow fallback
  return env && env.length >= MIN_SECRET_LENGTH ? env : DEV_FALLBACK;
}

/** Verify the session cookie signature and expiry. */
function verifySession(token: string): boolean {
  const secret = getSecret();
  if (!secret) return false;

  try {
    const [body, sig] = token.split(".");
    if (!body || !sig) return false;
    const expected = createHmac("sha256", secret).update(body).digest("base64url");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;

    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof payload.exp !== "number") return false;
    if (Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const isAuthed = token ? verifySession(token) : false;

  // Allow login + logout endpoints without auth
  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // API routes — return 401 JSON
  if (pathname.startsWith("/api/admin/")) {
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // Admin pages — let the page handler decide (it checks auth for SSR).
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
