# iphone-17-pro — the north-star page, complete anatomy

Jake's favorite page on the web (declared 2026-07-15). Measured live that
day by three expeditions: composition/argument, media/widgets, animation.
Column tokens live in apple-grammar.md §9; timing law in
apple-micro-interactions.md §0. This file is the page itself — and the
lessons EAS takes from it.

## THE LESSONS FOR EAS (read this first)

1. **ONE ENTRANCE BEAT PER SECTION — and media counts as the beat.**
   (Corrected 2026-07-15 after Jake disputed the first "only titles
   animate" reading — an exhaustive transitionstart/WAAPI census proved
   him right, twice.) The page's entrance vocabulary, in full:
   - Chapter title pairs: a JS tween (invisible to CSS-transition
     instruments — computed duration 0s; inline styles driven by
     script): eyebrow then headline +155ms, opacity + y30, ~900ms,
     trigger ≈86% viewport. ~9 instances.
   - A second tween layer on ~1/3 of sections: the product-viewer
     canvas slides in (x120→0, 0.7s), diagram start/endframe
     crossfades (0.2–0.4s), compare-section spec fade-ins, and a
     23-link staggered footer-index reveal. ≈50 elements total
     page-wide.
   - The BIGGEST perceptual layer (Jake's own diagnosis): 17 play-once
     videos that START as they enter. Media beginning to move IS the
     entrance — no tween needed, and it reads as more alive than any
     fade-up because the motion is content, not choreography.
   - Body copy and most spec/stat blocks: genuinely static, always.
   THE LAW: every section announces itself with exactly ONE motion
   event on entry — a title tween, OR its media starting, OR one
   crossfade — then goes completely still. Never everything-fades-up,
   never nothing. EAS application: sections that carry a live demo
   don't also need revealUp on their children (the demo starting is
   the entrance); text-only sections get the title tween. One beat,
   then stillness.
2. **Price lives in the hero.** "From $1099 or $45.79/mo." sits beside
   the Buy button 0.7 viewports in. Nothing is withheld. (EAS candidate:
   the from-price under the hero ask.)
3. **Spend viewports where the differentiation lives.** Cameras get 10.1
   viewports — 26% of the page for the one thing that sells the Pro. Our
   equivalent is proof/results: the argument deserves its longest chapter
   where we're most different.
4. **Objections are fused into claims, not quarantined.** Battery anxiety
   is answered INSIDE the performance chapter, in the same breath as the
   power claim. Durability inside design. Only the FAQ (14 items, light
   chapter) is a catch-all.
5. **One accent, one meaning.** Orange appears exactly 5 times — only as
   the chapter eyebrow ("a new chapter begins"). All other color is
   functional link-blue. Color that means something beats color that
   decorates.
6. **Two buy buttons in 38 viewports** (hero + comparison grid) plus the
   persistent localnav Buy. Everything else re-asks as quiet links. We
   already match this — keep matching it.
7. **Text NEVER overlays media.** Zero scrims/gradient-protection found —
   legibility by layout separation, captions on their own surface. We
   mostly match; never regress into hero-text-over-image.
8. **Claim as poetry, spec as sublabel.** ~8 poetic 80px claims carry 30+
   facts demoted to 17–21px. Puns do the charm ("Makes a strong case for
   itself"), numbers do the proof.
9. **Motion for drama, stills for information** — a clean split. Camera
   PROOF is entirely still photography (the zoom gallery: 8 focal-length
   tabs, all photos); video is reserved for demonstration/drama. And
   demo videos play ONCE and end on a designed endframe — no loops.

## The spine (18 sections; dark chapter 70%, light 30%, ONE flip)

1. Hero — name (34px only; the imagery is the wordmark) + PRICE + Buy.
2. "Get the highlights." — a bento TABLE OF CONTENTS of the pitch: six
   tiles (Design/Chip/Camera/Center Stage/iOS/AI), each a jump link,
   plus the autoplay card carousel (5.7s dwell, 750-800ms eased advance,
   6.15s linear dot-fill; pause = permanent user override).
3. Design — eyebrow + 80px pun + image. 4. 360° product viewer + color
   picker ("touch the object" before any spec deep-dive; the materials
   scene is real WebGL — glb/ktx2/hdr — with video fallback).
5. CAMERAS — 10.1 viewports, six sub-beats: intro → zoom gallery (8
   still-photo tabs, JS fade-in-over-static ~450ms cubic ease-in,
   autoplays through focal lengths) → lens explainer → sample-photo
   swipe strip (the proof moment: 5 large labeled stills) → features →
   pro video (largest type on page: "Any more pro and it would need an
   agent.").
6. Performance + battery reassurance fused. 7. Ecosystem (iOS/AI/
   safety). 8. Trade-in objection — interactive delta picker (native
   select, hard content swap, no animation), placed as the HINGE at the
   dark run's end. 9. Accessories coda.
   — FLIP TO LIGHT (product → transaction) —
10. "Why Apple is the best place to buy" (logistics reassurance).
11. Model comparison (second Buy). 12-13. Environment/values.
14. FAQ accordion (14 objections). 15-17. Index, legal, footer.

## The mechanics worth stealing verbatim

- Entrance recipe (the ONLY one): trigger ≈86% viewport, eyebrow at 0ms,
  headline at +155ms (transition-delay, one observer), opacity 0→1 +
  translateY(30→0), ~900ms, ease-in-out.
- Localnav: translateY(-72px → 0), 230ms ease, transform only, after
  ~700px scroll. Buy button never changes state.
- Zoom-gallery crossfade: incoming layer z2 opacity 0→1 over ~450ms
  cubic ease-in OVER a static outgoing layer (half the work of a true
  crossfade, reads identically).
- Color picker & compare tool: HARD SWAPS (display none/block), zero
  animation — decisions are instant, spectacle is eased.
- Video governance: data-keyframe load/play windows (≈±100vh), range
  requests, start/end-frame JPGs instead of posters, 4 of 17 videos
  loaded pre-scroll, unload-after-play on the hero.
- Interactive budget: THREE widgets total (viewer, compare picker, FAQ)
  on 38 viewports. Spectacle is passive; interaction is reserved for
  genuine decisions (which color, which old phone, which question).

## Copy register (verbatim samples)

"Unibody enclosure. Makes a strong case for itself." · "A big zoom
forward." · "It's a total frame changer." · "Any more pro and it would
need an agent." · "New dimensions in power." · "Worth the upgrade?
100 percent." — 3-tier type: 80px chapter claim / 56px section head /
24px orange eyebrow. Rhetorical question + numeric answer for the
objection section.
