/** Client helpers for Build Arena progress */

import {
  fetchLearnEnrollment,
  saveLearnEnrollmentLocal,
  type LearnEnrollmentDto,
} from "@/lib/learn-enroll";

const LOCAL_KEY = "mentr_learn_builds_v1";

export type BuildLocalProgress = {
  completed: string[];
  firstTry: string[];
  attempts: Record<string, number>;
};

function empty(): BuildLocalProgress {
  return { completed: [], firstTry: [], attempts: {} };
}

export function readBuildProgressLocal(): BuildLocalProgress {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as BuildLocalProgress;
    return {
      completed: parsed.completed ?? [],
      firstTry: parsed.firstTry ?? [],
      attempts: parsed.attempts ?? {},
    };
  } catch {
    return empty();
  }
}

export function writeBuildProgressLocal(progress: BuildLocalProgress) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(progress));
}

export function noteBuildAttemptLocal(missionId: string) {
  const p = readBuildProgressLocal();
  const id = missionId.toUpperCase();
  p.attempts[id] = (p.attempts[id] ?? 0) + 1;
  writeBuildProgressLocal(p);
  return p.attempts[id];
}

export function noteBuildCompleteLocal(
  missionId: string,
  opts: { firstTry: boolean },
) {
  const p = readBuildProgressLocal();
  const id = missionId.toUpperCase();
  if (!p.completed.includes(id)) p.completed.push(id);
  if (opts.firstTry && !p.firstTry.includes(id)) p.firstTry.push(id);
  writeBuildProgressLocal(p);
  return p;
}

async function learnRequest<T>(path: string, options?: RequestInit): Promise<T> {
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

export async function submitBuildComplete(input: {
  missionId: string;
  firstTry: boolean;
  attempts: number;
}): Promise<LearnEnrollmentDto | null> {
  noteBuildCompleteLocal(input.missionId, { firstTry: input.firstTry });
  try {
    const data = await learnRequest<{ enrollment: LearnEnrollmentDto }>(
      "/learn/build/complete",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    if (data.enrollment) saveLearnEnrollmentLocal(data.enrollment);
    return data.enrollment;
  } catch {
    await fetchLearnEnrollment();
    return null;
  }
}
