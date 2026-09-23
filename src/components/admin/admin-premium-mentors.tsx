"use client";

import { AdminSection } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import {
  fetchAdminPremiumMentors,
  type AdminPremiumMentorRow,
  type AdminPremiumMentorStats,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Crown, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function formatWhen(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatInr(n: number | null | undefined) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function AdminPremiumMentors({ adminKey }: { adminKey: string }) {
  const [rows, setRows] = useState<AdminPremiumMentorRow[]>([]);
  const [stats, setStats] = useState<AdminPremiumMentorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminPremiumMentors(adminKey);
      setRows(data.mentors);
      setStats(data.stats || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const active = rows.filter((r) => r.premiumActive || r.status === "verified");
  const expired = rows.filter((r) => r.status === "expired");

  return (
    <AdminSection
      id="premium-mentors"
      title="Premium mentors"
      description="Full conversion view — Razorpay revenue, active/expired, and parent-contact reveals."
      actions={
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => void load()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
          Refresh
        </Button>
      }
    >
      {error ? (
        <p className="rounded-lg border border-coral/30 bg-coral-wash/40 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Active Premium"
          value={stats?.activePremium ?? active.length}
          tone="sage"
        />
        <StatTile
          label="Revenue (all)"
          value={formatInr(stats?.totalRevenueInr ?? 0)}
        />
        <StatTile
          label="Conversions · 30d"
          value={stats?.conversions30d ?? 0}
          sub={formatInr(stats?.revenue30dInr)}
        />
        <StatTile
          label="Reveals today"
          value={stats?.revealsToday ?? 0}
          sub={`${stats?.totalRevealsAllTime ?? 0} all-time`}
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <StatTile label="Expired" value={stats?.expired ?? expired.length} />
        <StatTile
          label="Razorpay converts"
          value={stats?.razorpayConversions ?? 0}
        />
        <StatTile
          label="Revenue · 7d"
          value={formatInr(stats?.revenue7dInr ?? 0)}
        />
      </div>

      {loading && rows.length === 0 ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading conversions…
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No Premium conversions yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-white">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold text-ink">{r.name}</p>
                  <StatusPill status={r.status} active={r.premiumActive} />
                  {r.source === "razorpay" ? (
                    <span className="inline-flex items-center gap-0.5 rounded bg-butter/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
                      <Crown className="h-2.5 w-2.5" />
                      Razorpay
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {r.email}
                  {r.city ? ` · ${r.city}` : ""}
                  {r.phone ? ` · ${r.phone}` : ""}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  Paid {formatWhen(r.submittedAt)}
                  {r.expiresAt ? ` · expires ${formatWhen(r.expiresAt)}` : ""}
                  {r.months ? ` · ${r.months} mo` : ""}
                  {r.receiptNumber ? ` · ${r.receiptNumber}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-left sm:text-right">
                <p className="text-sm font-bold tabular-nums text-ink">
                  {formatInr(r.revenueInr ?? r.amountInr)}
                </p>
                <p className="text-[11px] text-muted">
                  {r.paidCount ?? 0} payment{(r.paidCount ?? 0) === 1 ? "" : "s"}
                  {" · "}
                  {r.totalReveals ?? 0} reveals
                  {(r.revealsToday ?? 0) > 0
                    ? ` (${r.revealsToday} today)`
                    : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminSection>
  );
}

function StatTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string | number;
  sub?: string | null;
  tone?: "sage";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        tone === "sage"
          ? "border-sage/30 bg-sage-wash/50"
          : "border-hairline bg-cream",
      )}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</p>
      {sub ? <p className="mt-0.5 text-[11px] text-muted">{sub}</p> : null}
    </div>
  );
}

function StatusPill({
  status,
  active,
}: {
  status: AdminPremiumMentorRow["status"];
  active?: boolean;
}) {
  if (active || status === "verified") {
    return (
      <span className="rounded bg-sage-wash px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage">
        Active
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="rounded bg-butter/70 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">
        Pending
      </span>
    );
  }
  if (status === "expired") {
    return (
      <span className="rounded bg-coral-wash px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-coral">
        Expired
      </span>
    );
  }
  return null;
}
