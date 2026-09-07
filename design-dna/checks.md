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

## §02 · Services rows
- `--dy` per `<li>` is monotonic non-increasing in the upward direction as scroll progresses (rows never translate downward) at 3+ scroll positions.
- The currently-lit row's `--spot` reaches 1 (±.02) when its vertical centre crosses the 60vh reading line; neighbouring rows read <1 at the same moment.
- Lit row `scale` = `1 + .045 × --spot` (±.002) at 1440.
- `.dr-svc-in::before`'s `inset` is unchanged across every sampled scroll position — only `scale` changes (confirms the constant-box-scaled-on-X construction, not a clip/inset grow).
- `.dr-svc-well img` (`.dr-svc-shot`) never changes `transform`/`translate` on scroll or on hover — the picture is still per the imagery-is-still law.
- Every `.dr-svc-well` measures 4:3 (rect width / height = 1.333 ±0.01) at 390 / 1440 / 2560, and no width overflows horizontally (`scrollWidth === innerWidth`).
- The spot dim is OFF the picture: `.dr-svc-row`'s computed opacity equals its `--rv` (not `--rv × (.5 + .5·spot)`), and `.dr-svc-row > :not(.dr-svc-well)` carries `.5 + .5·spot`.
- `.dr-svc-well::after` opacity = `(1 − --spot) × .45` (±.02) — an unlit well must render DARKER than a lit one, never paler. Sample a bare-background patch inside a lit and an unlit well: the unlit one reads near rgb(26,25,28), not a mid grey.
- `/services/ad.jpg`, `/services/websites.jpg` and `/services/follow-up.jpg` (or their `/_next/image` forms) all return 200.

## §03 · Proof cards
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
