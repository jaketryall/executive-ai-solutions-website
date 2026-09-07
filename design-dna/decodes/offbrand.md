# Decode — offbrand (itsoffbrand.com) · final CTA + footer-rise sequence

URL: https://www.itsoffbrand.com/ (offbrand.pro is a parked GoDaddy domain — NOT the
studio; confirmed via WebSearch → real homepage title "OFF+BRAND. | Global Creative
& Technology Studio"). Viewport: 1440×900 and 390×844 (isMobile, hasTouch). Date:
2026-09-06.

## 1. Structure

The "final CTA" and the "footer" are **one single section**, not two:
`section.s.is-footer` (height 665.9px @1440) contains, top to bottom: the CTA
heading block (`.ft-cta-grid`), the footer link columns (`.grid-main.ft-btm.is--footer`),
and the wordmark (`.text-brand-footer`). There is no `<footer>` tag.

`section.s.is-footer` computed: `position: static`, `top/bottom/z-index: auto`,
`overflow: visible`, `clip-path: none`, `margin-bottom: 0`, `padding-bottom: 0`.
Its previous sibling, `section.s.is-hsc` (a pinned "showcase" section, height
2700px, `data-hide="tab"`, contains a `position:sticky` overlay `.hsc-overlay-w`),
also has `margin-bottom: 0` / `padding-bottom: 0` — **no negative margin or
padding trick reserves room for the footer.** `footer.top === shrinkSection.bottom`
exactly at every scroll position before the very end (e.g. both = 517.8125px at
scrollY 9408) — plain stacked document flow.

**Mechanism: (c) something else — a self-scaling "exit" flourish on the
PRECEDING section, not a curtain and not a footer-side parallax.**
- The footer/CTA/wordmark never move independently of native scroll (see §2 —
  `transform: none` on all of them, at every sample, 1:1 with `scrollY`).
- Instead, `section.s.is-hsc` (the light/gradient showcase card immediately above
  the footer) shrinks from `scale(1)` to `scale(0.9522)` around its own **center**
  (`transform-origin: 720px 1350px` = exactly width/2, height/2) only in the
  **final ≈230px of total scroll** (last ~2.4% of the 9691px scroll range).
  `border-radius: 30.4762px` is present on that box at every scroll position,
  including scale = 1 — the radius is a **constant**, never animated; only
  `scale` changes. Because the box shrinks around its center while staying in
  normal flow (its layout footprint doesn't change), a ~64.5px gap opens between
  its now-higher bottom edge and the footer's fixed layout position — the dark
  footer background bleeds through that gap, which combined with the now-visible
  rounded corners reads as "the light card rolls back to reveal the dark footer."
  This is the one moment in the whole sequence that looks like a "reveal."

## 2. Per-element scroll samples (1440×900, 8 positions from maxScroll−2.2vh to maxScroll)

`vh = 900`, `maxScroll = 9691px`. Positions: 7711, 7994, 8277, 8560, 8842, 9125,
9408, 9691.

| scroll% (of window) | footer top | wordmark top | heading top | btn top | shrinkSection transform |
|---|---|---|---|---|---|
| 0 (7711) | 2214.8 | 2805.6 | 2291.0 | 2510.6 | none (scale 1) |
| .14 (7994) | 1931.8 | 2522.6 | 2008.0 | 2227.6 | none |
| .28 (8277) | 1649.3 | 2240.1 | 1725.5 | 1945.1 | none |
| .43 (8560) | 1366.3 | 1957.1 | 1442.5 | 1662.1 | none |
| .57 (8842) | 1083.3 | 1674.1 | 1159.5 | 1379.1 | none |
| .71 (9125) | 800.3 | 1391.1 | 876.5 | 1096.1 | none |
| .86 (9408) | 517.8 | 1108.6 | 594.0 | 813.6 | none |
| 1.0 (9691=max) | 234.8 | 825.6 | 311.0 | 530.6 | **scale(0.9522)** |

Every row (footer, wordmark, heading, btn) moved by exactly Δscroll px between
consecutive samples (e.g. 7711→7994 = +283px scroll, footer top 2214.8→1931.8 =
−283px) — **rate = 1.000 px/px, native flow, no lag, no parallax, `opacity`/
`filter`/`clip-path` unchanged (`1`/`none`/`none`) throughout.**

**Damping / curve, isolated on `section.s.is-hsc`'s scale:** settled at
scroll=0 for 2000ms → `scale = 1.000` exactly (no static offset). Instant JS
jump from scroll=0 to `maxScroll`, sampled by wall-clock time (not scroll
position):

| t (ms) | scale | fraction of Δ(0.0478) covered |
|---|---|---|
| 0 | 1.0000 | 0% |
| 51 | 0.9911 | 19% |
| 102 | 0.9828 | 36% |
| 203 | 0.9695 | 64% |
| 404 | 0.9541 | 96% |
| 706 | 0.9522 | 100% (settled) |

Fits a **fixed-duration ease-out tween, ≈500ms, power2.out** (predicted values
at 51/102/203/404ms: 19.4/36.7/64.7/96.3% vs actual 18.6/36.0/63.8/96.0% — within
1pt at every sample). This is **not** a per-frame exponential lerp: the implied
instantaneous rate constant rises from ~4.0/s (t=51) to ~8.0/s (t=404), which a
constant-rate lerp would not do. Read as a GSAP `scrub`-smoothed ScrollTrigger
tween (duration ≈0.5s) reacting to the boundary being reached, not a chase.

**One shared scroll value:** yes — `window.scrollY` after Lenis has applied its
own internal smoothing; `html` carries class `lenis` (Lenis is mounted). No
`window.lenis.options` is exposed at runtime (`window.lenis = {version}` only, a
namespace stub) so lerp/duration couldn't be read directly; behavior (instant
`scrollTo` jumps land immediately, confirmed by `scrollY` reading the target on
the very next frame) indicates Lenis's own per-frame lerp is fast/negligible at
the sampling granularity used here — the ~500ms settle documented above belongs
to the `.s.is-hsc` scale tween, not to Lenis.

## 3. Final CTA

Copy (exact, four lines + inline button): **"How about" / "we do a thing" /
"or two, [Get in touch →]" / "To+Gether"** — all-caps rendered via
`text-transform: uppercase` on lowercase-authored text.

Heading (`.h-a.is-sub` inside `.mbm-diff`, per line):
`font-family: "Ataero Retina OB Edition", sans-serif`; `font-size: 102.857px`
(1440) / `41.2698px` (390); `font-weight: 400`; `letter-spacing: normal`;
`line-height: 102.857px` (1:1, tight — matches font-size exactly); `color:
rgb(229, 228, 224)`. Desktop font-size ÷ viewport width = 7.14vw; mobile =
10.58vw — **not** a fluid vw formula, a discrete per-breakpoint override (unlike
the wordmark, see §4).

Each line is doubled in markup (`.mbm-diff` = two copies of the same text, e.g.
"How aboutHow about") but `overflow: visible` on the wrapper and no `transform`
at rest — this is **not** a translating marquee; most likely a hover-triggered
text-swap/scramble module reused site-wide. No independent motion observed on
load or scroll.

Layout: heading block left-aligned, `left: 19.05px` from section edge (not
centered), `.ft-cta-grid` (`grid-main`) width 809.8px of the 1440px section —
roughly the left 56%; footer nav columns occupy the right side. No
`max-width`/centering applied to the grid itself (`grid-main` handles the
column split). Button sits **inline** with the third heading line ("or two,")
via `.ft-cta-row` (`display:flex`) on desktop; on mobile it drops to its own row
below all four heading lines (separate DOM node, `hide-m`/mobile-only pair).

Button (`.btn-w.is-large`): `height: 75.13px` (1440) / `50px` (390);
`border-radius: 152.38px` (1440) / `41.27px` (390) — effectively a full pill at
both sizes (radius ≫ half-height, clamps visually); `background:
rgb(29, 29, 29)`; `color: rgb(229, 228, 224)`; `border: 1px solid
rgba(218, 218, 218, 0.2)`; `padding: 0` (inner padding lives on `.btn-inner`).
Hover: the arrow icon (`.btn-icon-w .text-small.btn-txt`) translates
`matrix(1,0,0,1,24.381,0)` (+24.38px on X, ≈ one icon-width) with
`transition: transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)` (a slow,
strong ease-out). A separate `.btn-bg-w > .btn-bg-fill` (position absolute,
0×0 at rest) exists for what is very likely a cursor-anchored fill-reveal on
hover, but the synthetic hover event used for this decode didn't carry real
cursor coordinates so it never grew — treat its existence as confirmed, its
exact curve as unmeasured.

Colours: `section.s.is-footer` background is **transparent**
(`rgba(0,0,0,0)`) at every level (`.ft-cta-grid`, `.grid-main.ft-btm` all
transparent too) — the CTA and the footer links sit on the same single
`body` background, `rgb(29, 29, 29)` (near-black, not pure black). There is
no colour seam between "CTA section" and "footer" because they are the same
box.

## 4. The wordmark

`.text-brand-footer`, text "OFF+BRAND.": `font-family: "Ataero Retina OB
Edition", sans-serif`; `font-weight: 400`; `color: rgb(229, 228, 224)`;
`opacity: 1` at every sampled scroll position (no fade-in). `text-align: start`
(left-aligned within its own box; the box itself sits right-aligned in the
footer grid via layout, not text-align).

Font-size: **70.0952px @1440** (÷1440 = **4.868vw**) and **18.9841px @390**
(÷390 = **4.867vw**) — matches to 3 decimal places, i.e. this element genuinely
scales as a fluid vw-based value (unlike the heading, §3).

Cropping: parent `.o-hidden.op-0-m` has `overflow: hidden`, but its
`getBoundingClientRect()` is **pixel-identical** to the wordmark's own rect
(both 56.07px tall @1440) at `maxScroll` — the crop box exactly fits the text's
own line box, so **100% of the wordmark's height is visible**, not a partial
mask reveal.

`translateY`: `transform: none` at the first sample (scroll = maxScroll−2.2vh)
**and** at `maxScroll` — identical, zero, at both ends. **There is no
independent "rise" applied to the wordmark node.** It appears exactly the way
every other line of footer content appears: carried into view by native
document scroll. Whatever reads as "rising" is the wordmark becoming visible
inside the viewport as the page finishes scrolling, amplified by the `.s.is-hsc`
shrink flourish happening in the same last ~230px window (§1) — a temporal
coincidence of two unrelated effects, not one authored "wordmark rise" effect.

## 5. Footer contents

- **Sitemap** column: Home / About Us / Work / Services / Contact (5 links).
- **Connect** column: Twitter / Awwwards / FWA / Instagram / LinkedIn (5
  external links, all with a `->`/`↗`-style suffix glyph).
- **Offices**: London, Glasgow (plain text, no links).
- **Admin**: Privacy, Careers.
- **AI-answer row** (`ft-nav-col is-ai`): "Ask AI for a summary of
  OFF+BRAND." + 4 icon links (Claude, ChatGPT, Perplexity, Gemini) that deep-link
  to each assistant with a pre-filled prompt describing the studio — an AEO/LLM
  discovery row, not a live element.
- **No clock, live availability indicator, or timestamp anywhere in the
  footer.**
- Link font sizes: link rows (Home/About Us/etc.) render at a small caption
  size (double-digit px at 1440, consistent with standard nav-link sizing
  elsewhere on the page); the section labels ("SITEMAP", "CONNECT", "OFFICES",
  "ADMIN") are uppercase, dimmer/lower-emphasis than the links beneath them.
  (Exact computed px for these two tiers wasn't resolved via selector lookup in
  this pass — the DOM text nodes for the labels aren't wrapped in a stable
  class distinct from their link siblings; treat font sizing here as
  "small caption tier," not a specific px number.)

## 6. MOBILE (390×844, isMobile, hasTouch)

`scrollHeight = 8487px`, `maxScroll = 7643px`. `document.documentElement.className`
= `"w-mod-js w-mod-touch dark lenis"` — Lenis's class is still present on touch.

**`section.s.is-hsc` — the ENTIRE element that drives the shrink/round-corner
flourish — is `display: none` at 390px width.** Its `getBoundingClientRect()`
is `0,0,0,0`. It carries `data-hide="tab"` in its markup (a "hide at
tablet-and-below" authoring attribute); no inline `style` attribute is set
(`el.style.display === ''`, `getAttribute('style') === null`) and no matching
CSS rule was found by walking every reachable stylesheet's `cssRules` and
testing `element.matches(selector)` — the hide is applied by a build-time or
early-init mechanism this pass couldn't fully trace to a specific rule, but the
**effect is unambiguous and total**: the node is not in layout at all below
the tablet breakpoint.

**Verdict: the "footer rise"/"wordmark rise" as Jake described it does not
exist as a distinct mobile-specific failure — because on desktop it was never
an independent footer/wordmark transform either (§2, §4). What genuinely
differs on mobile is that the ONE flourish in the whole sequence — the
`.s.is-hsc` self-scale + corner-round in the final 230px of scroll — is
entirely absent, because its host element is `display:none`.** Result: on
mobile the footer just appears via plain stacked scroll with zero exit
flourish from the section above it — flatter, but not broken; nothing errors,
nothing mis-positions, there is simply no beat there. This is **not** caused
by: a media query gating a transform (no transform-specific rule found — the
whole box is removed), a JS pointer/hover gate (the effect is scroll-driven,
not hover-driven, on desktop), overflow settings defeating sticky (moot, the
element doesn't exist), 100vh/URL-bar issues (irrelevant, no vh units involved
in the affected properties), or Lenis being touch-off (Lenis's `lenis` class
is present on touch here, and even if smoothTouch were off, native touch
scroll still drives `scrollY` and would still fire the same scale logic if the
element existed).

Mobile structure repeat (§1): footer/CTA still one section
(`section.s.is-footer`, height 951.8px, `position: static`, `overflow: visible`,
`transform: none`, `border-radius: 0`). `.ft-cta-grid` height 165.09px (4 lines
stacked, no inline button row — `.ft-cta-row` still flex but the button inside
it is the desktop-only copy at 0×0; a second, mobile-only `.btn-w.is-large`
renders below the heading block instead, `height: 50px`, `border-radius:
41.2698px`, same colours as desktop).

Mobile heading (§3 repeat): `font-size: 41.2698px` (10.58vw, vs desktop's
7.14vw — a discrete breakpoint bump, not fluid).

Mobile wordmark (§4 repeat): `font-size: 18.9841px` = **4.867vw**, matching
desktop's 4.868vw almost exactly — the wordmark alone uses true fluid vw
sizing across breakpoints; nothing else measured here does.

## 7. Screenshots

- Desktop (1440×900, maxScroll): `/private/tmp/claude-501/-Users-jakeryall-Documents-cursor-projects-Executive-AI-Solutions-Website/ce239744-2956-4844-a879-02a81eb2b402/scratchpad/ref-offbrand-1440.jpeg`
- Mobile (390×844, maxScroll): `/private/tmp/claude-501/-Users-jakeryall-Documents-cursor-projects-Executive-AI-Solutions-Website/ce239744-2956-4844-a879-02a81eb2b402/scratchpad/ref-offbrand-390.jpeg`

## Port recipe for /dark (desktop + touch, no JS beyond `scroll-engine.ts`)

The reference's own mechanism is thin and mostly incidental — don't port the
"wordmark rise" literally, because it isn't one. Port the one real beat (the
self-scale + corner-round exit flourish) as a **pure CSS, native-scroll**
construction so it works identically on wheel and touch, with no JS beyond the
existing `data-sp` pipeline:

1. **Keep the footer in normal flow, always.** No fixed/sticky footer, no
   negative margin, no curtain. `scroll-engine.ts` doesn't need to touch the
   footer or its heading/button/wordmark at all — they should render with
   `transform: none` at every scroll position, exactly like the reference.
   This is what makes it touch-safe by construction: nothing here depends on
   Lenis (which is desktop-wheel-only per `decisions.md`), because nothing
   here is Lenis-driven in the first place.
2. **Put the one flourish on the section BEFORE the footer**, not on the
   footer: give that section (in our case, whatever sits directly above
   `.dr-close-rig`/the footer) a **constant, pre-existing `border-radius`**
   (never animate radius — this is the same law already recorded in
   `reference_grow_effects_raster.md`/`decisions.md` for §02's room-fill) and
   drive only `scale()` via a `data-sp` var, e.g. `--exit-scale`, mapped with
   `data-sp-from="1" data-sp-to="0.95"` over a **short window keyed to the
   section's own bottom edge**, not to global scroll fraction — e.g.
   `data-sp-from`/`data-sp-to` expressed so the window spans only the last
   ~25% of viewport height of travel before the section's bottom edge exits,
   matching the reference's ~230px-of-9691px (≈2.4% of total scroll, but
   ~26% of one viewport height) window.
3. **Scale from the section's own center** (`transform-origin: center`, the
   default) so the gap that opens is symmetric top+bottom — this is what
   exposes the footer's background color through the bottom gap without any
   z-index/overlap trick.
4. **This is scale-only, transform-only** — no clip-path/inset growth, no
   width/height change — so it costs nothing extra to raster (consistent with
   `reference_grow_effects_raster.md`) and, critically, **runs identically on
   native touch scroll**, since `data-sp` is computed from `scrollY`/rect
   directly and isn't gated behind Lenis. This directly avoids the reference's
   own failure mode (a `data-hide="tab"` cutoff that removes the whole
   flourish on mobile) — our version should ship the SAME scale effect at
   every breakpoint, just re-tuned if the section's own height changes a lot
   between desktop and mobile layouts.
5. **Do not port**: the doubled-text `.mbm-diff` markup (unexplained purpose,
   likely a hover-only text-swap unrelated to scroll), the cursor-anchored
   button fill-reveal (unmeasured, hover-only, not scroll-related), or any
   attempt to make the wordmark itself "rise" — the reference doesn't do that
   either.
