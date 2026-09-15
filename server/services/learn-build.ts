import { emptyLearnProgress } from "../lib/learn-course";
import { User } from "../models/User";
import { getParentStarterEnrollment } from "./learn-enroll";

const BUILD_XP: Record<string, { xp: number; firstTryBonus: number }> = {
  B1: { xp: 3, firstTryBonus: 3 },
  B2: { xp: 3, firstTryBonus: 3 },
  B3: { xp: 4, firstTryBonus: 3 },
  B4: { xp: 4, firstTryBonus: 3 },
  B5: { xp: 5, firstTryBonus: 3 },
  B6: { xp: 5, firstTryBonus: 3 },
  B7: { xp: 5, firstTryBonus: 3 },
  B8: { xp: 6, firstTryBonus: 3 },
  B9: { xp: 6, firstTryBonus: 3 },
  B10: { xp: 8, firstTryBonus: 3 },
  B11: { xp: 3, firstTryBonus: 3 },
  B12: { xp: 4, firstTryBonus: 3 },
  B13: { xp: 5, firstTryBonus: 3 },
  B14: { xp: 5, firstTryBonus: 3 },
  B15: { xp: 6, firstTryBonus: 3 },
};

function uniqPush(list: string[] | undefined, id: string): string[] {
  const next = [...(list ?? [])];
  if (!next.includes(id)) next.push(id);
  return next;
}

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

  const user = await User.findById(userId);
  if (!user?.learn?.starter) {
    throw Object.assign(new Error("Enrollment missing"), { status: 404 });
  }

  const progress = {
    ...emptyLearnProgress(),
    ...(user.learn.starter.progress || {}),
  };

  const already = (progress.buildsCompleted ?? []).includes(missionId);
  const now = new Date().toISOString();
  const today = now.slice(0, 10);
  const lastDay = progress.lastActivityAt?.slice(0, 10);
  if (lastDay && lastDay !== today) {
    progress.streakDays = (progress.streakDays || 0) + 1;
  } else if (!lastDay) {
    progress.streakDays = Math.max(progress.streakDays || 0, 1);
  }
  progress.lastActivityAt = now;

  let xpAwarded = 0;
  if (!already) {
    progress.buildsCompleted = uniqPush(progress.buildsCompleted, missionId);
    xpAwarded = reward.xp;
    if (input.firstTry) {
      progress.buildsFirstTry = uniqPush(progress.buildsFirstTry, missionId);
      xpAwarded += reward.firstTryBonus;
    }
    progress.xp = (progress.xp || 0) + xpAwarded;
  }

  user.learn.starter.progress = progress;
  user.markModified("learn");
  await user.save();

  return {
    enrollment: await getParentStarterEnrollment(userId),
    xpAwarded,
    alreadyCompleted: already,
  };
}
