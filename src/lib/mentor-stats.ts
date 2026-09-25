"use client";

import { useEffect, useState } from "react";

let memoryCount: { count: number; at: number } | null = null;
const MEMORY_TTL_MS = 60_000;
let inflight: Promise<number | null> | null = null;

/** Format live mentor count for marketing UI (e.g. 67 → "67+"). */
export function formatMentorCount(count: number | null | undefined): string {
  if (count == null || !Number.isFinite(count) || count <= 0) return "…";
  return `${Math.floor(count)}+`;
}

export async function fetchMentorCount(): Promise<number | null> {
  if (memoryCount && Date.now() - memoryCount.at < MEMORY_TTL_MS) {
    return memoryCount.count;
  }
  if (!inflight) {
    inflight = (async () => {
      try {
        const res = await fetch("/api/teachers/stats", { cache: "no-store" });
        if (!res.ok) return null;
        const data = (await res.json()) as { count?: number; mentors?: number };
        const n = Number(data.count ?? data.mentors ?? 0);
        if (!Number.isFinite(n) || n <= 0) return null;
        memoryCount = { count: n, at: Date.now() };
        return n;
      } catch {
        return null;
      } finally {
        inflight = null;
      }
    })();
  }
  return inflight;
}

/** Live completed-mentor count from DB — shared across landing surfaces. */
export function useMentorCount(): number | null {
  const [count, setCount] = useState<number | null>(
    () => memoryCount?.count ?? null,
  );

  useEffect(() => {
    let cancelled = false;
    void fetchMentorCount().then((n) => {
      if (!cancelled && n != null) setCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}
