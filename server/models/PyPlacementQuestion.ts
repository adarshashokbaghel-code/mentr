import mongoose, { Document, Schema } from "mongoose";

/** Path to Intermediate — exclusive question bank (200 items). */
export interface IPyPlacementQuestion extends Document {
  questionId: string;
  topic: number;
  type: "mcq" | "predict";
  prompt: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pyPlacementQuestionSchema = new Schema<IPyPlacementQuestion>(
  {
    questionId: { type: String, required: true, unique: true, trim: true, index: true },
    topic: { type: Number, required: true, min: 1, max: 9, index: true },
    type: { type: String, enum: ["mcq", "predict"], required: true },
    prompt: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
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
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

export const PyPlacementQuestion =
  mongoose.models.PyPlacementQuestion ||
  mongoose.model<IPyPlacementQuestion>("PyPlacementQuestion", pyPlacementQuestionSchema);
