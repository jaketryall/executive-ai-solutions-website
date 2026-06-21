"use client";

// Hero — EXPERIMENT: a LIGHT (paper) background with a centered mockup card on
// it, framed by the DESIGN / STUDIO wordmark in opposite corners (now dark).
// Static — it scrolls away into the work; the layers parallax on scroll. (The
// dark full-bleed cover is the prior version in git if this doesn't land.)

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillCTA from "./PillCTA";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// project mockups the card cross-fades through, each captioned with its client
// (mapping mirrors WorkSection's WORKS; swap for real per-client screenshots)
const COVER = [
  { src: "/Celestial Laptop Mockup.webp", client: "Wings N Wheels", label: "Local detailing" },
  { src: "/Elegant Black Laptop Mockup.webp", client: "Desert Wings", label: "Flight school" },
  { src: "/custom-dashboard-mockup.webp", client: "Riled Up", label: "Coaching platform" },
  { src: "/Rubber iPhone Mockup.webp", client: "AZ Gyro Tours", label: "Tourism" },
];

// client brands — the mini "trusted by" marquee under the statement. Text
// wordmarks for now; swap in real logo SVGs/images here when available.
const CLIENTS = ["Riled Up", "Desert Wings", "Wings N Wheels", "Lando", "AZ Gyro Tours"];

// primary nav — mirrors Navbar's LINKS. It lives in the hero's top nav lip now
// (the die-cut dark tab after DESIGN); the sticky dock takes over on scroll.
const NAV = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// SVG silhouette for the TOP NAV LIP — one continuous dark band that starts in
// the middle (after DESIGN) and runs flush to the top-right corner, carrying the
// nav AND the socials on uninterrupted black. Lando die-cut style: the TOP edge
// (y=0) and RIGHT edge (x=W) are straight so the band merges into the dark frame/
// bg; the visible LEFT shoulder is a SLANT (a diagonal cut, not a perpendicular
// fillet) with rounded ends — the band's top extends further left than its base
// (a "\" lean, mirroring the STUDIO tab's flared shoulder). The corners of the
// slant are softened with quadratic curves (the sharp corner is the control
// point) so there are no hard angles. Generated from the element's real px box
// (1 viewBox unit = 1px). M = panel top inset, so the slant lands on the panel's
// top surface, not in the frame margin. `slant` = the diagonal's horizontal run.
function topLipPath(W: number, H: number, M = 16, slant = 56, r = 17) {
  const xT = 22; // top anchor: where the slant meets the panel-top line
  const xB = xT + slant; // bottom anchor: where the slant meets the band's base
  const k = r * 0.72; // round offset measured along the diagonal
  return [
    `M 0 0`,
    `L ${W} 0`, // top edge → right (merges bg)
    `L ${W} ${H}`, // right edge down (merges bg)
    `L ${xB + r} ${H}`, // base edge left toward the slant
    `Q ${xB} ${H} ${xB - k} ${H - k}`, // round the base corner onto the diagonal
    `L ${xT + k} ${M + k}`, // the SLANT — diagonal up-left
    `Q ${xT} ${M} ${xT - r} ${M}`, // round the top corner onto the panel-top line
    `L 0 ${M}`, // along the panel-top line to the edge
    "Z",
  ].join(" ");
}

// SVG silhouette for a SIDE LIP — a small tab poking IN from a frame edge
// (left = portfolio, right = scroll). The edge that merges with the frame is
// straight; the two PROTRUDING corners are CHAMFERED (a 45° angled cut with
// rounded ends) — the same Lando die-cut language as the nav lip / STUDIO tab,
// applied at corner scale since a tall tab can't show a slant on its long edge.
// `side` flips it for the left vs right frame. c = chamfer size, r = round.
const DESIGN_SLOPE = 62 / 56; // the design slant's rise/run — reuse its exact angle

function sideLipPath(side: "left" | "right", W: number, H: number, r = 12) {
  // small dark tab poking IN from a frame edge. ONE slant on the TOP edge (the
  // line perpendicular to the frame), leaning toward DESIGN at the design angle;
  // built like the nav band: frame edge → rounded corner → slant → rounded corner
  // → inner edge. The frame edge merges into the dark gap.
  // top + bottom edges slant in OPPOSITE directions (mirror) so the tab is
  // symmetric — wide at the frame, tapering toward the inner edge. The inner +
  // frame edges stay vertical. Same rounded-corner structure on each slant.
  const topRise = W * DESIGN_SLOPE;
  const Ld = Math.hypot(W, topRise) || 1;
  const ux = (W / Ld) * r;
  const uy = (topRise / Ld) * r;
  // The frame side rides the panel edge (the gap), so its corners are CONCAVE
  // fillets, not convex rounds: the slant curves smoothly INTO the vertical
  // panel edge like a valley. Key trick — the frame fillet's vertical tangent
  // point sits just OUTSIDE the slant junction (at -uy above the top, +uy below
  // the bottom) so the curve hugs the edge inward and never bulges past it (no
  // light sliver) nor spikes (no acute point). The inner side keeps the convex
  // rounds (obtuse, so they read smooth).
  if (side === "left") {
    // top slant "\" (frame high → inner low), bottom slant "/" (mirror)
    return [
      `M 0 ${-uy}`, // frame edge, just ABOVE the top junction — tangent vertical
      `Q 0 0 ${ux} ${uy}`, // concave fillet: panel edge → top slant
      `L ${W - ux} ${topRise - uy}`, // TOP slant "\"
      `Q ${W} ${topRise} ${W} ${topRise + r}`, // convex round → inner edge
      `L ${W} ${H - topRise - r}`, // inner edge down (shorter)
      `Q ${W} ${H - topRise} ${W - ux} ${H - topRise + uy}`, // convex round → bottom slant
      `L ${ux} ${H - uy}`, // BOTTOM slant "/" (mirror)
      `Q 0 ${H} 0 ${H + uy}`, // concave fillet: bottom slant → panel edge
      "Z", // frame edge up
    ].join(" ");
  }
  // right: top slant "/" (frame high → inner low), bottom slant "\" (mirror)
  return [
    `M ${W} ${-uy}`, // frame edge, just ABOVE the top junction — tangent vertical
    `Q ${W} 0 ${W - ux} ${uy}`, // concave fillet: panel edge → top slant
    `L ${ux} ${topRise - uy}`, // TOP slant "/"
    `Q 0 ${topRise} 0 ${topRise + r}`, // convex round → inner edge
    `L 0 ${H - topRise - r}`, // inner edge down (shorter)
    `Q 0 ${H - topRise} ${ux} ${H - topRise + uy}`, // convex round → bottom slant
    `L ${W - ux} ${H - uy}`, // BOTTOM slant "\" (mirror)
    `Q ${W} ${H} ${W} ${H + uy}`, // concave fillet: bottom slant → panel edge
    "Z", // frame edge up
  ].join(" ");
}

// SVG silhouette for the STUDIO box — a self-contained die-cut card in the hero's
// bottom-right (the mirror of the nav lip). Lives entirely in the hero so its
// rounded corners are all in view (the old work-tab bridged two sections and its
// round fell off-screen). The RIGHT edge runs straight to x=W (the page edge,
// where it merges into the dark frame); the visible boundary against the light
// panel — top edge, left side, bottom edge — gets curves: a SLANT cut into the
// upper-left (rounded ends), a rounded TOP-RIGHT corner (the corner created by
// extending to the page edge), and a rounded BOTTOM-LEFT corner. 1 viewBox
// unit = 1px so the radii stay circular. `slant` = the diagonal's run.
function studioBoxPath(W: number, H: number, sx = 230, sy = 195, r = 24) {
  // The dark STUDIO pocket (bottom-right). Right + bottom edges merge into the
  // page edge. The TOP-LEFT is ONE straight SLANT — the EXACT OPPOSITE diagonal
  // to the nav band's slant (nav leans "\", this leans "/") — with rounded ends
  // to match. sx = where the slant meets the top edge; sy = where it meets the left.
  const dx = sx;
  const dy = -sy;
  const L = Math.hypot(dx, dy) || 1;
  const ux = (dx / L) * r;
  const uy = (dy / L) * r;
  return [
    `M ${sx + r} 0`, // top edge, right of the slant-top round
    `L ${W} 0`, // top edge → right (merges)
    `L ${W} ${H}`, // right edge down (merges)
    `L 0 ${H}`, // bottom edge ← left (merges)
    `L 0 ${sy + r}`, // left edge up to the slant base
    `Q 0 ${sy} ${ux} ${sy + uy}`, // round slant-base onto the diagonal
    `L ${sx - ux} ${-uy}`, // the SLANT (straight, "/") up to the top
    `Q ${sx} 0 ${sx + r} 0`, // round slant-top onto the top edge
    "Z",
  ].join(" ");
}

// The three social anchors, color-inherited (currentColor) so the same markup
// reads light on the dark lip and dark on the mobile light panel.
function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        className="focus-ring opacity-70 transition-opacity hover:opacity-100"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a
        href="https://x.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X"
        className="focus-ring opacity-70 transition-opacity hover:opacity-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href="https://linkedin.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="focus-ring opacity-70 transition-opacity hover:opacity-100"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
        </svg>
      </a>
    </div>
  );
}

// `tagline` is resolved server-side (ad campaign + geo) and passed in, so the
// matched copy renders with no flicker. See lib/personalize.ts.
export default function Hero({
  tagline = "Websites that get local brands found on Google & booked solid.",
}: {
  tagline?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);

  const [reelOpen, setReelOpen] = useState(false);
  // SINGLE-SHAPE: the light panel is ONE masked rect — a rounded rectangle with
  // the die-cut notches punched out (the dark hero bg shows through). Everything
  // is computed from the hero's real px size so the whole shape just re-flows at
  // any screen size (measured on mount + resize, never per scroll frame).
  const [hero, setHero] = useState({ w: 1440, h: 900 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHero({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const openMenu = () => window.dispatchEvent(new Event("eas-open-menu"));

  // rotate the card through the project mockups
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % COVER.length), 3800);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = ref.current;

        // Socials/menu fade out over the first stretch of scroll so they don't
        // collide with the nav dock as it reveals.
        gsap.to("[data-hero-chrome]", {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "+=30%", scrub: true },
        });

        // Parallax — layers drift at different rates as the hero scrolls out:
        // the mockup card lags while the wordmark splits apart.
        const drift = (sel: string, vars: gsap.TweenVars) =>
          gsap.to(sel, {
            ...vars,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
          });
        drift("[data-hero-mockup]", { y: 40 });
        drift("[data-hero-design]", { y: -100 });
        drift("[data-hero-tagline]", { y: -50 });
      });
    },
    { scope: ref },
  );

  // ── Die-cut layout — ONE source of truth for the notch positions/sizes. The
  // masked panel cuts these out (dark shows through); the content divs sit over
  // them using the same CSS values, so the shape + content always line up.
  const { w: W, h: H } = hero;
  const cl = (lo: number, v: number, hi: number) => Math.max(lo, Math.min(v, hi));
  const PANEL_INSET = 16; // matches md:inset-4
  const navX = cl(440, 0.4 * W, 820); // nav band starts after DESIGN
  const studioW = cl(440, 0.44 * W, 720);
  const studioH = 300;
  const studioGap = 48; // bottom-12
  const sideLeftH = 250;
  const sideRightH = 320;

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-svh overflow-hidden bg-ink-deep text-ink"
    >
      {/* ── THE LIGHT PANEL — ONE shape. A rounded-rectangle masked so the die-cut
          notches (nav band top, STUDIO bottom-right, portfolio left, scroll right)
          are punched OUT of it, letting the dark hero bg show through. The notch
          silhouettes reuse the same path helpers as before, now as black mask
          cutouts instead of dark overlays. Recomputed from the hero's px size, so
          the whole composition just re-flows at any screen width. The content
          (nav, socials, STUDIO, labels) sits on top, over the cutouts. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
      >
        <defs>
          <mask id="hero-panel-mask">
            {/* white = keep (the panel); black = cut away (dark shows through) */}
            <rect
              x={PANEL_INSET}
              y={PANEL_INSET}
              width={W - PANEL_INSET * 2}
              height={H - PANEL_INSET * 2}
              rx={44}
              fill="#fff"
            />
            {/* nav band — lg+ (below that, nav is the compact mobile cluster) */}
            {W >= 1024 && (
              <path
                d={topLipPath(W - navX, 78)}
                transform={`translate(${navX},0)`}
                fill="#000"
              />
            )}
            {/* STUDIO — md+ (below that, the static mobile STUDIO wordmark) */}
            {W >= 768 && (
              <path
                d={studioBoxPath(studioW, studioH)}
                transform={`translate(${W - studioW},${H - studioGap - studioH})`}
                fill="#000"
              />
            )}
            {/* side labels — lg+ only */}
            {W >= 1024 && (
              <>
                <path
                  d={sideLipPath("left", 50 - PANEL_INSET, sideLeftH)}
                  transform={`translate(${PANEL_INSET},${H / 2 - sideLeftH / 2})`}
                  fill="#000"
                />
                <path
                  d={sideLipPath("right", 50 - PANEL_INSET, sideRightH)}
                  transform={`translate(${W - 50},${H / 2 - sideRightH / 2})`}
                  fill="#000"
                />
              </>
            )}
          </mask>
        </defs>
        <rect width={W} height={H} fill="#efebe4" mask="url(#hero-panel-mask)" />
      </svg>

      {/* centered mockup card sitting on the light background */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          data-hero-mockup
          className="w-[44%] min-w-[280px] max-w-[660px] will-change-transform"
        >
          <div className="relative aspect-16/10 overflow-hidden rounded-[24px] border border-ink/10 bg-ink shadow-[0_40px_90px_-35px_rgba(26,24,22,0.5)]">
            {COVER.map((m, i) => (
              <Image
                key={m.src}
                src={m.src}
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 90vw, 42vw"
                aria-hidden
                className="object-cover transition-opacity duration-1000 ease-out"
                style={{ opacity: i === slide ? 1 : 0 }}
              />
            ))}
          </div>
          {/* caption — which client this mockup belongs to */}
          <div className="mt-4 flex items-center justify-center gap-2.5">
            <span className="text-sm font-semibold tracking-tight text-ink">
              {COVER[slide].client}
            </span>
            <span className="h-1 w-1 rounded-full bg-oxblood/50" aria-hidden />
            <span className="micro text-ink/55">{COVER[slide].label}</span>
          </div>
        </div>
      </div>

      {/* ── SIDE LIPS — small dark die-cut tabs notched into the panel's left &
          right edges, poking in from the dark frame (left = portfolio mark,
          right = scroll cue). With the top nav lip and the bottom STUDIO tab,
          the die-cut runs "all around" the panel. Anchored at the very edge so
          their backs merge into the dark frame; rounded only on the inner side.
          Decorative, desktop only. */}
      <div
        aria-hidden
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
        style={{ width: 50, height: 250 }}
      >
        <span className="absolute inset-0 flex items-center justify-center pr-2">
          <span className="micro block rotate-180 text-paper/55 [writing-mode:vertical-rl]">
            / Portfolio · 2K26
          </span>
        </span>
      </div>
      <div
        aria-hidden
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
        style={{ width: 50, height: 320 }}
      >
        <span className="absolute inset-0 flex items-center justify-center pl-2">
          <span className="micro block text-paper/55 [writing-mode:vertical-rl]">
            Scroll to see the work ↓
          </span>
        </span>
      </div>

      {/* giant DESIGN, top-left. Its counterpart STUDIO (which morphs to WORK)
          now lives on the work section's tab that pokes up into this corner —
          see [data-work-tab] in WorkSection.tsx. aria-label keeps the brand
          wordmark "Design Studio" as the heading. */}
      <h1 aria-label="Design Studio" className="pointer-events-none absolute inset-0">
        <span
          data-hero-design
          className="absolute left-4 top-[5%] block font-black uppercase leading-[0.82] tracking-[-0.05em] text-ink text-[11vw] will-change-transform md:left-10 md:text-[7vw]"
        >
          Design
        </span>
        {/* STUDIO — MOBILE ONLY, static. On desktop (md+) the morphing STUDIO
            lives on the work section's tab instead (and there is no [data-morph]
            here, so the morph driver finds exactly one node). */}
        <span
          aria-hidden
          className="absolute bottom-[5%] right-4 block font-black uppercase leading-[0.82] tracking-[-0.05em] text-ink text-[11vw] md:hidden"
        >
          Studio
        </span>
      </h1>

      {/* statement + mini "what we do" marquee, bottom-left */}
      <div
        data-hero-tagline
        className="absolute bottom-[8%] left-4 max-w-sm will-change-transform md:left-10"
      >
        <p className="text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-ink md:text-xl">
          {tagline}
        </p>
        <div className="mt-6 flex items-center gap-5">
          <PillCTA label="Start a project" href="#contact" />
          <a
            href="#work"
            className="group focus-ring inline-flex items-center gap-1.5 text-[13px] font-medium tracking-tight text-ink/70 transition-colors hover:text-ink"
          >
            See the work
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
        <p className="micro mt-6 text-ink/40">Trusted by</p>
        <div className="marquee-wrap mt-2 max-w-[320px]">
          <div className="mini-marquee flex w-max items-center">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center"
                aria-hidden={copy === 1 || undefined}
              >
                {CLIENTS.map((c) => (
                  <span key={c} className="flex shrink-0 items-center gap-3 pr-3">
                    <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-tight text-ink/60">
                      {c}
                    </span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-oxblood/50" aria-hidden />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOP NAV LIP — ONE continuous dark die-cut band. It starts in the
          middle (after DESIGN) with a Lando concave curve and runs flush to the
          top-right corner, merging into the dark frame. The black is unbroken
          through the nav AND the socials (no gap — see topLipPath). Menu button
          is gone. Desktop (lg+); fades on scroll as the sticky dock takes over. */}
      <div
        data-hero-lip
        data-hero-chrome
        className="absolute right-0 top-0 z-20 hidden h-[78px] lg:block"
        style={{ left: "clamp(440px, 40vw, 820px)" }}
      >
        {/* content rides over the cut-out band — nav (left) + socials (right).
            The pt-4 clears the top frame zone so it sits centred in the band;
            pl-[72px] clears the concave left curve. */}
        <div className="absolute inset-0 flex items-center justify-between pl-[72px] pr-7 pt-4 text-paper">
          <ul className="flex items-center gap-1">
            {NAV.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="group focus-ring relative block px-3 py-2 text-[13.5px] font-medium tracking-tight text-paper/75 transition-colors hover:text-paper"
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-paper transition-transform duration-300 ease-out group-hover:scale-x-100"
                    style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
                  />
                </a>
              </li>
            ))}
          </ul>
          <SocialIcons />
        </div>
      </div>

      {/* mobile chrome — the lip is a desktop composition; on phones keep a
          compact socials + menu cluster so the menu stays reachable at the top.
          Dark icons on the light panel. */}
      <div
        data-hero-chrome
        className="pointer-events-auto absolute right-4 top-5 z-20 flex items-center gap-4 text-ink lg:hidden"
      >
        <SocialIcons />
        <button
          type="button"
          onClick={openMenu}
          aria-label="Open menu"
          className="press focus-ring flex h-10 w-10 flex-col items-center justify-center gap-[4px] rounded-[10px] border border-ink/20 bg-ink/5"
        >
          <span className="block h-[1.5px] w-4 rounded-full bg-ink" />
          <span className="block h-[1.5px] w-4 rounded-full bg-ink" />
        </button>
      </div>

      {/* ── STUDIO box — self-contained die-cut card in the hero's bottom-right
          (mirror of the nav lip). Lives entirely in the hero so its slant +
          rounded corners are all visible; extends to the right page edge. Holds
          the show reel + the STUDIO→WORK morph (driven from WorkSection as the
          work section rises). Desktop (md+); the mobile STUDIO is the static
          wordmark in the h1. */}
      <div
        data-hero-studio
        className="absolute bottom-12 right-0 z-20 hidden md:block"
        style={{ width: "clamp(440px, 44vw, 720px)", height: 300 }}
      >
        <div className="pointer-events-none absolute inset-0 flex flex-col items-end justify-end gap-3 pb-8 pl-12 pr-8">
          <button
            type="button"
            onClick={() => setReelOpen(true)}
            aria-label="Watch the show reel"
            className="group focus-ring pointer-events-auto flex items-center gap-3"
          >
            <span className="relative block h-12 w-20 overflow-hidden rounded-lg border border-paper/15 shadow-lg shadow-ink-deep/40">
              <video src="/final-comp.mp4" muted loop autoPlay playsInline aria-hidden className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
            </span>
            <span className="text-left">
              <span className="micro block text-paper/45">Show reel</span>
              <span className="text-sm font-semibold tracking-tight text-paper">Watch ↗</span>
            </span>
          </button>
          <span
            data-morph
            aria-hidden
            className="pointer-events-none grid items-end justify-items-end font-black uppercase leading-[0.82] tracking-[-0.05em] text-paper text-[7vw] will-change-transform"
          >
            <span className="[grid-area:1/1] whitespace-nowrap">
              {"STUDIO".split("").map((c, i) => (
                <span key={`s${i}`} className="morph-mask">
                  <span data-morph-out className="morph-letter">
                    {c}
                  </span>
                </span>
              ))}
            </span>
            <span className="[grid-area:1/1] whitespace-nowrap">
              {"WORK".split("").map((c, i) => (
                <span key={`w${i}`} className="morph-mask">
                  <span data-morph-in className="morph-letter morph-letter-in">
                    {c}
                  </span>
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>

      {/* show-reel lightbox — portaled to body so position:fixed survives the
          ScrollSmoother transform. */}
      {reelOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-ink-deep/92 p-6 backdrop-blur-sm"
            onClick={() => setReelOpen(false)}
          >
            <button
              type="button"
              onClick={() => setReelOpen(false)}
              aria-label="Close show reel"
              className="focus-ring absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 text-paper transition-colors hover:bg-paper/10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <video
              src="/final-comp.mp4"
              autoPlay
              controls
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-auto max-w-[92vw] rounded-2xl shadow-2xl"
            />
          </div>,
          document.body,
        )}

    </section>
  );
}
