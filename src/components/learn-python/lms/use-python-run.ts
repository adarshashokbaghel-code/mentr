"use client";

import { isPythonReady, runPython, type PythonRunResult } from "@/lib/python-runner";
import { useCallback, useRef, useState } from "react";

export function usePythonRun() {
  const [result, setResult] = useState<PythonRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [firstLoad, setFirstLoad] = useState(false);
  const busy = useRef(false);

  const run = useCallback(async (code: string, inputs?: string[]): Promise<PythonRunResult | null> => {
    if (busy.current) return null;
    busy.current = true;
    setFirstLoad(!isPythonReady());
    setRunning(true);
    try {
      const r = await runPython(code, inputs ?? []);
      setResult(r);
      return r;
    } finally {
      busy.current = false;
      setRunning(false);
    }
  }, []);

  const reset = useCallback(() => setResult(null), []);

  return { result, running, firstLoad, run, reset };
}
