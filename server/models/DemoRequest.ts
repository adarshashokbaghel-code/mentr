import mongoose, { Document, Schema, Types } from "mongoose";

export const DEMO_STATUSES = ["pending", "proposed", "accepted", "declined"] as const;
export type DemoStatus = (typeof DEMO_STATUSES)[number];

export const DEMO_EVENTS = [
  "requested",
  "accepted",
  "declined",
  "proposed",
  "parent_accepted",
  "parent_declined",
] as const;
export type DemoEvent = (typeof DEMO_EVENTS)[number];

export interface IDemoHistoryEntry {
  by: "parent" | "tutor";
  action: DemoEvent;
  date?: string;
  time?: string;
  note?: string;
  at: Date;
}

/**
 * Online demo booked by a logged-in parent for one tutor.
 * The parent's phone is visible to that tutor as soon as the form is sent.
 * The tutor accepts, declines, or proposes another time; a proposal waits
 * on the parent ("proposed") until they accept or decline it.
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
  /** Set when booked from a pitch or match on the parent's post */
  requirement?: Types.ObjectId;
  subject: string;
  classLevel: string;
  board?: string;
  /** Calendar date YYYY-MM-DD. Becomes the agreed slot once confirmed. */
  preferredDate: string;
  preferredTime: string;
  /** Tutor's counter-offer while status is "proposed" */
  proposedDate?: string;
  proposedTime?: string;
  /** Always online — demos are not home visits */
  mode: "online";
  note: string;
  status: DemoStatus;
  tutorNote: string;
  respondedAt?: Date;
  declinedBy?: "parent" | "tutor";
  /** When both sides agreed on the slot */
  confirmedAt?: Date;
  history: IDemoHistoryEntry[];
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
    requirement: { type: Schema.Types.ObjectId, ref: "Requirement" },
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
    proposedDate: { type: String, trim: true },
    proposedTime: { type: String, trim: true, maxlength: 40 },
    declinedBy: { type: String, enum: ["parent", "tutor"] },
    confirmedAt: { type: Date },
    history: {
      type: [
        new Schema<IDemoHistoryEntry>(
          {
            by: { type: String, enum: ["parent", "tutor"], required: true },
            action: { type: String, enum: DEMO_EVENTS, required: true },
            date: { type: String, trim: true },
            time: { type: String, trim: true },
            note: { type: String, trim: true, maxlength: 500 },
            at: { type: Date, default: Date.now },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  { timestamps: true },
);

demoRequestSchema.index({ teacher: 1, status: 1, createdAt: -1 });
demoRequestSchema.index({ parent: 1, createdAt: -1 });

export const DemoRequest =
  mongoose.models.DemoRequest ||
  mongoose.model<IDemoRequest>("DemoRequest", demoRequestSchema);
