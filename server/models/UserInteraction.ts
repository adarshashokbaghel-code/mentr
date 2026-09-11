import mongoose, { Document, Schema } from "mongoose";

export const USER_INTERACTION_TYPES = [
  "general",
  "feature",
  "bug",
  "review",
  "parent-help",
  "tutor-help",
  "partnership",
  "safety",
] as const;

export const USER_INTERACTION_ROLES = [
  "parent",
  "tutor",
  "student",
  "other",
] as const;

export interface IUserInteraction extends Document {
  name: string;
  email: string;
  city: string;
  country: string;
  role: (typeof USER_INTERACTION_ROLES)[number];
  feedbackType: (typeof USER_INTERACTION_TYPES)[number];
  feedback: string;
  featureTitle?: string;
  featureDescription?: string;
  rating?: number;
  review?: string;
  page: string;
  createdAt: Date;
  updatedAt: Date;
}

const userInteractionSchema = new Schema<IUserInteraction>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, default: "India", trim: true },
    role: { type: String, enum: USER_INTERACTION_ROLES, required: true },
    feedbackType: { type: String, enum: USER_INTERACTION_TYPES, required: true },
    feedback: { type: String, required: true, trim: true },
    featureTitle: { type: String, trim: true },
    featureDescription: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String, trim: true },
    page: { type: String, default: "/contact", trim: true },
  },
  { timestamps: true },
);

userInteractionSchema.index({ createdAt: -1 });
userInteractionSchema.index({ feedbackType: 1, createdAt: -1 });
userInteractionSchema.index({ rating: 1 });

export const UserInteraction =
  mongoose.models.UserInteraction ||
  mongoose.model<IUserInteraction>("UserInteraction", userInteractionSchema);
