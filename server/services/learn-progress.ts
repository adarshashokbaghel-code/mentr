import { LEARN_POINTS, addXp } from "../lib/learn-points";
import {
  applyDailyCheckIn,
  touchActivity,
  uniqPush,
} from "../lib/learn-progress-helpers";
import {
  getParentStarterEnrollment,
  withStarterProgress,
} from "./learn-enroll";
import { invalidateLearnLeaderboardCache } from "./learn-leaderboard";

export async function recordLearnProgressEvent(
  userId: string,
  input: {
    moduleId: string;
    event: "video_complete" | "quiz_complete";
    quizScore?: { correct: number; total: number; wrong?: number };
  },
) {
  const enrollment = await getParentStarterEnrollment(userId);
  if (!enrollment) {
    throw Object.assign(new Error("Enroll in Mentr Learn first"), {
      status: 403,
    });
  }

  const moduleId = input.moduleId.trim().toUpperCase();

  let xpChanged = false;

  const { enrollment: next } = await withStarterProgress(userId, (progress) => {
    touchActivity(progress);
    progress.currentModuleId = moduleId;

    if (input.event === "video_complete") {
      // Tracked for path unlock — 0 XP (see learn-points)
      progress.videosWatched = uniqPush(progress.videosWatched, moduleId);
      void LEARN_POINTS.videoComplete;
      return;
    }

    if (input.event === "quiz_complete") {
      if ((progress.quizzesCompleted ?? []).includes(moduleId)) {
        throw Object.assign(new Error("Quiz already completed — no retakes"), {
          status: 409,
        });
      }
      const correct = input.quizScore?.correct ?? 0;
      const total = input.quizScore?.total ?? 0;
      const wrong =
        input.quizScore?.wrong ?? Math.max(0, total - correct);
      const delta =
        correct * LEARN_POINTS.quizCorrect + wrong * LEARN_POINTS.quizWrong;

      progress.quizzesCompleted = uniqPush(progress.quizzesCompleted, moduleId);
      progress.modulesCompleted = uniqPush(progress.modulesCompleted, moduleId);
      progress.xp = addXp(progress.xp, delta);
      xpChanged = true;
    }
  });

  if (xpChanged) invalidateLearnLeaderboardCache();
  return next;
}

export async function recordDailyCheckIn(userId: string) {
  const enrollment = await getParentStarterEnrollment(userId);
  if (!enrollment) {
    throw Object.assign(new Error("Enroll in Mentr Learn first"), {
      status: 403,
    });
  }

  let awarded = 0;
  let alreadyToday = false;

  const { enrollment: next } = await withStarterProgress(userId, (progress) => {
    const result = applyDailyCheckIn(progress);
    awarded = result.awarded;
    alreadyToday = result.alreadyToday;
  });

  if (awarded > 0) invalidateLearnLeaderboardCache();
  return { enrollment: next, awarded, alreadyToday };
}
