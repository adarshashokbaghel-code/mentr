"use client";

import type { PyLessonProgress } from "@/lib/python-lms/lesson-progress";
import type { PyProjectProgress } from "@/lib/python-lms/project-progress";
import type { LessonStage } from "@/lib/python-lms/types";

export type { PyLessonProgress, PyProjectProgress };

export const PY_STAGES: { id: LessonStage; label: string }[] = [
  { id: "notes", label: "Study" },
  { id: "examples", label: "Examples" },
  { id: "practice", label: "Practice" },
];

export type PyStore = {
  v: 3;
  lessons: Record<string, PyLessonProgress>;
  /** Award key → XP, so each action is rewarded once. The server's copy is the source of truth. */
  awarded: Record<string, number>;
  /** Achievement id → ISO date unlocked. */
  achievements: Record<string, string>;
  /** Days the learner logged in and opened the course, as YYYY-MM-DD. */
  days: string[];
  /** Final Challenge project id → progress. The server decides what counts as completed. */
  projects: Record<string, PyProjectProgress>;
};

export const emptyStore = (): PyStore => ({ v: 3, lessons: {}, awarded: {}, achievements: {}, days: [], projects: {} });

const draftKey = (userId: string, projectId: string) => `mentr:learnpython:project:${userId}:${projectId}`;

/** Work in progress on a project stays on this device until it passes. */
export function readProjectDraft(userId: string, projectId: string): string | null {
  try {
    return window.localStorage.getItem(draftKey(userId, projectId));
  } catch {
    return null;
  }
}

export function writeProjectDraft(userId: string, projectId: string, code: string): void {
  try {
    window.localStorage.setItem(draftKey(userId, projectId), code);
  } catch {
    // Storage full or blocked; the draft lives in memory for this visit.
  }
}

const CORRECT_ANSWER_KEY = /^(q|check|goal):/;

/** v2 gave XP for reading and finishing too; v3 keeps only correct answers, at 1 XP each. */
function migrateAwarded(awarded: Record<string, number> = {}): Record<string, number> {
  return Object.fromEntries(Object.keys(awarded).filter((k) => CORRECT_ANSWER_KEY.test(k)).map((k) => [k, 1]));
}

export function stageDone(p: PyLessonProgress | undefined, stage: LessonStage): boolean {
  if (stage === "notes") return Boolean(p?.notesDone);
  if (stage === "examples") return Boolean(p?.examplesDone);
  return Boolean(p?.completedAt);
}

/** The stage a learner should land on when they open the lesson. */
export function resumeStage(p: PyLessonProgress | undefined): LessonStage {
  if (!p?.notesDone) return "notes";
  if (!p.examplesDone) return "examples";
  return "practice";
}

const key = (userId: string) => `mentr:learnpython:progress:${userId}`;

export function readPyProgress(userId: string): PyStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(key(userId));
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    if (parsed?.v === 3) return { ...emptyStore(), ...parsed };
    if (parsed?.v === 2) return { ...emptyStore(), ...parsed, v: 3, awarded: migrateAwarded(parsed.awarded) };
    return { ...emptyStore(), lessons: parsed ?? {} };
  } catch {
    return emptyStore();
  }
}

/** Days kept for streak history; about a year. */
export const MAX_DAYS_KEPT = 400;

export function writePyProgress(userId: string, store: PyStore): void {
  try {
    window.localStorage.setItem(key(userId), JSON.stringify(store));
  } catch {
    // Storage full or blocked; progress stays in memory for this visit.
  }
}
