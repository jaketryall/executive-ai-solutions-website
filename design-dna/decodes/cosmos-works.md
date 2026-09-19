# Decode — cosmos.studio · WORKS / Selected works section

URL: https://www.cosmos.studio/ (section `.section_works`)
Viewport: 1440×736 (primary), 390×844 mobile check
Date: 2026-09-18

Supersedes nothing in `decodes/cosmos.md` §5a — extends it with entrance/hover/click/compositing/reduced-motion/mobile numbers that file didn't cover, and independently re-measures the scale mechanic at this viewport (736 tall vs that file's 900 tall — the well's absolute px size differs between the two measurements; both are live reads, not a contradiction to resolve).

---

## 1. STACK DETECTION

- `window.gsap` = 3.15.0, loaded from `cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js`, plus `SplitText.min.js` and `ScrollTrigger.min.js` from the same path.
- `window.ScrollTrigger.getAll()` returns exactly **5** instances site-wide, triggers: `testimonials_numbers`, `features_time-rows`, `sticky-wr` (×2), `home-header_headings`. **None reference the works section** (`.works_head`, `.works_item`, `.works_card-wrap`, `.works_image` — zero matches).
- **Conclusion: the works-card scale/stack effect is NOT GSAP-driven.** It runs on Webflow's native interaction runtime — `<html>` class includes `w-mod-ix w-mod-ix3` (Webflow IX2/IX3 native scroll interactions) — confirmed by elimination, not by reading IX2 source.
- Lenis present: `<html class="w-mod-js lenis w-mod-ix w-mod-ix3">`.
- No Framer markers (`[data-framer-name]`, `.framer-body`) found. Confirmed Webflow: `<html data-wf-page="69f9c76e84333229e651e8e2">`.
- `document.startViewTransition` exists as a browser capability (Chrome) but is unused: 0 `@view-transition` at-rule matches across every stylesheet on both the listing page and the `/projects/maddogs` destination page (full `cssRules` scan). No `::view-transition` CSS anywhere.
- Script bundles present: `clarity.ms/tag/x03ssskpk9` (Microsoft Clarity analytics), `webflow.870bd618.475ada7d0632014b.js` (Webflow runtime — webpack bootstrap, fetched body = 5048 bytes, so this is a loader stub; IX2's actual interaction logic likely lives in a lazy-loaded chunk not fetched), `gsap.min.js`, `SplitText.min.js`, `ScrollTrigger.min.js`.
- No `data-barba` (no barba.js), no `[class*="transition"]`/`[class*="overlay"]`/`[class*="preloader"]` element in the DOM.

## 2. LAYOUT (1440×736)

- `.section_works` itself: padding `0 0 0 0` — all inset comes from nested `padding-global`/`container-*` wrappers, not the section.
- **Header** (`.works_head`, inside `.container-xxsmall` = exactly **720px fixed**, not responsive-scaling at this bp; `display:flex; align-items:center`, centered at x=360 in the 1440 viewport):
  - Kicker "Works": `font-size:12px; font-weight:500; letter-spacing:-0.15px; text-transform:uppercase; color:rgb(112,112,112); font-family:Switzer`. Rect 43×14.
  - `.spacer-small` between kicker and h2 (not measured as a fixed px — Webflow spacer utility class).
  - H2 "Selected works": `font-size:64px; font-weight:500; letter-spacing:-0.64px; line-height:70.4px; color:rgb(15,16,17); text-align:center`. Rect 442×70.
  - **No entrance animation on the header at all** — see §3.
- **Grid**: NOT a CSS grid. `.works_list` = `display:flex; flex-direction:column` (single column), `gap: normal` (no flex-gap; spacing comes from each item's own box height). Nested: `.container-large` (max-width 1520px; actual rendered 1408px = 16px page-edge inset each side at 1440) → `.works_wrapper` (flex) → `.works_list`, and the **works_wrapper/works_list content box is 1104px wide**, itself centered inside the 1408px container-large (152px empty margin each side) — i.e. the works column is narrower than the page's own outer measure.
- **Card (the well)**, identical across all 5 items: `.works_card` = **801.594×534.398px, aspect ratio exactly 1.500 (3:2)**, `border-radius:20px`, `overflow:clip`, `position:relative`, `z-index:3`. It sits horizontally **centered** within the 1104px-wide item box (151.2px empty margin each side at rest — this margin is where the Year/Niche row's outer edges land, see below).
- **Meta placement A — name + "See work" (the on-image label)**: `.works_label`, absolutely positioned **inside the top of the image**, horizontally **centered** on the card (offset 298.9px each side of the 801.59px-wide card → label itself 203.79×44), **32px inset from the card's top edge**. `display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.3); backdrop-filter:blur(7px); border-radius:12px; padding:4px 16px 4px 4px`. Inside: `.works_pic` (36×36 thumbnail crop of the same project, `border-radius:6px; object-fit:cover`) + `.works_name` (h3, "Neo Vision" etc., `14px/500/-0.28px ls/color:rgb(255,255,255)`) + gap:8px + a 1px×16px divider (`background:rgba(255,255,255,0.6)`) + "See work" (`12px/400/-0.15px ls/color:rgb(255,255,255)`).
- **Meta placement B — Year / Niche row**: `.works_infos`, absolutely positioned **below the card**, `display:flex; justify-content:space-between`, spans the page's **outer 1408px measure** (16px from the viewport edge, i.e. aligned to `.container-large`'s own edges — NOT to the narrower, centered card) — Year sits far left, Niche far right, wider than the card itself. Label ("YEAR"/"NICHE"): `12px, uppercase, color:rgb(112,112,112)`. Value ("2024"/"AI-Powered Products"): `15px/400, color:rgb(15,16,17)`, Niche value right-aligned under its own group.
- No borders/rules anywhere in the section; separation is purely spatial + the card's own clip.

## 3. ENTRANCE ON SCROLL

**Header** (`Works` kicker + `Selected works` h2): sampled at scrollY = 0 (page load, section not yet in viewport), 1900, 2050, 2200, 2315 (section's own top), 2450 — `opacity:1` and `transform:none` at **every** sample, including scrollY=0. **No entrance animation exists on the section header** — it is static from first paint, never fades or translates in.

**Cards**: there is no separate opacity/translateY "entrance" distinct from the scale-settle described in §4 below — `.works_label`'s `opacity` is `1` at every scroll position and every hover state tested (never a hover-reveal, confirming/extending `decodes/cosmos.md` §5a's note, which called this "not confirmed either way" — it is now confirmed: opacity is bit-identical across 1057ms of sustained real hover).

**The one true scroll-driven motion is the sticky-stack scale-settle**, one item at a time:
- `.works_item` = `position:sticky; top:0px; will-change:transform`. As each item scrolls to the top of the viewport it pins there (its child `.works_card` settles at `top:128px` from viewport top — 128px is the item's own internal top-offset baked into its box), and the NEXT item's DOM order paints over it (no z-index needed) — "cards dealt on top of each other."
- Simultaneously `.works_card-wrap` scales **1.10→1.00** and `.works_image` scales **1.20→1.00**, sequentially per item (item[i+1] does not begin until item[i] has fully settled at 1.00).
- Measured window for item index 2 (Bravo1Alpha) at this viewport: **start scrollY≈3005, end≈3741 → window ≈736px of scroll**.
- **Curve — NOT scroll-linear despite looking linear across widely-spaced multi-position samples.** A direct time-domain test (freeze `scrollY` at a single mid-transition value, then sample repeatedly with no further scrolling) proves the value keeps changing after the scroll stops:

| t since scroll-stop (ms) | wrap scale | image scale |
|---|---|---|
| 4 | 1.09334 | 1.18398 |
| 21 | 1.07151 | 1.16091 |
| 56 | 1.04548 | 1.13669 |
| 107 | 1.03492 | 1.12429 |
| 210 | 1.03184 | 1.12013 |
| 311 | 1.03168 | 1.1199 |
| 511–1212 | 1.03168 (settled) | 1.1199 (settled) |

This is an **exponential lerp/chase toward a scroll-derived target**, not a GSAP scrub and not a CSS transition (`transitionDuration` computes to `0s` on both elements at every state — no authored CSS transition exists; the chase is imperative, per-frame). Fitted per-frame retention factor ≈ **0.60–0.65** (≈35–40% of remaining distance closed per rAF frame at 60fps), fully converged (<0.2% of full range remaining) by **~300ms** after any scroll stop. This chase is faster than Lenis's own typical default smoothing and is layered independently — both `.works_card-wrap` and `.works_image` show the same decay shape, just different amplitude (0.1 vs 0.2 total range).
- **Stagger**: none in the shared-timeline sense — each card's transition is fully self-contained to its own ~736px window; item[i+1] stays pinned at its 1.1/1.2 baseline, untouched, until item[i] reaches 1.00.
- **Once or replayed**: REPLAYED. Scrolled item 2 forward past its window (settled 1.00) → back to scrollY 3090 mid-window (scale re-inflated to 1.08805/1.17697, identical to the forward pass) → forward again to 3700 (returned to 1.00017/1.01121, identical to the forward pass). Fully reversible, driven by live scroll position, not a one-shot IntersectionObserver/`once:true` trigger.

## 4. SCROLL-LINKED MOTION (parallax / surplus inside the well)

- No independent parallax translation exists. `.works_image`'s `transform` is always a pure uniform scale matrix (`matrix(s,0,0,s,0,0)`) at every sample across the whole scroll range tested — **zero horizontal or vertical drift**, only scale.
- **Surplus**: at rest, image = **1.20×** the well in both axes (rendered 961.9×641.3 against the 801.594×534.398 well) → **20% oversize fraction, symmetric**: overflow 80.16px each side horizontally, 53.44px each side vertically, clipped by the well's `overflow:clip` + 20px radius. Wrap itself is 1.10× at rest (10% oversize on its own, larger, box).
- **Rate**: image scale range is 0.2 (1.2→1.0) over the ≈736px settled window → **≈0.000272 scale-units/px** at the settled-target level. Wrap's settled range is 0.1 over the same window → **≈0.000136 scale-units/px** (exactly half, since its total range is half).
- **Damping**: see §3 — both wrap and image are lerped/chased (not raw scroll-coupled instant values); the "rate" above describes the underlying scroll-derived TARGET function, not the frame-to-frame instantaneous value while scrolling fast.
- No scale-on-scroll of the well/card itself (`.works_card`'s own `transform` is always `none` — only its children move).

## 5. HOVER

Tested with a real CDP-dispatched **trusted** hover (`Input.dispatchMouseEvent`-backed, not a JS-synthesized event) on the "Mad Dogs" card, confirmed active via `card.matches(':hover') === true` and `document.querySelectorAll(':hover')` including `.works_card-wrap`/`.works_card`/`.works_image` in its ancestor chain. Sampled at t = 0, 102, 253, 505, 756, 1057ms after hover-in:

- **`.works_image` transform, `.works_card-wrap` transform, `.works_label` background/backdrop-filter, `.works_name` color, "See work" color, divider background — every one of these was bit-identical to the non-hovered baseline at all 6 timestamps.** `getComputedStyle(...).transitionDuration` = `"0s"` on every one of these elements in BOTH hover and non-hover states.
- **Conclusion: there is no hover effect on these cards at all** — no image zoom, no veil/overlay change, no text recolor, no underline/arrow on "See work". This resolves `decodes/cosmos.md` §5a's "not confirmed either way" note on the baseline `rotateX(0deg) rotateY(0deg) skew(0deg,0deg)` 3D-tilt inline style: it is **confirmed inert** — a real trusted hover produces zero rotation over 1057ms, not just a synthetic-event failure.
- No `<video>` element in any of the 5 cards (`Neo Vision`, `Mad Dogs`, `Bravo1Alpha`, `Seatwiz`, `Loamly` — all checked, all `.webp` static images only) — nothing "starts playing."
- Cursor: `cursor:pointer` on `.works_card` (native browser pointer). No custom cursor element found (`[class*="cursor" i]` query = null).
- Card does not lift, scale, or gain a shadow on hover.

## 6. CLICK → PROJECT PAGE

Clicked the "Mad Dogs" card (trusted CDP click) → navigated to `/projects/maddogs`.

- `performance.getEntriesByType('navigation')[0].type === "navigate"` on the destination page — a **standard hard MPA navigation** (full page reload), not an SPA route change.
- **No View Transitions used**: 0 `@view-transition` CSS rules on either page (checked both before and after navigation) — Chrome's cross-document View Transitions require the at-rule on BOTH the source and destination document to activate, and neither declares it, so the browser capability existing (`typeof document.startViewTransition === 'function'`) is moot here.
- No GSAP overlay wipe, no barba.js, no `[class*="transition"]`/`[class*="overlay"]`/`[class*="preloader"]`/`[class*="loader"]` element found in the DOM on the listing page.
- **No image/element persists across the navigation**: the destination page's hero image (`.../6a90257f9832154e65942ed3_image%20297.webp`) is a completely different asset from the card's thumbnail (`.../918d963853166aa90570c3_Group%201400.webp`).
- Measured `domContentLoadedEventEnd` on `/projects/maddogs`: **619.9ms**.

## 7. COMPOSITING HINTS

- `will-change:transform` on exactly **3 elements per card** — `.works_item` (the `position:sticky` element itself), `.works_card-wrap`, `.works_image` — **15 total across the 5 cards**, matching the 17 `will-change` elements found page-wide (2 more live elsewhere, unrelated to works).
- `.works_card` (the well/clip frame) and `.works_label` (the on-image capsule) carry **no** `will-change` — neither one ever animates.
- `transform-style:preserve-3d` present on `.works_card-wrap` and `.works_image` (Webflow IX2's default 3D-transform boilerplate; present even though nothing ever rotates).
- `backface-visibility:visible` (default, unset) and `contain:none`, `content-visibility:visible` (default) everywhere in the section — none of these are used.
- **Only `transform` (scale) is ever animated** — never `clip-path`, `inset`, `top`/`left`, or `width`/`height`. Per the grow-effects-raster lesson, this is a pure GPU-composited scale with no per-frame re-rasterization; the only paint cost is each image's initial decode.

## 8. REDUCED MOTION

- **0 `@media (prefers-reduced-motion)` rules** found in a full `document.styleSheets` scan (all rules, all sheets).
- `window.matchMedia('(prefers-reduced-motion: reduce)').matches` = `false` in the default (non-emulated) state.
- **Gap, not a measured "no":** the `emulate` tool available in this session exposes `viewport`/`colorScheme`/`cpuThrottlingRate`/`networkConditions`/`geolocation`/`userAgent`/`extraHttpHeaders` only — **no parameter to force the `prefers-reduced-motion` CDP media feature**, so the actual emulated-reduce behavior was not directly testable. Fetched the primary Webflow loader chunk (`webflow.870bd618.475ada7d0632014b.js`, 5048 bytes — a webpack bootstrap stub) and found no `"reduced-motion"` string in it, but Webflow IX2's actual interaction logic likely lives in a separate, lazy-loaded chunk this fetch didn't reach. Since the works effect is driven by imperative inline-style writes (not CSS transitions/animations gated by the media query), even a successful emulation might not change anything unless IX2's JS itself checks `matchMedia` before writing — **unresolved, flagged rather than guessed.**

## 9. MOBILE (390×844)

- Header: h2 "Selected works" drops to **40px** (from 64px desktop), still centered; kicker unchanged at 12px.
- `.works_list` still `display:flex; flex-direction:column`, but items no longer overlap.
- `.works_item` computed `position: relative` (**not** `sticky`) — the entire sticky-stack mechanic is absent.
- `.works_card-wrap` and `.works_image` both `transform: none` — **no scale effect, no scroll-driven motion of any kind** on mobile.
- Card (well) is **374×374 — square, 1:1** — a different aspect ratio than desktop's 3:2, not just a rescale. `border-radius` still 20px.
- Cards stack in plain document flow with **8px gaps** between them (item0 top 1789/height 374; item1 top 2171 → gap = 2171 − (1789+374) = 8px).
- No touch fallback for hover exists or is needed, since desktop hover already does nothing (§5).

## 10. FRAMES

- `design-dna/frames/decodes/cosmos-works/entrance-mid.jpeg` — scrollY 3210, item 2 (Bravo1Alpha) mid-settle (wrap≈1.053, image≈1.144), item 1 (Mad Dogs) fully settled and pinned above it.
- `design-dna/frames/decodes/cosmos-works/hover-state.jpeg` — item 1 (Mad Dogs) under a sustained real/trusted hover; visually identical to the non-hover state per §5.
