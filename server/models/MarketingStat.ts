import mongoose, { Document, Schema } from "mongoose";

export type MarketingEventType = "view" | "redirect";
export type MarketingKind = "blog" | "page";

/**
 * One row per (slug, kind, event, visitor) — `count` bumps on repeats
 * so unique visitors stay compact while totals stay accurate.
 */
export interface IMarketingStat extends Document {
  slug: string;
  kind: MarketingKind;
  event: MarketingEventType;
  visitorId: string;
  path: string;
  href?: string;
  count: number;
  lastAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const marketingStatSchema = new Schema<IMarketingStat>(
  {
    slug: { type: String, required: true, trim: true, lowercase: true },
    kind: { type: String, enum: ["blog", "page"], required: true },
    event: { type: String, enum: ["view", "redirect"], required: true },
    visitorId: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    href: { type: String, trim: true },
    count: { type: Number, default: 1 },
    lastAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

marketingStatSchema.index(
  { slug: 1, kind: 1, event: 1, visitorId: 1 },
  { unique: true },
);
marketingStatSchema.index({ slug: 1, kind: 1, event: 1, lastAt: -1 });

export const MarketingStat =
  mongoose.models.MarketingStat ||
  mongoose.model<IMarketingStat>("MarketingStat", marketingStatSchema);
