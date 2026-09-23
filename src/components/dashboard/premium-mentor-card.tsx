"use client";

import { PremiumCheckoutDialog } from "@/components/dashboard/premium-checkout-dialog";
import { PremiumHistorySidebar } from "@/components/dashboard/premium-history-sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import {
  premiumMentorApi,
  type PremiumMentorState,
  type PremiumPaymentRow,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  History,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

function formatDay(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isActiveFromUser(expiresAt?: string, type?: string) {
  if (expiresAt) {
    return (
      type === "premium" && new Date(expiresAt).getTime() > Date.now()
    );
  }
  return false;
}

export function PremiumMentorCard({
  className,
  variant = "banner",
}: {
  className?: string;
  /** `stat` = KPI-sized tile in the dashboard stats row */
  variant?: "banner" | "stat";
}) {
  const { user, setUser } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [premium, setPremium] = useState<PremiumMentorState | null>(null);

  const reload = useCallback(async () => {
    if (!user || user.role !== "faculty") return;
    setLoading(true);
    try {
      const res = await premiumMentorApi.me();
      setUser(res.user);
      setPremium(res.premium);
    } catch {
      /* keep local user state */
    } finally {
      setLoading(false);
    }
  }, [user, setUser]);

  useEffect(() => {
    if (!user || user.role !== "faculty") return;
    void reload();
    try {
      const raw = sessionStorage.getItem("mentr_premium_pending_payment");
      if (!raw) return;
      const payload = JSON.parse(raw) as {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      };
      if (!payload.razorpay_order_id || !payload.razorpay_payment_id) return;
      void premiumMentorApi.verify(payload).then((res) => {
        setUser(res.user);
        setPremium(res.premium);
        sessionStorage.removeItem("mentr_premium_pending_payment");
      });
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per mentor session
  }, [user?.id]);

  const active = useMemo(() => {
    if (premium) return premium.premiumActive;
    return isActiveFromUser(
      user?.mentrPremium?.expiresAt,
      user?.mentrPremium?.type,
    );
  }, [premium, user]);

  const expired = useMemo(() => {
    if (active) return false;
    const exp =
      premium?.expiresAt || user?.mentrPremium?.expiresAt || null;
    return Boolean(
      exp ||
        user?.mentrPremium?.type === "premium" ||
        (premium?.payments && premium.payments.length > 0),
    );
  }, [active, premium, user]);

  const payments: PremiumPaymentRow[] = premium?.payments || [];
  const expiresAt =
    premium?.expiresAt || user?.mentrPremium?.expiresAt || null;
  const purchasedOn =
    premium?.lastPurchasedAt ||
    user?.mentrPremium?.lastPurchasedAt ||
    user?.premiumMentorVerifiedAt ||
    null;
  const firstOn =
    premium?.firstRechargedAt || user?.mentrPremium?.firstRechargedAt || null;
  const canPurchase = premium ? premium.canPurchase : !active;

  if (!user || user.role !== "faculty") return null;

  const dialogs = (
    <>
      <PremiumCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSuccess={(p) => {
          setPremium(p);
          void reload();
        }}
      />
      <PremiumHistorySidebar
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        payments={payments}
        mentorName={user.profile?.name || "Mentor"}
        mentorEmail={user.email}
      />
    </>
  );

  /* ── Compact KPI tile (stats row) ── */
  if (variant === "stat") {
    if (active) {
      return (
        <>
          <div
            className={cn(
              "flex h-full min-h-0 flex-col rounded-xl border border-sage/35 bg-gradient-to-br from-sage-wash via-white to-butter/50 p-4 shadow-[0_1px_3px_rgba(28,26,23,0.05)] sm:p-5",
              className,
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-medium text-muted">Premium</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage text-white">
                <Crown className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-lg font-bold leading-tight text-ink">
              Active
            </p>
            <p className="mt-1 text-xs text-muted">
              Until {formatDay(expiresAt)}
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5 border-t border-hairline pt-2.5">
              <Link href="/parentslist">
                <Button
                  type="button"
                  size="sm"
                  className="h-8 bg-sage px-2 text-xs hover:bg-sage/90"
                >
                  Parents
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => setHistoryOpen(true)}
              >
                <History className="h-3 w-3" />
                Bills
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!canPurchase}
                className="h-8 border border-ink/15 bg-white px-2 text-xs text-ink hover:bg-cream disabled:opacity-50"
                onClick={() => setCheckoutOpen(true)}
              >
                <RefreshCw className="h-3 w-3" />
                Renew
              </Button>
            </div>
          </div>
          {dialogs}
        </>
      );
    }

    return (
      <>
        <div
          className={cn(
            "relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-ink/15 bg-ink p-4 text-white shadow-[0_1px_3px_rgba(28,26,23,0.08)] transition hover:border-ink/25 hover:shadow-[0_4px_14px_rgba(28,26,23,0.12)] sm:p-5",
            className,
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sage/35 blur-2xl"
          />
          <div className="relative flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-butter">
              {expired ? "Expired" : "Grow faster"}
            </p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-butter text-ink">
              <RefreshCw className="h-4 w-4" />
            </span>
          </div>
          <p className="relative mt-3 text-[15px] font-bold leading-snug text-white">
            {expired
              ? "Premium ended — renew to continue"
              : "Unlock Premium Mentor — from $5/mo"}
          </p>
          <p className="relative mt-1.5 text-[11px] leading-relaxed text-white/60">
            {expired && expiresAt
              ? `Ended ${formatDay(expiresAt)}`
              : "Unlimited pitches · parent unlocks · SPOC · featured listing"}
          </p>
          <div className="relative mt-auto flex flex-wrap gap-1.5 border-t border-white/10 pt-2.5">
            {payments.length > 0 ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 border-white/20 bg-white/10 px-2 text-xs text-white hover:bg-white/15"
                onClick={() => setHistoryOpen(true)}
              >
                <History className="h-3 w-3" />
                History
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              disabled={loading}
              className="h-8 bg-butter px-2.5 text-xs text-ink hover:bg-butter-deep"
              onClick={() => setCheckoutOpen(true)}
            >
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : expired ? (
                <>
                  Renew
                  <RefreshCw className="h-3 w-3" />
                </>
              ) : (
                <>
                  Get Premium
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </Button>
          </div>
        </div>
        {dialogs}
      </>
    );
  }

  /* ── Full-width banner (legacy / other surfaces) ── */
  if (active) {
    return (
      <>
        <section
          className={cn(
            "overflow-hidden rounded-2xl border border-sage/30 bg-gradient-to-r from-sage-wash via-white to-butter/40",
            className,
          )}
        >
          <div className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage text-white shadow-sm">
              <Crown className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-ink">Premium Mentor</p>
                <span className="inline-flex items-center gap-1 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage shadow-sm">
                  <BadgeCheck className="h-3 w-3" />
                  Active
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                Purchased on {formatDay(purchasedOn)}
                {firstOn && firstOn !== purchasedOn
                  ? ` · First joined ${formatDay(firstOn)}`
                  : ""}
              </p>
              <p className="text-xs font-medium text-ink">
                Renews / expires on {formatDay(expiresAt)}
              </p>
            </div>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setHistoryOpen(true)}
              >
                <History className="h-3.5 w-3.5" />
                History
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!canPurchase}
                title={
                  canPurchase
                    ? "Renew Premium"
                    : "Renew unlocks after your plan expires"
                }
                onClick={() => setCheckoutOpen(true)}
                className="bg-sage hover:bg-sage/90 disabled:opacity-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Renew
              </Button>
              <Link href="/mentrpricing">
                <Button variant="ghost" size="sm">
                  Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
        {dialogs}
      </>
    );
  }

  return (
    <>
      <section
        className={cn(
          "relative overflow-hidden rounded-2xl border border-ink/10 bg-ink text-white shadow-md shadow-ink/10",
          "transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink/15",
          className,
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-sage/30 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-coral/25 blur-2xl"
        />

        <div className="relative flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-butter text-ink shadow-sm">
            <RefreshCw className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-butter">
              {expired ? "Expired" : "Grow faster"}
            </p>
            <p className="mt-0.5 text-sm font-bold text-white sm:text-[15px]">
              {expired
                ? "Premium ended — renew to continue"
                : "Unlock Premium Mentor — from $5/mo"}
            </p>
            <p className="mt-0.5 text-xs text-white/60">
              {expired && expiresAt
                ? `Ended ${formatDay(expiresAt)}`
                : "Unlimited pitches · parent unlocks · SPOC · featured listing"}
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            {payments.length > 0 ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                onClick={() => setHistoryOpen(true)}
              >
                <History className="h-3.5 w-3.5" />
                History
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              disabled={loading}
              className="bg-butter text-ink hover:bg-butter-deep"
              onClick={() => setCheckoutOpen(true)}
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : expired ? (
                <>
                  Renew
                  <RefreshCw className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Get Premium
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>
      {dialogs}
    </>
  );
}
