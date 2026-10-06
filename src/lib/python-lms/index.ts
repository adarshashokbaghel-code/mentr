import { PYTHON_BEGINNER_LESSONS } from "@/lib/learn-python";
import { LESSON_01 } from "@/lib/python-lms/lesson-01";
import { LESSON_02 } from "@/lib/python-lms/lesson-02";
import { LESSON_03 } from "@/lib/python-lms/lesson-03";
import { LESSON_04 } from "@/lib/python-lms/lesson-04";
import { LESSON_05 } from "@/lib/python-lms/lesson-05";
import { LESSON_06 } from "@/lib/python-lms/lesson-06";
import { LESSON_07 } from "@/lib/python-lms/lesson-07";
import { LESSON_08 } from "@/lib/python-lms/lesson-08";
import { LESSON_09 } from "@/lib/python-lms/lesson-09";
import type { PythonLmsLesson } from "@/lib/python-lms/types";

export const PY_LMS_BASE = "/learnpython/lms";
export const PY_COMPILER_PATH = `${PY_LMS_BASE}/compiler`;
export const PY_PRACTICE_PATH = `${PY_LMS_BASE}/practice`;
export const PY_FINAL_PATH = `${PY_LMS_BASE}/final`;
export const PY_PROFILE_PATH = `${PY_LMS_BASE}/profile`;
/** The last lesson is the Final Challenge: projects instead of Study/Examples/Practice, open from day one. */
export const PY_FINAL_SLUG = "lesson-10";

export const pyProjectHref = (id: string) => `${PY_FINAL_PATH}/${id}`;

const CONTENT: Record<string, PythonLmsLesson> = {
  [LESSON_01.slug]: LESSON_01,
  [LESSON_02.slug]: LESSON_02,
  [LESSON_03.slug]: LESSON_03,
  [LESSON_04.slug]: LESSON_04,
  [LESSON_05.slug]: LESSON_05,
  [LESSON_06.slug]: LESSON_06,
  [LESSON_07.slug]: LESSON_07,
  [LESSON_08.slug]: LESSON_08,
  [LESSON_09.slug]: LESSON_09,
};

export type PyLessonEntry = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  concepts: string[];
  available: boolean;
  final: boolean;
};

export const PY_LESSON_INDEX: PyLessonEntry[] = PYTHON_BEGINNER_LESSONS.map((l) => {
  const slug = `lesson-${l.number}`;
  return {
    slug,
    number: l.number,
    title: l.title,
    subtitle: l.subtitle,
    concepts: l.concepts,
    available: slug in CONTENT || slug === PY_FINAL_SLUG,
    final: slug === PY_FINAL_SLUG,
  };
});

/** Lessons open by Study progress; the Final Challenge is always open. */
export function isPyEntryOpen(entry: PyLessonEntry, isLessonUnlocked: (slug: string) => boolean): boolean {
  return entry.final || (entry.available && isLessonUnlocked(entry.slug));
}

export const PY_LESSON_ORDER: string[] = [...PY_LESSON_INDEX].sort((a, b) => a.number - b.number).map((l) => l.slug);

export function getPyLesson(slug: string): PythonLmsLesson | null {
  return CONTENT[slug] ?? null;
}

export function pyLessonHref(slug: string): string {
  if (slug === PY_FINAL_SLUG) return PY_FINAL_PATH;
  return `${PY_LMS_BASE}/${slug}`;
}
