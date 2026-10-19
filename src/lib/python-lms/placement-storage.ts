import type { PyPlacement } from "@/lib/python-lms/progress";

const KEY = "mentr:learnpython:placement:v1";
const SEEN_KEY = "mentr:learnpython:placement-seen:v1";

export function readPlacementLocal(): PyPlacement | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return undefined;
    const p = JSON.parse(raw) as PyPlacement;
    if (typeof p.passed !== "boolean" || typeof p.score !== "number") return undefined;
    return p;
  } catch {
    return undefined;
  }
}

export function writePlacementLocal(placement: PyPlacement): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(placement));
  } catch {
    /* storage blocked */
  }
}

export function readPlacementSeenLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function appendPlacementSeenLocal(ids: string[]): void {
  if (!ids.length) return;
  const prev = readPlacementSeenLocal();
  const next = [...new Set([...prev, ...ids])].slice(-400);
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(next));
  } catch {
    /* storage blocked */
  }
}
