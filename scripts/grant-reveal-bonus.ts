/**
 * Grant +N parent-reveal bonus credits to a mentor by email.
 *
 * Run: npx tsx scripts/grant-reveal-bonus.ts amaan.rizvi.legal@gmail.com
 *      npx tsx scripts/grant-reveal-bonus.ts amaan.rizvi.legal 1
 */
import "dotenv/config";
import { connectDb, disconnectDb } from "../server/db";
import { User } from "../server/models/User";

async function main() {
  const raw = String(process.argv[2] || "").trim().toLowerCase();
  const amount = Math.max(1, Number(process.argv[3] || 1) || 1);
  if (!raw) {
    console.error("Usage: npx tsx scripts/grant-reveal-bonus.ts <email-or-prefix> [amount]");
    process.exit(1);
  }

  await connectDb();
  try {
    const emailQuery = raw.includes("@")
      ? raw
      : { $regex: new RegExp(`^${raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i") };

    const users = await User.find(
      typeof emailQuery === "string"
        ? { email: emailQuery }
        : { email: emailQuery },
    )
      .select("email role parentRevealBonusCredits mentrPremium")
      .limit(10);

    if (users.length === 0) {
      console.error(`No user found matching: ${raw}`);
      process.exit(1);
    }
    if (users.length > 1) {
      console.error(
        "Multiple matches — pass the full email:\n" +
          users.map((u) => `  - ${u.email}`).join("\n"),
      );
      process.exit(1);
    }

    const user = users[0]!;
    const before = Number(user.parentRevealBonusCredits || 0);
    user.parentRevealBonusCredits = before + amount;
    await user.save();

    console.log(
      `Granted +${amount} reveal credit to ${user.email} (role=${user.role}). Bonus: ${before} → ${user.parentRevealBonusCredits}`,
    );
  } finally {
    await disconnectDb();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
