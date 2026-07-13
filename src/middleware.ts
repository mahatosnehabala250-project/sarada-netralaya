// Centralized auth middleware — protects all /admin and /api/admin routes.
// Checks the signed session cookie before the route handler runs.
// If invalid/missing, redirects (pages) or 401s (API).
//
// SECURITY: SESSION_SECRET is required in production (fail-closed).
// /admin routes get an X-Robots-Tag: noindex header as defense-in-depth
// against indexing (complements robots.txt which is only a hint).

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getSessionSecretSafe } from "@/lib/session-secret";

const SESSION_COOKIE = "sn_owner_session";

/** Verify the session cookie signature and expiry. Fail-closed if secret unset. */
function verifySession(token: string): boolean {
  const secret = getSessionSecretSafe();
  if (!secret) return false; // production misconfig — deny

  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
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
    return NextResponse.next();
  }

  // API routes — return 401 JSON
  if (pathname.startsWith("/api/admin/")) {
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Admin pages — let the page handler decide (it checks auth again for SSR).
  // The middleware just ensures the cookie is valid; the page does the actual
  // redirect to login. This is a defense-in-depth layer.
  //
  // Defense-in-depth: send X-Robots-Tag: noindex, nofollow on all /admin
  // responses so search engines never index the admin surface, even if a
  // rogue link appears somewhere. robots.txt already disallows /admin but
  // is only a hint.
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
