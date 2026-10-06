import "dotenv/config";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";

(async () => {
  await connectDb();
  const u = await User.findOne({ email: "anan@gmail.com" }).select("learnPython").lean();
  const lp = u!.learnPython!;
  const lessons = (lp.lessons ?? {}) as Record<string, { notesDone?: boolean; slidesSeen?: number }>;
  console.log("unlocked:", lp.unlockedLessons, "xp:", lp.xp, "certUnlocked:", lp.certificateUnlocked, "cert:", lp.certificate?.id);
  console.log("certificate:", JSON.stringify(lp.certificate));
  for (const [k, v] of Object.entries(lessons)) console.log(k, JSON.stringify(v).slice(0, 160));
  process.exit(0);
})();
