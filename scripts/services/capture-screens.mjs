import { chromium } from "playwright";
const OUT = process.argv[2];
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto("http://localhost:3000/dark", { waitUntil: "load" });
await page.waitForTimeout(1500);
const n = await page.evaluate(() => document.querySelectorAll(".dvc").length);
console.log("dvc count", n);
const names = ["won", "dw", "booked"];
for (let i = 0; i < Math.min(n, 3); i++) {
  await page.evaluate((i) => {
    document.querySelectorAll(".dvc")[i].scrollIntoView({ block: "center" });
  }, i);
  await page.waitForTimeout(900);
  await page.evaluate((i) => {
    document.getElementById("cap")?.remove();
    const src = document.querySelectorAll(".dvc")[i];
    const r = src.getBoundingClientRect();
    const ov = document.createElement("div");
    ov.id = "cap";
    ov.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:#000;display:grid;place-items:center;";
    const clone = src.cloneNode(true);
    clone.style.width = getComputedStyle(src).width;
    clone.style.height = getComputedStyle(src).height;
    for (const el of [clone, ...clone.querySelectorAll("*")]) {
      el.style.opacity = "1"; el.style.visibility = "visible"; el.style.transform = "none"; el.style.animation = "none"; el.style.transition = "none";
    }
    ov.appendChild(clone);
    document.body.appendChild(ov);
  }, i);
  await page.waitForTimeout(700);
  const screen = await page.$("#cap .dvc-screen");
  const box = await screen.boundingBox();
  await screen.screenshot({ path: `${OUT}/${names[i]}.png`, omitBackground: false });
  console.log(names[i], JSON.stringify(box));
}
await browser.close();
