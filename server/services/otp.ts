import crypto from "crypto";
import bcrypt from "bcryptjs";
import { config } from "../config";

export function generateOtpCode(): string {
  const max = 10 ** config.otp.length;
  const num = crypto.randomInt(0, max);
  return num.toString().padStart(config.otp.length, "0");
}

export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyOtp(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

/** How long an OTP code is accepted. */
export function getOtpExpiryDate(): Date {
  return new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);
}

/**
 * How long the session row is retained (for sends-per-hour accounting)
 * before Mongo's TTL monitor hard-deletes it.
 */
export function getOtpPurgeDate(): Date {
  return new Date(Date.now() + config.otp.retentionMinutes * 60 * 1000);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Pragmatic RFC 5321 validation: overall/local-part length caps, single @,
 * dot-separated domain labels, no leading/trailing/consecutive dots.
 */
const EMAIL_RE =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const at = email.lastIndexOf("@");
  if (at <= 0 || at > 64) return false; // local part 1–64 chars
  return EMAIL_RE.test(email);
}

export function isValidOtpCode(code: string): boolean {
  return new RegExp(`^\\d{${config.otp.length}}$`).test(code);
}
