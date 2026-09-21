import crypto from "crypto";
import Razorpay from "razorpay";
import { config } from "../config";
import type { SnapGradeRecharge } from "../models/SnapGrade";
import { SnapGradeWallet } from "../models/SnapGrade";
import { getOrCreateWallet } from "./snap-grade";

export const MIN_RECHARGE_CREDITS = 1;
export const MAX_RECHARGE_CREDITS = 5_000;
/** Cap pending unpaid orders per user to limit abuse. */
const MAX_OPEN_ORDERS = 5;

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

export function snapGradeCreditPaise(): number {
  return config.razorpay.creditPaise;
}

export function isRazorpayConfigured(): boolean {
  return Boolean(config.razorpay.keyId && config.razorpay.keySecret);
}

/** Confirm payment is captured via Razorpay Payments API (no webhook needed). */
async function assertPaymentCaptured(
  orderId: string,
  paymentId: string,
  expectedPaise: number,
): Promise<{ ok: true } | { error: string; code: string }> {
  try {
    const rzp = getRazorpay();
    const payment = await rzp.payments.fetch(paymentId);
    const status = String(payment?.status || "");
    const payOrder = String(payment?.order_id || "");
    const amount = Number(payment?.amount || 0);
    if (payOrder !== orderId) {
      return { error: "Payment order mismatch", code: "ORDER_MISMATCH" };
    }
    // Only captured money — never credit on authorized/created/failed.
    if (status !== "captured") {
      return {
        error: `Payment not captured yet (${status || "unknown"})`,
        code: "NOT_CAPTURED",
      };
    }
    if (amount !== expectedPaise) {
      return { error: "Payment amount mismatch", code: "AMOUNT_MISMATCH" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[snap-grade] payment fetch failed:", err);
    return {
      error: "Could not confirm payment with Razorpay. Retry shortly.",
      code: "FETCH_FAILED",
    };
  }
}

export async function createSnapGradeRechargeOrder(
  userId: string,
  creditsRaw: number,
) {
  if (!isRazorpayConfigured()) {
    return { error: "Payments are temporarily unavailable", code: "PAYMENTS_OFF" as const };
  }

  const credits = Math.floor(Number(creditsRaw));
  if (!Number.isFinite(credits) || credits < MIN_RECHARGE_CREDITS) {
    return {
      error: `Minimum recharge is ${MIN_RECHARGE_CREDITS} credits`,
      code: "MIN_CREDITS" as const,
    };
  }
  if (credits > MAX_RECHARGE_CREDITS) {
    return {
      error: `Maximum recharge is ${MAX_RECHARGE_CREDITS} credits`,
      code: "MAX_CREDITS" as const,
    };
  }

  const wallet = await getOrCreateWallet(userId);
  const open = (wallet.recharges || []).filter(
    (r: SnapGradeRecharge) => r.status === "created",
  );
  if (open.length >= MAX_OPEN_ORDERS) {
    return {
      error: "Too many open payment attempts. Finish or wait, then try again.",
      code: "TOO_MANY_ORDERS" as const,
    };
  }

  const amountPaise = credits * snapGradeCreditPaise();
  const rzp = getRazorpay();
  const order = await rzp.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: `sg_${userId.slice(-8)}_${Date.now().toString(36)}`.slice(0, 40),
    notes: {
      purpose: "snap_grade_credits",
      userId,
      credits: String(credits),
    },
  });

  wallet.recharges.push({
    razorpayOrderId: order.id,
    amountPaise,
    credits,
    status: "created",
    createdAt: new Date(),
  });
  // Keep recharge log bounded
  if (wallet.recharges.length > 100) {
    wallet.recharges = wallet.recharges.slice(-100);
  }
  await wallet.save();

  return {
    orderId: order.id,
    amountPaise,
    currency: "INR",
    credits,
    keyId: config.razorpay.keyId,
    creditBalance: wallet.creditBalance,
  };
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

/**
 * Idempotent credit grant after successful Razorpay payment.
 * Primary path: client verify (HMAC + live Payments API fetch).
 * Webhook is optional / production later — not required for credits.
 */
export async function applyPaidRecharge(opts: {
  userId?: string;
  orderId: string;
  paymentId: string;
  signature?: string;
  webhookEventId?: string;
  skipSignature?: boolean;
  /** When true, also confirm capture via Razorpay API (client verify). */
  confirmWithApi?: boolean;
}) {
  const { orderId, paymentId } = opts;
  if (!orderId || !paymentId) {
    return { error: "Missing payment references", code: "BAD_PAYMENT" as const };
  }

  if (!opts.skipSignature) {
    if (!opts.signature || !verifyPaymentSignature(orderId, paymentId, opts.signature)) {
      return { error: "Invalid payment signature", code: "BAD_SIGNATURE" as const };
    }
  }

  // Prefer user-scoped lookup when known; otherwise find by order id.
  let wallet = opts.userId
    ? await SnapGradeWallet.findOne({ user: opts.userId })
    : null;
  if (!wallet) {
    wallet = await SnapGradeWallet.findOne({
      "recharges.razorpayOrderId": orderId,
    });
  }
  if (!wallet) {
    return { error: "Order not found", code: "ORDER_NOT_FOUND" as const };
  }

  if (opts.userId && wallet.user.toString() !== opts.userId) {
    return { error: "Order does not belong to this account", code: "FORBIDDEN" as const };
  }

  // Already credited for this payment?
  const byPayment = wallet.recharges.find(
    (r: SnapGradeRecharge) =>
      r.razorpayPaymentId === paymentId && r.status === "paid",
  );
  if (byPayment) {
    return {
      alreadyApplied: true as const,
      creditBalance: wallet.creditBalance,
      credits: byPayment.credits,
    };
  }

  const row = wallet.recharges.find(
    (r: SnapGradeRecharge) => r.razorpayOrderId === orderId,
  );
  if (!row) {
    return { error: "Order not found on account", code: "ORDER_NOT_FOUND" as const };
  }
  if (row.status === "paid") {
    return {
      alreadyApplied: true as const,
      creditBalance: wallet.creditBalance,
      credits: row.credits,
    };
  }

  // Live API confirmation — client HMAC is not enough; webhook HMAC is not enough.
  if (opts.confirmWithApi !== false) {
    const live = await assertPaymentCaptured(orderId, paymentId, row.amountPaise);
    if (!("ok" in live)) {
      return { error: live.error, code: live.code };
    }
  }

  const paidAt = new Date();
  const filter: Record<string, unknown> = {
    recharges: {
      $elemMatch: { razorpayOrderId: orderId, status: "created" },
    },
  };
  if (opts.userId) filter.user = opts.userId;

  const credited = await SnapGradeWallet.findOneAndUpdate(
    filter,
    {
      $set: {
        "recharges.$.status": "paid",
        "recharges.$.razorpayPaymentId": paymentId,
        ...(opts.signature
          ? { "recharges.$.razorpaySignature": opts.signature }
          : {}),
        ...(opts.webhookEventId
          ? { "recharges.$.webhookEventId": opts.webhookEventId }
          : {}),
        "recharges.$.paidAt": paidAt,
      },
      $inc: {
        creditBalance: row.credits,
        totalRecharged: row.credits,
      },
      $push: {
        ledger: {
          $each: [
            {
              type: "recharge" as const,
              credits: row.credits,
              balanceAfter: wallet.creditBalance + row.credits,
              note: `Razorpay ${paymentId}`,
              refId: orderId,
              at: paidAt,
            },
          ],
          $slice: -200,
        },
      },
    },
    { new: true },
  );

  if (!credited) {
    const latest = opts.userId
      ? await SnapGradeWallet.findOne({ user: opts.userId })
      : await SnapGradeWallet.findOne({ "recharges.razorpayOrderId": orderId });
    const paid = latest?.recharges.find(
      (r: SnapGradeRecharge) =>
        r.razorpayOrderId === orderId && r.status === "paid",
    );
    if (paid && latest) {
      return {
        alreadyApplied: true as const,
        creditBalance: latest.creditBalance,
        credits: paid.credits,
      };
    }
    return { error: "Could not apply credits", code: "APPLY_FAILED" as const };
  }

  return {
    alreadyApplied: false as const,
    creditBalance: credited.creditBalance,
    credits: row.credits,
  };
}

export function verifyWebhookSignature(
  rawBody: Buffer | string,
  signature: string | undefined,
): boolean {
  const secret = config.razorpay.webhookSecret;
  if (!secret || !signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(typeof rawBody === "string" ? rawBody : rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
  } catch {
    return false;
  }
}

export async function handleRazorpayWebhookPayload(payload: {
  event?: string;
  id?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
        notes?: { userId?: string; purpose?: string };
      };
    };
  };
}) {
  const event = String(payload.event || "");
  if (event !== "payment.captured" && event !== "order.paid") {
    return { ignored: true as const };
  }

  const payment = payload.payload?.payment?.entity;
  const orderId = String(payment?.order_id || "");
  const paymentId = String(payment?.id || "");
  if (!orderId || !paymentId) {
    return { error: "Malformed webhook", code: "BAD_WEBHOOK" as const };
  }

  // Only Snap & Grade orders (notes set on create)
  const purpose = payment?.notes?.purpose;
  if (purpose && purpose !== "snap_grade_credits") {
    return { ignored: true as const };
  }

  return applyPaidRecharge({
    userId: payment?.notes?.userId,
    orderId,
    paymentId,
    webhookEventId: payload.id,
    skipSignature: true, // webhook HMAC already verified
  });
}
