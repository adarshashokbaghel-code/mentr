import mongoose, { Document, Schema } from "mongoose";

/**
 * Canonical Learn lesson row — one per module chapter.
 * `videoId` is the stable public id used by quiz questions + LMS player.
 */
export interface ILearnLesson extends Document {
  videoId: string;
  moduleId: string;
  title: string;
  unitId: string;
  unitTitle: string;
  trackId: "cs" | "ai" | "math";
  chapterLabel: string;
  level: "Easy" | "Building" | "Stretch" | "Apply";
  videoSrc: string;
  captionsSrc: string;
  durationSec: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

const learnLessonSchema = new Schema<ILearnLesson>(
  {
    videoId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    moduleId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    unitId: { type: String, required: true, trim: true },
    unitTitle: { type: String, required: true, trim: true },
    trackId: {
      type: String,
      enum: ["cs", "ai", "math"],
      required: true,
      index: true,
    },
    chapterLabel: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["Easy", "Building", "Stretch", "Apply"],
      required: true,
    },
    videoSrc: { type: String, required: true, trim: true },
    captionsSrc: { type: String, required: true, trim: true },
    durationSec: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
  },
  { timestamps: true },
);

export const LearnLesson =
  mongoose.models.LearnLesson ||
  mongoose.model<ILearnLesson>("LearnLesson", learnLessonSchema);
