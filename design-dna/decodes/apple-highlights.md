# Decode — apple.com/iphone-18-pro · "Get the highlights." media card gallery

URL: https://www.apple.com/iphone-18-pro/ (section `#highlights`, `data-media-card-gallery` component, internally Apple's "All Access Pass" / `MediaCardGallery`)
Viewport: 1440×736 (primary), 390×844 mobile check
Date: 2026-09-18

Reached via https://www.apple.com/iphone/ → newest product link `/iphone-18-pro/` (also present on the hub: `/iphone-air/`, `/iphone-17/`, `/iphone-17e/`, `/iphone-duo/` — 18 Pro is the current flagship).

---

## 0. COMPONENT IDENTIFICATION

- Section: `<section id="highlights" class="section section-highlights theme-dark background-alt">`, `data-component-list="MediaCardGallery"` / `[data-media-card-gallery]` attribute selector used throughout Apple's own CSS.
- This is a first-party Apple component (not GSAP/Framer/Webflow) — no `window.gsap`, no scroll library; the html element carries `no-reduced-motion` / `reduced-motion` toggle classes Apple's own bootstrap JS sets from `matchMedia`, confirming a bespoke reduced-motion gate independent of Chrome's default (see §9).
- Card-advance is **native `scrollLeft` on a real `overflow-x:scroll` element**, not a CSS transform and not a scroll-linked (scrubbed) effect. `cardSet.style.transform` and `.gallery-item` `transform` are `none` at every rest and every mid-transition sample; only `scrollLeft` and the caption's own `transform`/`opacity` change (§4).
- `overflow-x:scroll; overflow-y:hidden; scroll-snap-type:x mandatory` on `.gallery.media-gallery.scroll-container` — a scroll-snap carousel driven programmatically (dots/keyboard/autoplay write `scrollLeft` via an eased JS tween; see §4), not by direct user scrolling (§7 confirms wheel/vertical-scroll do not move it under synthetic input).

## 1. LAYOUT (1440×736)

- Section: `padding-top: 144px`, `background-color: rgb(29, 29, 31)`.
- **Header** (`.section-header.row`, `display:flex; justify-content:space-between`), width 1260px at x=90 (same 1260px column + 90px side-inset as the gallery track below — one shared column system):
  - H2 "Get the highlights.": `font-size:48px; font-weight:600; letter-spacing:-0.144px; line-height:52.0077px; color:rgb(245,245,247); text-align:start`. Rect 630×52 at (90,144). No kicker/eyebrow above it.
  - CTA "Watch the film" (single link, right-aligned by the flex `space-between`): `font-size:17px; font-weight:400; color:rgb(41,151,255)` (Apple blue), links to an **HLS stream** (`.../films/product/iphone-18-pro-product-tpl-us-2026_16x9.m3u8`) — a *different* asset/format than the per-card `.mp4`s in the gallery itself.
  - Gap from bottom of header row to top of gallery wrapper: **48px**.
- **Gallery track**: `.gallery.media-gallery.scroll-container` = full section width (x=0, w=1440). Inside it, `.card-set.grid.card-set-full-bleed.item-container` (a `<ul>`, `display:grid; grid-template-columns: repeat(5, 1260px); gap:20px`), 5 `<li class="gallery-item">` children, each holding one `.card.tile.tile-rounded` ("the well": `overflow:clip; border-radius:28px`).
- **Card (well)**: **1260×612px, aspect ratio 2.0588:1 (1260:612)**. Video/image assets are **pre-sized exactly 1260×612** to match (confirmed via `video.videoWidth/videoHeight` and `img.naturalWidth/Height`) — **zero surplus/crop**; `object-fit:contain` on the `<video>` never actually letterboxes because source and box share the exact aspect ratio.
- **Active-card position**: centered, left edge x=90, right edge x=1350 → **90px margin each side** of the 1440 viewport ((1440−1260)/2). Previous/next cards peek **70px each side** (90px margin − 20px grid gap = 70px of the neighbor card visible).
- **Inactive cards**: `opacity:1`, `filter:none`, `transform:none` at every sample — **no dimming, no scale, no blur** on peeking or off-screen cards. Cards ≥2 slots from current additionally get an `out-of-view` class whose only measured effect is collapsing the inner `.card.tile` to `0×0` (stops rendering/decoding cost) — visually irrelevant since they're already off-screen.
- **Caption**: `.caption-animation-container.pin-offset` > `p.caption.typography-media-card-gallery-headline`. Caption text: `font-size:28px; font-weight:600; color:rgba(255,255,255,0.92)`. Positioned **48px below the card's top edge**, horizontally centered on the card (e.g. for a 2-line caption: 338px empty margin each side of a 584px-wide text block on the 1260px card). No gradient/veil behind it — plain text over the media.
- **Pager**: `.dotnav-items` (`<ul>`, `role="tablist"` implied by children), 5 `.dotnav-item` (`<li role="presentation">` → `<a role="tab" aria-selected>`). Inactive dot: **8×8px circle**, `border-radius:10px`, `background:rgba(255,255,255,0.36)`, 24px center-to-center spacing. **Active dot becomes a 48×8px pill** (same 8px height, same base `rgba(255,255,255,0.36)` track) — see §5 for the progress-fill mechanic. Dotnav rect at 1440: x=604–764 (160×24), vertically at y=664 (32px below the card).
- **Play/pause button**: `.play-pause-button`, **56×56px**, positioned to the right of the dotnav row (x=796, y=648). Contains 3 stacked SVG icon states (`play-icon`/`pause-icon`/`replay-icon`) toggled via classes, plus `aria-label` swaps between "Play Highlights Gallery" / "Pause Highlights Gallery" / "Replay Highlights Gallery".
- **No arrows exist** — DOM search for `[class*="arrow"]`, `[class*="chevron"]`, `[class*="prev"]`, `[class*="next"]` inside the section returns nothing beyond the dotnav/play-pause controls.

## 2. THE MOVE (one dot-triggered advance)

Triggered by clicking a dot's `<a>` (e.g. `#highlights gallery-item-4-trigger`), sampled every rAF via `requestAnimationFrame` loop reading `scroller.scrollLeft` and `getBoundingClientRect()`.

- **Element that moves**: `scrollLeft` on `.gallery.media-gallery.scroll-container` (a real scroll offset, not a transform). `cardSetCss.transform` and every `.gallery-item`'s own `transform` stay `"none"` at all times — the browser's native scrolling-content compositing does the visual sliding, GSAP/CSS-transform is not involved.
- **From → to**: one step = exactly **1280px** of `scrollLeft` (= 1260px card + 20px gap). Confirmed identically for single-dot-step and multi-step jumps (a 2-slide jump = 2560px, same curve/duration family, scaled).
- **Duration**: **~1000ms** (three independent trials: 1008.7ms, 1014.2ms, 1008.3ms cutoff-to-settle).
- **Curve**: fit against 10 interior samples at x=0.1, 0.2, 0.3, 0.4, 0.5(×3 trials), 0.6, 0.7, 0.8, 0.9 (x = t/duration, y = scrollLeft progress 0→1). Measured y at x=0.25 ≈ **0.123**, x=0.5 ≈ **0.493–0.503**, x=0.75 ≈ **0.867**. This matches **`cubic-bezier(0.42, 0, 0.58, 1)`** (CSS `ease-in-out` keyword) within ~1% at all three interior points (reference curve: y(0.25)=0.128, y(0.5)=0.5, y(0.75)=0.872) — noticeably better fit than a plain quadratic `power2.inOut` at the same points. Peak instantaneous rate (~x=0.5) ≈ 2680px/s vs the 1269px/s average (≈2.1× average at the steepest point).
- **Damping**: **none — a deterministic eased tween**, not a lerp/chase. Values hit the exact target (e.g. `scrollLeft: 3840` and `itemX: 90` precisely) at the duration cutoff and stay bit-identical afterward; there is no asymptotic decay tail like the cosmos-works scale-settle.
- **Caption cross-fade/slide (a second, layered animation on the SAME progress driver)**: `.caption-animation-container` — incoming caption `transform: translateX(162px→0)` + `opacity: 0→1`; outgoing caption mirrors it, `translateX(0→-162px)` + `opacity: 1→0`. Both run for the identical ~1000ms window and settle in the same frame the card-slide settles.
  - translateX follows the **same ease-in-out(t)** progress as the scrollLeft move (q(t) matches p(t) from the card-slide within ~1%).
  - **Opacity is NOT linear in that same progress — it's the progress cubed**: incoming `opacity ≈ q(t)³`, outgoing `opacity ≈ (1−q(t))³` (verified: at q=0.3445, measured opacity 0.0409 vs q³=0.0410; at q=0.7954, measured 0.503 vs q³=0.503; at q=0.9242, measured 0.7894 vs q³=0.7896). Net effect: caption stays nearly invisible for the first ~30% of the move, then snaps up through the back half — a much harder "ease-in" fade than the position slide.
  - The inner `<p class="caption">` itself never has its own transform/opacity change — only the wrapping `.caption-animation-container` animates.
- **Video-start timing relative to the move**: on a fresh (never-played) card, its `<video>` goes from `paused:true,time:0` to `paused:false,time:0` at **~505–509ms** into the ~1000ms transition, in two independent trials (509.4ms and between 482.7–509.3ms) — i.e. very close to both the temporal midpoint AND the point where the incoming card crosses roughly **50% visible** in the viewport (computed from its rect at that timestamp: ~50.9–55.8% of the 1260px card width inside the 1440px viewport). Cannot fully disambiguate "50% of duration" vs "50% visible" as the trigger condition from these two correlated signals — flagged, not guessed.

## 3. VIDEO BEHAVIOR

- Each card's `<video>`: single `<source type="video/mp4; codecs=&quot;avc1.640034&quot;">` (no HLS/webm variant found per-card — HLS is reserved for the header's "Watch the film" link only). `preload="none"`, `muted`, `playsinline`, **no `autoplay` attribute** (play is JS-driven via `.play()`), `loop` = false. Intrinsic size exactly 1260×612 (matches the well 1:1, see §1).
- **Per-card durations differ**: main-camera 2.467s, chip 5.0s (others not individually timed but same pattern).
- **On becoming current**: a never-played card's video starts from `currentTime:0`. A card that was already played through **does NOT restart from 0** when re-navigated to (manually, via dot) — it stays paused at wherever it stopped (observed: chip video held at `paused:true, time:5 (=duration)` across 2.1s of repeated polling after navigating back to it) — re-arriving at an already-`ended` card does not replay it automatically.
- **End-of-video state**: after a video plays through, Apple crossfades to a separate **end-frame `<picture class="…-endframe pin-offset end-frame pos">` element** (confirmed via `elementFromPoint` on the current/colors card hitting `<img>` inside `picture.overview-highlights-colors-endframe`, nested in a `.media-block` that had gained `loaded has-played ended` classes) — not simply "video paused on its last frame."
- **Auto-advance**: driven by the video's native `ended` event **while the gallery's own play/pause state is "playing."**
  - When play/pause is in its **paused** state (aria-label = "Play Highlights Gallery"), a video reaching `ended:true` does **not** trigger an advance — confirmed idle for 2+ seconds post-`ended` with no state change.
  - Clicking play/pause to resume triggers the pending advance almost immediately (~1000ms later = just the transition duration) if the current video had already ended.
  - Manually clicking a dot mid-cycle leaves the gallery in the **paused** autoplay state afterward (observed aria-label flips to "Play Highlights Gallery" after a manual dot click) — manual navigation implicitly pauses the auto-cycle.
  - **The last card (Siri, index 4) has no `<video>` element at all** (static image only) and the gallery does **not** auto-advance away from it and does **not** loop back to card 0 — confirmed idle for 9s with autoplay "on." The cycle is `ended`-event-driven only; a slide with no video has nothing to fire that event, so it's a dead end for autoplay (manual dot/keyboard nav still works from there).
  - A full natural cycle observed: chip card (5s video) held current for ~5.87s before auto-advancing (video duration + small buffering/start latency), consistent with "ends → advance" and no extra fixed dwell.

## 4. INTERACTION

- **Dots**: click the `<a role="tab">` inside a `.dotnav-item` — confirmed working, drives the eased `scrollLeft` tween in §2.
- **Keyboard**: focusing the current tab's `<a>` and dispatching `ArrowRight` **advances the gallery AND moves DOM focus to the next tab's anchor** in the same step — standard ARIA `role=tab`/roving-tabindex pattern (`aria-selected` flips accordingly). Confirmed working via synthetic (non-trusted) `KeyboardEvent`.
- **Play/pause button**: toggles autoplay only (label cycles Play/Pause/Replay); does not itself change the current slide except to resume a pending auto-advance (§3).
- **Peeking/adjacent cards are NOT clickable** — every non-current `.gallery-item` carries **`inert` + `aria-hidden="true"` + `tabindex="-1"`**. `inert` removes the entire subtree from hit-testing, focus, and text selection while leaving its layout geometry intact — confirmed via `elementFromPoint()` at coordinates squarely inside a peeking card's visible sliver resolving to the parent `<ul class="card-set">` instead of the card, at every tested point, while the SAME technique correctly resolves down to an `<img>` for the current (non-inert) card.
- **Wheel** (`WheelEvent{deltaX:200}` dispatched on the scroll container) and **drag** (synthetic `pointerdown`/`pointermove`/`pointerup` sequence over the current card) both produced **no change** in `scrollLeft` — inconclusive rather than a confirmed "no": both native horizontal-scroll-by-wheel and native click-drag-to-scroll typically require OS-trusted input events that a page-level `dispatchEvent` cannot fully emulate, so this doesn't rule out real trackpad/touch gestures working. Flagged as a gap, not guessed.
- **Vertical page scroll**: confirmed **zero effect** — scrolled the page down 400px and back with autoplay paused; `scrollLeft` and the `current` index were bit-identical before/after. The gallery is not scroll-linked to page position at all (matches §0).

## 5. PAGER PROGRESS DETAIL

- The "pill" the current dot becomes (48×8px) is **not just a static wider dot** — it's a two-layer progress bar:
  - `::before` on the current `<a>`: 48×8px, `background:transparent` — the pill's outer track shape.
  - `::after` on the current `<a>`: **same 8px height, width animates 0→48px, `background:rgb(245,245,247)`** (Apple off-white) — the actual fill, growing in sync with the current video's `currentTime/duration` (sampled mid-playback at 7.2/48px ≈ 15% fill, plausible for that point in the clip). This is a literal Stories-style per-slide progress indicator, not a decorative pill.
  - Inactive dots: plain 8×8 circle, `background:rgba(255,255,255,0.36)`, `border-radius:10px`, `transition: background-color 0.25s linear` (only property with an authored CSS transition anywhere in this component).

## 6. COMPOSITING HINTS

- **No `will-change` anywhere in the component** — not on the scroll container, the card-set grid, any `.gallery-item`, `.card.tile`, or `<video>` (all compute to `auto`). The horizontal slide relies on the browser's own compositing of a native scrolling element, which doesn't need the hint.
- `contain: none` and `backface-visibility: visible` (default) everywhere tested.
- `transform-style`/3D properties not applied to this component (unlike cosmos.studio's Webflow IX2 boilerplate).
- Per the grow-effects-raster lesson: the only animated properties are `scrollLeft` (native, GPU-composited scroll) and the caption's `transform`(translateX)/`opacity` — no `clip-path`, `inset`, `width`/`height`, or `top`/`left` animation anywhere, so nothing in this component re-rasterizes per frame.

## 7. ENTRANCE ON SCROLL

- Section carries `staggered-start`/`staggered-end` classes and `data-staggered-item` attributes on the H2 and the CTA `<li>`, implying a scroll-triggered stagger-in exists in principle, but at the point this was checked the section was already past its entrance (arrived at via `scrollIntoView` rather than a slow scroll), so **no from→to numbers were captured for the header's own entrance**. This is a gap — re-decode by scrolling in 60px increments from ~400px above the section if the header entrance itself becomes relevant to a build.
- No entrance animation exists on the gallery cards themselves distinct from the click/autoplay-triggered slide in §2 — cards don't fade or rise into place independent of navigation.

## 8. MOBILE (390×844)

- Header: H2 drops to **32px**, left-aligned at x=24.4 (not centered), width 341.3px.
- Gallery track: `.gallery.media-gallery.scroll-container` still full-width (390px), `overflow-x:scroll; scroll-snap-type:x mandatory` — same native-scroll mechanism as desktop, not swapped for a different pattern.
- Card: **321.3×480px**, aspect ratio **0.669 (≈2:3, portrait)** — a different aspect ratio than desktop's 3:2 landscape well, not just a uniform rescale. Grid gap still 20px (spacing between card left-edges = 341.3 = 321.3+20).
- **Active card is NOT centered** — left edge flush at x=24.4 (same as the page's own side gutter), right edge at 345.7. This makes the peek **asymmetric**: previous card's sliver is only ~4.4px (almost fully hidden), next card peeks **24.4px** (matches the page gutter exactly) on the right.
- Videos still autoplay muted via the same JS `.play()` mechanism (`autoplay` attribute still `false` on the element; confirmed a fresh card's video reaches `paused:false, time:0.7` ~1.2s after a dot click).
- Pager: same mechanism, dots 8×8 at y=750, active pill ~31.9×8 (narrower than desktop's 48px), positioned left of a 56×56 play/pause button at x=263.
- `out-of-view` class still applied to items ≥2 away from current, same 0×0 card-collapse effect.

## 9. REDUCED MOTION

- Apple's own bootstrap toggles an `html.reduced-motion` / `html.no-reduced-motion` class pair from `matchMedia('(prefers-reduced-motion: reduce)')` — **not** relying on `@media (prefers-reduced-motion)` CSS blocks for this component. Default state observed: `no-reduced-motion` (`matchMedia(...).matches === false`).
- Found and **verified live** (by manually toggling `document.documentElement.classList` to add `reduced-motion` — the site's own CSS is a plain class selector, so this reproduces the real effect without needing OS-level `prefers-reduced-motion` emulation, which this session's `emulate()` tool does not expose):
  - `html.reduced-motion [data-media-card-gallery] .media-gallery .caption-animation-container, ….footer-container { transform: none; opacity: 1; }` — **disables the caption slide+fade entirely**; captions simply appear at full opacity/no offset. Confirmed by sampling the caption's computed style through a full transition with the class forced on: `transform:none; opacity:1` at every one of ~75 rAF samples across 600ms.
  - `html.safari.reduced-motion […] picture.positioned-media-element { z-index: unset; }` — a Safari-only stacking fix for the end-frame crossfade picture, not reproduced/tested (Chrome-only session).
- **The card-slide (`scrollLeft` tween, §2) itself has no reduced-motion override** — it is not mentioned in any `reduced-motion`-scoped rule found across all stylesheets, so the ~1000ms eased position transition is expected to keep running unchanged even with reduced motion active; only the caption cross-fade layer is neutralized.

## 10. FRAMES

- `design-dna/frames/decodes/apple-highlights/rest-centered.jpeg` — at rest, autoplay paused, "battery" card centered/active, dots + play button visible in their default state.
- `design-dna/frames/decodes/apple-highlights/mid-advance.jpeg` — captured ~26% into a 2-slide advance (battery→chip) using a `Performance.prototype.now` clock-slow patch (3% real speed) to make the mid-transition state reachable across a screenshot round-trip; shows the outgoing "battery" caption/card sharing the frame with the incoming "chip" card's video mid-slide, and the dot pager mid-transit between two tab positions.
