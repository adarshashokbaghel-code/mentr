type TrackInput = {
  surface: "open" | "lms" | "project";
  projectId?: string;
  ok: boolean;
  status: string;
  passed?: boolean;
  errorType?: string;
  errorMessage?: string;
  line?: number;
  durationMs: number;
  chars: number;
};

/** Fire-and-forget. Sends a summary only — never the program, input, or output. */
export function trackPythonRun(input: TrackInput): void {
  if (typeof window === "undefined") return;
  const token = window.localStorage.getItem("champs_token");
  void fetch("/api/python-compiler/runs", {
    method: "POST",
    credentials: "include",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      surface: input.surface,
      projectId: input.projectId,
      ok: input.ok,
      status: input.status,
      passed: input.passed,
      errorType: input.errorType,
      errorMessage: input.errorMessage?.slice(0, 160),
      line: input.line,
      durationMs: input.durationMs,
      chars: input.chars,
    }),
  }).catch(() => undefined);
}
