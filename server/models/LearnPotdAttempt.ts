import mongoose, { Document, Schema, Types } from "mongoose";

/** Per-user POTD attempt keyed by calendar date (YYYY-MM-DD UTC). */
export interface ILearnPotdAttempt extends Document {
  user: Types.ObjectId;
  dateKey: string;
  potdId: string;
  dayIndex: number;
  selectedIndex: number;
  correct: boolean;
  attemptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const learnPotdAttemptSchema = new Schema<ILearnPotdAttempt>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    dateKey: { type: String, required: true, trim: true, index: true },
    potdId: { type: String, required: true, trim: true },
    dayIndex: { type: Number, required: true, min: 0 },
    selectedIndex: { type: Number, required: true, min: 0 },
    correct: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

learnPotdAttemptSchema.index({ user: 1, dateKey: 1 }, { unique: true });

export const LearnPotdAttempt =
  mongoose.models.LearnPotdAttempt ||
  mongoose.model<ILearnPotdAttempt>("LearnPotdAttempt", learnPotdAttemptSchema);
