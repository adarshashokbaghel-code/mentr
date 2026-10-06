import type { CertProgress } from "@/lib/python-lms/certificate";
import type { PyLessonProgress } from "@/lib/python-lms/lesson-progress";
import type { PyProjectProgress } from "@/lib/python-lms/project-progress";

export type PySyncPayload = {
  day: string;
  awards: string[];
  lessons: Record<string, PyLessonProgress>;
  achievements: Record<string, string>;
  projects: Record<string, PyProjectProgress>;
};

export type PyServerState = {
  firstVisitAt: string | null;
  loginAwarded: boolean;
  xp: number;
  awarded: Record<string, number>;
  lessons: Record<string, PyLessonProgress>;
  achievements: Record<string, string>;
  days: string[];
  unlockedLessons: string[];
  projects: Record<string, PyProjectProgress>;
  certificateId: string | null;
};

export type PyCertificate = {
  id: string;
  name: string;
  course: string;
  issuedAt: string;
  stats: {
    xp: number;
    lessonsStudied: number;
    practiceSolved: number;
    examplesSolved: number;
    projectsCompleted: number;
    projects: string[];
  };
};

export type PyProfile = {
  name: string;
  email: string;
  role: "parent" | "faculty";
  firstVisitAt: string | null;
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  bestStreak: number;
  daysActive: number;
  rank: number;
  learners: number;
  certificate: PyCertificate | null;
  certificateUnlocked: boolean;
  progress: CertProgress;
};

export type PyLeaderboardRow = {
  rank: number;
  name: string;
  initials: string;
  xp: number;
  level: number;
  levelTitle: string;
  band: string;
  streakDays: number;
  lessonsStudied: number;
  projectsCompleted: number;
  certified: boolean;
  isMe: boolean;
};

export type PyLeaderboard = { rows: PyLeaderboardRow[]; me: PyLeaderboardRow | null; learners: number };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("champs_token") : null;
  const res = await fetch(`/api/learnpython${path}`, {
    credentials: "include",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error((data as { error?: string }).error || "Something went wrong"), { status: res.status });
  return data as T;
}

export function syncPyProgress(payload: PySyncPayload, opts?: { keepalive?: boolean }): Promise<PyServerState> {
  return request<PyServerState>("/sync", { method: "POST", keepalive: opts?.keepalive, body: JSON.stringify(payload) });
}

export const fetchPyProfile = () => request<PyProfile>("/profile");
export const fetchPyLeaderboard = () => request<PyLeaderboard>("/leaderboard");
export const claimPyCertificate = (name: string) =>
  request<PyCertificate>("/certificate", { method: "POST", body: JSON.stringify({ name }) });
export const verifyPyCertificate = (id: string) => request<PyCertificate>(`/certificate/${encodeURIComponent(id)}`);
