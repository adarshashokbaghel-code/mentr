/**
 * Seed 200 Path to Intermediate questions into Mongo.
 * Run: npm run seed:py-placement
 */
import "dotenv/config";
import { connectDb, disconnectDb } from "../server/db";
import { seedPyPlacementBank } from "../server/services/py-placement";
import { PLACEMENT_BANK_TARGET } from "../src/lib/python-lms/placement-bank";

async function main() {
  await connectDb();
  const n = await seedPyPlacementBank();
  console.log(`✓ ${n} placement questions upserted (target ${PLACEMENT_BANK_TARGET})`);
  await disconnectDb();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await disconnectDb();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
