import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to verify the database.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function verifyDatabaseMigration() {
  try {
    console.log("Starting database migration verification...");

    // 1. Verify Database Connection
    console.log("Verifying connection...");
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connection OK.");

    // 2. Verify AutomationLog (Phase 38)
    const logCount = await prisma.automationLog.count();
    console.log(`AutomationLog table verified (Count: ${logCount}).`);

    // 3. Verify Content and ContentProduct (Phase 39 Additive Models)
    // In Phase 39, these models are strictly required.
    try {
      const contentCount = await prisma.content.count();
      console.log(`Content table verified (Count: ${contentCount}).`);

      const cpCount = await prisma.contentProduct.count();
      console.log(`ContentProduct table verified (Count: ${cpCount}).`);
    } catch (e) {
      console.error(
        "Failed to verify Content or ContentProduct availability. These tables are strictly required for Phase 39.",
        e,
      );
      process.exit(1);
    }

    // 4. Verify Deal table availability
    const dealCount = await prisma.deal.count();
    console.log(`Deal table verified (Count: ${dealCount}).`);

    console.log("MIGRATION VERIFICATION: PASS");
    process.exit(0);
  } catch (error) {
    console.error("MIGRATION VERIFICATION: FAIL");
    console.error(
      "Error Details:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabaseMigration();
