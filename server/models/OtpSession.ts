import mongoose, { Document, Schema } from "mongoose";
import { USER_ROLES, type UserRole } from "./User";

/**
 * One row per OTP send. Lifecycle:
 *  - created on send (previous active sessions for the email are consumed)
 *  - `expiresAt` bounds code validity (checked in the route)
 *  - `consumed` marks verified / superseded / burned sessions
 *  - Mongo TTL on `purgeAt` hard-deletes rows after the rate-limit window,
 *    so consumed rows still count toward the sends-per-hour cap until then.
 */
export interface IOtpSession extends Document {
  sessionId: string;
  email: string;
  otpHash: string;
  purpose: "login" | "signup";
  /** Role requested at send time — verify trusts this, not the client. */
  role: UserRole;
  attempts: number;
  expiresAt: Date;
  consumed: boolean;
  purgeAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSessionSchema = new Schema<IOtpSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true },
    purpose: { type: String, enum: ["login", "signup"], required: true },
    role: { type: String, enum: USER_ROLES, required: true },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    consumed: { type: Boolean, default: false },
    purgeAt: { type: Date, required: true },
  },
  { timestamps: true },
);

otpSessionSchema.index({ email: 1, consumed: 1, expiresAt: 1 });
otpSessionSchema.index({ email: 1, createdAt: 1 });
otpSessionSchema.index({ purgeAt: 1 }, { expireAfterSeconds: 0 });

export const OtpSession =
  mongoose.models.OtpSession ||
  mongoose.model<IOtpSession>("OtpSession", otpSessionSchema);
