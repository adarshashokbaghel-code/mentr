/**
 * Lets one account claim the Learn Python certificate without meeting the progress rules.
 * Usage: npx tsx scripts/unlock-python-certificate.ts someone@example.com [--lock]
 */
import "dotenv/config";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";

(async () => {
  const email = process.argv[2]?.trim().toLowerCase();
  const lock = process.argv.includes("--lock");
  if (!email) {
    console.error("Usage: npx tsx scripts/unlock-python-certificate.ts <email> [--lock]");
    process.exit(1);
  }
  await connectDb();
  const res = await User.updateOne(
    { email },
    lock ? { $unset: { "learnPython.certificateUnlocked": 1 } } : { $set: { "learnPython.certificateUnlocked": true } },
  );
  if (!res.matchedCount) console.error(`No account with email ${email}`);
  else console.log(`${lock ? "Locked" : "Unlocked"} the Learn Python certificate for ${email}`);
  process.exit(res.matchedCount ? 0 : 1);
})();
