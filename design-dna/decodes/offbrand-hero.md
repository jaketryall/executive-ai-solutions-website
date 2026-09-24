# Decode — itsoffbrand.com hero: the orb and the words (2026-09-23)

Measured live, 1440×900, dark scheme (their `<html class="dark">`, ground rgb(29,29,29)). Frames: `frames/offbrand-x/{dark-load,dark-scroll}.jpg` (gitignored); raw numbers: `frames/offbrand-x/scroll-probe.json`, `dom-dark.json`.

**The intro (load, not scroll).** Their mark (a "+" with a dot, two SVG paths in a 162 viewBox, 229–305px) draws in outline, fills stroke by stroke (the T, then the +) by ~4.5s, turns to an X with a gradient (Jake's screenshot), and becomes the orb.

**The orb is FIXED.** `.orb-w` is `position: fixed`, full viewport. Inside it are `.orb` (a WebGL `<canvas>`, the body itself: 507px during the intro, 720px at rest = 0.8 of the viewport height, centred) and two `orb-outline` rings that turn with the scroll. Nothing around it is pinned; the page flows past a light that stays on screen. **That is why it doesn't feel stuck.**

**The orb's path by scroll** (scale / translateX on the orb):

| y | scale | x |
|---|---|---|
| 100 | 1.00 | 0 |
| 200 | 1.34 | +247 |
| 400 | 1.60 | +430 |
| 600 | 1.78 | +558 |
| 1000 | 1.96 | +690 |
| 1400 | 2.00 | +720 (half off the right edge) |
| 1800 | 1.99 | +688, y −4 |
| 2200 | 1.83 | +237, y −60 |
| 2800 | 1.51 | −692, y −176 |
| 3600 | 0 (gone) | |

It lights the statement, the logo grid and the featured work from behind.

**The words are in NORMAL FLOW** (h1s scroll 1:1): "A different" at (144,38), "Creative" at (811,299), "approach" at (300,559) at y 100, set around the centred orb. Font Ataero, 102.857px, uppercase, rgb(229,228,224). Every letter is its own `.char` in a mask. It ARRIVES from translateY +103.888px (+1.01em) to 0 (the intro), and LEAVES by dropping back to +103.888 with its opacity to 0 in a RANDOM order between y ~200 and ~800 (e.g. at y 300, "d" is at 42.8 o.59, "e" at 68.1, "n" at 103.9 o0, and the rest still 0).

**Port** (`?v=yours`, components/dark/yours-next.tsx): the fixed orb, CSS radial layers under a soft mask (no WebGL), path on the room's engine: --yin on the section (appear → grow to 2× + carry +50vw) and --yout on a marker after the services (swing back −62vw + shrink out). Letters in masks, arriving and leaving by a deterministic per-letter random. Nothing sticky.
