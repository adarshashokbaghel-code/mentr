import mongoose from "mongoose";
import { randomBytes } from "crypto";
import { getMongoUriWithDb } from "./config";
import { Connection } from "./models/Connection";
import { OtpSession } from "./models/OtpSession";
import { Requirement } from "./models/Requirement";
import { User } from "./models/User";

let isConnected = false;
let connectPromise: Promise<void> | null = null;

function newShareToken(): string {
  return randomBytes(9).toString("base64url");
}

function isRetryableConnectError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: string }).code;
  return (
    code === "ESERVFAIL" ||
    code === "ENOTFOUND" ||
    code === "ETIMEDOUT" ||
    code === "ECONNREFUSED"
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Old requirements may lack shareToken — backfill before unique index sync. */
async function backfillRequirementShareTokens(): Promise<void> {
  const missing = await Requirement.find({
    $or: [
      { shareToken: null },
      { shareToken: { $exists: false } },
      { shareToken: "" },
    ],
  }).select("_id shareToken");

  for (const doc of missing) {
    doc.shareToken = newShareToken();
    await doc.save();
  }
}

async function syncIndexesOnce(): Promise<void> {
  try {
    await backfillRequirementShareTokens();
    try {
      await Requirement.collection.dropIndex("shareToken_1");
    } catch {
      /* index may not exist yet */
    }
    await Promise.all([
      OtpSession.syncIndexes(),
      User.syncIndexes(),
      Connection.syncIndexes(),
      Requirement.syncIndexes(),
    ]);
  } catch (err) {
    console.error("index sync failed:", err);
  }
}

async function connectOnce(): Promise<void> {
  const uri = getMongoUriWithDb();
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
    maxPoolSize: 10,
  });
  isConnected = true;
  console.log("MongoDB connected → champs database");

  if (process.env.VERCEL !== "1") {
    void syncIndexesOnce();
  }
}

export async function connectDb(): Promise<void> {
  if (isConnected) return;

  if (!connectPromise) {
    connectPromise = (async () => {
      const maxAttempts = 3;
      let lastError: unknown;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await connectOnce();
          return;
        } catch (err) {
          lastError = err;
          isConnected = false;
          if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect().catch(() => undefined);
          }
          if (attempt < maxAttempts && isRetryableConnectError(err)) {
            console.warn(
              `MongoDB connect attempt ${attempt} failed (${(err as Error).message}) — retrying…`,
            );
            await sleep(800 * attempt);
            continue;
          }
          throw err;
        }
      }

      throw lastError;
    })().finally(() => {
      connectPromise = null;
    });
  }

  await connectPromise;
}

export async function disconnectDb(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}
