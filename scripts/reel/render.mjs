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
 *   viewport, and screenshot it frame by frame under a DETERMINISTIC
 *   VIRTUAL CLOCK (see "Virtual time" below) to <proof dir>/screen/.
 *   This is what makes the site's own entrance, hover and smooth-scroll
 *   animations actually appear in the capture — real wall-clock capture
 *   (the previous version of this script) only ever saw the page at
 *   rest, because `reducedMotion: "reduce"` plus a fixed wait between
 *   screenshots gives the browser no chance to animate anything.
 *
 *   Pass 2 — the stage composites it: steps the dev-only /reel/stage
 *   route frame by frame (60fps, every animation on that page is a pure
 *   function of the `f` query param) and screenshots each frame. For
 *   phone-dw frames, the stage's <img> is fed one of Pass 1's screenshots
 *   through a `screen` search param that Playwright's own route
 *   interception resolves straight from disk — never a real Next.js
 *   route.
 *
 * Virtual time (Pass 1 only): `timeweb` (https://github.com/tungs/timeweb,
 * the library behind timecut/timesnap) is injected into the DW page via
 * `context.addInitScript` — before any of the site's own scripts run. It
 * overrides `Date.now`/`new Date`, `performance.now`, `requestAnimationFrame`/
 * `cancelAnimationFrame`, `setTimeout`/`setInterval`(+their `clear*`), and
 * seeks CSS Transitions/Animations and the Web Animations API to a virtual
 * clock that only moves when `window.timeweb.goTo(ms)` is called. We call
 * `goTo` once per captured frame, in exact 1000/60 ms steps (each frame IS
 * one 60fps tick apart), which:
 *   - fires any timers due by that virtual time,
 *   - runs exactly one requestAnimationFrame batch at that timestamp
 *     (so a scroll-driven or lerp/velocity-based rAF loop gets sampled
 *     once per rendered frame, same as it would in real playback), and
 *   - re-seeks every live CSS transition/animation's `currentTime` to
 *     match.
 * `reducedMotion` is no longer set on the DW capture context (the whole
 * point is to let its real entrances/transitions run — under a clock we
 * control instead of the wall clock).
 *
 * The sequence is then encoded to 1080p60 h264 with ffmpeg.
 *
 * Usage:
 *   node scripts/reel/render.mjs                          # default: the proof (title 0-53, phone-dw 54-149)
 *   node scripts/reel/render.mjs --scene title --from 0 --to 53
 *   node scripts/reel/render.mjs --scene phone-dw --from 54 --to 149
 *
 * Requires: `npx playwright install chromium` (once), ffmpeg on PATH,
 * `timeweb` installed (npm i -D timeweb), and the Next dev server already
 * running at http://localhost:3000.
 */

import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const BASE_URL = process.env.REEL_BASE_URL ?? "http://localhost:3000";
const FPS = 60;
const STEP_MS = 1000 / 60; // the only unit virtual time is ever allowed to move in

const PROOF_DIR =
  process.env.REEL_PROOF_DIR ??
  "/private/tmp/claude-501/-Users-jakeryall-Documents-cursor-projects-Executive-AI-Solutions-Website/ce239744-2956-4844-a879-02a81eb2b402/scratchpad/reel/proof2";
const FRAMES_DIR = path.join(PROOF_DIR, "frames");
const SCREEN_DIR = path.join(PROOF_DIR, "screen");
const OUT_NAME = `${path.basename(PROOF_DIR)}.mp4`;

const DW_URL = "https://www.desertwingsflightschool.com";

/* Capture viewport: the 54pt iOS status-bar/safe-area strip is NOT part of
   the page anymore — it's drawn as real status-bar chrome by the stage
   (app/reel/stage/page.tsx) on top of this capture. 790 + 54 = 844, the
   same total device-point height a full-screen 390x844 capture used to
   be, just split between "site content" (this capture) and "OS chrome"
   (the stage). */
const CAPTURE_W = 390;
const CAPTURE_H = 790;

/* ── scene: phone-dw scroll schedule — single source of truth ─────────
   Frames 54-83 (0.5s @ 60fps): scrollY = 0. The site's own entrance
   plays here under virtual time, with nothing else moving, so its effect
   is isolated and provable frame to frame.
   Frames 84-149 (65 frames): scrollY eases 0 -> SCROLL_MAX on the same
   bezier the stage's title-card wipe uses. This used to start scrolling
   immediately at frame 54 (see git history) — moved here, and only here,
   so the render script and the stage never disagree about it again; the
   stage's own PHONE_SCENE_FRAMES constant is unrelated (it only times the
   whole-phone 2% push, a cosmetic zoom, not the site's internal scroll). */
const SCROLL_START_FRAME = 84;
const SCROLL_END_FRAME = 149;
const SCROLL_DURATION = SCROLL_END_FRAME - SCROLL_START_FRAME; // 65
const SCROLL_MAX = 520;

const HOVER_FRAME = 108;

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

function scrollYForFrame(f) {
  if (f < SCROLL_START_FRAME) return 0;
  const u = Math.max(0, Math.min(1, (f - SCROLL_START_FRAME) / SCROLL_DURATION));
  return Math.round(SCROLL_MAX * easeInOut(u));
}

function virtualMsForFrame(f) {
  return ((f - 54) / FPS) * 1000;
}

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

/** Steps the page's virtual clock from `fromMs` to `toMs` in exact
 * 1000/60 ms increments, calling `window.timeweb.goTo` at each step —
 * never jumping straight to the target — so a scroll-linked or
 * lerp/velocity-based rAF loop on the page gets sampled once per tick,
 * the same cadence it would see in real playback. */
async function advanceVirtualClock(page, fromMs, toMs) {
  let t = fromMs;
  if (toMs <= fromMs) {
    await page.evaluate((ms) => window.timeweb.goTo(ms), toMs);
    return;
  }
  while (t < toMs - 1e-6) {
    t = Math.min(toMs, t + STEP_MS);
    await page.evaluate((ms) => window.timeweb.goTo(ms), t);
  }
}

/** Finds the on-screen center to hover for the "Book a tour" beat.
 * Prefers a visible element whose text/aria-label matches "book a tour"
 * (the DW hero's `cta cta-primary`); a lot of sites also carry an
 * sr-only span with the same text for accessibility, which has no visual
 * box, so that's explicitly excluded via the visibility check. Falls
 * back to the first visible button/link on screen if no match is
 * visible, and always reports which it picked. */
async function findHoverTarget(page) {
  return page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll("a, button"));
    function isVisible(el) {
      const r = el.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) return false;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") return false;
      if (Number(cs.opacity) < 0.05) return false;
      if (r.bottom <= 0 || r.top >= window.innerHeight) return false;
      if (r.right <= 0 || r.left >= window.innerWidth) return false;
      return true;
    }
    function label(el) {
      return (el.getAttribute("aria-label") || el.textContent || "").trim();
    }
    const tourMatch = candidates.find((el) => isVisible(el) && /book a tour/i.test(label(el)));
    const picked = tourMatch || candidates.find(isVisible);
    if (!picked) return null;
    const r = picked.getBoundingClientRect();
    return {
      matchedBookATour: Boolean(tourMatch),
      text: label(picked).slice(0, 60),
      tag: picked.tagName,
      cls: picked.className || "",
      x: r.x,
      y: r.y,
      width: r.width,
      height: r.height,
    };
  });
}

/** Pass 1: capture the live Desert Wings site under a virtual clock. */
async function captureDwScreens(browser, timewebSource, frames) {
  if (frames.length === 0) return { titleOk: true };

  const context = await browser.newContext({
    viewport: { width: CAPTURE_W, height: CAPTURE_H },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: false, // hasTouch contexts can suppress :hover — this beat needs real hover
  });

  // Inject BEFORE any of the site's own scripts run — this is what lets
  // timeweb own Date/performance.now/rAF/timers/CSS animations from the
  // very first tick of page load.
  await context.addInitScript({ content: timewebSource });

  const page = await context.newPage();

  let titleOk = true;
  await page.goto(DW_URL, { waitUntil: "load" });

  // Real (non-virtual) waits: font + hero-image readiness, so frame 0 of
  // the virtual timeline starts from a fully-painted page, not a layout
  // shift in progress. Playwright's own polling runs on the Node side, so
  // it isn't affected by the page's now-virtualized timers.
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page
    .waitForFunction(
      () => {
        const imgs = Array.from(document.images).filter((img) => {
          const r = img.getBoundingClientRect();
          return r.width > 40 && r.height > 40 && r.top < window.innerHeight && r.bottom > 0;
        });
        return imgs.length === 0 || imgs.every((img) => img.complete && img.naturalWidth > 0);
      },
      { timeout: 10000 },
    )
    .catch(() => {});

  // best-effort: dismiss the cookie banner for a clean shot, but on a very
  // short leash. DW's banner takes past a second (real time) to appear —
  // waiting for it here (the old 2000ms timeout) is exactly the "let
  // wall-time run" mistake this rewrite fixes: it single-handedly let the
  // hero's entire entrance sequence finish for real before virtual time
  // ever got control. A longer, low-frequency retry happens later in the
  // frame loop instead, gated to scroll frames only so it can never delay
  // the entrance capture.
  await page
    .getByRole("button", { name: /decline/i })
    .first()
    .click({ timeout: 150 })
    .catch(() => {});

  const title = await page.title().catch(() => "");
  console.log(`[reel] Desert Wings page title: "${title}"`);
  if (!title.includes("Desert Wings")) {
    titleOk = false;
    console.error(`[reel] ERROR: DW page title does not contain "Desert Wings": "${title}"`);
  }

  // t=0 on the virtual timeline, explicitly, before any frame is captured.
  await page.evaluate(() => window.timeweb.goTo(0));

  let lastVirtualMs = 0;
  let bannerDismissed = false;
  const clockChecks = [];
  const t0 = Date.now();

  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const scrollY = scrollYForFrame(f);
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);

    // Opportunistic banner dismissal — only once we're past the entrance
    // window (f >= SCROLL_START_FRAME) so it can never eat into it, and
    // only every few frames so it can't stall capture either.
    if (!bannerDismissed && f >= SCROLL_START_FRAME && f % 5 === 0) {
      bannerDismissed = await page
        .getByRole("button", { name: /decline/i })
        .first()
        .click({ timeout: 80 })
        .then(() => true)
        .catch(() => false);
    }

    if (f === HOVER_FRAME) {
      const target = await findHoverTarget(page);
      if (target) {
        const cx = target.x + target.width / 2;
        const cy = target.y + target.height / 2;
        await page.mouse.move(cx, cy);
        console.log(
          `[reel] hover @f=${HOVER_FRAME}: matchedBookATour=${target.matchedBookATour} ` +
            `text="${target.text}" el=<${target.tag.toLowerCase()} class="${target.cls}"> ` +
            `center=(${cx.toFixed(1)}, ${cy.toFixed(1)}) box=${JSON.stringify({
              x: Math.round(target.x),
              y: Math.round(target.y),
              w: Math.round(target.width),
              h: Math.round(target.height),
            })}`,
        );
      } else {
        console.warn(`[reel] WARNING: no visible hover target found at frame ${HOVER_FRAME}`);
      }
    }

    const targetMs = virtualMsForFrame(f);
    await advanceVirtualClock(page, lastVirtualMs, targetMs);
    lastVirtualMs = targetMs;

    if (f === 54 || f === 84 || f === 120) {
      const perfNow = await page.evaluate(() => performance.now());
      const diff = Math.abs(perfNow - targetMs);
      clockChecks.push({ f, targetMs, perfNow, diff });
      console.log(
        `[reel] clock check f=${f}: virtual target=${targetMs.toFixed(2)}ms ` +
          `performance.now()=${perfNow.toFixed(2)}ms diff=${diff.toFixed(2)}ms`,
      );
    }

    await page.screenshot({
      path: screenFilePath(f),
      clip: { x: 0, y: 0, width: CAPTURE_W, height: CAPTURE_H },
    });
    if (i % 10 === 0) {
      const elapsed = (Date.now() - t0) / 1000;
      console.log(`[reel] [pass1] screen frame ${f} (${i + 1}/${frames.length}) — ${elapsed.toFixed(1)}s elapsed`);
    }
  }

  await context.close();
  return { titleOk, clockChecks };
}

/** Pass 2: composite the stage, frame by frame. */
async function renderStage(browser, allFrames) {
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

  const timewebPath = path.join(REPO_ROOT, "node_modules", "timeweb", "dist", "timeweb.js");
  const timewebSource = await readFile(timewebPath, "utf8");

  const allFrames = [];
  for (const seg of segments) {
    for (let f = seg.from; f <= seg.to; f++) allFrames.push({ scene: seg.scene, f });
  }
  const startNumber = allFrames[0]?.f ?? 0;
  const dwFrameNumbers = allFrames.filter((x) => x.scene === "phone-dw").map((x) => x.f);

  const browser = await chromium.launch({ headless: true });

  const { titleOk } = await captureDwScreens(browser, timewebSource, dwFrameNumbers);
  await renderStage(browser, allFrames);

  await browser.close();

  if (!titleOk) {
    console.error("[reel] ERROR: the Desert Wings title assertion failed — see log above.");
  }

  const framePattern = path.join(FRAMES_DIR, "f%04d.png");
  const outPath = path.join(PROOF_DIR, OUT_NAME);
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
