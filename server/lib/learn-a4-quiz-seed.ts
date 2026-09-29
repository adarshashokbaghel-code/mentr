import type { LearnQuizDifficulty } from "../models/LearnQuizQuestion";

export const A4_VIDEO_ID = "vid_a4_how-websites-talk";

export const A4_LESSON_SEED = {
  videoId: A4_VIDEO_ID,
  moduleId: "A4",
  title: "How Websites Talk to Each Other",
  unitId: "cs-u1",
  unitTitle: "How Computers Work",
  trackId: "cs" as const,
  chapterLabel: "Chapter 4 of 5",
  level: "Easy" as const,
  videoSrc: "/learn/lessons/A4.mp4",
  captionsSrc: "/learn/lessons/A4.vtt",
  durationSec: 359,
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

/** 10 quiz items for A4 — the internet as askers and answerers. */
export const A4_QUIZ_SEED: QSeed[] = [
  {
    questionId: "A4-Q01",
    difficulty: "easy",
    type: "mcq",
    prompt: "What is the internet?",
    options: [
      "One giant computer in one city",
      "Millions of computers joined together, asking and answering",
      "A kind of TV channel",
      "A box inside your tablet",
    ],
    correctIndex: 1,
    explanation: "The internet is a network — many computers asking and answering.",
    sortOrder: 1,
  },
  {
    questionId: "A4-Q02",
    difficulty: "easy",
    type: "mcq",
    prompt: "A computer that keeps websites ready and answers requests is called a…",
    options: ["Printer", "Server", "Keyboard", "Speaker"],
    correctIndex: 1,
    explanation: "Servers answer. Your tablet, phone, or laptop asks.",
    sortOrder: 2,
  },
  {
    questionId: "A4-Q03",
    difficulty: "easy",
    type: "mcq",
    prompt: "A website is most like a…",
    options: ["Shop with an address", "Pencil", "Rain cloud", "Football"],
    correctIndex: 0,
    explanation: "Like a shop, every website has an address so you can find it.",
    sortOrder: 3,
  },
  {
    questionId: "A4-Q04",
    difficulty: "easy",
    type: "true_false",
    prompt: "A URL is the address of a website.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "Example: mentr.com is a URL — the website's address.",
    sortOrder: 4,
  },
  {
    questionId: "A4-Q05",
    difficulty: "medium",
    type: "mcq",
    prompt: "Which of these is a URL?",
    options: ["mentr.com", "Keyboard", "Blue colour", "Monday"],
    correctIndex: 0,
    explanation: "mentr.com is a website address. The name, then the ending (.com).",
    sortOrder: 5,
  },
  {
    questionId: "A4-Q06",
    difficulty: "medium",
    type: "mcq",
    prompt: "Wi-Fi and mobile data are like…",
    options: [
      "Roads that carry questions and answers",
      "Shops that sell websites",
      "Printers",
      "Passwords",
    ],
    correctIndex: 0,
    explanation: "They are roads. They carry messages — they don't make the website.",
    sortOrder: 6,
  },
  {
    questionId: "A4-Q07",
    difficulty: "medium",
    type: "true_false",
    prompt: "When you watch a cartoon online, the whole cartoon lives inside your tablet from the start.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation: "It comes from a server, piece by piece, as your tablet keeps asking.",
    sortOrder: 7,
  },
  {
    questionId: "A4-Q08",
    difficulty: "medium",
    type: "mcq",
    prompt: "When you open a website, what happens FIRST?",
    options: [
      "The page appears",
      "Your device asks for the page",
      "The tablet switches off",
      "The server guesses what you want",
    ],
    correctIndex: 1,
    explanation: "Your device asks first (a request). Then the page appears.",
    sortOrder: 8,
  },
  {
    questionId: "A4-Q09",
    difficulty: "hard",
    type: "mcq",
    prompt: "Put the trip in order: A) Page appears  B) Type address  C) Device asks",
    options: ["A → B → C", "C → A → B", "B → C → A", "B → A → C"],
    correctIndex: 2,
    explanation: "Type the address, your device asks, then the page appears.",
    sortOrder: 9,
  },
  {
    questionId: "A4-Q10",
    difficulty: "hard",
    type: "mcq",
    prompt: "A video stops and shows a spinning circle. What is the most likely reason?",
    options: [
      "The road is slow, so the next pieces come late",
      "The screen is broken",
      "The keyboard is off",
      "The server is sleeping forever",
    ],
    correctIndex: 0,
    explanation: "A slow road delays the next pieces — that spinning circle is called buffering.",
    sortOrder: 10,
  },
];
