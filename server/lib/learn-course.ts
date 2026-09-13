/** Shared Learn course / track identifiers (server). */

export const LEARN_TRACKS = ["class-3-5", "class-6-8", "class-9-12"] as const;
export type LearnTrackId = (typeof LEARN_TRACKS)[number];

export const LEARN_TRACK_META: Record<
  LearnTrackId,
  { label: string; shortLabel: string; unlocked: boolean }
> = {
  "class-3-5": {
    label: "Class 3–5 track",
    shortLabel: "3–5",
    unlocked: true,
  },
  "class-6-8": {
    label: "Class 6–8 track",
    shortLabel: "6–8",
    unlocked: false,
  },
  "class-9-12": {
    label: "Class 9–12 track",
    shortLabel: "9–12",
    unlocked: false,
  },
};

export const MENTR_STARTER = {
  courseId: "mentr-starter" as const,
  courseName: "Mentr Starter",
  tagline: "Class 3–5 · Computer Science, AI & Math",
  track: "class-3-5" as LearnTrackId,
  listPriceInr: 999,
  modules: 60,
  subjects: ["Computer Science", "AI", "Math for CS"] as const,
};

export type LearnProgressScaffold = {
  modulesCompleted: string[];
  currentModuleId: string | null;
  xp: number;
  streakDays: number;
  lastActivityAt: string | null;
};

export function emptyLearnProgress(): LearnProgressScaffold {
  return {
    modulesCompleted: [],
    currentModuleId: "A1",
    xp: 0,
    streakDays: 0,
    lastActivityAt: null,
  };
}

export function makeReceiptNumber(userId: string, at = new Date()): string {
  const y = at.getUTCFullYear();
  const m = String(at.getUTCMonth() + 1).padStart(2, "0");
  const d = String(at.getUTCDate()).padStart(2, "0");
  const tail = userId.replace(/[^a-f0-9]/gi, "").slice(-6).toUpperCase() || "XXXXXX";
  return `MST-${y}${m}${d}-${tail}`;
}
