import mongoose, { Document, Schema, Types } from "mongoose";

export const COUPON_PLAN_MONTHS = [2, 3, 4] as const;

/** Flat-rupee discount code for Premium Mentor checkout (INR only). */
export interface ICoupon extends Document {
  _id: Types.ObjectId;
  /** Uppercase, unique. What the mentor types at checkout. */
  code: string;
  /** Whole rupees taken off the plan price. */
  discountInr: number;
  description?: string;
  active: boolean;
  validFrom: Date;
  validUntil: Date;
  /** Plans the code works on. */
  planMonths: number[];
  /** Total paid redemptions allowed across all users. Unset = unlimited. */
  maxRedemptions?: number | null;
  /** Paid redemptions allowed per mentor. */
  perUserLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      minlength: 3,
      maxlength: 24,
      match: /^[A-Z0-9_-]+$/,
    },
    discountInr: { type: Number, required: true, min: 1, max: 100_000 },
    description: { type: String, trim: true, maxlength: 200 },
    active: { type: Boolean, default: true, index: true },
    validFrom: { type: Date, required: true },
    validUntil: { type: Date, required: true },
    planMonths: {
      type: [Number],
      default: [...COUPON_PLAN_MONTHS],
      validate: {
        validator: (v: number[]) =>
          Array.isArray(v) &&
          v.length > 0 &&
          v.every((m) => (COUPON_PLAN_MONTHS as readonly number[]).includes(m)),
        message: "planMonths must be a non-empty subset of 2, 3, 4",
      },
    },
    maxRedemptions: { type: Number, min: 1, default: null },
    perUserLimit: { type: Number, min: 1, max: 100, default: 1 },
  },
  { timestamps: true },
);

couponSchema.index({ createdAt: -1 });

export const Coupon =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", couponSchema);
