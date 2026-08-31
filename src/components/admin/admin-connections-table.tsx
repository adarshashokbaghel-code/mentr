"use client";

import { fetchAdminConnections, type AdminConnectionRow } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "accepted"
      ? "bg-sage-wash text-sage"
      : status === "pending"
        ? "bg-butter/60 text-ink"
        : "bg-cream-band text-muted";
  return (
    <span className={cn("inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase", styles)}>
      {status}
    </span>
  );
}

export function AdminConnectionsTable({ adminKey }: { adminKey: string }) {
  const [rows, setRows] = useState<AdminConnectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminConnections(adminKey);
      setRows(data.connections);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="mt-4 border border-hairline bg-white">
      <div className="border-b border-hairline px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          All connections · {rows.length}
        </p>
        <p className="mt-0.5 text-[11px] text-muted">
          Parent ↔ tutor requests — who connected with whom
        </p>
      </div>

      {error && (
        <p className="border-b border-hairline bg-butter/40 px-3 py-2 text-xs text-ink">{error}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-hairline bg-cream-band/60 text-[10px] font-semibold uppercase tracking-wider text-muted">
              <th className="px-3 py-2">Parent</th>
              <th className="px-3 py-2">Tutor</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Initiated by</th>
              <th className="px-3 py-2">Message</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Responded</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading…
                  </span>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-muted">
                  No connections yet
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-hairline/70 hover:bg-cream/50">
                  <td className="px-3 py-2">
                    <span className="block font-medium text-ink">{row.parentName}</span>
                    <span className="block truncate text-[10px] text-muted">{row.parentEmail}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="block font-medium text-ink">{row.teacherName}</span>
                    <span className="block truncate text-[10px] text-muted">{row.teacherEmail}</span>
                  </td>
                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-2 capitalize text-muted">{row.requestedBy}</td>
                  <td className="max-w-[200px] truncate px-3 py-2 text-muted" title={row.message}>
                    {row.message}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted">{formatDate(row.createdAt)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted">{formatDate(row.respondedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
