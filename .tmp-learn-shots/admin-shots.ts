import "dotenv/config";
import { chromium } from "playwright";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";
import { signAuthToken } from "../server/services/jwt";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const OUT = ".tmp-learn-shots";

(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  const page = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:3000/admintestingistrueonlyman134hsydsudy4", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Learn Python" }).click();
  await page.getByText("Learners", { exact: true }).first().waitFor();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/xp-admin-list.png` });
  await page.getByRole("button", { name: "View", exact: true }).first().click();
  await page.getByText("Learn Python progress").waitFor();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/xp-admin-detail.png` });

  await connectDb();
  const u = await User.findOne({ email: "anan@gmail.com" }).select("email role").lean();
  const token = signAuthToken(String(u!._id), u!.email, u!.role);
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  await ctx.addCookies([{ name: "champs_token", value: token, domain: "localhost", path: "/" }]);
  await ctx.addInitScript((t) => localStorage.setItem("champs_token", t), token);
  const p2 = await ctx.newPage();
  await p2.goto("http://localhost:3000/learnpython/lms", { waitUntil: "networkidle" });
  await p2.getByRole("heading", { name: "Badges you earn with XP" }).scrollIntoViewIfNeeded();
  await p2.waitForTimeout(500);
  await p2.screenshot({ path: `${OUT}/xp-d-home-ladder.png` });
  await b.close();
  process.exit(0);
})();
