"use client";

import { SharedPythonCompiler } from "@/components/learn-python/compiler/shared-python-compiler";
import { ApiError, pythonShareApi, type PythonSharePayload } from "@/lib/api";
import { useEffect, useState } from "react";

export function SharedCompilerLoader({ shareId }: { shareId: string }) {
  const [share, setShare] = useState<PythonSharePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void pythonShareApi
      .get(shareId)
      .then((data) => {
        if (!cancelled) setShare(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not open that share.");
      });
    return () => {
      cancelled = true;
    };
  }, [shareId]);

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#e7eef6] px-4 text-center">
        <p className="text-[18px] font-extrabold text-ink">Share not found</p>
        <p className="max-w-md text-[14px] text-muted">{error}</p>
        <a href="/openpythoncompiler" className="rounded-full bg-[#3d84c6] px-4 py-2 text-[13px] font-semibold text-white">
          Open compiler
        </a>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#e7eef6] text-[14px] text-muted">
        Loading shared program…
      </div>
    );
  }

  return <SharedPythonCompiler share={share} />;
}
