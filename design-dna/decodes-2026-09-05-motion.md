# Decodes — 2026-09-05 (the motion day)

The day we stopped admiring reference sites and started measuring them.
Six slices of **landonorris.com** (OFF+BRAND) plus **itsoffbrand.com** and
**icomat.co.uk**, all decoded by reading computed values at sampled scroll
positions rather than by watching. Everything below is a measured number
or a stated inference — never an impression.

Written the day the dark room got its scroll engine (14b69d3).

---

## THE LAWS — what to act on

Each links to the measurement that proves it. If you read nothing else,
read these eight lines.

| # | law | proof |
|---|---|---|
| 1 | Derive the TARGET from scroll; then DAMP toward it. Never fire tweens. | §1, §9 |
| 2 | Declare effects with attributes against ONE engine. Don't hand-write each. | §2 |
| 3 | Put three rates in a viewport, not one — and CONVERGE them, don't cross. | §3 |
| 4 | Keep hover almost empty. Spend the energy on scroll. | §4 |
| 5 | Smooth the input (Lenis) and everything downstream inherits it. | §1, §5 |
| 6 | Prefetch on hover so a transition is never network-gated. | §5 |
| 7 | One committed idea per section beats five partial ones. | §0, §6 |
| 8 | Transform and opacity only. The performance IS the feel. | §8 (pending) |

**The one that is not a technique:** decode by MEASURING. "It feels fluid"
is not actionable. "The columns sit at ±95px and converge to zero" is
something you can build tomorrow. Every number in this file came from
reading computed values at sampled scroll positions.

---

## 0 · THE MASTER FINDING

**Almost none of it is exotic code.** Four things Jake singled out as
extraordinary decompose into: a two-attribute declarative system, a plain
`div` in normal flow, an authored Rive file, and `position: sticky`.

What is extraordinary is the **judgment** — knowing a solid black block
dropped between two cream sections reads as drama, and then committing to
it. The feel does not come from rarer techniques. It comes from a small
system applied with conviction.

Corollary, and the reason this file exists: **decode by measuring.** "It
feels fluid" is not actionable. "The columns sit at ±95px and converge to
zero" is something you can build tomorrow.

---

## 1 · SCRUBBED, NEVER TRIGGERED (the day's master law)

Every scroll effect on these sites is a **pure function of scroll
position**, recomputed per frame — not a tween fired when something
crosses a threshold.

Proof, from the background flip: jumping straight from scrollY 0 to 3200,
skipping every pixel between, produced the correct colour **within one
frame**. The value is path-independent. It is not animating *toward*
anything; it *is* `f(scrollY)`.

Why it matters, and it is not aesthetics:
- Scrub backwards and it runs backwards exactly.
- Land mid-page (a refresh, a deep link) and the frame is already right.
- There is no state to fall out of sync, so there is nothing to resync.

Triggered animation plays **at** you. Scrubbed animation responds **to**
you. That difference is most of what reads as "fluid".

**Ours already obeys this** — the §02 word ramp, the §03 develop, the hero
dim, the §02 exit and §04's drift are all scrubbed off one progress value.

**REFINED 2026-09-05, and this corrects my first reading of it.** It is
not quite "the value IS f(scroll)". Measured on the horizontal track: a
scroll jump moves `lenis.animatedScroll` instantly, but the transform
takes **700–900ms** to reach its new value, easing the whole way, with
`transitionDuration: 0s` — so it is not a CSS transition. There is a
per-frame lerp layered on top:

```
target  = f(scrollY)          // derived, path-independent
current += (target - current) * k     // k ≈ 0.12 per frame
```

So there are TWO smoothing layers, not one: Lenis smooths the *input*, and
each effect damps toward its scroll-derived *target*. That second layer is
a large part of what reads as fluid, and we do not have it.

Not everything gets it, though — the background colour resolved to its
correct value within a SINGLE frame after an identical jump test. Colour
snaps to `f(scroll)`; transforms damp toward it. Worth copying that split
rather than damping everything.

---

## 2 · THE ENGINE IS DECLARATIVE (the architecture worth stealing)

They did not write the background flip as an effect. They built a tiny
system and then *declared* against it:

```
<section data-h-color-from="dark-green" data-h-color-to="white">
```

Those names resolve against CSS custom properties — `--color--dark-green:
#282c20`, `--color--white: #f4f4ed` — matching the measured endpoints
exactly. One generic engine reads the attributes, computes progress
through that element, lerps, and writes `body.style.backgroundColor` every
frame. `transitionDuration` is `0s` throughout; no CSS transition is
involved at all.

Adding a colour change anywhere on that site is **two attributes**, not
new code. A parallel `data-gl-change-from/to` pair feeds a fixed WebGL
backdrop the same values, so both layers stay in sync from one
declaration.

Measured curve: fits `2t − t²` (ease-out quadratic) within ±0.03. R, G and
B move in lockstep — one shared eased `t` lerped across all three
channels, not per-channel curves. Active range 2242 → 4005 (1763px), which
is the moment the declaring section's top hits the viewport top.

**→ Became ours:** `components/dark/scroll-engine.ts` (14b69d3). One
listener, one rAF, one measurement pass. Writes `--sp` (0→1) and `--spx`
(the same in px) and **animates nothing** — the stylesheet turns those
into motion with `calc()`. Engine produces inputs, CSS produces movement.
Before it, this page ran four scroll listeners and five rAF loops all
calling `getBoundingClientRect` in the same frame.

---

## 3 · DEPTH IS RATE DISAGREEMENT, NOT 3D

The single biggest gap between our page and theirs, and it has nothing to
do with WebGL.

**itsoffbrand.com's work grid**, measured: alternating columns carry equal
and opposite offsets — `[+95.1, −95.1, +95.1, −95.1]` — whose magnitude
shrinks as the section passes: 95.1 → 79.1 → 62.4 → 45.6 over 1200px of
scroll. One column lags while its neighbour leads, and both converge.

Any given viewport there has three or four speeds in it. Ours had one,
which is why it read as a slab.

**→ Became ours:** §04's four cards, ±34px converging to 0 (14b69d3):

```
grid top at   -800   -500   -250     0
--sp          0.24   0.54   0.79     1
drift        ±25.9  ±15.6   ±7.0     0
```

**It must CONVERGE, not cross.** My first pass crossed through zero at the
midpoint, which froze the cards at maximum scatter for the whole time you
were actually reading them — the opposite of the reference, where the
magnitude shrinks as the section arrives.

---

## 4 · THE HOVER LAYER IS NEARLY EMPTY

itsoffbrand.com's work-card hover, in full: image `scale(1.05)` →
`scale(1.1)`, `transition: transform 0.6s`. That is the entire
interaction. Title, cross icon, opacity, siblings — all unchanged.

Sites that feel cheap put their energy in hover. These put it in scroll
and leave hover almost bare.

---

## 5 · TRANSITIONS ARE WHY IT FEELS LIKE AN APP

**It never reloads the document.** Set `window.__marker`, click an
internal link, and the marker survives — across five consecutive route
changes. `performance.getEntriesByType('navigation')` returns exactly
**one** entry after all of them.

Router: **Taxi.js** (`<main data-taxi><div data-taxi-view data-page="…">`
— that attribute triplet is its contract). It performs a real `GET` for
the destination's own clean URL, parses the HTML, and swaps only the view
container.

The transition itself is **not CSS**. A persistent full-viewport
`position: fixed; z-index: 9999` div is only a *stage* — transparent
background, toggled by inline `visibility`, `transition-duration: 0s`. The
animation is a **Rive canvas** inside it, one `.riv` loaded once and
reused for every navigation. Confirmed animating by hashing canvas pixels
every 80ms; the sequence ran forward, then near-mirrored after the swap.

Shape, measured across three trials:
1. click → overlay `visible` (1–40ms)
2. Rive "cover" plays **~1100–1200ms**
3. DOM swap + scroll reset + `<title>` + `pushState`, invisible underneath
4. Rive "reveal" plays **~900–1000ms**
5. overlay hidden — **total ≈ 2050–2130ms**

Two details that make it feel instant despite taking two seconds:
- **Hover prefetch.** Hovering a nav link fires the `GET` 500ms before any
  click. The transition is never network-gated — the 2.1s is pure
  animation.
- **Per-view caching.** Returning to a visited route re-fetches nothing.

And the app shell never tears down: **one Lenis instance persists across
every navigation** (tagged it, the tag survived four more transitions).
Scroll resets to 0 at the swap, hidden behind the overlay.

---

## 6 · WHAT THE "IMPOSSIBLE" BITS ACTUALLY ARE

- **The hamburger that morphs to an X** — a `<canvas>` running Rive
  (`@rive-app/canvas-lite`), not SVG and not divs. There is no `d`
  attribute to morph because there is no SVG in the DOM. Shape keyframes
  live in a compiled binary; even the hover reaction is handled by Rive's
  internal listeners. One `.riv` is reused seven times site-wide, each
  instance picking an artboard by attribute. Page JS only manages
  `aria-expanded` / `aria-label`.
  **Tooling answer, not a technique answer.**

- **The "next race" banner** — no countdown, no API. Three text samples
  1.1s apart were byte-identical; no race-data request in the resource
  log. A Webflow CMS collection rendering one item, baked into static HTML
  at publish. Pinned with `position: sticky`, not parallax. The track
  outline is another Rive canvas keyed by an input attribute.

- **The footer's "mask of him"** — two different things, and only one is a
  mask. The **panel shape** is a genuine CSS `mask-image` with an external
  SVG (`mask-size: cover`; a rounded rect with a notch top and bottom).
  The **figure** is an alpha WebP: corners sample `a:0`, centre `a:255`,
  and `mask-image`/`clip-path` are `none` on the img and every ancestor.
  A transparent cutout dropped in as a plain `<img>` at `z-index: 5`.

- **The infinite marquee** — JS writing `translate(X%, 0)`, not CSS
  keyframes (`animationName: none`). Four identical clones laid edge to
  edge with zero gap, **all carrying the same percentage**, so a wrap at
  ±100% is undetectable. ~34–40px/s at idle. Direction latches to the last
  scroll direction rather than springing back.

- **The "background moving down from the helmets"** — not an effect at
  all. `transform: none` at every sampled position, rect moving exactly
  1:1 with scroll, no sticky, no clip-path, no JS. A plain full-bleed dark
  `div` in normal flow, flanked by cream above and below. It reads as
  choreography because a solid black block arriving between two light
  sections *is* dramatic.

---

## 7 · THE TEXT MOVES (and why we did not keep it)

itsoffbrand.com's h1 exits **per character in a shuffled order**, not a
sweep. At a third of the way through: characters 0/3/5/7 mid-flight at
90%, 61%, 86%, 53% while their immediate neighbours had not started. A
left-to-right sweep reads mechanical; a scattered one reads alive, and
costs the same.

icomat.co.uk's second section does the readable-word version: each word
ramps 0.2 → 1 left to right, with a **front about four words wide**. Ramp
width is the whole effect — narrow it to one word and the line snaps on a
word at a time and looks cheap. Floor 0.2, never 0, so the sentence is
always readable.

**We built the character version and reverted it (4ab973b).** It was a
faithful decode of somebody else's signature. This room's law is that
light travels along things; a headline coming apart into letters says
nothing about that. **Imported, not derived.** The icomat word ramp stayed
(§02) because it *is* light crossing a line.

---

## 8 · STILL OPEN (slices in flight)

- Horizontal track + on-track/off-track panels — pin technique, px-per-px
  ratio, converge vs cross
- Image parallax ratios, the socials fan-on-hover falloff, Lenis config
- Performance profile — LCP/CLS, long tasks under scroll, and the ratio of
  compositor-friendly to layout-triggering properties
- The helmet WebGL layer (lowest priority — not replicable without a 3D
  pipeline, and Jake does not want a 3D object anyway)

---

## 9 · THE HORIZONTAL TRACK, AND TWO CURVES IN ONE SECTION

**The pin is native CSS `position: sticky; top: 0`** — not a JS transform
or a fixed-position hack. The sticky elements are inert; they never
receive a transform. Only a descendant does.

The moving element takes a JS-written `transform: translate3d(Npx,0,0)`.
Settled values across the pin span, 6 samples:

```
frac        0.0    0.2    0.4    0.6    0.8    1.0
translateX  -692  -1032  -1372  -1713  -2053  -2394
```

Deltas ≈ −340.4px per step — **perfectly linear, ratio exactly 1:1**. One
vertical scroll pixel buys one horizontal pixel, over a domain exactly
equal to the section's own height, starting one viewport-height before the
pin visually engages:

```
translateX = -clamp(scrollY - (sectionTop - vh), 0, sectionHeight)
```

`overflow: visible` and `will-change: auto` on every element in the chain.
No clipping, no compositing hints. The restraint is notable.

### Two curves, deliberately, in the same section

The on-track/off-track panels are NOT pinned — plain scroll-linked
transforms. Two pairs, each mirrored, both converging to exactly 0 with no
overshoot. But they do not share an easing:

| | window | curve |
|---|---|---|
| text columns | ~830px | perfectly LINEAR, 0.06693 px/px |
| images | 1384px = exactly 2× viewport | cubic ease-out, `x = start × (1−p)³` |

The cubic fit is essentially exact at every sampled point (at p=0.5,
predicted −27.78 vs measured −27.775).

**This is the craft.** Same section, same trigger convention, two authored
curves: text slides in linearly over a short window while imagery
decelerates in over twice the distance. That mismatch is deliberate — it
is law 3 (rate disagreement) applied *within* a single composition rather
than between sections.

Both confirmed scrubbed by a 10px nudge test: the track moved exactly
−10px (matching 1:1), the image moved +2.45px (matching the local slope of
its cubic).
