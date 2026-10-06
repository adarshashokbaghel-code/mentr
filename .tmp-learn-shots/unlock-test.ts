import "dotenv/config";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";
import { signAuthToken } from "../server/services/jwt";
import { getPyLesson } from "../src/lib/python-lms";

(async () => {
  await connectDb();
  const u = await User.findOne({ email: "anan@gmail.com" }).select("email role learnPython").lean();
  const backup = u!.learnPython;
  const token = signAuthToken(String(u!._id), u!.email, u!.role);
  await User.updateOne({ _id: u!._id }, { $unset: { learnPython: 1 } });
  const day = new Date().toISOString().slice(0, 10);
  const sync = async (lessons: object, awards: string[] = []) => {
    const r = await fetch("http://localhost:5000/api/learnpython/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ day, awards, lessons, achievements: [] }),
    });
    return r.json();
  };
  const last1 = getPyLesson("lesson-1")!.notes.length - 1;
  try {
    let s = await sync({});
    console.log("fresh:", s.unlockedLessons);
    s = await sync({ "lesson-2": { notesDone: true, slidesSeen: 99 } }, ["q:lesson-2:x"]);
    console.log("skip ahead to L2:", s.unlockedLessons, "L2 stored?", !!s.lessons["lesson-2"]);
    s = await sync({ "lesson-1": { notesDone: true, slidesSeen: 2 } });
    console.log("fake notesDone L1 (slide 2):", s.unlockedLessons, "notesDone:", !!s.lessons["lesson-1"]?.notesDone);
    s = await sync({ "lesson-1": { notesDone: true, slidesSeen: last1 } });
    console.log(`all L1 slides (${last1}):`, s.unlockedLessons, "notesDone:", !!s.lessons["lesson-1"]?.notesDone);
    const db = await User.findById(u!._id).select("learnPython.unlockedLessons").lean();
    console.log("DB unlockedLessons:", db!.learnPython?.unlockedLessons);
  } finally {
    await User.updateOne({ _id: u!._id }, backup ? { $set: { learnPython: backup } } : { $unset: { learnPython: 1 } });
    console.log("restored");
    process.exit(0);
  }
})();
