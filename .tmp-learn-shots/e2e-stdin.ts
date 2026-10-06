import { chromium, type Page } from "playwright";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const BASE = "http://localhost:3000";
const USER = { id: "e2e-stdin", email: "riya@example.com", role: "parent", emailVerified: true, profileCompleted: true, parentProfile: { name: "Riya Sharma" } };
const issues: string[] = [];

const waitConsole = (page: Page, re: RegExp, timeout = 20000) =>
  page
    .waitForFunction((src) => new RegExp(src).test(document.querySelector("[data-py-console]")?.textContent ?? ""), re.source, { timeout })
    .catch(async () => issues.push(`expected ${re} got: ${(await page.locator("[data-py-console]").innerText()).slice(0, 300)}`));

async function answer(page: Page, text: string) {
  const box = page.locator("[data-py-stdin]");
  await box.waitFor({ timeout: 20000 });
  await box.fill(text);
  await box.press("Enter");
}

(async () => {
  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("champs_token", "e2e");
      localStorage.setItem("mentr_cookie_consent", "accepted");
    } catch {
      (window as unknown as { __blockedFrame: string }).__blockedFrame = location.href;
    }
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => issues.push(`pageerror: ${e.message}`));
  page.on("dialog", (d) => void d.accept());
  await page.route("**/api/auth/me", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ user: USER }) }));
  await page.goto(BASE + "/learnpython/lms/compiler");
  console.log("isolated:", await page.evaluate("window.crossOriginIsolated"));
  await page.locator("text=Python 3.14").first().waitFor({ timeout: 60000 });

  await page.getByLabel("Python code (main.py)").fill('n=int(input("enter"))\nprint(n)\nn=int(input("enter"))\nprint(n)\n');
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await answer(page, "123");
  await waitConsole(page, /enter123\s*123\s*enter/);
  await page.screenshot({ path: ".tmp-learn-shots/s-d-waiting.png" });
  await answer(page, "45");
  await waitConsole(page, /enter45\s*45/);
  await page.waitForTimeout(300);
  await page.screenshot({ path: ".tmp-learn-shots/s-d-done.png" });
  console.log("console:", JSON.stringify(await page.locator("[data-py-console]").innerText()));
  console.log("status:", await page.locator("section[aria-label=Output] >> text=/finished|running/").first().innerText().catch(() => "?"));

  await page.getByRole("button", { name: "Run", exact: true }).click();
  await page.locator("[data-py-stdin]").press("Control+d");
  await waitConsole(page, /EOFError/);
  console.log("frames:", page.frames().map((f) => f.url().slice(0, 100)).join(" | "));
  await b.close();
  console.log(issues.length ? "ISSUES:\n" + issues.join("\n") : "NO ISSUES");
})().catch((e) => {
  console.error("FAILED:", e.message);
  console.log(issues.join("\n"));
  process.exit(1);
});
