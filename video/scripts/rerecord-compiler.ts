import "dotenv/config";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { chromium } from "playwright";

const token = fs.readFileSync(path.resolve("video/.qa-token"), "utf8").trim();
const OUT = path.resolve("video/assets/screen-recordings");
const PUBLIC = path.resolve("video/public/clips");

const code = `def classify_temp(celsius):
    if celsius >= 38:
        return "fever"
    if celsius <= 35:
        return "too cold"
    return "normal"

for t in [34, 36.5, 38, 39.2]:
    print(t, "->", classify_temp(t))
`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: OUT, size: { width: 1920, height: 1080 } },
  });
  const page = await context.newPage();
  await page.addInitScript((t) => localStorage.setItem("champs_token", t), token);
  await page.goto("http://localhost:3000/learnpython/lms/compiler", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(4500);
  await page.evaluate(`(() => {
    document.querySelectorAll('[class*="cookie"],[id*="cookie"]').forEach((el) => {
      el.style.display = "none";
    });
  })()`);
  const got = page.getByRole("button", { name: /got it/i });
  if (await got.count()) await got.click().catch(() => undefined);

  const editor = page.locator("textarea").first();
  await editor.waitFor({ state: "attached", timeout: 20000 });
  await editor.fill(code, { force: true });
  await page.waitForTimeout(900);

  await page.getByRole("button", { name: /^run$/i }).first().click();
  await page.waitForTimeout(2000);
  await page
    .waitForFunction(
      `() => document.body.innerText.includes("fever") || document.body.innerText.includes("->")`,
      { timeout: 25000 },
    )
    .catch(() => null);
  await page.waitForTimeout(4500);

  const video = page.video();
  await context.close();
  await browser.close();
  const webm = await video!.path();
  const dest = path.join(OUT, "05-compiler-run.webm");
  fs.renameSync(webm, dest);
  execSync(
    `ffmpeg -y -i ${JSON.stringify(dest)} -an -c:v libx264 -pix_fmt yuv420p -r 30 -movflags +faststart ${JSON.stringify(
      path.join(PUBLIC, "05-compiler-run.mp4"),
    )}`,
    { stdio: "inherit" },
  );
  console.log("compiler ok");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
