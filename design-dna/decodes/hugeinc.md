# Decode — hugeinc.com · END TO END

URL: https://www.hugeinc.com/  Viewport: 1440×736 (primary), 390×844 (mobile pass)  Date: 2026-09-19

Jake: "this site will be our model." Known already (not re-derived here): Next.js, Lenis present; body `#fff`, hero section `#0d0b0a`; font "matter" 600 at 284.8 / 145.6 / 57.5 / 43.2px; accent `rgb(255,0,144)`; the hero's day-of-week table and the return-visit escalating-CTA lines; total height 19,902px at 1440 (measured here: **19,900px**, 2px rounding). This decode adds the mechanism-level numbers under each section.

---

## 1. STACK DETECTION

- `window.gsap` = `undefined`, `window.ScrollTrigger` = `undefined` — **confirms "no GSAP on window."** But `.pin-spacer` divs exist in the DOM around both the "Our work." horizontal track and the "Never one and done." radial marquee — `.pin-spacer` is a classname GSAP's `ScrollTrigger.create({pin:true})` hardcodes into the DOM and nothing else produces. **Correction/addition to the known facts: GSAP ScrollTrigger IS driving both pinned sections internally; it is simply not attached to `window`** (bundled/scoped, same as leoparpeix's "inconclusive" case, except here the `.pin-spacer` fingerprint makes it a positive identification, not a guess).
- Lenis: `<html class="matter_db4ec8d8-module__z2O8Na__variable lenis">` at rest, gains `lenis-scrolling` during active scroll (seen via MutationObserver during a page-transition capture). `window.lenis` exists but only exposes `{version}` — the real instance/options are not attached to window, so `lenis.options` could not be read directly.
- `document.startViewTransition` exists as a browser capability but **0 `@view-transition` CSS rules** on the homepage or a case-study page — not used for the in-page work-card hover, but a **separate custom page-transition system** exists (see §9): `.transition__panel`, `.transition__panel-bottom`, `.transition__label`, `.transition__label-letter`, `.transition__label-letter-inner`.
- `__NEXT_DATA__` not found on `window` (App Router likely omits it), but Next.js is confirmed by the known-facts and by the SPA-style client-side case-study navigation in §9 (URL changes with no `navigation.type:"reload"`… see caveat there).
- A CMS (Contentstack) serves all imagery: every asset URL is `images.contentstack.io/v3/assets/...`.
- A second widget system: `.ssv-card` / `.media-lightbox__box` (the "Play showreel" floating video, §4) and `.radial-cards-marquee` (§6) are named, reusable component families, not one-offs.

## 2. THE GRID + TYPE SYSTEM

- `--page-margin` (computed at 1440) = **40px** (`2.5rem`) each side. `--grid-gutter` = **16px** (`1rem`). `--content-max` = 112.5rem (1800px, wider than any viewport tested, so the page never hits it at 1440).
- `.content-grid` = `[full-start] 40px [content-start] 1360px [content-end] 40px [full-end]` — the content column is **exactly 1360px** at 1440.
- `.layout-grid` = CSS grid, 12 columns × **98.664px**, gutter 16px (98.664×12 + 16×11 = 1359.97 ≈ 1360, confirms the same 1360 column).
- `--header-height` = 70px (`4.375rem`). `--section-gap-xl` (used between major stacked blocks) = `clamp(10.625rem, 6.5rem+6.44vw, 13.75rem)` → **196.9px** at 1440 (matches the measured 196.734px spacer divs between sections in the DOM).
- **Type scale, every distinct size/weight found on the page** (font family always `matter, "matter Fallback", ui-sans-serif` unless noted), with letter-spacing and colour:
  | size | weight | tracking | colour | where |
  |---|---|---|---|---|
  | 284.8px | 600 | -19.94px | white | Hero "Hello." |
  | 248.99px | 600 | -4.98px | white | Footer "Bye." |
  | 145.65px | 600 | -7.28px | ink `#0d0b0a` / accent | "We make things that matter", "Never one and done.", each Solutions-card title |
  | 95.76px | 600 | -2.87px | ink | Footer CTA "Check our latest work." |
  | 77.86px | 600 | -3.89px | accent | Solutions numerals "01"–"06" |
  | 57.46px | 600 | -2.87px | ink / white / 50%-white | intro paragraph, work-card titles, work-card descriptions |
  | 43.25px | 600 | -2.16 to -0.86px (varies) | white / ink / cream | hero day-line, "We co-create the future…", "14 years…", Solutions sub-lines |
  | 32.29px | 600 | -1.29px | transparent (mobile-nav, invisible desktop) / accent (footer "Work.") | nav overlay list, footer CTA headings |
  | 25.18px | 500–600 | -0.25 to -1.0px | white / cream | footer nav list, hidden SEO line "Make things that matter." |
  | 19.10px | 400–600 | normal | ink / accent / white | body copy, ideas-card date (accent) |
  | 16px | 400–700 | normal / -0.48px | white | primary nav links, footer "Work" |
  | 14px | 400–500 | -0.14px | white | ideas kicker, footer fine print |
  | 11px | 400–600 | normal | cream | copyright / "Privacy." |
- **Accent (`rgb(255,0,144)`) — every use found** (49 raw DOM matches incl. duplicated/hidden SVG logo copies; 31 rendered/visible), grouped by real use:
  1. The "Huge" wordmark SVG (nav + duplicates for mobile menu/footer).
  2. All 7 words of the rotating statement ("people.", "businesses.", "brands.", "users.", "consumers.", "teams.", "culture.") — every word, not just the visible one.
  3. The 6 Solutions numerals "01"–"06".
  4. The ideas-card date ("September 18, 2026").
  5. Footer CTA headings "Work." / "Contact." (the big 32.29px labels only, not the smaller footer nav list).
  6. A `.btn__circle` background (a hover-reveal circle on a button component, `display:none` at rest — not confirmed firing on a real hover in this pass).
  7. One hidden SEO-only span, "Make things that matter." (opacity/visibility hidden, not part of any visible flow).
- **Nav**: `<header>` is `position:fixed`, 70px tall, background always `rgba(0,0,0,0)` (transparent — never a solid bar). It is colour-adaptive via a `data-theme="dark"` attribute Toggled on/off (not a gradient/blend): at scroll 0 (over the hero) `data-theme="dark"` is present and nav links/logo render white (`rgb(255,255,255)`), flipping to no attribute (default/light) with links at `rgb(13,11,10)` once scrolled past the hero. **Measured flip point: between scrollY 630 and 640** (binary-searched in 10px steps) — i.e. ~100px before the hero's own 736px bottom edge, not exactly at the section boundary. The logo (`rgb(255,0,144)`) never changes colour in either state.
  - **"Let's talk" pill**: 120.7×44px, `border-radius:999px` (full pill), bg `rgb(255,255,255)` / text `rgb(13,11,10)` over the dark hero; at scroll 2000 it inverts to bg `rgb(13,11,10)` / text `rgb(255,255,255)` — same element, same flip trigger as the rest of the nav.

## 3. THE HERO

- The pink "H" is a **static `<img>`** (`Huge_magenta_H_web.webp`, alt="Hello."), **not** a video or canvas. `object-fit:contain`, `position:absolute`, fills the whole hero rect (1440×736 rendered; natural size 1440×803, aspect 1.793). No `<video>`/`<canvas>` anywhere in the hero.
- **Cursor reactivity: none detected.** Synthetic `mousemove` dispatch (document/window/section-level, 4 points incl. return-to-origin) produced zero change in the image's or its wrapper's `transform` (`none` throughout). This only rules out a JS-listener-driven reaction to *synthetic* events — a real trusted pointermove was not separately tested here, flagged rather than asserted as fully conclusive.
- **Entrance on load** (captured via an `initScript` that samples every requestAnimationFrame from navigation-start): the H image mounts already at `opacity:1, transform:none` — **no fade/rise on the image itself**. The `<h1>` ("Hello.") and the day-line `<p>` DO animate: both start at `opacity:0` with a `translateY` offset (h1 measured from ~570px pre-jump, day-line from ~115px), then converge to `opacity:1, translateY:0`. The **convergence tail is a clean exponential/spring decay, not a fixed-duration bezier** — consecutive-frame ratios in the tail are consistently ~0.86–0.88 (retention per ~8ms tick on this session's high-refresh render), fully settled (<0.01px remaining) by **~830ms** after the h1 first mounts, with the day-line trailing the h1 by **~100ms** (a real stagger, not simultaneous). Header/nav opacity is `1`/`transform:none` for the entire capture — **no entrance animation on the nav**.
- **Exit on scroll: none.** Sampled h1/img/day-line/section `top` and `opacity` at scrollY 0/100/200/300/400/500/600/700/736: every element's `top` decreases by **exactly** the scroll delta each step (1:1, no lag, no lead) and `opacity` stays `1` throughout. **No pin, no parallax, no fade-out** — the hero is a plain block that scrolls away like ordinary content.
- **Day line**: `<p class="font-body text-h4 ... cap-height leading-display-tight font-semibold">`, 43.248px/600, `color:rgb(255,255,255)` at rest (over the dark hero), positioned at `top:606.9` (first-load "Hello." state) — a static block-level paragraph, not absolutely positioned.
- A **separate floating widget** exists near the hero: `.ssv-card` / `.media-lightbox__box` (a small 360×225px, 16:10, `border-radius:20px` video card) with a `.ssv-pill` cursor-label ("Play showreel", `pointer-events:none`, 179×62px, `border-radius:999px`, translucent dark bg, white text). **At CSS rest (post-interaction) it is `lg:fixed lg:right-(--page-margin) lg:bottom-(--page-margin) lg:w-1/4 lg:z-40`** — i.e. simply pinned to the bottom-right corner (40px from each edge) for the rest of the page. During the scroll from the hero into the client-logo band (~scrollY 400–1300) its on-screen `top` visibly changed across repeated measurements in a way that did not reproduce identically between passes (471→554→738→…→471) — **this transient repositioning is a measurement casualty, not a clean read**: a still-open lightbox from an earlier click was intercepting hit-testing and possibly compositing during part of this test. The two clean, reproducible facts are: it rises into view somewhere after the hero and it is fixed at bottom-right (40,40) from then on; the exact curve of the transient is flagged, not reported as a number.
- **Click → lightbox**: clicking the card (the *same* DOM node) swaps its class from `relative aspect-16/10 w-full rounded-20 border-heavy` to `fixed inset-0 z-60 rounded-none border-0` and its rect from 360×225 to 1440×736 — an **in-place expand, not a separate modal/portal**. Contains Play/Pause, a Seek slider, Mute, and Close controls; the video plays inline full-bleed ("And make it real." title card seen on the reel). This is a **modal-equivalent overlay**, but implemented as one element morphing, not a second DOM subtree.

## 4. THE STATEMENT

- Mechanism: **`.rotating-text__word` × 7** ("people.", "businesses.", "brands.", "users.", "consumers.", "teams.", "culture."), all absolutely positioned in the same slot, each individually coloured accent pink regardless of visibility. **Timer-driven, not scroll-driven** — confirmed by holding scroll position fixed and watching the words cycle on their own.
- **Timing** (50ms-resolution capture across 2 full cycles): each word **holds fully static (opacity 1, translateY 0) for ≈1225–1275ms**, then a **transition of ≈700–715ms** (first detectable movement to full settle) to the next word. Full cycle ≈**1930–1990ms** per word (~1950ms average); 7 words ⇒ ~13.7s for a full loop back to the start.
- **Curve**: NOT linear and NOT a simple exponential — velocity (Δpx per 50ms) rises from ~5px/step to a peak of ~54px/step around 45–55% through the transition, then decays back down: a **bell-shaped, ease-in-out family, peak slightly past the midpoint (~55%), a longer decel tail than the accel ramp** (out-weighted ease-in-out — closer to a raised-cosine than a linear cross-fade, not a match for a pure spring/exponential since the *ratio* between steps is not constant the way the hero's entrance was). Both outgoing and incoming words move and fade simultaneously (a true cross-fade+slide, not a hard cut) — both are partially visible (opacity between the extremes) during the middle of the transition.
- Slot offset (idle, hidden-word position): translateY ≈ **196.6px** above/below the visible slot — this is each word's parked "next in queue" position.
- **"Play showreel" pill** = the same `.ssv-pill`/`.ssv-card` widget described in §3 (it is one shared component, not two).

## 5. OUR WORK

- **Mechanism confirmed: GSAP ScrollTrigger `pin:true` + a linear scrub**, not a native horizontal scroller. DOM chain (outer→inner): `<section>` (h=6336px, the scroll domain) → `.pin-spacer` (h=6336, GSAP's own injected spacer) → a `motion-safe:h-svh` flex box (**the pinned element**, holds "Our work." + the visible card window in-viewport for the whole 6336px) → a `flex overflow-hidden` clipping box (`scrollWidth:7000`, own width 1400 — 5 cards × 1400px pitch) → 5 sibling `w-full shrink-0` card wrappers, **each carrying the identical inline `transform: translateX()` value** (confirmed identical across all 5 at every sample — the translation is applied uniformly, functionally equivalent to moving one shared row).
- **Rate: exactly 1:1, linear, zero lag** for the first ~5600px of the section's scroll. Sampled at scroll-fractions 0/.15/.3/.45/.6/.75/.9/1 of the 6336px domain: translateX = −(scrollY − sectionTop) at every one of the first 6 samples (e.g. f=.75, scrolled 4752px → translateX exactly −4752px). The track reaches its max travel, **−5600px (=7000−1400, i.e. 5 cards minus one viewport-width)**, at scroll ≈5600px into the section (~88%), then **holds flat for the remaining ~736px (one viewport height) of pinned scroll** before the section releases — a deliberate pause on the last card before unpinning.
- **Card geometry**: each `<a>` is **1360×464px** (fills the content column, 1400px pitch ⇒ 40px gap between cards), image `object-fit:cover` fills the card exactly (no independent parallax — `transform:none` on the image at every position sampled). The rounded corners (**8px**, `rounded-8`) and off-white-adjacent styling live on an inner `<article class="group ... rounded-8">`, not the outer `<a>` (which itself reports `border-radius:0`).
- **Text on cards**: title 57.456px/600 white, description 57.456px/600 white-at-50%-opacity, both left-aligned lower-half of the card.
- **Hover**: the *only* change is the image — `scale` goes `none`→`1.05` via `transition: transform/translate/scale/rotate 0.5s cubic-bezier(0,0,0.2,1)` (a Material-style "decelerate" ease). Verified with a real CDP-trusted hover (confirmed `:hover` on the full ancestor chain incl. the `article.group`) against a captured rest-state diff of every descendant: title colour, description opacity, background, and card transform are **bit-identical** hover vs rest — no veil, no lift, no arrow reveal, title/description untouched.
- **Snap**: `scroll-snap-type:none` on the section; no evidence of snapping between the 8 sampled fractions (positions land exactly on the linear-rate prediction, not rounded to a card boundary).
- **5 cases**: NBCU, CoinTracker, Big Green Egg, Darling Ingredients, Google — confirmed via `href`s, not 6 or more.

## 6. NEVER ONE AND DONE (≈9229–12561px)

- Own dark band: this section overrides `--theme-bg` to **`rgb(13,11,10)`** (same ink as the hero) inside an otherwise white page — a second dark band mid-scroll, not just the hero.
- Layout is `.radial-cards-marquee`: heading "Never one and done." (145.65px, white) + intro copy (43.25px, white) sit in a `content-grid radial-cards-marquee__intro`; the visual is a **`<ul class="radial-cards-marquee__list">` of 6 `<li class="radial-cards-marquee__item">`** — square client/partnership images (Hublot, Playstation, etc.), each a *different* size (485/640/685/611/533/663px), individually rotated in fixed **24° increments** (0°, 24°, 48°, 72°, 96°, 120°) — a fanned deck, matching the spec's guess.
- **Mechanism: `.pin-spacer`-confirmed GSAP pin + scrub, rotating the WHOLE `<ul>`** (not the individual item angles, which stay fixed relative to each other). Sampled the list's own `transform` rotation across scroll-fraction 0→1 of the section's 3332px:
  - f=0–0.1 (0–333px of scroll): **dead zone, angle stays 0°** (heading still settling into its pinned position).
  - f=0.1→0.8 (~2332px of scroll): angle sweeps **0° → −120°**, at a near-constant rate of **≈−0.054°/px** (segment deltas: −0.045, −0.054, −0.054, −0.055, −0.054, −0.054, −0.043°/px — linear except a softened last step arriving at the −120° cap).
  - f=0.8→1.0: **held at exactly −120°** (=5×24°, the deck's own full spread) — the pin releases and normal scroll resumes underneath a now-static fan.
  - The heading itself is genuinely pinned for most of the section: `headingTop` is constant (−324px, i.e. scrolled just off the top of the viewport and held there) from f=0.15 through f=0.75, only changing at the very start and end.
- Item images carry real alt text ("Hublot partnership", "Playstation Asset") — this is a client/partnership-logo fan, not literal "14 years" text tiles; that copy is the section's intro paragraph, not the deck's content.

## 7. SOLUTIONS (12561–16879px)

- **Not a 146px hairline-row list at this viewport** — the "146px" in the spec brief matches the 145.65px H2 type-size used for each title, not a row height. What's actually there: **6 full CARDS**, each an `<article class="... rounded-20 bg-neutral-25 ...">` (bg `rgb(250,248,244)`, an off-white, not the page's pure white), **1360×526px** (mobile-first `h-[524px]`, this desktop read shows 526 incl. border rounding), stacked with a **pitch of ~620px** (580/621/622/621/622px between consecutive card tops — matches the spec's "~620px apart" exactly). No borders/hairlines (`border: 0px solid` on both the link and the article).
- **Per-card content**: numeral ("01"–"06", 77.86px accent), title (145.65px ink), one-line subhead (43.25px ink) — no image, no arrow icon.
- **Hover: no visual change measured.** `article` declares `transition-colors 0.15s cubic-bezier(0.4,0,0.2,1)` but a real trusted hover produced **bit-identical** background, text colours, transform, and box-shadow versus the un-hovered baseline. Cursor is presumably `pointer` (not independently re-checked); no expand, no image-follow (there is no image to follow).
- **Entrance is not an opacity fade** — cards are `opacity:1` whether or not they've ever been scrolled to. There IS a **very subtle squash/settle**: a card that has just scrolled into/through the pinned viewport briefly reports `transform: matrix(1.0044, 0, 0, 0.9962, 0, 0)` (≈+0.44% scaleX / −0.38% scaleY) before decaying back to the identity matrix within ~1s of the scroll stopping — a small elastic overshoot on arrival, not a slide or fade.

## 8. IDEAS & NEWS + FOOTER

- **Ideas & news** (17079–18000px): **one single featured article card** (1360×921px), not a grid or marquee — `href="/ideas/the-prototype-is-the-pitch"`. Full-bleed image (1428×803, slightly larger than its card and cropped/offset, `top:-18.7`), with overlay text: kicker "ideas" (14px white), "6 min read" (14px white), date "September 18, 2026" (19.1px, **accent pink**), headline (43.25px, light-gray `rgb(213,210,207)`, i.e. NOT pure white — a dimmed headline colour against the presumably dark/photo background). No marquee found in this section.
- **Footer** (18808–19682px, h=874): `position:static`, background `rgb(13,11,10)`. **No rise/pin mechanism** — unlike Off+Brand's receding-card footer, this footer is a plain static block the page scrolls past normally (confirmed by `position:static` and a flat total-height budget with no extra scroll-trigger classes on it).
- **CTA band directly above the footer** (18158–18808px): a 2-column row, "Work." (left, x=80) / "Contact." (right, x=768), each 32.29px accent-pink heading with a "Check our latest work." / "Ready to talk?" sub-line — plain `layout-grid`, no special mechanism observed.
- Footer content: giant "Bye." (248.99px white), "Get Huge in your DMs." tagline, an email-subscribe form, a footer nav list (Work./Solutions./Approach./Company./Ideas./Newsletter./Join us./Contact us./Linkedin./Instagram./X./Legal notices.), copyright, and a "Privacy." legal link.

## 9. PAGE TRANSITIONS

Clicked the NBCU work-card link (`case-study/nbcu`). **Confirmed client-side (SPA) navigation, not a hard reload**: a `window.__marker` variable set before the click survived after the URL changed to `/case-study/nbcu` (a hard MPA reload would wipe it). `performance.getEntriesByType('navigation')[0].type` reads `"reload"` on the destination, but this reflects the ORIGINAL document-load entry from earlier in the session, not a fresh navigation entry — not reliable evidence either way, superseded by the survived-variable test.

**The transition system** (`.transition__panel`, `.transition__panel-bottom`, `.transition__label`, with per-letter `.transition__label-letter` / `-inner` children), captured via rAF-rate sampling from click:

- **Cover phase (0 → ~510–535ms)**: `.transition__panel` (a full-viewport 1440×736 `rgb(13,11,10)` div) translates from an off-screen parked position down into full coverage of the viewport. Curve: slow-in, fast-middle, slow-out — the deceleration tail shows a consistent ~0.83–0.90 remaining-distance ratio per ~8ms step (an exponential/spring-like tail), NOT a fixed-duration cubic bezier; total time-to-settle ≈**510–535ms**.
- **Hold (≈530–580ms)**: panel fully covers the screen, `opacity:1`, static. The actual route swap happens **~827ms after click** — i.e. roughly 300ms into this hold, invisibly, while the screen is covered.
- **Label reveal, during the hold**: the destination's kicker label ("Case study.") is split into individual letters, each parked at `translateY(76.7969px)` (masked below its line). Starting **~230–255ms after click** (once the curtain has covered the screen), each letter rises to `translateY(0)` with its **own exponential decay** (time-constant ≈48ms, i.e. ≈0.71 retention per 16.7ms/60fps-equivalent frame — fit from >15 samples per letter, ratio consistent to 3 significant figures) and a **~2.7–5ms stagger between consecutive letters** (a near-simultaneous ripple spanning only ~30–50ms across all 10 characters of "Case study.", not a slow one-at-a-time typewriter). Each letter is fully settled (<1px) within ~250–300ms of its own start.
- **Exit phase (from ≈1118ms)**: the panel continues translating (now past the "covering" position, exiting upward) while a second element, `.transition__panel-bottom`, **scales down from `scaleY(1)`** — captured only partway (to `scaleY≈0.226` by t=1402ms, still shrinking) before the capture window ended. **The full exit choreography (how the two pieces resolve) is not completely captured — flagged as incomplete, not guessed.**
- No `@view-transition` CSS on either the homepage or the case-study page — this is a bespoke JS/GSAP-style overlay system, not the browser's View Transitions API, despite `document.startViewTransition` existing as a capability.

## 10. SCROLL FEEL

- `<html>` carries `lenis` at rest and gains `lenis-scrolling` during active scroll (seen live via MutationObserver) — Lenis is genuinely active.
- **Lenis's lerp/duration constant could NOT be measured.** A `window.scrollTo()` jump of 300px (5000→5300) showed `window.scrollY` already AT the target on the very first sample (t=0 of a 20×50ms poll, i.e. before any observable smoothing) — this indicates Lenis is not intercepting *programmatic* `scrollTo()` calls (or resolves them instantly), consistent with Lenis's usual design of smoothing real wheel/touch input, not scripted scroll jumps. This session's tooling (`chrome-devtools` MCP) has no primitive to dispatch a trusted wheel/touch gesture, so **the actual smoothing constant used for real user scrolling is not measured here** — reported as a gap, not a fabricated number.
- `scroll-snap-type: none` on both `<html>` and `<body>` — no CSS scroll-snap anywhere on the page.

## 11. MOBILE (390×844)

- **Hero**: H-image still fills the full screen (390×844, `object-fit:contain`); "Hello." (or the return-visit greeting, seen live: "Back already? You again. Excellent. We see you.") sits much lower on the screen (top≈538 of 844, bottom third), at **161.85px** font-size — large relative to the 390 width, causing the greeting text to sit low rather than centred. Day-line/CTA text at 32px. Nav collapses to a "Menu" button (logo + pill).
- **Total page height: 14,770px** at 390 (vs 19,900 at 1440) — substantially shorter, mostly from compressed pinned-scroll domains, not dropped sections.
- **Our work**: **same GSAP pin+scrub mechanism survives on mobile** — confirmed `.pin-spacer` still present, and the 5 card wrappers still share one identical `translateX` value that changes with scroll fraction (0 → −721 → −1442 → −1560, capping before f=1). Cards shrink to 350×623px. **Not** converted to a native `overflow-x` scroller.
- **Solutions**: same card pattern, 344×410px, padding 48px/32px, title drops to 50px (from 145.65px desktop).
- **Never one and done**: the `.radial-cards-marquee` and its 6 items are still present (not dropped), but the scroll-driven rotation was not independently re-verified at this viewport in this pass — flagged as unconfirmed rather than assumed identical.
- Nothing was confirmed outright *dropped* (removed from the DOM) between desktop and mobile in the sections checked — the differences measured were geometry/type-scale compression, not omission.

## 12. REDUCED MOTION

- **15 distinct `@media (prefers-reduced-motion)` rule blocks** found via a full `document.styleSheets` scan (not 0, not inferred). They touch: a global `*, ::before, ::after` catch-all; the button-hover circle system (`[data-btn-hover] .btn__circle`, `[data-btn-chars] span`); the reveal-on-scroll system (`[data-reveal-group].js-reveal-pending > *`); the entire showreel/lightbox family (`.media-lightbox__box`, `-poster`, `-video`, `-gradient`, `-spinner`, `-chrome`, `.media-lightbox__fallback-button`, `[data-media-follower]`); the `.ssv-card`/`.ssv-pill` widget explicitly, including a `[data-sticky="false"]` variant; the hero's own `.hero-showreel__box[data-phase="expanding"/"expanded"/"collapsing"]` states; and `.hero-media__reveal` / `.hero-media__breadcrumbs` entrance groups.
- This session's `emulate` tool has no parameter to force the `prefers-reduced-motion` CDP media feature, so the actual reduced-motion *rendered behaviour* was not independently verified — only the CSS rules that would apply were confirmed to exist, at the count and coverage above.

## 13. FRAMES

Saved to `design-dna/frames/decodes/hugeinc/`:
- `01-hero-settled.jpeg` — hero at rest, scroll 0, ~1.5s after cookie-banner dismissal.
- `02-statement-mid-rotation.jpeg` — "We make things that matter to…" section, scrollY 750, ~1.3s after arrival (mid-cycle, not guaranteed mid-transition).
- `03-work-mid-scroll.jpeg` — "Our work." pinned section at scroll-fraction 0.4 of its 6336px domain (scrollY 5277).
- `04-never-one-and-done-mid.jpeg` — the radial marquee at scroll-fraction 0.5 of its 3332px domain (scrollY ≈10,895, angle ≈−70°).
- `05-solutions-row-hovered.jpeg` — "Brand strategy & design." card under a real CDP-trusted hover (no visual change per §7, included for completeness).
- `06-mobile-hero.jpeg` — 390×844 hero, return-visit greeting state ("Back already?…").

## 14. THE TOP GLASS — a progressive blur, not a bar (measured live 2026-09-20)

Jake: "look at the blur glass effect or whatever it is at the top of the huge navbar." §3's "header background always transparent" stands — the glass is a SEPARATE fixed layer, `div.progressive-blur.is--top` (aria-hidden), a sibling of the header:

- `position: fixed; top: 0; left: 0; width: 100%; height: 15em` = **286.5px** at the 19.1px root · `z-index: 40` (header is 50) · `pointer-events: none; isolation: isolate; contain: paint; overflow: hidden; transform: translateZ(0)` · `transition: opacity .4s`, `.is-hidden { opacity: 0 }` (not hidden at scroll 0 — the hero title dissolves under it too).
- Three absolutely-positioned children, each a `backdrop-filter: blur()` masked to a band, the radius climbing toward the top edge:

  | layer | blur | mask (top → down) |
  |---|---|---|
  | `is--1` | `.09375em` = **1.79px** | transparent 12.5% → black 25%–37.5% → transparent 50% |
  | `is--2` | `.375em` = **7.16px** | transparent 0 → black 12.5%–25% → transparent 37.5% |
  | `is--3` | `1.5em` = **28.66px** | black 0–12.5% → transparent 25% |

  So the blur is 28.7px in the top 36px, ~7px to 72px, ~1.8px to 108px and gone by 143px — the lower half of the box does nothing. No tint, no colour: the header's ink flip (§3) is what keeps the links legible.
- The same component exists as `.is--bottom` (masks reversed, layers 4–5 defined in the stylesheet for a finer ramp) — not present on the homepage.

Ported as trial `pblur` on hero/air (room.css `.dr-pblur`, 300px tall so the blurred half clears our rail), with the rail's own stuck pill (92% dark, 14px blur, glint edge) turned off under it.
