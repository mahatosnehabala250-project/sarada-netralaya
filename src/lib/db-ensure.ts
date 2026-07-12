// Ensures the SQLite database schema exists at runtime.
// On Vercel serverless, the DB file lives in /tmp and may not exist on cold start.
// This runs the raw CREATE TABLE IF NOT EXISTS so the first booking works without
// needing a separate migration step.
//
// NOTE: This module is server-only (uses db which is server-only). It must only
// be imported from API routes / server components, never from client components.

import { db } from '@/lib/db'

let ensured = false

export async function ensureDbSchema(): Promise<void> {
  if (ensured) return
  try {
    // Create the appointments table if it doesn't exist (SQLite).
    // Column types match the Prisma schema. Using IF NOT EXISTS makes this idempotent.
    await db.$executeRaw`CREATE TABLE IF NOT EXISTS "Appointment" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "ref" TEXT NOT NULL UNIQUE,
      "name" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "age" INTEGER,
      "department" TEXT NOT NULL,
      "preferredDate" TEXT NOT NULL,
      "timeSlot" TEXT NOT NULL,
      "note" TEXT,
      "status" TEXT NOT NULL DEFAULT 'pending',
      "ipHash" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "Appointment_preferredDate_idx" ON "Appointment"("preferredDate")`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "Appointment_status_idx" ON "Appointment"("status")`
    await db.$executeRaw`CREATE INDEX IF NOT EXISTS "Appointment_phone_idx" ON "Appointment"("phone")`
    ensured = true
  } catch (err) {
    console.error('[ensureDbSchema] failed:', err)
    // Don't rethrow — let the caller's query fail with a clearer error
  }
}
