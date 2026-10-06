import { Types } from "mongoose";
import { Coupon, COUPON_PLAN_MONTHS, type ICoupon } from "../models/Coupon";
import { CouponUsage, type CouponUsageEvent } from "../models/CouponUsage";
import { User } from "../models/User";
import {
  getPremiumPlan,
  type PremiumCurrency,
  type PremiumPlanDef,
} from "../lib/premium-mentor-plans";

const CODE_RE = /^[A-Z0-9_-]{3,24}$/;
/** Razorpay's minimum INR charge. */
const MIN_PAYABLE_INR = 1;

export type CouponErrorCode =
  | "COUPON_INVALID"
  | "COUPON_NOT_FOUND"
  | "COUPON_INACTIVE"
  | "COUPON_NOT_STARTED"
  | "COUPON_EXPIRED"
  | "COUPON_CURRENCY"
  | "COUPON_PLAN"
  | "COUPON_EXHAUSTED"
  | "COUPON_USER_LIMIT";

const ERROR_MESSAGES: Record<CouponErrorCode, string> = {
  COUPON_INVALID: "Enter a valid coupon code.",
  COUPON_NOT_FOUND: "This coupon code doesn't exist.",
  COUPON_INACTIVE: "This coupon is no longer active.",
  COUPON_NOT_STARTED: "This coupon isn't live yet.",
  COUPON_EXPIRED: "This coupon has expired.",
  COUPON_CURRENCY: "Coupons work on rupee (INR) payments only.",
  COUPON_PLAN: "This coupon doesn't apply to the plan you picked.",
  COUPON_EXHAUSTED: "This coupon has been fully used.",
  COUPON_USER_LIMIT: "You've already used this coupon.",
};

export type CouponQuote = {
  couponId: string;
  code: string;
  months: number;
  planPayInr: number;
  discountInr: number;
  finalInr: number;
  validUntil: string;
};

type EvalOk = { ok: true; coupon: ICoupon; plan: PremiumPlanDef; quote: CouponQuote };
type EvalErr = { ok: false; code: CouponErrorCode; error: string; coupon?: ICoupon };

export function normalizeCouponCode(raw: unknown): string {
  return String(raw ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function fail(code: CouponErrorCode, coupon?: ICoupon): EvalErr {
  return { ok: false, code, error: ERROR_MESSAGES[code], coupon };
}

async function paidRedemptions(couponId: Types.ObjectId, userId?: string) {
  return CouponUsage.countDocuments({
    coupon: couponId,
    event: "redeemed",
    ...(userId ? { user: new Types.ObjectId(userId) } : {}),
  });
}

export type CouponBroadcastLine = {
  label: string;
  payableInr: number;
  /** Rupees actually removed on this plan (can be less than the face discount at the ₹1 floor). */
  offInr: number;
};

export type CouponBroadcastQuote = {
  code: string;
  /** Face discount the admin set. */
  discountInr: number;
  /** True when every plan loses the same number of rupees. */
  sameOff: boolean;
  validUntilLabel: string;
  perUserLimit: number;
  lines: CouponBroadcastLine[];
};

/**
 * Public offer for a mentor email. Does not check a single mentor's
 * redemption count — that still happens at checkout.
 */
export async function quoteCouponForBroadcast(
  raw: unknown,
): Promise<{ ok: true; quote: CouponBroadcastQuote } | { ok: false; error: string }> {
  const code = normalizeCouponCode(raw);
  if (!code) return { ok: false, error: "Enter a coupon code." };
  if (!CODE_RE.test(code)) return { ok: false, error: "Enter a valid coupon code." };

  const coupon = (await Coupon.findOne({ code })) as ICoupon | null;
  if (!coupon) return { ok: false, error: "This coupon code doesn't exist." };

  const now = new Date();
  if (!coupon.active) return { ok: false, error: "This coupon is no longer active." };
  if (now < coupon.validFrom) return { ok: false, error: "This coupon isn't live yet." };
  if (now > coupon.validUntil) return { ok: false, error: "This coupon has expired." };

  if (coupon.maxRedemptions != null) {
    const used = await paidRedemptions(coupon._id);
    if (used >= coupon.maxRedemptions) {
      return { ok: false, error: "This coupon has been fully used." };
    }
  }

  const months = [...coupon.planMonths].sort((a, b) => a - b);
  const lines: CouponBroadcastLine[] = [];
  for (const monthsValue of months) {
    const plan = getPremiumPlan(monthsValue);
    if (!plan) continue;
    const payableInr = Math.max(MIN_PAYABLE_INR, plan.payInr - coupon.discountInr);
    lines.push({
      label: plan.label,
      payableInr,
      offInr: plan.payInr - payableInr,
    });
  }
  if (lines.length === 0) {
    return { ok: false, error: "This coupon has no plan to apply to." };
  }

  const validUntilLabel = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(coupon.validUntil);

  return {
    ok: true,
    quote: {
      code: coupon.code,
      discountInr: coupon.discountInr,
      sameOff: lines.every((line) => line.offInr === lines[0].offInr),
      validUntilLabel,
      perUserLimit: coupon.perUserLimit,
      lines,
    },
  };
}

/** Pure validation against the DB — no side effects. */
export async function evaluateCoupon(opts: {
  code: unknown;
  userId: string;
  months: number;
  currency: PremiumCurrency;
  now?: Date;
}): Promise<EvalOk | EvalErr> {
  const code = normalizeCouponCode(opts.code);
  if (!CODE_RE.test(code)) return fail("COUPON_INVALID");

  const coupon = (await Coupon.findOne({ code })) as ICoupon | null;
  if (!coupon) return fail("COUPON_NOT_FOUND");

  const now = opts.now ?? new Date();
  if (!coupon.active) return fail("COUPON_INACTIVE", coupon);
  if (now < coupon.validFrom) return fail("COUPON_NOT_STARTED", coupon);
  if (now > coupon.validUntil) return fail("COUPON_EXPIRED", coupon);
  if (opts.currency !== "INR") return fail("COUPON_CURRENCY", coupon);

  const plan = getPremiumPlan(opts.months);
  if (!plan || !coupon.planMonths.includes(plan.months)) {
    return fail("COUPON_PLAN", coupon);
  }

  if (coupon.maxRedemptions != null) {
    const used = await paidRedemptions(coupon._id);
    if (used >= coupon.maxRedemptions) return fail("COUPON_EXHAUSTED", coupon);
  }
  const mine = await paidRedemptions(coupon._id, opts.userId);
  if (mine >= coupon.perUserLimit) return fail("COUPON_USER_LIMIT", coupon);

  const finalInr = Math.max(MIN_PAYABLE_INR, plan.payInr - coupon.discountInr);
  return {
    ok: true,
    coupon,
    plan,
    quote: {
      couponId: String(coupon._id),
      code: coupon.code,
      months: plan.months,
      planPayInr: plan.payInr,
      discountInr: plan.payInr - finalInr,
      finalInr,
      validUntil: coupon.validUntil.toISOString(),
    },
  };
}

async function logUsage(opts: {
  coupon: ICoupon;
  userId: string;
  event: CouponUsageEvent;
  reason?: string;
  months?: number;
  quote?: CouponQuote;
  orderId?: string;
  paymentId?: string;
}) {
  const user = await User.findById(opts.userId, { email: 1, "profile.name": 1 }).lean<{
    email?: string;
    profile?: { name?: string };
  }>();
  await CouponUsage.create({
    coupon: opts.coupon._id,
    code: opts.coupon.code,
    user: new Types.ObjectId(opts.userId),
    email: user?.email,
    name: user?.profile?.name,
    event: opts.event,
    reason: opts.reason,
    months: opts.quote?.months ?? opts.months,
    planPayInr: opts.quote?.planPayInr,
    discountInr: opts.quote?.discountInr,
    finalInr: opts.quote?.finalInr,
    orderId: opts.orderId,
    paymentId: opts.paymentId,
  });
}

/** Checkout "Apply" — validates and records the attempt for admin reporting. */
export async function quoteCouponForCheckout(opts: {
  code: unknown;
  userId: string;
  months: number;
  currency: PremiumCurrency;
}) {
  const result = await evaluateCoupon(opts);
  if (result.ok) {
    await logUsage({
      coupon: result.coupon,
      userId: opts.userId,
      event: "applied",
      quote: result.quote,
    }).catch((err) => console.error("[coupons] log applied failed:", err));
    return { ok: true as const, quote: result.quote };
  }
  if (result.coupon) {
    await logUsage({
      coupon: result.coupon,
      userId: opts.userId,
      event: "rejected",
      reason: result.code,
      months: opts.months,
    }).catch((err) => console.error("[coupons] log rejected failed:", err));
  }
  return { ok: false as const, code: result.code, error: result.error };
}

/**
 * Called once a coupon order is captured. Idempotent per order via the
 * unique partial index, so verify + webhook can both call it safely.
 */
export async function recordCouponRedemption(opts: {
  couponId: string;
  userId: string;
  orderId: string;
  paymentId: string;
  months: number;
  planPayInr: number;
  discountInr: number;
  finalInr: number;
}) {
  const coupon = (await Coupon.findById(opts.couponId)) as ICoupon | null;
  if (!coupon) return;
  try {
    await logUsage({
      coupon,
      userId: opts.userId,
      event: "redeemed",
      orderId: opts.orderId,
      paymentId: opts.paymentId,
      quote: {
        couponId: opts.couponId,
        code: coupon.code,
        months: opts.months,
        planPayInr: opts.planPayInr,
        discountInr: opts.discountInr,
        finalInr: opts.finalInr,
        validUntil: coupon.validUntil.toISOString(),
      },
    });
  } catch (err) {
    if ((err as { code?: number })?.code === 11000) return;
    throw err;
  }
}

/* ── Admin ──────────────────────────────────────────────────────── */

/** Date-only inputs (YYYY-MM-DD) are interpreted in IST. */
function parseDay(raw: unknown, endOfDay: boolean): Date | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const d = new Date(`${s}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}+05:30`);
    return Number.isFinite(d.getTime()) ? d : null;
  }
  const d = new Date(s);
  return Number.isFinite(d.getTime()) ? d : null;
}

function addMonths(from: Date, months: number): Date {
  const d = new Date(from.getTime());
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
}

function parsePlanMonths(raw: unknown): number[] | null {
  if (raw == null) return null;
  if (!Array.isArray(raw)) return null;
  const allowed = COUPON_PLAN_MONTHS as readonly number[];
  const list = [...new Set(raw.map((m) => Number(m)))].filter((m) =>
    allowed.includes(m),
  );
  return list.length > 0 ? list.sort() : null;
}

function parseOptionalPositiveInt(raw: unknown): number | null | undefined {
  if (raw === undefined) return undefined;
  if (raw === null || raw === "") return null;
  const n = Math.floor(Number(raw));
  return Number.isFinite(n) && n >= 1 ? n : undefined;
}

export type CouponStatus = "active" | "inactive" | "scheduled" | "expired" | "exhausted";

function couponStatus(c: ICoupon, redemptions: number, now = new Date()): CouponStatus {
  if (!c.active) return "inactive";
  if (now > c.validUntil) return "expired";
  if (now < c.validFrom) return "scheduled";
  if (c.maxRedemptions != null && redemptions >= c.maxRedemptions) return "exhausted";
  return "active";
}

type UsageStats = {
  entries: number;
  uniqueUsers: number;
  applied: number;
  rejected: number;
  redemptions: number;
  discountGivenInr: number;
  revenueInr: number;
};

const EMPTY_STATS: UsageStats = {
  entries: 0,
  uniqueUsers: 0,
  applied: 0,
  rejected: 0,
  redemptions: 0,
  discountGivenInr: 0,
  revenueInr: 0,
};

async function statsByCoupon(ids: Types.ObjectId[]): Promise<Map<string, UsageStats>> {
  if (ids.length === 0) return new Map();
  const rows = await CouponUsage.aggregate<{
    _id: Types.ObjectId;
    entries: number;
    users: Types.ObjectId[];
    applied: number;
    rejected: number;
    redemptions: number;
    discountGivenInr: number;
    revenueInr: number;
  }>([
    { $match: { coupon: { $in: ids } } },
    {
      $group: {
        _id: "$coupon",
        entries: {
          $sum: { $cond: [{ $in: ["$event", ["applied", "rejected"]] }, 1, 0] },
        },
        users: {
          $addToSet: {
            $cond: [{ $in: ["$event", ["applied", "rejected"]] }, "$user", "$$REMOVE"],
          },
        },
        applied: { $sum: { $cond: [{ $eq: ["$event", "applied"] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ["$event", "rejected"] }, 1, 0] } },
        redemptions: { $sum: { $cond: [{ $eq: ["$event", "redeemed"] }, 1, 0] } },
        discountGivenInr: {
          $sum: {
            $cond: [{ $eq: ["$event", "redeemed"] }, { $ifNull: ["$discountInr", 0] }, 0],
          },
        },
        revenueInr: {
          $sum: {
            $cond: [{ $eq: ["$event", "redeemed"] }, { $ifNull: ["$finalInr", 0] }, 0],
          },
        },
      },
    },
  ]);
  return new Map(
    rows.map((r) => [
      String(r._id),
      {
        entries: r.entries,
        uniqueUsers: r.users.length,
        applied: r.applied,
        rejected: r.rejected,
        redemptions: r.redemptions,
        discountGivenInr: r.discountGivenInr,
        revenueInr: r.revenueInr,
      },
    ]),
  );
}

function serializeCoupon(c: ICoupon, stats: UsageStats) {
  return {
    id: String(c._id),
    code: c.code,
    discountInr: c.discountInr,
    description: c.description || "",
    active: c.active,
    status: couponStatus(c, stats.redemptions),
    validFrom: c.validFrom.toISOString(),
    validUntil: c.validUntil.toISOString(),
    planMonths: c.planMonths,
    maxRedemptions: c.maxRedemptions ?? null,
    perUserLimit: c.perUserLimit,
    createdAt: c.createdAt.toISOString(),
    stats,
  };
}

export async function listAdminCoupons() {
  const coupons = (await Coupon.find().sort({ createdAt: -1 }).limit(500)) as ICoupon[];
  const stats = await statsByCoupon(coupons.map((c) => c._id));
  return coupons.map((c) => serializeCoupon(c, stats.get(String(c._id)) ?? EMPTY_STATS));
}

type AdminResult<T> = T | { error: string; status: number };

export async function createAdminCoupon(body: Record<string, unknown>): Promise<
  AdminResult<{ coupon: ReturnType<typeof serializeCoupon> }>
> {
  const code = normalizeCouponCode(body.code);
  if (!CODE_RE.test(code)) {
    return {
      error: "Code must be 3–24 characters: letters, numbers, - or _",
      status: 400,
    };
  }
  const discountInr = Math.floor(Number(body.discountInr));
  if (!Number.isFinite(discountInr) || discountInr < 1) {
    return { error: "Discount must be at least ₹1", status: 400 };
  }
  const planMonths = parsePlanMonths(body.planMonths) ?? [...COUPON_PLAN_MONTHS];
  const cheapest = Math.min(
    ...planMonths.map((m) => getPremiumPlan(m)?.payInr ?? Infinity),
  );
  if (discountInr >= cheapest) {
    return {
      error: `Discount must be less than the cheapest selected plan (₹${cheapest})`,
      status: 400,
    };
  }

  const validFrom = parseDay(body.validFrom, false) ?? new Date();
  const validUntil = parseDay(body.validUntil, true) ?? addMonths(validFrom, 2);
  if (validUntil <= validFrom) {
    return { error: "End date must be after the start date", status: 400 };
  }

  const maxRedemptions = parseOptionalPositiveInt(body.maxRedemptions);
  const perUserLimit = parseOptionalPositiveInt(body.perUserLimit) ?? 1;

  if (await Coupon.exists({ code })) {
    return { error: `Coupon ${code} already exists`, status: 409 };
  }

  const coupon = (await Coupon.create({
    code,
    discountInr,
    description:
      typeof body.description === "string" ? body.description.slice(0, 200) : undefined,
    active: body.active === false ? false : true,
    validFrom,
    validUntil,
    planMonths,
    maxRedemptions: maxRedemptions ?? null,
    perUserLimit,
  })) as ICoupon;

  return { coupon: serializeCoupon(coupon, EMPTY_STATS) };
}

export async function updateAdminCoupon(
  id: string,
  body: Record<string, unknown>,
): Promise<AdminResult<{ coupon: ReturnType<typeof serializeCoupon> }>> {
  if (!Types.ObjectId.isValid(id)) return { error: "Invalid coupon id", status: 400 };
  const coupon = (await Coupon.findById(id)) as ICoupon | null;
  if (!coupon) return { error: "Coupon not found", status: 404 };

  if (typeof body.active === "boolean") coupon.active = body.active;
  if (typeof body.description === "string") {
    coupon.description = body.description.slice(0, 200);
  }
  if (body.validUntil !== undefined) {
    const d = parseDay(body.validUntil, true);
    if (!d || d <= coupon.validFrom) {
      return { error: "End date must be after the start date", status: 400 };
    }
    coupon.validUntil = d;
  }
  const maxRedemptions = parseOptionalPositiveInt(body.maxRedemptions);
  if (maxRedemptions !== undefined) coupon.maxRedemptions = maxRedemptions;
  const perUserLimit = parseOptionalPositiveInt(body.perUserLimit);
  if (perUserLimit != null) coupon.perUserLimit = perUserLimit;

  await coupon.save();
  const stats = await statsByCoupon([coupon._id]);
  return {
    coupon: serializeCoupon(coupon, stats.get(String(coupon._id)) ?? EMPTY_STATS),
  };
}

type AdminCouponUsageRow = {
  id: string;
  userId: string;
  email: string;
  name: string;
  event: CouponUsageEvent;
  reason: string | null;
  months: number | null;
  planPayInr: number | null;
  discountInr: number | null;
  finalInr: number | null;
  orderId: string | null;
  paymentId: string | null;
  createdAt: string;
};

export async function getAdminCouponUsage(
  id: string,
  limit = 300,
): Promise<AdminResult<{ code: string; events: AdminCouponUsageRow[] }>> {
  if (!Types.ObjectId.isValid(id)) return { error: "Invalid coupon id", status: 400 };
  const coupon = (await Coupon.findById(id)) as ICoupon | null;
  if (!coupon) return { error: "Coupon not found", status: 404 };

  const events = await CouponUsage.find({ coupon: coupon._id })
    .sort({ createdAt: -1 })
    .limit(Math.min(Math.max(limit, 1), 1000))
    .lean<
      Array<{
        _id: Types.ObjectId;
        user: Types.ObjectId;
        email?: string;
        name?: string;
        event: CouponUsageEvent;
        reason?: string;
        months?: number;
        planPayInr?: number;
        discountInr?: number;
        finalInr?: number;
        orderId?: string;
        paymentId?: string;
        createdAt: Date;
      }>
    >();

  return {
    code: coupon.code,
    events: events.map((e) => ({
      id: String(e._id),
      userId: String(e.user),
      email: e.email || "",
      name: e.name || "",
      event: e.event,
      reason: e.reason ? (ERROR_MESSAGES[e.reason as CouponErrorCode] ?? e.reason) : null,
      months: e.months ?? null,
      planPayInr: e.planPayInr ?? null,
      discountInr: e.discountInr ?? null,
      finalInr: e.finalInr ?? null,
      orderId: e.orderId || null,
      paymentId: e.paymentId || null,
      createdAt: e.createdAt.toISOString(),
    })),
  };
}
