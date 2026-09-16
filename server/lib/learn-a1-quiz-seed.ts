import type { LearnQuizDifficulty } from "../models/LearnQuizQuestion";

export const A1_VIDEO_ID = "vid_a1_what-is-a-computer";

export const A1_LESSON_SEED = {
  videoId: A1_VIDEO_ID,
  moduleId: "A1",
  title: "What Is a Computer?",
  unitId: "cs-u1",
  unitTitle: "How Computers Work",
  trackId: "cs" as const,
  chapterLabel: "Chapter 1 of 5",
  level: "Easy" as const,
  videoSrc: "/learn/lessons/A1.mp4",
  captionsSrc: "/learn/lessons/A1.vtt",
  durationSec: 291,
  status: "published" as const,
};

type QSeed = {
  questionId: string;
  difficulty: LearnQuizDifficulty;
  type: "mcq" | "true_false";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sortOrder: number;
};

/** 10 quiz items for A1 (syllabus practice size) — easy / medium / hard. */
export const A1_QUIZ_SEED: QSeed[] = [
  {
    questionId: "A1-Q01",
    difficulty: "easy",
    type: "mcq",
    prompt: "A computer has how many main jobs?",
    options: [
      "One",
      "Three",
      "Ten",
      "Two"
    ],
    correctIndex: 1,
    explanation: "Every computer has three jobs: input, process, and output.",
    sortOrder: 1,
  },
  {
    questionId: "A1-Q02",
    difficulty: "easy",
    type: "mcq",
    prompt: "What does INPUT mean?",
    options: [
      "The computer sleeps",
      "Bread gets hot",
      "Something goes into the computer",
      "The screen turns off"
    ],
    correctIndex: 2,
    explanation: "Input means information going in — like typing on a phone.",
    sortOrder: 2,
  },
  {
    questionId: "A1-Q03",
    difficulty: "easy",
    type: "mcq",
    prompt: "Which one is a computer?",
    options: [
      "Bicycle bell",
      "Toaster",
      "Lamp",
      "Laptop"
    ],
    correctIndex: 3,
    explanation: "A laptop does input → process → output. The others do not.",
    sortOrder: 3,
  },
  {
    questionId: "A1-Q04",
    difficulty: "easy",
    type: "true_false",
    prompt: "A phone can be a computer.",
    options: [
      "False",
      "True"
    ],
    correctIndex: 1,
    explanation: "Yes — a phone takes input, processes, and shows output.",
    sortOrder: 4,
  },
  {
    questionId: "A1-Q05",
    difficulty: "medium",
    type: "mcq",
    prompt: "What does PROCESS mean?",
    options: [
      "The room gets dark",
      "The computer thinks or works on the information",
      "Only the speaker plays music forever",
      "You throw the computer away"
    ],
    correctIndex: 1,
    explanation: "Process is the “thinking / working” job in the middle.",
    sortOrder: 5,
  },
  {
    questionId: "A1-Q06",
    difficulty: "medium",
    type: "mcq",
    prompt: "Why is a toaster usually NOT a computer?",
    options: [
      "It is made of metal",
      "It uses electricity",
      "It mainly heats bread — it does not take many kinds of input and think",
      "It is found in a kitchen"
    ],
    correctIndex: 2,
    explanation: "Computers take input, process it, and show smarter output. A toaster mostly just heats.",
    sortOrder: 6,
  },
  {
    questionId: "A1-Q07",
    difficulty: "medium",
    type: "mcq",
    prompt: "Put the three jobs in the correct order.",
    options: [
      "Input → Output → Process",
      "Output → Input → Process",
      "Process → Output → Input",
      "Input → Process → Output"
    ],
    correctIndex: 3,
    explanation: "First information goes in, then the computer works, then something comes out.",
    sortOrder: 7,
  },
  {
    questionId: "A1-Q08",
    difficulty: "hard",
    type: "mcq",
    prompt: "Which device is a computer: laptop, lamp, or bicycle bell — and why?",
    options: [
      "Lamp — because it makes light",
      "All three — because they use energy",
      "Bicycle bell — because it makes sound",
      "Laptop — because it takes input, processes, and shows output"
    ],
    correctIndex: 3,
    explanation: "Only the laptop does the three computer jobs. Light and sound alone are not enough.",
    sortOrder: 8,
  },
  {
    questionId: "A1-Q09",
    difficulty: "hard",
    type: "mcq",
    prompt: "A machine uses electricity. Does that alone make it a computer?",
    options: [
      "Yes — if it is expensive",
      "Yes — if it is in a school",
      "No — it must also do input, process, and output",
      "Yes — any electric thing is a computer"
    ],
    correctIndex: 2,
    explanation: "Fans and toasters use electricity too. Computers are special because of the three jobs.",
    sortOrder: 9,
  },
  {
    questionId: "A1-Q10",
    difficulty: "hard",
    type: "true_false",
    prompt: "If a machine does all three jobs — input, process, and output — we can call it a computer.",
    options: [
      "True",
      "False"
    ],
    correctIndex: 0,
    explanation: "True — that is the big rule from Chapter 1.",
    sortOrder: 10,
  }
];
