"use client";

import { PyCompilerProvider } from "@/components/learn-python/compiler/compiler-provider";
import { PyCompiler } from "@/components/learn-python/compiler/py-compiler";
import { LEARN_PYTHON_PATH } from "@/lib/learn-python";

/** Public, no sign-in: the program is saved on this device only. */
export function OpenPythonCompiler() {
  return (
    <PyCompilerProvider userId="open">
      <div className="h-dvh max-h-dvh overflow-hidden">
        <PyCompiler homeHref={LEARN_PYTHON_PATH} homeLabel="Learn Python free on Mentr" />
      </div>
    </PyCompilerProvider>
  );
}
