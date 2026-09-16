/**
 * Learn points — server source of truth (mirrors src/lib/learn-points.ts).
 * 1 point = 1 XP. Leaderboard ranks by total XP.
 */

export const LEARN_POINTS = {
  /** Watch / mark video complete — tracked, no XP */
  videoComplete: 0,
  potdCorrect: 1,
  quizCorrect: 1,
  quizWrong: -0.5,
  dailySignIn: 0.5,
  streak7: 2,
  streak15: 5,
  streak30: 10,
  buildFirstTryBonus: 3,
  practiceCorrect: 1,
  practiceWrong: 0,
} as const;

/** Build Arena base XP by mission id */
export const BUILD_XP: Record<string, { xp: number; firstTryBonus: number }> = {
  B1: { xp: 3, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B2: { xp: 3, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B3: { xp: 4, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B4: { xp: 4, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B5: { xp: 5, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B6: { xp: 5, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B7: { xp: 5, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B8: { xp: 6, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B9: { xp: 6, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B10: { xp: 8, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B11: { xp: 3, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B12: { xp: 4, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B13: { xp: 5, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B14: { xp: 5, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
  B15: { xp: 6, firstTryBonus: LEARN_POINTS.buildFirstTryBonus },
};

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/** Calendar day key in Asia/Kolkata (YYYY-MM-DD). */
export function istDateKey(date = new Date()): string {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  return ist.toISOString().slice(0, 10);
}

/** Previous IST calendar day key. */
export function istYesterdayKey(date = new Date()): string {
  return istDateKey(new Date(date.getTime() - 24 * 60 * 60 * 1000));
}

/** Mon-start ISO-like week key in IST: YYYY-Www */
export function learnWeekKeyIst(date = new Date()): string {
  const ist = new Date(date.getTime() + IST_OFFSET_MS);
  const d = new Date(
    Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate()),
  );
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function clampXp(n: number): number {
  return Math.max(0, Math.round(n * 10) / 10);
}

export function addXp(current: number, delta: number): number {
  return clampXp((current || 0) + delta);
}
