import type { PythonRunResult } from "@/lib/python-runner";

/** Inline text supports `code` spans and **bold**. */
export type NoteBlock =
  | { type: "p"; text: string }
  | { type: "lead"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | {
      type: "code";
      code: string;
      output?: string;
      filename?: string;
      shell?: boolean;
      /** Run this snippet on the slide. */
      live?: boolean;
      /** One string per input() call. Shown as editable keyboard answers when live. */
      inputs?: string[];
    }
  | { type: "callout"; tone: "tip" | "warn" | "fact" | "exam"; title?: string; text: string }
  | { type: "compare"; left: CompareSide; right: CompareSide }
  | { type: "anatomy"; code: string; parts: { token: string; label: string }[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "flow"; title?: string; steps: { kind: "terminal" | "io" | "process" | "decision"; text: string }[] }
  | { type: "terms"; items: { term: string; meaning: string }[] }
  | { type: "flashcards"; cards: { q: string; a: string }[] }
  | QuickCheck;

export type QuickCheck = {
  type: "check";
  id: string;
  question: string;
  code?: string;
  options: string[];
  codeOptions?: boolean;
  answer: number;
  explain: string;
};

export type CompareSide = { label: string; code: string; output: string; tone: "good" | "bad" | "neutral" };

export type NoteSlide = {
  id: string;
  /** Part label, e.g. "Part 2 · Languages". */
  part: string;
  title: string;
  blocks: NoteBlock[];
};

export type TraceStep = { line: number; output?: string; /** Output stays on the same line (end=""). */ inline?: boolean; note: string };

export type ExampleItem =
  | {
      type: "trace";
      id: string;
      title: string;
      intro: string;
      code: string;
      steps: TraceStep[];
    }
  | {
      type: "playground";
      id: string;
      title: string;
      intro: string;
      starter: string;
      tryThis: string[];
      /** Prefill for the keyboard box: one line per input() call. The box is shown when this is set. */
      inputs?: string;
      goal?: { text: string; check: (r: PythonRunResult, code: string) => boolean; success: string };
      /** Unlocks this achievement when the goal is met. */
      achievement?: string;
    };

export type WriteCheck = (r: PythonRunResult, code: string) => string | null;

export type Level = "easy" | "medium" | "hard";

type Base = { id: string; skill: string; level: Level; prompt: string };

export type PracticeQuestion =
  | (Base & {
      type: "mcq";
      code?: string;
      options: string[];
      codeOptions?: boolean;
      answer: number;
      explain: string;
    })
  | (Base & {
      type: "order";
      /** In the correct order; the UI shuffles them. */
      lines: string[];
      code?: boolean;
      explain: string;
    })
  | (Base & {
      type: "fill";
      /** Code shown with ___ where the learner types. Omit for "type the output" questions. */
      code?: string;
      /** Accepted answers. */
      answers: string[];
      /** "code" ignores spaces; "text" trims and collapses spaces. */
      mode: "code" | "text";
      placeholder?: string;
      explain: string;
    })
  | (Base & {
      type: "write";
      starter: string;
      expected?: string;
      /** Lines fed to input(), in order, when the answer is checked. */
      inputs?: string[];
      check?: WriteCheck;
      hint: string;
      solution: string;
      challenge?: boolean;
    });

export type PythonLmsLesson = {
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  minutes: number;
  goals: string[];
  notes: NoteSlide[];
  examples: ExampleItem[];
  practice: PracticeQuestion[];
  canDo: string;
};

export type LessonStage = "notes" | "examples" | "practice";
