"use client";

import { fetchAdminRequirements, type AdminRequirementRow } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

export function AdminRequirementsTable({ adminKey }: { adminKey: string }) {
  const [rows, setRows] = useState<AdminRequirementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminRequirements(adminKey);
      setRows(data.posts);
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
          All board posts · {rows.length}
        </p>
        <p className="mt-0.5 text-[11px] text-muted">
          Requirement threads posted by parents
        </p>
      </div>

      {error && (
        <p className="border-b border-hairline bg-butter/40 px-3 py-2 text-xs text-ink">{error}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-hairline bg-cream-band/60 text-[10px] font-semibold uppercase tracking-wider text-muted">
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Level</th>
              <th className="px-3 py-2">Location</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Interests</th>
              <th className="px-3 py-2">Parent</th>
              <th className="px-3 py-2">Details</th>
              <th className="px-3 py-2">Posted</th>
              <th className="px-3 py-2">Expires</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-muted">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading…
                  </span>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-muted">
                  No board posts yet
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-hairline/70 hover:bg-cream/50">
                  <td className="px-3 py-2 font-medium text-ink">{row.subject}</td>
                  <td className="px-3 py-2 text-muted">{row.classLevel}</td>
                  <td className="px-3 py-2 text-muted">
                    {row.city}
                    {row.area ? ` · ${row.area}` : ""}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                        row.status === "open" ? "bg-sage-wash text-sage" : "bg-cream-band text-muted",
                      )}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 tabular-nums text-ink">{row.interestCount}</td>
                  <td className="max-w-[140px] truncate px-3 py-2 text-muted">{row.parentEmail}</td>
                  <td className="max-w-[180px] truncate px-3 py-2 text-muted" title={row.details}>
                    {row.details}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted">{formatDate(row.createdAt)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-muted">{formatDate(row.expiresAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
