"use client";

import {
  formatIcBudget,
  instantConnectApi,
  type IcTutorRequest,
} from "@/lib/instant-connect";
import { cn } from "@/lib/utils";
import { Loader2, Phone, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function InstantConnectFacultySection({
  acceptingStudents,
  onAcceptingChange,
}: {
  acceptingStudents: boolean;
  onAcceptingChange: (next: boolean) => void;
}) {
  const [tab, setTab] = useState<"active" | "history">("active");
  const [rows, setRows] = useState<IcTutorRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState("");

  const reload = useCallback(() => {
    setLoading(true);
    instantConnectApi
      .tutorMine()
      .then((data) => setRows(data.requests))
      .catch(() => setError("Could not load Instant Connect inbox"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(reload, [reload]);

  const active = rows.filter((r) => r.status === "active");
  const history = rows.filter((r) => r.status !== "active");
  const list = tab === "active" ? active : history;

  async function toggleAccepting() {
    setToggling(true);
    try {
      const next = !acceptingStudents;
      await instantConnectApi.setAccepting(next);
      onAcceptingChange(next);
    } catch {
      setError("Could not update accepting preference");
    } finally {
      setToggling(false);
    }
  }

  return (
    <section id="instant-connect" className="scroll-mt-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Zap className="h-5 w-5 text-ic-blue" />
            Instant Connect
            {active.length > 0 ? (
              <span className="rounded-md bg-ic-blue px-1.5 py-0.5 text-xs font-bold text-white">
                {active.length}
              </span>
            ) : null}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Parents shared their number so you can contact them directly — no
            accept step. Contact hides when they close or after 48 hours.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void toggleAccepting()}
          disabled={toggling}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-lg border-2 px-3 text-xs font-bold",
            acceptingStudents
              ? "border-sage bg-sage-wash text-sage"
              : "border-ink/15 bg-white text-muted",
          )}
        >
          {toggling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Accepting new students: {acceptingStudents ? "Yes" : "No"}
        </button>
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
            ? "No active Instant Connect requests yet."
            : "No history yet."}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border-2 border-ink/10 bg-white p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ic-blue">
                  Instant Connect Request
                </p>
                <StatusPill status={r.status} />
              </div>
              <p className="mt-1 text-base font-bold text-ink">
                {r.classLevel} · {r.subject}
              </p>
              <p className="text-sm text-muted">
                {r.board} · {r.mode}
                {r.location ? ` · ${r.location}` : ""}
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">
                Budget: {formatIcBudget(r.budgetMin, r.budgetMax)}
                {r.preferredTime ? ` · Preferred: ${r.preferredTime}` : ""}
              </p>
              {r.message ? (
                <p className="mt-2 rounded-lg bg-cream px-3 py-2 text-sm text-ink/80">
                  {r.message}
                </p>
              ) : null}
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-ic-blue/20 bg-ic-blue-wash/60 px-3 py-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ic-blue" />
                <div className="min-w-0 text-sm">
                  {r.parentContact.available ? (
                    <>
                      <p className="font-bold text-ink">
                        Parent contact: {r.parentContact.phone}
                      </p>
                      <p className="text-xs text-muted">
                        Contact available until the requirement is closed.
                      </p>
                    </>
                  ) : (
                    <p className="font-semibold text-muted">
                      {r.status === "expired"
                        ? "Requirement expired. Parent contact is no longer available."
                        : "Requirement closed by parent. Parent contact is no longer available."}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
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
