"use client";

import { AdminSection, AdminStatCard } from "@/components/admin/admin-ui";
import { instantConnectApi } from "@/lib/instant-connect";
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
        description="Matching + direct contact requests. Phone numbers are never shown in this list."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard label="Total" value={String(m.total)} />
          <AdminStatCard label="Active" value={String(m.active)} />
          <AdminStatCard label="Closed" value={String(m.closed)} />
          <AdminStatCard label="Expired" value={String(m.expired)} />
          <AdminStatCard label="1 mentor" value={String(m.with1)} />
          <AdminStatCard label="2 mentors" value={String(m.with2)} />
          <AdminStatCard label="3 mentors" value={String(m.with3)} />
          <AdminStatCard
            label="Avg close (h)"
            value={m.avgCloseHours != null ? String(m.avgCloseHours) : "—"}
          />
        </div>
      </AdminSection>

      <AdminSection id="instant-connect-recent" title="Recent requests">
        <div className="overflow-x-auto rounded-xl border border-hairline bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-hairline bg-cream text-[11px] font-bold uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Parent</th>
                <th className="px-3 py-2">Subject</th>
                <th className="px-3 py-2">Class</th>
                <th className="px-3 py-2">Mentors</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted">
                    No Instant Connect requests yet
                  </td>
                </tr>
              ) : (
                data.requests.map((r) => (
                  <tr key={r.id} className="border-b border-hairline/70">
                    <td className="px-3 py-2 font-mono text-[11px] text-muted">
                      {r.id.slice(-8)}
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-semibold text-ink">{r.parentName}</p>
                      <p className="text-[11px] text-muted">{r.parentEmail}</p>
                    </td>
                    <td className="px-3 py-2">{r.subject}</td>
                    <td className="px-3 py-2">{r.classLevel}</td>
                    <td className="px-3 py-2">{r.mentorsNotified}</td>
                    <td className="px-3 py-2 text-xs text-muted">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-ic-blue-wash px-2 py-0.5 text-[10px] font-bold uppercase text-ic-blue">
                        <Zap className="h-3 w-3" />
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminSection>
    </div>
  );
}
