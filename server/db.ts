import mongoose from "mongoose";
import { getMongoUriWithDb } from "./config";
import { Connection } from "./models/Connection";
import { OtpSession } from "./models/OtpSession";
import { Requirement } from "./models/Requirement";
import { User } from "./models/User";

let isConnected = false;
let connectPromise: Promise<void> | null = null;

async function syncIndexesOnce(): Promise<void> {
  try {
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

export async function connectDb(): Promise<void> {
  if (isConnected) return;

  if (!connectPromise) {
    const uri = getMongoUriWithDb();
    connectPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 8_000,
        connectTimeoutMS: 8_000,
        maxPoolSize: 10,
      })
      .then(async () => {
        isConnected = true;
        console.log("MongoDB connected → champs database");

        // Index reconciliation is slow on serverless cold starts — dev only.
        if (process.env.VERCEL !== "1") {
          void syncIndexesOnce();
        }
      })
      .finally(() => {
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
