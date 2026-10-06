import "dotenv/config";
import { chromium } from "playwright";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";
import { signAuthToken } from "../server/services/jwt";
import { getPyLesson } from "../src/lib/python-lms";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const OUT = ".tmp-learn-shots";

(async () => {
  await connectDb();
  const u = await User.findOne({ email: "anan@gmail.com" }).select("email role learnPython").lean();
  const backup = u!.learnPython;
  const set: Record<string, unknown> = {};
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) {
    const slug = `lesson-${n}`;
    const prev = (backup?.lessons as Record<string, object> | undefined)?.[slug] ?? {};
    set[`learnPython.lessons.${slug}`] = { ...prev, notesDone: true, slidesSeen: getPyLesson(slug)!.notes.length - 1 };
  }
  await User.updateOne({ _id: u!._id }, { $set: set });
  const token = signAuthToken(String(u!._id), u!.email, u!.role);
  const b = await chromium.launch({ executablePath: EXE });
  try {
    for (const [w, h, tag] of [[1280, 900, "d"], [390, 844, "m"]] as const) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } });
      await ctx.addCookies([{ name: "champs_token", value: token, domain: "localhost", path: "/" }]);
      await ctx.addInitScript((t) => localStorage.setItem("champs_token", t), token);
      const p = await ctx.newPage();
      const shots: [string, string][] =
        tag === "d"
          ? [
              ["lesson-9?stage=notes", "l9-notes"],
              ["lesson-9?stage=examples", "l9-examples"],
              ["lesson-9?stage=practice", "l9-practice"],
            ]
          : [["lesson-9?stage=notes", "l9-notes"]];
      for (const [path, name] of shots) {
        await p.goto(`http://localhost:3000/learnpython/lms/${path}`, { waitUntil: "networkidle" });
        await p.waitForTimeout(1500);
        const dismiss = p.getByRole("button", { name: "Dismiss" });
        if (await dismiss.isVisible().catch(() => false)) await dismiss.click();
        await p.screenshot({ path: `${OUT}/${tag}-${name}.png` });
      }
      await ctx.close();
    }
  } finally {
    await b.close();
    await User.updateOne({ _id: u!._id }, { $set: { learnPython: backup } });
    console.log("restored");
    process.exit(0);
  }
})();
