"use client";

import {
  formatIcBudget,
  instantConnectApi,
  type IcParentRequest,
} from "@/lib/instant-connect";
import { cn } from "@/lib/utils";
import {
  Check,
  Loader2,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type MentorOption = {
  id: string;
  name: string;
  subjects: string[];
  hourlyRate: number | null;
  profileImageUrl: string | null;
};

type CloseFlow =
  | { step: "confirm"; requestId: string }
  | {
      step: "hire";
      requestId: string;
      mentors: MentorOption[];
      loadingMentors: boolean;
    }
  | {
      step: "notes";
      requestId: string;
      mentors: MentorOption[];
      hiredIds: string[];
    };

export function InstantConnectParentSection() {
  const [tab, setTab] = useState<"active" | "history">("active");
  const [rows, setRows] = useState<IcParentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [flow, setFlow] = useState<CloseFlow | null>(null);
  const [hiredIds, setHiredIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    instantConnectApi
      .mine()
      .then((data) => setRows(data.requests))
      .catch(() => setError("Could not load Instant Connect requests"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  const active = rows.filter((r) => r.status === "active");
  const history = rows.filter((r) => r.status !== "active");
  const list = tab === "active" ? active : history;

  function openClose(id: string) {
    setError("");
    setHiredIds([]);
    setNotes("");
    setFlow({ step: "confirm", requestId: id });
  }

  function closeFlow() {
    if (busy) return;
    setFlow(null);
    setHiredIds([]);
    setNotes("");
  }

  async function dismissRequest(id: string) {
    setBusy(true);
    setError("");
    try {
      const { request } = await instantConnectApi.close(id, {
        outcome: "dismissed",
      });
      setRows((prev) => prev.map((r) => (r.id === id ? request : r)));
      setFlow(null);
    } catch {
      setError("Could not close requirement");
    } finally {
      setBusy(false);
    }
  }

  async function startMentorFound(id: string) {
    setBusy(true);
    setError("");
    setFlow({
      step: "hire",
      requestId: id,
      mentors: [],
      loadingMentors: true,
    });
    try {
      const data = await instantConnectApi.get(id);
      setFlow({
        step: "hire",
        requestId: id,
        mentors: data.mentors,
        loadingMentors: false,
      });
      setHiredIds(data.mentors.length === 1 ? [data.mentors[0].id] : []);
    } catch {
      setError("Could not load mentors for this request");
      setFlow({ step: "confirm", requestId: id });
    } finally {
      setBusy(false);
    }
  }

  async function submitMentorFound() {
    if (!flow || (flow.step !== "hire" && flow.step !== "notes")) return;
    if (hiredIds.length < 1) {
      setError("Select at least one mentor you hired");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { request } = await instantConnectApi.close(flow.requestId, {
        outcome: "mentor_found",
        hiredTutorIds: hiredIds,
        notes: notes.trim() || undefined,
      });
      setRows((prev) =>
        prev.map((r) => (r.id === flow.requestId ? request : r)),
      );
      setFlow(null);
      setHiredIds([]);
      setNotes("");
    } catch {
      setError("Could not save mentor found");
    } finally {
      setBusy(false);
    }
  }

  function toggleHired(id: string) {
    setHiredIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <section id="instant-connect" className="scroll-mt-24">
      <div>
        <h2 className="flex items-center gap-1.5 text-lg font-semibold">
          <Zap className="h-5 w-5 text-ic-blue" />
          Quick match
        </h2>
        <p className="mt-1 text-xs text-muted">
          Mentors you pick can call you while a request is active (or 48h).
        </p>
      </div>

      {active.length > 0 || history.length > 0 ? (
        <div className="mt-3 flex gap-2">
          {(["active", "history"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold capitalize",
                tab === t
                  ? "bg-ic-blue text-white"
                  : "bg-cream text-muted hover:text-ink",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}

      {error && !flow ? (
        <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-3 text-sm text-muted">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          Loading…
        </p>
      ) : list.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-hairline bg-white px-4 py-6 text-center text-sm text-muted">
          {tab === "active"
            ? "No active quick matches. Use Instant Connect from home or search when you need a tutor fast."
            : "No history yet."}
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border-2 border-ink/10 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink">
                      {r.subject} · {r.classLevel}
                    </p>
                    <StatusPill status={r.status} outcome={r.closeOutcome} />
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {r.board} · {r.mode} ·{" "}
                    {formatIcBudget(r.budgetMin, r.budgetMax)}
                  </p>
                  <p className="mt-2 text-sm text-ink">
                    {r.selectedCount} mentor
                    {r.selectedCount === 1 ? "" : "s"} notified
                    {" · "}
                    Created {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                  {r.status === "expired" ? (
                    <p className="mt-2 text-xs font-semibold text-muted">
                      This requirement expired after 48 hours.
                    </p>
                  ) : null}
                  {r.closeOutcome === "mentor_found" ? (
                    <p className="mt-2 text-xs font-semibold text-sage">
                      Mentor found
                      {r.hiredTutorIds.length
                        ? ` · ${r.hiredTutorIds.length} hired`
                        : ""}
                    </p>
                  ) : null}
                </div>
                {r.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => openClose(r.id)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <XCircle className="h-5 w-5" strokeWidth={2.25} />
                    Close request
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {flow ? (
        <CloseRequestModal
          flow={flow}
          busy={busy}
          error={error}
          hiredIds={hiredIds}
          notes={notes}
          onClose={closeFlow}
          onDismiss={() => void dismissRequest(flow.requestId)}
          onFoundMentor={() => void startMentorFound(flow.requestId)}
          onToggleHired={toggleHired}
          onNotesChange={setNotes}
          onContinueToNotes={() => {
            if (flow.step !== "hire" || hiredIds.length < 1) {
              setError("Select at least one mentor you hired");
              return;
            }
            setError("");
            setFlow({
              step: "notes",
              requestId: flow.requestId,
              mentors: flow.mentors,
              hiredIds,
            });
          }}
          onBackToHire={() => {
            if (flow.step !== "notes") return;
            setError("");
            setFlow({
              step: "hire",
              requestId: flow.requestId,
              mentors: flow.mentors,
              loadingMentors: false,
            });
          }}
          onSubmitFound={() => void submitMentorFound()}
        />
      ) : null}
    </section>
  );
}

function CloseRequestModal({
  flow,
  busy,
  error,
  hiredIds,
  notes,
  onClose,
  onDismiss,
  onFoundMentor,
  onToggleHired,
  onNotesChange,
  onContinueToNotes,
  onBackToHire,
  onSubmitFound,
}: {
  flow: CloseFlow;
  busy: boolean;
  error: string;
  hiredIds: string[];
  notes: string;
  onClose: () => void;
  onDismiss: () => void;
  onFoundMentor: () => void;
  onToggleHired: (id: string) => void;
  onNotesChange: (v: string) => void;
  onContinueToNotes: () => void;
  onBackToHire: () => void;
  onSubmitFound: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-t-2xl border-2 border-ink bg-white shadow-xl sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-hairline px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-ink">
              {flow.step === "confirm"
                ? "Close this request?"
                : flow.step === "hire"
                  ? "Who did you hire?"
                  : "Anything to add?"}
            </h3>
            <p className="mt-1 text-xs text-muted">
              {flow.step === "confirm"
                ? "Your number will disappear from tutors’ Instant Connect inbox."
                : flow.step === "hire"
                  ? "Tick the mentors you connected with from this request."
                  : "Optional — helps us improve matching."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-md p-1.5 text-muted hover:bg-cream hover:text-ink"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          {flow.step === "confirm" ? (
            <p className="text-sm leading-relaxed text-ink">
              Are you sure? Once closed, mentors can no longer see your phone
              through this request. Make sure you have found a mentor before
              closing.
            </p>
          ) : null}

          {flow.step === "hire" ? (
            flow.loadingMentors ? (
              <p className="py-6 text-center text-sm text-muted">
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                Loading mentors…
              </p>
            ) : flow.mentors.length === 0 ? (
              <p className="text-sm text-muted">No mentors on this request.</p>
            ) : (
              <ul className="space-y-2">
                {flow.mentors.map((m) => {
                  const on = hiredIds.includes(m.id);
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => onToggleHired(m.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition",
                          on
                            ? "border-sage bg-sage-wash"
                            : "border-ink/10 bg-cream/40 hover:border-ink/20",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2",
                            on
                              ? "border-sage bg-sage text-white"
                              : "border-ink/20 bg-white",
                          )}
                        >
                          {on ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-ink">
                            {m.name}
                          </span>
                          {m.subjects.length ? (
                            <span className="block truncate text-[11px] text-muted">
                              {m.subjects.slice(0, 3).join(" · ")}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )
          ) : null}

          {flow.step === "notes" ? (
            <div>
              <p className="mb-2 text-xs font-semibold text-muted">
                Hired:{" "}
                {flow.mentors
                  .filter((m) => hiredIds.includes(m.id))
                  .map((m) => m.name)
                  .join(", ") || "—"}
              </p>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="Optional notes (timing, rate, feedback…)"
                className="w-full resize-none rounded-xl border-2 border-ink/10 bg-cream/30 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-ink/25"
              />
              <p className="mt-1 text-right text-[10px] text-muted">
                {notes.length}/500
              </p>
            </div>
          ) : null}

          {error ? (
            <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[12px] font-medium text-coral-dark">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-hairline bg-cream/30 px-5 py-4 sm:flex-row sm:justify-end">
          {flow.step === "confirm" ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onDismiss}
                className="h-10 rounded-lg border-2 border-ink/12 bg-white px-4 text-sm font-bold text-ink hover:bg-cream"
              >
                {busy ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Close"
                )}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onFoundMentor}
                className="h-10 rounded-lg bg-ink px-4 text-sm font-bold text-white hover:bg-ink/90"
              >
                I have found a mentor
              </button>
            </>
          ) : null}

          {flow.step === "hire" ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onClose}
                className="h-10 rounded-lg border-2 border-ink/12 bg-white px-4 text-sm font-bold text-ink hover:bg-cream"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || flow.loadingMentors || hiredIds.length < 1}
                onClick={onContinueToNotes}
                className="h-10 rounded-lg bg-ink px-4 text-sm font-bold text-white hover:bg-ink/90 disabled:opacity-40"
              >
                Continue
              </button>
            </>
          ) : null}

          {flow.step === "notes" ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={onBackToHire}
                className="h-10 rounded-lg border-2 border-ink/12 bg-white px-4 text-sm font-bold text-ink hover:bg-cream"
              >
                Back
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={onSubmitFound}
                className="h-10 rounded-lg bg-sage px-4 text-sm font-bold text-white hover:opacity-90"
              >
                {busy ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Confirm & close"
                )}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  status,
  outcome,
}: {
  status: string;
  outcome?: string | null;
}) {
  if (status === "closed" && outcome === "mentor_found") {
    return (
      <span className="rounded-md bg-sage-wash px-2 py-0.5 text-[10px] font-bold uppercase text-sage">
        mentor found
      </span>
    );
  }
  const cls =
    status === "active"
      ? "bg-ic-blue-wash text-ic-blue"
      : status === "closed"
        ? "bg-cream-band text-muted"
        : "bg-cream-band text-muted";
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
        cls,
      )}
    >
      {status}
    </span>
  );
}
