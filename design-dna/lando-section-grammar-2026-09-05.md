<!-- dated snapshot. The LIVE copy is ~/.claude/skills/signature-frontend/references/lando-section-grammar.md — edit that one. -->

# The Lando Section Grammar — measured laws of sequencing rooms

Provenance: synthesized 2026-09-05 from an 18-slice instrumented teardown of
landonorris.com (OFF+BRAND) at 1440×900 desktop and 390×844 mobile —
computed styles at 9 sampled scroll positions per slice (4 on mobile),
lando.css/lando.html source reads, screenshot pixel sampling, live asset
sizing — plus a SECOND live pass the same evening that closed the gaps
the first pass left open: Rive canvas pixel readback (2D contexts, every
4th pixel), a WebGL drawing-buffer readback of the hero canvas, a
whole-DOM paint-property sweep at 16 scroll positions, and static reads of
the 1.46MB bundle for the reveal code. The second pass ran at **1440×736**
(Chrome would not give a 900-tall viewport through window resize); its
numbers are marked (736) and the vh-ratio is what transfers. The MOTION
mechanics (two smoothing layers, the declarative colour engine, the
horizontal-track formula, Lenis config, perf) are already decoded in
`design-dna/decodes-2026-09-05-motion.md` — cited below as `decodes §N`,
never repeated. The catalogue entry (site-references.md → Lando) holds the
athlete-specific don't-lift list; this file extends it with the SEQUENCE:
why every section reads as "entering a new room" — and §7 corrects four
claims in that entry that the measurements contradict. Every number is
tagged MEASURED or INFERRED. Scroll positions are desktop 1440×900 unless
marked (m) or (736). decodes.md was sampled at ~1200×692; ratios agree
with both passes. Use this for any client who wants the page to feel alive
and paced — in THEIR brand, never as a skin-swap of Lando's.

Page facts (MEASURED): docHeight 13,578px at 900 / 12,286 at 736 ·
maxScroll 12,678 · 14.1 viewports · 16 sections + 2 fixed layers · body
ground flips ONCE (rgb(40,44,32) → rgb(244,244,237)) · 4 `position:sticky`
elements site-wide (decodes §10) · 21 fixed · 15 `will-change` · 21
canvases · 0 `prefers-reduced-motion` rules · 0 `<noscript>`.

**The restraint number (MEASURED, 736).** Across 16 scroll positions
spanning the whole page, 8 paint properties (transform, opacity,
clip-path, background-color, visibility, color, mask-image, filter) read
on 1,775 elements: **123 elements (6.9%) ever change anything.** By
property: transform 96 · clip-path 20 · opacity 4 · color 4 · visibility 2
· mask/filter/background 0 (the body ground is the one background write,
decodes §2). 93.1% of the DOM is paint-static for the entire scroll. That
is the number behind "accents the content, doesn't take focus away": the
page moves 1 element in 14, and 78% of what moves is a transform.

**Catalogue corrections (MEASURED, see §7 for detail).** Ground is
`--color--dark-green: #282c20`, not #3a3a2e. There are TWO limes
(`--color--lime` #d2ff00 and `--color--lime-off` #b2c73a), not one. The
CSS contains exactly ONE `cubic-bezier` — `(.19,1,.22,1)` on one
`transition-duration:.6s` rule — and the "structure curve"
`cubic-bezier(.65,.05,0,1)` appears nowhere in lando.css or the bundle;
the bundle's GSAP eases are `none` ×117, `power2.out` ×36, `power2.inOut`
×17, `power1.inOut` ×13, `expo.inOut` ×12, `power3.out` ×10, and nine
more. "Two curves" is not what ships; "scrubbed structure + power2
reveals" is. And section entrances are not "one triggered animation":
there are 41 `data-anim-high` one-shot clip wipes plus 4 other triggered
reveals — law 11 below is rewritten accordingly.

## 0 · THE GRAMMAR — 12 laws of section sequencing

Each law is one line plus the section and number that proves it.

1. **NEVER repeat a seam mechanism twice in a row.** 10 seams, 9 distinct
   devices (curtain → hard-cut-same-ground → late colour lerp → arrive-on-
   settled-ground → sticky-cover climb → static-plate cut → ellipse flap →
   content bleed → whitespace → glow+cap) — MEASURED count (§1 table).
   That the seam variety, rather than content variety, is what reads as
   "new room" is INFERRED: no eye-tracking backs it; the count is the
   fact, the reading is the analyst's.
2. **Flip the body ground ONCE.** Dark-green holds 0→2828; one eased lerp
   lands at cream by 5186; cream holds to 12,678 (7,492px = 59% of the
   page). Every later "dark room" is a div's OWN fill painted over cream —
   black group rgb(17,17,18) (§2.9), footer panel #282c20 (§2.15). (decodes
   §2 for the engine.) MEASURED.
3. **A room arrives by its EDGE; its contents are already resolved.** Black
   group: h2 at final rect (y=33.08) the instant the edge crosses y=0
   (§2.9). Partners: h2 opacity 1 at the trigger sample (§2.13). Callout:
   text clip-path fully open at T−900 (§2.11). Heading wipes fire at
   `top 90%` — the last 10% of the viewport — so text is never mid-wipe
   in the reading zone (§2.10, bundle read). MEASURED.
4. **Pre-roll every scrubbed transform one viewport early: pivot =
   sectionTop − vh.** Horizontal track is at x=−899.96 the frame the pin
   engages (§2.5). OTOT pairs start at 5071.75 = T−900 (§2.7). Store visor
   is 0.27% grown at T−900 (§2.12). No visible frame ever shows a zero
   state. MEASURED.
5. **Pin dwell = exactly one viewport: wrapper = 2×H.** Hero 1800/900, OTOT
   1800/900 (§2.2, §2.6). The horizontal pin's domain = contentWidth − vw =
   3143 (§2.5). Sticky is rationed to 4 elements (decodes §10). MEASURED.
6. **Front-load the spectacle; quiet the back half.** All 3 pins and the
   axis switch live in 0→7772 (57%). From 7772→12,678 (43%): zero pins,
   largest scrubbed transform 53.33px (store), marquee offset ±144, then
   nothing (§2.9–2.15). MEASURED. The reading — that attention is spent
   early so the sell lands on a calm reader — is INFERRED intent.
7. **Alternate loud and still.** Pinned hero → statement with ZERO scroll
   motion after its entrance (canvas y −177→−434.5 for a 257.19 scroll
   delta, §2.4) → three-rate track → converging pair → helmets grid whose
   dwell is pure 1:1 plus one converging offset (§2.10). Every animated
   section hands to a stiller one. MEASURED.
8. **Hard in, soft out.** The black room enters on a pixel-sharp DOM
   boundary at 7771.75 and exits through a 106.66px ellipse flap that is
   fully grown 200px before the next section's top (§2.9, §2.11–12).
   Different ends of one room get different treatments. MEASURED.
9. **Reveal the next room UNDER the current one, already moving.** The
   covering photo is at scale 1.025 when its edge is only halfway up
   (§2.8). The visor is 100% at 9744 vs section T 9944 (§2.12). The pin
   release is never the visible event. MEASURED.
10. **Switch the scroll AXIS at most once, and give it the largest budget.**
    One horizontal section, 3143px = 23.1% of the page — the single biggest
    slice (§2.5). It is the only "different mode" and it carries the
    humanizing content, not the sell. MEASURED.
11. **Scrub the STRUCTURE; trigger only the text.** Every transform that
    moves a room (pins, track, converging pairs, checkerboard, visor,
    parallax, hero shrink) is f(scroll) (decodes §1). What IS triggered is
    a fixed vocabulary of one-shot reveals: 41 `data-anim-high` line wipes
    (clip `inset(0 100% 0 0)→0`, 0.6s power2.out, lime bar scaleX 1→0 0.6s
    power2.inOut starting +0.3s, 0.15s line stagger, ScrollTrigger `top
    90%` `once:true` — bundle read), 2 Rive `data-rive-scrolltrigger`
    phrase draws (§2.7, §2.13), 1 ellipse text reveal (1.5s power2.inOut,
    `top 95%`, §2.14), 1 fan drop (§2.14). Sweep: 20 elements change
    clip-path across the whole page, 96 change transform. MEASURED. The
    statement (§2.4) is the largest of the wipes, not the only one.
12. **Bookend: the last room reuses the first room's grammar.** Footer =
    dark rounded object (1406.67×746.66) centred on light with a radial glow
    and a notched mask, arriving as a rigid 1:1 block (§2.15) — the hero's
    composition without the hero's motion. MEASURED.

## 1 · THE PAGE AS A SEQUENCE

| # | section | concept | ground colour | seam-in mechanism | entry (first change) | seam-out | budget px |
|---|---|---|---|---|---|---|---|
| 0 | Intro curtain | brand-colour occlusion, then Rive | lime #d2ff00 fixed plane | hard state swap; 100% occlusion | flat fill at 0ms, pre-JS | button 300ms fade, hard `visibility:hidden` at T+1500 | time-gated: 1500ms load / 2050–2130ms route |
| 1 | Nav | transparent chrome, ink tracks ground | none (rgba 0) | — | clusters scale 1.2→1.0 over 90px, mirrored origins | never leaves | 83.33 × whole page |
| 2 | Hero sticky track | subject shrinks into centred anchor | body dark-green; GL paints near-white plane over it | page load | corner chip clip 120%→0% over ~60px, then plane area 100%→14.7% on power1.inOut, portrait desaturates .265→.104 by p=.75 | unpins at 900, tracks 1:1, no exit fx | 1800 (pin 900) |
| 3 | Marquee layer | note + signature revealed under the shrink | same | inside 2, no seam | chars 8.34→0 over 630→900; Rive draw 0→100% across 450→1080, 88% done by 828 | slides out with pin release | 0 (shares 2) |
| 4 | Statement | thesis, 3 words re-typed | dark-green flat | hard cut on identical ground | eyebrow wipe → 7 lines, 1.53s, once | hard cut, colour unchanged to 2828.75 | 1029 |
| 5 | Horizontal track | axis switch + the page's one colour flip | dark→cream lerp: starts +450 inside, settles 5186 | flat ground; translate already −900 | caption #6 clip 100%→0% assembling in view | translate saturates 5072; last 900 scrolls off 1:1 | 3143 (pin 2243) |
| 6–7 | OTOT split | facing pair converge, choice as picture | cream, settled 785px early | none — arrives on settled ground | text ±66.67→0 linear/1080; photos ±266.67→0 cubic/1800 | pin releases 6871.75 under cover | 1800 (pin 900) |
| 8 | End photo | sticky-cover rise | cream (photo paints its own) | z:10 sibling climbs 900→0 over 900 | rise + scale 1→1.1 / y 0→−180 over 1800 | flush hard edge to black at 7771.75 | inside 6 |
| 9–10 | Black room + helmets | static plate, trophy wall | #111112 own fill; body stays cream | edge crosses y=0 at 1:1 | title wipe fires at `top 90%` (T−810), done ~1.1s later; two-layer checkerboard 266.67→0 | continues into 11 | 2173 (grid 1696) |
| 11 | Callout | one CTA in a void | same black wrapper | none (same wrapper) | Rive icon draws 0→100% over 8568→9494; dead until p≈.3, 91% at p=.6 | NEXT section's ellipse visor 9044→9744 | 476 |
| 12 | Store | collage sell | cream; 106.66px black visor flap | visor 0.27%→100% before T | visor first, then 4 images −53.33 | assets bleed over next heading | 907 |
| 13 | Partners | title L / copy M / neon R + logo marquee | cream | GL contour tint declared `dark-green-tint-1-low → white` from `top bottom` | neon: 0.1s CSS opacity at canvas top-centre (T−397), then Rive phrase scrubbed over 1115px, 95% inside the first 30% | 267px spacer + neon tail | 795 |
| 14 | Socials fan | hand of 7 cards | cream | whitespace only | h2 ellipse 1.5s; cards drop 133.33→0 ~750ms | lime radial glow leaks up | ~965 |
| 15 | Footer | bookend hero panel | cream; panel #282c20; lime strip | 8rem ellipse cap + glow | ~200px blank, then rigid 1:1 rise | document ends | 967 |
| 16–17 | GL wrap / anchor | persistent backdrop | — | none | boots 434ms after first paint | none | fixed |

**Rhythm (MEASURED).** Pins at 0–900, 2829–5072, 5972–6872 — three, all in
the first 57%; after 7772 the page is pure document flow. The ONE ground
flip runs inside the ONE axis switch (5, 23% of budget), so mood and mode
change together in the page's biggest room. Inversions after that are
foreground plates: black room 7772→9944 (16%), footer panel from 12,815.
Budget by section: track 3143 · black room 2173 · hero 1800 · OTOT 1800 ·
statement 1029 · footer 967 · socials 965 · store 907 · partners 795.
Loud/still alternation: pin → still → pin → pin → still-plate → still →
mild → still → still → still. Same-ground runs: cream 13→14→15 spans
~2900px with whitespace and an icon-then-headline motif doing all the
seaming.

## 2 · SECTION BY SECTION

Fields: concept · layout · seam in · entry · dwell · seam out · job · user
reading. Numbers desktop 1440×900 unless (m) or (736). "Job" lines are the
analyst's reading of intent (INFERRED) unless a number sits beside them.

### 2.0 Intro curtain (`.transition-w`)
- Concept: fixed lime plane holds ~1s, hands off to a Rive canvas, occludes
  first load (~1.5s) and every route change (2050–2130ms, decodes §5).
- Layout: `position:fixed; inset:0; z-index:9999`; canvas 1440×900 at all 9
  samples; 390×844 (m) at all 4. One child pill bottom-centred 17px up.
  Mobile swaps only `height:100svh`.
- Seam in: hard swap. Inline `display:flex` forces lime pre-JS; JS sets bg
  transparent when `.riv` loads. Body ground rgb(40,44,32) never changes.
- Entry: flat fill at 0ms → Rive → GL `uReveal` 1.1s (`REVEAL_DURATION:
  1.1` in `landoGL.params.headScene`, MEASURED) → T+1000 transition-in →
  T+1100 button 300ms fade → T+1500 `visibility:hidden`.
- Dwell: time-boxed; `pointer-events:auto` blocks the page.
- Seam out: hard cut; `.transition-w`/`.transition-rive` carry NO CSS
  `transition`. Button gone 100ms before the stage.
- Job: make the brand colour register as a beat; give the Taxi.js swap a
  page-turn. Prefetch (500ms lead) means the 2.1s is pure theatre.
- User reading: not described. Correction for readers: the class name
  suggests CSS transitions; there are none — all motion is Rive-internal.
  No-JS consequence (MEASURED static): the inline `display:flex` lime fill
  is unconditional and the hide is JS-only → with scripts off the visitor
  sees a lime plane forever. There is no `<noscript>` anywhere.

### 2.1 Nav (fixed)
- Concept: background-less strip that re-inks itself to track the ground.
- Layout: 1440×83.33; wordmark 131.43×60 at (16.66,16.66); LN mark
  36.66² at (701.66,23.33) — centre x=720 exactly, outside the flex row;
  right cluster (pill 118.27×60 + hamburger 60×60) at 1235.08, right edge
  fixed 1423.34. Edge inset 16.66 = --gap 1.25rem × 13.33 root. The
  container is a `<div data-nav-theme>`; no `<nav>`/`role=navigation`
  exists (MEASURED).
- Seam in: none; `data-nav-theme` dark↔light flips 2–3 child props;
  markers `.is-1` 0–90px dark, `.is-2` 90–810 light. The only CSS timing
  function in the whole stylesheet is `cubic-bezier(.19,1,.22,1)` at
  `.6s` (MEASURED: 13 transition declarations total in 188KB).
- Entry: scale 1.2→1.0901→1.0313→1.0057→1.0001→1.0 at y 0/20.83/41.66/
  62.49/83.33/533; left cluster origin 0 0 (x pinned 16.66), right cluster
  origin 100% 0 (right edge pinned). Mobile: no scale at any sample.
- Dwell: static; ink cross-fades; LN mark is an idle Rive canvas.
- Seam out: none — the one constant across 12,678px.
- Job: buy (lime pill — the only saturated chrome colour), browse, home.
- User reading: brief's midpoint 1.025@45 → measured 1.0313@41.66;
  `data-nav-theme` read "light" at every helmets sample (736) — the full
  flip timeline still unreconciled → §7.

### 2.2 Hero sticky track
- Concept: full-bleed portrait shrinks into a small centred card, uncovering
  the real dark ground.
- Layout: no grid; `.gl-canvas` 1440×900 `transform:none` at all 9 samples;
  GL buffer 1800×920 at 736 (1.25× DPR cap, decodes §11). Target
  471.66×305 at (484.16,297.5) → centre (720,450) = viewport centre; CSS
  35.375×22.875rem at 13.33 root. Only furniture: 99.16×203.33 race chip at
  (16.66,680). (m) target 270.83×314.16 centred (195,422); chip
  `display:none`; wordmark 173.33×18.59 centred.
- Seam in: page load; body rgb(40,44,32) from sample 0, GL paints
  #F8F8F3 plane over it (`COLOR_BACKGROUND` in params, MEASURED) —
  occlusion, not a lerp.
- Entry: chip clip `ellipse(100% 120%)→0%` over ~60px (7% of pin); THEN
  the plane shrinks. **The GL curve, MEASURED (736) by reading the WebGL
  drawing buffer at 10 positions and counting non-ground pixels:** plane
  area share 100% → 95.3% → 84% → 65.9% → 46.2% → 30.5% → 21% → 16.5% →
  14.7% at p = 0/.125/.25/.375/.5/.625/.75/.875/1, where 14.7% is the
  471.66×305 anchor. A linear size `s = 1 − 0.617·power1.inOut(p)`
  predicts area .852/.476/.212/.162 at p=.25/.5/.75/.875 vs measured
  .84/.462/.21/.165 — within 0.015 everywhere. `power1.inOut` over exactly
  one pin height, confirmed. Nothing changes after p=1 (p=1.25 identical).
- Dwell: 0→900 pin; marquee layer writes in underneath (2.3). **The
  desaturation, MEASURED inside the anchor box:** mean saturation .265 →
  .226 → .155 → .104 → .163 and luminance 169.7 → 170.3 → 152.3 → 113.1 →
  86.4 at p = 0/.25/.5/.75/1. Colour drains through the middle half of the
  pin; the final duotone is dark (lum 86) with a little lime back in it
  (sat .163).
- Seam out: unpins at 900, rect.y −450/−900/−1350 at 1350/1800/2250 — 1:1,
  no fade. Ground constant across 0→3278 (crosses the boundary).
- Job: undiluted identity in frame one; proves the page is scrolled THROUGH.
- User reading: figure/ground inverted — the FOREGROUND shrinks and uncovers
  a background that never moves; "484,298" is the box's top-left, its
  centre is (720,450); mobile has no corner cue. "Background shrinks to an
  image" = the plane area going 100→14.7% on power1.inOut while its
  contents desaturate .265→.104 — both numbers now in hand.

### 2.3 Hero marquee layer (`.s.home-marquee`)
- Concept: eyebrow + mark fade in over exactly the window the portrait
  quietens; a wider Rive signature draw wraps it; WebGL text marquee runs
  always.
- Layout: one centreline x=720. Top tier 1440×55.45 (mark 66×28.33 over
  10px eyebrow of 16 `.char`); middle = anchor 471.66×305 with an 800×571.42
  Rive canvas (aspect 70/50; buffer 1600×1142) clipped `contain`; bottom
  `.gl-carousel` 1440×0 at y=450 (`inset:50% 0 auto`) — a coordinate line.
- Seam in: zero colour delta 0→2828.75 across 3 files.
- Entry: nothing for 630 of 900 (70%). Eyebrow tracker doc-top 1530, h 270
  → window 630→900 exactly; at 675 char1=2.82 while chars 11–16 still 8.34
  (ramp ~10 glyphs wide). Rive tracker doc-top 1vh, h 1vh, `top center →
  bottom 80%` → 0.5vh→1.2vh (450→1080; 368→883 at 736): starts 180 before,
  ends 180 after the text. **The draw curve, MEASURED (736) by counting
  drawn pixels in the Rive canvas:** p 0 → 0% · .2 → 0% · .4 → 45% · .6 →
  88% · .8 → 97% · 1.0 → 100%. The page feeds Rive a `scroll` input =
  progress×1000 through ScrollTrigger `scrub:0.5` (bundle read); the
  dead first fifth and the fast middle are authored inside the .riv. The
  `<img>` signature is a separate CSS fade: opacity 0 at p≤.4, .98 at .6,
  1 at .8.
- Dwell: settled duotone box; two marquee rows fully legible; zero hover.
- Seam out: root y 0→−450 at 1350 — positional, signature still drawing
  900→1080 while leaving (the last 3% of stroke).
- Job: a personal beat (name-address + autograph) before any ask.
- User reading: the marquee is not "revealed" — present at every sample,
  idles 34–40px/s (decodes §6); its strings live only in
  `landoGL.params.carouselScene.TEXT_TOP/BOTTOM`, not in the DOM
  (MEASURED). "Signature draws on scroll" is right: 0→100% between 0.5vh
  and 1.2vh of scroll, with nothing visible until ~0.65vh and 88% done by
  ~0.92vh.

### 2.4 Statement
- Concept: one centred manifesto sentence; 3 words swap family + size +
  colour; illuminated once.
- Layout: single flex column 1068 wide (80.1rem), gutters 186. H 1028.75 =
  80 + 42.5 + 16.66 + 8.34 + 50 + 671.25 + 160. Type 105.83px Mona wght
  660 wdth 93, lh 90.6%, −0.83 tracking; accents Brier 110px lime-off
  #b2c73a lh 83%. Line widths 948/986/907/1063/1067/799/353 — a flag, not a
  block. The page's only pure-typography section. (m) 362.92×238.88.
  Contrast (COMPUTED): #b2c73a on #282c20 = 7.56:1; cream #f4f4ed on
  #282c20 = 12.92:1 — both AAA.
- Seam in: hard cut; root y 900@900 → 0@1800, 1:1.
- Entry: `data-anim-high="right, lime-off"` — the same wipe every heading
  gets (law 11): eyebrow first, then 7 lines 0.6s power2.out, 0.15s
  stagger; lime bar per line starts +0.3s, scaleX 1→0 over 0.6s
  power2.inOut; done ~1.53s; trigger `top 90%`, once. The LONGEST wipe on
  the page (7 lines), not the only one.
- Dwell: nothing; canvas y −177→−434.5 for Δscroll 257.19. Zero parallax.
- Seam out: hard cut; ground still rgb(40,44,32) at 2828.75.
- Job: the claim, with every distraction switched off.
- User reading: "just a big statement, some words different colour" misses
  the typeface swap (Brier vs Mona, +4% size), the choreographed one-time
  entrance, and the seal + credential eyebrow that make it an authority
  claim.

### 2.5 Horizontal track
- Concept: 3143 vertical px → 3143 horizontal px across a pinned corkboard
  of 12 cards, while the ground lerps dark→cream on its own clock.
- Layout: flex row, `padding-left:75vw; padding-top:7vh`; 10 photos
  243×326→589×574 + 2 quote cards (232×98, 400×98) in 8 columns; every item
  hand-offset (`margin-bottom:calc(vh×N)`, `left:calc(vh×N)`) — no two
  share an edge. Captions 11.5px tall.
- Seam in: ground flat to 2828.75 (=T); first shift 114,116,106 @3278.75 →
  158,160,150 @3614.5 → 226,226,219 @4400 → 244,244,237 @5186 =
  `--color--white`. 2t−t², R/G/B lockstep (decodes §2). Declared on the
  section as `data-h-color-from="dark-green" data-h-color-to="white"` and
  `data-gl-change-from="dark-green, dark-green-tint-1"
  data-gl-change-to="white, dark-green-tint-1-low"` (MEASURED, html).
- Entry: translate already −899.96 at pin engage (running since 1928.75 =
  T−900). Caption #6: clip 100%/bar scaleX 1 @2828.75 → open/0.3485 @3614.5
  while #1–5 were settled at the first sample.
- Dwell: x=−(y−1929) clamped to 3143 (<0.3px error at every sample); per-
  image drift ≤53.33 = its own 4rem surplus, scoped to the item's own
  crossing (#1 saturates 3614; #10 reaches only 14.04). Nav flips ~3031.
- Seam out: translate saturates 5072 = T+H−900; pin releases ≈5071.75;
  colour settled since 5186; the last 900 is the finished cream frame
  scrolling off 1:1. Next section opens already cream.
- Job: proof of a person; the axis switch says "browse, don't read".
- User reading: per-image parallax is a ≤53px texture under a 3143px
  move; colour is NOT synced to the horizontal motion (starts +450, ends
  ~785–900 early); on mobile `transform:none` at every sample and the pin
  never holds — plain 2-col masonry with the colour wash only.

### 2.6 OTOT sticky wrapper (`.sticky-track.is-home-otot`)
- Concept: a choice screen disguised as a photograph; converge, hold one
  viewport, get buried by the next photo.
- Layout: wrapper 1800 = sticky item 900 + end section. Inner flex, two
  text cols 283.44 wide, gap 3×--gap; headlines 93.3–97.5px, lh ~79,
  tracking −2.9…−3.3. Photos in `.otot-home-bg` z:0 anchored to the two
  BOTTOM corners (`inset:auto auto 0 0` / `auto 0 0 auto`), 90.67vh tall,
  aspect 834/1984 and 898/1984. (m) grid 1fr 1fr.
- Seam in: ground settled 785.75px before T. Zero-motion arrival.
- Entry: both pairs start at 5071.75. Text linear, slope 0.062–0.067px/px,
  window 1080 = 1.2vh. Photos `x=A(1−p)³`, window 1800 = 2vh (fit <0.5px at
  5 points). Pin engages at text p≈0.83, image p=0.50.
- Dwell: rect.y=0 from 5971.75 to 6871.75 (900). End photo runs its own
  linear scale 1→1.1 / y 0→−180 across T→T+H; the end section (non-sticky
  sibling, z:10) slides 899.75→−0.25 across the same 900.
- Seam out: native release at 6871.75 under an already-moving cover. Nav
  flips light @7200. Next = a plain dark div in flow (decodes §6).
- Job: a navigation fork wearing a hero's clothes (`/on-track`,
  `/off-track`).
- User reading: "goes back to moving vertically" — on arrival the on-screen
  motion is HORIZONTAL off vertical input; there is a hard 900px hold; what
  resumes vertical is the cover photo, not the split; mobile never left
  vertical.

### 2.7 OTOT split (the facing pair)
- Concept: two alpha-cutout portraits of one person slide in from opposite
  edges to face each other across a cream gap; two curves, one domain.
- Layout: copy = flex row centred in `min-height:100vh`; "ON"/"TRACK" two
  h2s right-aligned, mirrored left for "OFF"/"TRACK"; lime Rive scribble
  (`phrase_on`, `data-rive-scrolltrigger="true"`, `top center`) 15.94×
  12.13rem over "ON" only; 50×50 icon arrows to real routes. Photos at
  rest: helmet 343.02×816.02 at x=0; headshot 369.34×816.02 flush right
  (x=1070.66). Ground cream at all 9 samples; contour texture is `.gl-wrap`.
- Seam in: translation only; no lerp, no mask, no clip.
- Entry: images ∓266.67, text ∓66.67 at 5071.75; text at 0 by ~6152;
  images −33.325 @5971.75 (p=.5), −4.17 @6421.75, −0.52 @6646.75, 0
  @6871.75 — the pin's release frame.
- Dwell: the whole 900 pin IS the settling; true stillness ≈ last 225px.
- Seam out: identity transforms from 6871.75; end photo already at scale
  1.05 (halfway) that frame.
- Job: "there are two sites here, pick one" — said in pictures first.
- User reading: layout correct. Not CSS masks — `maskImage`/`clipPath`
  `none` everywhere; alpha WebP + translateX. Not synchronized — copy
  settles ~700px before the portraits.

### 2.8 OTOT end photo
- Concept: a textless full-bleed photo, DOM sibling after the sticky panel,
  z:10, rises and eclipses it for free, scrubbing its own zoom sized to
  its surplus.
- Layout: `headings:[]`; wrapper `min-height:100vh; overflow:clip`, img
  `height:120vh` absolute; at scale 1.1 rect x=−72, w=1584 — centred scale,
  only Y offset. (m) 60vh / 80vh.
- Seam in: ground cream in both files; root.y 899.75→449.75→199.75→−0.25
  over 5971.75→6871.75, 1:1; `clipPath:none`, no fade, one sharp line.
- Entry: edge climbs; scale=1+0.1p, y=−180p, p=(y−5971.75)/1800 — exact at
  8 samples; already 1.025/−45 when the edge is halfway.
- Dwell: 6871.75→7771.75 only the internal scrub (1.05→1.1, −90→−180).
- Seam out: box bottom −0.25 and black group top −0.25 at 7771.75 — both
  files. Black paints its own rgb(17,17,18) over a cream body.
- Job: a wordless held breath between two dense sections.
- User reading: "coming up from underneath" is right in position AND
  z-order; it is two motions from frame one, not one.

### 2.9 Black group (wrapper) + 2.10 Helmets Hall of Fame
- Concept: a literal opaque div in flow slides up at 1:1 — the drama is
  the plate (that a solid black block between two light sections reads
  as dramatic is INFERRED, decodes §6; the plate's mechanics are
  MEASURED). Inside, the sitewide 4-col grid at 4× density with a decaying
  checkerboard.
- Layout: full-bleed grid, outer margin 16.66 = --gap = inter-card gap
  (item#4 right edge 1423.33). Masthead: h2 "Helmets" 60px Mona at
  (16.66,33.08) over h2 "Hall of Fame" Brier lime-off (#b2c73a on #111112
  = 10.0:1, COMPUTED); copy #b9bbad (9.68:1) at x=712.52 w=331.27 —
  asymmetric, ~396px dead space right. Spacer 8.75rem desktop (6rem ≤991
  only). 16 cards 339.16×342.59, aspect 406.89/411, SVG frame with one
  chamfered corner cradling the season chip; hover pair under an ellipse
  clip at `scale(1.05)`. (m) 2-col, no stagger, title and copy side by
  side in ~168px columns.
- Seam in: root `position:static; transform:none`; y 899.75→449.75→199.75→
  −0.25 at 6871.75/7321.75/7571.75/7771.75; then −543.25/−1086.25/−1629.25
  matching every scroll delta. Pixel-sharp line (2880×80 crop, no gradient).
  Same mechanism (m) at T=5454.17.
- Entry (MEASURED, 736, 10 samples): the h2 rect sits 33.08px below the
  group edge at every sample — **the title never translates.** What moves
  on the title is the wipe: at T−vh all 6 `.line` spans are `inset(0px
  100% 0px 0px)` with lime bars at scaleX 1; the trigger is `top 90%`
  (bundle) = T−0.9vh (T−810 at 900); at T−0.5vh, ≈950ms after the trigger,
  the two heading lines are open (`inset(0 0%)`, bar 0) while the
  paragraph (declared `right, lime, 200` = +200ms) is caught mid-retreat:
  line bars scaleX 0.0149 / 0.2657 / 0.8357 in DOM order; everything is 0
  by T−0.4vh. Nav pre-flips light ~900px early; masthead and row 1 are at
  final positions the frame the edge lands.
- Dwell (MEASURED, 736): the checkerboard is TWO nested translateY writes,
  not one — outer `.helmet-grid-item-w.w-dyn-item` carries 133.33→0 on
  even columns only; inner `.helmet-grid-item-w` carries 66.67→0 on odd
  columns and 200→0 on even; net pairwise 266.67→0. Both layers are linear
  in scroll at 0.0427 px/px each (0.0854 pairwise), zero at T+H exactly
  (8176 = 6480+1696): pairwise 266.67 @T−736 · 175.8 @T−368 · 170.0
  @T−300 · 152.8 @T−100 · 144.2 @T · 135.6 @T+100 · 118.5 @T+300 · 92.7
  @T+600 · 66.9 @T+900 · 0.00 @T+1696. The 900-tall pass read 266.67 →
  244.65 → 215.92 → 192.94 @T → 144.22 → 95.49 → 46.77 → 0 @T+H (0.1138
  pairwise px/px). Rows share the column value (items 0–3 = 4–7). Converges,
  never overshoots (decodes §3). Otherwise 1:1; hover-only reveals never
  fire.
- Seam out: continues black into 2.11; the eventual exit curve belongs to
  2.12.
- Job: proof of range as pure enjoyment; primes the store.
- User reading: "Helmets Hall of Fame moves on scroll" = two things, both
  now measured: the title's one-shot lime wipe (fires at T−0.9vh, ~1.1s
  long, never replays) and the grid's scrubbed two-layer checkerboard
  (266.67→0 over the grid's own height). The title itself does not
  translate. The room is three sections, not one.

### 2.11 Callout — "view on track"
- Concept: one lime CTA breathing in a black void; the famous "warp" is the
  next section's.
- Layout: 1440×476.27 = padding 160 + 116.66 + content 199.61; icon
  75×37.5 (canvas buffer 150×75) at x=682.5; two-line Brier italic in
  433.33 (32.5rem); pill 142.2×40, radius 7.2. Root em 13.333 confirmed 4
  ways. (m) 390×379.95.
- Seam in: zero — same `.s-group.bg-black` wrapper; body cream throughout.
- Entry: first sample 8568.09 = T−900 = the Rive trigger `top bottom`; text
  already open, bars width 0; Rive window `top bottom → bottom center` =
  T−vh → T+476−vh/2 (8568→9494 = 926px; 844 at 736). **The icon's draw
  keyframes, MEASURED (736) by pixel count:** p −.1 → 0 · 0 → 0 · .2 → 0 ·
  .4 → 17% · .6 → 91% · .8 → 100% · 1.0 → 100% · 1.2 → 100%. Dead for the
  first ~30% (the icon is still 300px below the fold), draws across p≈.3–.7
  (≈370px of scroll), done with 20% of the window to spare. Same
  `helmet-reef_scroll` state machine and `scrub:0.5` feed as the signature.
- Dwell: nothing in its own DOM moves for 1826px; the visor (2.12) grows in
  the same frame, sitting at viewport-y ≈475–582 when the CTA is at 230–360.
- Seam out: hard DOM cut at 9944.36, dressed by `.exe-top-visor`: absolute,
  `inset:-1px 0 auto`, h 106.66, black, `clip-path:ellipse(70% Y% at 50%
  0)`; rx 1008 > half-width 720 → dome 106.66 deep at centre, ≈74.66 at
  the edges (32px difference). Static once grown.
- Job: one CTA, undiluted.
- User reading: real shape, wrong owner, wrong timing, nothing warps —
  0→100% spans 9044→9744, finishing ~200px before this section's bottom; a
  static rectangle being unmasked. The icon "drawing your eye" is a
  ~370px-of-scroll Rive stroke that lands before the pill is at eye level.

### 2.12 Store
- Concept: the ask staged as a desk collage, not a grid; the seam re-skinned
  by a black dome that finishes before arrival.
- Layout: two cols, padding 11rem = 146.66; text col x=146.66 w=557 (eyebrow
  99.67×16, h2 93.33px/lh 76.16/−3.33 + sr clone, para, pill 144.58×40);
  image well x=720.07 w=557, h 694.16 holding .is-1 525×694 (top −4rem
  bleed), .is-2 333×238 (right −213), .is-3 189×242 (left −150.7), sticker
  203×153, .is-4 218×158 at x=−40 (off-canvas). No `overflow:hidden` on the
  well. (m) .is-2/.is-4 `display:none`.
- Seam in: body cream in 9/11/12; black plate's bottom = 7771.75+2172.61 =
  9944.36 = T. Visor 0.2693% @9044.36 (root y 899.86) → 81.06% @9494 →
  100% @9744, flat through 11301. (m) 0.1965% @6738.89 → 100% @7582.89.
- Entry: visor first; all 4 images share one translateY, −12.51 @9494,
  −26.56 @9944, −53.33 @10851 (=4rem surplus at two box sizes: 694→747,
  158→212). Text 1:1, bars scaleX 0 at all 9 samples.
- Dwell: parallax only; no pin.
- Seam out: cream continues; polaroid + sticker paint over the next h2 in
  the seam frame — a bleed, not a cut.
- Job: sell right after the emotional peak, dressed as celebration.
- User reading: "images with parallax" misses the visor (first mover) and
  the mixed scale (one 525×694, three 189–333).

### 2.13 Partners & campaigns
- Concept: three flow layers (title → proof copy → full-bleed logo marquee)
  with one 1062×665 Rive phrase pinned at z:−1.
- Layout: spacer 267 → title row 109.31 → spacer 107 → marquee 45.83 →
  spacer 267 = 796 ≈ H 795.13. h2s 285.51×53.16 / 363.84×56.16 at x=16.66;
  copy track x=712.52 w=679.2, paragraph capped 333.33 (49% of track);
  neon box `inset:4rem 0 0 −9rem` → rect x −120, y T+53.2, 1061.7×665
  (canvas buffer 2123×1330). Marquee 1440 wide, `left:calc(--gap*−1);
  overflow:clip`, 11 logos ×5 = 55 items at runtime (MEASURED). CTA
  `display-none`, rect 0. (m) title/copy side by side, copy 167.92 wide.
- Seam in: body cream 9044→12097 across 12/13/14. GL contour tint is
  declared on the section itself (MEASURED, html): `data-gl-change-track
  data-gl-change-from="white, dark-green-tint-1-low" data-gl-change-to=
  "white, white" data-gl-change-trigger-start="top bottom"` — background
  stays white, the contour ink goes tint→white from the moment the section
  top enters the viewport. The live GL colour was not read (§7).
- Entry (MEASURED, 736): h2 final at the first sample (=trigger). **The
  neon is two separate events.** (1) The canvas ships with inline
  `opacity:0; transition: opacity .1s ease-in-out`; its own ScrollTrigger
  (`data-rive-scrolltrigger="true"`, `top center`, trigger = the canvas)
  flips it to 1 when the canvas top reaches viewport centre = T+53.2−vh/2
  (T−315 at 736; T−397 at 900): opacity 0 at T−373 and still 0 for 2.5s
  parked at T−353; 1 at T−200. A 100ms CSS fade, not a scroll fade — the
  earlier "0→1 over ~552px" is withdrawn. (2) The `page_home` state machine
  then scrubs (`scrub:0.5`, input 0..1000) from that point to the canvas
  bottom hitting viewport top (T+718 → window 1033px at 736; 1115 at 900):
  drawn pixels 39,261 (idle, hidden) → 72,015 @p.11 → 99,561 @p.30 →
  102,923 @p.60 — 95% of the stroke growth inside the first 30% of the
  window, then a 5% tail. Marquee autoplay continuous + scroll offset
  parked −144 → −16.74 @T → +144 by 11448, clamp = 10% width (±39 (m)).
- Dwell: static except autoplay; offset latched +144.
- Seam out: 267 spacer, neon tail retreating; cream continues.
- Job: claim + logo scan; the neon carries tone, not information.
- User reading: "big neon text that comes in on scroll" = a 0.1s opacity
  snap at viewport-centre, then a scrubbed Rive stroke that is 95% grown
  within ~310px of scroll. CTA not rendered; no mask-image edge fade
  (`maskImage: none`, hard clip); title swipe already resolved; neon spans
  under the title; marquee carries a second, scroll-derived offset.

### 2.14 Socials fan
- Concept: seven cards splayed as one physical object; the last soft ask.
- Layout: centred column, gap 33.3 (2×--gap); icon 46.66² at x=720; h2
  321.5×107.31 (Mona 60 + Brier line); fan box 1066.66×480 (80×36rem);
  cards 20×35rem = 266.66×466.66, radius 3.316rem = 44, `overflow:clip`,
  `will-change:transform`, absolute; per index translate/rotate/scale
  ∓400/97.3/21°/.7756, ∓293.3/53.3/14°/.8498, ∓146.7/17.3/7°/.9346, centre
  identity — bit-identical at 9 (900) + 1 (736) samples. **Reconciled with
  decodes §10 (x ±122/244/333, y 14/44/81):** the constants are rem —
  x = 11/22/30rem, y = 1.3/4/7.3rem; at this pass's 13.333px root that is
  146.7/293.3/400 and 17.3/53.3/97.3; decodes ran at an ~11.11px root
  (≈1200 wide) → 122/244/333 and 14/44/81. Same authored numbers, one
  scale factor (1.2). (m) card1 x=−59.3, card7 right edge 449.3 on 390.
- Seam in: none; cream across 13/14/15; whitespace + icon-then-headline.
- Entry: two `.oval-line-clip-wrap` lines `ellipse(20% 0%)→(100% 120%)`
  1.5s power2.inOut, 0.15s apart, trigger `top 95%` once (bundle); then
  ONLY translateY 133.33→0, ~700–780ms, reverse DOM order ~80–90ms (decodes
  §10).
- Dwell: static; hover = fan lift (+8%, −2.5rem, elastic — the bundle's
  `elastic.out(1, 0.75)`) stacked on a Vimeo hover-to-play (one id ×7).
- Seam out: `.footer-bg-gradient` radial at `50% −190%` bleeds lime upward;
  `.s.is-footer` 8rem strip `ellipse(70% 100% at 50% 0)` domes the top.
- Job: convert to an off-site follow with a toy, not a list.
- User reading: two hover systems read as one; the fan is NOT scroll-driven.

### 2.15 Footer (masked panel)
- Concept: the hero's card grammar reused as the closing move, arriving as
  one rigid block.
- Layout: panel 1406.67×746.66 at x=16.66, aspect 1688/896; links pushed to
  the edges (`padding 12.8rem`); statement absolute `inset:12rem 0 auto`,
  48rem measure; figure 650×532 centred on x=720, `bottom:−3rem` breaching
  the mask by ~40px; legal row absolute at the panel's bottom on a LIME
  strip (pixel rgb(209,255,0) at 3 samples; dark-green ink on it = 12.26:1,
  COMPUTED). Marquee behind (z:−1) desktop, moved to `inset:3rem 0 auto`
  (m); 28 `.marquee-spacer.footer` clones at runtime (7 static).
- Seam in: body cream in 14 and 15; cream → lime glow (~150–200px) → hard
  mask edge into #282c20.
- Entry: ~203px blank (spacer 187 + padding), then panel y 1103.33→137.33
  over 966 scroll (ratio 1.000); child offsets 255.00 and 661.66 constant
  at 5 positions.
- Dwell: `transform:none` everywhere; only marquee (30, left) and a Rive
  signature loop.
- Seam out: T+H = 13,578.66 ≈ docHeight. The page stops.
- Job: closure, not conversion — same shape grammar as the top.
- User reading: "almost another hero" — correct, and it is NOT animated:
  composition alone; legal links sit on the accent, not on cream.

### 2.16 GL wrap + anchor (fixed layers)
- Concept: one persistent WebGL canvas (`.gl-wrap`, z:−1) plus an empty
  bounds div (`.gl-background`, 0 children); content sections declare colour
  targets and one engine writes body + canvas on the same frame.
- Layout: 1440×900 / 390×844 at every sample; canvas ships inside an HTML
  comment and is appended at boot; modifiers `.on-track` (z:5,
  `pointer-events:none`) and `.not-found` (z:20); last children of
  `.taxi-w`. `window.landoGL` exposes `reveal, lenis, bounds, params,
  assets` (MEASURED); `params.headScene` = `{REVEAL_DURATION 1.1,
  COLOR_BACKGROUND #F8F8F3, COLOR_FOREGROUND #D2FF00, COLOR_OUTLINE
  #CBCBB9, COLOR_FILTER #50593F, SCALE 1, VARIANT "Google", REVEAL_SIZE
  25, CURSOR_INTENSITY 0.15 …}`; `backgroundScene` cursor colours #b2c73a
  (the second lime lives here too). The scroll progress driving the head
  is NOT on that object (SCALE stayed 1 at 7 positions) — it is a
  private field of the scene class, hence the buffer readback in §2.2.
- Seam/entry/dwell/exit: none of its own; boots 434ms after first paint
  (decodes §11). Colour timeline is law 2.
- Job: the still point every other effect plays against.
- User reading: z:−1 paints ABOVE the body colour and below flow content —
  not "hidden".

## 3 · THE LAYOUT INVENTIONS

"Why" bullets are the analyst's reading (INFERRED) unless a number is
attached; "Measured" bullets are the facts.

### 3.1 The facing pair (§2.7)
- What: two portraits of the same subject, one per edge, looking inward
  across a centred decision column with two CTAs.
- Measured: cutouts 343.02×816.02 (x=0) and 369.34×816.02 (right-flush),
  90.67vh, aspect from the asset; text cols 283.44 each, gap 3×--gap;
  entrance ∓266.67 cubic over 2vh, ∓66.67 linear over 1.2vh; pin 900.
- Why (INFERRED): an either/or is presented in one frame rather than
  stacked; the same face on both sides makes the labels redundant; text
  locks ~700px before the images so there is always something still to
  read (that gap is MEASURED).
- Abstract: `.stage{position:relative}` · decision column in normal flow,
  centred · each option's image `position:absolute`, inset to its own
  bottom corner, sized in vh with `aspect-ratio` · ALWAYS two curves, one
  progress. The subject can be two products, two rooms, two vans — any
  pair of same-scale cutouts.

### 3.2 The fan (§2.14)
- What: 5–9 cards splayed as a hand, odd count, centre card neutral and
  highest.
- Measured: box 80×36rem (2.2:1); cards 20×35rem, radius 3.3rem; rotation
  ±7/14/21°, scale .9346/.8498/.7756, x ±11/22/30rem (steps 11, 11, 8 —
  hand-set, not a radius), y 1.3/4/7.3rem. (146.7/293.3/400 px at a
  13.33px root; 122/244/333 at decodes' 11.11px root.)
- Why (INFERRED): a list becomes one object; the entrance animates ONE
  property (Y, MEASURED), reverse-staggered, so it reads as "set down".
- Abstract: one `cards[i]={x,y,rot,scale}` array in rem drives rest pose,
  stagger order (`n−1−i`) and hover falloff (`|i−hovered|`). NEVER derive
  from sin/cos. Touch needs a tap equivalent or the toy is invisible.

### 3.3 The footer-as-second-hero (§2.15)
- What: a dark, rounded, mask-notched panel with one centred object and a
  radial glow — the hero's composition, at the bottom, static.
- Measured: 1406.67×746.66 in 16.66 gutters; figure 650×532 on the centre
  axis breaching −3rem; glow `circle farthest-corner at 50% −190%`, stops
  68%/83%; cap `ellipse(70% 100% at 50% 0)` on an 8rem strip; ~200px blank
  before; 1:1 arrival.
- Why (INFERRED): exit rhymes with entry; utility content (legal) gets the
  accent strip, not grey.
- Abstract: ONE reusable card component mounted twice (top: live CTA,
  bottom: utility). ALWAYS rigid — children keep constant offsets. The
  centred breaching object does not have to be a photo of a person: a
  logo lock-up, a product cutout, a van, a tool, an award badge or a map
  pin does the same job as long as it is ONE alpha-cutout object on the
  centre axis, sized ~45% of the panel width, breaching by ~5% of the
  panel height.

### 3.4 The three-column partners band (§2.13)
- What: title left (gutter), description middle (capped), display flourish
  right/behind, logo marquee full-bleed below.
- Measured: h2 at x=16.66; copy track 679.2 wide with copy capped 333.33
  (49%); neon 1062×665 at (−120,53) z:−1; marquee 1440 wide, 45.83 tall,
  ±144 scroll offset (10%); spacers 267/107/267.
- Why (INFERRED): the width contrast separates evidence from prose; the
  dead right quarter is reserved for the flourish, so it never fights the
  copy (the 49% cap is MEASURED).
- Abstract: contained title+copy · `width:100vw; left:calc(var(--gutter)
  *−1); overflow:clip` sibling for the proof row · copy `max-width` well
  under its track · flourish absolute, z:−1, sized independently.

### 3.5 The statement with accent words (§2.4)
- What: one wrapped sentence, centred, uppercase, 2–3 words in a second
  family, bigger, coloured; seal + credential above.
- Measured: 1068 column; 105.83px vs 110px accents (+4%); lh 90.6% vs 83%;
  gap ratio 3:1 (50 vs 16.66); 7 lines 353→1067 wide; 1.53s wipe, once.
- Why (INFERRED): three simultaneous cues (family, size, colour) survive
  greyscale; the ragged flag gives rhythm; the longest one-shot wipe on the
  page lands here (7 lines, MEASURED).
- Abstract: flex column · `text-align:center` · no manual breaks · accents
  in an inline element with own family/size/colour token · `max-width`
  60–75% of viewport.

### 3.6 The horizontal track (§2.5)
- What: a pinned corkboard whose lateral travel equals the vertical scroll,
  with hand-offset items, captions that assemble once each, and a colour
  wash on its own clock.
- Measured: `padding-left:75vw`; 12 items; travel 3143 = width − vw; pivot
  T−900; per-item drift = its 4rem surplus; colour starts +450, ends 785
  before the pin; visible pin 2243.
- Why (INFERRED): the axis switch itself is the "different mode" cue;
  non-aligned offsets read as hung photos, not a module.
- Abstract: decodes §9 formula · two triggers, one scroll input · colour
  as a separate engine · NEVER put must-see content here (apple-grammar §6
  axis law) · ship a vertical masonry below the tablet breakpoint.

### 3.7 The fixed anchor scrolled over (§2.2, §2.16)
- What: a persistent fixed layer (canvas/image) that early sections scroll
  OVER; the hero image shrinks INTO a fixed-size DOM anchor whose centre is
  the viewport centre.
- Measured: canvas 1440×900 at every sample; anchor 471.66×305 centred
  (720,450), CSS-sized, never resized; travel = one pin height on both
  breakpoints (900/900, 844/844); size curve power1.inOut, contents
  desaturate .265→.104 across the middle half (§2.2).
- Why (INFERRED): boundaries need no colour work when the backdrop is never
  section-scoped; a coordinate anchor lets the visual be any size without
  a reflow (decodes §11 zero-layout budget, MEASURED).
- Abstract: `position:fixed; inset:0; z-index:−1` backdrop + empty bounds
  div · sticky wrapper 200vh · destination = a flex-centred invisible box;
  READ its rect, never hand-position it. The shrinking visual can be a
  CSS-transformed `<img>` — the WebGL is Lando's skin, the anchor is the
  DNA.

### 3.8 Two more worth naming
- Converging checkerboard grid (§2.10): full-bleed, one gap token for margin
  and gutter, alternate columns offset 266.67→0 over one grid-height via
  two nested translateY layers (133.33 outer on even columns; 66.67/200
  inner). Desktop only. The chamfered SVG frame + chip on each card is
  skin (§4 says so).
- Scattered collage (§2.12): one dominant + 2–3 accents + a sticker; two
  bled past their box (−213/−150.7), one off the page (x=−40); no clip.

## 4 · TRANSFERABLE PATTERN CATALOGUE

Deduplicated across all 18 decodes. No Lando nouns. Format: name · rule ·
when · build shape. Numbers inside a rule are the measured example, not
the rule — re-derive from the box.

### Seams (between rooms)
- **Static-plate cut** · a section with its own flat fill, `position:
  static; transform:none`, edge_y = top − scrollY, zero smoothing · a new
  room at zero runtime cost · plain `<section style="background:C">`;
  pre-flip chrome ~1vh earlier.
- **Late, decoupled colour lerp** · body ground changes off the same
  scrollY as a structural move but starts ≥0.5vh AFTER it and ends ≥0.9vh
  BEFORE it; colour snaps to f(scroll), geometry damps · any mood shift
  riding a pin or axis switch · `data-color-from/to` on the content section,
  one rAF, writes `style.backgroundColor`, no CSS transition (decodes §2).
- **Shared-ground room** · paint the colour on ONE wrapper spanning N
  sections; children transparent; the page backdrop is one fixed layer ·
  3+ sections that should read as one room; any multi-section page · `<div
  class="room">` with the fill, plus `position:fixed; inset:0; z-index:−1`
  backdrop behind everything.
- **Whitespace-only seam** · kin sections on one ground separate by
  ≥0.55vh of blank plus a repeated icon-then-headline opener; a silent
  150–250px gap precedes an impact panel · between two proof sections,
  before a closing panel · spacer blocks, a `gap×3` scale, no paint change.
- **Ellipse doorway** · a flap of the OLD colour lives at the top of the
  NEW section: absolute, h ≈8–12% vh, `inset:−1px 0 auto`, `clip-path:
  ellipse(≥65% P% at 50% 0)`, P scrubbed 0→100 over ~1vh, finishing ≥200px
  before the section's top reaches the viewport top; the static version
  (P=100) caps any coloured band · ending a colour run; any band needing a
  non-rectangular top · first child of the receiving section, low z,
  `ease:none`.
- **Glow-before-the-cut** · before light→dark, a radial gradient inside
  the dark box centred far above it (`50% −190%`, stops ~68/83%) leaks the
  accent upward · any hard light→dark handoff · one absolute div, no JS.
- **Let the exit overlap** · two same-ground sections: omit `overflow:
  hidden` and let bled assets paint over the next heading for one screen ·
  first section has oversized imagery · nothing extra; guard copy length.
- **Hard in, soft out** · enter a contrasting interlude on a flat DOM cut
  against the busiest neighbour; leave through a soft asymmetric curve ·
  any dark/accent interlude · no in-treatment; one flap or SVG hem out.

### Entrances
- **Pre-roll one viewport** · every scrubbed entrance pivots at elTop − vh,
  never elTop; window = section height · any pinned or scroll-linked
  reveal · `p=clamp((scrollY−(top−vh))/window,0,1)`; ScrollTrigger start
  `top bottom` for the transform, `top top` only for the pin.
- **Pre-resolve, then perform** · one-shot text reveals fire in the bottom
  10% of the viewport (`top 90%`, once) so they finish BEFORE the section
  is in the reading zone; the one visible beat is a decorative scrub
  starting at the fold · any section that should feel instant · text
  trigger at `top 90%`; graphic trigger `top bottom → bottom center`.
- **Two-rate paired entrance** · copy linear over ~1.2vh, imagery cubic
  ease-out over ~2vh, same start, equal-and-opposite offsets converging to
  0 · any headline+image or either/or pair · one progress, two curves
  (decodes §9).
- **Recede-to-reveal** · the incumbent visual's prominence goes DOWN over
  the exact window a note/quote comes UP · a quote landing beside a large
  photo · one `t`, photo from `1−t`, text from `t`.
- **Carrier-and-payoff nesting** · a slow drawn gesture gets a window
  roughly 2× the fast text reveal nested inside it, overshooting it by
  equal margins at both ends · an underline, a draw, a long fade wrapping
  a reveal · two fixed-height trackers with known doc-tops; derive windows
  from the trigger keywords. (Worked example only: 630 wrapping 270,
  ±180 either side; ratios ≈ 2.3:1 and 0.29 of the carrier per margin —
  pick your own.)
- **Authored-dead-zone draw** · a scroll-scrubbed stroke (Rive, DrawSVG,
  `stroke-dashoffset`) whose drawn fraction stays at 0 for the first
  20–30% of its window, does ~90% of its work in the middle 40%, and coasts
  · a signature, an underline, an icon that "draws your eye" · the page
  feeds `progress` linearly (scrub ~0.5); the S-curve lives in the asset
  (measured 0/0/45/88/97/100% and 0/0/17/91/100% at p=0/.2/.4/.6/.8/1).
- **Trailing-colour wipe (the triggered vocabulary)** · per-line clip
  `inset(0 100% 0 0)→0` 0.6s ease-out, 0.15s stagger; accent bar starts
  +0.3s and scaleX 1→0 over 0.6s; `once`; trigger `top 90%`; optional
  per-element delay for a paragraph under a title · every heading, one
  declaration each (`data-anim="dir, colour, delayMs"`) · GSAP timeline
  per element, one shared engine. This is the ONLY kind of thing that is
  triggered; structure is never.
- **Clear-the-corner cue** · a hero corner widget collapses over the first
  ~7% of the pin (`ellipse(100% 120%)→(100% 0%)`) before the main move ·
  hours chip, rating, location pin · own short trigger, independent of the
  main tween.
- **Snap-then-scrub flourish** · a decorative display object appears by a
  ≤100ms opacity snap when it reaches viewport centre, then scrubs its own
  internal motion over ~1.4vh with 95% of the change in the first 30% ·
  a big display word, a doodle, a stamp behind a proof band · inline
  `opacity:0; transition:opacity .1s` + one ScrollTrigger at `top center`.
- **Drop-only entrance** · a group enters by ONE property (translateY
  ≈10rem→0, 700–780ms decel), everything else snaps; reverse-order stagger
  80–90ms; plays once · fanned or stacked card groups · inline transforms
  per frame, opacity untouched.

### Pins and handoffs
- **Pin = wrapper 2×H** · sticky item H inside a 2H wrapper; the NEXT block
  is a plain sibling after it with higher z; it climbs bottom→top across
  the dwell for free · any "reveal the next over the current" · `.wrap{
  position:relative;height:2H} .pin{position:sticky;top:0;height:H}
  .next{position:relative;z-index:10}`.
- **Assembly-timed release** · the pinned content's own entrance domain =
  2×H starting at T−vh, so it is half-done at engage and at rest on the
  release frame · pinned reveal panels · no authored hold.
- **Hide the release under something already moving** · the covering
  element runs its own scrub across the ENTIRE wrapper, independent of the
  sibling's sticky state · every pin→unpin · `(scrollY−wrapTop)/wrapH`.
- **Reveal-on-full-pin** · an underlying reveal completes at exactly 100%
  of the pin's budget on every breakpoint · pinned hero handing to content
  behind it · same ScrollTrigger progress for pin and reveal.
- **Trigger-length = height** · scrub `top bottom → bottom top` so the last
  scrubbed frame is the last visible frame and the next flat block's edge
  is the seam · any block handing off to a flat colour.
- **Shrink-to-anchor** · a full-bleed visual scales into a fixed CSS-sized
  box whose centre is the viewport centre, over exactly one pin height on
  an in-out curve (measured power1.inOut), while its colour drains toward
  a duotone across the middle half; the box is a coordinate, never resized
  · a hero subject that should persist small · flex-centred invisible
  target; read its rect; `transform:scale()` + `filter:saturate()` on a
  plain `<img>` reproduces it without WebGL.

### Drift
- **Travel = surplus** · oversize an image by exactly its travel (4rem at
  two box sizes measured); never author the distance separately; clip
  only the wrapper of the thing that grows · any parallax or Ken Burns ·
  `height:calc(100% + Xrem)`, one shared tween over N targets (decodes
  §10).
- **Converging checkerboard** · 8+ same-shape cards; alternate columns
  offset ≈0.78×cell → 0 over one grid-height, ending flush, never
  overshooting; off below tablet · dense grids that would read as a
  spreadsheet · CSS grid + one scroll-written offset on alternate wrappers
  (decodes §3). Two nested layers (outer on even columns, inner on all)
  give three distinct rates from one progress if wanted.
- **Scroll-answered marquee** · constant autoplay + a scroll-derived offset
  clamped ±10% of width, crossing 0 as the row crosses viewport centre;
  the ambient version sits on a 0-height anchor line so it owns no layout
  · logo bars, tickers, slogan texture · nested second translateX;
  `inset:50% 0 auto` for the ambient floor.

### Layout
- **Flanking pair** · options as absolute bookends on their own edges,
  decision column centred in flow · any either/or · §3.1.
- **Card-fan finale** · odd hand of cards in a 2.2:1 box, hand-authored
  per-index rem constants, one array driving rest/stagger/hover · last soft
  ask · §3.2.
- **Collage, not catalog** · one dominant + 2–3 accents + a sticker, ≥2
  bled 10–15% past their box, ≥1 off the page, no clip · a mid-narrative
  sell · relative well, absolute children with negative insets.
- **Contained title, full-bleed proof** · copy in the gutter, the evidence
  row at 100vw; copy capped ≈50% of its track to reserve space for a
  flourish · logo/credential strips · §3.4.
- **Full-bleed single-token grid** · one spacing token for outer margin and
  gutter (`gap:var(--gap); padding-inline:var(--gap)`), same-shape cards
  each carrying ONE persistent badge (season, price, date, rating) and a
  hover state that swaps ONLY the image and the frame colour · archive/
  gallery/service walls. SKIN, optional: the reference draws the frame as
  a chamfered SVG with two stacked `<path>`s sharing `d` (dim base +
  accent copy at opacity 0 on hover) — a plain `border` + `border-radius`
  with a `:hover` colour is the same pattern.
- **Credential-then-claim + ragged manifesto + three-cue emphasis** · seal
  → 1/10-size uppercase label → statement at 3× the gap; natural wrap only;
  emphasis by family+size+colour · the one persuasive sentence · §3.5.
- **Microcopy handoff CTA** · a half-viewport centred band (icon + one
  line + one pill) still inside the grid's room, a few hundred px after
  the last row · curated subsets · same wrapper, no new seam.
- **Bookend hero** · the top card component remounted last with utility
  content; legal row on the accent strip exposed by the mask's corner
  taper; one alpha-cutout object (person, product, logo lock-up, van,
  tool, badge) breaches the frame on the centre axis · brand-forward long
  pages · §3.3.

### Chrome and transitions
- **Occlude, don't dissolve** · a fixed top-z stage with one opaque cover
  (canvas/video/lottie) hides the outgoing view, the DOM swaps underneath,
  then reveals; hold ~1s, fade only the foreground control 300ms, hard-cut
  the stage; prefetch on hover so it is never network-gated · client-side
  route swaps where layouts differ · fixed div, timeline-driven hide
  (decodes §5). ALWAYS give it a `<noscript>` escape or a CSS-only
  `visibility` fallback — the reference has neither (§5).
- **Ground-matched chrome** · NEVER give a fixed nav a fill; swap ONE
  `data-theme` attribute driving 2–4 child properties on the UI curve;
  settle the clusters 1.2→1.0 over a landmark distance with mirrored
  origins (0 0 / 100% 0); identity dead-centre outside the flex row,
  actions in the corners · any long scroll with ≥2 ground changes · CSS
  attribute selectors + one discrete scroll write. Put it in a `<nav>`.

### Backdrop
- **Persistent backdrop anchor** · an empty `position:fixed; inset:0;
  z-index:−1` div, last in the DOM, never scroll-styled, separate from the
  paint surface (canvas/video) so resolution/DPR tuning never touches
  layout; colour shifts are declared on CONTENT, the backdrop stays blind;
  stacking states via modifier classes only; heavy surfaces ship as a
  commented-out placeholder appended at boot · any ambient layer · §3.7.

## 5 · WHAT COULD BE IMPROVED (ranked, with evidence)

Critique of the reference on its own terms first, then transfer hazards.

1. **No value proposition for 1 viewport, no CTA for 10.** The hero is
   textless (the only h1 is a `.screen-reader` clone; visible copy starts
   at the statement, scroll 900+); the first in-page CTA is the callout at
   9468 = 10.5 screens; the store ask at 9944. Works for an athlete whose
   name IS the pitch; for any site that needs to convert, this is the
   flaw that matters most. MEASURED.
2. **No-JS = a permanent lime wall.** `.transition-w` carries an inline
   `display:flex` lime fill; the hide is JS-only; 0 `<noscript>` elements;
   routing (Taxi), hero, nav morph, marquee strings and the fan all need
   JS/WebGL/Rive. With scripts blocked the visitor sees the brand colour
   and nothing else. MEASURED (static + runtime).
3. **Crawlability is fine; text density is not.** Webflow serves full
   static HTML (1,240 tags, all copy present; 1 h1, 11 unique h2, `<title>`,
   Taxi fetches real URLs) — indexable. But the whole 13,578px page holds
   3,322 characters of visible text (~0.24 chars/px), the marquee slogans
   exist only in `landoGL.params.carouselScene` (not indexable), and the
   signature, "ON" scribble, callout icon and hamburger are Rive binaries.
   For a client whose primary metric is search, this page shape is a
   thin-content page with a great headline. MEASURED.
4. **Keyboard-dead, hover-only content.** Fan cards are `<div>`+`<img
   alt="">`, no `<a>`/`tabindex`; helmet names are reachable only via a
   `:hover` reveal; touch never sees the fan's two stacked hover systems.
   MEASURED.
5. **Zero `prefers-reduced-motion`** in 188KB of CSS and the bundles; a
   forced 1.5–2.1s `pointer-events:auto` curtain on every load and route
   change is the worst instance. MEASURED.
6. **Alt coverage 18/133.** Fan 7× `alt:null`, helmets 16× `alt=""`,
   partners 11× `alt=""`, footer 8/8 `alt=""` — the sections whose point is
   the image. MEASURED.
7. **DOM inflates 66% at runtime.** 1,240 static tags → 2,056 elements:
   284 `.char` spans, 79 `.line` spans, 82 injected `.high-line-reveal`
   bar divs, 55 marquee logo items (11 ×5), 28 footer marquee spacers (7
   static ×4), 64 helmet frame SVGs (16 cards × 2 sizes × 2 states) + 32
   helmet images (2 per card for hover), 198 `<img>` (133 static). None of
   this is the 5.24MB WebGL payload; it is memory and style-recalc surface
   paid on every route, independent of the scene. MEASURED.
8. **Mobile is a different, thinner page.** Track `transform:none` at every
   (m) sample and the sticky never holds; store hides 2 of 4 collage assets;
   helmets lose the stagger; nav loses its entry; OTOT dwell ~675 vs 900;
   partners and helmets keep title/copy side by side in ~168px columns;
   the STORE pill occludes "See m…" in the callout (m); fan cards 1 and 7
   crop off a 390 viewport. MEASURED.
9. **5.24MB WebGL payload**, both helmet texture sets (~850KB) fetched
   together (loading strategy INFERRED); the biggest line item is not an
   image.
10. **Nav semantics.** No `<nav>`/`role="navigation"` (the bar is a
    `<div data-nav-theme>`); names via `title`; `aria-expanded` absent (0
    occurrences); brand identity leaves the chrome below 991px (27px glyph
    only). MEASURED.
11. **Unlabelled rooms.** Statement, track, and callout have `headings:[]`;
    the thesis sentence is not a heading. Dead CTA: "view partnerships"
    wrapped in `display-none`, rect 0×0. MEASURED.
12. **Motion vs reading.** Track stacks three rates while a quote is read;
    the marquee never yields during the 270px message payoff; OTOT has
    three moving elements in a 180px window; the end photo's terminal crop
    cuts the face. MEASURED geometry, INFERRED harm.
13. **Contrast — COMPUTED, and it passes.** #b2c73a on #111112 = 10.0:1;
    on #282c20 = 7.56:1; #b9bbad on #111112 = 9.68:1, on #282c20 = 7.32:1;
    #d2ff00 on #282c20 = 12.26:1; cream on dark-green 12.92:1, on black
    17.08:1; legal ink on the lime strip 12.26:1. All AAA. The one hazard:
    #b2c73a on cream #f4f4ed = 1.71:1 — never used on the home page, but
    a one-class mistake away.
14. **Corrected from the first pass — the heading twins are handled
    RIGHT.** Every split h2 has a `.screen-reader` sibling (`clip-path:
    inset(50%)`, width 1) carrying the text and the visual copy is
    `aria-hidden="true"` (434 aria-hidden nodes at runtime: 284 chars, 79
    lines, 11 h2, 26 button labels …). Screen readers hear each heading
    once. Withdrawn as a finding; kept here so nobody re-raises it.
15. **Untested/fragile.** Focus rings unauthored (INFERRED); overflow bleed
    unenforced; negative z-index convention collides silently.

## 6 · APPLYING IT — a 6-section local-business site

Budget: ≤7 viewports total (Lando's 14 is an athlete's luxury) · 1 pin ·
0 axis switches · 1 body-ground flip · 2 foreground plates · one triggered
VOCABULARY (the line wipe) declared per heading, nothing else triggered ·
≤7% of elements ever change a paint property (the measured restraint
number) · every hover has a tap/focus twin · `prefers-reduced-motion`
resolves every scrub to its rest frame · a `<noscript>` that shows the
page · the value proposition and phone number in frame one.

| section | ground | pattern(s) | why |
|---|---|---|---|
| Hero | dark | Ground-matched chrome in a `<nav>` · Shrink-to-anchor on a plain `<img>` (van, storefront, product) OR a static headline + one Authored-dead-zone draw · Clear-the-corner (open-now/rating chip) · Pre-roll · Persistent backdrop | §5 item 1 forbids Lando's textless hero for a business: the claim must be in frame one. The one pin lives here if anywhere. |
| Value statement | dark, still | Credential-then-claim · Ragged manifesto · Three-cue emphasis · the Trailing-colour wipe on its 3–7 lines · Static rest beat | Law 7/11: after the pin, a still thesis; the longest wipe on the page lands here. |
| Services | dark→light lerp starts ≥0.5vh in, ends ≥0.9vh before the end | Late decoupled lerp · Full-bleed single-token grid · Converging checkerboard · a plain card frame with a price badge (the chamfer is Lando's skin) · Pre-resolve title | Law 2/10: the flip rides the biggest room, but DOWN — services are must-see, so no track (apple-grammar §6). |
| Proof | light → black plate | Static-plate cut in · Flanking pair (before/after) with Two-rate entrance · Contained title, full-bleed proof (review/credential marquee) · Snap-then-scrub flourish behind it if the brand has a display word · Microcopy handoff CTA · Ellipse doorway out | Law 8: hard in, soft out; the dark room is a foreground fill, not a second body flip. |
| Process | light | Whitespace-only seams between steps · Travel = surplus on step imagery · Let the exit overlap · zero pins | A SEQUENCE goes down (apple axis law); reassurance beats spectacle (memory: show the whole path at once). |
| Close | light → panel | Silent gap · Glow-before-the-cut · Bookend hero panel with ONE CTA (call/quote) and ONE breaching object (logo lock-up or van) · Elliptical cap · Accent utility strip · optional Card-fan for socials with tap fallback | Law 12: the exit rhymes with the entry; law 6's quiet back half puts the ask on a still page. |

Seam sequence check against law 1: chrome/hard-cut → hard-cut-same-ground
→ late lerp → static-plate cut → ellipse doorway → whitespace → glow+cap.
Seven seams, no repeats.

**DON'T-LIFT list**
- The textless hero (a business cannot spend 1vh before its value prop).
- The 2.1s route curtain — local sites are multi-page and task-driven;
  ≤600ms occlusion or none, and never without a no-JS escape.
- The horizontal track for anything must-see; and it dies on mobile anyway.
- Three.js / Rive / a 5.24MB scene — CSS+GSAP equivalents only; text that
  matters lives in the DOM, never in a canvas param.
- Hover-only content (helmet names, fan video); `title`-only names; dead
  CTAs; a `<div>` nav.
- 13,578px of scroll; three pins; the marquee under the message; 66% DOM
  inflation from clones.
- The lime+olive palette (both limes), Mona+Brier, the autograph, the
  helmet, the chamfered card frame, the exact numbers (471.66×305, ±21°,
  70%/8rem, 4rem surplus, 30/22/11rem) — re-derive from the brand and the
  box.
- Both mobile compromises: side-by-side title/copy at 390 and hiding half
  the collage.

## 7 · OPEN, CLOSED, AND CORRECTED

### Closed this pass (were open in the draft)
- Signature draw curve → §2.3 (0/0/45/88/97/100% at p=0/.2/.4/.6/.8/1).
- Callout Rive keyframes → §2.11 (0/0/0/17/91/100% at p=−.1…0.8).
- Partners neon → §2.13 (0.1s CSS opacity at canvas top-centre, then a
  scrubbed Rive stroke, 95% inside 30% of a 1.4vh window); the "552px
  fade" is withdrawn; the GL tint declaration is located in the html.
- Hero WebGL shrink → §2.2 (area 100→14.7% on power1.inOut, confirmed
  within 0.015 at four points) and desaturation (.265→.104→.163).
- Helmets: the title does NOT translate (h2 offset 33.08 constant at 10
  samples); its wipe fires at `top 90%` and was caught mid-retreat
  (0.0149/0.2657/0.8357); the checkerboard is two nested translateY
  layers (§2.10). The "266.67 vs 133.33" puzzle: 133.33 is the OUTER layer
  alone; 266.67 is the pairwise sum with the inner layer.
- Restraint quantified: 123/1,775 elements (6.9%) ever change a paint
  property; 96 transform / 20 clip-path / 4 opacity / 4 color / 2
  visibility (preamble).
- Contrast computed (§5 item 13). Heading-twin a11y corrected (§5 item 14).
- Fan geometry vs decodes §10 reconciled by rem (§2.14, §3.2).
- `window.landoGL.params` captured (§2.16): VARIANT "Google", REVEAL_
  DURATION 1.1, both scene palettes, carousel strings.

### Corrections to site-references.md → Lando (all MEASURED)
- Palette: ground is `--color--dark-green #282c20`, not "#3a3a2e". There
  are TWO limes, `--color--lime`/`--color--lime-zero` #d2ff00 and
  `--color--lime-off` #b2c73a (accent type, GL cursor colour) — not "ONE
  lime accent". Also in play: `--color--black #111112`, `--color--white
  #f4f4ed`, `--color--grey-on-track #b9bbad`, `--color--dark-green-tint-1
  #3b3c38`.
- "Exactly TWO easing curves": lando.css has 13 transition declarations and
  ONE `cubic-bezier` — `(.19,1,.22,1)` on a `.6s` rule; `cubic-bezier(.65,
  .05,0,1)` and `0.75s` appear in neither the CSS nor the 1.46MB bundle;
  there is no `CustomEase.create`. The bundle's GSAP eases are `none` ×117,
  `power2.out` ×36, `power2.inOut` ×17, `power1.inOut` ×13, `expo.inOut`
  ×12, `power3.out` ×10, `linear` ×6, `power2.in`/`expo.out`/`expo.in`/
  `elastic.out(1,0.75)` ×5 each, plus power1/3/4 variants. The real
  discipline is "structure scrubbed with `none`; reveals on power2".
- "Clip-path iris/ellipse wipes @0.75s for section entrances": section
  entrances are DOM edges and scrubbed transforms (laws 3, 8); the wipes
  are per-LINE `inset()` clips at 0.6s power2.out on headings/paragraphs
  (41 declared), and the only ellipse text reveal is the socials h2 (1.5s
  power2.inOut). The full-screen menu wipe was not re-measured.
- "Signature draws progressively, scrubbed": confirmed, with the curve.

### Still open
- Intro: frame-by-frame Rive curtain shape; overlap with the 1.1s GL
  `uReveal`; ARIA set on `.transition-w`; frame timing of two stacked
  full-viewport canvases during the transition.
- Nav: the dark/light TIMELINE (dark 0–45 → light 90–3200 → dark → light
  6872 → dark 9944) is unreconciled with a dwell shot showing dark ink
  inside the light window; the attribute read "light" at every helmets
  sample (736) and nothing else was captured; mega-menu OPEN animation;
  `SL()`/200ms lockout source not found.
- Hero: mobile shrink easing between 0 and 844; root font-size at
  991–1440 intermediate widths; the head scene's private scroll-progress
  field (only its output was measured).
- Marquee layer: mobile tracker doc-tops and windows (reveal bracketed
  422→844 only); the manifest's 0.66 opacity at 750 (no 750 sample).
- Statement: visual line count at 390; `<strong>` semantics; laurel
  markup; `.high-line-reveal` colour source is now known (injected inline
  by the `data-anim-high` engine, bundle) — closed.
- Track: nav flip ≈3031 taken from the brief, not re-derived.
- OTOT: per-section frame timing; mobile ≤479 grid order. Eases now read
  from the bundle's vocabulary but not tied to these tweens by name.
- End photo: instant vs damped f(scroll) not distinguished (no jump test on
  this element).
- Helmets: the checkerboard's start position is viewport-dependent (266.67
  saturates ≈T−0.72vh at 900 but ≈T−1.9vh at 736 by linear extrapolation)
  — the trigger's start keyword was not found in the bundle; hover reveal
  unverified; mobile 168px-column wrap quality.
- Callout: canvas accessible name at runtime.
- Store: swipe-bar reveal geometry/duration; per-image alt; once vs replay.
- Partners: the live GL contour colour during the declared tint→white
  change (WebGL readback was done for the hero only); tablet 768–1023
  collision with the neon box.
- Socials: existence of a tap-to-play fallback.
- Footer: keyboard focus order; Rive signature loop vs one-shot.
- GL: `aria-hidden` on the canvas; mobile DPR cap / any three.js gate
  below a breakpoint; owner of the background type fragments behind the
  portrait.
- Cross-document: decodes.md sampled ~1200×692 (colour lerp 2242→4005;
  OTOT images 1384; fan x ±333); the first pass here was 1440×900 (lerp
  visible 3278→5186; OTOT 1800; fan ±400); the second pass 1440×736
  (docH 12,286; helmets T 6479.75; callout T 8176.09; partners T 9559.85).
  Absolute px differ; the ratios (2vh, 1.2vh, T−vh, 0.5vh→1.2vh, rem
  constants) agree across all three — cite by ratio, not by pixel.
