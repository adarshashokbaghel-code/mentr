"use client";

import { AdminSection, AdminStatCard } from "@/components/admin/admin-ui";
import { AdminTrendChart } from "@/components/admin/admin-trend-chart";
import { fetchAdminPythonCompiler, type AdminPythonCompilerResponse } from "@/lib/admin-api";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDay(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function formatCount(n: number) {
  return n.toLocaleString("en-IN");
}

const SURFACE: Record<string, string> = {
  open: "Open compiler",
  lms: "Course compiler",
  project: "Final project",
};

/** Learner pressed Stop, or the runtime itself did not start. Not a bug in their Python. */
const RUNTIME_TYPES = new Set(["Stopped", "LoadError", "TimeoutError", "RemoteDisconnected"]);

export function AdminPythonCompiler({ adminKey }: { adminKey: string }) {
  const [data, setData] = useState<AdminPythonCompilerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAdminPythonCompiler(adminKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading compiler stats
      </div>
    );
  }

  if (error || !data) {
    return <p className="text-sm text-coral">{error || "Could not load compiler stats."}</p>;
  }

  const totals = data.totals;
  const week = data.week ?? {
    runs: 0,
    previousRuns: 0,
    ok: 0,
    previousOk: 0,
    openRuns: 0,
    previousOpenRuns: 0,
  };
  const open = data.surfaces.find((row) => row.id === "open");
  const finishedShare = totals.runs > 0 ? Math.round((totals.ok / totals.runs) * 100) : 0;
  const learnerNotes = data.errors.filter((row) => !RUNTIME_TYPES.has(row.type));
  const recentNotes = data.recentFailures.filter((row) => !RUNTIME_TYPES.has(row.errorType)).slice(0, 8);
  const runtimeNotes = [
    totals.stopped > 0 ? `${formatCount(totals.stopped)} stopped by the learner` : "",
    totals.loadFailed > 0 ? `${formatCount(totals.loadFailed)} could not load Python` : "",
    totals.remote > 0 ? `${formatCount(totals.remote)} lost the connection` : "",
    totals.timeouts > 0 ? `${formatCount(totals.timeouts)} ran too long` : "",
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <AdminSection
        id="python-compiler"
        title="Python compiler"
        description="Programs learners have run in the browser. A typo in their code still counts as engagement."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            label="Programs run"
            value={formatCount(totals.runs)}
            accent="coral"
            delta={{ current: week.runs, previous: week.previousRuns }}
            sub="All time"
          />
          <AdminStatCard
            label="Finished"
            value={formatCount(totals.ok)}
            accent="sage"
            delta={{ current: week.ok, previous: week.previousOk }}
            sub={`${finishedShare}% ran to the end`}
          />
          <AdminStatCard
            label="Last 7 days"
            value={formatCount(week.runs)}
            delta={{ current: week.runs, previous: week.previousRuns }}
            sub={`Prior 7 days: ${formatCount(week.previousRuns)}`}
          />
          <AdminStatCard
            label="Open compiler"
            value={formatCount(open?.runs ?? 0)}
            accent="sage"
            delta={{ current: week.openRuns, previous: week.previousOpenRuns }}
            sub="Public, no sign-in"
          />
        </div>
      </AdminSection>

      <div className="rounded-xl border border-hairline bg-white p-4">
        <p className="text-xs font-bold text-ink">Programs run, last 14 days</p>
        <div className="mt-4">
          <AdminTrendChart
            height={160}
            emptyLabel="No runs in the last 14 days"
            points={data.trend.map((point) => ({
              key: point.date,
              total: point.runs,
              title: `${formatDay(point.date)}: ${formatCount(point.runs)} runs, ${formatCount(point.ok ?? 0)} finished`,
            }))}
          />
        </div>
        <p className="mt-3 text-[11px] text-muted">
          {data.note}
          {data.trackingSince ? ` First recorded run: ${formatWhen(data.trackingSince)}.` : ""}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-white p-4">
          <p className="text-xs font-bold text-ink">Where they ran</p>
          <ul className="mt-3 divide-y divide-hairline text-sm">
            {data.surfaces.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2">
                <span>{row.label}</span>
                <span className="tabular-nums text-muted">
                  {row.runs === 0
                    ? "No runs yet"
                    : `${formatCount(row.runs)} runs · ${formatCount(row.runs - row.failed)} finished`}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">
            {formatCount(totals.anonymous)} public runs · {formatCount(totals.signedIn)} while signed in
          </p>
        </div>

        <div className="rounded-xl border border-hairline bg-white p-4">
          <p className="text-xs font-bold text-ink">Final projects</p>
          <ul className="mt-3 divide-y divide-hairline text-sm">
            {data.projects.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2">
                <span>{row.title}</span>
                <span className="shrink-0 tabular-nums text-muted">
                  {row.runs === 0 ? "No runs yet" : `${formatCount(row.runs)} runs · ${formatCount(row.passed)} passed`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-hairline bg-white p-4">
        <p className="text-xs font-bold text-ink">What their code said</p>
        <p className="mt-1 text-[11px] text-muted">
          Mistakes in the learner’s program, such as a missing comma or a name that is not defined. The compiler did its job.
        </p>
        {learnerNotes.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No code messages yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-hairline">
            {learnerNotes.map((row) => (
              <li key={row.type} className="py-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-sm font-semibold">{row.type}</span>
                  <span className="tabular-nums text-sm text-muted">{formatCount(row.count)}</span>
                </div>
                {row.sample ? <p className="mt-0.5 text-xs text-muted">{row.sample}</p> : null}
              </li>
            ))}
          </ul>
        )}
        {runtimeNotes.length > 0 ? (
          <p className="mt-3 text-[11px] text-muted">{runtimeNotes.join(" · ")}.</p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline bg-white">
        <p className="border-b border-hairline px-4 py-3 text-xs font-bold text-ink">Latest code messages</p>
        {recentNotes.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted">No code messages yet.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {recentNotes.map((row, i) => (
              <li key={`${row.at}-${i}`} className="px-4 py-2.5 text-sm">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-mono text-xs font-semibold">{row.errorType}</span>
                  <span className="text-[11px] text-muted">{formatWhen(row.at)}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {SURFACE[row.surface] ?? row.surface}
                  {row.projectId ? ` · ${row.projectId}` : ""}
                  {row.line ? ` · line ${row.line}` : ""}
                </p>
                {row.errorMessage ? <p className="mt-0.5 text-xs">{row.errorMessage}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
