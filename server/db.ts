import mongoose from "mongoose";
import { getMongoUriWithDb } from "./config";
import { Connection } from "./models/Connection";
import { OtpSession } from "./models/OtpSession";
import { Requirement } from "./models/Requirement";
import { User } from "./models/User";

let isConnected = false;

export async function connectDb(): Promise<void> {
  if (isConnected) return;

  const uri = getMongoUriWithDb();
  await mongoose.connect(uri);
  isConnected = true;
  console.log("MongoDB connected → champs database");

  // Reconcile indexes with the schemas (drops stale ones, e.g. the old
  // expiresAt TTL index that would purge rows before rate-limit accounting).
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

export async function disconnectDb(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}
