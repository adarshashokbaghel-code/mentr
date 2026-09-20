import mongoose, { Document, Schema } from "mongoose";

/** Singleton site settings — featured landing tutors, etc. */
export interface ISiteSettings extends Document {
  key: string;
  /** Ordered faculty user IDs shown on homepage Featured section */
  featuredTeacherIds: string[];
  updatedAt: Date;
  createdAt: Date;
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main",
    },
    featuredTeacherIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export const SiteSettings =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", siteSettingsSchema);
