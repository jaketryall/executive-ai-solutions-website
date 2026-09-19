# Decode — leoparpeix.com · Drag work rail (+ homepage inventory)

URL: https://www.leoparpeix.com/  Viewport: 1440×736 (primary), 390×844 mobile check  Date: 2026-09-18

Primary target: the per-project horizontal drag filmstrip inside "Selected projects"
(Jake: vertical + horizontal parallax on the items, wants it activated on scroll
instead of drag). Secondary: one line each on every other homepage effect.

**Headline finding: this rail is not a DOM/CSS animation at all.** The
`.projectBlock__slider` / `.slider__media` / `.media__image` nodes are empty,
untransformed position-and-size PROXIES. All visible imagery, the drag
response, and (if it exists) the parallax are rendered on a full-viewport
`<canvas>` pair that sits over/behind the DOM. `getComputedStyle` on every
proxy returned `transform:none` in EVERY state tested — at rest, mid-drag,
and after a 1000px drag that visibly changed the whole screen. This caps
what can be reported as numbers: geometry (px, counts, aspect ratios) is
fully measured; motion curves (rate, lerp constant, inertia decay, bounds
behavior) are NOT measurable from the DOM and are flagged as such below
rather than estimated.

---

## 1. STACK DETECTION

- Vue 3 SPA: `data-v-7bd7230c` scoped-style attributes on the slider/media
  nodes. Single bundled script `assets/index-BZFBO0Ol.js` (Vite output
  naming convention) + `_vercel/insights/script.js`. No `__NUXT__`/
  `__NEXT_DATA__` globals.
- `<html class="lenis lenis-smooth">` — Lenis smooth-scroll wraps the whole
  page. Not confirmed via `window.Lenis` (undefined — bundled, not global).
- `window.gsap`, `.ScrollTrigger`, `.Draggable`, `.InertiaPlugin`,
  `.Observer` are all `undefined`. **Inconclusive, not "no GSAP"** — the
  entire app is one minified bundle; nothing being attached to `window`
  only proves nothing is attached to `window`.
- Two `<canvas>` elements, both `position:fixed`, both CSS-sized
  1440×736 (full viewport): one with backing-buffer `width:1440 height:736`
  (1×), one with `width:2880 height:1472` (2×). Classic devicePixelRatio-
  aware render target pattern; which one is the 3D scene vs. a second
  pass (post-process / text overlay) was not disambiguated.
- Custom drag-cursor system: `.cursorIndication` (`position:fixed`,
  `will-change:transform`, `transitionDuration:0s` → written imperatively
  per frame, not CSS-eased), text "Drag" (uppercased via CSS,
  `.cursorIndication__label`). Separate `.beeTextIndication` cursor system
  exists for a different homepage interaction (see §11).
- Body gate: `<body class="awaiting-sound-click">` + `.loaderBlock` overlay
  — the page functions before this is dismissed; not a content preloader
  in the traditional sense (see §11).

## 2. LAYOUT (1440×736) — the Creandum rail

- "Selected projects" is NOT one shared rail. Each of the six featured
  projects (Creandum, Veillance, Mechachain, Dulcedo, Dioriviera,
  Trebuchet) gets its OWN `.webglBg.projectBlock` section with its OWN
  `.projectBlock__slider` — i.e. six separate per-project horizontal
  filmstrips, each showing THAT project's own site screens (confirmed:
  dragging far enough inside the Creandum rail surfaced a screen reading
  "OUR BELIEF … We believe in creating the right links between people,
  companies, opportunities, ideas, continents" — Creandum-brand mission
  copy, not portfolio chrome).
- Creandum block geometry: outer `.webglBg.projectBlock` section
  1440×918.38px; inner `.webglBg__content.projectBlock` 1440×795.38px.
- `.projectBlock__slider`: `display:flex; position:relative`, width
  **12540px = exactly 12 × 1045px**, items contiguous (zero gap).
- 12 `.slider__media` items, each **1045×604px, aspect 1.7301:1**, no
  border-radius, ancestors `overflow:visible` (no CSS clip on the proxy —
  any cropping is inside the canvas draw).
- Sibling rail item counts (DOM child-count only, contents not opened):
  Veillance 12, Mechachain 11, Dulcedo 9, Dioriviera 10, Trebuchet 11 —
  count = however many screens that project's own site has.
- At rest, the visible canvas render shows the current item's screenshot
  filling most of the 1440-wide stage with roughly 200px of the
  neighbouring item peeking at each edge (see Frames) — three items
  concurrently partly visible, not a single hard-clipped frame.
- Title/meta DOM ("1", "Creandum", "Finance", "2023", "Team of 2",
  "@ImmersiveGarden", "Project link" (→ external `creandum.com`),
  "Roles / Art Director / UI & Interactive Designer") sits in ordinary
  static DOM below/around the canvas stage — it does not move with the
  drag.
- Cursor over the rail: `cursor:grab` (native).
- Section height (918px) ≠ viewport height (736px) and is not an exact
  multiple of it — **not a pinned/sticky ScrollTrigger section**; it is a
  plain in-flow block the page scrolls past normally.

## 3. DRAG PHYSICS

- **Rate / 1:1-vs-lerp / inertia decay / bounds (overshoot, clamp, wrap):
  NOT MEASURABLE.** Proven by direct test: `getComputedStyle` on
  `.projectBlock__slider` and three `.slider__media` items read
  `transform:none` immediately before AND after a real, CDP-trusted
  drag of 1000px (pointerdown at x=1200,y=300 → pointermove to x=200,y=300
  → pointerup, all `isTrusted:true`), while the on-screen content changed
  completely (see Frames). There is no DOM number to sample — reporting a
  rate or a decay constant here would be fabricated, not measured.
- What IS confirmed: the site's own pointerdown handler calls
  `preventDefault()`. Proof: dispatching the same trusted pointer sequence
  over a plain overlay (outside the slider's real ancestor chain) produced
  full `mousedown/mousemove/mouseup` compatibility-mouse events alongside
  the pointer events; dispatching it with pointerdown landing on a node
  that IS a real descendant of `.projectBlock__slider` suppressed those
  compatibility mouse events entirely — the standard signature of a
  handler calling `preventDefault()` on `pointerdown`, consistent with an
  imperative pointer-capture drag (bespoke Vue code or the WebGL scene's
  own hit-testing; cannot confirm which, and GSAP Draggable/Observer were
  not found as globals — see §1).
- Direction mapping (qualitative only): dragging the pointer right→left
  (Δx = −1000px, one jump) advanced the filmstrip FORWARD (a later screen
  of the Creandum site appeared) — content follows the finger, standard
  carousel semantics.
- Tooling ceiling, stated plainly: the only drag primitive available this
  session (`mcp__chrome-devtools-2__drag`) dispatches exactly ONE trusted
  pointerdown → ONE trusted pointermove (straight to the target, no
  intermediate samples) → ONE pointerup. There is no way in this
  environment to inject a continuously-sampled real trajectory (needed to
  see "does the rail track the pointer 1:1 while held, or lag"), and even
  if there were, the content has no DOM value to sample mid-drag. Testing
  end-of-list bounds would require ~12,540px of cumulative chained drags
  per project rail with no numeric way to detect "at the end" other than
  screenshots — not attempted.

## 4. PARALLAX INSIDE ITEMS — the effect Jake named

- **Horizontal rate inside each item: NOT MEASURABLE**, same reason as §3
  (no DOM transform on `.media__image` ever, in any state — checked `top`,
  `left`, `marginTop`, `transform`, all static/`none`/`auto`).
- **Vertical parallax: NOT CONFIRMED either way — genuinely unresolved,
  not a "no."** DOM geometry leaves room for it: the content wrapper
  (795.38px tall) is **191px taller** than each item (604px), which would
  be enough vertical slack for items to rise/fall as they cross center.
  But the two states actually captured (rest, and after a 1000px drag)
  show the visible imagery occupying the same vertical band in both
  screenshots, and the proxy elements' vertical properties never changed.
  Since any real vertical offset would live inside the canvas (unreadable
  from here), this could not be confirmed or ruled out with the tooling
  available — flagged, not guessed at a value.
- Rotation-as-f(velocity): a real, measured effect exists, but on the
  **cursor pill**, not the rail content. `.cursorIndication`'s translate
  (x,y) matched the pointer position exactly (to the pixel) at every
  sample — **zero positional lag**. Its transform matrix also carries a
  residual rotation term (`matrix(1, b, -b, 1, tx, ty)` with tiny nonzero
  `b`) that decays toward 0 after motion stops. Sampled every 30ms
  (already well into the tail — see caveat below): consecutive-sample
  ratios were 0.8155, 0.8203, 0.8203, 0.8607, 0.8155, 0.8254, 0.8555,
  0.8203, 0.8155 → **consistent ≈0.82 retention per 30ms tick**. This
  proves a velocity-driven rotation chase exists and roughly its decay
  rate; it does NOT establish the rotation's peak amplitude or onset,
  because by the first sample the value was already ~1e-24 (numerically
  converged) — the meaningful decay happened before this session's first
  read could catch it.
- Scale-as-f(distance-to-center): NOT MEASURED — no DOM scale value
  exists, and isolating one canvas-rendered item's apparent size across
  positions would need pixel-ruler screenshot comparison, not attempted.

## 5. SCROLL COUPLING

- Vertical page scroll does NOT move the rail. Sampled
  `.projectBlock__slider` transform at scrollY = 2937, 3100, 3300, 3500,
  3700, 3850 (the section's full extent) — `transform:none` at every
  position.
- A synthetic (non-trusted) `WheelEvent` dispatched over the section
  produced no change (expected — matches the site requiring trusted
  pointer input per §3; not strong evidence either way on whether a real
  trusted wheel would advance it, which was not tested).
- The rail's own progress is independent of `window.scrollY`: during the
  1000px drag test, `scrollY` moved only 2973→3050 (a 77px settle,
  consistent with ordinary Lenis smoothing, not the drag itself).

## 6. HOVER

- Cursor over the rail is native `grab` — no custom crosshair replacing
  it.
- The separate `.cursorIndication` pill (text "Drag") is confirmed to
  exist and to render at `opacity:1` following the pointer during the
  session's earlier live-interaction states. A follow-up test — fresh
  page reload, then a single programmatic `hover()` call with no prior
  pointer movement — did NOT show the pill in the resulting screenshot.
  This is reported as an **inconclusive capture**, not "no hover reveal":
  the pill may require a real mousemove/mouseenter sequence (crossing the
  element boundary) rather than a teleported hover to trigger its reveal.
- No veil, no image-scale, no title-color change observable on hover —
  the DOM proxies carry no visual styling to change in the first place.

## 7. CLICK → PROJECT

- **NOT TESTED.** The only explicit link per item is an external
  "Project link" anchor (e.g. `https://creandum.com/`) sitting in ordinary
  DOM below the canvas stage — clicking it leaves leoparpeix.com entirely
  (no internal project-detail page exists to decode a transition into).
  Whether clicking the canvas-rendered image itself (distinct from that
  anchor) triggers any in-page effect was not tested — would need a
  trusted click precisely inside the WebGL stage while missing the real
  anchor, not attempted given time already spent on §3/§4.

## 8. ENTRANCE ON SCROLL

- No entrance animation at the DOM level: sampled `.webglBg.projectBlock`
  and `.projectBlock__slider` opacity/transform at scrollY 2200 (~700px
  above the section), 2500, 2700, 2850, 2937 (section's own top), 3000,
  3100 — `opacity:1`, `transform:none` at every sample, including before
  the section entered the viewport.
- Whether the CANVAS content itself fades/reveals on scroll could not be
  determined (no readable canvas uniform/state) — flagged, not guessed.

## 9. COMPOSITING HINTS

- `.cursorIndication`: `will-change:transform`, no CSS transition,
  transform written directly per frame (cheap if transform-only; the
  residual rotation term in §4 implies the full matrix is rewritten each
  frame while it decays, not just translate).
- Both `<canvas>` elements: `position:fixed`, full-viewport, one 1×, one
  2× backing buffer (see §1) — standard devicePixelRatio WebGL pattern.
- Every DOM proxy (`.slider__media`, `.media__image`,
  `.projectBlock__slider`) carries no `will-change`, no transition, no
  transform at any point tested — they cost nothing at the compositor
  layer; all paint/raster cost for this section lives inside canvas draw
  calls, invisible to CSS-layer inspection.

## 10. MOBILE (390×844)

- The rail still exists and is still `display:flex` with `cursor:grab` —
  the same JS drag mechanism, **not** native `overflow-x:scroll` /
  `scroll-snap` (`scrollSnapType:none` confirmed, `overflow:visible`).
- `touch-action:pan-y` on the slider — explicitly reserves the horizontal
  touch gesture for the custom drag handler while leaving vertical page
  scroll alone; the strongest evidence the same pointer-drag code path
  runs on touch.
- Item geometry changes, not a pure rescale: **300×190px (aspect 1.579)**
  vs desktop's 1045×604 (aspect 1.730) — a different crop, not a
  proportional shrink.
- DOM reported **65** `.slider__media` children at this viewport for what
  should be the Creandum rail (vs 12 on desktop) — this count does not
  cleanly reconcile with the observed rail width and was NOT resolved
  (possibly items from more than one project's rail sharing DOM without
  desktop's per-block visibility separation, or loop-padding duplicates).
  Reported as measured-but-unexplained rather than guessed.
- Two canvases still present; whether the WebGL rendering is actually
  running (vs. a static fallback) under this session's mobile emulation
  was not independently confirmed.

## 11. REST OF HOMEPAGE — one line each

- **Preloader/sound gate** — `.loaderBlock` full-screen overlay, gated
  behind `body.awaiting-sound-click`, requires clicking "CLICK TO ENABLE
  SOUND" · duration NOT MEASURED (already `opacity:0`/resolved by the
  first read after reload — too fast to catch with this tooling, not
  assumed to be ~4s).
- **Hero 3D room** — flower sculpture / ladder / workbench WebGL scene on
  the same fixed canvas pair · "Driven by detail. Obsessed with seamless
  motion." + "Scroll down" as static overlay DOM text, no entrance
  transform observed on that text at scrollY=0.
- **Word-cloud line** — `.agency-char` × 27 (per-character split of
  "Currently pushing design boundaries at @Locomotive…") · resting
  opacity 0.4 · trigger/easing not decoded (likely scroll- or reveal-
  linked per-char stagger, unconfirmed).
- **Mission-statement text** — `.webglSection-char` × 84, same
  per-character-split family, resting opacity 0.15 · not decoded further.
- **Bee word-scatter** — `.beeBlock` + "FRENCH / INTERACTIVE / DESIGNER /
  CREATIVE / PASSIONNATE / ART DIRECTOR" headings + `.beeTextIndication`
  cursor hint ("Click to feed the bee") · click-driven, not scroll-driven
  · not decoded further.
- **Title reveal block** — `.container__titles--reveal` sits at rest with
  `transform:matrix(1,0,0,1,-720,-218.695)` (parked off-position pending
  its own reveal-in) · trigger/curve not decoded.
- **Archives list** — `.archivesBlock__list`, plain block-flow list of 23
  rows (items 7–29) · ordinary DOM, no drag/canvas rail, not individually
  motion-tested.
- **Footer** — `.footerBlock.white` with a `.footerBlock__popup` +
  `.popup__transitionWrapper--outer/inner` behind the "Credits" button
  (open/close transition not tested) · a second `beeBlock` instance
  (`.beeBlock__webglBee`) recurs in the footer canvas.
- **Scroll smoothing** — `html.lenis.lenis-smooth` wraps the entire page;
  all vertical scroll inertia belongs to Lenis, independent of the drag
  rail's own internal progress (§5).

## 12. FRAMES

- `design-dna/frames/decodes/leoparpeix/rail-rest.jpeg` — Creandum rail
  at rest (item 0, its own laptop screenshot centered, ~200px of
  neighbouring items peeking each edge).
- `design-dna/frames/decodes/leoparpeix/rail-mid-drag.jpeg` — immediately
  after a real trusted 1000px right-to-left drag: the canvas now shows a
  later Creandum-site screen ("OUR BELIEF…" mission copy), proving the
  rail scrubs through that project's own site screens; DOM proxies were
  confirmed unchanged (`transform:none`) at this same instant.
- `design-dna/frames/decodes/leoparpeix/rail-hover.jpeg` — rest state
  after a fresh reload + programmatic hover; the "Drag" cursor pill is
  NOT visible in this capture (see §6 caveat — likely needs a real
  mousemove sequence, not a teleported hover, to reveal).

---

## 12. PIXEL PASS (main loop, 2026-09-18) — what the canvas does, measured off frames

The DOM proxies never transform (§1), so the rail was measured from a CDP
screencast (247 frames, 4.1s) around a real trusted flick: mouse down at
the rail's centre, 480px left over 499ms (Playwright's 16ms steps ran at
~33ms), release, 3s of coast. Rail motion = per-frame phase correlation
of the rail band (rows 80–660); tiles = colour/edge tracking. Frames:
`frames/decodes/leoparpeix/flick-sheet.jpg` (−300 / 150 / 300 / 500 /
800 / 1300 / 2000 / 3500ms).

- **Drag is a VELOCITY model, not 1:1.** With the pointer at a constant
  ~0.96px/ms the rail lagged for the first ~150ms (pointer −48 → rail −7
  at 50ms; −96 → −48 at 100ms), crossed the pointer at ~180ms, and kept
  accelerating: 0.8 px/ms at 100ms, 2.1 at 200, 2.8 at 300, 3.5 at 400,
  3.9 at release. Rail displacement at release −1191px for 480px of
  pointer travel (2.5×). A chase toward k × pointer would have stopped
  near k × 480; it did not (below) — the input adds velocity.
- **Inertia after release:** per-frame dx 66, 66, 66, 66, 62, 65, 59, 61,
  59, 54, 55, 51, 46, 47, 45, 41, 42, 40, 37, 37, 33, 34, 32, 29, 29, 28,
  25, 25, 23, 21 … (16.6ms frames). Fit: **retention ≈ 0.957 per frame**
  (66 → 12 over 39 frames), i.e. v(t) = v0 · 0.957^frames — friction, not
  a lerp. Coast from release: −1191 → −2870 = **1680px**, ~1.4s to
  < 1px/frame.
- **The end is a rubber band.** At 1900ms the rail reversed from −2870
  and settled at −2616 over ~1.0s, exponential (≈ 0.93/frame), no
  oscillation: ~250px of overshoot past a bound, sprung back. (Which
  bound: the DOM's 12 × 1045 says 11,100px of travel exists, so −2870 is
  not the rail's end — the canvas rail is shorter than its DOM proxies,
  or the bound is per-screen. Unresolved.)
- **Page scroll does NOT move the rail.** Screenshots at 14 scroll
  positions (rail top from +700 to −600): the laptop tile's left edge at
  x = 177 in every one; the tile's bottom edge = DOM rail top + 604 at
  every one. No horizontal drift, no vertical parallax against scroll.
- **The vertical is (a) the COLLAGE and (b) a slight rise in motion.**
  (a) Tiles are not a uniform strip: the laptop screen is full-band
  (1045 × 604); next is a STACK of two type-specimen tiles (half height
  each); then a green type tile TALLER than the band (top ≈ 35–54, bottom
  ≈ 632–644 against the band's 66–670 — it overhangs both edges); then a
  short dark hero tile top-aligned; a short white "Team / Portfolio /
  Blog / Contact" tile BOTTOM-aligned; a full-band photo tile; a tall
  dark tile. No gaps. This mixed-height, mixed-alignment strip is most of
  the "vertical parallax" impression. (b) During the flick the rail band
  drifted UP: dy −3.6 at 50ms, −16 at 200, −22 at 300 (x −497), −31 at
  release (x −1191), −38 at 1900 (x −2870); it did not return at rest.
  Read as position-linked (a ~1° incline / gentle arc: ≈ 15–20px of rise
  per 1000px of travel, diminishing) rather than velocity-linked.
- **Tiles change WIDTH in motion.** The green tile, both edges in view,
  measured 519px wide at x 774–1293 (400ms, v ≈ −55px/frame), 454 at
  402–856 (500ms, v ≈ −62), 356 at 29–385 (600ms, v ≈ −65) — a 31%
  squash across the screen while velocity changed 18%. Position- vs
  velocity-dependence NOT separated (one flick, one speed); a second
  flick at half the speed would settle it. Height stayed 578–597.
- **No internal parallax caught:** for the first 300ms the laptop's
  screen content and its tile boundary moved by the same 504px (content
  − boundary constant at 85px) — the image did not slide inside its
  frame at that speed. Beyond 300ms the patch left the screen.
- Frame rate held: 247 frames in 4100ms = 16.6ms mean, no frame > 19ms.

---

## 13. THE CODE (main loop, 2026-09-18) — read from `assets/index-BZFBO0Ol.js` + `index-CLH3rn1-.css`

Jake: "i want you to look at the code of this section". Vue 3 + THREE. The
slider component keeps DOM proxies (`.slider__media .media__image`,
CSS: `width: 72.569vw; height: 41.944vw` — UNIFORM 1.73:1, 1045×604 at
1440, gap `mp()` = 20px desktop / 10px mobile) and renders every tile as a
THREE plane scaled to the proxy's rect. Everything below is the real
mechanism; §12's pixel numbers are its output.

**Config (desktop `t4`; `n4` = < 1025px):**
`{ infiniteDrag: true, parallaxXMultiplier: 1.25 (mobile 2.75), snapThreshold: 42,
snapLerp: .055 (.14), dragFollowLerp: .068 (.14), dragMultiplier: 3 (4),
deltaDecay: .9, dragForceDecay: .42, dragForceSmooth: .065 (.14),
dragForceMultiplier: 400, dragForceMax: 600 }`.

**The drag loop (`onRender`, frame-rate independent — every lerp is
`1 − exp(−k·dt·60)`):**
```
currentDrag      += delta.x × 3          // the pointer's delta, ×3
delta.x          *= 0.9                  // the same delta keeps applying, decaying — the coast
rawDragInput      = lerp(raw, |delta.x|, .42)
dragForce         = clamp(raw × 400, 0, 600)
smoothDragForce   = lerp(smooth, dragForce, .065)   // while dragging: ≥ snapThreshold+1
if !dragging && smoothDragForce < 42:                // the FORCE has died → SNAP
    snapTarget        = round(smoothCurrentDrag / pitch) × pitch   // nearest tile
    smoothCurrentDrag = lerp(smooth, snapTarget, .055)
else
    smoothCurrentDrag = lerp(smooth, currentDrag, .068)            // the FOLLOW
tile i: position.x = wrap(i × pitch − smoothCurrentDrag)           // infinite
```
So: the hand's movement is tripled, follows through a 0.068 chase, coasts
on the decaying delta (0.9/frame), and once the force is spent the rail
SNAPS to the nearest tile at 0.055 — the "reverse" in §12 was the snap,
not a bound; the rail is infinite (wraps).

**The two parallaxes are in the FRAGMENT shader, on the image inside its
plane (the plane itself never moves vertically):**
```
uv = (uv − .5) / uCoverBleed + .5        // uCoverBleed 1.05 desktop, 1.155 mobile — 5% surplus
uv.y += uParallaxProgress × 0.085        // VERTICAL, on PAGE SCROLL
uv.x += uParallaxX × 0.085               // HORIZONTAL, on the tile's SCREEN X
```
- `uParallaxProgress` = Lenis `animatedScroll` mapped `[sliderTop − vh, sliderTop + sliderH] → [−1, +1]`, set on every scroll for every tile of that project: the picture slides 17% of its height inside its frame across the block's passage through the viewport. This is the scroll-linked vertical parallax the DOM could not show (§12's "no vertical parallax against scroll" measured the plane, which is right, and missed the picture, which is wrong).
- `uParallaxX` = `tile.position.x / (vw/2) × 1.25`, updated every frame: a tile at the screen's edge has its picture shifted 10.6% toward the centre; at the centre, 0 — so as the rail moves, every picture slides inside its frame against the rail. (§12's "no internal parallax" tracked a content edge as the boundary — invalid.)

**The squash is DEPTH, in the VERTEX shader, on velocity:**
```
dist = smoothstep(0, 5.5, length(vec2(screenX_ndc, position.y)))
position.z -= dist × uDragForce × uDragScaleStrengthZ   // 1.5 desktop, .5 mobile; force ≤ 600
```
While the force is up, vertices far from the screen's centre recede —
tiles near the edges shrink toward the vanishing point (§12's 519 → 356px
and Jake's frame: the green tile at the right edge 363px tall against the
band's 840, pulled toward the screen's centre). At rest (force 0) every
tile is flat and full size. `uDragScaleStrength` (75e-6) and
`uDragColorStrength` (35e-5) are declared and unused; `scrollDeformationDirection`
(the `index % 2` alternation) is dead code.

**Structure:** "Selected projects" = six `projectBlock`s, each = its own rail
(9–12 screens of THAT project) + an info row (`01 · name · type · date ·
team · roles · project link`). Cursor pill "Drag" over the rail
(`cursorIndication`, imperative per-frame follow). Mobile: same rail,
`touch-action: pan-y`, 300×190 proxies, `n4` config.
