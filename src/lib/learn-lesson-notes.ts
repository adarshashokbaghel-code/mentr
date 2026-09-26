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

export const A2_LESSON_NOTES: LessonNotesDoc = {
  moduleId: "A2",
  title: "How Computers Understand Us",
  unitLabel: "CS Unit 1 · How Computers Work",
  chapterLabel: "Chapter 2 of 5",
  level: "Easy",
  filename: "Mentr-Learn-A2-How-Computers-Understand-Us-Notes.pdf",
  bigIdea:
    "Computers only understand two states — on and off — like a light switch. On is written as 1, off as 0. A row of 1s and 0s is called binary: the computer’s light-switch language.",
  definitions: [
    {
      term: "On / Off",
      meaning:
        "The only two states inside a computer — like a light switch that is up or down.",
    },
    {
      term: "1 and 0",
      meaning: "1 means ON. 0 means OFF. That is how we write the two states.",
    },
    {
      term: "Binary",
      meaning:
        "A pattern of ones and zeros. “Bi” means two — only two choices. It is the computer’s special language.",
    },
    {
      term: "Bit (tiny idea)",
      meaning:
        "One switch worth of information — a single 0 or 1. (You only need the idea for now.)",
    },
  ],
  panels: [
    {
      title: "The big secret",
      body: [
        "Computers do not speak Hindi or English inside.",
        "Everything is only ON or OFF.",
        "We write ON as 1 and OFF as 0.",
      ],
    },
    {
      title: "Three switches in a row",
      body: [
        "Imagine left, middle, and right light switches.",
        "Each switch is a 1 (on) or a 0 (off).",
        "Example: off, off, on → 0 0 1.",
        "Example: on, off, on → 1 0 1.",
      ],
    },
    {
      title: "Practice reading",
      body: [
        "0 0 1 → off, off, on.",
        "1 1 0 → on, on, off.",
        "1 0 1 → on, off, on.",
      ],
    },
    {
      title: "Why it matters",
      body: [
        "Photos, games, and messages become 0s and 1s inside the computer.",
        "Then the computer turns them back into pictures and sound for you.",
        "When you hear “binary,” think: light-switch language.",
      ],
    },
  ],
  remember: [
    "Only two states: on or off.",
    "ON = 1 · OFF = 0.",
    "Binary = a row of 1s and 0s (bi = two).",
    "101 on three lights means on, off, on.",
  ],
  checkYourself: {
    q: "If 1 means on, what does 101 mean on three lights?",
    a: "Left on, middle off, right on — on, off, on.",
  },
  dinoLine: "Chapter 2 done. Binary is light-switch language — excellent, champ!",
};

const NOTES_BY_MODULE: Record<string, LessonNotesDoc> = {
  A1: A1_LESSON_NOTES,
  A2: A2_LESSON_NOTES,
};

export function getLessonNotes(moduleId: string): LessonNotesDoc | null {
  return NOTES_BY_MODULE[moduleId] ?? null;
}

export function hasLessonNotes(moduleId: string): boolean {
  return moduleId in NOTES_BY_MODULE;
}
