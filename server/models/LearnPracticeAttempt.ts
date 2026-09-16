import mongoose, { Document, Schema, Types } from "mongoose";

/** One practice answer per user per question — locked forever after first try. */
export interface ILearnPracticeAttempt extends Document {
  user: Types.ObjectId;
  questionId: string;
  selectedIndex: number;
  correct: boolean;
  attemptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const learnPracticeAttemptSchema = new Schema<ILearnPracticeAttempt>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questionId: { type: String, required: true, trim: true, index: true },
    selectedIndex: { type: Number, required: true, min: 0 },
    correct: { type: Boolean, required: true },
    attemptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

learnPracticeAttemptSchema.index({ user: 1, questionId: 1 }, { unique: true });

export const LearnPracticeAttempt =
  mongoose.models.LearnPracticeAttempt ||
  mongoose.model<ILearnPracticeAttempt>(
    "LearnPracticeAttempt",
    learnPracticeAttemptSchema,
  );
