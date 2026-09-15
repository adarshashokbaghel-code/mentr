/**
 * Class notes content for Learn videos — derived from mentoring scripts
 * (not PPT decks). Simpler wording for Class 3–5.
 */

export type LessonNotesDefinition = {
  term: string;
  meaning: string;
};

export type LessonNotesPanel = {
  title: string;
  body: string[];
};

export type LessonNotesDoc = {
  moduleId: string;
  title: string;
  unitLabel: string;
  chapterLabel: string;
  level: string;
  filename: string;
  bigIdea: string;
  definitions: LessonNotesDefinition[];
  panels: LessonNotesPanel[];
  remember: string[];
  checkYourself: { q: string; a: string };
  dinoLine: string;
};

export const A1_LESSON_NOTES: LessonNotesDoc = {
  moduleId: "A1",
  title: "What Is a Computer?",
  unitLabel: "CS Unit 1 · How Computers Work",
  chapterLabel: "Chapter 1 of 5",
  level: "Easy",
  filename: "Mentr-Learn-A1-What-Is-a-Computer-Notes.pdf",
  bigIdea:
    "A computer is a special machine with three jobs: input, process, and output. If a machine does all three, we can call it a computer.",
  definitions: [
    {
      term: "Computer",
      meaning:
        "A machine that takes information in, works on it, and shows something out.",
    },
    {
      term: "Input",
      meaning: "Something goes into the machine — like typing words on a phone.",
    },
    {
      term: "Process",
      meaning:
        "The machine thinks or works on the information in the middle.",
    },
    {
      term: "Output",
      meaning:
        "Something comes out — an answer, a picture, a sound, or a message on a screen.",
    },
  ],
  panels: [
    {
      title: "Story 1 — Sending a message (computer)",
      body: [
        "You type a message to a friend. That is INPUT — words going in.",
        "The phone gets the message ready to send. That is PROCESS.",
        "Your friend sees it on their screen. That is OUTPUT.",
        "Phone, laptop, and tablet all do these three jobs. They are computers.",
      ],
    },
    {
      title: "Story 2 — Switching on a bulb (not a computer)",
      body: [
        "You press a switch and a bulb lights up. Useful!",
        "But the bulb is not taking many kinds of input or thinking about a message or a game.",
        "It mainly turns light on or off.",
        "A simple bulb or a toaster that only heats bread is not a computer.",
      ],
    },
    {
      title: "Quick game — computer or not?",
      body: [
        "Laptop — YES (computer).",
        "Phone — YES (computer).",
        "Tablet — YES (computer).",
        "Toaster — NO (only heats bread).",
        "Lamp — NO (not a computer).",
      ],
    },
  ],
  remember: [
    "Three jobs: Input -> Process -> Output.",
    "Phone, laptop, tablet = computers.",
    "Toaster, lamp, bicycle bell = not computers.",
    "Computers take input, process it, and show smarter output.",
  ],
  checkYourself: {
    q: "Which one is a computer: a laptop, a lamp, or a bicycle bell?",
    a: "Laptop — it takes input, processes, and shows output.",
  },
  dinoLine: "You learned Chapter 1. Brilliant work, champ!",
};

const NOTES_BY_MODULE: Record<string, LessonNotesDoc> = {
  A1: A1_LESSON_NOTES,
};

export function getLessonNotes(moduleId: string): LessonNotesDoc | null {
  return NOTES_BY_MODULE[moduleId] ?? null;
}

export function hasLessonNotes(moduleId: string): boolean {
  return moduleId in NOTES_BY_MODULE;
}
