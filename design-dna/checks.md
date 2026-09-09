# Checks — /dark (the verifier's permanent regression suite)

Every line here is a ONE-LINE EXECUTABLE assertion with an expected value.
The verifier runs every line for a section whenever that section (or
anything upstream of it, like the engine or a shared component) is
touched — a fix that isn't turned into a line here is a fix that can
silently regress. Append a new line whenever a builder step fixes a real
bug; never delete a line.

## Page-wide
- No horizontal overflow at 390 / 1440 / 2560: `document.documentElement.scrollWidth === window.innerWidth` at each width.
- 0 console errors across page load and a full scroll walk (top to bottom, 0.5×viewport steps).
- Frame probe on a SETTLED page (wait 5-8s after load/last edit before sampling): `rAF` loop doing `scrollBy(0,14)` ×150 → 0 frames >34ms.
- `prefers-reduced-motion: reduce`: every `[data-sp]` element's transform/opacity matches its resting (non-scrolled) value regardless of scroll position; nothing is left `visibility:hidden` or `opacity:0` with no reduced-motion path to reveal it.

- The seam above the title: `.dr-voices`'s top padding plus the header's centring must not push the claim more than ~300px below the end of §03. The isolation is the header's `min-height` doing its job; the padding is only the seam.

## Type scale (page-wide)
- Every `font-size` in `app/dark/dark.css` resolves to a `--fs-*` token. The only permitted raw values are the nav lockup's responsive steps (10/11px), `.dr-svc-arrow` (17px), `--hero-fs` and `.dr-close-lockup`. A new raw size is a change to the scale, not an exception to it.
- The page has TWO peaks and they agree: `.dr-voices-lead` and `.dr-close-h` both compute 88px at 1440. `.dr-say-h` is NOT one of them — it sits a rung down on `--fs-feature` (56px) with nothing else, because a section's statement is not the page's closing line. The four section headers agree at 38.4px: `.dr-proof-h`, `.dr-runs-lead`, `.dr-obj-h`, `.dr-svc-title`.
- `.dr-voice blockquote p` is 38.4px — the same rung as the section headers, and roughly 2.3× smaller than the title above it at 1440. At 390 that ratio compresses to 1.65× because `--fs-section` reaches its floor while `--fs-display` is still fluid; that is the clamps doing their job on a small screen, not a regression.
- No element with its own text node computes an inherited-fallback size. Walk the page and assert nothing but `.dr-svc-arrow` sits at 17px — a custom property that loses a name collision does not error, it silently becomes the inherited value.
- `--fs-*` is declared on `:root`, never on `.dr-root`: `.t-meta` is used outside the room's wrapper. Assert every `.t-meta` on the page computes 12px, except `.dr-wk .t-meta`, which deliberately overrides to `--fs-body-s`.
- `--t-micro` still resolves to `300ms`, and elements using it report a `transition-duration` of 0.3s — the type scale must never shadow the duration ladder again.

## §02 · Services rows
- `--dy` per `<li>` is monotonic non-increasing as scroll progresses (rows never translate downward) — sweep the whole section in 20px steps, settling the 0.1 chase before each read, and assert NO step increases `--dy`, on screen or off. It held only off-screen until 2026-09-07: the lift that covers the rows' give-back used to clamp the moment the line cleared the last row, which is exactly when that row's spot starts decaying with nothing after it to replace what it returns.
- The currently-lit row's `--spot` reaches 1 (±.02) when its vertical centre crosses the 60vh reading line; neighbouring rows read <1 at the same moment.
- Lit row `scale` = `1 + .045 × --spot` (±.002) at 1440.
- `.dr-svc-in::before`'s `inset` is unchanged across every sampled scroll position — only `scale` changes (confirms the constant-box-scaled-on-X construction, not a clip/inset grow).
- `.dr-svc-well img` (`.dr-svc-shot`) never changes `transform`/`translate` on scroll or on hover — the picture is still per the imagery-is-still law.
- Every `.dr-svc-well` measures 4:3 (rect width / height = 1.333 ±0.01) at 390 / 1440 / 2560, and no width overflows horizontally (`scrollWidth === innerWidth`).
- The spot dim is OFF the picture: `.dr-svc-row`'s computed opacity equals its `--rv` (not `--rv × (.5 + .5·spot)`), and `.dr-svc-row > :not(.dr-svc-well)` carries `.5 + .5·spot`.
- `.dr-svc-well::after` opacity = `(1 − --spot) × .45` (±.02) — an unlit well must render DARKER than a lit one, never paler. Sample a bare-background patch inside a lit and an unlit well: the unlit one reads near rgb(26,25,28), not a mid grey.
- `/services/ad.jpg`, `/services/websites.jpg` and `/services/follow-up.jpg` (or their `/_next/image` forms) all return 200.

## IN THEIR WORDS (between §03 and §04)
- `h2.dr-voices-lead` reads `--out` 0 while it is centred in the viewport — the title must be at full strength (opacity 1, blur 0) exactly where it is being read. Its exit window is measured on the H2's own rect, never on the `.dr-voices-head` around it: the header's `min-height` made it 702px tall, and measuring that box had the title 37% faded while still centred.
- A resting `.dr-voice`'s quote text clears 4.5:1 against the ground measured on the BLENDED pixel — the colour composited through the element's own opacity, not the declared colour. Reading the declared colour instead once passed a floor that was really 1.97:1.
- Each `li.dr-voice`'s light peaks in the middle of its pass: sweep its window and assert computed opacity reaches ≥.98 and returns to the resting floor of .5 at both ends, and that opacity equals `.5 + .5 × (clamp(0, min(sp*2, (1-sp)*2), 1))²` (±.02) — squared, and floored at .5 so a resting quote still clears AA.
- No `.dr-voice` ever translates DOWNWARD: sweep the section and assert each quote's computed translateY is monotonically decreasing with scroll. It must ride `--sp` (monotonic), never `--lit` (a tent) — keyed to the tent a quote sank back down as it left while the next rose to meet it, and they read as colliding.
- One at a time: at the middle quote's peak, each neighbour's computed opacity is at most 60% of the peak's. A RATIO, not an absolute — the resting floor is an accessibility decision (text at rest must clear AA against the ground) and the separation is a design one; an absolute ceiling silently couples them, and did: raising the floor for contrast broke the old ≤.45 line without the design getting any worse.
- `ul.dr-voices-list` computed `flex-direction` is `column` and the three `li` share a left edge — it must never become a grid again; three cards in a row directly under §03's three cards in a row is the thing this section exists to avoid.
- `h2.dr-voices-lead`'s spans are opacity 1 / filter none / scale 1 with `--in` UNSET — the no-JS frame is the finished one. Below its window the engine writes `--in: 0` and the spans are deliberately blurred, small and 64px low: that is the start of the scrubbed arrival, not a stuck state, and the section is off screen whenever it is true. They must be fully sharp again through the hold zone.
- The title's two windows never overlap: no scroll position has `--in` < 1 while `--out` > 0. The hold between them is ~190px of scroll at 1440 — that gap is the whole point, it is where the claim is simply readable.
- The kicker above it still runs the room's standard wipe (gains `is-wiped`, ends at opacity 1) — the title is the only exception to law 11, and only the title.

## §03 · Proof cards
- `li.dr-pf` `--ex` reaches 1 as the row's bottom clears the top of the screen, lifting the outer pair −26px and the centre −13px (the entrance's two rates, quartered). `--ex` must be 0 at every scroll position where `--sp` < 1 — the exit may never bleed into the entrance.
- Rest (page settled, no hover, no focus): every `.dr-pf-veil` opacity `0`; every `.dr-pf-demo` `visibility: hidden`; every `video` inside `.dr-pf-demo` `.paused === true`.
- During a card's scroll-entrance (still translating, `--sp` between 1 and 0.62): no `.dr-pf-veil`/`.dr-pf-demo` becomes visible/composited — a burst-frame capture across the entrance shows no unexpected appear/disappear.
- Hover/focus-visible on `.dr-pf-card`: `.dr-pf-well img` `filter: blur(10px)`; `.dr-pf-veil` opacity `1`; `.dr-pf-demo` `visibility: visible` and `clip-path` resolves to the full rect; `video.paused === false`.
- Mouseleave/blur: `video.paused === true`, `video.currentTime === 0`, `.dr-pf-demo` returns to `visibility: hidden` after its transition delay (~0.7s).
- `.dr-pf-well img` covers the visible part of its well at scroll fractions F ∈ {.95, .75, .55, .35, .15, −.05, −.25} on 1440 / 390 / 2560 — measured top and bottom margins ≥ −0.5px (no exposed well edge) at every fraction and every width.
- `.dr-pf-well img`'s `translate` is driven directly by `--pp` with no `data-sp-lerp` on that node (not chased).
- Entrance settle: `.dr-pf` `translate` resolves to `0` by the time `.dr-proof-grid`'s top edge reaches 62% of viewport height (±2%).
- `.dr-pf-demo` clip-path at rest and open both contain `round 8px`; mid-transition (250ms after hover) it is an inset with round, never a polygon.

## §03→§04 · Curtain lift — RETIRED 2026-09-06 (reverted on Jake's call, code back at `40aec08`; kept for the record, the verifier SKIPS this section)
- At p=1 (the `.dr-proof-lift` wrapper's bottom edge at its window end, .32vh): `.dr-proof` rect.bottom and `.dr-runs` rect.top both within ±6px of 0, at 1440 and 390 — no gap, no leftover overlap at the lock frame.
- Speed: between W.bottom = .8vh and W.bottom = .6vh (180px of scroll at 1440), `.dr-proof` rect.bottom moves ≥255px (≈1.5× native scroll — measured 264.7px).
- The curtain is opaque mid-lift: `elementFromPoint` just above `.dr-proof`'s bottom edge resolves inside `.dr-proof`; just below it resolves inside `.dr-runs` — the plate is visible only once the curtain has actually passed, never through it.
- THE HEADER'S OWN OFFSET (`.dr-runs` padding-top = `calc(var(--seam-lift) * 0.9)`, fixed 2026-09-06 — a plain clamp() left the room a blank light wall through the first half of the lift, graded off the frames): `.dr-runs-kicker`.top ≥ `.dr-proof`.bottom + 4px by W.bottom = .88vh (measured 25px/1440, 20.7px/390) — the header is the FIRST thing the curtain uncovers, well before the lock frame. At p=1, kicker top sits within ±12px of .29×vh (measured 262px/900 at 1440, 243px/844 at 390 — target 261/245).
- Wipes (`data-wipe-at="0.86"` on the §04 kicker/lead/sub, fixed 2026-09-06 — .45 left the header uncovered but blank from p≈.1 to p≈.76): not fired at W.bottom = .93vh; started (is-wiped, lines opening) by W.bottom = .80vh, at which point `.dr-runs-kicker`.top is already below `.dr-proof`.bottom (measured 694.2 > 637.4 at 1440; 648.1 > 597.6 at 390) — header clear of the hem before its text ever shows.
- THE SLAB SITS STILL (fixed 2026-09-06: `.dr-runs-grid` no longer has its own `--ap`/translate/opacity, `.dr-run` no longer has `opacity: var(--cp)` — the curtain lifting off is the only reveal): at W.bottom = .7vh, computed `opacity` of `.dr-runs-grid` and every `.dr-run` is `1`, and `.dr-runs-grid`'s computed `translate` is `none`. `--cp` still drives the rail's lit line only.
- Every `.dr-run`'s `--cp` reaches `1` (±.02) by the time `.dr-runs-grid`'s top edge reaches .46× viewport height (the grid's own window is now data-sp-from="0.7" data-sp-to="0.35", scoped inside the already-uncovered plate).
- CARD STRADDLE (fixed 2026-09-06: `.dr-obj` dropped its own top padding, which had pushed the card 18px below the plate — `margin-top: calc(-1 * var(--exit-lap))` alone now places it): at `.dr-runs`.bottom = .5vh, `.dr-obj-card`.top = `.dr-runs`.bottom − `--exit-lap` exactly (measured diff 0px, exit-lap 90px at 1440); `elementFromPoint` 20px above AND 20px below `.dr-runs`.bottom both resolve inside `.dr-obj-card` — the card bleeds across the plate's bottom edge onto the flipped ground.
- `prefers-reduced-motion: reduce`: `.dr-proof { translate: none; }` and `.dr-runs { margin-top: 0; }` are declared AFTER their own base rules (source-order tie-break under equal specificity).

## §04 · How it runs
- Every `.dr-run`'s `--cp` reaches `1` (±.02) by the time `.dr-runs-grid`'s top edge reaches .73× viewport height. (RE-ACTIVE 2026-09-06: the curtain lift was reverted; the grid's window is data-sp-from="1" data-sp-to="0.62" again and this threshold holds.)
- Past that arrival point, `--cp` is identical across 3+ further scroll positions — no walking light, no continuing drift.
- `prefers-reduced-motion: reduce`: `.dr-run { --cp: 1 }` — the reduced frame equals the fully-settled frame.
- Each panel's demo fires once at its `data-once-at` threshold and does not retrigger on scroll back up past that threshold.
- ONE RULED SLAB (2026-09-06, ba6ad74): all four `li.dr-run` rects share `top` and `height` (±1px) at 1440 — one flat surface, not a staircase; `.dr-run-riser` and `.dr-run-tread` do not exist in the DOM; computed `backdrop-filter` on `.dr-run` and `.dr-runs-grid` is `none`; computed `translate` on every `.dr-run` is `none`.
- Every `.dr-run-rail` rect spans its own cell's full width (`left`/`right` match the cell's, ±1px) and all four rails share the same `top` at 1440 — the ruled line is continuous across the slab.
- 2×2 at 1000px: cells 1–2 share `top`, cells 3–4 share `top`; `getComputedStyle(cell3, '::after').height === '1px'` (row rule over the second row); odd cells' `::before` (vertical divider) is `display: none`.
- One column at 390px: each cell's rail spans the cell (`left`/`right` ±1px); `.dr-run + .dr-run::before` (vertical divider) is `display: none`; `.dr-run + .dr-run::after` (row rule) is `1px` tall; `.dr-runs-head` has no left padding.

## §05 / §06 · Object + close
- `.dr-obj`'s ground colour transitions exactly once across a full scroll-through (void → `#171719`) and does not revert on scroll-up-then-down-again.
- `.dr-close-rig`, `.dr-close-glow`, `.dr-close-mark` carry no `data-sp` attribute and show no scroll-driven translate at any sampled scroll position (rigid, per decisions.md) — RETIRED 2026-09-06, elements removed.
- `.dr-obj-card` computed `scale` resolves to `1 - .06 * --exit` at every sampled scroll position (mid-window ≈0.97, fully exited 0.94 ±0.005 at 1440/390) and `border-radius` is IDENTICAL between the mid and end samples (constant, never animated).
- At page maxScroll, `.dr-obj-card`'s bottom edge sits between 0.06 and 0.45 of viewport height at 1440 (the reveal must be visible — §06 must not be tall enough to push the card fully off-screen). (floor lowered to 0.06 on 2026-09-06 after the inline pill and lockup grew §06 by ~60px; the edge is visible at ~0.08–0.17vh)
- `.dr-close-h` renders exactly 4 line boxes (each `.dr-close-line`'s own height equals one line-height, no internal wrap) at 1440 and 2560, and ≤5 at 390.
- `.dr-close-nav` and `.dr-close-side` have zero horizontal overflow (`scrollWidth <= clientWidth`) at 1440.
- `prefers-reduced-motion: reduce`: `.dr-obj-card` computed `scale` is `none` or `1` (the reduced-motion override must be declared AFTER `.dr-obj-card`'s own base rule in source order, or the base rule's equal-specificity `@media` wins and the card stays visually shrunk).

## Headings · the one triggered vocabulary
- Every `[data-wipe]` heading gains `is-wiped` once its top crosses <0.9vh of the viewport (read the "fired" state with the wait INSIDE the same `evaluate_script` call — a wipe restores its plain text ~1-1.4s after firing, so a second round-trip can land too late).
- After the wipe's transition completes, the heading's text content is byte-identical to its authored source (the split-into-lines markup is fully restored, not left mid-wipe).

## The flip · nothing may be hand-written white
- `grep -n "255, 255, 255\|255 255 255" app/dark/dark.css` inside the back half (`.dr-flip`'s subtree: `.dr-run*`, `.dr-demo*`, `.dr-runs-*`, `.dr-obj*`, `.dr-close*`) returns only declarations that are ALSO crossed by a `.dr-flip …` override or a `color-mix(… var(--flip) …)`. A bare white is invisible on the white room; this has now shipped broken twice (2026-09-07 the demo inks, 2026-09-08 the design blocks, the growth stroke and both halves of the rail).
- With `--flip: 1` forced on `.dr-root`, every §04 element carries visible ink against the card: `.dr-run-rail` and its `::after`, all four `.dr-demo-*`, and `.dr-run-well`'s border each measure a non-zero contrast against their own backdrop.
- With `--flip: 0` forced on `.dr-root`, the same holds against the dark card — §04 must read in EITHER room, because where the flip lives is not settled.

## IN THEIR WORDS · the card's three beats
- The lit quote's `.dr-voice-card::before` computed opacity is > .7 while its neighbours' are < .3 (one card in the light at a time).
- `.dr-voice figcaption` opacity is 0 for a quote whose `--lit` is below .34 (the attribution is the last beat, never the first).
- `.dr-voice-rule` computed transform is a scaleX, never a width change (a width would relayout the figure every frame).

## The flip · frame budget
- Scrolling 5px/frame through the flip window at 1440 and at 2560, no frame exceeds 33ms and fewer than 10 exceed 20ms. (Harness: rAF loop recording deltas while stepping `window.scrollTo`; the regression to catch is a new per-frame `color-mix` or a large blurred shadow whose colour rides `--flip`.)
- `--flip` computed on `.dr-root` reaches exactly `0` and exactly `1` at the ends of its window — the step must divide 1 evenly or the room never finishes inverting.
- The page ground (`.dr-root` background-color) is CONTINUOUS through the flip: sampling it at 50px intervals gives a strictly monotonic ramp with no repeated value.
- Every `[data-sp]` track still publishes a non-empty value at every scroll position (the skip-identical-write guard must never leave a var unset — 15 tracks, checked top to bottom).

## The voices→§04 seam
- `.dr-voice--hand`'s computed opacity never drops below 1 once `--m` passes 1 — the converting card must not dim on its way out (the `max(--lit, --m)` is what guarantees it; keying either surface to `--lit` alone puts a step card's face on a half-faded card).
- The `.dr-voice-card::after` extension's computed transform is a `scaleY`, never a height or `bottom` change — a rounded box whose geometry moves re-rasters every frame.
- At `--m` 1 there is no horizontal rule across the converted card: `::before`'s `border-bottom-color` has reached full transparency and its bottom corner radii are 0, and the two layers overlap by 1px.
- Scrolling 5px/frame through the whole voices column including the conversion, no frame exceeds 20ms.
- The handoff face renders `STEPS[0]` and the imported `DemoCall` — never a local copy. If §04's first step is renamed or its demo changed, this face changes with it or the seam is a lie.
- `prefers-reduced-motion: reduce`: `--m` is 0 and `.dr-voice-hand` is `display: none` — the correct resting frame here is the QUOTE, not the converted card.

## The converting card holds
- `.dr-voice--hand` computed `position` is `sticky`, and `.dr-voices-hold` has real height — a flex item's sticky range comes from the flex container's content box, so removing the hold silently reduces the range to zero and the card simply never sticks.
- Once held, the card's viewport `top` stops changing AND `--sp` stops changing with it (the frozen rect is what freezes the conversion at `--m` 1).
- The held card's top clears the fixed nav's bottom edge at 734 and at 900 viewport heights.
- `prefers-reduced-motion`: `position` is `static` and the hold is 0 height — with no conversion there is nothing to hold on screen.

## Who builds it · the about beat
- The paragraph's words are separated by real spaces in `textContent` (React strips JSX whitespace inside a map — the failure is silent and runs the sentence together).
- Mid-resolve, word opacity decreases monotonically down the paragraph (a travelling edge, not a uniform fade), and the least-resolved word is never below .55.
- The words animate `opacity`, never `color` — a per-word colour change re-rasterises the glyph runs every frame.
- The well's picture uses §03's parallax constants (top -19%, height 126%, translate `pp × 35.71% − 13.1%`) — this site has ONE parallax rate.
- Scrolling 5px/frame through the section, fewer than 3 frames exceed 20ms.
- Below 900px the grid is one column and the well is 3/2 rather than 4/5; no horizontal overflow at 420 or 1440.
- The about paragraph is still resolving while it is READABLE: with its top between .7vh and .2vh there are always words at the floor AND words at full ink (an effect that completes below .55vh is invisible in practice, however correct the numbers are).
