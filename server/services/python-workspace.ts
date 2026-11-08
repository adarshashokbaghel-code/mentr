import { Types } from "mongoose";
import { PythonWorkspace, type IPythonWorkspaceEntry } from "../models/PythonWorkspace";

const NAME = /^[A-Za-z_][A-Za-z0-9._-]{0,48}$/;
const MAX_ENTRIES = 80;
const MAX_FILE_CHARS = 80_000;
const MAX_TOTAL_CHARS = 400_000;
const MAX_DEPTH = 6;

export type WorkspaceEntry = { path: string; kind: "file" | "folder"; content: string };

function cleanPath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const parts = raw
    .replace(/\\/g, "/")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0 || parts.length > MAX_DEPTH) return null;
  if (parts.some((part) => part === "." || part === ".." || !NAME.test(part))) return null;
  return parts.join("/");
}

export function normalizeWorkspace(rawEntries: unknown, rawActive: unknown): { entries: WorkspaceEntry[]; activePath: string } | { error: string } {
  if (!Array.isArray(rawEntries)) return { error: "Files are missing." };
  if (rawEntries.length > MAX_ENTRIES) return { error: "That workspace has too many files." };

  const byPath = new Map<string, WorkspaceEntry>();
  let chars = 0;
  for (const item of rawEntries) {
    if (!item || typeof item !== "object") return { error: "A file in this workspace is not valid." };
    const record = item as { path?: unknown; kind?: unknown; content?: unknown };
    const kind = record.kind === "folder" ? "folder" : record.kind === "file" ? "file" : null;
    if (!kind) return { error: "A file in this workspace is not valid." };
    const path = cleanPath(record.path);
    if (!path) return { error: "Use a simple name, like notes/hello.py." };
    if (byPath.has(path)) return { error: "Two items use the same name." };
    const content = kind === "file" ? String(record.content ?? "").slice(0, MAX_FILE_CHARS) : "";
    chars += content.length;
    if (chars > MAX_TOTAL_CHARS) return { error: "This workspace is too large to save." };
    byPath.set(path, { path, kind, content });
  }

  for (const entry of [...byPath.values()]) {
    const parts = entry.path.split("/");
    for (let i = 1; i < parts.length; i += 1) {
      const folder = parts.slice(0, i).join("/");
      const existing = byPath.get(folder);
      if (existing?.kind === "file") return { error: "A file and a folder cannot share a name." };
      if (!existing) byPath.set(folder, { path: folder, kind: "folder", content: "" });
    }
  }

  const entries = [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
  if (entries.length > MAX_ENTRIES) return { error: "That workspace has too many files." };
  const active = cleanPath(rawActive) ?? "";
  const activeOk = entries.some((entry) => entry.kind === "file" && entry.path === active);
  const fallback = entries.find((entry) => entry.kind === "file")?.path ?? "";
  return { entries, activePath: activeOk ? active : fallback };
}

export async function readPythonWorkspace(userId: string, email: string) {
  const doc = await PythonWorkspace.findOne({ userId: new Types.ObjectId(userId) }).lean<{
    email: string;
    activePath: string;
    entries: IPythonWorkspaceEntry[];
  }>();
  return {
    email: doc?.email || email.toLowerCase(),
    activePath: doc?.activePath || "",
    entries: (doc?.entries ?? []).map((entry) => ({
      path: entry.path,
      kind: entry.kind,
      content: entry.kind === "file" ? entry.content || "" : "",
    })),
  };
}

export async function savePythonWorkspace(userId: string, email: string, entries: WorkspaceEntry[], activePath: string) {
  const saved = await PythonWorkspace.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: { email: email.toLowerCase(), entries, activePath } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean<{ email: string; activePath: string; entries: IPythonWorkspaceEntry[] }>();
  return {
    email: saved?.email || email.toLowerCase(),
    activePath: saved?.activePath || "",
    entries: (saved?.entries ?? []).map((entry) => ({
      path: entry.path,
      kind: entry.kind,
      content: entry.kind === "file" ? entry.content || "" : "",
    })),
  };
}
