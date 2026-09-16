import { BUILD_XP, addXp } from "../lib/learn-points";
import {
  touchActivity,
  uniqPush,
} from "../lib/learn-progress-helpers";
import {
  getParentStarterEnrollment,
  withStarterProgress,
} from "./learn-enroll";
import { invalidateLearnLeaderboardCache } from "./learn-leaderboard";

export async function recordBuildComplete(
  userId: string,
  input: { missionId: string; firstTry: boolean; attempts: number },
) {
  const enrollment = await getParentStarterEnrollment(userId);
  if (!enrollment) {
    throw Object.assign(new Error("Enroll in Mentr Learn first"), {
      status: 403,
    });
  }

  const missionId = String(input.missionId || "")
    .trim()
    .toUpperCase();
  const reward = BUILD_XP[missionId];
  if (!reward) {
    throw Object.assign(new Error("Unknown build mission"), { status: 400 });
  }

  let xpAwarded = 0;
  let alreadyCompleted = false;

  const { enrollment: next } = await withStarterProgress(userId, (progress) => {
    touchActivity(progress);
    alreadyCompleted = (progress.buildsCompleted ?? []).includes(missionId);
    if (alreadyCompleted) return;

    progress.buildsCompleted = uniqPush(progress.buildsCompleted, missionId);
    xpAwarded = reward.xp;
    if (input.firstTry) {
      progress.buildsFirstTry = uniqPush(progress.buildsFirstTry, missionId);
      xpAwarded += reward.firstTryBonus;
    }
    progress.xp = addXp(progress.xp, xpAwarded);
  });

  if (xpAwarded > 0) invalidateLearnLeaderboardCache();

  return {
    enrollment: next,
    xpAwarded,
    alreadyCompleted,
  };
}
