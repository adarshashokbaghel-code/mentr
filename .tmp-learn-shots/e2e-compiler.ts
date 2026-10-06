import { chromium, type Page } from "playwright";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const BASE = "http://localhost:3000";
const USER = { id: "e2e-compiler", email: "riya@example.com", role: "parent", emailVerified: true, profileCompleted: true, parentProfile: { name: "Riya Sharma" } };
const OUT = ".tmp-learn-shots/";
const issues: string[] = [];
const runtimeRequests: string[] = [];

async function setup(width: number, height: number, mobile: boolean) {
  const b = await chromium.launch({ executablePath: EXE });
  const ctx = await b.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  await ctx.addInitScript(() => {
    localStorage.setItem("champs_token", "e2e");
    localStorage.setItem("mentr_cookie_consent", "accepted");
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => issues.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && !/favicon|Failed to load resource|adsbygoogle/.test(m.text()) && issues.push(`console: ${m.text().slice(0, 200)}`));
  page.on("dialog", (d) => void d.accept());
  ctx.on("request", (r) => {
    const u = r.url();
    if (/pyodide|py-worker/.test(u)) runtimeRequests.push(u.replace(BASE, ""));
  });
  await page.route("**/api/auth/me", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ user: USER }) }));
  return { b, page };
}

const consoleText = (page: Page) => page.locator("[data-py-console]").innerText();

async function setCode(page: Page, code: string) {
  await page.getByLabel("Python code (main.py)").fill(code);
}

async function runAndWait(page: Page, expect: RegExp, timeout = 30000) {
  await page.getByRole("button", { name: "Run", exact: true }).first().click();
  await page.waitForFunction(
    (src) => new RegExp(src).test(document.querySelector("[data-py-console]")?.textContent ?? ""),
    expect.source,
    { timeout },
  ).catch(async () => issues.push(`expected ${expect} got: ${(await consoleText(page)).slice(0, 300)}`));
}

async function shot(page: Page, name: string) {
  await page.waitForTimeout(300);
  await page.screenshot({ path: OUT + name + ".png" });
}

(async () => {
  {
    const { b, page } = await setup(1440, 900, false);
    await page.goto(BASE + "/learnpython/lms/lesson-1");
    await page.getByRole("link", { name: /Python compiler Write and run/ }).click();
    await page.waitForURL("**/learnpython/lms/compiler");
    await shot(page, "c-d-page");
    await page.locator("text=Python 3.14").first().waitFor({ timeout: 60000 }).catch(() => issues.push("runtime never ready"));
    const t0 = Date.now();
    await runAndWait(page, /2 \+ 3 = 5/);
    console.log("first run after ready:", Date.now() - t0, "ms");
    await shot(page, "c-d-hello");

    await page.locator("select").first().selectOption("input");
    await runAndWait(page, /Next year you will be 13/);
    await shot(page, "c-d-input");

    await setCode(page, 'name = input("Name: ")\nprint("Hi", name)\nage = input("Age: ")');
    await page.getByLabel("Program input, one line per input() call").fill("Meera");
    await runAndWait(page, /EOFError/);

    await setCode(page, 'print("start")\nprint(total)\n');
    await runAndWait(page, /NameError: name 'total' is not defined/);
    await shot(page, "c-d-error");

    await setCode(page, "while True:\n    pass\n");
    await page.getByRole("button", { name: "Run", exact: true }).first().click();
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Stop" }).first().click();
    await page.locator("text=Program stopped.").waitFor({ timeout: 5000 }).catch(() => issues.push("stop did not work"));
    const t1 = Date.now();
    await setCode(page, 'print("after stop ok")');
    await runAndWait(page, /after stop ok/);
    console.log("run after stop (worker restart):", Date.now() - t1, "ms");

    await setCode(page, "for i in range(100000):\n    print(i)\n");
    const t2 = Date.now();
    await runAndWait(page, /Output stopped after/);
    console.log("100k-line print:", Date.now() - t2, "ms");

    await setCode(page, "import numpy as np\nprint(np.arange(6).reshape(2, 3).sum())\n");
    await runAndWait(page, /^.*15/m, 60000);
    await shot(page, "c-d-numpy");

    const box = await page.locator('[aria-label="Resize code and output"]').boundingBox();
    if (box) {
      await page.mouse.move(box.x + 2, box.y + 300);
      await page.mouse.down();
      await page.mouse.move(box.x - 200, box.y + 300, { steps: 6 });
      await page.mouse.up();
    } else issues.push("no split handle");
    await shot(page, "c-d-split");

    await setCode(page, "while True:\n    pass\n");
    const t3 = Date.now();
    await runAndWait(page, /ran for more than 15 seconds/, 25000);
    console.log("timeout fired after:", Date.now() - t3, "ms");
    await shot(page, "c-d-timeout");

    await page.reload();
    const saved = await page.getByLabel("Python code (main.py)").inputValue();
    if (!saved.includes("while True")) issues.push("workspace not persisted");

    await page.goto(BASE + "/learnpython/lms/lesson-1?stage=examples");
    const openBtn = page.getByRole("button", { name: /Open in compiler/ }).first();
    if (await openBtn.count()) {
      await openBtn.click();
      await page.waitForURL("**/learnpython/lms/compiler").catch(() => issues.push("open in compiler did not navigate"));
      const handed = await page.getByLabel("Python code (main.py)").inputValue();
      if (handed.includes("while True")) issues.push("example code not handed to compiler");
      await shot(page, "c-d-from-example");
    } else issues.push("no Open in compiler button on examples");
    await b.close();
  }
  {
    const { b, page } = await setup(390, 844, true);
    await page.goto(BASE + "/learnpython/lms");
    await page.getByRole("button", { name: "Open course menu" }).click();
    await shot(page, "c-m-drawer");
    await page.getByRole("link", { name: /Python compiler Write and run/ }).last().click();
    await page.waitForURL("**/learnpython/lms/compiler");
    await page.locator("text=Python 3.14").first().waitFor({ timeout: 60000 }).catch(() => issues.push("mobile runtime never ready"));
    await shot(page, "c-m-code");
    await page.getByRole("button", { name: "Run", exact: true }).click();
    await page.waitForFunction(() => /Hello, world/.test(document.querySelector("[data-py-console]")?.textContent ?? ""), undefined, { timeout: 20000 }).catch(() => issues.push("mobile run failed"));
    await shot(page, "c-m-output");
    await page.getByRole("tab", { name: /Input/ }).click();
    await shot(page, "c-m-input");
    const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (o > 1) issues.push(`mobile overflow ${o}`);
    await b.close();
  }
  const uniq = [...new Set(runtimeRequests)];
  console.log("runtime requests:", uniq.join("\n  "));
  if (uniq.some((u) => /jsdelivr.*pyodide\.(asm|mjs)|jsdelivr.*python_stdlib/.test(u))) issues.push("core runtime loaded from CDN instead of self-host");
  console.log(issues.length ? "ISSUES:\n" + issues.join("\n") : "NO ISSUES");
})().catch((e) => {
  console.error("FAILED:", e.message);
  console.log(issues.join("\n"));
  process.exit(1);
});
