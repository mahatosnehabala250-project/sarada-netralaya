import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Enable React strict mode — catches bugs in development
  reactStrictMode: true,
  // Security headers — protect against clickjacking, XSS, MIME sniffing, etc.
  // NOTE: CSP still allows 'unsafe-inline' for scripts because (a) Next.js
  // inline hydration scripts and (b) the JSON-LD <script type="application/ld+json">
  // blocks in src/app/page.tsx. Migrating to nonce-based CSP is a follow-up.
  // 'unsafe-eval' was removed — it is not needed in production.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // 'unsafe-inline' retained for Next.js hydration + JSON-LD;
              // 'unsafe-eval' removed (not needed in prod).
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https:",
              // Allow Google Maps embed (used on the contact section) and
              // nothing else cross-origin.
              "connect-src 'self'",
              "frame-src 'self' https://www.google.com",
              // Block plugins (Flash, Java, etc.) entirely.
              "object-src 'none'",
              // No base tags allowed (prevents <base href=javascript:...>).
              "base-uri 'self'",
              // Form submissions only to same origin.
              "form-action 'self'",
              // Defense-in-depth against clickjacking (complements X-Frame-Options).
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Isolate the browsing context group — defense against Spectre-class
          // attacks that rely on cross-window side channels.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // Don't expose the Referer header to cross-origin destinations.
          // (Already covered by Referrer-Policy above, kept for clarity.)
        ],
      },
    ];
  },
};

export default nextConfig;
