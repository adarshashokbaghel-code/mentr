import mongoose, { Document, Schema, Types } from "mongoose";
import { TEACHING_MODES, type TeachingMode } from "./User";

export const REQUIREMENT_STATUSES = ["open", "closed"] as const;
export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number];

export const START_TIMELINES = [
  "immediately",
  "within_week",
  "within_month",
  "flexible",
] as const;
export type StartTimeline = (typeof START_TIMELINES)[number];

/**
 * How long a post stays on the board depends on how soon the parent wants
 * to start — urgent needs expire fast, flexible ones linger.
 */
export const TIMELINE_TTL_DAYS: Record<StartTimeline, number> = {
  immediately: 3,
  within_week: 7,
  within_month: 14,
  flexible: 14,
};

/** A parent can have at most this many open posts at once. */
export const MAX_OPEN_REQUIREMENTS = 3;

/**
 * A parent's learning need, posted anonymously to the tutor board.
 * Tutors express interest via a Connection (requestedBy: "teacher");
 * the parent's name/contact is never exposed on the board itself.
 */
export interface IRequirement extends Document {
  _id: Types.ObjectId;
  parent: Types.ObjectId;
  subject: string;
  classLevel: string;
  city: string;
  /** Locality only — never a street address */
  area: string;
  modes: TeachingMode[];
  budgetMin?: number;
  budgetMax?: number;
  /** What the parent actually needs — compulsory, like connect messages */
  details: string;
  /** How soon classes should start — drives the post's shelf life */
  startTimeline: StartTimeline;
  status: RequirementStatus;
  /** Board queries filter on this; expired posts simply stop showing */
  expiresAt: Date;
  /** Denormalized counter so board rows don't need an aggregate */
  interestCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const requirementSchema = new Schema<IRequirement>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: { type: String, required: true, trim: true, maxlength: 60 },
    classLevel: { type: String, required: true, trim: true, maxlength: 40 },
    city: { type: String, required: true, trim: true, maxlength: 60 },
    area: { type: String, required: true, trim: true, maxlength: 80 },
    modes: { type: [String], enum: TEACHING_MODES, default: [] },
    budgetMin: { type: Number, min: 0, max: 100000 },
    budgetMax: { type: Number, min: 0, max: 100000 },
    details: { type: String, required: true, trim: true, maxlength: 500 },
    startTimeline: {
      type: String,
      enum: START_TIMELINES,
      default: "flexible",
    },
    status: {
      type: String,
      enum: REQUIREMENT_STATUSES,
      default: "open",
    },
    expiresAt: { type: Date, required: true },
    interestCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

// Board: open, unexpired, newest first
requirementSchema.index({ status: 1, expiresAt: 1, createdAt: -1 });
requirementSchema.index({ parent: 1, createdAt: -1 });

export const Requirement =
  mongoose.models.Requirement ||
  mongoose.model<IRequirement>("Requirement", requirementSchema);
