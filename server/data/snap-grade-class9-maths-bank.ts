import {
  expandChapter,
  type SeedQuestion,
  CBSE_CLASS9_MATHS_NOTES,
  CBSE_MATHS_MARKING_NOTES,
  defaultRubric,
  trueFalseReasonRubric,
  buildPracticeRubric,
  inferPracticeMarks,
} from "./snap-grade-seed-helpers";
import { NCERT_EXTRACTED_CHAPTERS } from "./snap-grade-ncert-extracted";
import { CLASS10_MATHS_EXTRACTED } from "./snap-grade-class10-maths-extracted";
import { CLASS11_MATHS_EXTRACTED } from "./snap-grade-class11-maths-extracted";
import { CLASS12_MATHS_EXTRACTED } from "./snap-grade-class12-maths-extracted";
import { CLASS9_SCIENCE_EXTRACTED } from "./snap-grade-class9-science-extracted";
import { CLASS10_SCIENCE_EXTRACTED } from "./snap-grade-class10-science-extracted";
import { CLASS11_PHYSICS_EXTRACTED } from "./snap-grade-class11-physics-extracted";
import { CLASS12_PHYSICS_EXTRACTED } from "./snap-grade-class12-physics-extracted";
import { CLASS11_CHEMISTRY_EXTRACTED } from "./snap-grade-class11-chemistry-extracted";
import { CLASS12_CHEMISTRY_EXTRACTED } from "./snap-grade-class12-chemistry-extracted";
import { CLASS11_BIOLOGY_EXTRACTED } from "./snap-grade-class11-biology-extracted";
import { CLASS12_BIOLOGY_EXTRACTED } from "./snap-grade-class12-biology-extracted";

export type { SeedQuestion };
export {
  CBSE_CLASS9_MATHS_NOTES,
  CBSE_MATHS_MARKING_NOTES,
  defaultRubric,
  trueFalseReasonRubric,
  buildPracticeRubric,
  inferPracticeMarks,
};

/**
 * Full CBSE Maths bank — Classes 9–12, every exercise question extracted from
 * the hosted NCERT chapter PDFs (including optional sets).
 */
export const CLASS9_MATHS_ALL_SEED: SeedQuestion[] =
  NCERT_EXTRACTED_CHAPTERS.flatMap(expandChapter);

export const CLASS10_MATHS_ALL_SEED: SeedQuestion[] =
  CLASS10_MATHS_EXTRACTED.flatMap(expandChapter);

export const CLASS11_MATHS_ALL_SEED: SeedQuestion[] =
  CLASS11_MATHS_EXTRACTED.flatMap(expandChapter);

export const CLASS12_MATHS_ALL_SEED: SeedQuestion[] =
  CLASS12_MATHS_EXTRACTED.flatMap(expandChapter);

export const CLASS9_SCIENCE_ALL_SEED: SeedQuestion[] =
  CLASS9_SCIENCE_EXTRACTED.flatMap(expandChapter);

export const CLASS10_SCIENCE_ALL_SEED: SeedQuestion[] =
  CLASS10_SCIENCE_EXTRACTED.flatMap(expandChapter);

export const CLASS11_PHYSICS_ALL_SEED: SeedQuestion[] =
  CLASS11_PHYSICS_EXTRACTED.flatMap(expandChapter);

export const CLASS12_PHYSICS_ALL_SEED: SeedQuestion[] =
  CLASS12_PHYSICS_EXTRACTED.flatMap(expandChapter);

export const CLASS11_CHEMISTRY_ALL_SEED: SeedQuestion[] =
  CLASS11_CHEMISTRY_EXTRACTED.flatMap(expandChapter);

export const CLASS12_CHEMISTRY_ALL_SEED: SeedQuestion[] =
  CLASS12_CHEMISTRY_EXTRACTED.flatMap(expandChapter);

export const CLASS11_BIOLOGY_ALL_SEED: SeedQuestion[] =
  CLASS11_BIOLOGY_EXTRACTED.flatMap(expandChapter);

export const CLASS12_BIOLOGY_ALL_SEED: SeedQuestion[] =
  CLASS12_BIOLOGY_EXTRACTED.flatMap(expandChapter);

export const SNAP_GRADE_ALL_MATHS_SEED: SeedQuestion[] = [
  ...CLASS9_MATHS_ALL_SEED,
  ...CLASS10_MATHS_ALL_SEED,
  ...CLASS11_MATHS_ALL_SEED,
  ...CLASS12_MATHS_ALL_SEED,
];

/** Full Snap & Grade bank — Maths 9–12 + Science 9–10 + Physics/Chemistry/Biology 11–12 */
export const SNAP_GRADE_ALL_SEED: SeedQuestion[] = [
  ...SNAP_GRADE_ALL_MATHS_SEED,
  ...CLASS9_SCIENCE_ALL_SEED,
  ...CLASS10_SCIENCE_ALL_SEED,
  ...CLASS11_PHYSICS_ALL_SEED,
  ...CLASS12_PHYSICS_ALL_SEED,
  ...CLASS11_CHEMISTRY_ALL_SEED,
  ...CLASS12_CHEMISTRY_ALL_SEED,
  ...CLASS11_BIOLOGY_ALL_SEED,
  ...CLASS12_BIOLOGY_ALL_SEED,
];

export const CLASS9_MATHS_CH1_SEED = CLASS9_MATHS_ALL_SEED.filter(
  (q) => q.chapterNumber === 1,
);

/** Friendly label for exercise dropdown / textbook chrome */
export function formatExerciseLabel(exercise: string): string {
  if (exercise.endsWith("-optional") || exercise.endsWith(".E-optional")) {
    const core = exercise.replace(/-optional$/, "").replace(/\.E$/i, "");
    return `Optional · Ex ${core}`;
  }
  if (/^\d+\.E$/i.test(exercise) || exercise === "Exercises") {
    return "Exercises";
  }
  if (exercise === "EOC" || exercise.startsWith("EOC")) {
    return "End of chapter";
  }
  if (exercise.includes("-TR")) {
    return `Think & Reflect · ${exercise.replace(/-TR$/, "")}`;
  }
  return `Exercise ${exercise}`;
}
