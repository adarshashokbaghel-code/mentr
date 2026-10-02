import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(/* turbopackIgnore: true */ process.cwd(), ".env"),
});

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function positiveIntEnv(key: string, fallback: number): number {
  const n = parseInt(process.env[key] || "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function mongoUriFromEnv(): string {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error(
      "Missing required environment variable: MONGODB_URI (or MONGO_URI)",
    );
  }
  return uri;
}

function isGmailUser(user = process.env.EMAIL_USER || ""): boolean {
  return /@gmail\.com$/i.test(user);
}

/** Gmail while EMAIL_USER is a Gmail address. hello@mentr.in falls back to GoDaddy. */
function smtpFromEnv(): { host: string; port: number; secure: boolean } {
  if (isGmailUser()) {
    return { host: "smtp.gmail.com", port: 465, secure: true };
  }
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  return {
    host: process.env.SMTP_HOST || "smtpout.secureserver.net",
    port,
    secure: (process.env.SMTP_SECURE ?? String(port === 465)) === "true",
  };
}

export const config = {
  port: parseInt(process.env.BACKEND_PORT || "5000", 10),
  mongoUri: mongoUriFromEnv(),
  jwtSecret: requireEnv("JWT_SECRET"),
  emailUser: requireEnv("EMAIL_USER"),
  // Gmail app passwords are shown with spaces; other providers' passwords may contain real ones.
  emailPass: isGmailUser()
    ? requireEnv("EMAIL_PASS").replace(/\s/g, "")
    : requireEnv("EMAIL_PASS"),
  smtp: smtpFromEnv(),
  emailFromName: process.env.EMAIL_FROM_NAME || "Mentr by Paprly",
  frontendUrl:
    process.env.VERCEL === "1"
      ? "https://mentr.in"
      : process.env.FRONTEND_URL || "http://localhost:3000",
  /** Public-facing site URL for emails and referral links — never localhost. */
  publicSiteUrl: "https://mentr.in",
  cookieName: "champs_token",
  otp: {
    length: 6,
    expiryMinutes: 10,
    maxAttempts: 5,
    resendCooldownSeconds: 60,
    /** Per email, not global. Other people logging in at the same time do not share this. */
    maxSendsPerHour: positiveIntEnv("OTP_MAX_SENDS_PER_HOUR", 5),
    /** Session rows are kept this long for rate-limit accounting, then TTL-purged. */
    retentionMinutes: 60,
    /** Shared-network cap (one office / school wifi). Each address is counted on its own. */
    ipWindowMinutes: positiveIntEnv("OTP_IP_WINDOW_MINUTES", 15),
    ipMaxSends: positiveIntEnv("OTP_IP_MAX_SENDS", 300),
    ipMaxVerifies: positiveIntEnv("OTP_IP_MAX_VERIFIES", 1000),
  },
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "60d",
  /** Cookie max-age aligned with JWT — users stay logged in ~60 days. */
  jwtMaxAgeMs: 60 * 24 * 60 * 60 * 1000,
  /** Set ADMIN_SECRET_KEY in .env — access panel at /admin/[key] */
  adminSecretKey: process.env.ADMIN_SECRET_KEY || "",
  /** Password required for admin write actions (delete, send mail, etc.) */
  adminPass: process.env.ADMIN_PASS || "",
  /** Prefer gpt-4o for Snap & Grade vision marking; IC can stay on mini */
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiIcModel: process.env.OPENAI_IC_MODEL || "gpt-4o-mini",
  /**
   * Snap & Grade low-cost defaults: local Tesseract OCR + mini for
   * vision fallback / marking. Override with env if you need gpt-4o.
   */
  openaiSnapGradeModel: process.env.OPENAI_SNAP_GRADE_MODEL || "gpt-4o-mini",
  openaiSnapGradeOcrModel:
    process.env.OPENAI_SNAP_GRADE_OCR_MODEL ||
    process.env.OPENAI_SNAP_GRADE_MODEL ||
    "gpt-4o-mini",
  /**
   * Snap & Grade Razorpay (live). Prefer RAZORPAY_LIVE_* ;
   * webhook secret from Razorpay Dashboard → Webhooks.
   */
  razorpay: {
    keyId:
      process.env.RAZORPAY_LIVE_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      "",
    keySecret:
      process.env.RAZORPAY_LIVE_KEY_SECRET ||
      process.env.RAZORPAY_KEY_SECRET ||
      "",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
    /** Set only after Razorpay approves International Payments + USD (MCC). */
    internationalEnabled: process.env.RAZORPAY_INTERNATIONAL_ENABLED === "true",
    /** Paise per credit (default ₹1 = 100). */
    creditPaise: Math.max(
      1,
      parseInt(process.env.SNAP_GRADE_CREDIT_PAISE || "100", 10) || 100,
    ),
  },
};

export function getMongoUriWithDb(): string {
  const uri = config.mongoUri;
  if (uri.includes("/champs")) return uri;
  const [base, query] = uri.split("?");
  const normalized = base.endsWith("/") ? base.slice(0, -1) : base;
  return query ? `${normalized}/champs?${query}` : `${normalized}/champs`;
}
