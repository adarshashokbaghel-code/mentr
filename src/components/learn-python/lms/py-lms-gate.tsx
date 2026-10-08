"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { PyCompilerProvider } from "@/components/learn-python/compiler/compiler-provider";
import { PyLmsProvider } from "@/components/learn-python/lms/py-lms-provider";
import { PyLmsShell } from "@/components/learn-python/lms/py-lms-shell";
import { PythonStartSheet } from "@/components/learn-python/python-start-sheet";
import { LEARN_PYTHON_PATH } from "@/lib/learn-python";
import { markLearnPythonStarted } from "@/lib/marketing-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, type ReactNode } from "react";

/** /learnpython/lms is open to any signed-in parent or tutor; guests get the sign-in sheet. */
export function PyLmsGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const leave = useCallback(() => router.push(LEARN_PYTHON_PATH), [router]);
  const signedIn = Boolean(user);

  useEffect(() => {
    if (signedIn) markLearnPythonStarted();
  }, [signedIn]);

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-cream">
        <Loader2 className="h-7 w-7 animate-spin text-coral" />
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">Opening Learn Python…</p>
      </div>
    );
  }

  if (!user || (user.role !== "parent" && user.role !== "faculty")) {
    return (
      <div className="min-h-dvh bg-[#0f1612] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]">
        <PythonStartSheet open onClose={leave} onSignedIn={() => undefined} />
      </div>
    );
  }

  return (
    <PyLmsProvider key={user.id} userId={user.id}>
      <PyCompilerProvider key={user.id} userId={user.id}>
        <PyLmsShell>{children}</PyLmsShell>
      </PyCompilerProvider>
    </PyLmsProvider>
  );
}
