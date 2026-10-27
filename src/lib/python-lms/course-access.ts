import type { PyLessonProgress } from "@/lib/python-lms/lesson-progress";
import { unlockedLessons } from "@/lib/python-lms/lesson-progress";
import type { PyPlacement } from "@/lib/python-lms/progress";

/** Beginner lesson-9 Study done = comfortable with functions — alternate gate. */
export function beginnerPathUnlocksIntermediate(lessons: Record<string, PyLessonProgress | undefined>): boolean {
  return Boolean(lessons["lesson-9"]?.notesDone);
}

export function hasIntermediateAccess(
  lessons: Record<string, PyLessonProgress | undefined>,
  placement?: PyPlacement | null,
  serverFlag?: boolean,
): boolean {
  if (serverFlag) return true;
  if (placement?.passed) return true;
  return beginnerPathUnlocksIntermediate(lessons);
}

export function unlockedIntermediateLessonSlugs(
  order: string[],
  lessons: Record<string, PyLessonProgress | undefined>,
  access: boolean,
): Set<string> {
  if (!access) return new Set();
  return unlockedLessons(order, lessons);
}

export function isIntermediateSlug(slug: string): boolean {
  return slug.startsWith("int-");
}

/** Progress-based unlock list plus admin/QA slugs stored on the user (not removed on sync). */
export function mergeStoredUnlockedLessons(
  computed: string[],
  stored: string[] | undefined,
  intermediateAccess: boolean,
): string[] {
  const set = new Set(computed);
  for (const slug of stored ?? []) {
    if (typeof slug !== "string" || !slug) continue;
    if (isIntermediateSlug(slug) && !intermediateAccess) continue;
    set.add(slug);
  }
  return [...set];
}

export function lessonOpenForSync(
  order: string[],
  slug: string,
  lessons: Record<string, PyLessonProgress | undefined>,
  storedUnlocked: string[] | undefined,
): boolean {
  return unlockedLessons(order, lessons).has(slug) || (storedUnlocked?.includes(slug) ?? false);
}
