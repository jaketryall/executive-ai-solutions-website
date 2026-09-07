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
- `.dr-svc-well img` / the phone mock (`.dvc`) never changes `transform`/`translate` on scroll or on hover — the phone is still per the imagery-is-still law.

## §03 · Proof cards
- Rest (page settled, no hover, no focus): every `.dr-pf-veil` opacity `0`; every `.dr-pf-demo` `visibility: hidden`; every `video` inside `.dr-pf-demo` `.paused === true`.
- During a card's scroll-entrance (still translating, `--sp` between 1 and 0.62): no `.dr-pf-veil`/`.dr-pf-demo` becomes visible/composited — a burst-frame capture across the entrance shows no unexpected appear/disappear.
- Hover/focus-visible on `.dr-pf-card`: `.dr-pf-well img` `filter: blur(10px)`; `.dr-pf-veil` opacity `1`; `.dr-pf-demo` `visibility: visible` and `clip-path` resolves to the full rect; `video.paused === false`.
- Mouseleave/blur: `video.paused === true`, `video.currentTime === 0`, `.dr-pf-demo` returns to `visibility: hidden` after its transition delay (~0.7s).
- `.dr-pf-well img` covers the visible part of its well at scroll fractions F ∈ {.95, .75, .55, .35, .15, −.05, −.25} on 1440 / 390 / 2560 — measured top and bottom margins ≥ −0.5px (no exposed well edge) at every fraction and every width.
- `.dr-pf-well img`'s `translate` is driven directly by `--pp` with no `data-sp-lerp` on that node (not chased).
- Entrance settle: `.dr-pf` `translate` resolves to `0` by the time `.dr-proof-grid`'s top edge reaches 62% of viewport height (±2%).
- `.dr-pf-demo` clip-path at rest and open both contain `round 8px`; mid-transition (250ms after hover) it is an inset with round, never a polygon.

## §04 · How it runs
- Every `.dr-run`'s `--cp` reaches `1` (±.02) by the time `.dr-runs-grid`'s top edge reaches .73× viewport height.
- Past that arrival point, `--cp` is identical across 3+ further scroll positions — no walking light, no continuing drift.
- `prefers-reduced-motion: reduce`: `.dr-run { --cp: 1 }` — the reduced frame equals the fully-settled frame.
- Each panel's demo fires once at its `data-once-at` threshold and does not retrigger on scroll back up past that threshold.

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
