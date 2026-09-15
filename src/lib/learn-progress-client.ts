/** Client helpers for Learn progress + POTD */

import {
  fetchLearnEnrollment,
  saveLearnEnrollmentLocal,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";

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

export async function recordVideoComplete(moduleId: string) {
  const data = await learnRequest<{ enrollment: LearnEnrollmentDto }>(
    "/learn/progress",
    {
      method: "POST",
      body: JSON.stringify({ moduleId, event: "video_complete" }),
    },
  );
  saveLearnEnrollmentLocal(data.enrollment);
  return data.enrollment;
}

export function hasWatchedVideo(
  enrollment: LearnEnrollmentDto | null | undefined,
  moduleId: string,
) {
  const watched = enrollment?.progress?.videosWatched ?? [];
  return watched.includes(moduleId);
}

export function hasCompletedQuiz(
  enrollment: LearnEnrollmentDto | null | undefined,
  moduleId: string,
) {
  const done = enrollment?.progress?.quizzesCompleted ?? [];
  return done.includes(moduleId);
}

export async function refreshLearnEnrollment() {
  return fetchLearnEnrollment();
}

export type PotdPayload = {
  potdId: string;
  moduleId: string;
  trackId: "cs" | "ai" | "math";
  title: string;
  difficulty: "easy" | "medium" | "hard";
  dayIndex: number;
  prompt?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
};

export type PotdTodayDto = {
  cycle: number;
  dateKey: string;
  dayIndex: number;
  isToday: boolean;
  isFuture: boolean;
  unlocked: boolean;
  attempted: boolean;
  attempt: {
    selectedIndex: number;
    correct: boolean;
    attemptedAt: string;
  } | null;
  potd: PotdPayload;
};

export type PotdMonthDto = {
  year: number;
  month: number;
  firstDow: number;
  daysInMonth: number;
  todayKey: string;
  cycle: number;
  days: {
    dateKey: string;
    day: number;
    dayIndex: number;
    isToday: boolean;
    isFuture: boolean;
    attempted: boolean;
    correct: boolean | null;
  }[];
};

export function fetchPotdToday() {
  return learnRequest<PotdTodayDto>("/learn/potd/today");
}

export function fetchPotdByDate(dateKey: string) {
  return learnRequest<PotdTodayDto>(
    `/learn/potd/date?date=${encodeURIComponent(dateKey)}`,
  );
}

export function fetchPotdMonth(year: number, month: number) {
  return learnRequest<PotdMonthDto>(
    `/learn/potd/month?year=${year}&month=${month}`,
  );
}

export function submitPotdAttempt(dateKey: string, selectedIndex: number) {
  return learnRequest<{
    dateKey: string;
    correct: boolean;
    selectedIndex: number;
    correctIndex: number;
    explanation: string;
  }>("/learn/potd/attempt", {
    method: "POST",
    body: JSON.stringify({ dateKey, selectedIndex }),
  });
}

/** @deprecated */
export function fetchPotdCalendar() {
  return fetchPotdMonth(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth() + 1,
  );
}

export type PotdCalendarDto = PotdMonthDto;
