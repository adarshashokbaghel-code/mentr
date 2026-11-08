"use client";

import { ApiError, pythonFilesApi, type PythonWorkspaceEntry } from "@/lib/api";
import { useCallback, useEffect, useRef, useState } from "react";

const NAME = /^[A-Za-z_][A-Za-z0-9._-]{0,48}$/;

export type PythonFileEntry = PythonWorkspaceEntry;

function parentOf(path: string) {
  const i = path.lastIndexOf("/");
  return i === -1 ? "" : path.slice(0, i);
}

export const DEMO_MAIN = `from greetings.hello import hello
from maths.score import average

name = "Aarav"
marks = [18, 20, 16]
print(hello(name))
print("Average", average(marks))
`;

const DEMO_FILES: PythonFileEntry[] = [
  { path: "greetings", kind: "folder", content: "" },
  { path: "greetings/__init__.py", kind: "file", content: "" },
  {
    path: "greetings/hello.py",
    kind: "file",
    content: `def hello(name):
    return f"Hello, {name}"
`,
  },
  { path: "maths", kind: "folder", content: "" },
  { path: "maths/__init__.py", kind: "file", content: "" },
  {
    path: "maths/score.py",
    kind: "file",
    content: `def average(marks):
    return sum(marks) / len(marks)
`,
  },
];

export function workspacePath(parent: string, name: string) {
  return `${parent}/${name}`
    .replace(/\\/g, "/")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("/");
}

export function usePythonFiles(enabled: boolean) {
  const [entries, setEntries] = useState<PythonFileEntry[]>([]);
  const [activePath, setActivePath] = useState("");
  const [email, setEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<number | null>(null);
  const generation = useRef(0);
  const pending = useRef<{ entries: PythonFileEntry[]; active: string } | null>(null);

  const flush = useCallback(() => {
    const payload = pending.current;
    if (!payload) return;
    pending.current = null;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    setSaving(true);
    const gen = generation.current;
    void pythonFilesApi
      .save({ entries: payload.entries, activePath: payload.active })
      .then((saved) => {
        if (generation.current !== gen) return;
        setEmail(saved.email);
        setError(null);
      })
      .catch((err: unknown) => {
        if (generation.current !== gen) return;
        setError(err instanceof ApiError ? err.message : "Could not save your files.");
      })
      .finally(() => {
        if (generation.current === gen) setSaving(false);
      });
  }, []);

  const persist = useCallback((nextEntries: PythonFileEntry[], nextActive: string) => {
    pending.current = { entries: nextEntries, active: nextActive };
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(flush, 450);
  }, [flush]);

  useEffect(() => {
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [flush]);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      setShowSetup(false);
      return;
    }
    const gen = ++generation.current;
    setReady(false);
    void pythonFilesApi
      .get()
      .then((data) => {
        if (generation.current !== gen) return;
        setEmail(data.email);
        if (pending.current) {
          setReady(true);
          return;
        }
        setEntries(data.entries);
        setActivePath(data.activePath);
        setShowSetup(data.entries.length === 0);
        setError(null);
        setReady(true);
      })
      .catch((err: unknown) => {
        if (generation.current !== gen) return;
        setError(err instanceof ApiError ? err.message : "Could not open your files.");
        setReady(true);
      });
  }, [enabled]);

  const commit = useCallback(
    (nextEntries: PythonFileEntry[], nextActive: string) => {
      setEntries(nextEntries);
      setActivePath(nextActive);
      setShowSetup(false);
      persist(nextEntries, nextActive);
    },
    [persist],
  );

  const updateActive = useCallback(
    (content: string) => {
      if (!ready || !activePath) return;
      setEntries((prev) => {
        const next = prev.map((entry) =>
          entry.path === activePath && entry.kind === "file" ? { ...entry, content } : entry,
        );
        persist(next, activePath);
        return next;
      });
    },
    [activePath, persist, ready],
  );

  const openFile = useCallback(
    (path: string) => {
      if (!entries.some((entry) => entry.kind === "file" && entry.path === path)) return;
      setActivePath(path);
      persist(entries, path);
    },
    [entries, persist],
  );

  const createEntry = useCallback(
    (parent: string, name: string, kind: "file" | "folder", content = "") => {
      const parts = workspacePath(parent, name).split("/").filter(Boolean);
      if (parts.length === 0 || parts.some((part) => !NAME.test(part))) {
        return "Use letters, numbers, dots or dashes.";
      }
      if (parts.length > 6) return "That folder is nested too deep.";
      const path = parts.join("/");
      if (entries.some((entry) => entry.path === path)) return "That name is already used.";
      const next = [...entries];
      for (let i = 1; i < parts.length; i += 1) {
        const folder = parts.slice(0, i).join("/");
        const existing = next.find((entry) => entry.path === folder);
        if (existing?.kind === "file") return "A file and a folder cannot share a name.";
        if (!existing) next.push({ path: folder, kind: "folder", content: "" });
      }
      const leaf = next.find((entry) => entry.path === path);
      if (leaf) return "That name is already used.";
      next.push({ path, kind, content: kind === "file" ? content : "" });
      commit(next, kind === "file" ? path : activePath);
      return null;
    },
    [activePath, commit, entries],
  );

  const removeEntry = useCallback(
    (path: string) => {
      const next = entries.filter((entry) => entry.path !== path && !entry.path.startsWith(`${path}/`));
      const stillThere = next.some((entry) => entry.kind === "file" && entry.path === activePath);
      const nextActive = stillThere ? activePath : (next.find((entry) => entry.kind === "file")?.path ?? "");
      commit(next, nextActive);
    },
    [activePath, commit, entries],
  );

  const seedDemo = useCallback(() => {
    const next = entries.map((entry) => ({ ...entry }));
    for (const entry of DEMO_FILES) {
      if (!next.some((item) => item.path === entry.path)) next.push({ ...entry });
    }
    const main = next.find((entry) => entry.path === "main.py" && entry.kind === "file");
    const mainTaken = Boolean(main && main.content.trim() && main.content !== DEMO_MAIN);
    const mainPath = mainTaken ? "preview_main.py" : "main.py";
    const slot = next.find((entry) => entry.path === mainPath && entry.kind === "file");
    if (!slot) next.push({ path: mainPath, kind: "file", content: DEMO_MAIN });
    else if (!slot.content.trim() || slot.content === DEMO_MAIN) slot.content = DEMO_MAIN;
    commit(next, mainPath);
  }, [commit, entries]);

  const startWorkspace = useCallback(
    (folder: string, file: string, content: string) => {
      const fileName = (file.trim() || "main.py").replace(/\\/g, "/").split("/").pop() ?? "main.py";
      if (!NAME.test(fileName)) return "Use a simple file name, like main.py.";
      const folderName = folder.trim();
      const next: PythonFileEntry[] = [];
      let filePath = fileName;
      if (folderName) {
        if (!NAME.test(folderName)) return "Use a simple folder name, like week-1.";
        next.push({ path: folderName, kind: "folder", content: "" });
        filePath = `${folderName}/${fileName}`;
      }
      next.push({ path: filePath, kind: "file", content });
      commit(next, filePath);
      return null;
    },
    [commit],
  );

  return {
    enabled,
    ready,
    email,
    entries,
    activePath,
    showSetup,
    error,
    saving,
    updateActive,
    openFile,
    createEntry,
    seedDemo,
    removeEntry,
    startWorkspace,
    parentOf,
  };
}
