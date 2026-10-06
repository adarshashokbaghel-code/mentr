import "dotenv/config";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";

async function main() {
  await connectDb();
  const users = await User.find({ "learnPython.visited": true })
    .select("email role learnPython")
    .sort({ "learnPython.lastVisitAt": -1 })
    .limit(3)
    .lean();
  for (const u of users) {
    const lp = u.learnPython!;
    const awards = Object.entries(lp.awards ?? {});
    console.log({
      email: u.email,
      role: u.role,
      visited: lp.visited,
      firstVisitAt: lp.firstVisitAt,
      lastVisitAt: lp.lastVisitAt,
      xp: lp.xp,
      level: lp.level,
      band: lp.band,
      streakDays: lp.streakDays,
      days: lp.days,
      counts: lp.counts,
      lessons: Object.keys(lp.lessons ?? {}),
      achievements: Object.keys(lp.achievements ?? {}),
      awardCount: awards.length,
      sampleAwards: awards.slice(0, 6),
    });
  }
  console.log("total learners:", await User.countDocuments({ "learnPython.visited": true }));
  process.exit(0);
}

void main();
