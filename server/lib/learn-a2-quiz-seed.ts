import type { LearnQuizDifficulty } from "../models/LearnQuizQuestion";

export const A2_VIDEO_ID = "vid_a2_how-computers-understand-us";

export const A2_LESSON_SEED = {
  videoId: A2_VIDEO_ID,
  moduleId: "A2",
  title: "How Computers Understand Us",
  unitId: "cs-u1",
  unitTitle: "How Computers Work",
  trackId: "cs" as const,
  chapterLabel: "Chapter 2 of 5",
  level: "Easy" as const,
  videoSrc: "/learn/lessons/A2.mp4",
  captionsSrc: "/learn/lessons/A2.vtt",
  durationSec: 281,
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

/** 10 quiz items for A2 — binary as on/off lights. */
export const A2_QUIZ_SEED: QSeed[] = [
  {
    questionId: "A2-Q01",
    difficulty: "easy",
    type: "mcq",
    prompt: "Inside a computer, how many main states are there?",
    options: ["Ten", "Two — on or off", "Five", "One hundred"],
    correctIndex: 1,
    explanation: "Everything is only on or off — like a light switch.",
    sortOrder: 1,
  },
  {
    questionId: "A2-Q02",
    difficulty: "easy",
    type: "mcq",
    prompt: "What does the number 1 mean?",
    options: ["Off", "Sleep", "On", "Broken"],
    correctIndex: 2,
    explanation: "1 means ON. 0 means OFF.",
    sortOrder: 2,
  },
  {
    questionId: "A2-Q03",
    difficulty: "easy",
    type: "mcq",
    prompt: "What does the number 0 mean?",
    options: ["On", "Off", "Loud", "Colour"],
    correctIndex: 1,
    explanation: "0 means OFF.",
    sortOrder: 3,
  },
  {
    questionId: "A2-Q04",
    difficulty: "easy",
    type: "true_false",
    prompt: "Binary means a language with only two choices.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "Bi means two. Binary uses 0 and 1 only.",
    sortOrder: 4,
  },
  {
    questionId: "A2-Q05",
    difficulty: "medium",
    type: "mcq",
    prompt: "Off, off, on is written as…",
    options: ["1 1 1", "0 0 1", "1 0 0", "0 1 0"],
    correctIndex: 1,
    explanation: "Off=0, off=0, on=1 → 0 0 1.",
    sortOrder: 5,
  },
  {
    questionId: "A2-Q06",
    difficulty: "medium",
    type: "mcq",
    prompt: "If 1 means on, what does 1 0 1 mean on three lights?",
    options: [
      "Off, off, off",
      "On, on, on",
      "On, off, on",
      "Off, on, off",
    ],
    correctIndex: 2,
    explanation: "Left on, middle off, right on.",
    sortOrder: 6,
  },
  {
    questionId: "A2-Q07",
    difficulty: "medium",
    type: "mcq",
    prompt: "Binary is best described as…",
    options: [
      "A cooking recipe",
      "The computer’s light-switch language",
      "A sport",
      "A colouring book",
    ],
    correctIndex: 1,
    explanation: "Binary is the computer’s on/off (light-switch) language.",
    sortOrder: 7,
  },
  {
    questionId: "A2-Q08",
    difficulty: "medium",
    type: "true_false",
    prompt: "Computers speak Hindi and English inside their chips.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation: "Inside, they only use on and off — not human languages.",
    sortOrder: 8,
  },
  {
    questionId: "A2-Q09",
    difficulty: "hard",
    type: "mcq",
    prompt: "On, on, off is written as…",
    options: ["0 0 1", "1 0 1", "1 1 0", "0 1 1"],
    correctIndex: 2,
    explanation: "On=1, on=1, off=0 → 1 1 0.",
    sortOrder: 9,
  },
  {
    questionId: "A2-Q10",
    difficulty: "hard",
    type: "mcq",
    prompt: "Why do photos and games become 0s and 1s inside a computer?",
    options: [
      "Because computers only understand on and off",
      "Because they are afraid of words",
      "Because zero is a lucky number",
      "Because screens hate colours",
    ],
    correctIndex: 0,
    explanation:
      "Everything is stored as on/off patterns, then turned back into pictures and sound for you.",
    sortOrder: 10,
  },
];
