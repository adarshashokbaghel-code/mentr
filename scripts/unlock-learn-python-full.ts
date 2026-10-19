/**
 * QA helper: pass placement, unlock Intermediate, mark all lessons complete, allow certificate claim.
 * Usage: npx tsx scripts/unlock-learn-python-full.ts someone@example.com [--lock]
 */
import "dotenv/config";
import {
  PY_INT_LESSON_ORDER,
  PY_LESSON_ORDER,
  getPyLesson,
} from "../src/lib/python-lms";
import { PLACEMENT_QUESTIONS } from "../src/lib/python-lms/placement";
import { connectDb, disconnectDb } from "../server/db";
import { User } from "../server/models/User";

function lessonComplete(slug: string) {
  const notes = getPyLesson(slug)?.notes.length ?? 1;
  const lastSlide = Math.max(0, notes - 1);
  const now = new Date().toISOString();
  return {
    notesSlide: lastSlide,
    slidesSeen: lastSlide,
    notesDone: true,
    examplesDone: true,
    completedAt: now,
    bestScore: 10,
    stars: 3,
    practice: { score: 10, total: 10 },
  };
}

(async () => {
  const email = process.argv[2]?.trim().toLowerCase();
  const lock = process.argv.includes("--lock");
  if (!email) {
    console.error("Usage: npx tsx scripts/unlock-learn-python-full.ts <email> [--lock]");
    process.exit(1);
  }

  await connectDb();

  if (lock) {
    const res = await User.updateOne(
      { email },
      {
        $set: {
          "learnPython.intermediateAccess": false,
          "learnPython.certificateUnlocked": false,
        },
        $unset: {
          "learnPython.placement": 1,
        },
      },
    );
    console.log(res.matchedCount ? `Locked Learn Python extras for ${email}` : `No user ${email}`);
    await disconnectDb();
    process.exit(res.matchedCount ? 0 : 1);
  }

  const allSlugs = [...PY_LESSON_ORDER, ...PY_INT_LESSON_ORDER];
  const set: Record<string, unknown> = {
    "learnPython.visited": true,
    "learnPython.intermediateAccess": true,
    "learnPython.certificateUnlocked": true,
    "learnPython.placement": {
      passed: true,
      score: PLACEMENT_QUESTIONS.length,
      total: PLACEMENT_QUESTIONS.length,
      at: new Date(),
    },
    "learnPython.unlockedLessons": allSlugs,
    "learnPython.lastVisitAt": new Date(),
  };

  for (const slug of allSlugs) {
    set[`learnPython.lessons.${slug}`] = lessonComplete(slug);
  }

  const user = await User.findOne({ email }).select("_id learnPython.firstVisitAt").lean();
  if (!user) {
    console.error(`No account with email ${email}`);
    await disconnectDb();
    process.exit(1);
  }

  if (!user.learnPython?.firstVisitAt) {
    set["learnPython.firstVisitAt"] = new Date();
  }

  await User.updateOne({ email }, { $set: set });
  console.log(`Learn Python unlocked for ${email}:`);
  console.log(`  • Placement passed (${PLACEMENT_QUESTIONS.length}/${PLACEMENT_QUESTIONS.length})`);
  console.log(`  • Intermediate access ON`);
  console.log(`  • ${allSlugs.length} lessons marked complete`);
  console.log(`  • Certificate claim override ON`);
  await disconnectDb();
})();
