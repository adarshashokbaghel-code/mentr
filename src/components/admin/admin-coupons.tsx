"use client";

import { AdminPassDialog } from "@/components/admin/admin-pass-dialog";
import { AdminSection, AdminStatCard } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import {
  createAdminCoupon,
  fetchAdminCoupons,
  fetchAdminCouponUsage,
  updateAdminCoupon,
  type AdminCoupon,
  type AdminCouponInput,
  type AdminCouponPatch,
  type AdminCouponStatus,
  type AdminCouponUsageEvent,
} from "@/lib/admin-api";
import { premiumMentorApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  IndianRupee,
  Loader2,
  Plus,
  RefreshCw,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PLAN_MONTHS = [2, 3, 4] as const;

const FALLBACK_PLAN_PRICES: Record<number, number> = { 2: 898, 3: 1185, 4: 1473 };

const STATUS_STYLES: Record<AdminCouponStatus, string> = {
  active: "bg-sage/15 text-sage",
  inactive: "bg-ink/10 text-ink/60",
  scheduled: "bg-butter text-ink",
  expired: "bg-coral-wash text-coral-dark",
  exhausted: "bg-coral-wash text-coral-dark",
};

const EVENT_STYLES: Record<AdminCouponUsageEvent["event"], string> = {
  applied: "bg-sage/15 text-sage",
  rejected: "bg-coral-wash text-coral-dark",
  redeemed: "bg-ink text-white",
};

const EVENT_LABELS: Record<AdminCouponUsageEvent["event"], string> = {
  applied: "Applied",
  rejected: "Rejected",
  redeemed: "Paid",
};

function inr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

/** YYYY-MM-DD in IST, matching how the server parses date-only inputs. */
function istDay(d: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function plusMonths(d: Date, months: number) {
  const next = new Date(d.getTime());
  const day = next.getDate();
  next.setMonth(next.getMonth() + months);
  if (next.getDate() < day) next.setDate(0);
  return next;
}

type FormState = {
  code: string;
  discountInr: string;
  planMonths: number[];
  validFrom: string;
  validUntil: string;
  maxRedemptions: string;
  perUserLimit: string;
  description: string;
};

function emptyForm(): FormState {
  const now = new Date();
  return {
    code: "",
    discountInr: "",
    planMonths: [2],
    validFrom: istDay(now),
    validUntil: istDay(plusMonths(now, 2)),
    maxRedemptions: "",
    perUserLimit: "1",
    description: "",
  };
}

type PendingAction =
  | { kind: "create"; body: AdminCouponInput }
  | { kind: "update"; id: string; body: AdminCouponPatch };

export function AdminCoupons({ adminKey }: { adminKey: string }) {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planPrices, setPlanPrices] =
    useState<Record<number, number>>(FALLBACK_PLAN_PRICES);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const [pending, setPending] = useState<PendingAction | null>(null);
  const [passOpen, setPassOpen] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const passRef = useRef<string | null>(null);

  const [usageFor, setUsageFor] = useState<string | null>(null);
  const [usage, setUsage] = useState<AdminCouponUsageEvent[]>([]);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usageError, setUsageError] = useState<string | null>(null);
  const [usageFilter, setUsageFilter] = useState<
    "all" | AdminCouponUsageEvent["event"]
  >("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminCoupons(adminKey);
      setCoupons(data.coupons);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    premiumMentorApi
      .catalog()
      .then((cat) => {
        const next: Record<number, number> = {};
        for (const p of cat.plans) next[p.months] = p.payInr;
        if (Object.keys(next).length) setPlanPrices(next);
      })
      .catch(() => {});
  }, []);

  const totals = useMemo(() => {
    return coupons.reduce(
      (acc, c) => {
        acc.live += c.status === "active" ? 1 : 0;
        acc.entries += c.stats.entries;
        acc.redemptions += c.stats.redemptions;
        acc.discount += c.stats.discountGivenInr;
        acc.revenue += c.stats.revenueInr;
        return acc;
      },
      { live: 0, entries: 0, redemptions: 0, discount: 0, revenue: 0 },
    );
  }, [coupons]);

  const discountNum = Math.floor(Number(form.discountInr) || 0);
  const selectedPlanPrices = form.planMonths
    .map((m) => ({ months: m, pay: planPrices[m] ?? 0 }))
    .sort((a, b) => a.months - b.months);
  const cheapest = selectedPlanPrices.length
    ? Math.min(...selectedPlanPrices.map((p) => p.pay))
    : 0;

  function validateForm(): AdminCouponInput | null {
    const code = form.code.trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,24}$/.test(code)) {
      setFormError("Code must be 3–24 characters: letters, numbers, - or _");
      return null;
    }
    if (discountNum < 1) {
      setFormError("Enter how many rupees off (at least ₹1).");
      return null;
    }
    if (form.planMonths.length === 0) {
      setFormError("Pick at least one plan the coupon works on.");
      return null;
    }
    if (cheapest && discountNum >= cheapest) {
      setFormError(
        `Discount must be less than the cheapest selected plan (${inr(cheapest)}).`,
      );
      return null;
    }
    if (form.validUntil && form.validFrom && form.validUntil < form.validFrom) {
      setFormError("End date must be on or after the start date.");
      return null;
    }
    const perUser = Math.floor(Number(form.perUserLimit) || 1);
    const max = form.maxRedemptions.trim()
      ? Math.floor(Number(form.maxRedemptions))
      : null;
    if (max != null && (!Number.isFinite(max) || max < 1)) {
      setFormError("Total uses must be blank (unlimited) or at least 1.");
      return null;
    }
    setFormError(null);
    return {
      code,
      discountInr: discountNum,
      planMonths: form.planMonths,
      validFrom: form.validFrom || undefined,
      validUntil: form.validUntil || undefined,
      maxRedemptions: max,
      perUserLimit: Math.max(1, perUser),
      description: form.description.trim() || undefined,
    };
  }

  async function runAction(action: PendingAction, pass: string) {
    setBusy(true);
    if (action.kind === "update") setBusyId(action.id);
    try {
      if (action.kind === "create") {
        const { coupon } = await createAdminCoupon(adminKey, action.body, pass);
        setCoupons((prev) => [coupon, ...prev]);
        setForm(emptyForm());
        setFormOpen(false);
      } else {
        const { coupon } = await updateAdminCoupon(
          adminKey,
          action.id,
          action.body,
          pass,
        );
        setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? coupon : c)));
      }
      passRef.current = pass;
      setPassOpen(false);
      setPending(null);
      setPassError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      if (/admin password/i.test(msg)) {
        passRef.current = null;
        setPending(action);
        setPassError(msg);
        setPassOpen(true);
      } else if (passOpen) {
        setPassError(msg);
      } else if (action.kind === "create") {
        setFormError(msg);
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
      setBusyId(null);
    }
  }

  function requestAction(action: PendingAction) {
    if (passRef.current) {
      void runAction(action, passRef.current);
      return;
    }
    setPending(action);
    setPassError(null);
    setPassOpen(true);
  }

  async function openUsage(id: string) {
    if (usageFor === id) {
      setUsageFor(null);
      return;
    }
    setUsageFor(id);
    setUsage([]);
    setUsageFilter("all");
    setUsageError(null);
    setUsageLoading(true);
    try {
      const data = await fetchAdminCouponUsage(adminKey, id);
      setUsage(data.events);
    } catch (e) {
      setUsageError(e instanceof Error ? e.message : "Failed to load usage");
    } finally {
      setUsageLoading(false);
    }
  }

  const filteredUsage =
    usageFilter === "all" ? usage : usage.filter((u) => u.event === usageFilter);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <AdminStatCard
          label="Coupons"
          value={coupons.length}
          sub={`${totals.live} live now`}
          icon={Ticket}
        />
        <AdminStatCard
          label="Code entries"
          value={totals.entries}
          sub="Times a code was tried"
          icon={Users}
        />
        <AdminStatCard
          label="Paid with coupon"
          value={totals.redemptions}
          accent="sage"
          sub="Completed payments"
        />
        <AdminStatCard
          label="Discount given"
          value={inr(totals.discount)}
          accent="coral"
          icon={IndianRupee}
        />
        <AdminStatCard
          label="Coupon revenue"
          value={inr(totals.revenue)}
          accent="premium"
          sub="Collected after discount"
        />
      </div>

      <AdminSection
        id="coupons"
        title="Coupon codes"
        description="Flat rupee discounts on Premium mentor checkout (INR payments). The coupon comes off the plan price shown in the payment popup."
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 text-xs"
              disabled={loading}
              onClick={() => void load()}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setFormOpen((v) => !v);
                setFormError(null);
              }}
            >
              {formOpen ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {formOpen ? "Close" : "New coupon"}
            </Button>
          </div>
        }
      >
        {formOpen ? (
          <form
            className="mb-5 rounded-xl border border-hairline bg-cream/50 p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const body = validateForm();
              if (body) requestAction({ kind: "create", body });
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Code
                </span>
                <input
                  value={form.code}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
                    }))
                  }
                  maxLength={24}
                  placeholder="OFF20"
                  className="mt-1 h-10 w-full rounded-lg border border-hairline bg-white px-3 font-mono text-sm font-semibold tracking-wide text-ink outline-none focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Rupees off (flat)
                </span>
                <div className="relative mt-1">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">
                    ₹
                  </span>
                  <input
                    inputMode="numeric"
                    value={form.discountInr}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        discountInr: e.target.value.replace(/\D/g, "").slice(0, 6),
                      }))
                    }
                    placeholder="20"
                    className="h-10 w-full rounded-lg border border-hairline bg-white pl-7 pr-3 text-sm font-semibold tabular-nums text-ink outline-none focus:border-ink"
                  />
                </div>
              </label>

              <div className="md:col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Valid on plans
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {PLAN_MONTHS.map((m) => {
                    const on = form.planMonths.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            planMonths: on
                              ? f.planMonths.filter((x) => x !== m)
                              : [...f.planMonths, m].sort(),
                          }))
                        }
                        className={cn(
                          "rounded-lg border px-3 py-2 text-left text-xs font-semibold transition",
                          on
                            ? "border-ink bg-ink text-white"
                            : "border-hairline bg-white text-ink hover:border-ink/30",
                        )}
                      >
                        {m} months
                        <span className={cn("ml-1.5 font-normal", on ? "text-white/70" : "text-muted")}>
                          {inr(planPrices[m] ?? 0)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Starts (IST)
                </span>
                <input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => setForm((f) => ({ ...f, validFrom: e.target.value }))}
                  className="mt-1 h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Ends (IST, end of day)
                </span>
                <input
                  type="date"
                  value={form.validUntil}
                  min={form.validFrom || undefined}
                  onChange={(e) => setForm((f) => ({ ...f, validUntil: e.target.value }))}
                  className="mt-1 h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none focus:border-ink"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Total uses (blank = unlimited)
                </span>
                <input
                  inputMode="numeric"
                  value={form.maxRedemptions}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      maxRedemptions: e.target.value.replace(/\D/g, "").slice(0, 7),
                    }))
                  }
                  placeholder="Unlimited"
                  className="mt-1 h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm tabular-nums text-ink outline-none focus:border-ink"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Uses per mentor
                </span>
                <input
                  inputMode="numeric"
                  value={form.perUserLimit}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      perUserLimit: e.target.value.replace(/\D/g, "").slice(0, 3),
                    }))
                  }
                  className="mt-1 h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm tabular-nums text-ink outline-none focus:border-ink"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-wide text-muted">
                  Internal note (optional)
                </span>
                <input
                  value={form.description}
                  maxLength={200}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. WhatsApp campaign, Oct 2026"
                  className="mt-1 h-10 w-full rounded-lg border border-hairline bg-white px-3 text-sm text-ink outline-none focus:border-ink"
                />
              </label>
            </div>

            <div className="mt-4 rounded-lg border border-dashed border-hairline bg-white px-3.5 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
                What the mentor pays
              </p>
              {discountNum > 0 && selectedPlanPrices.length > 0 ? (
                <ul className="mt-1.5 space-y-1 text-sm tabular-nums">
                  {selectedPlanPrices.map((p) => {
                    const final = Math.max(1, p.pay - discountNum);
                    const invalid = discountNum >= p.pay;
                    return (
                      <li key={p.months} className={cn("text-ink", invalid && "text-coral-dark")}>
                        {p.months} months: {inr(p.pay)} − {inr(discountNum)} ={" "}
                        <strong>{inr(final)}</strong>
                        {invalid ? " (discount too large)" : ""}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted">
                  Enter a code, rupees off and at least one plan to preview.
                </p>
              )}
            </div>

            {formError ? (
              <p className="mt-3 rounded-md border border-coral/30 bg-coral-wash px-3 py-2 text-xs font-medium text-coral-dark">
                {formError}
              </p>
            ) : null}

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-9"
                disabled={busy}
                onClick={() => {
                  setForm(emptyForm());
                  setFormError(null);
                }}
              >
                Reset
              </Button>
              <Button type="submit" size="sm" className="h-9" disabled={busy}>
                {busy && pending?.kind !== "update" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                Create coupon
              </Button>
            </div>
          </form>
        ) : null}

        {error ? (
          <p className="mb-3 rounded-md border border-coral/30 bg-coral-wash px-3 py-2 text-xs font-medium text-coral-dark">
            {error}
          </p>
        ) : null}

        {loading && coupons.length === 0 ? (
          <p className="text-sm text-muted">
            <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
            Loading coupons…
          </p>
        ) : coupons.length === 0 ? (
          <p className="rounded-xl border border-dashed border-hairline bg-cream/50 px-4 py-10 text-center text-sm text-muted">
            No coupons yet. Create one with “New coupon”.
          </p>
        ) : (
          <ul className="space-y-3">
            {coupons.map((c) => {
              const open = usageFor === c.id;
              const rowBusy = busyId === c.id;
              return (
                <li
                  key={c.id}
                  className="overflow-hidden rounded-xl border border-hairline bg-white"
                >
                  <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-ink px-2 py-1 font-mono text-sm font-bold tracking-wide text-white">
                          {c.code}
                        </span>
                        <span className="text-sm font-bold text-ink">
                          {inr(c.discountInr)} off
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                            STATUS_STYLES[c.status],
                          )}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-muted">
                        {c.planMonths.map((m) => `${m}-month`).join(", ")} plan
                        {c.planMonths.length > 1 ? "s" : ""} · {formatDay(c.validFrom)} →{" "}
                        {formatDay(c.validUntil)} ·{" "}
                        {c.maxRedemptions != null
                          ? `${c.stats.redemptions}/${c.maxRedemptions} uses`
                          : "Unlimited uses"}{" "}
                        · {c.perUserLimit}× per mentor
                      </p>
                      {c.description ? (
                        <p className="mt-0.5 text-xs text-ink/70">{c.description}</p>
                      ) : null}
                    </div>

                    <dl className="grid grid-cols-4 gap-3 text-center lg:w-[340px]">
                      {[
                        ["Entries", c.stats.entries],
                        ["Users", c.stats.uniqueUsers],
                        ["Paid", c.stats.redemptions],
                        ["Given", inr(c.stats.discountGivenInr)],
                      ].map(([label, value]) => (
                        <div key={label as string}>
                          <dt className="text-[10px] font-bold uppercase tracking-wide text-muted">
                            {label}
                          </dt>
                          <dd className="mt-0.5 text-sm font-bold tabular-nums text-ink">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="flex items-center gap-2 lg:justify-end">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={c.active}
                        aria-label={c.active ? `Deactivate ${c.code}` : `Activate ${c.code}`}
                        disabled={rowBusy}
                        onClick={() =>
                          requestAction({
                            kind: "update",
                            id: c.id,
                            body: { active: !c.active },
                          })
                        }
                        className={cn(
                          "inline-flex h-8 items-center gap-2 rounded-lg border px-2.5 text-xs font-semibold transition disabled:opacity-60",
                          c.active
                            ? "border-sage/40 bg-sage/10 text-sage"
                            : "border-hairline bg-cream text-muted",
                        )}
                      >
                        <span
                          className={cn(
                            "relative h-4 w-7 rounded-full transition",
                            c.active ? "bg-sage" : "bg-ink/20",
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 size-3 rounded-full bg-white transition-all",
                              c.active ? "left-3.5" : "left-0.5",
                            )}
                          />
                        </span>
                        {rowBusy ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : c.active ? (
                          "Active"
                        ) : (
                          "Inactive"
                        )}
                      </button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs"
                        onClick={() => void openUsage(c.id)}
                        aria-expanded={open}
                      >
                        Who used it
                        <ChevronDown
                          className={cn("h-3.5 w-3.5 transition", open && "rotate-180")}
                        />
                      </Button>
                    </div>
                  </div>

                  {open ? (
                    <div className="border-t border-hairline bg-cream/40 p-4">
                      <div className="mb-3 flex flex-wrap items-center gap-1.5">
                        {(["all", "applied", "redeemed", "rejected"] as const).map((f) => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setUsageFilter(f)}
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
                              usageFilter === f
                                ? "bg-ink text-white"
                                : "bg-white text-muted hover:text-ink",
                            )}
                          >
                            {f === "all" ? "All" : EVENT_LABELS[f]}
                            <span className="ml-1 tabular-nums opacity-70">
                              {f === "all"
                                ? usage.length
                                : usage.filter((u) => u.event === f).length}
                            </span>
                          </button>
                        ))}
                      </div>

                      {usageLoading ? (
                        <p className="text-sm text-muted">
                          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                          Loading usage…
                        </p>
                      ) : usageError ? (
                        <p className="text-sm text-coral-dark">{usageError}</p>
                      ) : filteredUsage.length === 0 ? (
                        <p className="text-sm text-muted">Nobody has entered this code yet.</p>
                      ) : (
                        <div className="max-h-[420px] overflow-auto rounded-lg border border-hairline bg-white">
                          <table className="w-full min-w-[640px] text-left text-xs">
                            <thead className="sticky top-0 bg-white text-[10px] uppercase tracking-wide text-muted">
                              <tr className="border-b border-hairline">
                                <th className="px-3 py-2 font-bold">When</th>
                                <th className="px-3 py-2 font-bold">Mentor</th>
                                <th className="px-3 py-2 font-bold">Result</th>
                                <th className="px-3 py-2 font-bold">Plan</th>
                                <th className="px-3 py-2 text-right font-bold">Price</th>
                                <th className="px-3 py-2 text-right font-bold">Off</th>
                                <th className="px-3 py-2 text-right font-bold">Paid</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-hairline">
                              {filteredUsage.map((u) => (
                                <tr key={u.id} className="align-top">
                                  <td className="whitespace-nowrap px-3 py-2 text-muted">
                                    {formatDateTime(u.createdAt)}
                                  </td>
                                  <td className="px-3 py-2">
                                    <p className="font-semibold text-ink">{u.name || "—"}</p>
                                    <p className="text-muted">{u.email}</p>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span
                                      className={cn(
                                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                        EVENT_STYLES[u.event],
                                      )}
                                    >
                                      {EVENT_LABELS[u.event]}
                                    </span>
                                    {u.reason ? (
                                      <p className="mt-1 text-[11px] text-coral-dark">{u.reason}</p>
                                    ) : null}
                                    {u.paymentId ? (
                                      <p className="mt-1 font-mono text-[10px] text-muted">
                                        {u.paymentId}
                                      </p>
                                    ) : null}
                                  </td>
                                  <td className="px-3 py-2 text-ink">
                                    {u.months ? `${u.months} mo` : "—"}
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums text-ink">
                                    {u.planPayInr != null ? inr(u.planPayInr) : "—"}
                                  </td>
                                  <td className="px-3 py-2 text-right tabular-nums text-sage">
                                    {u.discountInr != null ? `−${inr(u.discountInr)}` : "—"}
                                  </td>
                                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-ink">
                                    {u.event === "redeemed" && u.finalInr != null
                                      ? inr(u.finalInr)
                                      : "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </AdminSection>

      <AdminPassDialog
        open={passOpen}
        title={pending?.kind === "create" ? "Create coupon" : "Update coupon"}
        description="Confirm with the admin password. It's remembered until you reload this page."
        confirmLabel={pending?.kind === "create" ? "Create" : "Save"}
        busy={busy}
        error={passError}
        onConfirm={(pass) => {
          if (pending) void runAction(pending, pass);
        }}
        onClose={() => {
          if (busy) return;
          setPassOpen(false);
          setPending(null);
        }}
      />
    </div>
  );
}
