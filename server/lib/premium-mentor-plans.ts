/**
 * Premium Mentor plan catalog — single source of truth for pricing.
 * India pays a fixed INR price; everyone else pays a fixed USD price
 * (their card issuer converts to local currency). No GST added on top.
 */
export const PREMIUM_USD_PER_MONTH = 5;
/** Marketing FX for USD→INR display (≈ ₹449 / $5). */
export const PREMIUM_USD_TO_INR = 89.8;
export const PREMIUM_INR_PER_MONTH = 449;

export type PremiumCurrency = "INR" | "USD";
export const PREMIUM_CURRENCIES: PremiumCurrency[] = ["INR", "USD"];

export type PremiumPlanMonths = 2 | 3 | 4;

export type PremiumPlanDef = {
  months: PremiumPlanMonths;
  label: string;
  /** List price in whole rupees before discount */
  listInr: number;
  discountPercent: number;
  /** Amount charged (whole rupees) */
  payInr: number;
  /** List price in US cents before discount */
  listUsdCents: number;
  /** Amount charged in US cents */
  payUsdCents: number;
  badge?: string;
  default?: boolean;
};

function roundInr(n: number): number {
  return Math.max(1, Math.round(n));
}

function buildPlan(
  months: PremiumPlanMonths,
  discountPercent: number,
  opts?: { badge?: string; default?: boolean },
): PremiumPlanDef {
  const listInr = roundInr(PREMIUM_INR_PER_MONTH * months);
  const payInr = roundInr(listInr * (1 - discountPercent / 100));
  const listUsdCents = Math.round(PREMIUM_USD_PER_MONTH * months * 100);
  const payUsdCents = Math.max(
    100,
    Math.round(listUsdCents * (1 - discountPercent / 100)),
  );
  return {
    months,
    label: `${months} months`,
    listInr,
    discountPercent,
    payInr,
    listUsdCents,
    payUsdCents,
    badge: opts?.badge,
    default: opts?.default,
  };
}

/** 2 months default; longer terms get a production-style volume discount. */
export const PREMIUM_PLANS: PremiumPlanDef[] = [
  buildPlan(2, 0, { default: true }),
  buildPlan(3, 12, { badge: "Save 12%" }),
  buildPlan(4, 18, { badge: "Best value" }),
];

export function getPremiumPlan(
  months: number,
): PremiumPlanDef | null {
  const m = Math.floor(Number(months)) as PremiumPlanMonths;
  return PREMIUM_PLANS.find((p) => p.months === m) || null;
}

export function planToPaise(plan: PremiumPlanDef): number {
  return plan.payInr * 100;
}

/** Amount in the currency's smallest unit (paise / cents) — what Razorpay charges. */
export function planAmountMinor(
  plan: PremiumPlanDef,
  currency: PremiumCurrency,
): number {
  return currency === "USD" ? plan.payUsdCents : planToPaise(plan);
}

export function usdDisplayForMonths(months: number): number {
  return PREMIUM_USD_PER_MONTH * months;
}

export function serializePremiumCatalog() {
  return {
    usdPerMonth: PREMIUM_USD_PER_MONTH,
    inrPerMonth: PREMIUM_INR_PER_MONTH,
    usdToInr: PREMIUM_USD_TO_INR,
    currency: "INR" as const,
    noGstAdded: true,
    plans: PREMIUM_PLANS.map((p) => ({
      months: p.months,
      label: p.label,
      listInr: p.listInr,
      payInr: p.payInr,
      discountPercent: p.discountPercent,
      discountInr: Math.max(0, p.listInr - p.payInr),
      listUsd: p.listUsdCents / 100,
      payUsd: p.payUsdCents / 100,
      discountUsd: Math.max(0, p.listUsdCents - p.payUsdCents) / 100,
      payUsdApprox: p.payUsdCents / 100,
      badge: p.badge || null,
      isDefault: Boolean(p.default),
      perMonthInr: roundInr(p.payInr / p.months),
      perMonthUsd: Math.round(p.payUsdCents / p.months) / 100,
    })),
  };
}
