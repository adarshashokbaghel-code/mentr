const STORAGE_KEY = "mentr_learn_practice_answers";

export type PracticeAnswerMap = Record<
  string,
  { selectedIndex: number; correct: boolean; at: string }
>;

export function readPracticeAnswers(): PracticeAnswerMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PracticeAnswerMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function writePracticeAnswer(
  questionId: string,
  selectedIndex: number,
  correct: boolean,
) {
  const next = {
    ...readPracticeAnswers(),
    [questionId]: {
      selectedIndex,
      correct,
      at: new Date().toISOString(),
    },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
