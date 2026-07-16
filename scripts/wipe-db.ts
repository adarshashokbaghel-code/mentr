/**
 * Wipe every collection in the champs database for a clean test environment.
 *
 * Run: npm run db:wipe
 */
import "dotenv/config";
import { connectDb, disconnectDb } from "../server/db";
import { Connection } from "../server/models/Connection";
import { OtpSession } from "../server/models/OtpSession";
import { ProfileView } from "../server/models/ProfileView";
import { Requirement } from "../server/models/Requirement";
import { User } from "../server/models/User";

async function main() {
  if (!process.argv.includes("--confirm")) {
    console.error("Refusing to wipe without --confirm. Run: npm run db:wipe");
    process.exit(1);
  }

  await connectDb();

  const [users, connections, requirements, otps, views] = await Promise.all([
    User.deleteMany({}),
    Connection.deleteMany({}),
    Requirement.deleteMany({}),
    OtpSession.deleteMany({}),
    ProfileView.deleteMany({}),
  ]);

  console.log("Wiped champs database:");
  console.log(`  users:         ${users.deletedCount}`);
  console.log(`  connections:   ${connections.deletedCount}`);
  console.log(`  requirements:  ${requirements.deletedCount}`);
  console.log(`  otpsessions:   ${otps.deletedCount}`);
  console.log(`  profileviews:  ${views.deletedCount}`);

  await disconnectDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
