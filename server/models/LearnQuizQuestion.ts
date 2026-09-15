import mongoose, { Document, Schema, Types } from "mongoose";

export type LearnQuizDifficulty = "easy" | "medium" | "hard";
export type LearnQuizType = "mcq" | "true_false";

/**
 * Production quiz item — always keyed to a lesson video.
 * LMS loads by moduleId / videoId after Watch stage.
 */
export interface ILearnQuizQuestion extends Document {
  questionId: string;
  videoId: string;
  moduleId: string;
  lesson?: Types.ObjectId;
  difficulty: LearnQuizDifficulty;
  type: LearnQuizType;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const learnQuizQuestionSchema = new Schema<ILearnQuizQuestion>(
  {
    questionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    videoId: { type: String, required: true, trim: true, index: true },
    moduleId: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    lesson: { type: Schema.Types.ObjectId, ref: "LearnLesson" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["mcq", "true_false"],
      default: "mcq",
      required: true,
    },
    prompt: { type: String, required: true, trim: true },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length >= 2 && v.length <= 6,
        message: "options must have 2–6 choices",
      },
    },
    correctIndex: { type: Number, required: true, min: 0 },
    explanation: { type: String, required: true, trim: true },
    sortOrder: { type: Number, required: true, min: 1 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

learnQuizQuestionSchema.index({ videoId: 1, sortOrder: 1 });
learnQuizQuestionSchema.index({ moduleId: 1, active: 1, sortOrder: 1 });
learnQuizQuestionSchema.index(
  { moduleId: 1, questionId: 1 },
  { unique: true },
);

export const LearnQuizQuestion =
  mongoose.models.LearnQuizQuestion ||
  mongoose.model<ILearnQuizQuestion>(
    "LearnQuizQuestion",
    learnQuizQuestionSchema,
  );
