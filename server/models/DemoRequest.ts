import mongoose, { Document, Schema, Types } from "mongoose";

export const DEMO_STATUSES = ["pending", "accepted", "declined"] as const;
export type DemoStatus = (typeof DEMO_STATUSES)[number];

/**
 * Online demo booked by a logged-in parent for one tutor.
 * The parent's phone is visible to that tutor as soon as the form is sent.
 * Accept / decline only records the tutor's decision — it does not unlock the number.
 */
export interface IDemoRequest extends Document {
  parent: Types.ObjectId;
  teacher: Types.ObjectId;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentCity?: string;
  parentArea?: string;
  teacherName: string;
  subject: string;
  classLevel: string;
  board?: string;
  /** Calendar date YYYY-MM-DD, as the parent picked it */
  preferredDate: string;
  preferredTime: string;
  /** Always online — demos are not home visits */
  mode: "online";
  note: string;
  status: DemoStatus;
  tutorNote: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const demoRequestSchema = new Schema<IDemoRequest>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    parentName: { type: String, required: true, trim: true },
    parentPhone: { type: String, required: true, trim: true },
    parentEmail: { type: String, required: true, trim: true, lowercase: true },
    parentCity: { type: String, trim: true },
    parentArea: { type: String, trim: true },
    teacherName: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 80 },
    classLevel: { type: String, required: true, trim: true, maxlength: 40 },
    board: { type: String, trim: true, maxlength: 40 },
    preferredDate: { type: String, required: true, trim: true },
    preferredTime: { type: String, required: true, trim: true, maxlength: 40 },
    mode: { type: String, enum: ["online"], default: "online" },
    note: { type: String, trim: true, maxlength: 500, default: "" },
    status: { type: String, enum: DEMO_STATUSES, default: "pending" },
    tutorNote: { type: String, trim: true, maxlength: 500, default: "" },
    respondedAt: { type: Date },
  },
  { timestamps: true },
);

demoRequestSchema.index({ teacher: 1, status: 1, createdAt: -1 });
demoRequestSchema.index({ parent: 1, createdAt: -1 });

export const DemoRequest =
  mongoose.models.DemoRequest ||
  mongoose.model<IDemoRequest>("DemoRequest", demoRequestSchema);
