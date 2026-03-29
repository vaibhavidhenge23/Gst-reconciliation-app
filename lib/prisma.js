import { PrismaClient } from "@prisma/client";

// Singleton — only one Prisma instance in the entire app
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
