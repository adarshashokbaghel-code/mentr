"use client";

import { PythonEngine, getPythonEngine, type RuntimeState } from "@/lib/python/engine";
import { useSyncExternalStore } from "react";

const subscribe = (l: () => void) => getPythonEngine().subscribe(l);
const getSnapshot = () => getPythonEngine().getSnapshot();

/** Live runtime status (loading progress, ready, running, error) for any component. */
export function usePythonRuntime(): RuntimeState {
  return useSyncExternalStore(subscribe, getSnapshot, PythonEngine.serverSnapshot);
}
