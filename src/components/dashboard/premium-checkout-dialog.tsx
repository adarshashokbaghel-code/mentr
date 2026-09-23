"use client";

import { Button } from "@/components/ui/button";
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
  type PremiumPlanOption,
  type PremiumMentorState,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const [months, setMonths] = useState<2 | 3 | 4>(2);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCatalog = useCallback(async () => {
    setLoadingCatalog(true);
    setError(null);
    try {
      const cat = await premiumMentorApi.catalog();
      setPlans(cat.plans);
      setUsdPerMonth(cat.usdPerMonth);
      setUsdToInr(cat.usdToInr);
      setPaymentsEnabled(cat.paymentsEnabled);
      const def = cat.plans.find((p) => p.isDefault) || cat.plans[0];
      if (def) setMonths(def.months);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load plans");
    } finally {
      setLoadingCatalog(false);
    }
  }, []);

  useEffect(() => {
    if (open) void loadCatalog();
  }, [open, loadCatalog]);

  const selected = useMemo(
    () => plans.find((p) => p.months === months) || null,
    [plans, months],
  );

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

    setPaying(true);
    setError(null);
    let orderId: string | null = null;

    try {
      const order = await premiumMentorApi.createOrder(selected.months);
      orderId = order.orderId;

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) {
        setError("Payment window could not load. Please try again.");
        setPaying(false);
        if (orderId) void premiumMentorApi.cancel(orderId);
        return;
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
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
        if (orderId) void premiumMentorApi.cancel(orderId);
      });

      rzp.open();
    } catch (e) {
      setPaying(false);
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
    <Dialog open={open} onOpenChange={(v) => !paying && onOpenChange(v)}>
      <DialogContent
        className="max-h-[min(92vh,680px)] gap-0 overflow-y-auto p-0 sm:max-w-[520px]"
        showCloseButton={!paying}
      >
        <div className="border-b border-hairline px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
          <DialogHeader className="gap-1.5 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight text-ink">
              Premium Mentor
            </DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed text-muted">
              Pick how long you want Premium. Pay once in rupees. Activates
              right after payment.
            </DialogDescription>
          </DialogHeader>
        </div>

        {loadingCatalog ? (
          <div className="px-5 py-12 text-center text-sm text-muted sm:px-6">
            Loading prices…
          </div>
        ) : (
          <div className="space-y-5 px-5 py-5 sm:px-6">
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
                        "rounded-lg border px-2 py-3 text-center transition",
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-hairline bg-white text-ink hover:border-ink/30 hover:bg-cream",
                      )}
                    >
                      <span className="block text-lg font-bold tabular-nums">
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
                <p className="text-[13px] font-semibold text-ink">
                  2. What you pay
                </p>
                <div className="mt-3 rounded-lg border border-hairline bg-cream/60">
                  <div className="space-y-0 divide-y divide-hairline px-3.5 text-sm">
                    <div className="flex items-start justify-between gap-3 py-3">
                      <div>
                        <p className="font-medium text-ink">
                          ${usdPerMonth} × {selected.months} months
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          Listed in USD, charged in INR (≈ ₹{usdToInr} per $1)
                        </p>
                      </div>
                      <p className="shrink-0 font-medium tabular-nums text-ink">
                        {formatInr(selected.listInr)}
                      </p>
                    </div>

                    {selected.discountInr > 0 ? (
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

                    <div className="flex items-center justify-between gap-3 py-3.5">
                      <div>
                        <p className="font-bold text-ink">Total due today</p>
                        <p className="mt-0.5 text-xs text-muted">
                          About ${selected.payUsdApprox} ·{" "}
                          {formatInr(selected.perMonthInr)}/month effective
                        </p>
                      </div>
                      <p className="shrink-0 text-xl font-bold tabular-nums text-ink">
                        {formatInr(selected.payInr)}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  No GST added on top of this amount. Paid securely via
                  Razorpay (UPI, cards, netbanking).
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
            onClick={() => onOpenChange(false)}
            className="order-2 text-sm font-medium text-muted transition hover:text-ink disabled:opacity-50 sm:order-1"
          >
            Not now
          </button>
          <Button
            type="button"
            disabled={paying || loadingCatalog || !selected || !paymentsEnabled}
            onClick={() => void proceedToPay()}
            className="order-1 h-11 w-full sm:order-2 sm:w-auto sm:min-w-[200px]"
          >
            {paying
              ? "Opening payment…"
              : selected
                ? `Pay ${formatInr(selected.payInr)}`
                : "Pay"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
