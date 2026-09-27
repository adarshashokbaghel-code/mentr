"use client";

import { AdminSection } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import {
  fetchAdminPremiumCheckoutLeads,
  type AdminPremiumCheckoutLead,
  type PremiumCheckoutStage,
} from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { Loader2, MessageCircle, Phone, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Filter = "abandoned" | "all" | "paid";

const STAGE_LABEL: Record<PremiumCheckoutStage, string> = {
  opened: "Opened popup",
  dismissed: "Closed popup",
  pay_clicked: "Clicked Pay",
  failed: "Payment failed",
  paid: "Paid",
};

const STAGE_TONE: Record<PremiumCheckoutStage, string> = {
  opened: "bg-cream-band text-ink",
  dismissed: "bg-butter/70 text-ink",
  pay_clicked: "bg-coral-wash text-coral",
  failed: "bg-coral text-white",
  paid: "bg-sage-wash text-sage",
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function whatsappHref(phone: string, name: string | null) {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.length === 10 ? `91${digits}` : digits;
  const text = `Hi${name ? ` ${name.split(" ")[0]}` : ""}, this is the Mentr team. We noticed you were checking out Mentr Premium — can we help you complete it or answer any questions?`;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

export function AdminPremiumCheckoutLeads({ adminKey }: { adminKey: string }) {
  const [leads, setLeads] = useState<AdminPremiumCheckoutLead[]>([]);
  const [stats, setStats] = useState<{
    users: number;
    opened: number;
    payClicked: number;
    paid: number;
    abandoned: number;
  } | null>(null);
  const [days, setDays] = useState(30);
  const [filter, setFilter] = useState<Filter>("abandoned");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reloadTick, setReloadTick] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchAdminPremiumCheckoutLeads(adminKey, days)
      .then((data) => {
        if (cancelled) return;
        setLeads(data.leads);
        setStats(data.stats);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [adminKey, days, reloadTick]);

  const shown = useMemo(
    () =>
      leads.filter((l) =>
        filter === "all" ? true : filter === "paid" ? l.paid : !l.paid,
      ),
    [leads, filter],
  );

  return (
    <AdminSection
      id="premium-checkout-leads"
      title="Premium checkout leads"
      description="Everyone who opened the Premium payment popup. Follow up with those who closed it without paying."
      actions={
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => {
              setLoading(true);
              setDays(Number(e.target.value));
            }}
            className="h-8 rounded-md border border-hairline bg-white px-2 text-xs font-semibold"
            aria-label="Time range"
          >
            <option value={1}>Today</option>
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={load}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            Refresh
          </Button>
        </div>
      }
    >
      {error ? (
        <p className="rounded-lg border border-coral/30 bg-coral-wash/40 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-4">
        <Tile label="Opened popup" value={stats?.opened ?? 0} />
        <Tile label="Clicked Pay" value={stats?.payClicked ?? 0} />
        <Tile label="Paid" value={stats?.paid ?? 0} tone="sage" />
        <Tile label="To follow up" value={stats?.abandoned ?? 0} tone="coral" />
      </div>

      <div className="mt-4 flex gap-1 rounded-lg border border-hairline bg-white p-1 text-xs font-bold">
        {(
          [
            ["abandoned", "Didn't pay"],
            ["all", "All"],
            ["paid", "Paid"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 transition",
              filter === id ? "bg-ink text-white" : "text-muted hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && leads.length === 0 ? (
        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading checkout activity…
        </p>
      ) : shown.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No checkout activity in this range.</p>
      ) : (
        <ul className="mt-4 divide-y divide-hairline overflow-hidden rounded-xl border border-hairline bg-white">
          {shown.map((l) => (
            <li
              key={l.userId}
              className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold text-ink">
                    {l.name || "Unnamed user"}
                  </p>
                  <span className="rounded bg-cream-band px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                    {l.role === "faculty" ? "Mentor" : l.role}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      STAGE_TONE[l.paid ? "paid" : l.furthestStage],
                    )}
                  >
                    {STAGE_LABEL[l.paid ? "paid" : l.furthestStage]}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {l.email || "—"}
                  {l.phone ? ` · ${l.phone}` : " · no phone"}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  Last {formatWhen(l.lastSeenAt)} · opened {l.opens}× · pay
                  clicked {l.payClicks}×
                  {l.lastMonths ? ` · ${l.lastMonths} mo` : ""}
                  {l.lastCurrency ? ` · ${l.lastCurrency}` : ""}
                  {l.lastSource ? ` · ${l.lastSource}` : ""}
                </p>
              </div>
              {l.phone ? (
                <div className="flex shrink-0 gap-2">
                  <a
                    href={whatsappHref(l.phone, l.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-sage px-3 text-xs font-bold text-white hover:opacity-90"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${l.phone}`}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline px-3 text-xs font-bold text-ink hover:bg-cream"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </a>
                </div>
              ) : l.email ? (
                <a
                  href={`mailto:${l.email}`}
                  className="shrink-0 text-xs font-bold text-coral hover:underline"
                >
                  Email →
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </AdminSection>
  );
}

function Tile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "sage" | "coral";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        tone === "sage"
          ? "border-sage/30 bg-sage-wash/50"
          : tone === "coral"
            ? "border-coral/30 bg-coral-wash/40"
            : "border-hairline bg-cream",
      )}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-ink">{value}</p>
    </div>
  );
}
