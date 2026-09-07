#!/usr/bin/env node
/**
 * Reel stage render script.
 *
 * Two passes:
 *
 *   Pass 1 — capture the screen: the live Desert Wings site sends
 *   `x-frame-options: SAMEORIGIN`, so it can never render inside an
 *   <iframe> — Chrome blocks the frame outright. Instead we open it
 *   top-level (no framing at all, nothing to block) in its own mobile
 *   viewport, scroll it frame by frame, and screenshot each position to
 *   disk under <proof dir>/screen/.
 *
 *   Pass 2 — the stage composites it: steps the dev-only /reel/stage
 *   route frame by frame (60fps, every animation on that page is a pure
 *   function of the `f` query param) and screenshots each frame. For
 *   phone-dw frames, the stage's <img> is fed one of Pass 1's screenshots
 *   through a `screen` search param that Playwright's own route
 *   interception resolves straight from disk — never a real Next.js
 *   route.
 *
 * The sequence is then encoded to 1080p60 h264 with ffmpeg.
 *
 * Usage:
 *   node scripts/reel/render.mjs                          # default: the proof (title 0-53, phone-dw 54-149)
 *   node scripts/reel/render.mjs --scene title --from 0 --to 53
 *   node scripts/reel/render.mjs --scene phone-dw --from 54 --to 149
 *
 * Requires: `npx playwright install chromium` (once), ffmpeg on PATH,
 * and the Next dev server already running at http://localhost:3000.
 */

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);

const BASE_URL = process.env.REEL_BASE_URL ?? "http://localhost:3000";
const FPS = 60;

const PROOF_DIR =
  "/private/tmp/claude-501/-Users-jakeryall-Documents-cursor-projects-Executive-AI-Solutions-Website/ce239744-2956-4844-a879-02a81eb2b402/scratchpad/reel/proof";
const FRAMES_DIR = path.join(PROOF_DIR, "frames");
const SCREEN_DIR = path.join(PROOF_DIR, "screen");

const DW_URL = "https://www.desertwingsflightschool.com";
const PHONE_SCENE_FRAMES = 95; // (149 - 54): 1.6s at 60fps, matches page.tsx
const SCROLL_MAX = 520;

/* Same cubic-bezier solver as app/reel/stage/page.tsx (duplicated on
   purpose: this one drives Pass 1's real-browser scrollTo calls, the
   page's copy drives its own pure-CSS math — they can't share a module
   across a Node script and a Next.js client component without adding
   build config neither side needs otherwise). */
function cubicBezier(x1, y1, x2, y2) {
  const bx = (t) => {
    const mt = 1 - t;
    return 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t;
  };
  const by = (t) => {
    const mt = 1 - t;
    return 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t;
  };
  return (x) => {
    const target = Math.min(1, Math.max(0, x));
    let lo = 0;
    let hi = 1;
    let t = target;
    for (let i = 0; i < 30; i++) {
      const guess = bx(t);
      if (Math.abs(guess - target) < 1e-6) break;
      if (guess < target) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return by(t);
  };
}
const easeInOut = cubicBezier(0.42, 0, 0.58, 1);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      args[a.slice(2)] = argv[i + 1];
      i++;
    }
  }
  return args;
}

function buildSegments(args) {
  if (args.scene) {
    const from = Number.parseInt(args.from ?? "0", 10);
    const to = Number.parseInt(args.to ?? String(from), 10);
    return [{ scene: args.scene, from, to }];
  }
  // Proof scene: shots 1 + 4 of design-dna/reel-board.md — the Apple wipe
  // title into Desert Wings scrolling live on a phone.
  return [
    { scene: "title", from: 0, to: 53 },
    { scene: "phone-dw", from: 54, to: 149 },
  ];
}

function frameFilePath(f) {
  return path.join(FRAMES_DIR, `f${String(f).padStart(4, "0")}.png`);
}
function screenFilePath(f) {
  return path.join(SCREEN_DIR, `f${String(f).padStart(4, "0")}.png`);
}
function screenUrlPath(f) {
  return `/reel-screen/f${String(f).padStart(4, "0")}.png`;
}

/** Pass 1: capture the live Desert Wings site, scrolled, at each phone-dw frame. */
async function captureDwScreens(browser, frames) {
  if (frames.length === 0) return true;

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  let titleOk = true;
  await page.goto(DW_URL, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(1500);

  // best-effort: dismiss the cookie banner for a clean scroll shot
  await page
    .getByRole("button", { name: /decline/i })
    .first()
    .click({ timeout: 2000 })
    .catch(() => {});

  const title = await page.title().catch(() => "");
  console.log(`[reel] Desert Wings page title: "${title}"`);
  if (!title.includes("Desert Wings")) {
    titleOk = false;
    console.error(`[reel] ERROR: DW page title does not contain "Desert Wings": "${title}"`);
  }

  const t0 = Date.now();
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const u = Math.max(0, Math.min(1, (f - 54) / PHONE_SCENE_FRAMES));
    const scrollY = Math.round(SCROLL_MAX * easeInOut(u));
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(60);
    await page.screenshot({
      path: screenFilePath(f),
      clip: { x: 0, y: 0, width: 390, height: 844 },
    });
    if (i % 10 === 0) {
      const elapsed = (Date.now() - t0) / 1000;
      console.log(`[reel] [pass1] screen frame ${f} (${i + 1}/${frames.length}) — ${elapsed.toFixed(1)}s elapsed`);
    }
  }

  await context.close();
  return titleOk;
}

/** Pass 2: composite the stage, frame by frame. */
async function renderStage(browser, allFrames, startNumber) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
    colorScheme: "dark",
  });

  // Serves Pass 1's screenshots to the stage's <img> — intercepted before
  // it ever reaches the network, so no real Next.js route is needed.
  await context.route("**/reel-screen/**", async (route) => {
    try {
      const url = new URL(route.request().url());
      const match = url.pathname.match(/f(\d{4})\.png$/);
      if (!match) {
        await route.abort();
        return;
      }
      await route.fulfill({ path: screenFilePath(Number(match[1])), contentType: "image/png" });
    } catch {
      await route.abort().catch(() => {});
    }
  });

  const page = await context.newPage();

  let currentScene = null;
  /** @type {"replace" | "goto" | null} */
  let strategy = null;
  const t0 = Date.now();

  for (let i = 0; i < allFrames.length; i++) {
    const { scene, f } = allFrames[i];
    const params = new URLSearchParams({ scene, f: String(f) });
    if (scene === "phone-dw") params.set("screen", screenUrlPath(f));
    const url = `${BASE_URL}/reel/stage?${params.toString()}`;

    if (scene !== currentScene) {
      // First frame of a new scene: a real navigation.
      await page.goto(url, { waitUntil: "load" });
      currentScene = scene;
      strategy = null; // re-decide the URL-update strategy fresh each scene
    } else if (strategy === null || strategy === "replace") {
      await page.evaluate((u) => {
        history.replaceState(null, "", u);
        window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
      }, url);
      await page.waitForTimeout(30);
      const observed = await page.$eval(".stage", (el) => el.getAttribute("data-frame")).catch(() => null);
      const worked = observed === String(f);
      if (strategy === null) {
        strategy = worked ? "replace" : "goto";
        console.log(
          `[reel] URL update strategy: ${
            strategy === "replace" ? "history.replaceState + popstate" : "goto-per-frame (fallback)"
          }`,
        );
      }
      if (!worked) await page.goto(url, { waitUntil: "load" });
    } else {
      await page.goto(url, { waitUntil: "load" });
    }

    if (scene === "phone-dw") {
      await page
        .waitForFunction(() => {
          const img = document.querySelector(".stage img");
          return !!img && img.complete && img.naturalWidth > 0;
        })
        .catch(() => {});
    }

    await page.waitForTimeout(60);

    await page.screenshot({
      path: frameFilePath(f),
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });

    if (i % 10 === 0) {
      const elapsed = (Date.now() - t0) / 1000;
      console.log(`[reel] [pass2] frame ${f} (${i + 1}/${allFrames.length}) — ${elapsed.toFixed(1)}s elapsed`);
    }
  }

  // Diagnostic: the phone's screen region drifts slightly frame to frame
  // (the whole phone gets a 2% push), so log its exact on-canvas rect at a
  // few frames — used to crop the right area for verification. Only
  // meaningful (and only has a captured screenshot to load) when this run
  // actually rendered phone-dw frames.
  const dwFrameSet = new Set(allFrames.filter((x) => x.scene === "phone-dw").map((x) => x.f));
  const diagnosticFrames = [80, 100, 140].filter((mf) => dwFrameSet.has(mf));
  for (const mf of diagnosticFrames) {
    const params = new URLSearchParams({ scene: "phone-dw", f: String(mf), screen: screenUrlPath(mf) });
    await page.goto(`${BASE_URL}/reel/stage?${params.toString()}`, { waitUntil: "load" });
    await page
      .waitForFunction(() => {
        const img = document.querySelector(".stage img");
        return !!img && img.complete && img.naturalWidth > 0;
      })
      .catch(() => {});
    const rect = await page.$eval(".stage-phone__screen", (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });
    const dpr = 2;
    console.log(
      `[reel] screen rect @f=${mf} (2x px): x=${Math.round(rect.x * dpr)} y=${Math.round(rect.y * dpr)} ` +
        `w=${Math.round(rect.width * dpr)} h=${Math.round(rect.height * dpr)}`,
    );
  }

  await context.unroute("**/reel-screen/**").catch(() => {});
  await context.close();

  const elapsedTotal = (Date.now() - t0) / 1000;
  console.log(
    `[reel] rendered ${allFrames.length} frames in ${elapsedTotal.toFixed(1)}s ` +
      `(${(elapsedTotal / allFrames.length).toFixed(3)}s/frame)`,
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const segments = buildSegments(args);

  await mkdir(FRAMES_DIR, { recursive: true });
  await mkdir(SCREEN_DIR, { recursive: true });

  const allFrames = [];
  for (const seg of segments) {
    for (let f = seg.from; f <= seg.to; f++) allFrames.push({ scene: seg.scene, f });
  }
  const startNumber = allFrames[0]?.f ?? 0;
  const dwFrameNumbers = allFrames.filter((x) => x.scene === "phone-dw").map((x) => x.f);

  const browser = await chromium.launch({ headless: true });

  const titleOk = await captureDwScreens(browser, dwFrameNumbers);
  await renderStage(browser, allFrames, startNumber);

  await browser.close();

  if (!titleOk) {
    console.error("[reel] ERROR: the Desert Wings title assertion failed — see log above.");
  }

  const framePattern = path.join(FRAMES_DIR, "f%04d.png");
  const outPath = path.join(PROOF_DIR, "proof.mp4");
  await execFileAsync("ffmpeg", [
    "-y",
    "-framerate",
    String(FPS),
    "-start_number",
    String(startNumber),
    "-i",
    framePattern,
    "-vf",
    "scale=1920:1080:flags=lanczos,format=yuv420p",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "18",
    "-movflags",
    "+faststart",
    outPath,
  ]);
  console.log(`[reel] wrote ${outPath}`);

  if (!titleOk) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
