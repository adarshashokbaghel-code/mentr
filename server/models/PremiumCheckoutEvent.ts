import mongoose, { Document, Schema, Types } from "mongoose";

export const PREMIUM_CHECKOUT_EVENTS = [
  "opened",
  "pay_clicked",
  "dismissed",
  "failed",
  "paid",
] as const;

export type PremiumCheckoutEventType = (typeof PREMIUM_CHECKOUT_EVENTS)[number];

/** Premium checkout funnel — used by admin to follow up on abandoned checkouts. */
export interface IPremiumCheckoutEvent extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  event: PremiumCheckoutEventType;
  role: string;
  name?: string;
  email?: string;
  phone?: string;
  months?: number;
  currency?: string;
  orderId?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const premiumCheckoutEventSchema = new Schema<IPremiumCheckoutEvent>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    event: { type: String, enum: PREMIUM_CHECKOUT_EVENTS, required: true },
    role: { type: String, required: true, trim: true },
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    months: { type: Number, min: 1, max: 12 },
    currency: { type: String, trim: true },
    orderId: { type: String, trim: true },
    source: { type: String, trim: true, maxlength: 200 },
  },
  { timestamps: true },
);

premiumCheckoutEventSchema.index({ createdAt: -1 });
premiumCheckoutEventSchema.index({ user: 1, createdAt: -1 });

export const PremiumCheckoutEvent =
  mongoose.models.PremiumCheckoutEvent ||
  mongoose.model<IPremiumCheckoutEvent>(
    "PremiumCheckoutEvent",
    premiumCheckoutEventSchema,
  );
