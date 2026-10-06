export type PyLessonProgress = {
  notesSlide?: number;
  /** Highest slide index reached. */
  slidesSeen?: number;
  notesDone?: boolean;
  /** Quick-check id → right on first try. */
  checks?: Record<string, boolean>;
  examplesDone?: boolean;
  practice?: { score: number; total: number };
  bestScore?: number;
  stars?: number;
  completedAt?: string;
};

/** Lesson 1 is always open; each next lesson opens once every Study slide of the one before has been seen. */
export function unlockedLessons(order: string[], lessons: Record<string, PyLessonProgress | undefined>): Set<string> {
  const open = new Set<string>();
  for (let i = 0; i < order.length; i++) {
    if (i > 0 && !lessons[order[i - 1]]?.notesDone) break;
    open.add(order[i]);
  }
  return open;
}

const num = (v: unknown, max: number) => (typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= max ? Math.floor(v) : undefined);
const max = (a?: number, b?: number) => (a === undefined ? b : b === undefined ? a : Math.max(a, b));

/** Keeps only known fields with sane values; returns null for anything that isn't an object. */
export function cleanLessonProgress(raw: unknown): PyLessonProgress | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const out: PyLessonProgress = {};
  const notesSlide = num(r.notesSlide, 500);
  const slidesSeen = num(r.slidesSeen, 500);
  const bestScore = num(r.bestScore, 500);
  const stars = num(r.stars, 3);
  if (notesSlide !== undefined) out.notesSlide = notesSlide;
  if (slidesSeen !== undefined) out.slidesSeen = slidesSeen;
  if (bestScore !== undefined) out.bestScore = bestScore;
  if (stars !== undefined) out.stars = stars;
  if (r.notesDone === true) out.notesDone = true;
  if (r.examplesDone === true) out.examplesDone = true;
  if (typeof r.completedAt === "string" && !Number.isNaN(Date.parse(r.completedAt))) out.completedAt = r.completedAt;
  if (r.checks && typeof r.checks === "object" && !Array.isArray(r.checks)) {
    const checks = Object.entries(r.checks as Record<string, unknown>)
      .filter(([id, v]) => /^[\w-]{1,60}$/.test(id) && typeof v === "boolean")
      .slice(0, 200);
    if (checks.length) out.checks = Object.fromEntries(checks) as Record<string, boolean>;
  }
  const p = r.practice as Record<string, unknown> | undefined;
  const score = num(p?.score, 500);
  const total = num(p?.total, 500);
  if (score !== undefined && total !== undefined && score <= total) out.practice = { score, total };
  return out;
}

/** Combines two copies of a lesson's progress without losing work: flags stay set, bests keep the max, `next` wins for position. */
export function mergeLessonProgress(prev: PyLessonProgress | undefined, next: PyLessonProgress | undefined): PyLessonProgress {
  const a = prev ?? {};
  const b = next ?? {};
  const out: PyLessonProgress = { ...a, ...b };
  const slidesSeen = max(a.slidesSeen, b.slidesSeen);
  const bestScore = max(a.bestScore, b.bestScore);
  const stars = max(a.stars, b.stars);
  if (slidesSeen !== undefined) out.slidesSeen = slidesSeen;
  if (bestScore !== undefined) out.bestScore = bestScore;
  if (stars !== undefined) out.stars = stars;
  if (a.notesDone || b.notesDone) out.notesDone = true;
  if (a.examplesDone || b.examplesDone) out.examplesDone = true;
  if (a.checks || b.checks) out.checks = { ...b.checks, ...a.checks };
  const done = [a.completedAt, b.completedAt].filter((x): x is string => Boolean(x)).sort();
  if (done.length) out.completedAt = done[0];
  return out;
}
