/**
 * One-off: backfill 2-month Premium for anan@gmail.com (testing).
 * Run: npx tsx scripts/backfill-anan-premium.mts
 */
import crypto from "crypto";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!uri) {
  console.error("Missing MONGODB_URI");
  process.exit(1);
}

function withDb(raw: string): string {
  const [basePart, query] = raw.split("?");
  const base = basePart!.replace(/\/$/, "");
  if (base.includes("/champs")) return raw;
  return query ? `${base}/champs?${query}` : `${base}/champs`;
}

async function main() {
  await mongoose.connect(withDb(uri!));
  const users = mongoose.connection.collection("users");
  const email = "anan@gmail.com";
  const u = await users.findOne({ email });
  if (!u) {
    console.error("User not found:", email);
    process.exit(1);
  }

  const now = new Date();
  const expires = new Date(now);
  expires.setMonth(expires.getMonth() + 2);

  const listInr = 898;
  const payInr = 898;
  const amountPaise = payInr * 100;
  const receiptNumber = `MP-TEST-${String(u._id).slice(-4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const orderId = `order_test_${crypto.randomBytes(6).toString("hex")}`;
  const paymentId = `pay_test_${crypto.randomBytes(6).toString("hex")}`;

  const payment = {
    receiptNumber,
    razorpayOrderId: orderId,
    razorpayPaymentId: paymentId,
    status: "paid" as const,
    months: 2,
    listInr,
    discountPercent: 0,
    discountInr: 0,
    amountInr: payInr,
    amountPaise,
    currency: "INR",
    usdPerMonth: 5,
    listUsd: 10,
    usdToInr: 89.8,
    periodStart: now,
    periodEnd: expires,
    method: "upi",
    email,
    createdAt: now,
    paidAt: now,
    razorpaySnapshot: {
      id: paymentId,
      order_id: orderId,
      amount: amountPaise,
      currency: "INR",
      status: "captured",
      method: "upi",
      email,
      captured: true,
      note: "test_backfill",
    },
  };

  const result = await users.updateOne(
    { _id: u._id },
    {
      $set: {
        premiumMentorStatus: "verified",
        premiumMentorVerifiedAt: now,
        mentrPremium: {
          type: "premium",
          firstRechargedAt: now,
          lastPurchasedAt: now,
          expiresAt: expires,
          currentPlanMonths: 2,
          lastReceiptNumber: receiptNumber,
          lastRazorpayPaymentId: paymentId,
        },
        premiumPayments: [payment],
      },
      $unset: {
        premiumMentorPaymentSsUrl: "",
        premiumMentorPaymentSsPath: "",
        premiumMentorSubmittedAt: "",
      },
    },
  );

  const fresh = await users.findOne(
    { _id: u._id },
    {
      projection: {
        email: 1,
        premiumMentorStatus: 1,
        mentrPremium: 1,
        "premiumPayments.receiptNumber": 1,
        "premiumPayments.status": 1,
        "premiumPayments.months": 1,
        "premiumPayments.amountInr": 1,
        "premiumPayments.periodEnd": 1,
      },
    },
  );

  console.log(
    JSON.stringify(
      { matched: result.matchedCount, modified: result.modifiedCount, fresh },
      null,
      2,
    ),
  );
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
