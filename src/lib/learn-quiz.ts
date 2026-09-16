/** Client API for Learn lesson quiz (DB-backed, keyed to videoId). */

export type LearnQuizDifficulty = "easy" | "medium" | "hard";

export type LearnQuizQuestionDto = {
  questionId: string;
  videoId: string;
  moduleId: string;
  difficulty: LearnQuizDifficulty;
  type: "mcq" | "true_false";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sortOrder: number;
};

export type LearnLessonQuizDto = {
  lesson: {
    videoId: string;
    moduleId: string;
    title: string;
    unitTitle: string;
    chapterLabel: string;
    videoSrc: string;
    captionsSrc: string;
    durationSec: number;
  };
  questions: LearnQuizQuestionDto[];
  counts: { total: number; easy: number; medium: number; hard: number };
};

async function learnRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("champs_token")
      : null;
  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || "Request failed",
    );
  }
  return data as T;
}

export function fetchLessonQuiz(moduleId: string) {
  return learnRequest<LearnLessonQuizDto>(
    `/learn/lessons/${encodeURIComponent(moduleId)}/quiz`,
  );
}

export function submitLessonQuiz(
  moduleId: string,
  answers: { questionId: string; selectedIndex: number }[],
) {
  return learnRequest<{
    videoId: string;
    moduleId: string;
    total: number;
    answered: number;
    correct: number;
    wrong?: number;
    scorePercent: number;
    enrollment?: import("@/lib/learn-enroll").LearnEnrollmentDto;
  }>(`/learn/lessons/${encodeURIComponent(moduleId)}/quiz/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}
