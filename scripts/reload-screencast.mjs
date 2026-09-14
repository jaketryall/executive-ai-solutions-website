/* THE RELOAD, FRAME BY FRAME. Screencasts a reload of the dev server in
   real Chrome (CDP Page.startScreencast — a frame per paint, ~16ms) into
   design-dna/frames/reload/NNN_TTTTms.jpg, so an entrance can be read as
   a timeline instead of guessed at. Read the frames with PIL — mean
   brightness per region per frame — and the flashes show up as steps.
   Usage: node scripts/reload-screencast.mjs   (dev server on :4320) */
import { chromium } from "playwright";
const out = "design-dna/frames/reload";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 736 }, deviceScaleFactor: 1 });
// warm the cache like a real reload (fonts, video poster, js)
await page.goto("http://localhost:4320/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const cdp = await page.context().newCDPSession(page);
const frames = [];
const t0 = Date.now();
cdp.on("Page.screencastFrame", async (f) => { try {
  frames.push({ t: Date.now() - t0, data: f.data });
  await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {}
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 55, maxWidth: 1440, maxHeight: 736, everyNthFrame: 1 });
await page.reload({ waitUntil: "commit" });
await page.waitForTimeout(2600);
await cdp.send("Page.stopScreencast");
import { writeFileSync } from "fs";
// screencast only sends frames when pixels change — that IS the flash log
let i = 0;
for (const f of frames) writeFileSync(`${out}/${String(i++).padStart(3,"0")}_${String(f.t).padStart(4,"0")}ms.jpg`, Buffer.from(f.data, "base64"));
console.log(frames.length, "frames:", frames.map(f => f.t).join(" "));
await browser.close();
