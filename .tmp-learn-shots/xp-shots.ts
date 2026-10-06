import "dotenv/config";
import { chromium } from "playwright";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";
import { signAuthToken } from "../server/services/jwt";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const OUT = ".tmp-learn-shots";

(async () => {
  await connectDb();
  const u = await User.findOne({ email: "anan@gmail.com" }).select("email role").lean();
  if (!u) throw new Error("no user");
  const token = signAuthToken(String(u._id), u.email, u.role);

  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addCookies([{ name: "champs_token", value: token, domain: "localhost", path: "/" }]);
  await ctx.addInitScript((t) => localStorage.setItem("champs_token", t), token);
  const page = await ctx.newPage();
  const syncs: number[] = [];
  page.on("response", (r) => r.url().includes("/api/learnpython/sync") && syncs.push(r.status()));

  await page.goto("http://localhost:3000/learnpython/lms", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/xp-d-home-top.png` });
  await page.getByRole("heading", { name: "How you earn XP" }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${OUT}/xp-d-home-rules.png` });

  await page.getByRole("button", { name: "Streak & rules" }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/xp-d-guide.png` });
  await page.keyboard.press("Escape");

  await page.goto("http://localhost:3000/learnpython/lms/practice", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/xp-d-practice.png` });

  const m = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await m.addCookies([{ name: "champs_token", value: token, domain: "localhost", path: "/" }]);
  await m.addInitScript((t) => localStorage.setItem("champs_token", t), token);
  const mp = await m.newPage();
  await mp.goto("http://localhost:3000/learnpython/lms", { waitUntil: "networkidle" });
  await mp.getByRole("heading", { name: "How you earn XP" }).scrollIntoViewIfNeeded();
  await mp.screenshot({ path: `${OUT}/xp-m-home-rules.png` });

  console.log("sync responses:", syncs);
  await b.close();
  process.exit(0);
})();
