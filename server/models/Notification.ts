import mongoose, { Document, Schema, Types } from "mongoose";

export const PARENT_NOTIFICATION_TYPES = [
  "connection_accepted",
  "connection_declined",
  "requirement_pitch",
  "teacher_outreach",
  "tutor_slots_open",
] as const;

export type ParentNotificationType = (typeof PARENT_NOTIFICATION_TYPES)[number];

export interface INotificationMeta {
  teacherId?: string;
  teacherName?: string;
  requirementId?: string;
  subject?: string;
  classLevel?: string;
  connectionId?: string;
  openSlots?: number;
}

export interface INotification extends Document {
  user: Types.ObjectId;
  type: ParentNotificationType;
  title: string;
  body: string;
  href?: string;
  meta: INotificationMeta;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: PARENT_NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    href: { type: String, trim: true },
    meta: {
      type: {
        teacherId: String,
        teacherName: String,
        requirementId: String,
        subject: String,
        classLevel: String,
        connectionId: String,
        openSlots: Number,
      },
      default: {},
    },
    readAt: { type: Date },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, readAt: 1, createdAt: -1 });
notificationSchema.index(
  { user: 1, type: 1, "meta.connectionId": 1 },
  { sparse: true },
);

export const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", notificationSchema);
