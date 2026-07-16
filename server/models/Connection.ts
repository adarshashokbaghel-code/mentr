import mongoose, { Document, Schema, Types } from "mongoose";

export const CONNECTION_STATUSES = ["pending", "accepted", "declined"] as const;
export type ConnectionStatus = (typeof CONNECTION_STATUSES)[number];

export const CONNECTION_INITIATORS = ["parent", "teacher"] as const;
export type ConnectionInitiator = (typeof CONNECTION_INITIATORS)[number];

/**
 * A request to connect between a parent and a teacher. Two ways in:
 *
 *  - requestedBy "parent"  — parent asks a teacher directly; the teacher
 *    accepts/declines.
 *  - requestedBy "teacher" — teacher responds to a parent's posted
 *    requirement; the parent accepts/declines.
 *
 * Either way, the teacher's WhatsApp number is only revealed to the parent
 * once the connection is accepted. Parents' numbers are never shared.
 */
export interface IConnection extends Document {
  parent: Types.ObjectId;
  teacher: Types.ObjectId;
  /** Compulsory intro message the recipient reviews before accepting */
  message: string;
  status: ConnectionStatus;
  /** Who sent the request — decides who gets to accept it */
  requestedBy: ConnectionInitiator;
  /** Set when the request came from a requirement-board post */
  requirement?: Types.ObjectId;
  /* Denormalized for fast list rendering (same pattern as ProfileView) */
  parentName: string;
  parentArea?: string;
  teacherName: string;
  teacherArea?: string;
  respondedAt?: Date;
  /** Last board pitch that counts toward the daily quota (IST midnight reset) */
  lastPitchAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema = new Schema<IConnection>(
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
    message: { type: String, required: true, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: CONNECTION_STATUSES,
      default: "pending",
    },
    requestedBy: {
      type: String,
      enum: CONNECTION_INITIATORS,
      default: "parent",
    },
    requirement: {
      type: Schema.Types.ObjectId,
      ref: "Requirement",
      required: false,
    },
    parentName: { type: String, required: true, trim: true },
    parentArea: { type: String, trim: true },
    teacherName: { type: String, required: true, trim: true },
    teacherArea: { type: String, trim: true },
    respondedAt: { type: Date },
    lastPitchAt: { type: Date },
  },
  { timestamps: true },
);

// One request thread per parent-teacher pair; re-requests update it.
connectionSchema.index({ parent: 1, teacher: 1 }, { unique: true });
connectionSchema.index({ teacher: 1, status: 1, createdAt: -1 });
connectionSchema.index({ parent: 1, updatedAt: -1 });
// Teacher daily interest rate-limit lookups
connectionSchema.index({ teacher: 1, requestedBy: 1, createdAt: -1 });
connectionSchema.index({ teacher: 1, lastPitchAt: -1 });

export const Connection =
  mongoose.models.Connection ||
  mongoose.model<IConnection>("Connection", connectionSchema);
