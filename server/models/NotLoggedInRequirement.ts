import mongoose, { Document, Schema, Types } from "mongoose";

export const GUEST_REQUIREMENT_STATUSES = [
  "new",
  "not_interested",
  "got_hired",
] as const;
export type GuestRequirementStatus = (typeof GUEST_REQUIREMENT_STATUSES)[number];

export const GUEST_ACTIVITY_ACTIONS = [
  "created",
  "opened",
  "not_interested",
  "got_hired",
] as const;
export type GuestActivityAction = (typeof GUEST_ACTIVITY_ACTIONS)[number];

export interface IGuestActivity {
  action: GuestActivityAction;
  at: Date;
}

/**
 * Parent/student need sent to a Premium mentor without creating an account.
 * Contact is shared with that mentor; outcomes are tracked for admin.
 */
export interface INotLoggedInRequirement extends Document {
  _id: Types.ObjectId;
  teacher: Types.ObjectId;
  teacherName: string;
  name: string;
  email: string;
  phone: string;
  /** Short need line — e.g. "Class 10 Maths, weekends" */
  requirement: string;
  description: string;
  status: GuestRequirementStatus;
  activity: IGuestActivity[];
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const guestActivitySchema = new Schema<IGuestActivity>(
  {
    action: { type: String, enum: GUEST_ACTIVITY_ACTIONS, required: true },
    at: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const notLoggedInRequirementSchema = new Schema<INotLoggedInRequirement>(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    teacherName: { type: String, required: true, trim: true, maxlength: 80 },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    requirement: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: GUEST_REQUIREMENT_STATUSES,
      default: "new",
      index: true,
    },
    activity: { type: [guestActivitySchema], default: [] },
    respondedAt: { type: Date },
  },
  { timestamps: true },
);

notLoggedInRequirementSchema.index({ teacher: 1, createdAt: -1 });
notLoggedInRequirementSchema.index({ teacher: 1, status: 1, createdAt: -1 });
notLoggedInRequirementSchema.index({ createdAt: -1 });

export const NotLoggedInRequirement =
  mongoose.models.NotLoggedInRequirement ||
  mongoose.model<INotLoggedInRequirement>(
    "NotLoggedInRequirement",
    notLoggedInRequirementSchema,
    "not_loggedin_requirements",
  );
