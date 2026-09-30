import type {
  LessonNotesDefinition,
  LessonNotesPanel,
} from "../learn-lesson-notes";

/** Notes body for one lesson — title, unit, chapter and filename are derived from the curriculum. */
export type LessonNotesCore = {
  bigIdea: string;
  definitions: LessonNotesDefinition[];
  panels: LessonNotesPanel[];
  remember: string[];
  checkYourself: { q: string; a: string };
  dinoLine: string;
};

export type LessonQuizItem = {
  difficulty: "easy" | "medium" | "hard";
  type: "mcq" | "true_false";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type LessonContent = {
  /** Omitted when hand-written notes already exist (e.g. A1–A5). */
  notes?: LessonNotesCore;
  /** Exactly 10 items: 4 easy, 4 medium, 2 hard. */
  quiz: LessonQuizItem[];
};

export type LessonContentBank = Record<string, LessonContent>;
