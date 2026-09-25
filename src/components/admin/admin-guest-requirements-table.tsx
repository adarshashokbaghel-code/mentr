"use client";

import {
  fetchAdminGuestRequirements,
  type AdminGuestRequirementRow,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Fragment, useCallback, useEffect, useState } from "react";

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
  new: "bg-coral-wash text-coral-dark",
  not_interested: "bg-cream-band text-muted",
  got_hired: "bg-sage-wash text-sage",
};

export function AdminGuestRequirementsTable({
  adminKey,
}: {
  adminKey: string;
}) {
  const [rows, setRows] = useState<AdminGuestRequirementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminGuestRequirements(adminKey);
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

  const newCount = rows.filter((r) => r.status === "new").length;
  const hiredCount = rows.filter((r) => r.status === "got_hired").length;
  const passedCount = rows.filter((r) => r.status === "not_interested").length;

  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-lg border border-hairline bg-white px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Total
          </p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-ink">
            {rows.length}
          </p>
        </div>
        <div className="rounded-lg border border-hairline bg-white px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            New
          </p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-coral-dark">
            {newCount}
          </p>
        </div>
        <div className="rounded-lg border border-hairline bg-white px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Got hired
          </p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-sage">
            {hiredCount}
          </p>
        </div>
        <div className="rounded-lg border border-hairline bg-white px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Not interested
          </p>
          <p className="mt-0.5 text-lg font-bold tabular-nums text-muted">
            {passedCount}
          </p>
        </div>
      </div>

      <div className="border border-hairline bg-white">
        <div className="border-b border-hairline px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            Guest requests · {rows.length}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Parents who messaged a Premium mentor without creating an account
          </p>
        </div>

        {error ? (
          <p className="border-b border-hairline bg-butter/40 px-3 py-2 text-xs text-ink">
            {error}
          </p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-hairline bg-cream-band/60 text-[10px] font-semibold uppercase tracking-wider text-muted">
                <th className="px-3 py-2">Parent</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Need</th>
                <th className="px-3 py-2">Mentor</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Activity</th>
                <th className="px-3 py-2">Created</th>
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
                    No guest requests yet
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <Fragment key={row.id}>
                    <tr
                      className="cursor-pointer border-b border-hairline/70 hover:bg-cream/50"
                      onClick={() =>
                        setExpanded((id) => (id === row.id ? null : row.id))
                      }
                    >
                      <td className="px-3 py-2 font-medium text-ink">
                        {row.name}
                      </td>
                      <td className="px-3 py-2 text-muted">
                        <div>{row.phone}</div>
                        <div className="max-w-[160px] truncate">{row.email}</div>
                      </td>
                      <td className="px-3 py-2 text-ink">
                        <div className="font-medium">{row.requirement}</div>
                        <div className="mt-0.5 line-clamp-1 text-muted">
                          {row.description}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-muted">
                        <div className="font-medium text-ink">
                          {row.teacherName}
                        </div>
                        <div className="max-w-[140px] truncate">
                          {row.teacherEmail}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-bold capitalize",
                            STATUS_CLS[row.status] ?? "bg-cream text-muted",
                          )}
                        >
                          {row.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted">
                        {row.activity.length} event
                        {row.activity.length === 1 ? "" : "s"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-muted">
                        {formatDate(row.createdAt)}
                      </td>
                    </tr>
                    {expanded === row.id ? (
                      <tr className="border-b border-hairline bg-cream/40">
                        <td colSpan={7} className="px-3 py-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                            Full details
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-[12px] text-ink">
                            {row.description}
                          </p>
                          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-muted">
                            Activity log
                          </p>
                          <ul className="mt-1 space-y-1">
                            {row.activity.length === 0 ? (
                              <li className="text-[12px] text-muted">
                                No activity recorded
                              </li>
                            ) : (
                              row.activity.map((a, i) => (
                                <li
                                  key={`${a.action}-${a.at}-${i}`}
                                  className="text-[12px] text-ink"
                                >
                                  <span className="font-semibold capitalize">
                                    {a.action.replace(/_/g, " ")}
                                  </span>
                                  <span className="text-muted">
                                    {" "}
                                    · {formatDate(a.at)}
                                  </span>
                                </li>
                              ))
                            )}
                          </ul>
                          {row.respondedAt ? (
                            <p className="mt-2 text-[11px] text-muted">
                              Mentor responded {formatDate(row.respondedAt)}
                            </p>
                          ) : null}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
