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
const BEZEL = 5; // matte black ring — thinned from 12
const SCREEN_INSET = RIM + HILITE + BEZEL;
const SCREEN_W = PHONE_W - SCREEN_INSET * 2;
const SCREEN_H = PHONE_H - SCREEN_INSET * 2;
// proportional to a real 6.1" iPhone screen (~12.3% of its own width),
// not a fixed px value independent of how big this phone mockup is drawn
const SCREEN_RADIUS = SCREEN_W * 0.123;

// The capture (scripts/reel/render.mjs) shoots 390x790 of site content —
// the status bar is NOT baked into those pixels. 54 + 790 = 844, the full
// device-point height of the phone this mockup represents, split between
// real OS chrome (drawn here, in CSS) and the captured page. Everything
// in the status bar is sized off DEVICE_SCALE so it scales with the phone.
const STATUS_BAR_H = SCREEN_H * (54 / 844);
const CONTENT_H = SCREEN_H - STATUS_BAR_H;
const DEVICE_SCALE = STATUS_BAR_H / 54; // px-per-device-point at this mockup's size

const PHONE_SCENE_FRAMES = 95; // (149 - 54): 1.6s at 60fps — the whole-phone
// 2% push (cosmetic zoom). Unrelated to the site's own scroll timing, which
// scripts/reel/render.mjs owns exclusively (see SCROLL_START_FRAME there).

function StatusBar({ status }: { status: "light" | "dark" }) {
  const glyph = status === "dark" ? "#15151a" : "#ffffff";
  const pt = (n: number) => n * DEVICE_SCALE;

  return (
    <div className="stage-phone__statusbar" style={{ height: STATUS_BAR_H }}>
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
}: {
  f: number;
  screenSrc: string;
  status: "light" | "dark";
}) {
  const u = Math.max(0, Math.min(1, (f - 54) / PHONE_SCENE_FRAMES));
  const scale = 1 + 0.02 * u;

  return (
    <div className="stage-phone-wrap" style={{ transform: `scale(${scale})` }}>
      <div
        className="stage-phone"
        style={{ width: PHONE_W, height: PHONE_H, borderRadius: OUTER_RADIUS }}
      >
        <div className="stage-phone__rim" style={{ borderRadius: OUTER_RADIUS }} />
        <div className="stage-phone__specular" aria-hidden />
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
          <StatusBar status={status} />
          <div className="stage-phone__content" style={{ height: CONTENT_H }}>
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
  const status = searchParams.get("status") === "dark" ? "dark" : "light";

  let content: React.ReactNode;

  if (scene === "title") {
    content = <TitleScene f={f} />;
  } else if (scene === "phone-dw") {
    content = <PhoneDwScene f={f} screenSrc={screenSrc} status={status} />;
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
