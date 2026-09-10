"use client";

import { Suspense, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { notFound, useSearchParams } from "next/navigation";
import { Archivo } from "next/font/google";
import "./stage.css";

/* Archivo is requested WITH the wdth axis on purpose — see app/dark/page.tsx
   for why: pulled without it, Google silently serves default-width Archivo,
   a different, worse face, with no error visible in a screenshot review. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

/* ── cubic-bezier solver ──────────────────────────────────────────────
   Every beat on this stage is a pure function of the frame number `f`.
   CSS transitions can't be scrubbed by a render script, so the same
   cubic-bezier curves the design calls for are solved here in JS: given
   a normalized time `x` in [0,1], bisect for the parametric `t` whose
   bezier-X matches `x`, then return bezier-Y at that `t`. */
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const bx = (t: number) => {
    const mt = 1 - t;
    return 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t;
  };
  const by = (t: number) => {
    const mt = 1 - t;
    return 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t;
  };
  return (x: number) => {
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

// Apple keynote title-card wipe: "little in the first third, most in the middle."
const wipeEase = cubicBezier(0.6, 0, 0.25, 1);

function clampPct(n: number) {
  return Math.max(0, Math.min(100, n));
}

/* ── scene: title ──────────────────────────────────────────────────── */

const TITLE_TEXT = "A website that books";
/* 30 frames = 500ms: the TOP of the keynote's measured 300-500ms band,
   not the bottom. At 23 (383ms) the card read as hurried next to the live
   footage — Apple's title cards look expensive because the wipe takes its
   time and then the line is allowed to SIT. The hold is the render range's
   job (see scripts/reel/render.mjs --to), and wants ~1s minimum after this
   finishes; the exit stays a hard cut. */
const WIPE_FRAMES = 30;

/* The line is a PARAMETER, not a constant: the reel needs several title
   cards cut against each other, and they only read as one system if every
   one of them is the same wipe on the same ground in the same face. Passing
   the words in keeps that guaranteed by construction — there is exactly one
   TitleScene, so there is exactly one way a title card can behave. Omit the
   param and it falls back to the board's opening line. */
function TitleScene({ f, text = TITLE_TEXT }: { f: number; text?: string }) {
  const u = Math.max(0, Math.min(1, f / WIPE_FRAMES));
  const p = f <= WIPE_FRAMES ? wipeEase(u) : 1; // every frame past 30 holds fully revealed
  const rightInset = clampPct((1 - p) * 100);
  const edgeInset = clampPct((1 - p) * 100 - 2.5); // ~48px leading edge at 1920 wide

  return (
    <div className="stage-title">
      <span
        className="stage-title__edge"
        style={{ clipPath: `inset(0 ${edgeInset}% 0 0)` }}
        aria-hidden
      >
        {text}
      </span>
      <span
        className="stage-title__main"
        style={{ clipPath: `inset(0 ${rightInset}% 0 0)` }}
      >
        {text}
      </span>
    </div>
  );
}

/* ── scene: cascade ────────────────────────────────────────────────────
   itsjay's reel does this over and over: several real page screenshots
   fanned into a deck, held for about a second, hard cut away. It is the
   one move that says "there is a whole site here" without ever asking the
   viewer to read a page — the pages are TEXTURE at this size, and the
   shape of the deck is the message.

   Same two-pass trick as phone-dw, and for the same reason: the live
   client sites refuse to be framed, so Pass 1 of the render script shoots
   each page top-level and Pass 2 composites the results here as plain
   <img>s fed through /reel-page/<slug>.png — a URL the render script
   intercepts, never a real Next.js route.

   The deck is a pure function of `f` like everything else on this stage.
   Cards do not fade: they start nearly stacked and are REVEALED by the
   spread, which is what makes it read as paper rather than as a slideshow.
   The front card leads and the ones behind it follow on a stagger, so the
   deck opens from the front instead of all of it sliding at once. */

const CASCADE_FRAMES = 54; // 0.9s at 60fps
const CASCADE_STAGGER = 5; // frames between one card and the next
const CARD_W = 740;
const CARD_H = 463; // 1440x900 capture, same 1.6 aspect — so the page is never cropped
const FAN_DX = 330;
const FAN_DY = -78;
const FAN_ANGLE = -2.6;
const START_TIGHTEN = 0.16; // how compressed the deck is on frame 0

function CascadeScene({
  f,
  pages,
  ground,
}: {
  f: number;
  pages: string[];
  ground: string;
}) {
  const n = pages.length;
  const travel = Math.max(1, CASCADE_FRAMES - (n - 1) * CASCADE_STAGGER);

  return (
    <div className="stage-cascade" style={{ background: ground }}>
      <div className="stage-cascade__deck">
        {pages.map((slug, i) => {
          const k = i - (n - 1) / 2;
          // the LAST card is the front of the deck, so it is the one that
          // moves first — the others are uncovered in its wake
          const delay = (n - 1 - i) * CASCADE_STAGGER;
          const u = Math.max(0, Math.min(1, (f - delay) / travel));
          const p = wipeEase(u);
          const spread = START_TIGHTEN + (1 - START_TIGHTEN) * p;

          return (
            <div
              key={slug}
              className="stage-cascade__card"
              style={
                {
                  "--cw": `${CARD_W}px`,
                  "--ch": `${CARD_H}px`,
                  zIndex: i,
                  transform:
                    `translate(${k * FAN_DX * spread}px, ${k * FAN_DY * spread}px) ` +
                    `rotate(${k * FAN_ANGLE * spread}deg) scale(${0.94 + 0.06 * p})`,
                } as React.CSSProperties
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- a
                  render-script-fed page capture, not an optimizable asset */}
              <img src={`/reel-page/${slug}.png`} alt="" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── scene: phone-dw ───────────────────────────────────────────────────
   The live Desert Wings site sends `x-frame-options: SAMEORIGIN`, so it
   can never actually render inside an <iframe> here — Chrome blocks the
   frame outright (net::ERR_BLOCKED_BY_RESPONSE). Instead this is a
   two-pass render: the render script's Pass 1 opens the real site
   top-level (no framing at all, so nothing blocks it) in its own mobile
   viewport, scrolls it, and screenshots each frame to disk. Pass 2 (this
   page) just composites those screenshots into the phone bezel as a
   plain <img>, fed a per-frame URL through the `screen` search param —
   intercepted by the render script's own Playwright route handler, never
   a real Next.js route. */

const PHONE_H = 950;
const PHONE_RATIO = 9 / 19.5;

/* ── phone geometry, derived from a HEIGHT ─────────────────────────────
   Every dimension of the mockup is a ratio of its own height, so the whole
   device can be drawn at any size by changing one number. That exists for
   the zoom-through: see the note on ZOOM_TARGET for why the zoom changes
   this height rather than applying a transform. */
function phoneGeom(h: number) {
  const k = h / 950; // vs the resting phone, so the trims scale with it
  const w = h * PHONE_RATIO;
  const rim = 3 * k;
  const hilite = 1 * k;
  const bezel = 5 * k;
  const inset = rim + hilite + bezel;
  const sw = w - inset * 2;
  const sh = h - inset * 2;
  // The capture is 390x790 of page content — the status bar is NOT baked
  // into those pixels. 54 + 790 = 844, the device-point height this mockup
  // represents, split between OS chrome drawn here in CSS and the page.
  const statusH = sh * (54 / 844);
  return {
    w,
    h,
    rim,
    hilite,
    bezel,
    inset,
    sw,
    sh,
    outerR: 62 * k,
    // proportional to a real 6.1" iPhone screen (~12.3% of its own width)
    screenR: sw * 0.123,
    statusH,
    contentH: sh - statusH,
    deviceScale: statusH / 54, // px per device point at this drawn size
  };
}

const PHONE_SCENE_FRAMES = 95; // (149 - 54): 1.6s at 60fps — the whole-phone
// 2% push (cosmetic zoom). Unrelated to the site's own scroll timing, which
// scripts/reel/render.mjs owns exclusively (see SCROLL_START_FRAME there).

/* ── the zoom-through ──────────────────────────────────────────────────
   The board's hardest transition: the phone's SCREEN grows until it is the
   frame, and the reel hard-cuts out of it into the same content laid out
   for desktop. It only works as a MATCH cut — by the time the zoom lands,
   the phone is parked showing the stacked panels, and the shot it cuts to
   is those same panels side by side on desktop.

   THIS RESIZES THE PHONE INSTEAD OF SCALING IT, and that is the whole
   difference between the move working and not. A `transform: scale()`
   rasterises a layer at roughly its layout size and then stretches that
   texture, so pushing a 420px-wide phone out to ~1990px goes soft no
   matter how much resolution the capture supplies — measured: raising the
   screen capture from 3x to 8x moved sharpness only +17% and it still sat
   below every other shot in the reel. Driving the layout HEIGHT makes
   Chrome lay out and re-rasterise every frame at full size instead. That
   is expensive per frame, which would matter in a browser and does not
   matter at all in an offline render.

   Two other things make or break it. It must OVERFILL — stop at exactly
   frame-width and the screen's own rounded corners show in the corners of
   the shot — and it must still be MOVING at the cut, or it reads as two
   shots rather than one gesture. Both are why this ends mid-curve. */
const ZOOM_START = 150;
const ZOOM_FRAMES = 66; // the curve's full length — the shot ends before this
const ZOOM_TARGET = 5.4; // multiple of the phone's resting size

function StatusBar({ status, pt }: { status: "light" | "dark"; pt: (n: number) => number }) {
  const glyph = status === "dark" ? "#15151a" : "#ffffff";

  return (
    <div className="stage-phone__statusbar" style={{ height: pt(54) }}>
      <span
        className="stage-phone__statustime"
        style={{ fontSize: pt(15), left: pt(28), color: glyph }}
      >
        9:41
      </span>
      <div
        className="stage-phone__island"
        style={{ width: pt(126), height: pt(37) }}
        aria-hidden
      />
      <div
        className="stage-phone__statusicons"
        style={{ right: pt(24), gap: pt(5) }}
        aria-hidden
      >
        <div className="stage-phone__cellular" style={{ height: pt(11), gap: pt(1.5) }}>
          <span style={{ width: pt(3), height: pt(5), background: glyph }} />
          <span style={{ width: pt(3), height: pt(8), background: glyph }} />
          <span style={{ width: pt(3), height: pt(11), background: glyph }} />
        </div>
        <svg
          width={pt(17)}
          height={pt(13)}
          viewBox="0 0 17 13"
          fill="none"
          style={{ display: "block" }}
        >
          <path d="M1 5a11 11 0 0 1 15 0" stroke={glyph} strokeWidth={pt(1.6)} strokeLinecap="round" />
          <path d="M3.7 8a7 7 0 0 1 9.6 0" stroke={glyph} strokeWidth={pt(1.6)} strokeLinecap="round" />
          <circle cx="8.5" cy="11" r={pt(1.3)} fill={glyph} />
        </svg>
        <div
          className="stage-phone__battery"
          style={{ width: pt(25), height: pt(13), borderColor: glyph, borderWidth: pt(1) }}
        >
          <span className="stage-phone__battery-fill" style={{ background: glyph }} />
          <span
            className="stage-phone__battery-nub"
            style={{ background: glyph, width: pt(1.5), right: pt(-2.5) }}
          />
        </div>
      </div>
    </div>
  );
}

function PhoneDwScene({
  f,
  screenSrc,
  status,
  zoom,
}: {
  f: number;
  screenSrc: string;
  status: "light" | "dark";
  zoom: boolean;
}) {
  const u = Math.max(0, Math.min(1, (f - 54) / PHONE_SCENE_FRAMES));
  const z =
    zoom && f > ZOOM_START
      ? wipeEase(Math.max(0, Math.min(1, (f - ZOOM_START) / ZOOM_FRAMES)))
      : 0;
  const g = phoneGeom(PHONE_H * (1 + (ZOOM_TARGET - 1) * z));
  const pt = (n: number) => n * g.deviceScale;

  return (
    // only the 2% cosmetic push is a transform; the zoom is real layout
    <div className="stage-phone-wrap" style={{ transform: `scale(${1 + 0.02 * u})` }}>
      <div className="stage-phone" style={{ width: g.w, height: g.h, borderRadius: g.outerR }}>
        <div className="stage-phone__rim" style={{ borderRadius: g.outerR }} />
        <div className="stage-phone__specular" aria-hidden />
        <div
          className="stage-phone__highlight"
          style={{ inset: g.rim, borderRadius: g.outerR - g.rim }}
        />
        <div
          className="stage-phone__bezel"
          style={{ inset: g.rim + g.hilite, borderRadius: g.outerR - g.rim - g.hilite }}
        />
        <div
          className="stage-phone__screen"
          style={{ inset: g.inset, borderRadius: g.screenR }}
        >
          <StatusBar status={status} pt={pt} />
          <div className="stage-phone__content" style={{ height: g.contentH }}>
            {screenSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- a
              // render-script-fed frame capture, not an optimizable asset
              <img className="stage-phone__screen-img" src={screenSrc} alt="" />
            ) : null}
          </div>
          <div className="stage-phone__reflection" aria-hidden />
        </div>
        <div className="stage-phone__buttons" aria-hidden>
          <span className="stage-phone__btn stage-phone__btn--mute" />
          <span className="stage-phone__btn stage-phone__btn--vol-up" />
          <span className="stage-phone__btn stage-phone__btn--vol-down" />
          <span className="stage-phone__btn stage-phone__btn--power" />
        </div>
      </div>
    </div>
  );
}

/* ── stage root ────────────────────────────────────────────────────── */

function Stage() {
  // The root layout wraps every page in <main class="... relative z-10">,
  // which establishes its own stacking context — inside it, no z-index on
  // .stage can out-rank the app's own fixed chrome (nav, chat pill, CTA),
  // because from the outside the whole subtree is capped at main's z-10.
  // Portaling .stage straight onto <body> makes it a sibling of that
  // chrome instead of a descendant, so z-index compares directly again.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const searchParams = useSearchParams();
  const scene = searchParams.get("scene") ?? "";
  const fParam = Number.parseInt(searchParams.get("f") ?? "0", 10);
  const f = Number.isFinite(fParam) ? Math.max(0, fParam) : 0;
  const screenSrc = searchParams.get("screen") ?? "";
  const titleText = searchParams.get("text") ?? undefined;
  const pages = (searchParams.get("pages") ?? "").split(",").filter(Boolean);
  const ground = searchParams.get("ground") ?? "#000000";
  const zoomOn = searchParams.get("zoom") === "1";
  const status = searchParams.get("status") === "dark" ? "dark" : "light";

  let content: React.ReactNode;

  if (scene === "title") {
    content = <TitleScene f={f} text={titleText} />;
  } else if (scene === "cascade") {
    content = <CascadeScene f={f} pages={pages} ground={ground} />;
  } else if (scene === "phone-dw") {
    content = (
      <PhoneDwScene f={f} screenSrc={screenSrc} status={status} zoom={zoomOn} />
    );
  } else {
    content = <div className="stage-unknown">unknown scene</div>;
  }

  const stageEl = (
    <div className={`stage ${archivo.variable}`} data-frame={f}>
      {content}
    </div>
  );

  return (
    <>
      {/* dev-only render surface — never indexed even if it leaked */}
      <meta name="robots" content="noindex" />
      {mounted ? createPortal(stageEl, document.body) : null}
    </>
  );
}

export default function ReelStagePage() {
  // dev-only tool: production builds render the app's own not-found page.
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <Stage />
    </Suspense>
  );
}
