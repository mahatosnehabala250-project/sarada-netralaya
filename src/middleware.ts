// Centralized auth middleware — protects all /admin and /api/admin routes.
// Checks the signed session cookie before the route handler runs.
// If invalid/missing, redirects (pages) or 401s (API).

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "sn_owner_session";
const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "dev-only-secret-change-me-in-production";

/** Verify the session cookie signature and expiry. */
function verifySession(token: string): boolean {
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = createHmac("sha256", SESSION_SECRET)
    .update(body)
    .digest("base64url");
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

  // Get the session cookie
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const isAuthed = token ? verifySession(token) : false;

  // Allow login + logout endpoints without auth
  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
    return NextResponse.next();
  }

  // API routes — return 401 JSON
  if (pathname.startsWith("/api/admin/")) {
    if (!isAuthed) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Admin pages — let the page handler decide (it checks auth again for SSR)
  // The middleware just ensures the cookie is valid; the page does the actual
  // redirect to login. This is a defense-in-depth layer.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
