import type { PracticeLevel } from "./practice-bank";

/** XP per action. The server recomputes every award from these values, so the client can't choose its own XP. */
export const PY_XP = {
  dailyLogin: 1,
  practice: { easy: 1, medium: 3, hard: 5 } as Record<PracticeLevel, number>,
  video: 2,
  example: 1,
  lessonQuestion: 1,
  quickCheck: 1,
  project: 10,
} as const;

export const XP_RULES: { what: string; xp: string; note: string }[] = [
  { what: "Daily login", xp: `+${PY_XP.dailyLogin}`, note: "Sign in and open Learn Python. Once per day." },
  { what: "Practice · Easy", xp: `+${PY_XP.practice.easy}`, note: "Each easy question you get right in Practice." },
  { what: "Practice · Medium", xp: `+${PY_XP.practice.medium}`, note: "Each medium question you get right in Practice." },
  { what: "Practice · Hard", xp: `+${PY_XP.practice.hard}`, note: "Each hard question you get right in Practice." },
  { what: "Video watched", xp: `+${PY_XP.video}`, note: "Watch a lesson video to the end." },
  { what: "Lesson example", xp: `+${PY_XP.example}`, note: "Step a program to its last line, or reach a playground’s goal." },
  { what: "Lesson practice", xp: `+${PY_XP.lessonQuestion}`, note: "Each question right on the first or second try. A revealed answer earns 0." },
  { what: "Quick check in Study", xp: `+${PY_XP.quickCheck}`, note: "Only your first pick counts." },
  { what: "Final Challenge project", xp: `+${PY_XP.project}`, note: "Press Run. A correct program is marked complete, even after the solution was opened." },
];

export type PyAwardKind = "login" | "practice" | "video" | "example" | "lesson" | "check" | "project";

const KIND_BY_PREFIX: Record<string, PyAwardKind> = {
  login: "login",
  bank: "practice",
  video: "video",
  goal: "example",
  trace: "example",
  q: "lesson",
  check: "check",
  project: "project",
};

export function awardKind(key: string): PyAwardKind | null {
  return KIND_BY_PREFIX[key.slice(0, key.indexOf(":"))] ?? null;
}

export const loginAwardKey = (day: string) => `login:${day}`;
export const videoAwardKey = (slug: string) => `video:${slug}`;
export const bankAwardKey = (id: string) => `bank:${id}`;
export const projectAwardKey = (id: string) => `project:${id}`;
