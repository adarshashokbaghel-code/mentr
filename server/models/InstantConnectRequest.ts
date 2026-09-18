import mongoose, { Document, Schema, Types } from "mongoose";

export const IC_LOOKING_FOR = ["tutor", "mentor", "either"] as const;
export type IcLookingFor = (typeof IC_LOOKING_FOR)[number];

export const IC_MODES = ["online", "offline", "either"] as const;
export type IcMode = (typeof IC_MODES)[number];

export const IC_STATUSES = ["active", "closed", "expired"] as const;
export type IcStatus = (typeof IC_STATUSES)[number];

export const IC_PREFERRED_TIMES = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
  "Flexible",
] as const;
export type IcPreferredTime = (typeof IC_PREFERRED_TIMES)[number];

/** Instant Connect request — parent phone shared only while active & unexpired. */
export interface IInstantConnectRequest extends Document {
  _id: Types.ObjectId;
  parentId: Types.ObjectId;
  lookingFor: IcLookingFor;
  classLevel: string;
  subject: string;
  board: string;
  mode: IcMode;
  location?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredTime?: string;
  message?: string;
  matchedTutorIds: Types.ObjectId[];
  selectedTutorIds: Types.ObjectId[];
  notifiedTutorIds: Types.ObjectId[];
  status: IcStatus;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  expiresAt: Date;
  closedBy?: "parent" | "system";
}

const instantConnectRequestSchema = new Schema<IInstantConnectRequest>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lookingFor: {
      type: String,
      enum: IC_LOOKING_FOR,
      required: true,
    },
    classLevel: { type: String, required: true, trim: true, maxlength: 40 },
    subject: { type: String, required: true, trim: true, maxlength: 60 },
    board: { type: String, required: true, trim: true, maxlength: 40 },
    mode: { type: String, enum: IC_MODES, required: true },
    location: { type: String, trim: true, maxlength: 120 },
    budgetMin: { type: Number, min: 0, max: 100000 },
    budgetMax: { type: Number, min: 0, max: 100000 },
    preferredTime: { type: String, trim: true, maxlength: 40 },
    message: { type: String, trim: true, maxlength: 500 },
    matchedTutorIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    selectedTutorIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    notifiedTutorIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    status: {
      type: String,
      enum: IC_STATUSES,
      default: "active",
      index: true,
    },
    closedAt: { type: Date },
    expiresAt: { type: Date, required: true, index: true },
    closedBy: { type: String, enum: ["parent", "system"] },
  },
  { timestamps: true },
);

instantConnectRequestSchema.index({ parentId: 1, createdAt: -1 });
instantConnectRequestSchema.index({ selectedTutorIds: 1, status: 1, createdAt: -1 });
instantConnectRequestSchema.index({ status: 1, expiresAt: 1 });

export const InstantConnectRequest =
  mongoose.models.InstantConnectRequest ||
  mongoose.model<IInstantConnectRequest>(
    "InstantConnectRequest",
    instantConnectRequestSchema,
  );

export const IC_TTL_MS = 48 * 60 * 60 * 1000;
