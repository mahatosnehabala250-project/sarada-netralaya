import { PrismaClient } from '@prisma/client'

// Resolve the database URL. On Vercel/serverless, the default `file:./db/custom.db`
// points to a read-only location. We redirect SQLite to /tmp (the only writable
// directory on Vercel functions) when running on Vercel.
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL ?? 'file:./db/custom.db'
  // If it's a file: URL and we're on Vercel, move it to /tmp
  if (envUrl.startsWith('file:') && process.env.VERCEL) {
    const fileName = envUrl.split('/').pop() ?? 'custom.db'
    return `file:/tmp/${fileName}`
  }
  return envUrl
}

const databaseUrl = resolveDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV !== 'production' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: { url: databaseUrl },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export { databaseUrl }
