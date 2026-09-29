/**
 * Tag every parent with a board for the mentor parent list:
 * overseas numbers / countries → IGCSE (+ real country), everyone else → CBSE.
 *
 * Run: npx tsx scripts/backfill-parent-board.ts           (dry run)
 *      npx tsx scripts/backfill-parent-board.ts --apply
 */
import "dotenv/config";
import { connectDb, disconnectDb } from "../server/db";
import { deriveParentBoard } from "../server/lib/parent-board";
import { User } from "../server/models/User";

async function main() {
  const apply = process.argv.includes("--apply");
  await connectDb();
  try {
    const parents = await User.find({
      role: "parent",
      parentProfile: { $exists: true, $ne: null },
    })
      .select("email registrationSource parentProfile.phoneNumber parentProfile.country parentProfile.board")
      .lean<
        Array<{
          _id: unknown;
          email?: string;
          registrationSource?: string;
          parentProfile?: { phoneNumber?: string; country?: string; board?: string };
        }>
      >();

    const tally: Record<string, number> = {};
    let changed = 0;
    for (const p of parents) {
      const pp = p.parentProfile ?? {};
      const d = deriveParentBoard(pp);
      tally[d.board] = (tally[d.board] || 0) + 1;
      if (pp.board === d.board && (pp.country || "India") === d.country) continue;
      changed++;
      if (d.overseas) {
        console.log(
          `  ${d.board}  ${d.country.padEnd(22)} ${pp.phoneNumber ?? ""}  ${p.email ?? ""}  ${
            p.registrationSource?.startsWith("seed:") ? "(seed)" : "(real)"
          }`,
        );
      }
      if (apply) {
        await User.updateOne(
          { _id: p._id },
          { $set: { "parentProfile.board": d.board, "parentProfile.country": d.country } },
        );
      }
    }
    console.log(`\n${parents.length} parents · boards:`, tally);
    console.log(apply ? `Updated ${changed}.` : `${changed} would change. Re-run with --apply.`);
  } finally {
    await disconnectDb();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
