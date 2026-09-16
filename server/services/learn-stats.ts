import { getParentStarterEnrollment } from "./learn-enroll";
import { getLearnLeaderboard } from "./learn-leaderboard";
import { LearnPotdAttempt } from "../models/LearnPotdAttempt";
import { istDateKey } from "../lib/learn-points";

function recentDateKeys(days: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    keys.push(istDateKey(d));
  }
  return keys;
}

export async function getLearnStats(userId: string) {
  const enrollment = await getParentStarterEnrollment(userId);
  if (!enrollment) {
    throw Object.assign(new Error("Enroll in Mentr Learn first"), {
      status: 403,
    });
  }

  const p = enrollment.progress;
  const weekXp = Math.max(0, Math.round(((p.xp ?? 0) - (p.weekStartXp ?? 0)) * 10) / 10);
  const weekVideos = Math.max(
    0,
    (p.videosWatched?.length ?? 0) - (p.weekStartVideos ?? 0),
  );
  const weekPotd = Math.max(
    0,
    (p.potdCorrect ?? 0) - (p.weekStartPotdCorrect ?? 0),
  );

  const weekKeys = recentDateKeys(7);
  const potdWeekRows = await LearnPotdAttempt.find({
    user: userId,
    dateKey: { $in: weekKeys },
    correct: true,
  })
    .select("dateKey")
    .lean();

  const board = await getLearnLeaderboard(userId, 100);
  const yourRank = board.yourRank ?? 0;

  return {
    overall: {
      xp: p.xp ?? 0,
      videos: p.videosWatched?.length ?? 0,
      quizzes: p.quizzesCompleted?.length ?? 0,
      modules: p.modulesCompleted?.length ?? 0,
      builds: p.buildsCompleted?.length ?? 0,
      potdCorrect: p.potdCorrect ?? 0,
      practiceCorrect: p.practiceCorrect ?? 0,
      practiceAttempted: p.practiceAttempted ?? 0,
      streakDays: p.streakDays ?? 0,
      rank: yourRank,
    },
    week: {
      weekKey: p.weekKey,
      xp: weekXp,
      videos: weekVideos,
      potd: potdWeekRows.length || weekPotd,
      rank: yourRank,
    },
    leaderboardUpdatedAt: board.updatedAt,
  };
}
