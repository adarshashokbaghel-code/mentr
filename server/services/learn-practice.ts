import { getPracticeQuestion } from "../lib/learn-practice-bank";
import { addXp, LEARN_POINTS } from "../lib/learn-points";
import { touchActivity } from "../lib/learn-progress-helpers";
import { LearnPracticeAttempt } from "../models/LearnPracticeAttempt";
import {
  getParentStarterEnrollment,
  withStarterProgress,
} from "./learn-enroll";
import { invalidateLearnLeaderboardCache } from "./learn-leaderboard";

export async function getPracticeAnswersForUser(userId: string) {
  const enrollment = await getParentStarterEnrollment(userId);
  if (!enrollment) {
    throw Object.assign(new Error("Enroll in Mentr Learn first"), {
      status: 403,
    });
  }

  const rows = await LearnPracticeAttempt.find({ user: userId })
    .select("questionId selectedIndex correct attemptedAt")
    .lean();

  const answers: Record<
    string,
    { selectedIndex: number; correct: boolean; at: string }
  > = {};
  for (const row of rows) {
    answers[row.questionId] = {
      selectedIndex: row.selectedIndex,
      correct: row.correct,
      at: row.attemptedAt.toISOString(),
    };
  }
  return { answers, count: rows.length };
}

export async function submitPracticeAttempt(
  userId: string,
  input: { questionId: string; selectedIndex: number },
) {
  const enrollment = await getParentStarterEnrollment(userId);
  if (!enrollment) {
    throw Object.assign(new Error("Enroll in Mentr Learn first"), {
      status: 403,
    });
  }

  const questionId = String(input.questionId || "").trim();
  const question = getPracticeQuestion(questionId);
  if (!question) {
    throw Object.assign(new Error("Unknown practice question"), {
      status: 400,
    });
  }

  const selectedIndex = Number(input.selectedIndex);
  if (!Number.isFinite(selectedIndex) || selectedIndex < 0) {
    throw Object.assign(new Error("selectedIndex required"), { status: 400 });
  }

  const existing = await LearnPracticeAttempt.findOne({
    user: userId,
    questionId,
  }).lean();
  if (existing) {
    return {
      questionId,
      selectedIndex: existing.selectedIndex,
      correct: existing.correct,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      alreadyAttempted: true,
      xpAwarded: 0,
      locked: true,
      enrollment,
    };
  }

  const correct = selectedIndex === question.correctIndex;
  await LearnPracticeAttempt.create({
    user: userId,
    questionId,
    selectedIndex,
    correct,
    attemptedAt: new Date(),
  });

  let xpAwarded = 0;
  const { enrollment: next } = await withStarterProgress(userId, (progress) => {
    touchActivity(progress);
    progress.practiceAttempted = (progress.practiceAttempted || 0) + 1;
    if (correct) {
      progress.practiceCorrect = (progress.practiceCorrect || 0) + 1;
      xpAwarded = LEARN_POINTS.practiceCorrect;
      progress.xp = addXp(progress.xp, xpAwarded);
    }
  });

  if (xpAwarded > 0) invalidateLearnLeaderboardCache();

  return {
    questionId,
    selectedIndex,
    correct,
    correctIndex: question.correctIndex,
    explanation: question.explanation,
    alreadyAttempted: false,
    xpAwarded,
    locked: true,
    enrollment: next,
  };
}
