"use client";

import {
  fetchAdminDemoRequests,
  type AdminDemoRequestRow,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_CLS: Record<string, string> = {
  pending: "bg-butter/70 text-ink",
  accepted: "bg-sage-wash text-sage",
  declined: "bg-cream-band text-muted",
};

export function AdminDemoRequestsTable({ adminKey }: { adminKey: string }) {
  const [rows, setRows] = useState<AdminDemoRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminDemoRequests(adminKey);
      setRows(data.requests);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const pending = rows.filter((r) => r.status === "pending").length;
  const accepted = rows.filter((r) => r.status === "accepted").length;
  const declined = rows.filter((r) => r.status === "declined").length;

  if (loading) {
    return (
      <p className="mt-4 flex items-center gap-2 text-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading demo requests…
      </p>
    );
  }

  if (error) {
    return <p className="mt-4 text-sm font-medium text-coral-dark">{error}</p>;
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ["Total", rows.length, "text-ink"],
            ["Waiting", pending, "text-ink"],
            ["Accepted", accepted, "text-sage"],
            ["Declined", declined, "text-muted"],
          ] as const
        ).map(([label, value, tone]) => (
          <div
            key={label}
            className="rounded-lg border border-hairline bg-white px-3 py-2"
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              {label}
            </p>
            <p className={cn("mt-0.5 text-lg font-bold tabular-nums", tone)}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-hairline bg-white px-4 py-8 text-center text-sm text-muted">
          No demo requests yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-hairline bg-white">
          <table className="min-w-[760px] w-full text-left text-[13px]">
            <thead className="border-b border-hairline bg-cream/60 text-[11px] uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-2 font-semibold">When</th>
                <th className="px-3 py-2 font-semibold">Parent</th>
                <th className="px-3 py-2 font-semibold">Tutor</th>
                <th className="px-3 py-2 font-semibold">Demo</th>
                <th className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const open = expanded === row.id;
                return (
                  <tr
                    key={row.id}
                    className="cursor-pointer border-b border-hairline last:border-0 hover:bg-cream/40"
                    onClick={() => setExpanded(open ? null : row.id)}
                  >
                    <td className="px-3 py-2.5 align-top text-muted">
                      {formatDate(row.createdAt)}
                      {open ? (
                        <div className="mt-2 max-w-xs space-y-1 normal-case tracking-normal text-ink">
                          <p>
                            <span className="font-semibold">Phone:</span>{" "}
                            {row.parentPhone}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span>{" "}
                            {row.parentEmail}
                          </p>
                          {row.note ? (
                            <p>
                              <span className="font-semibold">Note:</span>{" "}
                              {row.note}
                            </p>
                          ) : null}
                          {row.tutorNote ? (
                            <p>
                              <span className="font-semibold">Tutor note:</span>{" "}
                              {row.tutorNote}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <p className="font-semibold text-ink">{row.parentName}</p>
                      <p className="text-xs text-muted">{row.parentCity}</p>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <p className="font-semibold text-ink">{row.teacherName}</p>
                      <p className="text-xs text-muted">{row.teacherEmail}</p>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <p className="font-semibold text-ink">
                        {row.subject} · {row.classLevel}
                      </p>
                      <p className="text-xs text-muted">
                        {row.preferredDate} · {row.preferredTime}
                        {row.board ? ` · ${row.board}` : ""} · Online
                      </p>
                    </td>
                    <td className="px-3 py-2.5 align-top">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-bold capitalize",
                          STATUS_CLS[row.status] || "bg-cream text-muted",
                        )}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
