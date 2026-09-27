"use client";

import { useEffect, useState } from "react";

export type PlatformStats = {
  mentors: number;
  subjects: number | null;
  snapGradeQuestions: number | null;
};

let memoryStats: { stats: PlatformStats; at: number } | null = null;
const MEMORY_TTL_MS = 60_000;
let inflight: Promise<PlatformStats | null> | null = null;

/** Format live mentor count for marketing UI (e.g. 67 → "67+"). */
export function formatMentorCount(count: number | null | undefined): string {
  if (count == null || !Number.isFinite(count) || count <= 0) return "…";
  return `${Math.floor(count)}+`;
}

export async function fetchPlatformStats(): Promise<PlatformStats | null> {
  if (memoryStats && Date.now() - memoryStats.at < MEMORY_TTL_MS) {
    return memoryStats.stats;
  }
  if (!inflight) {
    inflight = (async () => {
      try {
        const res = await fetch("/api/teachers/stats", { cache: "no-store" });
        if (!res.ok) return null;
        const data = (await res.json()) as {
          count?: number;
          mentors?: number;
          subjects?: number | null;
          snapGradeQuestions?: number | null;
        };
        const n = Number(data.count ?? data.mentors ?? 0);
        if (!Number.isFinite(n) || n <= 0) return null;
        const stats: PlatformStats = {
          mentors: n,
          subjects: Number(data.subjects) > 0 ? Number(data.subjects) : null,
          snapGradeQuestions:
            Number(data.snapGradeQuestions) > 0
              ? Number(data.snapGradeQuestions)
              : null,
        };
        memoryStats = { stats, at: Date.now() };
        return stats;
      } catch {
        return null;
      } finally {
        inflight = null;
      }
    })();
  }
  return inflight;
}

export async function fetchMentorCount(): Promise<number | null> {
  return (await fetchPlatformStats())?.mentors ?? null;
}

/** Live platform numbers from DB — shared across landing surfaces. */
export function usePlatformStats(): PlatformStats | null {
  const [stats, setStats] = useState<PlatformStats | null>(
    () => memoryStats?.stats ?? null,
  );

  useEffect(() => {
    let cancelled = false;
    void fetchPlatformStats().then((s) => {
      if (!cancelled && s) setStats(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}

/** Live completed-mentor count from DB — shared across landing surfaces. */
export function useMentorCount(): number | null {
  return usePlatformStats()?.mentors ?? null;
}
