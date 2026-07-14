import { PrismaClient } from '@prisma/client'

// Prisma reads the connection string from DATABASE_URL (see prisma/schema.prisma).
// In production this points at Supabase Postgres (pooled). A single client is
// reused across hot reloads in development to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
