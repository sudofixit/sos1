import { PrismaClient } from "@prisma/client";

// Singleton Prisma Client
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["warn", "error"],
  });

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
