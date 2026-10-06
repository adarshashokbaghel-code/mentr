"use client";

import { useCompilerWorkspace } from "@/components/learn-python/compiler/use-compiler-workspace";
import { PY_COMPILER_PATH } from "@/lib/python-lms";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

type Workspace = ReturnType<typeof useCompilerWorkspace>;

type CompilerContextValue = {
  workspace: Workspace;
  /** Goes to the compiler page; passing code loads it into the editor (replacing the current program). */
  openCompiler: (code?: string) => void;
};

const CompilerContext = createContext<CompilerContextValue | null>(null);

/** Holds the learner's compiler code above the routes, so lessons can hand code to the compiler page. */
export function PyCompilerProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const workspace = useCompilerWorkspace(userId);
  const { load } = workspace;

  const openCompiler = useCallback(
    (code?: string) => {
      if (code !== undefined) load(code);
      // Full page load: the compiler page is cross-origin isolated (interactive input()), which only applies to a fresh document.
      window.location.assign(PY_COMPILER_PATH);
    },
    [load],
  );

  const value = useMemo(() => ({ workspace, openCompiler }), [workspace, openCompiler]);
  return <CompilerContext.Provider value={value}>{children}</CompilerContext.Provider>;
}

export function usePyCompiler(): CompilerContextValue {
  const ctx = useContext(CompilerContext);
  if (!ctx) throw new Error("usePyCompiler must be used within PyCompilerProvider");
  return ctx;
}
