import crypto from "crypto";
import { Types } from "mongoose";
import Razorpay from "razorpay";
import { config } from "../config";
import { evaluateCoupon, recordCouponRedemption } from "./coupons";
import {
  getPremiumPlan,
  planAmountMinor,
  PREMIUM_USD_PER_MONTH,
  PREMIUM_USD_TO_INR,
  serializePremiumCatalog,
  usdDisplayForMonths,
  type PremiumCurrency,
  type PremiumPlanDef,
} from "../lib/premium-mentor-plans";
import { resolvePremiumCurrency } from "../lib/premium-billing-geo";
import {
  User,
  type IPremiumMentorPayment,
  type IUser,
} from "../models/User";

const MAX_PAYMENT_HISTORY = 50;

function getRazorpay() {
  if (!config.razorpay.keyId || !config.razorpay.keySecret) {
    throw new Error("Razorpay is not configured");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Ctor = Razorpay as any;
  return new Ctor({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret,
  });
}

export function isPremiumRazorpayConfigured(): boolean {
  return Boolean(config.razorpay.keyId && config.razorpay.keySecret);
}

export function isMentrPremiumActive(
  user: Pick<IUser, "mentrPremium" | "premiumMentorStatus">,
  now = new Date(),
): boolean {
  const exp = user.mentrPremium?.expiresAt;
  // Dated subscription wins — never keep "Premium" after expiry
  if (exp instanceof Date) {
    return (
      user.mentrPremium?.type === "premium" && exp.getTime() > now.getTime()
    );
  }
  if (typeof exp === "string") {
    const t = new Date(exp).getTime();
    return (
      user.mentrPremium?.type === "premium" &&
      Number.isFinite(t) &&
      t > now.getTime()
    );
  }
  // Legacy admin-verified with no expiry on record
  if (
    user.premiumMentorStatus === "verified" &&
    user.mentrPremium?.type !== "premium"
  ) {
    return true;
  }
  return false;
}

function addMonths(from: Date, months: number): Date {
  const d = new Date(from.getTime());
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  // Clamp overflow (e.g. Jan 31 + 1 month)
  if (d.getDate() < day) d.setDate(0);
  return d;
}

function makeReceiptNumber(userId: string): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `MP-${userId.slice(-4).toUpperCase()}-${stamp}${rand}`.slice(0, 28);
}

function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(String(signature)),
    );
  } catch {
    return false;
  }
}

function rowCurrency(row: IPremiumMentorPayment): PremiumCurrency {
  return row.currency === "USD" ? "USD" : "INR";
}

function rowAmountMinor(row: IPremiumMentorPayment): number {
  return row.amountMinor ?? row.amountPaise;
}

async function assertPaymentCaptured(
  orderId: string,
  paymentId: string,
  expectedMinor: number,
  expectedCurrency: PremiumCurrency,
): Promise<
  | { ok: true; payment: Record<string, unknown> }
  | { error: string; code: string }
> {
  try {
    const rzp = getRazorpay();
    const payment = await rzp.payments.fetch(paymentId);
    const status = String(payment?.status || "");
    const payOrder = String(payment?.order_id || "");
    const amount = Number(payment?.amount || 0);
    const currency = String(payment?.currency || "").toUpperCase();
    if (payOrder !== orderId) {
      return { error: "Payment order mismatch", code: "ORDER_MISMATCH" };
    }
    if (status !== "captured") {
      return {
        error: `Payment not captured yet (${status || "unknown"})`,
        code: "NOT_CAPTURED",
      };
    }
    if (amount !== expectedMinor || currency !== expectedCurrency) {
      return { error: "Payment amount mismatch", code: "AMOUNT_MISMATCH" };
    }
    return {
      ok: true,
      payment: payment as unknown as Record<string, unknown>,
    };
  } catch (err) {
    console.error("[premium-mentor] payment fetch failed:", err);
    return {
      error: "Could not confirm payment with Razorpay. Retry shortly.",
      code: "FETCH_FAILED",
    };
  }
}

function sanitizeRazorpaySnapshot(
  payment: Record<string, unknown>,
): Record<string, unknown> {
  return {
    id: payment.id,
    order_id: payment.order_id,
    amount: payment.amount,
    currency: payment.currency,
    base_amount: payment.base_amount,
    base_currency: payment.base_currency,
    international: payment.international,
    status: payment.status,
    method: payment.method,
    email: payment.email,
    contact: payment.contact
      ? String(payment.contact).replace(/\d(?=\d{4})/g, "•")
      : undefined,
    bank: payment.bank,
    wallet: payment.wallet,
    vpa: payment.vpa
      ? String(payment.vpa).replace(/^(.{2}).+(@.+)$/, "$1•••$2")
      : undefined,
    captured: payment.captured,
    created_at: payment.created_at,
  };
}

export function serializePremiumPayment(p: IPremiumMentorPayment) {
  return {
    id: (p as IPremiumMentorPayment & { _id?: { toString(): string } })._id
      ? String(
          (p as IPremiumMentorPayment & { _id: { toString(): string } })._id,
        )
      : p.receiptNumber,
    receiptNumber: p.receiptNumber,
    razorpayOrderId: p.razorpayOrderId,
    razorpayPaymentId: p.razorpayPaymentId || null,
    status: p.status,
    months: p.months,
    listInr: p.listInr,
    discountPercent: p.discountPercent,
    discountInr: p.discountInr,
    amountInr: p.amountInr,
    amountPaise: p.amountPaise,
    currency: rowCurrency(p),
    amountMinor: rowAmountMinor(p),
    amountCharged: rowAmountMinor(p) / 100,
    billingCountry: p.billingCountry || null,
    usdPerMonth: p.usdPerMonth,
    listUsd: p.listUsd,
    usdToInr: p.usdToInr,
    periodStart: p.periodStart ? p.periodStart.toISOString() : null,
    periodEnd: p.periodEnd ? p.periodEnd.toISOString() : null,
    method: p.method || null,
    couponCode: p.couponCode || null,
    couponDiscountInr: p.couponDiscountInr || 0,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
    paidAt: p.paidAt ? p.paidAt.toISOString() : null,
  };
}

export function serializeMentrPremiumState(user: IUser) {
  const now = new Date();
  const active = isMentrPremiumActive(user, now);
  const expiresAt = user.mentrPremium?.expiresAt;
  const payments = (user.premiumPayments || [])
    .filter((p: IPremiumMentorPayment) => p.status === "paid")
    .slice()
    .reverse()
    .map(serializePremiumPayment);

  return {
    catalog: serializePremiumCatalog(),
    paymentsEnabled: isPremiumRazorpayConfigured(),
    mentrType: active ? ("premium" as const) : ("free" as const),
    premiumActive: active,
    canPurchase: !active,
    firstRechargedAt: user.mentrPremium?.firstRechargedAt
      ? user.mentrPremium.firstRechargedAt.toISOString()
      : null,
    lastPurchasedAt: user.mentrPremium?.lastPurchasedAt
      ? user.mentrPremium.lastPurchasedAt.toISOString()
      : null,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    currentPlanMonths: user.mentrPremium?.currentPlanMonths || null,
    lastReceiptNumber: user.mentrPremium?.lastReceiptNumber || null,
    payments,
  };
}

export async function createPremiumMentorOrder(
  userId: string,
  monthsRaw: number,
  opts?: {
    acceptedLegal?: boolean;
    legalVersion?: string;
    country?: string | null;
    requestedCurrency?: PremiumCurrency | null;
    couponCode?: string | null;
  },
) {
  if (!isPremiumRazorpayConfigured()) {
    return {
      error: "Payments are temporarily unavailable",
      code: "PAYMENTS_OFF" as const,
    };
  }

  if (opts?.acceptedLegal !== true) {
    return {
      error: "Please confirm the Terms and Privacy policy to continue.",
      code: "LEGAL_CONSENT_REQUIRED" as const,
    };
  }

  const plan = getPremiumPlan(monthsRaw);
  if (!plan) {
    return { error: "Pick a valid plan (2, 3, or 4 months)", code: "BAD_PLAN" as const };
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "faculty") {
    return { error: "Only mentors can buy Premium", code: "FORBIDDEN" as const };
  }

  if (isMentrPremiumActive(user)) {
    return {
      error: "Premium is already active. Renew after it expires.",
      code: "ALREADY_ACTIVE" as const,
    };
  }

  // Abandoned Razorpay modals / missed cancel calls leave status "created".
  // Persist supersede before calling Razorpay so retries unblock even if RZP fails.
  user.premiumPayments = user.premiumPayments || [];
  let superseded = false;
  for (const p of user.premiumPayments) {
    if (p.status === "created") {
      p.status = "failed";
      superseded = true;
    }
  }
  if (superseded) {
    await user.save();
  }

  const currency = resolvePremiumCurrency({
    country: opts.country ?? null,
    requested: opts.requestedCurrency ?? null,
  });
  let coupon: {
    id: string;
    code: string;
    discountInr: number;
    finalInr: number;
  } | null = null;
  if (opts.couponCode && String(opts.couponCode).trim()) {
    const evaluated = await evaluateCoupon({
      code: opts.couponCode,
      userId,
      months: plan.months,
      currency,
    });
    if (!evaluated.ok) {
      return { error: evaluated.error, code: evaluated.code };
    }
    coupon = {
      id: evaluated.quote.couponId,
      code: evaluated.quote.code,
      discountInr: evaluated.quote.discountInr,
      finalInr: evaluated.quote.finalInr,
    };
  }

  const amountMinor = coupon ? coupon.finalInr * 100 : planAmountMinor(plan, currency);
  // USD rows keep an INR estimate until Razorpay reports the settled base_amount.
  const amountInr =
    currency === "USD"
      ? Math.max(1, Math.round((plan.payUsdCents / 100) * PREMIUM_USD_TO_INR))
      : coupon
        ? coupon.finalInr
        : plan.payInr;
  const amountPaise = amountInr * 100;
  const billingCountry = opts.country || undefined;
  const receiptNumber = makeReceiptNumber(userId);
  const rzp = getRazorpay();
  const order = await rzp.orders.create({
    amount: amountMinor,
    currency,
    receipt: receiptNumber.slice(0, 40),
    notes: {
      purpose: "premium_mentor",
      userId,
      months: String(plan.months),
      receiptNumber,
      ...(billingCountry ? { country: billingCountry } : {}),
      ...(coupon ? { coupon: coupon.code } : {}),
    },
  });

  const row: IPremiumMentorPayment = {
    receiptNumber,
    razorpayOrderId: String(order.id),
    status: "created",
    months: plan.months,
    listInr: plan.listInr,
    discountPercent: plan.discountPercent,
    discountInr: Math.max(0, plan.listInr - plan.payInr),
    amountInr,
    amountPaise,
    currency,
    amountMinor,
    billingCountry,
    usdPerMonth: PREMIUM_USD_PER_MONTH,
    listUsd: usdDisplayForMonths(plan.months),
    usdToInr: PREMIUM_USD_TO_INR,
    createdAt: new Date(),
    termsAcceptedAt: new Date(),
    termsAcceptedVersion: opts.legalVersion || undefined,
    ...(coupon
      ? {
          couponId: new Types.ObjectId(coupon.id),
          couponCode: coupon.code,
          couponDiscountInr: coupon.discountInr,
        }
      : {}),
  };

  user.premiumPayments.push(row);
  if (user.premiumPayments.length > MAX_PAYMENT_HISTORY) {
    user.premiumPayments = user.premiumPayments.slice(-MAX_PAYMENT_HISTORY);
  }
  await user.save();

  return {
    orderId: String(order.id),
    amountMinor,
    amountPaise,
    amountInr,
    currency,
    months: plan.months,
    listInr: plan.listInr,
    discountPercent: plan.discountPercent,
    discountInr: Math.max(0, plan.listInr - plan.payInr),
    listUsd: usdDisplayForMonths(plan.months),
    coupon: coupon
      ? { code: coupon.code, discountInr: coupon.discountInr }
      : null,
    receiptNumber,
    keyId: config.razorpay.keyId,
    prefill: {
      email: user.email,
      name: user.profile?.name || "",
      contact: user.profile?.phoneNumber || "",
    },
  };
}

function applyPlanToUser(
  user: IUser,
  plan: PremiumPlanDef,
  paymentId: string,
  receiptNumber: string,
  paidAt: Date,
) {
  const periodStart = paidAt;
  const periodEnd = addMonths(periodStart, plan.months);

  if (!user.mentrPremium) {
    user.mentrPremium = { type: "premium" };
  }
  if (!user.mentrPremium.firstRechargedAt) {
    user.mentrPremium.firstRechargedAt = paidAt;
  }
  if (!user.mentrPremium.planChosenAt) {
    user.mentrPremium.planChosenAt = paidAt;
  }
  user.mentrPremium.type = "premium";
  user.mentrPremium.lastPurchasedAt = paidAt;
  user.mentrPremium.expiresAt = periodEnd;
  user.mentrPremium.currentPlanMonths = plan.months;
  user.mentrPremium.lastReceiptNumber = receiptNumber;
  user.mentrPremium.lastRazorpayPaymentId = paymentId;

  // Keep legacy badge field in sync for existing UI checks
  user.premiumMentorStatus = "verified";
  user.premiumMentorVerifiedAt = paidAt;

  return { periodStart, periodEnd };
}

export async function verifyPremiumMentorPayment(opts: {
  userId: string;
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const { orderId, paymentId, signature } = opts;
  if (!orderId || !paymentId || !signature) {
    return { error: "Missing payment references", code: "BAD_PAYMENT" as const };
  }
  if (!verifyPaymentSignature(orderId, paymentId, signature)) {
    return { error: "Invalid payment signature", code: "BAD_SIGNATURE" as const };
  }
  return applyPremiumPayment(opts);
}

/**
 * Razorpay webhook path (HMAC already verified on the raw body). Recovers
 * payments where the browser closed before /verify — common with 3-D Secure
 * on international cards.
 */
export async function applyPremiumPaymentFromWebhook(opts: {
  userId?: string;
  orderId: string;
  paymentId: string;
}) {
  let userId = opts.userId ? String(opts.userId) : "";
  if (!userId) {
    const owner = await User.findOne(
      { "premiumPayments.razorpayOrderId": opts.orderId },
      { _id: 1 },
    ).lean();
    userId = owner ? String(owner._id) : "";
  }
  if (!userId) {
    return { error: "Order not found", code: "ORDER_NOT_FOUND" as const };
  }
  const result = await applyPremiumPayment({
    userId,
    orderId: opts.orderId,
    paymentId: opts.paymentId,
  });
  if (!("error" in result) && !result.alreadyApplied) {
    const { recordPremiumCheckoutEvent } = await import(
      "./premium-checkout-tracking"
    );
    await recordPremiumCheckoutEvent({
      userId,
      event: "paid",
      months: result.payment.months,
      currency: result.payment.currency,
      orderId: opts.orderId,
      source: "webhook",
    });
  }
  return result;
}

async function applyPremiumPayment(opts: {
  userId: string;
  orderId: string;
  paymentId: string;
}) {
  const { userId, orderId, paymentId } = opts;
  const user = await User.findById(userId);
  if (!user || user.role !== "faculty") {
    return { error: "Mentor not found", code: "FORBIDDEN" as const };
  }

  const payments = user.premiumPayments || [];
  const byPayment = payments.find(
    (p: IPremiumMentorPayment) =>
      p.razorpayPaymentId === paymentId && p.status === "paid",
  );
  if (byPayment) {
    return {
      alreadyApplied: true as const,
      user,
      premium: serializeMentrPremiumState(user),
      payment: serializePremiumPayment(byPayment),
    };
  }

  const row = payments.find(
    (p: IPremiumMentorPayment) => p.razorpayOrderId === orderId,
  );
  if (!row) {
    return { error: "Order not found", code: "ORDER_NOT_FOUND" as const };
  }
  if (row.status === "paid") {
    return {
      alreadyApplied: true as const,
      user,
      premium: serializeMentrPremiumState(user),
      payment: serializePremiumPayment(row),
    };
  }

  // Race: if already premium from another payment mid-flight
  if (isMentrPremiumActive(user) && row.status === "created") {
    row.status = "failed";
    await user.save();
    return {
      error: "Premium already active on this account",
      code: "ALREADY_ACTIVE" as const,
    };
  }

  const currency = rowCurrency(row);
  const expectedMinor = rowAmountMinor(row);
  const live = await assertPaymentCaptured(
    orderId,
    paymentId,
    expectedMinor,
    currency,
  );
  if (!("ok" in live)) {
    return { error: live.error, code: live.code };
  }

  const plan = getPremiumPlan(row.months);
  const couponMinor =
    currency === "INR" && row.couponDiscountInr ? row.couponDiscountInr * 100 : 0;
  if (!plan || planAmountMinor(plan, currency) - couponMinor !== expectedMinor) {
    return { error: "Plan amount mismatch", code: "AMOUNT_MISMATCH" as const };
  }

  // International payments settle in INR — record the real rupee value when Razorpay reports it.
  const baseAmount = Number(live.payment.base_amount || 0);
  const settledInr =
    currency === "USD" &&
    String(live.payment.base_currency || "").toUpperCase() === "INR" &&
    baseAmount > 0
      ? { amountPaise: baseAmount, amountInr: Math.round(baseAmount / 100) }
      : null;

  const paidAt = new Date();
  const { periodStart, periodEnd } = applyPlanToUser(
    user,
    plan,
    paymentId,
    row.receiptNumber,
    paidAt,
  );

  row.status = "paid";
  row.razorpayPaymentId = paymentId;
  row.paidAt = paidAt;
  row.periodStart = periodStart;
  row.periodEnd = periodEnd;
  row.method = live.payment.method ? String(live.payment.method) : undefined;
  row.email = live.payment.email ? String(live.payment.email) : user.email;
  row.razorpaySnapshot = sanitizeRazorpaySnapshot(live.payment);

  // Atomic claim so double-verify can't double-extend (status flip first via filter).
  // "failed" is claimable: the checkout may have cancelled an order Razorpay later captured.
  const claimed = await User.findOneAndUpdate(
    {
      _id: userId,
      premiumPayments: {
        $elemMatch: {
          razorpayOrderId: orderId,
          status: { $in: ["created", "failed"] },
        },
      },
    },
    {
      $set: {
        ...(settledInr
          ? {
              "premiumPayments.$.amountInr": settledInr.amountInr,
              "premiumPayments.$.amountPaise": settledInr.amountPaise,
            }
          : {}),
        "premiumPayments.$.status": "paid",
        "premiumPayments.$.razorpayPaymentId": paymentId,
        "premiumPayments.$.paidAt": paidAt,
        "premiumPayments.$.periodStart": periodStart,
        "premiumPayments.$.periodEnd": periodEnd,
        "premiumPayments.$.method": row.method,
        "premiumPayments.$.email": row.email,
        "premiumPayments.$.razorpaySnapshot": row.razorpaySnapshot,
        "mentrPremium.type": "premium",
        "mentrPremium.lastPurchasedAt": paidAt,
        "mentrPremium.expiresAt": periodEnd,
        "mentrPremium.currentPlanMonths": plan.months,
        "mentrPremium.lastReceiptNumber": row.receiptNumber,
        "mentrPremium.lastRazorpayPaymentId": paymentId,
        premiumMentorStatus: "verified",
        premiumMentorVerifiedAt: paidAt,
        ...(user.mentrPremium?.firstRechargedAt
          ? {}
          : { "mentrPremium.firstRechargedAt": paidAt }),
        ...(user.mentrPremium?.planChosenAt
          ? {}
          : { "mentrPremium.planChosenAt": paidAt }),
      },
    },
    { new: true },
  );

  if (!claimed) {
    const fresh = await User.findById(userId);
    const paid = fresh?.premiumPayments?.find(
      (p: IPremiumMentorPayment) =>
        p.razorpayOrderId === orderId && p.status === "paid",
    );
    if (fresh && paid) {
      return {
        alreadyApplied: true as const,
        user: fresh,
        premium: serializeMentrPremiumState(fresh),
        payment: serializePremiumPayment(paid),
      };
    }
    return { error: "Could not activate Premium", code: "APPLY_FAILED" as const };
  }

  // Ensure firstRechargedAt if missing (edge path)
  if (!claimed.mentrPremium?.firstRechargedAt) {
    claimed.mentrPremium = claimed.mentrPremium || { type: "premium" };
    claimed.mentrPremium.firstRechargedAt = paidAt;
    await claimed.save();
  }

  const paidRow =
    claimed.premiumPayments?.find(
      (p: IPremiumMentorPayment) => p.razorpayOrderId === orderId,
    ) || row;

  if (row.couponId && row.couponDiscountInr) {
    await recordCouponRedemption({
      couponId: String(row.couponId),
      userId,
      orderId,
      paymentId,
      months: plan.months,
      planPayInr: plan.payInr,
      discountInr: row.couponDiscountInr,
      finalInr: plan.payInr - row.couponDiscountInr,
    }).catch((err) =>
      console.error("[premium-mentor] coupon redemption log failed:", err),
    );
  }

  return {
    alreadyApplied: false as const,
    user: claimed,
    premium: serializeMentrPremiumState(claimed),
    payment: serializePremiumPayment(paidRow),
  };
}

export async function markPremiumOrderFailed(
  userId: string,
  orderId: string,
) {
  if (!orderId) return;
  await User.updateOne(
    {
      _id: userId,
      premiumPayments: {
        $elemMatch: { razorpayOrderId: orderId, status: "created" },
      },
    },
    { $set: { "premiumPayments.$.status": "failed" } },
  );
}

/**
 * Onboarding / soft-commit: mentor stays Classic (free). Does not downgrade
 * an active Premium subscription.
 */
export async function chooseFreeMentorPlan(userId: string) {
  const user = await User.findById(userId);
  if (!user || user.role !== "faculty") {
    return { error: "Mentor not found", code: "FORBIDDEN" as const };
  }

  const now = new Date();
  if (isMentrPremiumActive(user, now)) {
    return {
      alreadyPremium: true as const,
      user,
      premium: serializeMentrPremiumState(user),
    };
  }

  if (!user.mentrPremium) {
    user.mentrPremium = { type: "free" };
  }
  user.mentrPremium.type = "free";
  if (!user.mentrPremium.planChosenAt) {
    user.mentrPremium.planChosenAt = now;
  }
  user.markModified("mentrPremium");
  await user.save();

  return {
    alreadyPremium: false as const,
    user,
    premium: serializeMentrPremiumState(user),
  };
}
