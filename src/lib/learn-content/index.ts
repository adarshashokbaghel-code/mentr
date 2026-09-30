import { getModuleById, LEARN_TRACKS } from "../learn-curriculum";
import { MODULE_DETAILS } from "../learn-module-details";
import { AI_CONTENT_1 } from "./ai-1";
import { AI_CONTENT_2 } from "./ai-2";
import { CS_CONTENT_1 } from "./cs-1";
import { CS_CONTENT_2 } from "./cs-2";
import { MATH_CONTENT_1 } from "./math-1";
import { MATH_CONTENT_2 } from "./math-2";
import type { LessonContent, LessonContentBank } from "./types";

export type { LessonContent, LessonContentBank, LessonNotesCore, LessonQuizItem } from "./types";

/** Notes + quiz for every module after the hand-seeded A1–A4 (A5 is quiz-only). */
export const LESSON_CONTENT_BANK: LessonContentBank = {
  ...CS_CONTENT_1,
  ...CS_CONTENT_2,
  ...AI_CONTENT_1,
  ...AI_CONTENT_2,
  ...MATH_CONTENT_1,
  ...MATH_CONTENT_2,
};

export function getLessonContent(moduleId: string): LessonContent | null {
  return LESSON_CONTENT_BANK[moduleId.trim().toUpperCase()] ?? null;
}

export type LessonMeta = {
  moduleId: string;
  title: string;
  trackId: "cs" | "ai" | "math";
  trackLabel: string;
  unitId: string;
  unitTitle: string;
  unitNumber: number;
  chapterNumber: number;
  chapterCount: number;
  chapterLabel: string;
  unitLabel: string;
  level: "Easy" | "Building" | "Stretch" | "Apply";
  slug: string;
};

const TRACK_UNIT_PREFIX: Record<string, string> = { cs: "CS", ai: "AI", math: "Math" };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Curriculum-derived labels for any module (title, unit, chapter, level). */
export function getLessonMeta(moduleId: string): LessonMeta | null {
  const id = moduleId.trim().toUpperCase();
  const mod = getModuleById(id);
  if (!mod) return null;
  for (const track of LEARN_TRACKS) {
    const ui = track.units.findIndex((u) => u.modules.some((m) => m.id === id));
    if (ui < 0) continue;
    const unit = track.units[ui]!;
    const ci = unit.modules.findIndex((m) => m.id === id);
    const prefix = TRACK_UNIT_PREFIX[track.id] ?? track.shortLabel;
    return {
      moduleId: id,
      title: mod.title,
      trackId: track.id,
      trackLabel: track.label,
      unitId: unit.id,
      unitTitle: unit.title,
      unitNumber: ui + 1,
      chapterNumber: ci + 1,
      chapterCount: unit.modules.length,
      chapterLabel: `Chapter ${ci + 1} of ${unit.modules.length}`,
      unitLabel: `${prefix} Unit ${ui + 1} · ${unit.title}`,
      level: MODULE_DETAILS[id]?.level ?? "Easy",
      slug: slugify(mod.title),
    };
  }
  return null;
}
