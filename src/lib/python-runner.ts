"use client";

import { LESSON_TIMEOUT_MS } from "@/lib/python/config";
import { getPythonEngine } from "@/lib/python/engine";

/** Compact result used by lessons and their answer checks. */
export type PythonRunResult = {
  ok: boolean;
  stdout: string;
  /** Last line of the Python traceback, e.g. "NameError: name 'x' is not defined". */
  error?: string;
  /** Line number from the traceback, when Python reports one. */
  errorLine?: number;
};

/** Downloads Python once per visit. Safe to call repeatedly. */
export function preloadPython(): Promise<void> {
  return getPythonEngine().preload();
}

export function isPythonReady(): boolean {
  const phase = getPythonEngine().getSnapshot().phase;
  return phase === "ready" || phase === "running";
}

export async function runPython(code: string, inputs: string[] = []): Promise<PythonRunResult> {
  const r = await getPythonEngine().run(code, { stdin: inputs.join("\n"), timeoutMs: LESSON_TIMEOUT_MS });
  const stdout = r.stdout.replace(/\n$/, "");
  if (r.ok) return { ok: true, stdout };
  const e = r.error;
  const error = !e
    ? "Something went wrong"
    : e.type === "TimeoutError"
      ? "Your program ran for too long and was stopped. Look for a loop that never ends."
      : e.type === "LoadError" || e.type === "Stopped" || e.type === "RuntimeError"
        ? e.message
        : `${e.type}: ${e.message}`;
  return { ok: false, stdout, error, errorLine: e?.line };
}
