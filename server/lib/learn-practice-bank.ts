import answers from "./learn-practice-answers.json";

type PracticeAnswer = {
  correctIndex: number;
  explanation: string;
};

const ANSWERS = answers as Record<string, PracticeAnswer>;

export const PRACTICE_ANSWER_KEY = "questionId";

export function getPracticeQuestion(questionId: string): PracticeAnswer & {
  questionId: string;
} | null {
  const row = ANSWERS[questionId];
  if (!row) return null;
  return { questionId, ...row };
}
