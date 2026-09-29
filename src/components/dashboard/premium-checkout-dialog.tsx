"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/components/auth/auth-provider";
import {
  ApiError,
  premiumMentorApi,
  type PremiumBillingContext,
  type PremiumCouponQuote,
  type PremiumCurrency,
  type PremiumPlanOption,
  type PremiumMentorState,
} from "@/lib/api";
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics";
import { LEGAL_DOCS_VERSION } from "@/lib/legal";
import { cn } from "@/lib/utils";
import { Check, Loader2, Tag, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (resp: unknown) => void) => void;
    };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function formatInr(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatLocal(n: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: n >= 100 ? 0 : 2,
    }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (premium: PremiumMentorState) => void;
};

export function PremiumCheckoutDialog({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { user, setUser } = useAuth();
  const [plans, setPlans] = useState<PremiumPlanOption[]>([]);
  const [usdPerMonth, setUsdPerMonth] = useState(5);
  const [usdToInr, setUsdToInr] = useState(89.8);
  const [paymentsEnabled, setPaymentsEnabled] = useState(true);
  const [billing, setBilling] = useState<PremiumBillingContext | null>(null);
  const [currency, setCurrency] = useState<PremiumCurrency>("INR");
  const [months, setMonths] = useState<2 | 3 | 4>(2);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedLegal, setAcceptedLegal] = useState(true);
  const [couponOpen, setCouponOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<PremiumCouponQuote | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const appliedCodeRef = useRef<string | null>(null);
  const couponReqRef = useRef(0);

  const loadCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    setError(null);
    try {
      const cat = await premiumMentorApi.catalog();
      setPlans(cat.plans);
      setUsdPerMonth(cat.usdPerMonth);
      setUsdToInr(cat.usdToInr);
      setPaymentsEnabled(cat.paymentsEnabled);
      setBilling(cat.billing ?? null);
      setCurrency(cat.billing?.currency ?? "INR");
      const def = cat.plans.find((p) => p.isDefault) || cat.plans[0];
      if (def) setMonths(def.months);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load plans");
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setAcceptedLegal(true);
    setCouponOpen(false);
    setCouponInput("");
    setCoupon(null);
    setCouponError(null);
    appliedCodeRef.current = null;
    void loadCatalog();
  }, [open, loadCatalog]);

  const applyCoupon = useCallback(
    async (rawCode: string) => {
      const code = rawCode.trim().toUpperCase().replace(/\s+/g, "");
      if (!code) {
        setCouponError("Enter a coupon code.");
        return;
      }
      const reqId = ++couponReqRef.current;
      setCouponBusy(true);
      setCouponError(null);
      try {
        const res = await premiumMentorApi.validateCoupon({
          code,
          months,
          currency,
        });
        if (reqId !== couponReqRef.current) return;
        setCoupon(res.coupon);
        setCouponInput(res.coupon.code);
        appliedCodeRef.current = res.coupon.code;
      } catch (e) {
        if (reqId !== couponReqRef.current) return;
        setCoupon(null);
        appliedCodeRef.current = null;
        setCouponOpen(true);
        setCouponInput(code);
        setCouponError(
          e instanceof ApiError || e instanceof Error
            ? e.message
            : "Could not check this coupon.",
        );
      } finally {
        if (reqId === couponReqRef.current) setCouponBusy(false);
      }
    },
    [months, currency],
  );

  // Plan / currency switch changes the price, so re-check an applied code.
  useEffect(() => {
    if (!open || !appliedCodeRef.current) return;
    void applyCoupon(appliedCodeRef.current);
  }, [open, months, currency, applyCoupon]);

  function removeCoupon() {
    couponReqRef.current++;
    appliedCodeRef.current = null;
    setCoupon(null);
    setCouponInput("");
    setCouponError(null);
    setCouponBusy(false);
  }

  /** Per-popup session: order started → Razorpay cancel handles "dismissed"; paid → no dismiss. */
  const checkoutSession = useRef({ tracked: false, orderStarted: false, paid: false });
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    if (!open) {
      checkoutSession.current = { tracked: false, orderStarted: false, paid: false };
      return;
    }
    if (!isLoggedIn || checkoutSession.current.tracked) return;
    checkoutSession.current.tracked = true;
    void premiumMentorApi
      .trackCheckout({ event: "opened", source: window.location.pathname })
      .catch(() => {});
  }, [open, isLoggedIn]);

  function handleOpenChange(next: boolean) {
    if (paying) return;
    const s = checkoutSession.current;
    if (!next && s.tracked && !s.orderStarted && !s.paid) {
      void premiumMentorApi
        .trackCheckout({
          event: "dismissed",
          months,
          currency,
          source: window.location.pathname,
        })
        .catch(() => {});
    }
    onOpenChange(next);
  }

  const selected = useMemo(
    () => plans.find((p) => p.months === months) || null,
    [plans, months],
  );

  const isUsd = currency === "USD";
  const canSwitchCurrency = (billing?.availableCurrencies.length ?? 0) > 1;
  const localEstimate = (usd: number) =>
    isUsd && billing?.local
      ? formatLocal(usd * billing.local.usdRate, billing.local.currency)
      : null;
  const activeCoupon =
    coupon && !isUsd && selected && coupon.months === selected.months
      ? coupon
      : null;
  const payLabel = selected
    ? isUsd
      ? formatUsd(selected.payUsd)
      : formatInr(activeCoupon ? activeCoupon.finalInr : selected.payInr)
    : "";

  async function proceedToPay() {
    if (!user || user.role !== "faculty") {
      setError("Sign in with your mentor account to pay.");
      return;
    }
    if (!selected) return;
    if (!paymentsEnabled) {
      setError("Payments are temporarily unavailable. Try again later.");
      return;
    }
    if (!acceptedLegal) {
      setError("Please confirm the Terms and Privacy policy to continue.");
      return;
    }

    setPaying(true);
    setError(null);
    let orderId: string | null = null;

    try {
      const order = await premiumMentorApi.createOrder(selected.months, {
        acceptedLegal: true,
        legalVersion: LEGAL_DOCS_VERSION,
        currency,
        source: window.location.pathname,
        couponCode: activeCoupon?.code ?? null,
      });
      orderId = order.orderId;
      checkoutSession.current.orderStarted = true;
      trackBeginCheckout({
        orderId: order.orderId,
        months: order.months,
        currency: order.currency,
        value:
          order.currency === "INR"
            ? order.amountInr
            : (order.amountMinor ?? 0) / 100,
      });

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        setError("Payment window could not load. Please try again.");
        setPaying(false);
        if (orderId) void premiumMentorApi.cancel(orderId);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amountMinor ?? order.amountPaise,
        currency: order.currency,
        name: "Mentr",
        description: `Premium Mentor — ${order.months} months`,
        order_id: order.orderId,
        prefill: {
          name: order.prefill.name,
          email: order.prefill.email,
          contact: order.prefill.contact,
        },
        notes: {
          purpose: "premium_mentor",
          receipt: order.receiptNumber,
        },
        theme: { color: "#1a231c" },
        modal: {
          ondismiss: () => {
            setPaying(false);
            if (orderId) void premiumMentorApi.cancel(orderId);
          },
        },
        handler: async (response: unknown) => {
          const r = response as {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          };
          const payload = {
            razorpay_order_id: r.razorpay_order_id,
            razorpay_payment_id: r.razorpay_payment_id,
            razorpay_signature: r.razorpay_signature,
          };
          try {
            sessionStorage.setItem(
              "mentr_premium_pending_payment",
              JSON.stringify(payload),
            );
          } catch {
            /* ignore */
          }

          const delays = [0, 800, 1600, 3200, 5000];
          let lastErr: unknown;
          for (let i = 0; i < delays.length; i++) {
            if (delays[i]! > 0) {
              await new Promise((resolve) => setTimeout(resolve, delays[i]));
            }
            try {
              const verified = await premiumMentorApi.verify(payload);
              try {
                sessionStorage.removeItem("mentr_premium_pending_payment");
              } catch {
                /* ignore */
              }
              setUser(verified.user);
              trackPurchase({
                transactionId:
                  verified.payment?.razorpayPaymentId ||
                  payload.razorpay_payment_id,
                months: verified.payment?.months ?? order.months,
                currency: verified.payment?.currency ?? order.currency,
                value:
                  verified.payment?.amountCharged ??
                  (order.currency === "INR"
                    ? order.amountInr
                    : (order.amountMinor ?? 0) / 100),
              });
              checkoutSession.current.paid = true;
              onSuccess?.(verified.premium);
              setPaying(false);
              onOpenChange(false);
              return;
            } catch (err) {
              lastErr = err;
              if (
                err instanceof ApiError &&
                (err.status === 401 ||
                  err.status === 403 ||
                  err.status === 400)
              ) {
                break;
              }
            }
          }
          setError(
            lastErr instanceof ApiError
              ? lastErr.message
              : "If money was deducted, refresh your dashboard — Premium may already be active.",
          );
          setPaying(false);
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment did not go through. You were not charged.");
        setPaying(false);
        if (orderId) void premiumMentorApi.cancel(orderId, "failed");
      });

      rzp.open();
    } catch (e) {
      setPaying(false);
      const code =
        e instanceof ApiError ? String(e.data?.code ?? "") : "";
      if (code.startsWith("COUPON_")) {
        couponReqRef.current++;
        appliedCodeRef.current = null;
        setCoupon(null);
        setCouponOpen(true);
        setCouponError(
          `${e instanceof Error ? e.message : "Coupon no longer valid."} Remove it or try another code.`,
        );
        return;
      }
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Could not start payment",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[min(92dvh,680px)] w-full gap-0 overflow-y-auto p-0 sm:max-w-[520px]"
        showCloseButton={!paying}
      >
        <div className="border-b border-hairline px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-6">
          <DialogHeader className="gap-1 text-left sm:gap-1.5">
            <DialogTitle className="text-lg font-bold tracking-tight text-ink sm:text-xl">
              Premium Mentor
            </DialogTitle>
            <DialogDescription className="text-[13px] leading-relaxed text-muted sm:text-[15px]">
              Pick how long you want Premium. Pay once
              {isUsd ? " in US dollars" : " in rupees"}. Activates right after
              payment.
            </DialogDescription>
          </DialogHeader>
        </div>

        {loadingCatalog ? (
          <div className="px-4 py-10 text-center text-sm text-muted sm:px-6 sm:py-12">
            Loading prices…
          </div>
        ) : (
          <div className="space-y-4 px-4 py-4 sm:space-y-5 sm:px-6 sm:py-5">
            {/* Step 1 */}
            <div>
              <p className="text-[13px] font-semibold text-ink">
                1. How many months?
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Longer plans cost less per month.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {plans.map((p) => {
                  const active = p.months === months;
                  return (
                    <button
                      key={p.months}
                      type="button"
                      disabled={paying}
                      onClick={() => setMonths(p.months)}
                      className={cn(
                        "rounded-lg border px-1.5 py-2.5 text-center transition sm:px-2 sm:py-3",
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-hairline bg-white text-ink hover:border-ink/30 hover:bg-cream",
                      )}
                    >
                      <span className="block text-base font-bold tabular-nums sm:text-lg">
                        {p.months}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-[11px]",
                          active ? "text-white/70" : "text-muted",
                        )}
                      >
                        months
                      </span>
                      {p.discountPercent > 0 ? (
                        <span
                          className={cn(
                            "mt-1.5 block text-[10px] font-semibold",
                            active ? "text-butter" : "text-sage",
                          )}
                        >
                          {p.discountPercent}% off
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "mt-1.5 block text-[10px]",
                            active ? "text-white/50" : "text-muted",
                          )}
                        >
                          Standard
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 — bill */}
            {selected ? (
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold text-ink">
                    2. What you pay
                  </p>
                  {canSwitchCurrency ? (
                    <div
                      role="radiogroup"
                      aria-label="Payment currency"
                      className="flex rounded-lg border border-hairline bg-white p-0.5"
                    >
                      {(["INR", "USD"] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          role="radio"
                          aria-checked={currency === c}
                          disabled={paying}
                          onClick={() => setCurrency(c)}
                          className={cn(
                            "rounded-md px-2.5 py-1 text-[11px] font-bold transition",
                            currency === c
                              ? "bg-ink text-white"
                              : "text-muted hover:text-ink",
                          )}
                        >
                          {c === "INR" ? "₹ INR" : "$ USD"}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="mt-3 rounded-lg border border-hairline bg-cream/60">
                  <div className="space-y-0 divide-y divide-hairline px-3.5 text-sm">
                    <div className="flex items-start justify-between gap-3 py-3">
                      <div>
                        <p className="font-medium text-ink">
                          ${usdPerMonth} × {selected.months} months
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {isUsd
                            ? "Charged in US dollars — price stays fixed"
                            : `Listed in USD, charged in INR (≈ ₹${usdToInr} per $1)`}
                        </p>
                      </div>
                      <p className="shrink-0 font-medium tabular-nums text-ink">
                        {isUsd
                          ? formatUsd(selected.listUsd)
                          : formatInr(selected.listInr)}
                      </p>
                    </div>

                    {isUsd && selected.discountUsd > 0 ? (
                      <div className="flex items-center justify-between gap-3 py-3">
                        <p className="text-ink">
                          Discount for {selected.months} months
                          <span className="text-muted">
                            {" "}
                            ({selected.discountPercent}%)
                          </span>
                        </p>
                        <p className="shrink-0 font-medium tabular-nums text-sage">
                          −{formatUsd(selected.discountUsd)}
                        </p>
                      </div>
                    ) : null}

                    {!isUsd && selected.discountInr > 0 ? (
                      <div className="flex items-center justify-between gap-3 py-3">
                        <p className="text-ink">
                          Discount for {selected.months} months
                          <span className="text-muted">
                            {" "}
                            ({selected.discountPercent}%)
                          </span>
                        </p>
                        <p className="shrink-0 font-medium tabular-nums text-sage">
                          −{formatInr(selected.discountInr)}
                        </p>
                      </div>
                    ) : null}

                    {activeCoupon ? (
                      <div className="flex items-center justify-between gap-3 py-3">
                        <p className="flex min-w-0 items-center gap-1.5 text-ink">
                          <Tag className="size-3.5 shrink-0 text-sage" aria-hidden />
                          Coupon
                          <span className="truncate rounded bg-sage/10 px-1.5 py-0.5 font-mono text-[11px] font-bold text-sage">
                            {activeCoupon.code}
                          </span>
                        </p>
                        <p className="shrink-0 font-medium tabular-nums text-sage">
                          −{formatInr(activeCoupon.discountInr)}
                        </p>
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between gap-3 py-3.5">
                      <div>
                        <p className="font-bold text-ink">Total due today</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {isUsd ? (
                            <>
                              {formatUsd(selected.perMonthUsd)}/month effective
                              {localEstimate(selected.payUsd)
                                ? ` · ≈ ${localEstimate(selected.payUsd)}`
                                : ""}
                            </>
                          ) : activeCoupon ? (
                            <>
                              You save{" "}
                              {formatInr(
                                selected.discountInr + activeCoupon.discountInr,
                              )}{" "}
                              ·{" "}
                              {formatInr(
                                Math.round(activeCoupon.finalInr / selected.months),
                              )}
                              /month effective
                            </>
                          ) : (
                            <>
                              About ${selected.payUsdApprox} ·{" "}
                              {formatInr(selected.perMonthInr)}/month effective
                            </>
                          )}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        {activeCoupon ? (
                          <p className="text-xs tabular-nums text-muted line-through">
                            {formatInr(selected.payInr)}
                          </p>
                        ) : null}
                        <p className="text-xl font-bold tabular-nums text-ink">
                          {payLabel}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-hairline px-3.5 py-3">
                    {isUsd ? (
                      <p className="flex items-center gap-1.5 text-xs text-muted">
                        <Tag className="size-3.5" aria-hidden />
                        Coupon codes work on rupee (₹ INR) payments.
                      </p>
                    ) : activeCoupon ? (
                      <div className="flex items-center justify-between gap-3">
                        <p className="flex min-w-0 items-center gap-1.5 text-[13px] font-medium text-sage">
                          <Check className="size-4 shrink-0" aria-hidden />
                          <span className="truncate">
                            {activeCoupon.code} applied · {formatInr(activeCoupon.discountInr)} off
                          </span>
                        </p>
                        <button
                          type="button"
                          disabled={paying}
                          onClick={removeCoupon}
                          className="shrink-0 text-xs font-semibold text-muted underline underline-offset-2 transition hover:text-coral disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    ) : !couponOpen ? (
                      <button
                        type="button"
                        disabled={paying}
                        onClick={() => setCouponOpen(true)}
                        className="flex w-full items-center justify-between gap-2 text-left text-[13px] font-semibold text-ink transition hover:text-sage disabled:opacity-50"
                      >
                        <span className="flex items-center gap-1.5">
                          <Tag className="size-4 text-sage" aria-hidden />
                          Have a coupon code?
                        </span>
                        <span className="text-xs font-bold text-sage">Apply</span>
                      </button>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          void applyCoupon(couponInput);
                        }}
                      >
                        <label
                          htmlFor="premium-coupon"
                          className="flex items-center gap-1.5 text-[13px] font-semibold text-ink"
                        >
                          <Tag className="size-4 text-sage" aria-hidden />
                          Coupon code
                        </label>
                        <div className="mt-2 flex gap-2">
                          <div className="relative min-w-0 flex-1">
                            <input
                              id="premium-coupon"
                              autoFocus
                              autoComplete="off"
                              autoCapitalize="characters"
                              spellCheck={false}
                              maxLength={24}
                              value={couponInput}
                              disabled={paying || couponBusy}
                              onChange={(e) => {
                                setCouponInput(
                                  e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
                                );
                                if (couponError) setCouponError(null);
                              }}
                              placeholder="e.g. OFF20"
                              aria-invalid={Boolean(couponError)}
                              aria-describedby={couponError ? "premium-coupon-error" : undefined}
                              className={cn(
                                "h-10 w-full rounded-lg border bg-white px-3 pr-8 font-mono text-sm font-semibold uppercase tracking-wide text-ink outline-none transition placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/70 focus:border-ink",
                                couponError ? "border-coral/60" : "border-hairline",
                              )}
                            />
                            {couponInput && !couponBusy ? (
                              <button
                                type="button"
                                aria-label="Clear coupon code"
                                onClick={() => {
                                  setCouponInput("");
                                  setCouponError(null);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted hover:text-ink"
                              >
                                <X className="size-3.5" />
                              </button>
                            ) : null}
                          </div>
                          <Button
                            type="submit"
                            variant="secondary"
                            disabled={paying || couponBusy || !couponInput.trim()}
                            className="h-10 shrink-0 px-4"
                          >
                            {couponBusy ? (
                              <Loader2 className="size-4 animate-spin" aria-label="Checking" />
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </div>
                        {couponError ? (
                          <p
                            id="premium-coupon-error"
                            role="alert"
                            className="mt-1.5 text-xs leading-snug text-coral"
                          >
                            {couponError}
                          </p>
                        ) : null}
                      </form>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {isUsd ? (
                    <>
                      No tax added on top. Your bank converts USD to your
                      currency — the local amount shown is an estimate. Paid
                      securely via Razorpay (international cards).
                    </>
                  ) : (
                    <>
                      No GST added on top of this amount. Paid securely via
                      Razorpay (UPI, cards, netbanking).
                    </>
                  )}
                </p>
              </div>
            ) : null}

            {/* Included */}
            <div>
              <p className="text-[13px] font-semibold text-ink">
                Included with Premium
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted">
                <li className="flex gap-2">
                  <span className="text-ink">·</span>
                  Unlimited pitches on the requirements board
                </li>
                <li className="flex gap-2">
                  <span className="text-ink">·</span>
                  5 parent contact unlocks every day
                </li>
                <li className="flex gap-2">
                  <span className="text-ink">·</span>
                  Dedicated support person (SPOC)
                </li>
                <li className="flex gap-2">
                  <span className="text-ink">·</span>
                  Featured placement on the Mentr homepage
                </li>
              </ul>
            </div>

            <label
              htmlFor="premium-checkout-legal"
              className="flex cursor-pointer items-start gap-2.5 text-left text-[12px] leading-snug text-muted"
            >
              <Checkbox
                id="premium-checkout-legal"
                checked={acceptedLegal}
                onCheckedChange={(v) => setAcceptedLegal(v === true)}
                disabled={paying}
                className="mt-0.5 border-[#c9c4bb] data-[state=checked]:border-ink data-[state=checked]:bg-ink"
                aria-required
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline underline-offset-2 hover:text-coral"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline underline-offset-2 hover:text-coral"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy policy
                </Link>
                . This plan covers access to the Premium features listed above
                for the months I select.
              </span>
            </label>

            {error ? (
              <p
                className="rounded-lg border border-coral/25 bg-coral-wash/40 px-3 py-2.5 text-sm leading-snug text-coral"
                role="alert"
              >
                {error}
              </p>
            ) : null}
          </div>
        )}

        <div className="sticky bottom-0 flex flex-col gap-2 border-t border-hairline bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            disabled={paying}
            onClick={() => handleOpenChange(false)}
            className="order-2 text-sm font-medium text-muted transition hover:text-ink disabled:opacity-50 sm:order-1"
          >
            Not now
          </button>
          <Button
            type="button"
            disabled={
              paying ||
              loadingCatalog ||
              !selected ||
              !paymentsEnabled ||
              !acceptedLegal
            }
            onClick={() => void proceedToPay()}
            className="order-1 h-11 w-full sm:order-2 sm:w-auto sm:min-w-[200px]"
          >
            {paying
              ? "Opening payment…"
              : selected
                ? `Pay ${payLabel}`
                : "Pay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
