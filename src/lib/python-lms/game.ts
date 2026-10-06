export { PY_XP, XP_RULES } from "./rules";

export type BandId = "hatchling" | "coder" | "builder" | "engineer" | "pythonista";

export type Band = {
  id: BandId;
  name: string;
  from: number;
  to: number;
  /** XP needed to climb one level inside this band. */
  step: number;
  color: string;
  wash: string;
  tagline: string;
};

export const BANDS: Band[] = [
  { id: "hatchling", name: "Hatchling", from: 1, to: 10, step: 5, color: "#2f9e6e", wash: "#eef8f2", tagline: "First lines of code" },
  { id: "coder", name: "Coder", from: 11, to: 20, step: 10, color: "#2b8fbf", wash: "#eaf5fb", tagline: "Variables, input and decisions" },
  { id: "builder", name: "Builder", from: 21, to: 30, step: 20, color: "#c98a12", wash: "#fff7e6", tagline: "Loops, lists and functions" },
  { id: "engineer", name: "Engineer", from: 31, to: 40, step: 35, color: "#d4532f", wash: "#fff1ea", tagline: "Debugging and real projects" },
  { id: "pythonista", name: "Pythonista", from: 41, to: 50, step: 50, color: "#6a57cc", wash: "#f1effc", tagline: "Mastery" },
];

export const LEVEL_NAMES: string[] = [
  // Hatchling 1–10
  "Curious Mind", "First Printer", "String Starter", "Quote Keeper", "Comment Writer",
  "Line Reader", "Syntax Spotter", "Bug Spotter", "Output Ace", "Hatchling Graduate",
  // Coder 11–20
  "Variable Keeper", "Input Taker", "Number Cruncher", "Operator", "Formatter",
  "Logic Learner", "Decision Maker", "Condition Checker", "Branch Builder", "Code Cadet",
  // Builder 21–30
  "Loop Starter", "Loop Runner", "Pattern Maker", "Counter", "String Slicer",
  "List Maker", "List Master", "Function Writer", "Problem Solver", "Code Builder",
  // Engineer 31–40
  "Debugger", "Bug Squasher", "Clean Coder", "Algorithm Thinker", "Data Handler",
  "Logic Engineer", "Code Reviewer", "Speed Coder", "Project Maker", "Software Engineer",
  // Pythonista 41–50
  "Python Pro", "Code Mentor", "Algorithm Ace", "Data Wizard", "Bug Slayer",
  "Code Architect", "Python Sage", "Code Legend", "Grandmaster", "Pythonista",
];

export const MAX_LEVEL = LEVEL_NAMES.length;

export const bandFor = (level: number): Band => BANDS.find((b) => level >= b.from && level <= b.to) ?? BANDS[BANDS.length - 1];

/** LEVEL_XP[n - 1] is the total XP needed to reach level n. */
export const LEVEL_XP: number[] = LEVEL_NAMES.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + bandFor(i).step);
  return acc;
}, []);

export function levelFor(xp: number) {
  let level = 1;
  while (level < MAX_LEVEL && xp >= LEVEL_XP[level]) level++;
  const band = bandFor(level);
  const max = level === MAX_LEVEL;
  const start = LEVEL_XP[level - 1];
  const nextAt = max ? start : LEVEL_XP[level];
  const needed = max ? 0 : nextAt - start;
  const into = xp - start;
  return {
    level,
    title: LEVEL_NAMES[level - 1],
    band,
    max,
    into,
    needed,
    nextAt,
    toNext: max ? 0 : nextAt - xp,
    nextTitle: max ? null : LEVEL_NAMES[level],
    pct: max ? 100 : Math.round((into / needed) * 100),
  };
}

export function starsFor(score: number, total: number): number {
  if (total === 0) return 0;
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  return 1;
}

export type AchievementId =
  | "first-run"
  | "note-master"
  | "sharp-eye"
  | "bug-hunter"
  | "on-fire"
  | "flawless"
  | "lesson-1"
  | "streak-3"
  | "streak-7"
  | "level-10";

export const ACHIEVEMENTS: Record<AchievementId, { title: string; text: string; how: string }> = {
  "first-run": { title: "Hello, World", text: "Ran your first Python program", how: "Run any program without an error." },
  "note-master": { title: "Study complete", text: "Read every slide of a lesson", how: "Reach the last slide of a lesson’s study and press Finish." },
  "sharp-eye": { title: "Sharp Eye", text: "Every quick check right first time", how: "Answer every quick check in one lesson’s study correctly on your first pick." },
  "bug-hunter": { title: "Bug Hunter", text: "Fixed a broken program", how: "Fix all the bugs in the bug-hunt example so it runs." },
  "on-fire": { title: "On Fire", text: "5 right in a row, first try", how: "Answer 5 practice questions in a row correctly on the first try." },
  flawless: { title: "Flawless", text: "Scored 100% in a practice set", how: "Get every question in a lesson’s practice right without revealing an answer." },
  "lesson-1": { title: "Python Starter", text: "Completed Lesson 1", how: "Finish the study, examples and practice of Lesson 1." },
  "streak-3": { title: "Regular", text: "3-day login streak", how: "Log in and open the course 3 days in a row." },
  "streak-7": { title: "Week Warrior", text: "7-day login streak", how: "Log in and open the course 7 days in a row." },
  "level-10": { title: "Hatched", text: "Reached Level 10", how: `Earn ${LEVEL_XP[9]} XP to reach Level 10 and finish the Hatchling band.` },
};

export const ACHIEVEMENT_ORDER = Object.keys(ACHIEVEMENTS) as AchievementId[];

/** Achievements earned from totals rather than a single action. */
export function autoAchievements(xp: number, streak: number): AchievementId[] {
  const out: AchievementId[] = [];
  if (streak >= 3) out.push("streak-3");
  if (streak >= 7) out.push("streak-7");
  if (levelFor(xp).level >= 10) out.push("level-10");
  return out;
}

/** Progress toward an achievement that has a count, for the locked state. */
export function achievementProgress(id: AchievementId, xp: number, streak: number): { have: number; need: number } | null {
  if (id === "streak-3") return { have: Math.min(streak, 3), need: 3 };
  if (id === "streak-7") return { have: Math.min(streak, 7), need: 7 };
  if (id === "level-10") return { have: Math.min(levelFor(xp).level, 10), need: 10 };
  return null;
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Consecutive login days ending today (or yesterday, so the streak survives until tonight). */
export function streakFor(days: string[], today = new Date()): number {
  const set = new Set(days);
  const d = new Date(today);
  if (!set.has(todayKey(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(todayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function bestStreakFor(days: string[]): number {
  const sorted = [...new Set(days)].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const k of sorted) {
    const [y, m, d] = k.split("-").map(Number);
    const cur = new Date(y, m - 1, d);
    run = prev && Math.round((cur.getTime() - prev.getTime()) / 86400000) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = cur;
  }
  return best;
}
