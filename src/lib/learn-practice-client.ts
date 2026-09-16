/** Practice bank answers — backed by server (one try forever). */

import {
  saveLearnEnrollmentLocal,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";

export type PracticeAnswerMap = Record<
  string,
  { selectedIndex: number; correct: boolean; at: string }
>;

const CACHE_KEY = "mentr_learn_practice_answers";

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
    throw new Error((data as { error?: string }).error || "Request failed");
  }
  return data as T;
}

export function readPracticeAnswers(): PracticeAnswerMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PracticeAnswerMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocalCache(answers: PracticeAnswerMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(answers));
}

export async function fetchPracticeAnswers(): Promise<PracticeAnswerMap> {
  const data = await learnRequest<{ answers: PracticeAnswerMap }>(
    "/learn/practice/answers",
  );
  writeLocalCache(data.answers);
  return data.answers;
}

export async function submitPracticeAnswer(
  questionId: string,
  selectedIndex: number,
): Promise<{
  selectedIndex: number;
  correct: boolean;
  correctIndex: number;
  explanation: string;
  alreadyAttempted: boolean;
  xpAwarded: number;
  enrollment: LearnEnrollmentDto | null;
}> {
  const data = await learnRequest<{
    questionId: string;
    selectedIndex: number;
    correct: boolean;
    correctIndex: number;
    explanation: string;
    alreadyAttempted: boolean;
    xpAwarded: number;
    enrollment?: LearnEnrollmentDto;
  }>("/learn/practice/attempt", {
    method: "POST",
    body: JSON.stringify({ questionId, selectedIndex }),
  });

  const next = {
    ...readPracticeAnswers(),
    [questionId]: {
      selectedIndex: data.selectedIndex,
      correct: data.correct,
      at: new Date().toISOString(),
    },
  };
  writeLocalCache(next);
  if (data.enrollment) saveLearnEnrollmentLocal(data.enrollment);

  return {
    selectedIndex: data.selectedIndex,
    correct: data.correct,
    correctIndex: data.correctIndex,
    explanation: data.explanation,
    alreadyAttempted: data.alreadyAttempted,
    xpAwarded: data.xpAwarded,
    enrollment: data.enrollment ?? null,
  };
}

/** @deprecated use submitPracticeAnswer — kept for older local-only callers */
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
  writeLocalCache(next);
  return next;
}
