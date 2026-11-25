import { randomBytes } from "crypto";
import { PythonShare } from "../models/PythonShare";
import { normalizeWorkspace, type WorkspaceEntry } from "./python-workspace";

function makeShareId() {
  return randomBytes(6).toString("base64url");
}

export async function createPythonShare(input: {
  title?: string;
  stdin?: string;
  activePath?: string;
  entries?: unknown;
  code?: string;
}) {
  const stdin = String(input.stdin ?? "").slice(0, 20_000);
  const title = String(input.title ?? "").slice(0, 80);

  let entries: WorkspaceEntry[];
  let activePath: string;

  if (Array.isArray(input.entries) && input.entries.length > 0) {
    const normalized = normalizeWorkspace(input.entries, input.activePath);
    if ("error" in normalized) return { error: normalized.error } as const;
    entries = normalized.entries;
    activePath = normalized.activePath;
  } else {
    const code = String(input.code ?? "").slice(0, 80_000);
    if (!code.trim()) return { error: "Add some code before sharing." } as const;
    entries = [{ path: "main.py", kind: "file", content: code }];
    activePath = "main.py";
  }

  for (let i = 0; i < 6; i += 1) {
    const shareId = makeShareId();
    try {
      const doc = await PythonShare.create({ shareId, title, stdin, activePath, entries });
      return {
        shareId: doc.shareId,
        title: doc.title,
        stdin: doc.stdin,
        activePath: doc.activePath,
        entries: doc.entries,
      } as const;
    } catch (err) {
      const code = (err as { code?: number }).code;
      if (code !== 11000) throw err;
    }
  }
  return { error: "Could not create a share link. Try again." } as const;
}

export async function readPythonShare(shareId: string) {
  const id = String(shareId || "").trim();
  if (!/^[A-Za-z0-9_-]{6,16}$/.test(id)) return null;
  const doc = await PythonShare.findOne({ shareId: id }).lean<IPythonShareLean>();
  if (!doc) return null;
  return {
    shareId: doc.shareId,
    title: doc.title || "",
    stdin: doc.stdin || "",
    activePath: doc.activePath || "main.py",
    entries: (doc.entries ?? []).map((entry) => ({
      path: entry.path,
      kind: entry.kind,
      content: entry.kind === "file" ? entry.content || "" : "",
    })),
  };
}

type IPythonShareLean = {
  shareId: string;
  title?: string;
  stdin?: string;
  activePath?: string;
  entries?: { path: string; kind: "file" | "folder"; content?: string }[];
};
