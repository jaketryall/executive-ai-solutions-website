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
const WIPE_FRAMES = 23; // 400ms at 60fps

function TitleScene({ f }: { f: number }) {
  const u = Math.max(0, Math.min(1, f / WIPE_FRAMES));
  const p = f <= WIPE_FRAMES ? wipeEase(u) : 1; // frames 24-53 hold fully revealed
  const rightInset = clampPct((1 - p) * 100);
  const edgeInset = clampPct((1 - p) * 100 - 2.5); // ~48px leading edge at 1920 wide

  return (
    <div className="stage-title">
      <span
        className="stage-title__edge"
        style={{ clipPath: `inset(0 ${edgeInset}% 0 0)` }}
        aria-hidden
      >
        {TITLE_TEXT}
      </span>
      <span
        className="stage-title__main"
        style={{ clipPath: `inset(0 ${rightInset}% 0 0)` }}
      >
        {TITLE_TEXT}
      </span>
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
const PHONE_W = (PHONE_H * 9) / 19.5;
const OUTER_RADIUS = 62;
const RIM = 3; // titanium rim ring
const HILITE = 1; // inner highlight ring
const BEZEL = 12; // matte black ring
const SCREEN_INSET = RIM + HILITE + BEZEL;
const SCREEN_W = PHONE_W - SCREEN_INSET * 2;
const SCREEN_H = PHONE_H - SCREEN_INSET * 2;
const SCREEN_RADIUS = 50;

const PHONE_SCENE_FRAMES = 95; // (149 - 54): 1.6s at 60fps

function PhoneDwScene({ f, screenSrc }: { f: number; screenSrc: string }) {
  const u = Math.max(0, Math.min(1, (f - 54) / PHONE_SCENE_FRAMES));
  const scale = 1 + 0.02 * u;

  return (
    <div className="stage-phone-wrap" style={{ transform: `scale(${scale})` }}>
      <div
        className="stage-phone"
        style={{ width: PHONE_W, height: PHONE_H, borderRadius: OUTER_RADIUS }}
      >
        <div className="stage-phone__rim" style={{ borderRadius: OUTER_RADIUS }} />
        <div
          className="stage-phone__highlight"
          style={{ inset: RIM, borderRadius: OUTER_RADIUS - RIM }}
        />
        <div
          className="stage-phone__bezel"
          style={{
            inset: RIM + HILITE,
            borderRadius: OUTER_RADIUS - RIM - HILITE,
          }}
        />
        <div
          className="stage-phone__screen"
          style={{ inset: SCREEN_INSET, borderRadius: SCREEN_RADIUS }}
        >
          {screenSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- a
            // render-script-fed frame capture, not an optimizable asset
            <img className="stage-phone__screen-img" src={screenSrc} alt="" />
          ) : null}
          <div className="stage-phone__reflection" aria-hidden />
          <div className="stage-phone__island" aria-hidden />
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

  let content: React.ReactNode;

  if (scene === "title") {
    content = <TitleScene f={f} />;
  } else if (scene === "phone-dw") {
    content = <PhoneDwScene f={f} screenSrc={screenSrc} />;
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
