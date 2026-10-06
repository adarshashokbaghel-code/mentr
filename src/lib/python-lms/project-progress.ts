import { getPyProject } from "@/lib/python-lms/projects";

export type PyProjectProgress = {
  /** Set when a Run passes every test. Opening the solution does not block this. */
  completedAt?: string;
  /** Set when the full solution is opened. The project can still be completed afterwards. */
  solutionViewedAt?: string;
  hintsUsed?: number;
  /** The code that passed, kept with the completion. */
  code?: string;
};

export const MAX_PROJECT_CODE = 20000;

const isDate = (v: unknown): v is string => typeof v === "string" && !Number.isNaN(Date.parse(v));

export function cleanProjectProgress(raw: unknown): PyProjectProgress | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const out: PyProjectProgress = {};
  if (isDate(r.completedAt)) out.completedAt = r.completedAt;
  if (isDate(r.solutionViewedAt)) out.solutionViewedAt = r.solutionViewedAt;
  if (typeof r.hintsUsed === "number" && r.hintsUsed >= 0) out.hintsUsed = Math.min(20, Math.floor(r.hintsUsed));
  if (typeof r.code === "string") out.code = r.code.slice(0, MAX_PROJECT_CODE);
  return out;
}

const earliest = (a?: string, b?: string) => (!a ? b : !b ? a : Date.parse(a) <= Date.parse(b) ? a : b);

/** Keeps the first completion and the first time the solution was opened. Either can happen first. */
export function mergeProjectProgress(prev: PyProjectProgress | undefined, next: PyProjectProgress | undefined): PyProjectProgress {
  const solutionViewedAt = earliest(prev?.solutionViewedAt, next?.solutionViewedAt);
  let completedAt = prev?.completedAt;
  let code = prev?.code;
  if (!completedAt && next?.completedAt) {
    completedAt = next.completedAt;
    code = next.code;
  }
  const out: PyProjectProgress = {};
  if (completedAt) out.completedAt = completedAt;
  if (solutionViewedAt) out.solutionViewedAt = solutionViewedAt;
  const hints = Math.max(prev?.hintsUsed ?? 0, next?.hintsUsed ?? 0);
  if (hints) out.hintsUsed = hints;
  if (completedAt && code) out.code = code;
  return out;
}

export type ProjectStatus = "not-started" | "in-progress" | "completed" | "solution-viewed";

export function projectStatus(p: PyProjectProgress | undefined, hasDraft = false): ProjectStatus {
  if (p?.completedAt) return "completed";
  if (p?.solutionViewedAt) return "solution-viewed";
  if (hasDraft || p?.hintsUsed) return "in-progress";
  return "not-started";
}

export function completedProjects(projects: Record<string, PyProjectProgress | undefined>): string[] {
  return Object.entries(projects)
    .filter(([id, p]) => getPyProject(id) && p?.completedAt)
    .map(([id]) => id);
}
