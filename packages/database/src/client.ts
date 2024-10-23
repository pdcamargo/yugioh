import { PrismaClient } from "@prisma/client";

export const prisma = (global.prisma || new PrismaClient()) as PrismaClient;

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export * from "@prisma/client";

export const DATABASE_URL = process.env.DATABASE_URL!;
