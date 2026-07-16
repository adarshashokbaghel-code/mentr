/**
 * Backfill sample parent requirements for board UI testing.
 * Run: npx tsx scripts/seed-requirements.ts
 * Reset seed data: npx tsx scripts/seed-requirements.ts --reset
 */
import "dotenv/config";
import { connectDb, disconnectDb } from "../server/db";
import {
  Requirement,
  TIMELINE_TTL_DAYS,
  type StartTimeline,
} from "../server/models/Requirement";
import { User } from "../server/models/User";
import type { TeachingMode } from "../server/models/User";

const SEED_TAG = "seed-requirements-ui";
const SEED_EMAIL_PREFIX = "seed-parent-ui+";

type SeedRow = {
  subject: string;
  classLevel: string;
  area: string;
  modes: TeachingMode[];
  budgetMin?: number;
  budgetMax?: number;
  details: string;
  startTimeline: StartTimeline;
  status: "open" | "closed";
  interestCount: number;
  /** Hours ago posted */
  postedHoursAgo: number;
};

const SAMPLES: SeedRow[] = [
  {
    subject: "Mathematics",
    classLevel: "Class 6–8",
    area: "HSR Layout",
    modes: ["student_home", "online"],
    budgetMin: 400,
    budgetMax: 600,
    details:
      "Looking for a patient Maths tutor for my daughter in Class 7. She struggles with algebra basics and needs someone who can explain step-by-step. Weekend mornings preferred.",
    startTimeline: "immediately",
    status: "open",
    interestCount: 3,
    postedHoursAgo: 2,
  },
  {
    subject: "Physics",
    classLevel: "Class 11–12",
    area: "Koramangala",
    modes: ["online"],
    budgetMin: 700,
    budgetMax: 900,
    details:
      "Need a Physics tutor for JEE foundation. Son is in Class 11, comfortable with online classes on weekdays after 5pm. Looking for someone with prior JEE coaching experience.",
    startTimeline: "within_week",
    status: "open",
    interestCount: 0,
    postedHoursAgo: 5,
  },
  {
    subject: "English",
    classLevel: "Class 9–10",
    area: "Indiranagar",
    modes: ["student_home"],
    budgetMin: 500,
    budgetMax: 700,
    details:
      "Spoken English and writing practice for Class 10 board prep. Prefer a tutor who can visit our home twice a week. Child is shy — needs an encouraging teaching style.",
    startTimeline: "flexible",
    status: "open",
    interestCount: 5,
    postedHoursAgo: 8,
  },
  {
    subject: "Coding",
    classLevel: "Class 6–8",
    area: "Whitefield",
    modes: ["online", "tutor_home"],
    budgetMin: 600,
    budgetMax: 800,
    details:
      "Python basics for a curious 12-year-old. Already did Scratch — wants to build small games. Online is fine; open to visiting tutor's place on Saturdays if nearby.",
    startTimeline: "within_month",
    status: "open",
    interestCount: 1,
    postedHoursAgo: 12,
  },
  {
    subject: "Chemistry",
    classLevel: "Class 11–12",
    area: "Jayanagar",
    modes: ["student_home", "online"],
    budgetMin: 650,
    budgetMax: 850,
    details:
      "Organic chemistry is the weak spot — need focused help before internal exams. Class 12 student, can do 3 sessions per week. Urgent start this week.",
    startTimeline: "immediately",
    status: "open",
    interestCount: 2,
    postedHoursAgo: 20,
  },
  {
    subject: "Biology",
    classLevel: "JEE / NEET",
    area: "Malleshwaram",
    modes: ["online"],
    budgetMin: 800,
    budgetMax: 1000,
    details:
      "NEET foundation for Class 11. Botany and zoology both need attention. Prefer a tutor who has helped students score 600+ in NEET. Evening slots only.",
    startTimeline: "within_week",
    status: "open",
    interestCount: 0,
    postedHoursAgo: 26,
  },
  {
    subject: "Exam Prep",
    classLevel: "Class 9–10",
    area: "Koramangala",
    modes: ["student_home"],
    budgetMin: 550,
    budgetMax: 750,
    details:
      "CBSE Class 10 board exam prep — Maths and Science combo preferred but open to separate tutors. Mock tests and past paper practice are the priority for the next 6 weeks.",
    startTimeline: "immediately",
    status: "open",
    interestCount: 8,
    postedHoursAgo: 1,
  },
  {
    subject: "Mathematics",
    classLevel: "Class 1–5",
    area: "HSR Layout",
    modes: ["student_home"],
    budgetMin: 350,
    budgetMax: 500,
    details:
      "Found a tutor through Mentr — closing this post. Thanks to everyone who pitched!",
    startTimeline: "flexible",
    status: "closed",
    interestCount: 4,
    postedHoursAgo: 72,
  },
  {
    subject: "Computer Science",
    classLevel: "College",
    area: "Indiranagar",
    modes: ["online"],
    budgetMin: 900,
    budgetMax: 1200,
    details:
      "Data structures and algorithms help for 2nd year B.Tech. Preparing for campus placements — need someone who can do problem-solving sessions and mock interviews.",
    startTimeline: "within_month",
    status: "open",
    interestCount: 4,
    postedHoursAgo: 30,
  },
  {
    subject: "Music",
    classLevel: "Class 6–8",
    area: "Jayanagar",
    modes: ["tutor_home", "student_home"],
    budgetMin: 500,
    budgetMax: 700,
    details:
      "Carnatic vocal basics for my 10-year-old. Complete beginner — looking for a patient teacher. Can travel to tutor's place within Jayanagar or host at home on Sundays.",
    startTimeline: "flexible",
    status: "open",
    interestCount: 1,
    postedHoursAgo: 48,
  },
];

async function ensureSeedParent(index: number) {
  const email = `${SEED_EMAIL_PREFIX}${index}@mentr.local`;
  let parent = await User.findOne({ email });
  if (!parent) {
    parent = await User.create({
      email,
      role: "parent",
      emailVerified: true,
      profileCompleted: true,
      parentProfile: {
        name: `Seed Parent ${index + 1}`,
        phoneNumber: `9876543${String(210 + index).padStart(3, "0")}`,
        country: "India",
        city: "Bengaluru",
        area: "Koramangala",
      },
    });
    console.log(`created seed parent: ${email}`);
  }
  return parent;
}

async function main() {
  const reset = process.argv.includes("--reset");
  await connectDb();

  if (reset) {
    const seedParents = await User.find({
      email: { $regex: `^${SEED_EMAIL_PREFIX.replace("+", "\\+")}` },
    }).select("_id");
    const parentIds = seedParents.map((p) => p._id);
    const deleted = await Requirement.deleteMany({
      $or: [
        { details: { $regex: SEED_TAG } },
        ...(parentIds.length ? [{ parent: { $in: parentIds } }] : []),
      ],
    });
    console.log(`removed ${deleted.deletedCount} seed requirement(s)`);
  }

  const existing = await Requirement.countDocuments({
    details: { $regex: SEED_TAG },
  });
  if (existing >= SAMPLES.length && !reset) {
    console.log(
      `${existing} seed requirements already exist — run with --reset to replace`,
    );
    await disconnectDb();
    return;
  }

  if (reset || existing === 0) {
    await Requirement.deleteMany({ details: { $regex: SEED_TAG } });
  }

  const now = Date.now();
  let created = 0;

  for (let i = 0; i < SAMPLES.length; i++) {
    const row = SAMPLES[i]!;
    const parent = await ensureSeedParent(i % 4);
    const postedAt = new Date(now - row.postedHoursAgo * 3600_000);
    const ttlDays = TIMELINE_TTL_DAYS[row.startTimeline];
    const expiresAt = new Date(
      postedAt.getTime() + ttlDays * 86_400_000,
    );

    await Requirement.create({
      parent: parent._id,
      subject: row.subject,
      classLevel: row.classLevel,
      city: "Bengaluru",
      area: row.area,
      modes: row.modes,
      budgetMin: row.budgetMin,
      budgetMax: row.budgetMax,
      details: `${row.details}`,
      startTimeline: row.startTimeline,
      status: row.status,
      expiresAt,
      interestCount: row.interestCount,
      createdAt: postedAt,
      updatedAt: postedAt,
    });
    created++;
    console.log(
      `+ ${row.subject} · ${row.classLevel} · ${row.area} (${row.status}, ${row.interestCount} pitches)`,
    );
  }

  console.log(`\nDone — ${created} requirements seeded for board UI testing.`);
  await disconnectDb();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
