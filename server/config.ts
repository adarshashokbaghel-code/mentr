import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
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

export const config = {
  port: parseInt(process.env.BACKEND_PORT || "5000", 10),
  mongoUri: mongoUriFromEnv(),
  jwtSecret: requireEnv("JWT_SECRET"),
  emailUser: requireEnv("EMAIL_USER"),
  emailPass: requireEnv("EMAIL_PASS").replace(/\s/g, ""),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  cookieName: "champs_token",
  otp: {
    length: 6,
    expiryMinutes: 10,
    maxAttempts: 5,
    resendCooldownSeconds: 60,
    maxSendsPerHour: 5,
    /** Session rows are kept this long for rate-limit accounting, then TTL-purged. */
    retentionMinutes: 60,
  },
  jwtExpiresIn: "7d",
};

export function getMongoUriWithDb(): string {
  const uri = config.mongoUri;
  if (uri.includes("/champs")) return uri;
  const [base, query] = uri.split("?");
  const normalized = base.endsWith("/") ? base.slice(0, -1) : base;
  return query ? `${normalized}/champs?${query}` : `${normalized}/champs`;
}
