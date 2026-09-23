/**
 * Seed 60 genuine-sounding parent profiles (35 Indian + 25 overseas)
 * and 25 open board requirements.
 *
 * Run:  npx tsx scripts/seed-parent-profiles.ts
 * Reset: npx tsx scripts/seed-parent-profiles.ts --reset
 */
import "dotenv/config";
import { randomBytes } from "crypto";
import { connectDb, disconnectDb } from "../server/db";
import {
  Requirement,
  TIMELINE_TTL_DAYS,
} from "../server/models/Requirement";
import { User } from "../server/models/User";
import {
  ALL_SEED_PARENTS,
  SEED_PARENT_SOURCE,
  SEED_REQUIREMENTS,
} from "../src/lib/seed-parent-profiles";

function shareToken(): string {
  return randomBytes(12).toString("base64url");
}

async function resetSeedParents() {
  const seeded = await User.find({
    role: "parent",
    registrationSource: SEED_PARENT_SOURCE,
  }).select("_id email");
  const ids = seeded.map((u) => u._id);
  if (ids.length) {
    const req = await Requirement.deleteMany({ parent: { $in: ids } });
    const users = await User.deleteMany({ _id: { $in: ids } });
    console.log(
      `reset: removed ${users.deletedCount} parent(s), ${req.deletedCount} requirement(s)`,
    );
  } else {
    console.log("reset: nothing to remove");
  }
}

async function seedParents() {
  let upserted = 0;
  for (const row of ALL_SEED_PARENTS) {
    await User.findOneAndUpdate(
      { email: row.email.toLowerCase() },
      {
        email: row.email.toLowerCase(),
        role: "parent",
        emailVerified: true,
        profileCompleted: true,
        registrationSource: SEED_PARENT_SOURCE,
        acquisitionKind: "page",
        acquisitionSlug: "seed-parent-attract",
        lastLoginAt: new Date(
          Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000,
        ),
        parentProfile: {
          name: row.name,
          phoneNumber: row.phoneNumber,
          country: row.country,
          city: row.city,
          area: row.area,
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    upserted += 1;
    console.log(`+ parent (${row.region}): ${row.name} · ${row.city}`);
  }
  console.log(`parents upserted: ${upserted}`);
}

async function seedRequirements() {
  let created = 0;
  for (const row of SEED_REQUIREMENTS) {
    const parent = await User.findOne({
      email: row.parentEmail.toLowerCase(),
      role: "parent",
    });
    if (!parent) {
      console.warn(`! skip requirement — parent missing: ${row.parentEmail}`);
      continue;
    }

    const createdAt = new Date(
      Date.now() - row.postedHoursAgo * 60 * 60 * 1000,
    );
    const ttl = TIMELINE_TTL_DAYS[row.startTimeline] ?? 14;
    const expiresAt = new Date(
      createdAt.getTime() + ttl * 24 * 60 * 60 * 1000,
    );
    // Keep board posts visible: bump expiry if it already lapsed
    if (expiresAt.getTime() < Date.now()) {
      expiresAt.setTime(Date.now() + 10 * 24 * 60 * 60 * 1000);
    }

    await Requirement.findOneAndUpdate(
      {
        parent: parent._id,
        subject: row.subject,
        classLevel: row.classLevel,
        area: row.area,
      },
      {
        parent: parent._id,
        subject: row.subject,
        classLevel: row.classLevel,
        city: row.city,
        area: row.area,
        modes: row.modes,
        budgetMin: row.budgetMin,
        budgetMax: row.budgetMax,
        details: row.details,
        startTimeline: row.startTimeline,
        status: "open",
        expiresAt,
        interestCount: row.interestCount,
        shareToken: shareToken(),
        createdAt,
        updatedAt: createdAt,
      },
      { upsert: true, setDefaultsOnInsert: true, timestamps: false },
    );
    created += 1;
    console.log(
      `+ requirement: ${row.subject} · ${row.classLevel} · ${row.area}`,
    );
  }
  console.log(`requirements upserted: ${created}`);
}

async function main() {
  const reset = process.argv.includes("--reset");
  await connectDb();
  try {
    if (reset) {
      await resetSeedParents();
      return;
    }
    await seedParents();
    await seedRequirements();
    console.log(
      `\nDone. ${ALL_SEED_PARENTS.length} parents (${ALL_SEED_PARENTS.filter((p) => p.region === "india").length} India / ${ALL_SEED_PARENTS.filter((p) => p.region === "foreign").length} overseas), ${SEED_REQUIREMENTS.length} board posts.`,
    );
    console.log(`Tag: registrationSource=${SEED_PARENT_SOURCE}`);
  } finally {
    await disconnectDb();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
