import { PY_LESSON_INDEX, PY_LESSON_ORDER, getPyLesson } from "../../src/lib/python-lms";
import { ACHIEVEMENTS, bestStreakFor, levelFor, streakFor } from "../../src/lib/python-lms/game";
import {
  cleanLessonProgress,
  mergeLessonProgress,
  unlockedLessons,
  type PyLessonProgress,
} from "../../src/lib/python-lms/lesson-progress";
import { PRACTICE_BANK, type PracticeLevel } from "../../src/lib/python-lms/practice-bank";
import {
  cleanProjectProgress,
  completedProjects,
  mergeProjectProgress,
  type PyProjectProgress,
} from "../../src/lib/python-lms/project-progress";
import { getPyProject } from "../../src/lib/python-lms/projects";
import { PY_XP, awardKind, bankAwardKey, loginAwardKey, projectAwardKey, videoAwardKey } from "../../src/lib/python-lms/rules";
import { User, type ILearnPython, type ILearnPythonCounts } from "../models/User";

const MAX_AWARDS_PER_SYNC = 2000;
const MAX_DAYS_KEPT = 400;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

type Award = { xp: number; at: string };

export type LearnPythonState = {
  firstVisitAt: string | null;
  /** True when this sync granted today's daily login XP. */
  loginAwarded: boolean;
  xp: number;
  awarded: Record<string, number>;
  lessons: Record<string, PyLessonProgress>;
  achievements: Record<string, string>;
  days: string[];
  /** Lesson slugs open to this learner, in course order. */
  unlockedLessons: string[];
  projects: Record<string, PyProjectProgress>;
  certificateId: string | null;
};

let catalog: Map<string, number> | null = null;
let bankLevels: Map<string, PracticeLevel> | null = null;

/** Every award key the course can hand out, with its XP. Anything else a client sends is ignored. */
function awardCatalog(): Map<string, number> {
  if (catalog) return catalog;
  const map = new Map<string, number>();
  bankLevels = new Map();
  for (const item of PRACTICE_BANK) {
    map.set(bankAwardKey(item.id), PY_XP.practice[item.level]);
    bankLevels.set(bankAwardKey(item.id), item.level);
  }
  for (const entry of PY_LESSON_INDEX) {
    map.set(videoAwardKey(entry.slug), PY_XP.video);
    const lesson = getPyLesson(entry.slug);
    if (!lesson) continue;
    for (const slide of lesson.notes) {
      for (const block of slide.blocks) {
        if (block.type === "check") map.set(`check:${lesson.slug}:${block.id}`, PY_XP.quickCheck);
      }
    }
    for (const ex of lesson.examples) {
      if (ex.type === "trace") map.set(`trace:${lesson.slug}:${ex.id}`, PY_XP.example);
      else if (ex.goal) map.set(`goal:${lesson.slug}:${ex.id}`, PY_XP.example);
    }
    for (const q of lesson.practice) map.set(`q:${lesson.slug}:${q.id}`, PY_XP.lessonQuestion);
  }
  catalog = map;
  return map;
}

/** The lesson an award belongs to, or null for course-wide awards (login, Practice bank). */
function lessonOfAward(key: string): string | null {
  const kind = awardKind(key);
  if (kind !== "video" && kind !== "example" && kind !== "lesson" && kind !== "check") return null;
  return key.split(":")[1] ?? null;
}

function utcDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

/** The learner's local date, accepted only if some real timezone (UTC−12 … UTC+14) is on that date right now. */
function pickDay(raw: unknown, now: Date): string {
  const t = now.getTime();
  const earliest = utcDay(t - 12 * 3600_000);
  const latest = utcDay(t + 14 * 3600_000);
  if (typeof raw === "string" && DAY_RE.test(raw) && raw >= earliest && raw <= latest) return raw;
  return utcDay(t + 5.5 * 3600_000);
}

function dayToDate(day: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function emptyCounts(): ILearnPythonCounts {
  return {
    logins: 0,
    practiceEasy: 0,
    practiceMedium: 0,
    practiceHard: 0,
    videos: 0,
    examples: 0,
    lessonQuestions: 0,
    quickChecks: 0,
    projects: 0,
  };
}

function countAwards(awards: Record<string, Award>): { xp: number; counts: ILearnPythonCounts } {
  awardCatalog();
  const counts = emptyCounts();
  let xp = 0;
  for (const [key, award] of Object.entries(awards)) {
    xp += Number(award?.xp) || 0;
    const kind = awardKind(key);
    if (kind === "login") counts.logins++;
    else if (kind === "video") counts.videos++;
    else if (kind === "example") counts.examples++;
    else if (kind === "lesson") counts.lessonQuestions++;
    else if (kind === "check") counts.quickChecks++;
    else if (kind === "project") counts.projects++;
    else if (kind === "practice") {
      const level = bankLevels?.get(key);
      if (level === "easy") counts.practiceEasy++;
      else if (level === "medium") counts.practiceMedium++;
      else if (level === "hard") counts.practiceHard++;
    }
  }
  return { xp, counts };
}

function toState(lp: Partial<ILearnPython> | undefined, loginAwarded: boolean): LearnPythonState {
  const awards = (lp?.awards ?? {}) as Record<string, Award>;
  return {
    firstVisitAt: lp?.firstVisitAt ? new Date(lp.firstVisitAt).toISOString() : null,
    loginAwarded,
    xp: lp?.xp ?? 0,
    awarded: Object.fromEntries(Object.entries(awards).map(([k, a]) => [k, Number(a?.xp) || 0])),
    lessons: (lp?.lessons ?? {}) as Record<string, PyLessonProgress>,
    achievements: (lp?.achievements ?? {}) as Record<string, string>,
    days: [...(lp?.days ?? [])].sort().slice(-MAX_DAYS_KEPT),
    unlockedLessons: lp?.unlockedLessons ?? [],
    projects: (lp?.projects ?? {}) as Record<string, PyProjectProgress>,
    certificateId: lp?.certificate?.id ?? null,
  };
}

export type LearnPythonSyncInput = {
  day?: unknown;
  awards?: unknown;
  lessons?: unknown;
  achievements?: unknown;
  projects?: unknown;
};

/** Times come from the server, not the browser. A project can be completed after its solution was opened. */
function acceptProject(id: string, raw: unknown, prev: PyProjectProgress | undefined, now: Date): PyProjectProgress | null {
  const project = getPyProject(id);
  const clean = cleanProjectProgress(raw);
  if (!project || !clean) return null;
  const at = now.toISOString();
  const newSolution = Boolean(clean.solutionViewedAt && !prev?.solutionViewedAt);
  let newDone = Boolean(clean.completedAt && !prev?.completedAt);
  if (newDone && !project.codeRules.every((rule) => rule.test(clean.code ?? ""))) newDone = false;

  const next: PyProjectProgress = { hintsUsed: clean.hintsUsed };
  if (newSolution) next.solutionViewedAt = at;
  if (newDone) {
    next.completedAt = at;
    next.code = clean.code;
  }
  return mergeProjectProgress(prev, next);
}

/**
 * Records a visit (creating `learnPython` on the first one), grants today's login XP, and merges
 * whatever progress the browser sends. XP always comes from the server's catalog, never the client.
 */
export async function syncLearnPython(userId: string, input: LearnPythonSyncInput): Promise<LearnPythonState> {
  const now = new Date();
  const at = now.toISOString();
  const day = pickDay(input.day, now);

  await User.updateOne(
    { _id: userId, "learnPython.visited": { $ne: true } },
    { $set: { "learnPython.visited": true, "learnPython.firstVisitAt": now } },
  );

  const user = await User.findById(userId).select("learnPython").lean<{ learnPython?: ILearnPython }>();
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
  const cur = user.learnPython;
  const curAwards = (cur?.awards ?? {}) as Record<string, Award>;
  const curLessons = (cur?.lessons ?? {}) as Record<string, PyLessonProgress>;
  const curAchievements = (cur?.achievements ?? {}) as Record<string, string>;

  const set: Record<string, unknown> = { "learnPython.lastVisitAt": now };
  const cat = awardCatalog();
  const videos: string[] = [];

  // Lessons go in course order so finishing one lesson's Study in this sync opens the next for the same sync.
  const incoming =
    input.lessons && typeof input.lessons === "object" && !Array.isArray(input.lessons)
      ? (input.lessons as Record<string, unknown>)
      : {};
  const merged: Record<string, PyLessonProgress> = { ...curLessons };
  for (const slug of PY_LESSON_ORDER) {
    if (!(slug in incoming) || !unlockedLessons(PY_LESSON_ORDER, merged).has(slug)) continue;
    const clean = cleanLessonProgress(incoming[slug]);
    if (!clean) continue;
    const lastSlide = (getPyLesson(slug)?.notes.length ?? 1) - 1;
    if (clean.notesDone && Math.max(clean.slidesSeen ?? 0, curLessons[slug]?.slidesSeen ?? 0) < lastSlide) delete clean.notesDone;
    merged[slug] = mergeLessonProgress(curLessons[slug], clean);
    set[`learnPython.lessons.${slug}`] = merged[slug];
  }
  const open = unlockedLessons(PY_LESSON_ORDER, merged);

  const keys = Array.isArray(input.awards) ? input.awards.slice(0, MAX_AWARDS_PER_SYNC) : [];
  const login = loginAwardKey(day);
  for (const key of [login, ...keys]) {
    if (typeof key !== "string" || key in curAwards || `learnPython.awards.${key}` in set) continue;
    const xp = key === login ? PY_XP.dailyLogin : cat.get(key);
    if (!xp) continue;
    const lessonSlug = lessonOfAward(key);
    if (lessonSlug && !open.has(lessonSlug)) continue;
    set[`learnPython.awards.${key}`] = { xp, at } satisfies Award;
    if (awardKind(key) === "video") videos.push(key.slice(key.indexOf(":") + 1));
  }

  if (input.achievements && typeof input.achievements === "object" && !Array.isArray(input.achievements)) {
    for (const [id, raw] of Object.entries(input.achievements as Record<string, unknown>)) {
      if (!(id in ACHIEVEMENTS) || curAchievements[id]) continue;
      const when = typeof raw === "string" && !Number.isNaN(Date.parse(raw)) && Date.parse(raw) <= now.getTime() ? raw : at;
      set[`learnPython.achievements.${id}`] = when;
    }
  }

  const curProjects = (cur?.projects ?? {}) as Record<string, PyProjectProgress>;
  if (input.projects && typeof input.projects === "object" && !Array.isArray(input.projects)) {
    for (const [id, raw] of Object.entries(input.projects as Record<string, unknown>)) {
      const next = acceptProject(id, raw, curProjects[id], now);
      if (!next) continue;
      set[`learnPython.projects.${id}`] = next;
      const award = projectAwardKey(id);
      if (next.completedAt && !curProjects[id]?.completedAt && !(award in curAwards)) {
        set[`learnPython.awards.${award}`] = { xp: PY_XP.project, at } satisfies Award;
      }
    }
  }

  const addToSet: Record<string, unknown> = { "learnPython.days": day };
  if (videos.length) addToSet["learnPython.videosWatched"] = { $each: videos };

  const updated = await User.findByIdAndUpdate(userId, { $set: set, $addToSet: addToSet }, { returnDocument: "after" })
    .select("learnPython")
    .lean<{ learnPython?: ILearnPython }>();
  const lp = updated?.learnPython;

  const { xp, counts } = countAwards((lp?.awards ?? {}) as Record<string, Award>);
  const days = [...new Set(lp?.days ?? [])].sort().slice(-MAX_DAYS_KEPT);
  const streak = streakFor(days, dayToDate(day));
  const lvl = levelFor(xp);
  const finalLessons = (lp?.lessons ?? {}) as Record<string, PyLessonProgress>;
  const lessonsCompleted = Object.values(finalLessons).filter((l) => l?.completedAt).length;
  const unlocked = [...unlockedLessons(PY_LESSON_ORDER, finalLessons)];
  const projectsCompleted = completedProjects((lp?.projects ?? {}) as Record<string, PyProjectProgress>).length;

  await User.updateOne(
    { _id: userId },
    {
      $set: {
        "learnPython.xp": xp,
        "learnPython.level": lvl.level,
        "learnPython.levelTitle": lvl.title,
        "learnPython.band": lvl.band.name,
        "learnPython.streakDays": streak,
        "learnPython.bestStreak": Math.max(bestStreakFor(days), streak, lp?.bestStreak ?? 0),
        "learnPython.lessonsCompleted": lessonsCompleted,
        "learnPython.unlockedLessons": unlocked,
        "learnPython.projectsCompleted": projectsCompleted,
        "learnPython.counts": counts,
        ...((lp?.days?.length ?? 0) > MAX_DAYS_KEPT ? { "learnPython.days": days } : {}),
      },
    },
  );

  return toState({ ...lp, xp, days, unlockedLessons: unlocked }, `learnPython.awards.${login}` in set);
}
