import { chromium } from "playwright";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const BASE = "http://localhost:3000";
const USER = { id: "e2e-compiler", email: "riya@example.com", role: "parent", emailVerified: true, profileCompleted: true, parentProfile: { name: "Riya Sharma" } };

(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    localStorage.setItem("champs_token", "e2e");
    localStorage.setItem("mentr_cookie_consent", "accepted");
  });
  const page = await ctx.newPage();
  page.on("dialog", (d) => void d.accept());
  await page.route("**/api/auth/me", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ user: USER }) }));
  await page.goto(BASE + "/learnpython/lms/lesson-1?stage=examples");
  await page.waitForTimeout(2500);
  console.log("url:", page.url());
  await page.screenshot({ path: ".tmp-learn-shots/c-d-examples.png" });
  const open = page.getByRole("button", { name: /Open in compiler/ });
  for (let i = 0; i < 12 && !(await open.count()); i++) {
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.waitForTimeout(400);
  }
  if (!(await open.count())) {
    console.log("NO PLAYGROUND FOUND");
  } else {
    await page.getByLabel(/code/i).first().fill('print("from the lesson")');
    await open.first().click();
    await page.waitForURL("**/learnpython/lms/compiler", { timeout: 10000 });
    const v = await page.getByLabel("Python code (main.py)").inputValue();
    console.log("handed code:", JSON.stringify(v));
    await page.screenshot({ path: ".tmp-learn-shots/c-d-from-example.png" });
  }
  await b.close();
})();
