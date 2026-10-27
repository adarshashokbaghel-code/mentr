import "dotenv/config";
import { PY_INT_LESSON_ORDER, PY_LESSON_ORDER } from "../../src/lib/python-lms";
import { PLACEMENT_QUESTIONS } from "../../src/lib/python-lms/placement";
import { connectDb, disconnectDb } from "../../server/db";
import { User } from "../../server/models/User";

/** QA: intermediate access + every LMS slug in unlockedLessons (no sequential gate). */
export async function unlockAllLmsSlugsForEmail(email: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  const allSlugs = [...PY_LESSON_ORDER, ...PY_INT_LESSON_ORDER];
  const res = await User.updateOne(
    { email: normalized },
    {
      $set: {
        "learnPython.visited": true,
        "learnPython.intermediateAccess": true,
        "learnPython.unlockedLessons": allSlugs,
        "learnPython.lastVisitAt": new Date(),
        "learnPython.placement": {
          passed: true,
          score: PLACEMENT_QUESTIONS.length,
          total: PLACEMENT_QUESTIONS.length,
          at: new Date(),
        },
      },
    },
  );
  return res.matchedCount > 0;
}

export async function withDbUnlockAll(email: string): Promise<void> {
  await connectDb();
  const ok = await unlockAllLmsSlugsForEmail(email);
  await disconnectDb();
  if (!ok) throw new Error(`No account with email ${email}`);
}
