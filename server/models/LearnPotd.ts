import mongoose, { Document, Schema } from "mongoose";

/**
 * Problem of the Day bank — 70 items, rotate by dayIndex % 70.
 */
export interface ILearnPotd extends Document {
  potdId: string;
  dayIndex: number;
  moduleId: string;
  trackId: "cs" | "ai" | "math";
  title: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const learnPotdSchema = new Schema<ILearnPotd>(
  {
    potdId: { type: String, required: true, unique: true, trim: true },
    dayIndex: { type: Number, required: true, unique: true, min: 0, max: 69 },
    moduleId: { type: String, required: true, uppercase: true, trim: true },
    trackId: { type: String, enum: ["cs", "ai", "math"], required: true },
    title: { type: String, required: true, trim: true },
    prompt: { type: String, required: true, trim: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true, min: 0 },
    explanation: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

learnPotdSchema.index({ dayIndex: 1, active: 1 });

export const LearnPotd =
  mongoose.models.LearnPotd ||
  mongoose.model<ILearnPotd>("LearnPotd", learnPotdSchema);

export const POTD_CYCLE = 70;

export function potdDayIndexForDate(date = new Date()): number {
  const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const epoch = Date.UTC(2026, 0, 1);
  const days = Math.floor((utc - epoch) / 86_400_000);
  return ((days % POTD_CYCLE) + POTD_CYCLE) % POTD_CYCLE;
}
