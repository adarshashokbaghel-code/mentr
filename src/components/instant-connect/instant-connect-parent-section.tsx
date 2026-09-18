"use client";

import {
  formatIcBudget,
  instantConnectApi,
  type IcParentRequest,
} from "@/lib/instant-connect";
import { cn } from "@/lib/utils";
import { Loader2, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function InstantConnectParentSection() {
  const [tab, setTab] = useState<"active" | "history">("active");
  const [rows, setRows] = useState<IcParentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
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

  async function closeRequest(id: string) {
    setBusyId(id);
    setError("");
    try {
      const { request } = await instantConnectApi.close(id);
      setRows((prev) => prev.map((r) => (r.id === id ? request : r)));
      setConfirmId(null);
    } catch {
      setError("Could not close requirement");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section id="instant-connect" className="scroll-mt-24">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Zap className="h-5 w-5 text-ic-blue" />
          My Instant Connect Requests
        </h2>
        <p className="mt-1 text-sm text-muted">
          Mentors you notified can see your phone while a request is active.
        </p>
      </div>

      <div className="mt-4 flex gap-2">
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

      {error ? (
        <p className="mt-3 rounded-md border border-coral/40 bg-coral-wash px-3 py-2 text-[13px] font-medium text-coral-dark">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-4 text-sm text-muted">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          Loading…
        </p>
      ) : list.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-hairline bg-white px-4 py-8 text-center text-sm text-muted">
          {tab === "active"
            ? "No active Instant Connect requests. Use Instant Connect from the home or search page when you need a mentor quickly."
            : "No history yet."}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border-2 border-ink/10 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-ink">
                  {r.subject} · {r.classLevel}
                </p>
                <StatusPill status={r.status} />
              </div>
              <p className="mt-1 text-sm text-muted">
                {r.board} · {r.mode} · {formatIcBudget(r.budgetMin, r.budgetMax)}
              </p>
              <p className="mt-2 text-sm text-ink">
                {r.selectedCount} mentor{r.selectedCount === 1 ? "" : "s"} notified
                {" · "}
                Created {new Date(r.createdAt).toLocaleDateString()}
              </p>
              {r.status === "expired" ? (
                <p className="mt-2 text-xs font-semibold text-muted">
                  This requirement expired after 48 hours.
                </p>
              ) : null}
              {r.status === "active" ? (
                <button
                  type="button"
                  onClick={() => setConfirmId(r.id)}
                  className="mt-3 inline-flex h-9 items-center rounded-md border-2 border-ink/15 bg-cream px-3 text-xs font-bold text-ink hover:bg-white"
                >
                  I&apos;ve found a mentor
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {confirmId ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-md rounded-2xl border-2 border-ink bg-white p-5 shadow-xl">
            <h3 className="text-lg font-bold text-ink">Close this requirement?</h3>
            <p className="mt-2 text-sm text-muted">
              Once closed, mentors will no longer have access to your phone
              number through this request.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmId(null)}
                className="h-10 rounded-md border-2 border-ink/15 px-4 text-sm font-bold"
              >
                Keep Active
              </button>
              <button
                type="button"
                disabled={busyId === confirmId}
                onClick={() => void closeRequest(confirmId)}
                className="h-10 rounded-md bg-coral px-4 text-sm font-bold text-white hover:bg-coral-dark"
              >
                {busyId === confirmId ? (
                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                ) : (
                  "Close Requirement"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "active"
      ? "bg-ic-blue-wash text-ic-blue"
      : status === "closed"
        ? "bg-sage-wash text-sage"
        : "bg-cream-band text-muted";
  return (
    <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-bold uppercase", cls)}>
      {status}
    </span>
  );
}
