"use client";

import { DEFAULT_TEMPLATE } from "@/components/learn-python/compiler/templates";
import { useCallback, useEffect, useMemo, useState } from "react";

type Workspace = { code: string; stdin: string };

const key = (userId: string) => `mentr:pycompiler:v1:${userId}`;

function write(userId: string, ws: Workspace) {
  try {
    window.localStorage.setItem(key(userId), JSON.stringify(ws));
  } catch {
    // Storage full or blocked; the session copy stays in memory.
  }
}

function read(userId: string): Workspace {
  try {
    const raw = window.localStorage.getItem(key(userId));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Workspace>;
      if (typeof parsed.code === "string") return { code: parsed.code, stdin: parsed.stdin ?? "" };
    }
  } catch {
    // Fall through to the starter program.
  }
  return { code: DEFAULT_TEMPLATE.code, stdin: "" };
}

/** Code and input saved per learner, so the compiler reopens where they left off. */
export function useCompilerWorkspace(userId: string) {
  const [ws, setWs] = useState<Workspace>(() => read(userId));

  useEffect(() => {
    const t = setTimeout(() => write(userId, ws), 300);
    return () => clearTimeout(t);
  }, [userId, ws]);

  const setCode = useCallback((code: string) => setWs((w) => ({ ...w, code })), []);
  const setStdin = useCallback((stdin: string) => setWs((w) => ({ ...w, stdin })), []);
  /** Saved immediately, so a full page load right after (opening the compiler) still sees it. */
  const load = useCallback(
    (code: string, stdin = "") => {
      const next = { code, stdin };
      write(userId, next);
      setWs(next);
    },
    [userId],
  );

  return useMemo(() => ({ code: ws.code, stdin: ws.stdin, setCode, setStdin, load }), [ws, setCode, setStdin, load]);
}
