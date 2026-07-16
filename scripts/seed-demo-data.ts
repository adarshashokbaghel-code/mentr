/**
 * Seed demo parents, mentors, and requirements for board/search UI.
 * Run: npm run seed:demo
 * Reset: npm run seed:demo:reset
 */
import "dotenv/config";
import { connectDb, disconnectDb } from "../server/db";
import {
  Requirement,
  TIMELINE_TTL_DAYS,
} from "../server/models/Requirement";
import { User } from "../server/models/User";
import {
  DEMO_MENTORS,
  DEMO_PARENTS,
  DEMO_REQUIREMENTS,
} from "../src/lib/demo-users";

const DEMO_EMAIL_PATTERN = /^demo-(parent|mentor)-.+@mentr\.local$/;
const LEGACY_SEED_PREFIX = "seed-parent-ui+";

async function removeLegacySeedData() {
  const legacyParents = await User.find({
    email: { $regex: `^${LEGACY_SEED_PREFIX.replace("+", "\\+")}` },
  }).select("_id");
  const legacyIds = legacyParents.map((p) => p._id);
  if (legacyIds.length) {
    await Requirement.deleteMany({ parent: { $in: legacyIds } });
    await User.deleteMany({ _id: { $in: legacyIds } });
    console.log(`removed ${legacyIds.length} legacy seed parent(s)`);
  }
}

async function removeDemoData() {
  const demoUsers = await User.find({
    email: { $regex: DEMO_EMAIL_PATTERN },
  }).select("_id role");
  const parentIds = demoUsers
    .filter((u) => u.role === "parent")
    .map((u) => u._id);

  if (parentIds.length) {
    const deletedReqs = await Requirement.deleteMany({
      parent: { $in: parentIds },
    });
    console.log(`removed ${deletedReqs.deletedCount} demo requirement(s)`);
  }

  const deletedUsers = await User.deleteMany({
    email: { $regex: DEMO_EMAIL_PATTERN },
  });
  console.log(`removed ${deletedUsers.deletedCount} demo user(s)`);
}

async function seedParents() {
  for (const row of DEMO_PARENTS) {
    await User.findOneAndUpdate(
      { email: row.email },
      {
        email: row.email,
        role: "parent",
        emailVerified: true,
        profileCompleted: true,
        parentProfile: {
          name: row.name,
          phoneNumber: row.phoneNumber,
          country: "India",
          city: row.city,
          area: row.area,
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    console.log(`+ parent: ${row.name} (${row.area})`);
  }
}

async function seedMentors() {
  for (const row of DEMO_MENTORS) {
    await User.findOneAndUpdate(
      { email: row.email },
      {
        email: row.email,
        role: "faculty",
        emailVerified: true,
        profileCompleted: true,
        profile: {
          name: row.name,
          designation: row.designation,
          phoneNumber: row.phoneNumber,
          bio: row.bio,
          subjects: row.subjects,
          country: "India",
          city: row.city,
          area: row.area,
          levels: row.levels,
          languages: row.languages,
          qualification: row.qualification,
          experienceYears: row.experienceYears,
          teachingModes: row.teachingModes,
          timeFormat: "12h",
          timezone: "Asia/Kolkata",
          availability: row.availability,
          gender: row.gender,
          workplace: row.workplace,
          certifications: row.certifications,
          achievements: row.achievements,
        },
      },
      { upsert: true, returnDocument: "after" },
    );
    console.log(`+ mentor: ${row.name} (${row.area})`);
  }
}

async function seedRequirements() {
  const now = Date.now();

  for (const row of DEMO_REQUIREMENTS) {
    const parent = await User.findOne({ email: row.parentEmail });
    if (!parent) {
      console.warn(`skip requirement — parent not found: ${row.parentEmail}`);
      continue;
    }

    const postedAt = new Date(now - row.postedHoursAgo * 3600_000);
    const ttlDays = TIMELINE_TTL_DAYS[row.startTimeline];
    const expiresAt = new Date(postedAt.getTime() + ttlDays * 86_400_000);

    const existing = await Requirement.findOne({
      parent: parent._id,
      subject: row.subject,
      classLevel: row.classLevel,
      area: row.area,
    });

    if (existing) {
      existing.modes = row.modes;
      existing.budgetMin = row.budgetMin;
      existing.budgetMax = row.budgetMax;
      existing.details = row.details;
      existing.startTimeline = row.startTimeline;
      existing.status = "open";
      existing.expiresAt = expiresAt;
      existing.interestCount = row.interestCount;
      existing.createdAt = postedAt;
      existing.updatedAt = postedAt;
      await existing.save();
    } else {
      await Requirement.create({
        parent: parent._id,
        subject: row.subject,
        classLevel: row.classLevel,
        city: "Bengaluru",
        area: row.area,
        modes: row.modes,
        budgetMin: row.budgetMin,
        budgetMax: row.budgetMax,
        details: row.details,
        startTimeline: row.startTimeline,
        status: "open",
        expiresAt,
        interestCount: row.interestCount,
        createdAt: postedAt,
        updatedAt: postedAt,
      });
    }

    console.log(
      `+ requirement: ${row.subject} · ${row.classLevel} · ${row.area}`,
    );
  }
}

async function main() {
  const reset = process.argv.includes("--reset");
  await connectDb();

  if (reset) {
    await removeDemoData();
    await removeLegacySeedData();
  }

  await seedParents();
  await seedMentors();
  await seedRequirements();

  console.log(
    `\nDone — ${DEMO_PARENTS.length} parents, ${DEMO_MENTORS.length} mentors, ${DEMO_REQUIREMENTS.length} requirements.`,
  );
  await disconnectDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
