# Apple Micro-Interactions — the complete codex

Catalogued 2026-07-13 from apple.com's live stylesheets and per-frame
interaction sampling (home, macbook-neo, iphone-17-pro, apple-one, mac).
Values are read from their shipped CSS/DOM, not eyeballed. Companion to
apple-grammar.md. §9 (scroll/touch) appended from the third expedition.

## 0 · THE TIMING LAW (the biggest finding)
Apple's motion is BIMODAL — two speed classes, nothing between:
- **Micro (state feedback): 0–100ms, linear or instant.** Button hover color
  = NO transition at all (instant snap). Dot color = instant. Paddle/icon
  hovers = 100ms linear. Search-result row hover = 20ms.
- **Structural (things that move/resize): 320–400ms, eased.** Flyout 320ms
  cubic-bezier(.4,0,.6,1). Tab pill 320ms ease-out. Accordion 400ms
  ease-in-out. Localnav morph 400ms ease-out.
Nothing hovers at 250ms "web default." Feedback is immediate; structure is
deliberate. (EAS mapping: our --ease-ui hovers at .3s are in the dead zone —
micro states should drop to ≤100ms/instant, structural stays ~.32-.45s.)

## 1 · Buttons (pills)
- Fill: #0071e3 → hover #0076DF → active #006EDB — INSTANT (no transition).
- Secondary: transparent + 1px #0066cc border → hover fills, text→white.
- Focus-visible: outline 2px solid #0071e3, offset 3px. Disabled: opacity
  .42 (light)/.36 (dark), pointer-events none. No press scale on pills.
- Sizes: 14px/9-16px pad · 17px/12-22px · 17px/18-31px (super).

## 2 · Links & chevrons
- .link hover = underline appears, NO color shift. Standalone links invert
  (underline only on hover).
- Chevrons: icon-font glyphs (SF Pro Icons PUA), positioned with .3em pads.
  STATIC — no chevron slide/bounce on hover anywhere. Restraint is the move.

## 3 · Global nav flyout (the best stagger recipe on the site)
- Curtain: rgba(232,232,237,.4) + blur(20px); opacity .32s
  cubic-bezier(.4,0,.6,1) with 80ms delay; visibility step-start/step-end.
- The bar's own blur TURNS OFF while a flyout is open (curtain owns it).
- Items: opacity 0 + translateY(-4px) → in, .32s same curve, delay =
  item×20ms + group×80ms. CLOSE is faster and reverse-cascaded:
  duration min(.16s + (total−item)×20ms, .24s), no delay.
- Escape hatch: a .globalnav-block-transitions class nukes all
  transitions during rapid state churn (prevents pile-up).
- Search field: keyframed in .24s (+.2s delay), y −4→0 + fade.

## 4 · Local nav (macbook-neo floating pill style)
- Driven by ONE JS-updated CSS var --progress (0→1), not a px threshold:
  border-radius calc(32px − 14px×(1−p)) (18→32), bg rgba(18,18,18,.8),
  blur(20px) ALWAYS on, ring = box-shadow 0 0 0 1px #282828 (hairline, not
  drop shadow). Transitions only while .animating-in/out: .4s ease-out.
- The Buy pill inside interpolates font 17→12px via the same var.

## 5 · Carousels & dots
- Track = native scroll-snap (x mandatory), browser does momentum/settle;
  scroll-behavior auto. No custom physics anywhere.
- Paddles: 36/56/90px circles, bg rgba(210,210,215,.64) → hover
  rgba(223,223,227,.7) → active rgba(193,193,198,.65); transitions 100ms
  LINEAR; disabled .42 (or 0 in hover-reveal galleries, where paddles fade
  in on gallery hover, 100ms).
- Dots: 8px, color instant-snaps (.42→.54 hover→.8 current alpha).
- Timed autoplay fill: pure CSS — .current::after animates width 0→115%
  over 6.25s LINEAR, gated by animation-play-state (running/paused toggled
  by ancestor .playing/.paused). No rAF. Chrome controls fade in late
  (740–940ms delays, 100–200ms durations).
- Play/pause: 36px circle; icon = mask-image SWAP (no morph);
  press = scale(.95) — THE ONLY press-scale in the entire system;
  bg transitions 100–250ms linear.

## 6 · Accordion (FAQ)
- Height: JS sets px from scrollHeight → CSS transition height .4s
  ease-in-out → swaps to auto on end. Multiple items may be open at once.
- Chevron: SMIL polyline morph (v → flat → ^), 320ms, two-segment spline
  keySplines .12,0,.38,0 / .2,1,.68,1 — the shape morphs, doesn't rotate.
- Icon hover color #86868b→#6e6e73, 100ms linear. Divider 1px #d2d2d7,
  none on first item. Q: 24px/600 Display; A: 17px/400 Text.
- Hit area extended past the visible row via an ::after overlay.

## 7 · Cards, tiles, surfaces
- DEFINITIVE: product/promo tiles have ZERO hover styles. No scale, no
  shadow, no border shift. All life lives in the inner CTA/link.
- Plan-card "flip" (apple-one) is NOT 3D: instant front/back content cut +
  a 300ms ease WAAPI background tint #fff→#e8e8ed. Back face is a
  role=dialog with its own close (minus-circle) button.
- One scroll-reveal variant found there: WAAPI y 148→0 + fade, 1000ms
  ease-in-out (bigger, slower travel than iphone's y30/750 — travel scales
  with card size).

## 8 · Selection & content-switch
- Tab pill: absolute .tabnav-indicator, left/width from CSS vars JS
  measures per tab; transition left/width .32s ease-out. Content behind a
  tab switch = the snap carousel scrolling, NOT a crossfade.
- Dropdowns: NATIVE select styled as a dark pill + overlaid CSS chevron.
- Footnotes = anchor links to a bottom list. Modals are reserved for
  video players only. No tooltips anywhere.
- Gradient headlines: static linear-gradient + background-clip:text;
  the reveal is just opacity .16s on an observer class.
- Footer links: 72%-black, underline on hover.

## 9 · Scroll & touch (third expedition)
- AUTOPLAY IN SITU (highlights gallery): 6.15s per card, CSS animation on
  the current dot's ::after (width 0→115%, linear, forwards), runs the set
  ONCE then hard-stops as "ended" (Replay button appears — no loop).
  Pause/resume is gated by SCROLL VISIBILITY (custom observer attribute
  system), not hover: scroll away = fill freezes mid-value, scroll back =
  resumes from the frozen width. Manual dot click = jump + suspend
  autoplay indefinitely. The play button after pause ADVANCES to the next
  card rather than resuming the frozen fill.
- PARALLAX: definitively NONE. Five large images sampled across 3000px of
  scroll — every Δtop exactly matched Δscroll (ratio 1.000). All media is
  plain document flow. "Cinematic" ≠ parallax at Apple.
- NAV LAYERS: the global bar is position:absolute — it scrolls away and
  never returns (no direction-aware logic). The product local nav is plain
  CSS sticky, no hide/show. Nobody watches scroll direction.
- ANCHORS: in-page anchor clicks are INSTANT native jumps (no eased
  smooth-scroll), with ~52px clearance via scroll-margin-top matching the
  sticky bar height.
- ★ CORRECTION (measured, supersedes apple-grammar.md §5's scrub note):
  iphone-17-pro has NO scroll-scrub and NO pinning ANYWHERE. Every media
  wrapper is position static/relative; five media elements tracked scroll
  1:1 across the full page. The "cinematic" sections are lazy-loaded
  (IntersectionObserver) muted autoplay videos in NORMAL FLOW plus
  self-contained widgets (drag-driven zoom fade-gallery, paddle-nav
  sliders, the sticky dot-nav card gallery). video.currentTime advanced
  with WALL-CLOCK time while scroll was frozen — proof of autoplay, not
  scrub. Rebuild rule: never build a pinned scrub stage; build lazy
  autoplay media + widgets with their own state machines.
- Gaps to re-verify later: the hero load sequences and the full mobile
  touch pass (hamburger, tap feedback) — blocked by tooling contention.

## EAS ADOPTION NOTES (the synthesis that matters)
1. Split our timing tokens: micro-feedback ≤100ms linear (or instant);
   structural .32–.45s on the two house eases. Kill .3s hovers.
2. Our nav capsule expand should adopt the 20ms/item + 80ms/group stagger
   and the faster reverse-cascade close.
3. FAQ accordions → the 400ms ease-in-out height recipe (and ScrollTrigger
   refresh stays, per our closer-jump fix).
4. Surfaces stop reacting to hover; interactive life concentrates in CTAs
   and captions. (Our mat-caption hover reveal survives — it's content, not
   decoration.)
5. Keep our signature micro moves (roll-links, fly-arrow) as BRAND accents
   but retime them to the bimodal law — instant-in, deliberate-move.
6. Autoplay/progress affordances = CSS animation-play-state gating, not JS
   loops, wherever possible.
