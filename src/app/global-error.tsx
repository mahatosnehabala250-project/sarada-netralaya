"use client";

/**
 * Global error boundary — catches unhandled errors from any route segment
 * and renders a branded, info-safe error page.
 *
 * SECURITY: This component NEVER displays error details (stack traces,
 * internal paths, error messages) to the user — those are logged server-side
 * only. Showing internals can leak implementation details that aid attackers.
 *
 * Note: this file must be a client component and must NOT use the default
 * app shell (layout.tsx) — Next.js renders <html> and <body> here directly.
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to the server only — never expose to the client.
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #00265c 0%, #003a8c 50%, #0047AB 100%)",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          color: "#fff",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div
            style={{
              fontSize: 48,
              marginBottom: 8,
            }}
            aria-hidden
          >
            👁️
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 12,
              color: "#fff",
            }}
          >
            Sarada Netralaya
          </h1>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 12,
              color: "#0047AB",
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 24,
            }}
          >
            We&apos;re sorry — an unexpected error occurred. Our team has been
            notified. Please try again, or call us at{" "}
            <a
              href="tel:+917091090014"
              style={{ color: "#0047AB", fontWeight: 600 }}
            >
              +91 70910 90014
            </a>{" "}
            if you need immediate help.
          </p>
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={reset}
              style={{
                background: "#0047AB",
                color: "#063b4f",
                border: "none",
                padding: "10px 20px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "10px 20px",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Back to Home
            </a>
          </div>
          {error.digest && (
            <p
              style={{
                marginTop: 24,
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "monospace",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
