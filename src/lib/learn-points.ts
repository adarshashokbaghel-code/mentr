/**
 * Learn points rules — UI source of truth.
 * Backend wiring will mirror these constants later.
 * 1 point = 1 XP. Leaderboard ranks by total points.
 */

export const LEARN_POINTS = {
  potdCorrect: 1,
  quizCorrect: 1,
  quizWrong: -0.5,
  dailySignIn: 0.5,
  streak7: 2,
  streak15: 5,
  streak30: 10,
  /** Build Arena — base XP varies by mission; first-try adds this bonus */
  buildFirstTryBonus: 3,
  practiceCorrect: 1,
  practiceWrong: 0,
  /** Coming soon */
  playFirstTry: 3,
} as const;

export type LearnPointsRule = {
  id: string;
  title: string;
  detail: string;
  points: string;
  tone: "earn" | "lose" | "bonus" | "soon";
  group: "now" | "streak" | "soon";
};

export const LEARN_POINTS_RULES: LearnPointsRule[] = [
  {
    id: "potd",
    title: "Correct POTD",
    detail: "Solve today’s Problem of the Day correctly.",
    points: `+${LEARN_POINTS.potdCorrect}`,
    tone: "earn",
    group: "now",
  },
  {
    id: "quiz-ok",
    title: "Correct quiz answer",
    detail: "Each right answer in a lesson quiz.",
    points: `+${LEARN_POINTS.quizCorrect}`,
    tone: "earn",
    group: "now",
  },
  {
    id: "quiz-bad",
    title: "Wrong quiz answer",
    detail: "Each incorrect quiz choice (careful!).",
    points: `${LEARN_POINTS.quizWrong}`,
    tone: "lose",
    group: "now",
  },
  {
    id: "signin",
    title: "Daily sign-in",
    detail: "Open Learn and check in once per day.",
    points: `+${LEARN_POINTS.dailySignIn}`,
    tone: "earn",
    group: "now",
  },
  {
    id: "streak-7",
    title: "7-day streak",
    detail: "Keep learning 7 days in a row — bonus once.",
    points: `+${LEARN_POINTS.streak7}`,
    tone: "bonus",
    group: "streak",
  },
  {
    id: "streak-15",
    title: "15-day streak",
    detail: "Hit 15 days straight — bigger bonus.",
    points: `+${LEARN_POINTS.streak15}`,
    tone: "bonus",
    group: "streak",
  },
  {
    id: "streak-30",
    title: "30-day streak",
    detail: "A full month streak — largest bonus.",
    points: `+${LEARN_POINTS.streak30}`,
    tone: "bonus",
    group: "streak",
  },
  {
    id: "bank",
    title: "Practice bank",
    detail: "~200 practice questions across CS, AI & Math. Correct earns points; wrong is 0.",
    points: `+${LEARN_POINTS.practiceCorrect} / 0`,
    tone: "earn",
    group: "now",
  },
  {
    id: "build",
    title: "Build Arena",
    detail: "Clear a Blockly mission. First try adds a bonus.",
    points: `+3–8 / +${LEARN_POINTS.buildFirstTryBonus}`,
    tone: "earn",
    group: "now",
  },
  {
    id: "play",
    title: "Play arena (soon)",
    detail: "10 play games. Correct on the first try.",
    points: `+${LEARN_POINTS.playFirstTry}`,
    tone: "soon",
    group: "soon",
  },
];
