import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Lazy-initialize Prisma Client
 * Only throws DATABASE_URL error when actually used, not at module import
 * This allows Next.js build to succeed even without DATABASE_URL
 */
export const prisma = (() => {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn(
      "[Prisma] DATABASE_URL is not set. Database operations will fail at runtime."
    );
    
    // Return a lazy proxy - only throw when methods are actually called
    return new Proxy({} as PrismaClient, {
      get: (target, prop) => {
        if (prop === Symbol.toStringTag || prop === Symbol.hasInstance) {
          return undefined;
        }
        throw new Error(
          `[Prisma] DATABASE_URL is required. Cannot access prisma.${String(prop)}()`
        );
      },
    }) as unknown as PrismaClient;
  }

  const adapter = new PrismaPg({ connectionString });
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
})();
