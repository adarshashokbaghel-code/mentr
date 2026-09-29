import mongoose, { Document, Schema, Types } from "mongoose";

export const COUPON_USAGE_EVENTS = ["applied", "rejected", "redeemed"] as const;
export type CouponUsageEvent = (typeof COUPON_USAGE_EVENTS)[number];

/**
 * Audit trail of every time a mentor enters a real coupon code:
 * - applied: code was valid for the chosen plan (quote shown)
 * - rejected: code exists but was not usable (reason stored)
 * - redeemed: payment captured with the code (one per order)
 */
export interface ICouponUsage extends Document {
  _id: Types.ObjectId;
  coupon: Types.ObjectId;
  code: string;
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
  updatedAt: Date;
}

const couponUsageSchema = new Schema<ICouponUsage>(
  {
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon", required: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    email: { type: String, trim: true },
    name: { type: String, trim: true },
    event: { type: String, enum: COUPON_USAGE_EVENTS, required: true },
    reason: { type: String, trim: true, maxlength: 60 },
    months: { type: Number, min: 1, max: 12 },
    planPayInr: { type: Number, min: 0 },
    discountInr: { type: Number, min: 0 },
    finalInr: { type: Number, min: 0 },
    orderId: { type: String, trim: true },
    paymentId: { type: String, trim: true },
  },
  { timestamps: true },
);

couponUsageSchema.index({ coupon: 1, createdAt: -1 });
couponUsageSchema.index({ coupon: 1, event: 1, user: 1 });
/** A captured order can only ever count as one redemption (verify + webhook race). */
couponUsageSchema.index(
  { orderId: 1 },
  { unique: true, partialFilterExpression: { event: "redeemed" } },
);

export const CouponUsage =
  mongoose.models.CouponUsage ||
  mongoose.model<ICouponUsage>("CouponUsage", couponUsageSchema);
