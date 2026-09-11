# Decode — cosmos.studio · whole-site reference (Jake's PRIMARY reference for the dark-room replacement)

URL: https://www.cosmos.studio/  Viewports: 1440×900 (primary), 390×844 (mobile check), 2560×1440 (ultrawide check)  Date: 2026-09-10

Stack: Webflow. Lenis 1.3.4 smooth-scroll (`new Lenis({ smooth: true, lerp: 0.2, wheelMultiplier: 1, infinite: false })`, driven by `gsap.ticker`). GSAP 3.15.0 + SplitText + ScrollTrigger (`cdn.prod.website-files.com/gsap/3.15.0/...`). keen-slider 6.8.5 for a mobile slider. No ScrollSmoother/Locomotive.

---

## 1. GROUND & PALETTE

The page has exactly ONE true canvas color: `body` = `rgb(255,255,255)`, `.main-wrapper` = `rgb(245,245,245)` (light gray), full height. There is no true "alternating background" — instead, dark regions are **rounded-corner cards laid on the constant light canvas**, not full-bleed section recolors. Measured:

| Element | Computed bg | Inset from viewport edge | Border-radius | Reads as |
|---|---|---|---|---|
| `.main-wrapper` (page canvas) | `rgb(245,245,245)` | 0 | 0 | light gray, always present |
| `HEADER.section_home-header` | `rgb(15,16,17)` (near-black) | 0 (full-bleed) | 0 | true dark section — the ONLY full-bleed dark region; mostly covered by a light `home-header_content` div on top |
| `.home-services_component` ×2 (services blocks) | `rgb(0,0,0)` | **16px constant, both sides, at 1440 AND 2560** | 20px | dark "sheet" card, not a section-level recolor |
| `.cta_component` | `rgb(15,16,17)` | inside a still-light `SECTION.section_cta` | (card, not sampled for radius) | same card pattern |
| `.section_clients`, `.section_about`, `.section_testimonials`, `.section_footer` (via `SECTION.section` wrapper) | `rgb(245,245,245)` / `rgb(255,255,255)` (footer div) | — | — | light |

Scroll-order ground read (document top→bottom, y in px): dark (0–~900, hero) → light (~900–6971, clients+works) → dark card (6971–8619, services #1) → light (8619–9547, about) → dark card (9547–11465, services #2 + timeline) → light (11465–13457, testimonials+CTA-frame) → dark card (12717–13457, CTA) → light/white (13457–14396, footer). **Net: alternates dark↔light 4 times**, but only 1 of those (the hero) is a genuine full-bleed section background; the other 3 dark passages are 16px-inset rounded cards on a page that is light gray the entire time.

Ink colors measured (real rendered color, not sr-only duplicates):
- On light (`#f5f5f5`/white): headings `rgb(15,16,17)` — contrast **17.47:1**. Body/secondary `rgb(102,102,102)` — contrast **5.27:1**.
- On dark (`rgb(0,0,0)` / `rgb(15,16,17)`): headings/links `rgb(255,255,255)` — contrast **21:1** / **19.05:1**. Secondary `rgb(128,128,128)` on black — **5.32:1**. Inactive tab pill: bg `rgb(40,40,41)`, text `rgb(182,182,182)` (muted-state pairing, not a bug).

Accent: a single red/orange-red (`#ff4d1a`-family, seen as the numbered-badge fill "①②③④" and the 3D ribbon icon) appears ONLY as a small numbered marker or a small 3D decorative object — never as a text color, button fill, or link color. Buttons are always black-on-white or white-on-black. No blue, no green, no brand-hue system beyond that one red accent used sparingly.

## 2. TYPE

Fonts actually served (network, all `.woff2` variable fonts from Webflow's CDN):
- `Switzer-Variable.woff2` — the display/heading/UI sans (`font-family: Switzer, sans-serif`). Carries ~90% of the page's type.
- `InterVariable.woff2` — secondary body/paragraph sans (`Inter, sans-serif`), used for testimonial copy, tag pills, some captions.
- `RobotoMono-VariableFont_wght.woff2` — used for the tiny `(01)` `(02)` award-badge numerals only (`"Roboto Mono", sans-serif`).
- `digital-7 (mono).woff2` — a 7-segment digital-clock display font, used ONLY for the footer's 3 live timezone clocks.
- (Clutch's own `Roboto-Regular.ttf` loads inside the review-widget iframe — not part of the host page's system.)

The hero wordmark "COSMOS STUDIO" is **not text** — it is bespoke SVG letterforms (`<svg viewBox="0 0 88 262">` per glyph, `class="logo-letter"`, `fill="currentColor"`), one path per character. It is outside the type scale entirely.

Distinct computed font-sizes at 1440 (deduped, excluding 1-character SplitText span artifacts):

| px | weight | family | letter-spacing | used for |
|---|---|---|---|---|
| 160 | 500 | Switzer | -4.8px | the 3 odometer stat numbers ("500", "12", "60+") — one-off hero-number size |
| 96 | 500 | Switzer | -1.92px | H1 hero heading + CTA heading ("Start your project with Cosmos") — the two loudest statements on the page, same size |
| 80 | 400 | Digital-7 Mono | -0.15px | footer clock digits (ghost "88:88"-style unlit-segment background of the 7-seg font) |
| 64 | 500 | Switzer | -0.64px | H2 section headers ("Selected works", "Our design services…") |
| 48 | 500 | Switzer | -1.44px | the "+" suffix on "60+" |
| 44 | 500 | Switzer | -0.88px | H2 "A boutique design team…" (About) |
| 32 | 400 | Digital-7 Mono | -0.15px | clock "am/pm" |
| 28 | 500/600 | Switzer | -0.15 to -0.56px | works-card year/niche values; H3 "A strong team of real humans" |
| 20 | 400 | Switzer | -0.15 to -0.4px | "Services" tab label; H4 "Weekly syncs" |
| 18 | 400/500 | Switzer | -0.36 / 0.18px | H3 "Europe based"; "Timeline & Process" label |
| 16 | 400/600 | Switzer | -0.15px | service-item tag text; secondary body |
| 15 | 400/500/600 | Switzer + Inter | -0.15 / normal | nav items, tab uppercase micro-labels, testimonial body copy |
| 14 | 400/500 | Switzer + Inter | -0.14 to -0.28px | small links, "3× FWA of the Day" captions, H3 project names |
| 13 | 500 | Switzer | -0.15px | "Business Developer" sub-label |
| 12 | 400/500/600 | Switzer + Inter | -0.15 / normal | eyebrow uppercase labels ("WE ARE"), "See work", pagination digits |
| 9.6–9.9 | 400/600 | Inter + Roboto Mono | normal/uppercase | tiny "(01)" award-badge numerals |

**Rung count**: the reusable heading/body hierarchy is genuinely small — **~7 core rungs** (96 / 64 / 44 / 28 / 20 / 16 / 12) carrying essentially all headings, labels and body copy. 160/80/48/32 are one-off "hero number" or clock-widget specialty sizes, not part of the reusable scale. 15/14/13/9.6–9.9 are Inter/mono micro-variants nested one px apart from the Switzer rungs — noise from two type families coexisting, not deliberate rungs.

Weights used: 400 (body), 500 (the default — nearly everything, including most "headings"), 600 (a few small emphasized labels: "Product UI/UX Design" service-card headers, tab uppercase text). No 700/800/900 anywhere measured.

Letter-spacing on display type is consistently **negative and tightens with size** (-4.8px at 160px ≈ -3% of font-size; -1.92px at 96px ≈ -2%; -0.64px at 64px ≈ -1%) — a standard proportional tracking-in curve, not a fixed px value.

Display type is **tight** (line-height ≈ font-size, e.g. 96px/96px, 64px/70.4px) and **sentence case** throughout for headings/body. Caps are reserved for small labels only (nav eyebrows "WE ARE", tab captions) at 12–15px with `text-transform: uppercase`.

## 3. LAYOUT & SPACING

- Page measure (`.container-large`, the primary content column): **1376px at 1440** (32px gutter each side) → **1520px at 2560** (520px gutter each side). Gutter is NOT constant — it grows with viewport, i.e. content measure is capped, not fluid-full-width.
- A second, FIXED narrow container (`.container-xxsmall`, used for the "Selected works" head caption): exactly **720px at both 1440 and 2560** — does not scale with viewport at all.
- The dark "sheet" cards (`.home-services_component`, `.cta_component`) use a THIRD, independent rule: **16px inset from the viewport edge, constant at both 1440 and 2560** (1408px wide at 1440, 2528px at 2560) — these cards are viewport-relative, not content-column-relative.
- Vertical rhythm between top-level sections: **0px** — every section starts exactly where the previous one's bounding box ends (measured: clients 1530→2590, works 2590→6971, services 6971→8619, about 8619→9547, services 9547→11465, testimonials 11465→12717, cta 12717→13457, footer 13457→). Separation is achieved by hard background-color cuts (dark card vs. light canvas) plus each card's own internal top/bottom padding — never by an inter-section whitespace gap.
- Grid: no visible multi-column CSS grid for page layout: it's a single centered content column (`container-large`/`container-xxsmall`) with asymmetric SPLITS inside individual sections — the clearest is the About section, a 50/45-ish split (light text column left, dark rounded orbit-diagram card right, not a clean 50/50).
- Content sits on surfaces almost everywhere: works cards are literal rounded-rect frames (20px radius, `overflow:clip`); services rows sit inside the dark sheet card; the bento tiles in services-#2 (calendar mockup / chat mockup / awards-sphere tile) are each their own rounded card; testimonials sit in a white bordered card. Nothing of substance is bare on the raw canvas except section eyebrow labels and section headings themselves.

## 4. SECTION LINEUP (top → bottom, document y-ranges at 1440)

| # | y-range | Job | Archetype | Density | Seam to next |
|---|---|---|---|---|---|
| 1 | 0–1530 | Hero: SVG wordmark "COSMOS STUDIO" + 4 service labels + autoplay showreel video in a lightbox | Full-bleed dark section, light content card on top | Low (one big statement + one video) | Hard color cut, no gap |
| 2 | 1530–2590 | "UI/UX design agency that keeps your product growing" — H1 + intro + embedded Clutch rating widget + a scrolling row of award badges (FWA/Awwwards/CSS DA/Orpetron/Red Dot/CSS Winner, repeated 3×) | Statement + credibility marquee | Low-medium | None (flush) |
| 3 | 2590–6971 | "Selected works" — 5 case-study cards | **Sticky-stacking card list** (see §5) | Medium (one big image per screen) | Bottom-of-viewport progressive blur (§7) softens each card's entrance |
| 4 | 6971–8619 | "Our design services and the industries we design for" — tabbed (Services/Industries) numbered row list | Dark inset card, single-column numbered rows w/ thumbnail | Medium | Hard color cut (dark card → light canvas), 0px gap |
| 5 | 8619–9547 | "A boutique design team…" — About statement + 2 stat rows | Split: light text column + dark rounded card (orbiting team-photo diagram) | Low | Hard color cut into next dark card |
| 6 | 9547–11465 | "A UX design partner…" — asymmetric bento (calendar mockup / chat mockup / awards-sphere) + full-width "Timeline & Process" bar + numbered process ruler (01 Discovery…05 Delivery) | Dark inset card, bento grid | High (most visually dense section on the page) | Hard color cut |
| 7 | 11465–12717 | "Verified by Clutch™ reviews" — embedded 3×2 Clutch widget grid + 3 odometer stat numbers (500 / 12 / 60+) | White bordered card + giant numerals below on bare canvas | Medium | None (flush into CTA) |
| 8 | 12717–13457 | "Start your project with Cosmos" — CTA with 3D chrome figure art + "Get in Touch" | Dark inset card, centered | Low | Hard color cut to white footer |
| 9 | 13457–14396 | Footer: page/contact links, working contact form, email w/ copy button, 3 live timezone digital clocks | White, multi-column | Medium | (page end) |

## 5. MOTION — measured

**Smooth scroll**: Lenis 1.3.4 mounted, `lerp: 0.2`, native-scroll mode (not a transformed wrapper). `lenis.on('scroll', ScrollTrigger.update)` — all ScrollTrigger scrub effects ride Lenis's smoothing, not raw wheel deltas. Programmatic `scrollTo()` fights Lenis's own target and produces non-monotonic jumps unless forced every rAF frame for ~20 frames (measured artifact of this smoothing, not a page bug — noted so nobody re-measures this site and gets confused by the same noise).

### 5a. "Selected works" — sticky-stacking cards (the headline effect on the page)

**Mechanism**: `.works_item` = `position: sticky; top: 0px`. Each of the 5 case-study items pins flush to the viewport top in DOM order, so each new card's sticky box naturally paints OVER the previous one (no z-index needed — later DOM order wins). This produces a "cards dealt on top of each other" stack as you scroll.

**What moves**: `.works_card-wrap` (scale only) and, nested inside it, `.works_image` (scale only) — NOT the well itself. The well (`.works_card`, `position:relative; overflow:clip; border-radius:20px`, 1125×750 at 1440) never moves or scales; it is the static clip frame.

**Surplus**: at rest (pre-trigger) `.works_image` renders at scale **1.20** (1350×900 against a 1125×750 well = 20% oversized both axes, clipped by the well's rounded corners) and `.works_card-wrap` at scale **1.10**.

**Rate / curve (measured, forced-scroll sampling, 12+ points, card index 2)**:
- `.works_image` scale drops from 1.20 → 1.00 **perfectly linearly** across scrollY ≈ 3411 → 4311 (≈900px of scroll). Per-100px deltas: -0.01982, -0.02221, -0.02222, -0.02222, -0.02222, -0.02222, -0.02222, -0.02222 (constant to 3 decimal places) — this is a **linear scrub (ease: none)**, not eased. Rate ≈ **-0.000222 scale-units/px**.
- `.works_card-wrap` scale drops 1.10 → 1.00 over the SAME scroll window, rate ≈ **-0.000111 scale-units/px** (half the image's rate, since it travels half the distance).
- The card's own `top` position (the sticky pin approach) moves **exactly 1:1 with scroll** (rate = 1.0, no lag) until it hits `top: 0` and clamps — confirmed by `wrapTop` decreasing by precisely 100px for every 100px of forced scroll, right up to the pin point.
- Once pinned, the scale-settle finishes at the SAME scrollY the pin completes at — both driven by one shared ScrollTrigger against the same trigger element.
- Per-card scroll cycle (pin-to-pin): **≈880–920px** (measured card-2→card-3 pin transition = 800→0 over 880px of scroll).

**Damping**: none on the tween itself (raw linear scrub); the only smoothing in the system is Lenis's page-level lerp 0.2 feeding ScrollTrigger's `.update()`.

**Not animated** (checked, ruled out): `.works_label` ("Neo Vision / See work") is NOT a hover-reveal — `opacity: 1` at rest, always visible. Attempted to trigger a hover-tilt via synthetic `mousemove`/`mouseenter` dispatch on `.works_card-wrap` (its inline style ships baseline `rotateX(0deg) rotateY(0deg) skew(0deg,0deg)`, suggesting a wired 3D-tilt interaction) — no transform change resulted from synthetic events in 20 rAF frames. Either it requires a trusted pointer event this harness can't dispatch, or it's inert boilerplate. **Not confirmed either way — do not assume it's live.**

**Compositing**: `.works_item`, `.works_card-wrap`, `.works_image` all carry `will-change: transform` (only transform, only scale is animated — no clip-path/inset growth on this element, so it does NOT re-raster per frame per the grow-effects-raster lesson; it's a pure composited scale).

### 5b. Bottom-of-viewport progressive blur

A `position: fixed` band (`.progressive-blur_wrap`, z-index 30, full 1440px width) sits at viewport y=804–900 (bottom 96px of the screen) for the entire page, built from **10 stacked panels** (`.progressive-blur_panel.is-1` … `.is-10`) with geometrically halving blur radii: 12px, 6px, 3px, 1.5px, 0.75px, 0.375px, 0.1875px, 0.09375px, 0.046875px, 0.0234375px. This is the standard "progressive blur" fake-gradient-blur technique (CSS can't blur-gradient natively). It sits exactly where new stacking cards enter from below in §5a, softening their arrival. There is no matching band at the top (under the fixed nav) — asymmetric, bottom only.

### 5c. Odometer stat counters

3 stat blocks ("500 Projects…", "12 Years…", "60+ International Design Awards") are built as independent digit-columns: `.number_group` → `.number_main` (currently-shown digit) + `.number_others` (a stack of intermediate digits ending in `.final-number`). E.g. the "500" block is 3 digit-columns each independently rolling through 3–5 intermediate digits before landing (col 1: 2,3,4,→5; col 2: 4,7,→0; col 3: 6,7,→0 = "500"). This is a slot-machine/odometer roll, almost certainly GSAP+ScrollTrigger triggered once on intersection. **Not measured**: exact trigger point, per-digit duration, or easing — Webflow/GSAP's compiled interaction JS isn't readable from inline `<script>` tags the way the Lenis config was, and re-triggering it live wasn't attempted in this pass. State plainly: this is a triggered tween, not scroll-scrubbed, and its curve is unverified.

### 5d. Hero showreel

> **⚠ CORRECTION, 2026-09-10.** The pass below recorded the hero video's
> box and its lightbox and stopped there, which read as "no scroll effect
> on the hero video" — and that reading was wrong. It was never probed
> across scroll. Re-measured live at 1440×900, `.home-header_video`:
>
> | scrollY | width | radius | top | height | bottom |
> |---|---|---|---|---|---|
> | 0 | 1416 | 32px | 527.6 | 360.2 | **887.8** |
> | 150 | 1416 | 32px | 449.6 | 438.1 | **887.7** |
> | 300 | 1416 | 32px | 371.7 | 516.0 | **887.7** |
> | 450 | 1416 | 32px | 293.7 | 594.0 | **887.7** |
> | 600 | 1416 | 32px | 239.7 | 647.9 | **887.6** |
>
> **The width and the radius never change and it never goes full bleed.**
> The BOTTOM EDGE IS PINNED to the viewport — constant to a tenth of a
> pixel across the whole run — and the video opens **upward**: 360 → 648,
> **1.80× in height**, at **0.52px of height per px of scroll**, finishing
> around scrollY 554 (≈0.6 viewport). `transform` is the identity matrix
> on the wrapper, its parent, and the video throughout — this is a real
> height change, not a scale. After it tops out, the element scrolls away
> normally.
>
> It reads as a shutter opening rather than a zoom, and the restraint is
> the point: because the frame's width and corners hold still, the only
> thing your eye is given to read is *more picture*.
>
> Ported to the dark room's hero reel (commit 031b72e) — pinned bottom via
> the stage's existing sticky, opened with a negative top margin so the
> grid row keeps holding the bottom. Ours measures 1.54× at 0.55px/px,
> bottom drift 0.0px.


`.home-header_video` is a single autoplaying, looping, muted `<video>` (`showreel-v1_mp4.mp4`, mp4+webm sources) inside a Webflow lightbox trigger (`aria-haspopup="dialog"` — click opens the full reel). Wrapper radius 32px, `overflow:hidden`. The color/shape variety seen in the video (neon-green crocodile scene, purple "nobip" scene) is **video content, not a DOM/CSS effect** — there is no separate colored-panel element flanking it; don't mistake footage content for a live effect.

### 5e. Nav niche-label cycler

The nav logo carries 4 alternate strings in the DOM (`.logo-word`: "Miltech design agency", "product design studio", "SaaS design partner", "UI/UX design studio") and was observed showing different ones across page loads/scroll — confirmed cycling, but the swap mechanism (interval, transition) rendered as `display:grid` wrappers with empty `textContent` reads in computed-style queries; **interval and easing not measured** — low priority, flag as unverified rather than guessed.

### 5f. SplitText headline reveal

Section headings use GSAP SplitText: real text is duplicated as an `sr-only` (screen-reader-only) node for accessibility, while the visible heading is exploded into `.gsap_split_word` / `.gsap_split_letter` spans for a presumed per-letter/word entrance animation. Confirmed present (classes exist, `SplitText.min.js` is loaded); the entrance timing/stagger itself was **not sampled** in this pass (would require a fresh page load per section, not attempted for time).

### 5g. Mobile (390px) — the whole stacking effect is OFF

At 390px, `.works_item`'s computed `position` is `relative` (not `sticky`), and `.works_card-wrap`'s transform is `none`. **The entire §5a stacking/scale effect is a desktop-only progressive enhancement; mobile gets a plain static vertical card list with zero motion on it.**

## 6. INTERACTION

- Hover-tilt on work cards: inline transform scaffolding present (`rotateX/rotateY/skew` at 0deg baseline) but **not confirmed live** — see 5a.
- Tabs (Services/Industries): click-driven, `w-tab-link` — active tab gets a white pill (`bg rgb(255,255,255)`, text `rgb(15,16,17)`); inactive tab is a dark-gray pill (`bg rgb(40,40,41)`, text `rgb(182,182,182)`). Standard Webflow tab swap; cross-fade/height-animation specifics not sampled.
- Cursor: standard pointer on card links (`cursor: pointer` on `.works_card`); no custom cursor element found in the DOM.
- Contact form (footer): plain native form fields, no client-side view-switch.
- "Show more" links under service rows go to dedicated `/services/*` pages — not an in-page expand.

## 7. COMPOSITING HINTS

- `will-change: transform` found on exactly 15 elements page-wide; the only ones identified by name are the 3 works-stacking elements (`.works_item`, `.works_card-wrap`, `.works_image`) — everything animated on this page is transform-only (scale), never top/left/width/height or clip-path/inset, so nothing here should be re-rastering per frame.
- `backdrop-filter: blur(...)` found on 17 elements: the 10 progressive-blur panels (§5b) plus the fixed nav (`backdrop-filter: blur(20px)` on `.navbar_component`, itself inside a `position: fixed` `.navbar` at z-index 99).
- `matrix3d`/hardware-3D transforms: 0 found (all measured transforms are 2D scale matrices, `matrix(s,0,0,s,0,0)`).
- Frame-time proxy (full Chrome Performance trace failed — its JSON export exceeded this tool's return-size limit, so a raw `requestAnimationFrame` timing sweep was used instead across 240 forced-scroll steps spanning the full 13.5k px document): **mean 8.99ms, p90 8.60ms, max 50.00ms**, 5/240 frames over 16.7ms (~2%), 3/240 over 33.4ms. Healthy — well inside a 60fps budget, no evidence of jank from the stacking-card or blur effects during a full-page scroll pass.

## 8. THE TAKEAWAY

### TAKEABLE — survives a local-service-business audience
- **The sticky-stacking case-study list (§5a)**, exactly as measured: pin at `top:0`, DOM order for the stack, image oversized 20%/wrap 10% at rest scrubbing linearly to 1.0 over ~900px. This is layout mechanics, not content-dependent — it works with 3 case studies as well as 30. It makes even a short portfolio feel like an event instead of a scroll-past list.
- **The 16px-constant-inset rounded dark "sheet" card as the alternate-mood device** (§1/§3), instead of a true section background swap. It's cheap, reads as premium, and doesn't require redesigning the whole page's canvas — just wrap a services/CTA block in a dark rounded card on the existing ground.
- **The bottom-of-viewport progressive blur band (§5b)** — a static, content-agnostic polish device that softens ANY content entering from below. Directly portable regardless of what's stacking.
- **SplitText + `sr-only` duplicate heading (§5f)** — the accessible way to do letter/word-split entrances without breaking screen readers. Directly reusable engineering pattern, zero design risk.
- **The 96px shared peak for both the hero H1 and the closing CTA (§2)** — "raise your voice exactly twice, at the same volume" bookends the page. EAS already independently arrived at this exact idea in the dark-room build's type-scale pass (three peaks unified at 88px) — this is corroborating evidence, not a new ask.
- **The odometer stat counters (§5c)** as a mechanism (independent rolling digit-columns) — works with 3 honest numbers as well as invented ones; EAS has real numbers (DW stats) that could ride this.
- **The live timezone digital clocks in the footer** — cheap, ambient, "real business happening" signal; trivially portable (three `setInterval`-driven clocks, one font file).

### NOT TAKEABLE — depends on Cosmos being a creative-discovery/portfolio product
- **The "Selected works" list needs a genuinely large, ever-refreshing supply of glossy full-bleed project imagery to not feel repetitive** — Cosmos has 5+ (and a "View All Works" archive) each a different, bespoke, professionally shot/rendered UI. EAS has **three** client case studies and a handful of screenshots. Porting the stacking-card mechanic verbatim with only 3 cards means the visitor plays through the ENTIRE novelty of the effect in ~2700px of scroll and then it's over — the mechanic reads as impressive on Cosmos because it's sustained across 5 cards of varied, high-production imagery; on 3 cards of real small-business screenshots it will read as "we built a fancy scroll toy for 3 slides." **This is the single biggest risk in copying this reference.**
- **The bento-grid "why choose us" section (§4 row 6)** leans on custom illustration/3D render assets (desert-photo calendar mockup, chat-bubble mockup, a bespoke red 3D ribbon/sphere render) that a design studio commissions for itself. EAS doesn't have a production budget or house 3D artist for this; a thin imitation with stock photos will look exactly like what it is.
- **The autoplay showreel video (§5d)** exists because Cosmos has a professionally cut highlight reel of many past projects' motion work. EAS does not have equivalent motion-graphics footage of its own case studies (per the earlier itsjay-reel decode work already underway) — an autoplay hero video slot with nothing worth looping into it is worse than no video.
- **The 3×2 embedded Clutch review widget** assumes 20+ third-party-verified reviews. EAS's testimonial section is currently blocked from shipping (per `decisions.md`, 2026-09-07) on exactly this — real, permissioned, named quotes don't exist yet. Do not port the widget-grid FORM before the CONTENT exists to fill it; an empty or thin version of this pattern reads as more damning than a simpler quote block would.

### THE ONE THING
If Jake takes exactly one idea, it should be **the sticky-stacking card list, built for EXACTLY the three real case studies EAS has, no more** — each client's card pinned full-viewport in turn (image oversized ~15-20%, scrubbing to 1:1 as it settles, per §5a's numbers), so scrolling through the proof section feels like turning three heavy pages instead of passing three thumbnails. Small inventory is a feature here, not a bug, if the mechanic is scaled to the content instead of borrowed at Cosmos's larger size: three unhurried, full-viewport "moments" reads as considered; the same mechanic stretched over five same-thin slides so it "looks as long as the reference" would read as padding.
