/* SCROLL FRAMES: screenshots of the page at given scroll fractions of the
   viewport height (or px), in real Chrome, into design-dna/frames/.
   Usage: node scripts/scroll-frames.mjs <name> <vhFraction...>
   e.g.   node scripts/scroll-frames.mjs grow .225 .315 .405 .495  */
import { chromium } from "playwright";
import { writeFileSync } from "fs";
const [, , name, ...fr] = process.argv;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 736 }, deviceScaleFactor: 1 });
await page.goto("http://localhost:4320/", { waitUntil: "networkidle" });
await page.waitForTimeout(2200);
const shots = [];
for (const f of fr) {
  await page.evaluate((f) => window.scrollTo(0, Math.round(innerHeight * f)), Number(f));
  await page.waitForTimeout(450);
  shots.push(await page.screenshot({ type: "jpeg", quality: 60 }));
}
// contact sheet: 2 columns, half scale
import sharp from "sharp";
const W = 720, H = 368, cols = 2, rows = Math.ceil(shots.length / cols);
const tiles = await Promise.all(shots.map(async (b, i) => ({ input: await sharp(b).resize(W, H).toBuffer(), left: (i % cols) * W, top: Math.floor(i / cols) * (H + 12) })));
await sharp({ create: { width: W * cols, height: rows * (H + 12), channels: 3, background: "#fff" } }).composite(tiles).jpeg({ quality: 62 }).toFile(`design-dna/frames/${name}-sheet.jpg`);
console.log(`design-dna/frames/${name}-sheet.jpg`, fr.join(" "));
await browser.close();
