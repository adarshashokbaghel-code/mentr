import type { LearnProgressScaffold } from "./learn-course";
import {
  addXp,
  istDateKey,
  istYesterdayKey,
  LEARN_POINTS,
  learnWeekKeyIst,
} from "./learn-points";

export function uniqPush(list: string[] | undefined, id: string): string[] {
  const next = [...(list ?? [])];
  if (!next.includes(id)) next.push(id);
  return next;
}

export type MutableLearnProgress = LearnProgressScaffold & {
  lastCheckInDay: string | null;
  streakBonusesClaimed: number[];
  weekKey: string | null;
  weekStartXp: number;
  weekStartVideos: number;
  weekStartPotdCorrect: number;
  potdCorrect: number;
  potdAttempted: number;
  practiceCorrect: number;
  practiceAttempted: number;
};

export function ensureProgressShape(
  raw: Partial<LearnProgressScaffold> | null | undefined,
): MutableLearnProgress {
  const base = {
    modulesCompleted: raw?.modulesCompleted ?? [],
    videosWatched: raw?.videosWatched ?? [],
    quizzesCompleted: raw?.quizzesCompleted ?? [],
    buildsCompleted: raw?.buildsCompleted ?? [],
    buildsFirstTry: raw?.buildsFirstTry ?? [],
    currentModuleId: raw?.currentModuleId ?? "A1",
    xp: raw?.xp ?? 0,
    streakDays: raw?.streakDays ?? 0,
    lastActivityAt: raw?.lastActivityAt ?? null,
  };
  const extra = raw as Partial<MutableLearnProgress> | null | undefined;
  return {
    ...base,
    lastCheckInDay: extra?.lastCheckInDay ?? null,
    streakBonusesClaimed: extra?.streakBonusesClaimed ?? [],
    weekKey: extra?.weekKey ?? null,
    weekStartXp: extra?.weekStartXp ?? 0,
    weekStartVideos: extra?.weekStartVideos ?? 0,
    weekStartPotdCorrect: extra?.weekStartPotdCorrect ?? 0,
    potdCorrect: extra?.potdCorrect ?? 0,
    potdAttempted: extra?.potdAttempted ?? 0,
    practiceCorrect: extra?.practiceCorrect ?? 0,
    practiceAttempted: extra?.practiceAttempted ?? 0,
  };
}

/** Freeze week baseline when the IST week rolls over. */
export function rollWeekIfNeeded(progress: MutableLearnProgress): void {
  const weekKey = learnWeekKeyIst();
  if (progress.weekKey === weekKey) return;
  progress.weekKey = weekKey;
  progress.weekStartXp = progress.xp || 0;
  progress.weekStartVideos = (progress.videosWatched ?? []).length;
  progress.weekStartPotdCorrect = progress.potdCorrect || 0;
}

function claimStreakBonuses(progress: MutableLearnProgress): number {
  const claimed = new Set(progress.streakBonusesClaimed ?? []);
  let bonus = 0;
  const milestones: { days: number; xp: number }[] = [
    { days: 7, xp: LEARN_POINTS.streak7 },
    { days: 15, xp: LEARN_POINTS.streak15 },
    { days: 30, xp: LEARN_POINTS.streak30 },
  ];
  for (const m of milestones) {
    if (progress.streakDays >= m.days && !claimed.has(m.days)) {
      bonus += m.xp;
      claimed.add(m.days);
    }
  }
  progress.streakBonusesClaimed = Array.from(claimed).sort((a, b) => a - b);
  return bonus;
}

/**
 * Daily login check-in: streak +0.5 XP once per IST day.
 * Consecutive IST days grow streak; a missed day resets to 1.
 */
export function applyDailyCheckIn(progress: MutableLearnProgress): {
  awarded: number;
  alreadyToday: boolean;
} {
  const today = istDateKey();
  if (progress.lastCheckInDay === today) {
    rollWeekIfNeeded(progress);
    return { awarded: 0, alreadyToday: true };
  }

  rollWeekIfNeeded(progress);

  const yesterday = istYesterdayKey();
  if (progress.lastCheckInDay === yesterday) {
    progress.streakDays = (progress.streakDays || 0) + 1;
  } else {
    progress.streakDays = 1;
  }

  progress.lastCheckInDay = today;
  progress.lastActivityAt = new Date().toISOString();

  let awarded = LEARN_POINTS.dailySignIn;
  awarded += claimStreakBonuses(progress);
  progress.xp = addXp(progress.xp, awarded);

  return { awarded, alreadyToday: false };
}

export function touchActivity(progress: MutableLearnProgress): void {
  rollWeekIfNeeded(progress);
  progress.lastActivityAt = new Date().toISOString();
}
