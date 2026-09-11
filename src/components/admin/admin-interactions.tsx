"use client";

import { AdminSection, AdminStatCard } from "@/components/admin/admin-ui";
import {
  fetchAdminInteractions,
  type AdminInteractionRow,
  type AdminInteractionsPayload,
} from "@/lib/admin-api";
import { feedbackTypeLabel, interactionRoleLabel } from "@/lib/user-interaction";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2, Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "h-3 w-3",
            n <= value ? "fill-coral text-coral" : "text-hairline",
          )}
        />
      ))}
    </span>
  );
}

export function AdminInteractions({ adminKey }: { adminKey: string }) {
  const [data, setData] = useState<AdminInteractionsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetchAdminInteractions(adminKey));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => {
    const list = data?.rows ?? [];
    if (typeFilter === "all") return list;
    return list.filter((r) => r.feedbackType === typeFilter);
  }, [data, typeFilter]);

  return (
    <AdminSection
      id="interactions"
      title="User interaction"
      description="Feedback, feature requests, and star reviews from /contact and /request-feature"
    >
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AdminStatCard label="Submissions" value={data?.total ?? 0} accent="coral" />
        <AdminStatCard
          label="Average rating"
          value={data?.averageRating ? `${data.averageRating} / 5` : "—"}
          accent="butter"
        />
        <AdminStatCard label="5-star reviews" value={data?.fiveStars ?? 0} accent="sage" />
        <AdminStatCard label="Feature titles" value={data?.featureRequests ?? 0} />
      </div>

      <div className="mt-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="h-10 rounded-lg border border-hairline bg-white px-2 text-xs text-ink"
        >
          <option value="all">All types</option>
          {Object.keys(data?.byType ?? {}).map((id) => (
            <option key={id} value={id}>
              {feedbackTypeLabel(id)} ({data?.byType[id]})
            </option>
          ))}
        </select>
      </div>

      {loading && !data && (
        <p className="mt-4 flex items-center gap-2 border border-hairline bg-white px-3 py-6 text-xs text-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading interactions…
        </p>
      )}

      {error && (
        <p className="mt-4 border border-hairline bg-butter/40 px-3 py-3 text-xs text-ink">
          {error}
        </p>
      )}

      <div className="mt-4 border border-hairline bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-hairline bg-cream-band/60 text-[10px] font-semibold uppercase tracking-wider text-muted">
                <th className="px-3 py-2">From</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Rating</th>
                <th className="px-3 py-2">Feature</th>
                <th className="px-3 py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-muted">
                    No submissions yet
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <InteractionRows
                    key={row.id}
                    row={row}
                    open={openId === row.id}
                    onToggle={() => setOpenId(openId === row.id ? null : row.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminSection>
  );
}

function InteractionRows({
  row,
  open,
  onToggle,
}: {
  row: AdminInteractionRow;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-b border-hairline/70 hover:bg-cream/50">
        <td className="px-3 py-2">
          <button type="button" onClick={onToggle} className="flex items-start gap-1.5 text-left">
            <ChevronDown
              className={cn("mt-0.5 h-3.5 w-3.5 shrink-0 text-muted transition", open && "rotate-180")}
            />
            <span>
              <span className="block font-medium text-ink">{row.name}</span>
              <span className="block text-[10px] text-muted">
                {row.email} · {interactionRoleLabel(row.role)} · {row.city}
              </span>
            </span>
          </button>
        </td>
        <td className="px-3 py-2 text-ink">{feedbackTypeLabel(row.feedbackType)}</td>
        <td className="px-3 py-2">
          <Stars value={row.rating} />
        </td>
        <td className="max-w-[220px] truncate px-3 py-2 text-muted">
          {row.featureTitle || "—"}
        </td>
        <td className="whitespace-nowrap px-3 py-2 text-muted">{formatDate(row.createdAt)}</td>
      </tr>
      {open && (
        <tr className="border-b border-hairline bg-cream/70">
          <td colSpan={5} className="px-4 py-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-hairline bg-white px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Feedback
                </p>
                <p className="mt-1 whitespace-pre-wrap text-xs text-ink">{row.feedback}</p>
              </div>
              <div className="rounded-lg border border-hairline bg-white px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Review
                </p>
                <p className="mt-1 text-xs text-ink">
                  <Stars value={row.rating} />{" "}
                  <span className="ml-1 tabular-nums">{row.rating}/5</span>
                </p>
                <p className="mt-1 whitespace-pre-wrap text-xs text-muted">
                  {row.review || "No review text"}
                </p>
              </div>
              <div className="rounded-lg border border-hairline bg-white px-3 py-2 sm:col-span-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Feature request
                </p>
                <p className="mt-1 text-xs font-semibold text-ink">
                  {row.featureTitle || "—"}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-xs text-muted">
                  {row.featureDescription || "No feature description"}
                </p>
                <p className="mt-2 text-[10px] text-muted">
                  Page {row.page} · {row.country}
                </p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
