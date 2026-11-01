"use client";

import { AdminSection, AdminStatCard, AdminTrendChart } from "@/components/admin/admin-ui";
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

const SURFACE: Record<string, string> = {
  open: "Open compiler",
  lms: "Course compiler",
  project: "Project",
};

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

  const { totals } = data;

  return (
    <div className="space-y-4">
      <AdminSection
        id="python-compiler"
        title="Python compiler"
        description="How many programs ran, and which errors came back. Counts only — the code itself is not stored."
      >
        <p className="text-xs text-muted">
          {data.note}
          {data.trackingSince ? ` First recorded run: ${formatWhen(data.trackingSince)}.` : " Nothing recorded yet."}
        </p>
      </AdminSection>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard label="Programs run" value={totals.runs} accent="coral" />
        <AdminStatCard label="Finished" value={totals.ok} accent="sage" />
        <AdminStatCard label="Failed" value={totals.failed} />
        <AdminStatCard label="Timed out" value={totals.timeouts} accent="butter" />
      </div>

      <div className="rounded-xl border border-hairline bg-white p-4">
        <p className="text-xs font-bold text-ink">Runs, last 14 days</p>
        <div className="mt-4">
          <AdminTrendChart
            height={144}
            emptyLabel="No runs in the last 14 days"
            points={data.trend.map((point) => ({
              key: point.date,
              total: point.runs,
              title: `${formatDay(point.date)}: ${point.runs} runs, ${point.failed} failed`,
            }))}
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-white p-4">
          <p className="text-xs font-bold text-ink">Where they ran</p>
          <ul className="mt-3 divide-y divide-hairline text-sm">
            {data.surfaces.map((row) => (
              <li key={row.id} className="flex items-center justify-between py-2">
                <span>{row.label}</span>
                <span className="tabular-nums text-muted">
                  {row.runs} run{row.runs === 1 ? "" : "s"} · {row.failed} failed
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">
            {totals.signedIn} while signed in · {totals.anonymous} without an account
          </p>
        </div>

        <div className="rounded-xl border border-hairline bg-white p-4">
          <p className="text-xs font-bold text-ink">Final projects</p>
          <ul className="mt-3 divide-y divide-hairline text-sm">
            {data.projects.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2">
                <span>{row.title}</span>
                <span className="shrink-0 tabular-nums text-muted">
                  {row.runs} runs · {row.passed} passed · {row.failed} errors
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-hairline bg-white p-4">
        <p className="text-xs font-bold text-ink">Errors</p>
        {data.errors.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No failures recorded yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-hairline">
            {data.errors.map((row) => (
              <li key={row.type} className="py-2">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-sm font-semibold">{row.type}</span>
                  <span className="tabular-nums text-sm text-muted">{row.count}</span>
                </div>
                {row.sample ? <p className="mt-0.5 text-xs text-muted">{row.sample}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-hairline bg-white">
        <p className="border-b border-hairline px-4 py-3 text-xs font-bold text-ink">Latest failures</p>
        {data.recentFailures.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted">No failures recorded yet.</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {data.recentFailures.map((row, i) => (
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
