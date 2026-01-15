import { PrismaClient } from "@prisma/client";

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn(
    "⚠️  DATABASE_URL is not set. Prisma will not be able to connect to the database.\n" +
    "Please set DATABASE_URL in your .env file."
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (error) {
    console.error("Failed to create Prisma Client:", error);
    throw new Error(
      "Prisma Client initialization failed. Please run 'npx prisma generate' and ensure DATABASE_URL is set correctly."
    );
  }
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
