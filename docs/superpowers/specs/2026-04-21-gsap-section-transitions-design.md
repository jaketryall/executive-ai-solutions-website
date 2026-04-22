# GSAP Section Transitions — "The Studio Notebook"

**Date**: 2026-04-21
**Branch**: `redesign/hero-v2`
**Status**: Design — pending user review before implementation plan

---

## Problem

The homepage has six vertically stacked cream sections (Hero → Work → Capabilities → Manifesto → Testimonials → Contact → Footer). They currently transition via a CSS `background-color` lerp in `components/homepage/ScrollBackground.tsx`. The result is visually monotone; the sections don't feel connected and the page reads as "scroll past generic portfolio blocks" rather than an authored experience.

The one exception — and the reason this spec exists — is the hero's video-to-fan morph ([Hero.tsx:659-762](components/Hero.tsx#L659-L762)), where the hero video card shrinks and "fans out" into four project cards. The user loves this moment. It is the only section on the site that currently feels *alive*.

## Goal

Bring that same metamorphic quality to every seam in the homepage. Each section should *become* the next — content from section N should visually transform into the opening of section N+1 — so the user feels they're watching a studio assemble itself around them rather than scrolling past discrete blocks.

**Quality bar**: Awwwards-level. Uniqueness and craft matter; the transitions must never distract from the content's purpose (lead capture for Jake's freelance practice).

## Non-goals

- Replacing the existing hero video-to-fan morph. It stays as-is and becomes seam 0.
- Adding transitions to inner pages (`/work`, `/about`, `/contact`, `/services/*`). This spec scopes to the homepage only.
- Mobile parity for every seam. Mobile already renders different components (see `MobileWork`, `MobileContact`). Mobile transitions follow a simpler fade-up pattern; this spec covers desktop only, with an explicit reduced-motion fallback.
- Replacing `ScrollBackground`. It continues to handle base color transitions between sections; our new morphs layer on top.

---

## Concept

**"The Studio Notebook."** The page feels like a portfolio being authored in real time. Every section transition is a custom metamorphosis: objects from one section physically transform into objects of the next. Threaded through all of it is a single protagonist — **Jake's signature** (`components/homepage/Signature.tsx`) — which persists as a small floating mark and changes function at each seam: it draws itself, it sprouts the testimonial cards, it floods ink into the Contact section, it signs the form.

One element. Six functions. The signature is the conceptual through-line so five bespoke morphs don't feel like five unrelated tricks.

---

## Architecture

### Existing foundation (do not change)

- **GSAP setup**: [lib/gsap-setup.ts](lib/gsap-setup.ts) already registers `ScrollTrigger, SplitText, CustomEase, DrawSVGPlugin, Flip, MotionPathPlugin` with two custom eases (`appleOut`, `appleSnap`). All seams below use this module directly.
- **Section ordering**: [app/page.tsx](app/page.tsx) renders `Hero → Work → Capabilities → Manifesto → Testimonials → Contact → Footer`. On desktop, `Work` is absorbed into `Hero` (mobile-only component). Effective desktop order is Hero → Capabilities → Manifesto → Testimonials → Contact → Footer.
- **Background lerp**: [components/homepage/ScrollBackground.tsx](components/homepage/ScrollBackground.tsx) watches `[data-bg]` attributes and lerps base bg color. New seams coordinate with this — each seam's dark/cream state matches its host section's `data-bg`.
- **Reduced motion**: `prefersReducedMotion()` in `lib/microInteractions.ts` gates all animations. Every new seam must respect this.

### New module structure

```
components/homepage/
  transitions/
    SignatureProtagonist.tsx        // The threading element — persists across all sections
    Seam1_CardsToColumns.tsx         // Hero fan → Capabilities columns
    Seam2_ShatterToMantra.tsx        // Capabilities → Manifesto
    Seam3_SignatureSprouts.tsx       // Manifesto → Testimonials
    Seam4_InkFlood.tsx               // Testimonials → Contact (cream → dark)
    Seam5_SendToSign.tsx             // Contact → Footer
    _shared/
      useSeamTimeline.ts             // Shared hook: creates a ScrollTrigger-scrubbed GSAP timeline scoped to two sibling sections
      types.ts                       // SeamProps, SeamState
```

Each seam is a **standalone component** rendered by its owning section pair. Seams do not share state. Each seam owns its own `gsap.context()` and cleans up via `ctx.revert()`.

The `SignatureProtagonist` is a single fixed-position SVG rendered once at the top of `app/page.tsx`. It listens to `ScrollTrigger` events from each seam and adopts the right pose/position/opacity at each scroll beat. It is the only component with global state.

### Integration points

- **Hero** already ends with fan cards. Seam 1 wraps those cards as input to the morph.
- **Capabilities**, **Manifesto**, **Testimonials**, **Contact**, **Footer** each gain a `data-seam-enter` and `data-seam-exit` attribute on their root element so seams can query anchor points without prop-drilling.
- **Signature component** gains an imperative API (via `forwardRef`) so `SignatureProtagonist` can morph its path, position, and scale at each seam.

---

## The six seams (spec)

### Seam 0 — Hero video → fan cards *(existing, no change)*
Keep [Hero.tsx:659-762](components/Hero.tsx#L659-L762) exactly as-is. Referenced here for completeness as the pattern template.

---

### Seam 1 — Hero fan → Capabilities columns

**Scroll trigger**: `start: "top top", end: "bottom top"` on a 50vh spacer between Hero's final scroll state and Capabilities' top.

**Timeline** (scrubbed):
1. **0.0–0.2**: The 4 fan cards lose their fan rotation (rotation → 0), stay in place.
2. **0.2–0.4**: Card 4 slides behind card 3 (x/y interpolation + z-index flip). Now 3 cards visible.
3. **0.4–0.6**: Remaining 3 cards Flip: portrait → tall vertical rectangles the height of the Capabilities section. Use `Flip.from()` capturing first state from fan position, second state from positioned "divider" rectangles that frame each of the 3 capability columns.
4. **0.4–0.6** (simultaneous): Inner card image zooms out (scale 1 → 2.5) with opacity fade (1 → 0.12), becoming a background texture ghost inside each divider rectangle.
5. **0.6–0.8**: Capabilities header ("Three things I ship for clients") reveals via SplitText mask.
6. **0.6–1.0**: The "Recent Projects" label's chars fly into position to become the "What I do" kicker chars. Leftover chars fade.

**Key APIs**: `Flip.from()`, `SplitText.create(el, { type: "chars", mask: "chars" })`, `gsap.to()` with `scrollTrigger.scrub`.

**Failure mode**: If any card is not yet in the DOM at pin time (dynamic imports), the Flip state capture fails silently and the cards snap. We mitigate with a `ScrollTrigger.refresh()` call after `Capabilities` lazy-loads.

---

### Seam 2 — Capabilities → Manifesto

**Scroll trigger**: `start: "bottom 60%", end: "bottom top"` on Capabilities.

**Timeline** (scrubbed):
1. **0.0–0.3**: The three capability chapter kickers ("Conversion Websites", "AI Automations", "Custom Software" — rendered in `ChapterMark` siblings in [Capabilities.tsx](components/homepage/Capabilities.tsx)) split into chars via SplitText.
2. **0.3–0.6**: Each char tweens along a `MotionPath` arc toward its target letter slot in "I don't ship pretty." Chars whose letter appears in the mantra land; other chars fade mid-arc.
3. **0.6–0.8**: Unused chars complete the mantra text via SplitText mask reveal on the gap-filling letters.
4. **0.8–0.95**: The cyan accent (`#4cd3f5`) from Capabilities' "earns" word (`ACCENT` constant at [Capabilities.tsx:14](components/homepage/Capabilities.tsx#L14)) drains downward as a DrawSVG line and becomes the strikethrough on "pretty" — visual rhyme with the hero's `beautiful → converting` line.
5. **0.95–1.0**: "I ship results" rises from below via SplitText chars + mask (identical technique to `HeroCorrectionText`).

**Key APIs**: `SplitText.create(el, { type: "chars" })`, `MotionPath.convertToPath()`, `DrawSVGPlugin`, chained `gsap.timeline()` with labeled beats.

**Risk**: Arcing char trajectories require pre-computed motion paths per character, which depend on final layout positions. We compute these at `ScrollTrigger.refresh` time (post-layout, pre-scroll).

---

### Seam 3 — Manifesto → Testimonials

**Scroll trigger**: `start: "bottom 70%", end: "bottom -10%"` on Manifesto.

**Timeline** (scrubbed):
1. **0.0–0.2**: Signature (currently rendered at bottom-right of Manifesto body) receives a *new DrawSVG path extension*. The existing signature path ends at ~`x=95, y=14`; we append an extension path that travels downward and splits into three branches via MotionPath.
2. **0.2–0.5**: The extension draws (DrawSVG `0% → 100%`). Branches split at a Y offset corresponding to a point halfway between Manifesto's bottom and Testimonials' top.
3. **0.5–0.8**: At each branch tip, a proof card appears via `Flip.from()`. First state: scale 0, opacity 0, positioned at the branch tip. Second state: final card layout position.
4. **0.8–1.0**: Card content (metrics, quote, name) reveal via SplitText stagger inside each card.
5. **Post-seam**: The branch lines remain visible at low opacity (0.1) through Testimonials, as decorative connective tissue, then fade during Seam 4.

**Key APIs**: `DrawSVGPlugin`, `MotionPath`, `Flip.from()`, nested `gsap.timeline()`.

**Risk**: The signature path is currently 100×40 viewBox; extending it out of those bounds requires making the SignatureProtagonist a full-viewport-sized SVG so branches have room to travel. Addressed by `SignatureProtagonist` being a separate fixed-layer component from the original inline `Signature.tsx`.

---

### Seam 4 — Testimonials → Contact *(the showstopper, cream → dark)*

**Scroll trigger**: `start: "bottom 80%", end: "bottom top"` on Testimonials.

This is the single biggest contrast moment on the site. The cream→dark transition currently handled by `ScrollBackground` lerp becomes a real theatrical event.

**Timeline** (scrubbed):
1. **0.0–0.15**: The three proof cards compress vertically (scaleY 1 → 0.6) and skew slightly (skewX 0 → -4). Reads as "ink being pressed out of them."
2. **0.15–0.45**: An organic ink mask sweeps up from the bottom of the viewport. Implemented as an animated `clip-path: polygon()` with 12 vertices whose Y positions wobble ±20px via sine offsets (computed with `gsap.utils.mapRange`). Fill color: `#0a0908` (matches Contact's dark base).
3. **0.3–0.5** (overlap): The cream "paper" edge curls at the bottom of the viewport. Implemented with CSS `transform: perspective(800px) rotateX(Xdeg)` on a fixed-position cream overlay, tied to scroll progress. `rotateX` goes from 0° to 45°, revealing the dark underneath. Subtle paper-edge shadow via `box-shadow: 0 -30px 60px rgba(0,0,0,0.4)`.
4. **0.45–0.7**: Form field underlines draw themselves via `DrawSVGPlugin`. Each underline is an SVG line that was always in the DOM; we just animate its `drawSVG` from `0% 0%` to `0% 100%`.
5. **0.7–0.9**: Form field labels type themselves in via SplitText + `stagger: 0.03`.
6. **0.9–1.0**: Signature (via `SignatureProtagonist`) migrates to the bottom-right of the form and redraws in cream on dark.

**CSS/layout considerations**:
- The curling cream layer must be `position: fixed` during seam 4 only, then unpin after. Use GSAP `pin: true` on `ScrollTrigger` with `pinSpacing: false`.
- The ink-flood clip-path runs on a dedicated layer behind the form, above the cream.
- Avoid animating `height` or `width`; transform-only via `scaleY` and `clip-path` keeps it 60fps.

**Key APIs**: animated `clip-path` via GSAP (it's tweenable as a string-interpolated property), CSS `perspective` + `rotateX`, `DrawSVGPlugin`, `SplitText`, `ScrollTrigger` with `pin`.

**Risk** (highest of any seam): clip-path animation on large viewports can thrash layout. Mitigation: use a raster-backed element (`will-change: transform, clip-path`), test on mid-range hardware, and provide a reduced-motion fallback that is a clean 400ms background-color crossfade.

---

### Seam 5 — Contact → Footer

**Scroll trigger**: `start: "bottom 80%", end: "bottom top"` on Contact.

**Timeline** (scrubbed):
1. **0.0–0.4**: Submit button's arrow launches upward along a `MotionPath` arc (curves right then left, like a paper plane trail). Leave a DrawSVG trail path that draws in its wake.
2. **0.4–0.6**: Form fields fold downward — each field's Y pos + scaleY → 0 in sequence via stagger. Reads like origami closing.
3. **0.6–0.9**: The launched arrow reaches the Footer's JR mark position and `Flip.from()` transforms into the mark itself.
4. **0.9–1.0**: Footer columns reveal via fade-up stagger.

**Key APIs**: `MotionPath`, `DrawSVGPlugin`, `Flip.from()`, stagger.

**Risk**: Low. Both sections already dark; no contrast moment to nail.

---

## The protagonist: SignatureProtagonist

A single fixed-position SVG that persists across all sections. Not rendered inside any section — rendered once at the top level of `app/page.tsx` so it survives section mount/unmount.

### Behavior table

| Scroll beat | Signature state |
|---|---|
| Hero (after video/fan settle) | Pen-draws into existence at bottom-left (40×40px), DrawSVG `0% → 100%` |
| Capabilities | Idles at bottom-left, rotates ±3° lazily in a yoyo loop |
| Manifesto entry | Migrates via MotionPath to its final "signed by" slot in the Manifesto body |
| Manifesto → Testimonials (Seam 3) | Its tail extends down and becomes the branching lines that sprout cards |
| Testimonials | Returns to ambient corner position |
| Contact (post-Seam 4) | Redraws in cream ink at bottom-right of the form |
| Footer | Collapses into the JR mark via `Flip.from()` |

### Interface

```tsx
// components/homepage/transitions/SignatureProtagonist.tsx
export interface SignatureHandle {
  /** Set the signature's scroll-anchor — called by seam components via useImperativeHandle */
  setPose(pose: SignaturePose): void;
}

export type SignaturePose =
  | { kind: "hidden" }
  | { kind: "corner"; corner: "bl" | "br"; color: string }
  | { kind: "inline"; rect: DOMRect; color: string }
  | { kind: "sprouting"; branches: BranchSpec[] };
```

The protagonist subscribes to a lightweight zustand store or React context; each seam calls `setPose` at its boundary scrollTrigger `onEnter` / `onLeave` / `onUpdate`.

---

## Data flow

```
app/page.tsx
  ├── <ScrollBackground />            (unchanged, base color lerp)
  ├── <SignatureProtagonist />        (NEW, fixed layer, global)
  └── <main>
      ├── <Hero />                    (unchanged — contains Seam 0 already)
      ├── <Seam1_CardsToColumns />    (NEW, slot between Hero and Capabilities)
      ├── <Capabilities />            (existing, gains data-seam-enter/exit)
      ├── <Seam2_ShatterToMantra />   (NEW)
      ├── <Manifesto />               (existing, gains anchors)
      ├── <Seam3_SignatureSprouts />  (NEW)
      ├── <Testimonials />            (existing, gains anchors)
      ├── <Seam4_InkFlood />          (NEW — the showstopper)
      ├── <Contact />                 (existing, gains anchors)
      ├── <Seam5_SendToSign />        (NEW)
      └── <Footer />
```

Seams are sibling components that reach into their neighbors via `data-` attribute queries at `ScrollTrigger.refresh` time. This keeps section components unaware of the seam and easy to maintain independently.

---

## Error handling & fallbacks

- **Reduced motion**: Every seam queries `prefersReducedMotion()`. When true, the seam renders nothing — sections appear in their normal static layout, and `ScrollBackground` continues to handle base color transitions. No pin, no scrub, no morph. For Seam 4 specifically, since `ScrollBackground` already lerps cream → dark, the reduced-motion state produces an acceptable (if less dramatic) transition for free.
- **Lazy-load race**: Capabilities, Manifesto, Testimonials, Contact, Footer are dynamically imported in [app/page.tsx](app/page.tsx). Each seam waits for its target section's mount by subscribing to a `ResizeObserver` on the section root and calling `ScrollTrigger.refresh()` on first non-zero height.
- **Viewport resize**: All seams register with `ScrollTrigger.refresh()` on resize; MotionPaths and Flip states are recomputed.
- **Performance degradation**: A shared performance monitor samples frame timing during scroll. If the rolling 1-second average drops below ~40fps while a seam is scrubbing, the seam releases its `scrub` and snaps to the nearest keyframe using `toggleActions: "play none none reverse"` — correctness over craft. Specific sampling approach is an implementation detail for the plan.

---

## Testing strategy

### Visual verification (per seam)

For each of the 5 new seams, verify manually in browser:

1. Scroll from above the seam to below. The morph runs smoothly top-to-bottom.
2. Scroll backwards from below to above. The morph reverses without glitching.
3. Fast-scroll through the seam. Content lands in the correct final state.
4. Resize the window mid-seam. Morph recomputes without jumping.
5. Enable prefers-reduced-motion. Morph is skipped; sections appear in their static final states.
6. Visit with throttled CPU (Chrome 4x slowdown). Morph degrades gracefully, does not freeze the page.

### Automated checks (minimal — this is animation code)

- Unit tests are low-value for GSAP timelines; they'd mostly re-assert the API surface.
- Instead: a Playwright smoke test per seam that scrolls to mid-seam and asserts the expected DOM state exists (e.g., "after Seam 4 trigger, `.ink-mask` has `opacity > 0.8`"). Acts as regression tripwire.
- Lighthouse performance audit on the full homepage with all seams active: target LCP < 2.5s, CLS < 0.1, TBT < 200ms.

---

## Build order

1. **Seam 4 (ink flood)** — biggest visual payoff, most technically interesting. If this fails or feels wrong, the whole concept is suspect. Ship this first to de-risk.
2. **Seam 1 (cards → columns)** — extends the hero pattern the user already loves.
3. **SignatureProtagonist** — required before Seam 3. Until this exists, skip its role in Seams 1/4 (they work without it).
4. **Seam 3 (signature sprouts)** — gives the protagonist its load-bearing moment.
5. **Seam 2 (shatter → mantra)** — ties together the two typographic correction moments.
6. **Seam 5 (send → sign)** — quiet coda. Lowest impact; ship last.

Each step is independently shippable. We can merge after Seam 4 and keep adding.

---

## Open questions for implementation (not blocking this design)

- Does Capabilities currently expose its three column root elements as stable DOM anchors, or do we need to add `data-seam-target` attrs? (Answerable by reading [Capabilities.tsx](components/homepage/Capabilities.tsx) at implementation time.)
- Is the signature SVG path in `Signature.tsx` extensible (can we append path commands at runtime) or do we need a longer pre-baked path with DrawSVG controlling visible range? (Extending path at runtime is riskier; recommend pre-baked.)
- Does the ink-flood `clip-path` animation interact badly with Next.js 16 Turbopack's HMR? (Verify in dev during Seam 4 build.)

These are implementation details, not design decisions. They'll be answered by the writing-plans skill when it produces the implementation plan.
