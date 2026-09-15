/**
 * Seed Learn A1 quiz (10) + 70 POTD bank.
 * Run: npm run seed:learn-quiz
 */
import "dotenv/config";
import { connectDb, disconnectDb } from "../server/db";
import { A1_QUIZ_SEED, A1_VIDEO_ID } from "../server/lib/learn-a1-quiz-seed";
import { LearnQuizQuestion } from "../server/models/LearnQuizQuestion";
import { ensurePotdBankSeeded } from "../server/services/learn-potd";
import { ensureA1LessonSeeded } from "../server/services/learn-quiz";

async function main() {
  await connectDb();
  const lesson = await ensureA1LessonSeeded();
  const count = await LearnQuizQuestion.countDocuments({
    videoId: A1_VIDEO_ID,
    active: true,
  });
  const potdCount = await ensurePotdBankSeeded();
  console.log(`✓ lesson ${lesson.moduleId} videoId=${lesson.videoId}`);
  console.log(`✓ ${count} active quiz questions (expected ${A1_QUIZ_SEED.length})`);
  console.log(`✓ ${potdCount} POTD items (expected 70)`);
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
