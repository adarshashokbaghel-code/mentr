/**
 * Grant Intermediate access (placement passed + server flag) without marking lessons complete.
 * Usage: npx tsx scripts/unlock-python-intermediate.ts someone@example.com
 */
import "dotenv/config";
import { PY_ALL_LMS_SLUGS } from "../src/lib/python-lms";
import { PLACEMENT_QUESTIONS } from "../src/lib/python-lms/placement";
import { connectDb, disconnectDb } from "../server/db";
import { User } from "../server/models/User";

(async () => {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npx tsx scripts/unlock-python-intermediate.ts <email>");
    process.exit(1);
  }

  await connectDb();
  const res = await User.updateOne(
    { email },
    {
      $set: {
        "learnPython.visited": true,
        "learnPython.intermediateAccess": true,
        "learnPython.lastVisitAt": new Date(),
        "learnPython.placement": {
          passed: true,
          score: PLACEMENT_QUESTIONS.length,
          total: PLACEMENT_QUESTIONS.length,
          at: new Date(),
        },
        "learnPython.unlockedLessons": PY_ALL_LMS_SLUGS,
      },
    },
  );
  if (!res.matchedCount) {
    console.error(`No account with email ${email}`);
    await disconnectDb();
    process.exit(1);
  }
  console.log(`Intermediate unlocked for ${email} (placement passed, intermediateAccess ON)`);
  await disconnectDb();
})();
