/* VIDEO TIMING: on a cold reload, when does the hero reel reach `playing`?
   Listeners are installed via an init script BEFORE the document runs,
   so the first `playing` is caught. Usage: node scripts/video-timing.mjs [runs] */
import { chromium } from "playwright";
const runs = Number(process.argv[2] || 3);
const browser = await chromium.launch({ channel: "chrome" });
/* COLD every run: a fresh context has no cache, so this is the first
   visit's number — the one that matters; the warm number is ~100ms */
const out = [];
for (let i = 0; i < runs; i++) {
  const c = await browser.newContext({ viewport: { width: 1440, height: 736 } });
  await c.addInitScript(() => {
    window.__vt = {};
    const mark = (name) => { if (!(name in window.__vt)) window.__vt[name] = Math.round(performance.now()); };
    for (const ev of ["loadeddata", "canplay", "playing"]) document.addEventListener(ev, (e) => e.target.tagName === "VIDEO" && mark(ev), true);
  });
  const page = await c.newPage();
  /* a real network, not localhost: 4 Mbps down, 100ms RTT (a fair 4G) —
     the priority of the video fetch only shows when bytes are scarce */
  const cdp = await c.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 100, downloadThroughput: 4e6 / 8, uploadThroughput: 1e6 / 8 });
  await page.goto("http://localhost:4320/", { waitUntil: "load" });
  await page.waitForTimeout(3000);
  out.push(await page.evaluate(() => ({ ...window.__vt, preload: document.querySelector(".dr-hero-reel video")?.preload })));
  await c.close();
}
console.log(JSON.stringify(out));
await browser.close();
