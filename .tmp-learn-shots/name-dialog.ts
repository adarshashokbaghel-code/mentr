import "dotenv/config";
import { chromium } from "playwright";
import { connectDb } from "../server/db";
import { User } from "../server/models/User";
import { signAuthToken } from "../server/services/jwt";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const OUT = ".tmp-learn-shots";

(async () => {
  await connectDb();
  const u = await User.findOne({ email: "anan@gmail.com" }).select("email role learnPython.certificate").lean();
  if (u!.learnPython?.certificate) throw new Error("already has a certificate; not testing");
  const token = signAuthToken(String(u!._id), u!.email, u!.role);
  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  await ctx.addCookies([{ name: "champs_token", value: token, domain: "localhost", path: "/" }]);
  await ctx.addInitScript((t) => localStorage.setItem("champs_token", t), token);
  const p = await ctx.newPage();
  try {
    await p.goto("http://localhost:3000/learnpython/lms/profile?tab=certificate", { waitUntil: "networkidle" });
    await p.waitForTimeout(2000);
    await p.getByRole("button", { name: "Claim & download" }).scrollIntoViewIfNeeded();
    await p.screenshot({ path: `${OUT}/nd-unlocked.png` });
    await p.getByRole("button", { name: "Claim & download" }).click();
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}/nd-edit.png` });
    const input = p.getByPlaceholder("e.g. Priya Sharma");
    await input.fill("Abhi123");
    await p.waitForTimeout(200);
    await p.screenshot({ path: `${OUT}/nd-invalid.png` });
    await input.fill("  Abhiyudya   Singh ");
    await p.getByRole("button", { name: "Continue" }).click();
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}/nd-confirm.png` });
    const dl = p.waitForEvent("download");
    await p.getByRole("button", { name: "Save name & download" }).click();
    const file = await dl;
    console.log("downloaded:", file.suggestedFilename());
    await p.waitForTimeout(1000);
    await p.screenshot({ path: `${OUT}/nd-issued.png` });

    const db = await User.findById(u!._id).select("learnPython.certificate").lean();
    console.log("DB name:", JSON.stringify(db!.learnPython!.certificate!.name), "id:", db!.learnPython!.certificate!.id);
    const again = await fetch("http://localhost:5000/api/learnpython/certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Someone Else" }),
    }).then((r) => r.json());
    console.log("second claim with another name returns:", again.name, again.id);
    const dl2 = p.waitForEvent("download");
    await p.getByRole("button", { name: /Download PDF/ }).click();
    console.log("re-download without prompt:", (await dl2).suggestedFilename());
  } finally {
    await b.close();
    await User.updateOne({ _id: u!._id }, { $unset: { "learnPython.certificate": 1 } });
    console.log("test certificate removed; unlock flag kept");
    process.exit(0);
  }
})();
