import { PrismaClient } from '@prisma/client'

// Auto-sanitize DATABASE_URL if cached with legacy password placeholder
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('root:password@')) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace('root:password@', 'root:@')
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
