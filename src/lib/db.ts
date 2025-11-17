// DB helper: safe lazy import of PrismaClient.
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export function getDb(): PrismaClient | null {
  try {
    if (!process.env.DATABASE_URL) return null;
    if (!prisma) prisma = new PrismaClient();
    return prisma;
  } catch (e) {
    return null;
  }
}
