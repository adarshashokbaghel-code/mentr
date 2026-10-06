import "dotenv/config";
import { chromium } from "playwright";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";
import { signAuthToken } from "../server/services/jwt";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const OUT = ".tmp-learn-shots";

(async () => {
  await connectDb();
  const u = await User.findOne({ email: "anan@gmail.com" }).select("email role learnPython").lean();
  console.log("unlocked:", u!.learnPython?.unlockedLessons);
  const token = signAuthToken(String(u!._id), u!.email, u!.role);
  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addCookies([{ name: "champs_token", value: token, domain: "localhost", path: "/" }]);
  await ctx.addInitScript((t) => localStorage.setItem("champs_token", t), token);
  const p = await ctx.newPage();
  await p.goto("http://localhost:3000/learnpython/lms", { waitUntil: "networkidle" });
  await p.getByText("Strings", { exact: false }).first().scrollIntoViewIfNeeded();
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${OUT}/l78-home.png` });
  for (const slug of ["lesson-7", "lesson-8"]) {
    await p.goto(`http://localhost:3000/learnpython/lms/${slug}?stage=notes`, { waitUntil: "networkidle" });
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `${OUT}/l78-${slug}.png` });
  }
  await b.close();
  process.exit(0);
})();
