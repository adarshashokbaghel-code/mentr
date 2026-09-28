import type { LearnQuizDifficulty } from "../models/LearnQuizQuestion";

export const A3_VIDEO_ID = "vid_a3_input-output-devices";

export const A3_LESSON_SEED = {
  videoId: A3_VIDEO_ID,
  moduleId: "A3",
  title: "Input & Output Devices",
  unitId: "cs-u1",
  unitTitle: "How Computers Work",
  trackId: "cs" as const,
  chapterLabel: "Chapter 3 of 5",
  level: "Easy" as const,
  videoSrc: "/learn/lessons/A3.mp4",
  captionsSrc: "/learn/lessons/A3.vtt",
  durationSec: 499,
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

/** 10 quiz items for A3 — sorting devices into input, output, or both. */
export const A3_QUIZ_SEED: QSeed[] = [
  {
    questionId: "A3-Q01",
    difficulty: "easy",
    type: "mcq",
    prompt: "What does an input device do?",
    options: [
      "Sends information into the computer",
      "Shows pictures to you",
      "Prints on paper",
      "Plays music",
    ],
    correctIndex: 0,
    explanation: "Input devices bring information IN to the computer.",
    sortOrder: 1,
  },
  {
    questionId: "A3-Q02",
    difficulty: "easy",
    type: "mcq",
    prompt: "Which one is an input device?",
    options: ["Screen", "Speaker", "Keyboard", "Printer"],
    correctIndex: 2,
    explanation: "You type on a keyboard, and your letters go into the computer.",
    sortOrder: 2,
  },
  {
    questionId: "A3-Q03",
    difficulty: "easy",
    type: "mcq",
    prompt: "Which one is an output device?",
    options: ["Mouse", "Microphone", "Camera", "Screen"],
    correctIndex: 3,
    explanation: "A screen shows words and pictures OUT to you.",
    sortOrder: 3,
  },
  {
    questionId: "A3-Q04",
    difficulty: "easy",
    type: "true_false",
    prompt: "A speaker is an output device.",
    options: ["True", "False"],
    correctIndex: 0,
    explanation: "A speaker gives sound out to you, so it is output.",
    sortOrder: 4,
  },
  {
    questionId: "A3-Q05",
    difficulty: "medium",
    type: "mcq",
    prompt: "A microphone listens to your voice. So a microphone is…",
    options: ["Output", "Input", "Neither", "A printer"],
    correctIndex: 1,
    explanation: "It takes your sound in — that makes it input.",
    sortOrder: 5,
  },
  {
    questionId: "A3-Q06",
    difficulty: "medium",
    type: "mcq",
    prompt: "Which device puts your work on paper?",
    options: ["Keyboard", "Mouse", "Printer", "Camera"],
    correctIndex: 2,
    explanation: "A printer is an output device — it gives you paper.",
    sortOrder: 6,
  },
  {
    questionId: "A3-Q07",
    difficulty: "medium",
    type: "true_false",
    prompt: "A camera is an output device.",
    options: ["True", "False"],
    correctIndex: 1,
    explanation: "A camera takes your picture IN to the computer, so it is input.",
    sortOrder: 7,
  },
  {
    questionId: "A3-Q08",
    difficulty: "medium",
    type: "mcq",
    prompt: "Easy trick: if a device TAKES something from you, it is…",
    options: ["Output", "Broken", "Input", "A screen"],
    correctIndex: 2,
    explanation: "Takes from you → input. Gives to you → output.",
    sortOrder: 8,
  },
  {
    questionId: "A3-Q09",
    difficulty: "hard",
    type: "mcq",
    prompt: "A touchscreen on a tablet is…",
    options: [
      "Only input",
      "Only output",
      "Both input and output",
      "Not a device",
    ],
    correctIndex: 2,
    explanation: "Your tap goes in (input) and the screen shows pictures (output).",
    sortOrder: 9,
  },
  {
    questionId: "A3-Q10",
    difficulty: "hard",
    type: "mcq",
    prompt: "On a video call, which devices send YOU to the other person?",
    options: [
      "Screen and speaker",
      "Camera and microphone",
      "Printer and screen",
      "Speaker and printer",
    ],
    correctIndex: 1,
    explanation:
      "Camera and microphone are input — they take your face and voice in. The other person's screen and speaker are output.",
    sortOrder: 10,
  },
];
