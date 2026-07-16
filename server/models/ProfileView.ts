import mongoose, { Document, Schema, Types } from "mongoose";

/**
 * One row per (teacher, viewer) pair — `count` and `lastViewedAt` are
 * bumped on repeat visits, so "who saw my profile" stays compact.
 */
export interface IProfileView extends Document {
  teacher: Types.ObjectId;
  viewer: Types.ObjectId;
  viewerName: string;
  viewerArea?: string;
  count: number;
  lastViewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const profileViewSchema = new Schema<IProfileView>(
  {
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    viewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    viewerName: { type: String, required: true, trim: true },
    viewerArea: { type: String, trim: true },
    count: { type: Number, default: 1 },
    lastViewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

profileViewSchema.index({ teacher: 1, viewer: 1 }, { unique: true });
profileViewSchema.index({ teacher: 1, lastViewedAt: -1 });

export const ProfileView =
  mongoose.models.ProfileView ||
  mongoose.model<IProfileView>("ProfileView", profileViewSchema);
