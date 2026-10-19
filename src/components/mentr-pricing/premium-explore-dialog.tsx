"use client";

import { PremiumCheckoutDialog } from "@/components/dashboard/premium-checkout-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/auth/auth-provider";
import { premiumMentorApi, type AuthUser, type PremiumMentorState } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Loader2,
  LogIn,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatDay(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function mentorPremiumActive(
  user: AuthUser | null,
  premium: PremiumMentorState | null,
) {
  if (premium) return premium.premiumActive;
  const exp = user?.mentrPremium?.expiresAt;
  return Boolean(
    exp &&
      user?.mentrPremium?.type === "premium" &&
      new Date(exp).getTime() > Date.now(),
  );
}

type GateKind = "auth_loading" | "guest" | "parent" | "other" | "mentor";

/**
 * Role-aware gate before Razorpay checkout from /mentrpricing Explore.
 */
export function PremiumExploreDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user, loading: authLoading, openRoleChooser } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [premium, setPremium] = useState<PremiumMentorState | null>(null);
  const [premiumRefreshing, setPremiumRefreshing] = useState(false);
  const [premiumFetchFailed, setPremiumFetchFailed] = useState(false);

  useEffect(() => {
    if (!open) {
      setPremium(null);
      setPremiumRefreshing(false);
      setPremiumFetchFailed(false);
      return;
    }
    if (authLoading || !user || user.role !== "faculty") return;

    let cancelled = false;
    setPremiumRefreshing(true);
    setPremiumFetchFailed(false);

    void premiumMentorApi
      .me()
      .then((res) => {
        if (cancelled) return;
        setPremium(res.premium);
      })
      .catch(() => {
        if (cancelled) return;
        setPremiumFetchFailed(true);
      })
      .finally(() => {
        if (!cancelled) setPremiumRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, authLoading, user?.id, user?.role]);

  const gateKind: GateKind = useMemo(() => {
    if (authLoading) return "auth_loading";
    if (!user) return "guest";
    if (user.role === "parent") return "parent";
    if (user.role !== "faculty") return "other";
    return "mentor";
  }, [authLoading, user]);

  const mentorActive = mentorPremiumActive(user, premium);

  const expiresAt =
    premium?.expiresAt || user?.mentrPremium?.expiresAt || null;
  const purchasedOn =
    premium?.lastPurchasedAt ||
    user?.mentrPremium?.lastPurchasedAt ||
    user?.premiumMentorVerifiedAt ||
    null;
  const canPurchase = premium
    ? premium.canPurchase
    : !mentorPremiumActive(user, premium);

  function startCheckout() {
    onOpenChange(false);
    window.setTimeout(() => setCheckoutOpen(true), 150);
  }

  function renderBody() {
    switch (gateKind) {
      case "auth_loading":
        return (
          <div className="flex flex-col items-center gap-3 px-6 py-14 pr-12">
            <Loader2 className="h-8 w-8 animate-spin text-sage" />
            <p className="text-sm text-muted">Checking your account…</p>
          </div>
        );

      case "guest":
        return (
          <>
            <div className="border-b-2 border-ink bg-cream-band px-6 pb-5 pt-6 pr-12">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-white">
                <LogIn className="h-5 w-5 text-coral" />
              </div>
              <DialogHeader className="mt-4 space-y-2 text-left">
                <DialogTitle className="text-xl font-bold text-ink">
                  Log in to explore Premium
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-muted">
                  Mentr Premium is for{" "}
                  <span className="font-semibold text-ink">mentor accounts</span>
                  . Sign in as a tutor to pick a plan and pay with Razorpay.
                  Parents can find and book mentors for free — no Premium
                  needed on your side.
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="flex flex-col gap-2 px-6 py-5">
              <Button
                type="button"
                size="lg"
                className="h-11 w-full"
                onClick={() => {
                  onOpenChange(false);
                  openRoleChooser("/mentrpricing");
                }}
              >
                Log in or sign up
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-11 w-full border-hairline"
                onClick={() => onOpenChange(false)}
              >
                Not now
              </Button>
            </div>
          </>
        );

      case "parent":
        return (
          <>
            <div className="border-b-2 border-ink bg-gradient-to-br from-sage-wash via-white to-butter/40 px-6 pb-5 pt-6 pr-12">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-white">
                <Users className="h-5 w-5" />
              </div>
              <DialogHeader className="mt-4 space-y-2 text-left">
                <DialogTitle className="text-xl font-bold text-ink">
                  Premium is for mentors
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-muted">
                  You&apos;re signed in as a{" "}
                  <span className="font-semibold text-ink">parent</span>.
                  This upgrade unlocks mentor tools — unlimited pitches,
                  parent contact unlocks, a dedicated SPOC, and featured
                  listing. You never need Premium to search, shortlist, or
                  book a demo with a tutor.
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="flex flex-col gap-2 px-6 py-5">
              <Link href="/parent/dashboard" onClick={() => onOpenChange(false)}>
                <Button type="button" size="lg" className="h-11 w-full">
                  Go to parent dashboard
                </Button>
              </Link>
              <Link href="/premiummentors" onClick={() => onOpenChange(false)}>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-11 w-full border-hairline"
                >
                  Browse Premium mentors
                </Button>
              </Link>
            </div>
          </>
        );

      case "other":
        return (
          <div className="px-6 py-8 pr-12">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-xl font-bold text-ink">
                Mentor account required
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted">
                Premium checkout is only available on a verified mentor
                profile. Open your mentor dashboard or sign in with your
                tutor account to continue.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex flex-col gap-2">
              <Link href="/dashboard" onClick={() => onOpenChange(false)}>
                <Button type="button" className="w-full">
                  Open dashboard
                </Button>
              </Link>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        );

      case "mentor":
        if (mentorActive) {
          return (
            <>
              <div className="relative border-b-2 border-ink bg-gradient-to-br from-sage via-sage/90 to-[#2a7a58] px-6 pb-5 pt-6 pr-12 text-white">
                {premiumRefreshing ? (
                  <Loader2
                    className="absolute right-12 top-6 h-4 w-4 animate-spin text-white/70"
                    aria-label="Refreshing status"
                  />
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                    <Crown className="h-5 w-5 text-butter" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Active
                  </span>
                </div>
                <DialogHeader className="mt-4 space-y-2 text-left">
                  <DialogTitle className="text-xl font-bold text-white">
                    You&apos;re already Premium
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-relaxed text-white/75">
                    Unlimited pitches, parent unlocks, SPOC support, and featured
                    placement are on until your current period ends.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <div className="space-y-4 px-6 py-5">
                <dl className="grid gap-3 rounded-xl border border-hairline bg-cream-band/80 p-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Renews / expires</dt>
                    <dd className="font-semibold text-ink">
                      {formatDay(expiresAt)}
                    </dd>
                  </div>
                  {purchasedOn ? (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted">Last purchase</dt>
                      <dd className="font-semibold text-ink">
                        {formatDay(purchasedOn)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
                {canPurchase ? (
                  <Button
                    type="button"
                    size="lg"
                    className="h-11 w-full bg-sage hover:bg-sage/90"
                    onClick={startCheckout}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Renew Premium
                  </Button>
                ) : (
                  <p className="rounded-xl border border-hairline bg-white px-4 py-3 text-sm leading-relaxed text-muted">
                    Renew unlocks when your plan ends on{" "}
                    <span className="font-semibold text-ink">
                      {formatDay(expiresAt)}
                    </span>
                    . You can also renew from your mentor dashboard anytime
                    after that date.
                  </p>
                )}
                <Link href="/dashboard" onClick={() => onOpenChange(false)}>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-11 w-full border-hairline"
                  >
                    Mentor dashboard
                  </Button>
                </Link>
              </div>
            </>
          );
        }

        return (
          <>
            <div className="relative border-b-2 border-ink bg-ink px-6 pb-5 pt-6 pr-12 text-white">
              {premiumRefreshing ? (
                <Loader2
                  className="absolute right-12 top-6 h-4 w-4 animate-spin text-white/50"
                  aria-label="Refreshing status"
                />
              ) : null}
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-butter" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-butter">
                  Most chosen
                </span>
              </div>
              <DialogHeader className="mt-3 space-y-2 text-left">
                <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
                  <Crown className="h-5 w-5 text-butter" />
                  Premium for mentors
                </DialogTitle>
                <DialogDescription className="text-sm text-white/65">
                  $5 / month · ≈ ₹449 · price as shown · no GST on top
                </DialogDescription>
              </DialogHeader>
            </div>
            <div className="space-y-4 px-6 py-5">
              {premiumFetchFailed ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                  Couldn&apos;t refresh billing details — you can still
                  checkout. Dates update after payment.
                </p>
              ) : null}
              <ul className="space-y-2.5 text-sm text-ink">
                {[
                  "Unlimited pitches every day",
                  "3 parent contact unlocks / day (directory + board)",
                  "Featured on the Mentr landing page & Premium badge",
                ].map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              {expiresAt && !mentorActive ? (
                <p className="text-xs text-muted">
                  Your last Premium period ended on{" "}
                  <span className="font-semibold text-ink">
                    {formatDay(expiresAt)}
                  </span>
                  . Pick 2–4 months below to renew.
                </p>
              ) : null}
              <Button
                type="button"
                size="lg"
                className={cn(
                  "h-12 w-full bg-butter text-ink hover:bg-butter-deep",
                )}
                onClick={startCheckout}
              >
                Choose duration & pay
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-[11px] leading-snug text-muted">
                Secure Razorpay checkout · Premium activates after payment
                verification
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton
          className="max-h-[min(92vh,720px)] overflow-y-auto border-2 border-ink p-0 sm:max-w-md"
        >
          {renderBody()}
        </DialogContent>
      </Dialog>

      <PremiumCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSuccess={(p) => {
          setPremium(p);
        }}
      />
    </>
  );
}
