import { chromium } from "playwright";

const EXE = process.env.HOME + "/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const OUT = ".tmp-learn-shots";
const URL = "http://localhost:3000/openpythoncompiler";

(async () => {
  const res = await fetch(URL);
  console.log("status", res.status, "COOP", res.headers.get("cross-origin-opener-policy"), "COEP", res.headers.get("cross-origin-embedder-policy"));
  const b = await chromium.launch({ executablePath: EXE });
  for (const [name, w, h] of [["oc-d", 1440, 900], ["oc-m", 390, 844]] as const) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1 });
    const p = await ctx.newPage();
    await p.goto(URL, { waitUntil: "networkidle" });
    console.log(name, "isolated:", await p.evaluate(() => crossOriginIsolated), "url:", p.url());
    await p.getByText(/runs in your browser/).first().waitFor({ timeout: 60000 });
    const ta = p.locator("textarea").first();
    await ta.fill('name = input("Your name? ")\nprint("Hello,", name)\nfor i in range(3):\n    print(i * i)');
    await p.getByRole("button", { name: "Run" }).last().click();
    await p.locator("[data-py-stdin]").waitFor({ timeout: 60000 });
    await p.locator("[data-py-stdin]").fill("Asha");
    await p.keyboard.press("Enter");
    await p.getByText(/finished in/).waitFor({ timeout: 30000 });
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${OUT}/${name}.png` });
    console.log(name, "output:", (await p.locator("[data-py-console]").innerText()).replace(/\n/g, " | "));
    await ctx.close();
  }
  await b.close();
})();
