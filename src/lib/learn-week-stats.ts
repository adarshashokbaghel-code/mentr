/** Client-side week snapshots so Progress can show This week vs Overall. */

export type LearnWeekSnap = {
  weekKey: string;
  videos: number;
  xp: number;
  rank: number;
  potd: number;
};

const WEEK_SNAP_KEY = "mentr_learn_week_snap_v1";

/** ISO-like week key: YYYY-Www (Mon-start weeks). */
export function learnWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function readWeekSnap(): LearnWeekSnap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WEEK_SNAP_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LearnWeekSnap;
  } catch {
    return null;
  }
}

export function writeWeekSnap(snap: LearnWeekSnap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WEEK_SNAP_KEY, JSON.stringify(snap));
}

/**
 * Ensures a baseline for the current week. First visit this week freezes
 * starting videos/xp/rank/potd; deltas = current − baseline.
 */
export function ensureWeekSnap(current: Omit<LearnWeekSnap, "weekKey">): LearnWeekSnap {
  const weekKey = learnWeekKey();
  const existing = readWeekSnap();
  if (existing?.weekKey === weekKey) return existing;
  const snap: LearnWeekSnap = { weekKey, ...current };
  writeWeekSnap(snap);
  return snap;
}

export function weekDeltas(
  current: Omit<LearnWeekSnap, "weekKey">,
  snap: LearnWeekSnap,
) {
  return {
    videos: Math.max(0, current.videos - snap.videos),
    xp: Math.max(0, Math.round((current.xp - snap.xp) * 10) / 10),
    potd: Math.max(0, current.potd - snap.potd),
    /** Negative = climbed (better). Positive = dropped. */
    rankDelta: snap.rank - current.rank,
    rankNow: current.rank,
  };
}

/** Count correct POTDs in the last `days` calendar days (local). */
export function countRecentPotdCorrect(
  days: {
    dateKey: string;
    attempted: boolean;
    correct: boolean | null;
  }[],
  lookbackDays = 7,
): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const keys = new Set<string>();
  for (let i = 0; i < lookbackDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    keys.add(`${y}-${m}-${day}`);
  }
  return days.filter(
    (d) => keys.has(d.dateKey) && d.attempted && d.correct === true,
  ).length;
}

export function countAllPotdCorrect(
  days: { attempted: boolean; correct: boolean | null }[],
): number {
  return days.filter((d) => d.attempted && d.correct === true).length;
}
