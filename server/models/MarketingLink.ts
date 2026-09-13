import mongoose, { Document, Schema } from "mongoose";

export const SOCIAL_LINK_CHANNELS = ["instagram", "linkedin"] as const;
export type SocialLinkChannel = (typeof SOCIAL_LINK_CHANNELS)[number];

export const SOCIAL_LINK_PATHS = [
  "/",
  "/parents",
  "/for-faculty",
  "/blog",
  "/search",
  "/parent/signup",
  "/faculty/signup",
  "/learn",
] as const;

export type SocialLinkPath = (typeof SOCIAL_LINK_PATHS)[number] | string;

/**
 * Admin-created trackable UTM links for a social post / story / reel.
 * `slug` is used as utm_campaign so signups attribute to this exact link.
 */
export interface IMarketingLink extends Document {
  channel: SocialLinkChannel;
  /** Unique campaign id, e.g. ig-hiring-reel-mar12 */
  slug: string;
  label: string;
  /** Landing path on mentr.in */
  path: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const marketingLinkSchema = new Schema<IMarketingLink>(
  {
    channel: {
      type: String,
      enum: SOCIAL_LINK_CHANNELS,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: { type: String, required: true, trim: true, maxlength: 120 },
    path: { type: String, required: true, trim: true },
    note: { type: String, trim: true, maxlength: 280 },
  },
  { timestamps: true },
);

marketingLinkSchema.index({ channel: 1, createdAt: -1 });

export const MarketingLink =
  mongoose.models.MarketingLink ||
  mongoose.model<IMarketingLink>("MarketingLink", marketingLinkSchema);
