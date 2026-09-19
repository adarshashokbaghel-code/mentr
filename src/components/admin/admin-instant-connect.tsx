"use client";

import { AdminSection, AdminStatCard } from "@/components/admin/admin-ui";
import { instantConnectApi } from "@/lib/instant-connect";
import { cn } from "@/lib/utils";
import { Loader2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

type Summary = Awaited<ReturnType<typeof instantConnectApi.adminSummary>>;

export function AdminInstantConnect({ adminKey }: { adminKey: string }) {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    instantConnectApi
      .adminSummary(adminKey)
      .then(setData)
      .catch(() => setError("Failed to load Instant Connect admin data"))
      .finally(() => setLoading(false));
  }, [adminKey]);

  if (loading) {
    return (
      <p className="text-sm text-muted">
        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
        Loading Instant Connect…
      </p>
    );
  }

  if (error || !data) {
    return <p className="text-sm text-coral-dark">{error || "No data"}</p>;
  }

  const m = data.metrics;

  return (
    <div className="space-y-6">
      <AdminSection
        id="instant-connect"
        title="Instant Connect"
        description="Full request visibility: parent → mentors notified, hire outcome, and status. Phone numbers are never shown here."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <AdminStatCard label="Total" value={String(m.total)} />
          <AdminStatCard label="Active" value={String(m.active)} />
          <AdminStatCard label="Closed" value={String(m.closed)} />
          <AdminStatCard label="Expired" value={String(m.expired)} />
          <AdminStatCard label="Mentor found" value={String(m.mentorFound)} />
          <AdminStatCard label="1 mentor" value={String(m.with1)} />
          <AdminStatCard label="2 mentors" value={String(m.with2)} />
          <AdminStatCard label="3 mentors" value={String(m.with3)} />
          <AdminStatCard
            label="Avg close (h)"
            value={m.avgCloseHours != null ? String(m.avgCloseHours) : "—"}
          />
        </div>
      </AdminSection>

      <AdminSection
        id="instant-connect-recent"
        title="All requests"
        description="Who sent to whom, current status, and who was hired when marked mentor found."
      >
        <div className="space-y-3">
          {data.requests.length === 0 ? (
            <p className="rounded-xl border border-dashed border-hairline bg-white px-4 py-8 text-center text-sm text-muted">
              No Instant Connect requests yet
            </p>
          ) : (
            data.requests.map((r) => (
              <article
                key={r.id}
                className="rounded-xl border border-hairline bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">
                      {r.subject} · {r.classLevel}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {r.board} · {r.mode} · {r.lookingFor}
                      {" · "}
                      <span className="font-mono">{r.id.slice(-8)}</span>
                    </p>
                  </div>
                  <StatusBadge
                    status={r.status}
                    outcome={r.closeOutcome}
                  />
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      From (parent)
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-ink">
                      {r.parentName}
                    </p>
                    <p className="text-[11px] text-muted">{r.parentEmail}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Timeline
                    </p>
                    <p className="mt-0.5 text-[11px] text-ink">
                      Created {new Date(r.createdAt).toLocaleString()}
                    </p>
                    {r.closedAt ? (
                      <p className="text-[11px] text-muted">
                        Closed {new Date(r.closedAt).toLocaleString()}
                        {r.closedBy ? ` · by ${r.closedBy}` : ""}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted">
                        Expires {new Date(r.expiresAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                    Sent to ({r.mentorsNotified.length})
                  </p>
                  {r.mentorsNotified.length === 0 ? (
                    <p className="mt-1 text-xs text-muted">None</p>
                  ) : (
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {r.mentorsNotified.map((t) => {
                        const hired = r.mentorsHired.some((h) => h.id === t.id);
                        return (
                          <li
                            key={t.id}
                            className={cn(
                              "rounded-lg border px-2.5 py-1 text-xs",
                              hired
                                ? "border-sage/40 bg-sage-wash text-sage"
                                : "border-hairline bg-cream text-ink",
                            )}
                            title={t.email}
                          >
                            <span className="font-semibold">{t.name}</span>
                            {hired ? (
                              <span className="ml-1 font-bold uppercase">
                                · hired
                              </span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {r.closeOutcome === "mentor_found" &&
                r.mentorsHired.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Hired
                    </p>
                    <p className="mt-0.5 text-sm text-ink">
                      {r.mentorsHired.map((h) => h.name).join(", ")}
                    </p>
                  </div>
                ) : null}

                {r.closeNotes ? (
                  <div className="mt-2 rounded-lg bg-cream/60 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
                      Notes
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap text-xs text-ink">
                      {r.closeNotes}
                    </p>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </AdminSection>
    </div>
  );
}

function StatusBadge({
  status,
  outcome,
}: {
  status: string;
  outcome: string | null;
}) {
  if (status === "closed" && outcome === "mentor_found") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-sage-wash px-2 py-0.5 text-[10px] font-bold uppercase text-sage">
        <Zap className="h-3 w-3" />
        mentor found
      </span>
    );
  }
  const cls =
    status === "active"
      ? "bg-ic-blue-wash text-ic-blue"
      : status === "expired"
        ? "bg-cream-band text-muted"
        : "bg-cream-band text-muted";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase",
        cls,
      )}
    >
      <Zap className="h-3 w-3" />
      {status}
      {outcome === "dismissed" ? " · closed" : ""}
    </span>
  );
}
