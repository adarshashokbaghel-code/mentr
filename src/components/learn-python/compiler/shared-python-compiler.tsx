"use client";

import { PyCompilerProvider } from "@/components/learn-python/compiler/compiler-provider";
import { PyCompiler } from "@/components/learn-python/compiler/py-compiler";
import type { PythonSharePayload } from "@/lib/api";
import { LEARN_PYTHON_PATH } from "@/lib/learn-python";

export function SharedPythonCompiler({ share }: { share: PythonSharePayload }) {
  return (
    <PyCompilerProvider userId={`share:${share.shareId}`}>
      <div id="compiler" className="h-dvh max-h-dvh overflow-hidden">
        <PyCompiler
          surface="open"
          homeHref={LEARN_PYTHON_PATH}
          homeLabel="Learn Python free on Mentr"
          initialShare={share}
          readOnly
        />
      </div>
    </PyCompilerProvider>
  );
}
