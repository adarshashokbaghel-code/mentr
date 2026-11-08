import { Types } from "mongoose";
import { PythonCompilerRun, type PythonCompilerStatus, type PythonCompilerSurface } from "../models/PythonCompilerRun";

const PROJECTS = [
  { id: "calculator", title: "Calculator" },
  { id: "guess-number", title: "Guess the Number" },
  { id: "quiz-game", title: "Mini Quiz Game" },
  { id: "report-card", title: "Report Card" },
  { id: "tic-tac-toe", title: "Tic Tac Toe" },
] as const;

const PROJECT_IDS = new Set<string>(PROJECTS.map((p) => p.id));
const SURFACES = new Set<PythonCompilerSurface>(["open", "lms", "project"]);
const STATUSES = new Set<PythonCompilerStatus>(["ok", "error", "timeout", "stopped", "load-failed"]);

export type PythonCompilerRunInput = {
  surface?: unknown;
  projectId?: unknown;
  ok?: unknown;
  status?: unknown;
  passed?: unknown;
  errorType?: unknown;
  errorMessage?: unknown;
  line?: unknown;
  durationMs?: unknown;
  chars?: unknown;
  userId?: string;
};

function clampInt(raw: unknown, max: number): number {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(max, Math.floor(n));
}

function shortText(raw: unknown, max: number): string | undefined {
  if (typeof raw !== "string") return undefined;
  const clean = raw.replace(/[\u0000-\u001F]+/g, " ").replace(/\s+/g, " ").trim();
  if (!clean) return undefined;
  return clean.slice(0, max);
}

function errorTypeOf(raw: unknown, status: PythonCompilerStatus): string | undefined {
  if (status === "timeout") return "TimeoutError";
  if (status === "stopped") return "Stopped";
  if (status === "load-failed") return "LoadError";
  if (status === "ok") return undefined;
  const cleaned = typeof raw === "string" ? raw.replace(/[^A-Za-z0-9_]/g, "").slice(0, 40) : "";
  return cleaned || "Error";
}

/** Stores a run summary. Source, input and output are never accepted. */
export async function recordPythonCompilerRun(input: PythonCompilerRunInput): Promise<void> {
  const surface = SURFACES.has(input.surface as PythonCompilerSurface)
    ? (input.surface as PythonCompilerSurface)
    : null;
  const status = STATUSES.has(input.status as PythonCompilerStatus)
    ? (input.status as PythonCompilerStatus)
    : null;
  if (!surface || !status) return;

  const projectId =
    surface === "project" && typeof input.projectId === "string" && PROJECT_IDS.has(input.projectId)
      ? input.projectId
      : undefined;
  if (surface === "project" && !projectId) return;

  const ok = status === "ok" && input.ok !== false;
  await PythonCompilerRun.create({
    surface,
    projectId,
    ok,
    status,
    passed: surface === "project" && typeof input.passed === "boolean" ? input.passed : undefined,
    errorType: errorTypeOf(input.errorType, status),
    errorMessage: status === "ok" ? undefined : shortText(input.errorMessage, 160),
    line: status === "error" ? clampInt(input.line, 10_000) || undefined : undefined,
    durationMs: clampInt(input.durationMs, 120_000),
    chars: clampInt(input.chars, 200_000),
    userId: input.userId && Types.ObjectId.isValid(input.userId) ? new Types.ObjectId(input.userId) : undefined,
  });
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function getPythonCompilerStats() {
  const sinceDoc = await PythonCompilerRun.findOne().sort({ createdAt: 1 }).select("createdAt").lean<{ createdAt: Date }>();
  const now = new Date();
  const from = new Date(now);
  from.setUTCDate(from.getUTCDate() - 13);
  from.setUTCHours(0, 0, 0, 0);

  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [totals, bySurface, byProject, errorGroups, recent, days, windows] = await Promise.all([
    PythonCompilerRun.aggregate<{
      runs: number;
      ok: number;
      failed: number;
      timeouts: number;
      stopped: number;
      loadFailed: number;
      remote: number;
      signedIn: number;
    }>([
      {
        $group: {
          _id: null,
          runs: { $sum: 1 },
          ok: { $sum: { $cond: ["$ok", 1, 0] } },
          failed: { $sum: { $cond: ["$ok", 0, 1] } },
          timeouts: { $sum: { $cond: [{ $eq: ["$status", "timeout"] }, 1, 0] } },
          stopped: { $sum: { $cond: [{ $eq: ["$status", "stopped"] }, 1, 0] } },
          loadFailed: { $sum: { $cond: [{ $eq: ["$status", "load-failed"] }, 1, 0] } },
          remote: { $sum: { $cond: [{ $eq: ["$errorType", "RemoteDisconnected"] }, 1, 0] } },
          signedIn: { $sum: { $cond: [{ $ifNull: ["$userId", false] }, 1, 0] } },
        },
      },
    ]),
    PythonCompilerRun.aggregate<{ _id: string; runs: number; failed: number }>([
      { $group: { _id: "$surface", runs: { $sum: 1 }, failed: { $sum: { $cond: ["$ok", 0, 1] } } } },
    ]),
    PythonCompilerRun.aggregate<{ _id: string; runs: number; passed: number; failed: number }>([
      { $match: { surface: "project", projectId: { $in: [...PROJECT_IDS] } } },
      {
        $group: {
          _id: "$projectId",
          runs: { $sum: 1 },
          passed: { $sum: { $cond: ["$passed", 1, 0] } },
          failed: { $sum: { $cond: ["$ok", 0, 1] } },
        },
      },
    ]),
    PythonCompilerRun.aggregate<{ _id: string; count: number; sample: string }>([
      { $match: { ok: false, errorType: { $exists: true, $ne: "" } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$errorType",
          count: { $sum: 1 },
          sample: { $first: { $ifNull: ["$errorMessage", ""] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 12 },
    ]),
    PythonCompilerRun.find({ ok: false })
      .sort({ createdAt: -1 })
      .limit(25)
      .select("surface projectId status errorType errorMessage line durationMs createdAt")
      .lean(),
    PythonCompilerRun.aggregate<{ _id: string; runs: number; ok: number }>([
      { $match: { createdAt: { $gte: from } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          runs: { $sum: 1 },
          ok: { $sum: { $cond: ["$ok", 1, 0] } },
        },
      },
    ]),
    PythonCompilerRun.aggregate<{ _id: { window: "current" | "previous"; surface: string }; runs: number; ok: number }>([
      { $match: { createdAt: { $gte: twoWeeksAgo } } },
      {
        $group: {
          _id: {
            window: { $cond: [{ $gte: ["$createdAt", weekAgo] }, "current", "previous"] },
            surface: "$surface",
          },
          runs: { $sum: 1 },
          ok: { $sum: { $cond: ["$ok", 1, 0] } },
        },
      },
    ]),
  ]);

  const total = totals[0] ?? {
    runs: 0,
    ok: 0,
    failed: 0,
    timeouts: 0,
    stopped: 0,
    loadFailed: 0,
    remote: 0,
    signedIn: 0,
  };
  const surfaceMap = new Map(bySurface.map((row) => [row._id, row]));
  const projectMap = new Map(byProject.map((row) => [row._id, row]));
  const dayMap = new Map(days.map((row) => [row._id, row]));
  const trend = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(from);
    d.setUTCDate(from.getUTCDate() + i);
    const key = dayKey(d);
    const row = dayMap.get(key);
    return { date: key, runs: row?.runs ?? 0, ok: row?.ok ?? 0 };
  });

  function windowSum(window: "current" | "previous", surface?: string) {
    return windows.reduce(
      (sum, row) => {
        if (row._id.window !== window) return sum;
        if (surface && row._id.surface !== surface) return sum;
        return { runs: sum.runs + row.runs, ok: sum.ok + row.ok };
      },
      { runs: 0, ok: 0 },
    );
  }

  const currentWeek = windowSum("current");
  const previousWeek = windowSum("previous");
  const currentOpen = windowSum("current", "open");
  const previousOpen = windowSum("previous", "open");

  return {
    trackingSince: sinceDoc?.createdAt ? new Date(sinceDoc.createdAt).toISOString() : null,
    note: "Counts start when this tracking went live. Earlier runs were not stored. Source code is not saved.",
    totals: {
      runs: total.runs,
      ok: total.ok,
      failed: total.failed,
      timeouts: total.timeouts,
      signedIn: total.signedIn,
      anonymous: Math.max(0, total.runs - total.signedIn),
      stopped: total.stopped,
      loadFailed: total.loadFailed,
      remote: total.remote,
    },
    week: {
      runs: currentWeek.runs,
      previousRuns: previousWeek.runs,
      ok: currentWeek.ok,
      previousOk: previousWeek.ok,
      openRuns: currentOpen.runs,
      previousOpenRuns: previousOpen.runs,
    },
    surfaces: (["open", "lms", "project"] as const).map((id) => ({
      id,
      label: id === "open" ? "Open compiler" : id === "lms" ? "Course compiler" : "Final projects",
      runs: surfaceMap.get(id)?.runs ?? 0,
      failed: surfaceMap.get(id)?.failed ?? 0,
    })),
    projects: PROJECTS.map((project) => {
      const row = projectMap.get(project.id);
      return {
        id: project.id,
        title: project.title,
        runs: row?.runs ?? 0,
        passed: row?.passed ?? 0,
        failed: row?.failed ?? 0,
      };
    }),
    errors: errorGroups.map((row) => ({
      type: row._id,
      count: row.count,
      sample: row.sample || "",
    })),
    recentFailures: recent.map((row) => ({
      at: new Date(row.createdAt).toISOString(),
      surface: row.surface,
      projectId: row.projectId ?? null,
      status: row.status,
      errorType: row.errorType ?? row.status,
      errorMessage: row.errorMessage ?? "",
      line: row.line ?? null,
      durationMs: row.durationMs,
    })),
    trend,
  };
}
