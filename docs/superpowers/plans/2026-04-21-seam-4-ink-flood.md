# Seam 4 — Ink Flood Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Seam 4 (Ink Flood) — the cream→dark section transition between Testimonials and Contact on the homepage, per the design spec at [docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md](docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md).

**Architecture:** Single new React component (`Seam4_InkFlood`) injected between `<Testimonials />` and `<Contact />` in `app/page.tsx`. Renders a fixed-position ink layer with an animated wavy `clip-path` plus scroll-driven form/card effects. All animations driven by GSAP ScrollTrigger with scrub. Two shared utility files establish infrastructure for the remaining seams (created now, consumed later).

**Tech Stack:** React 19, Next.js 16 (Turbopack), TypeScript, GSAP 3.14 + Club plugins (ScrollTrigger, SplitText, Flip, DrawSVG, MotionPath, CustomEase) already configured in [lib/gsap-setup.ts](lib/gsap-setup.ts).

**Scope for this plan (v1):**
- Proof card compression (beat 1)
- Ink flood with wavy clip-path (beat 2)
- Form field underline reveal via `scaleX` transform (beat 4 — implementation detail change from spec's DrawSVG because current form underlines are CSS borders, not SVG; `scaleX` produces a visually identical result)
- Form field label SplitText type-in (beat 5)
- Reduced-motion fallback

**Deferred to future plans:**
- Paper curl (beat 3) — adds significant layering/pinning complexity for marginal payoff; ship ink flood alone first, evaluate
- Signature migration (beat 6) — blocked on `SignatureProtagonist` which lands in its own plan

**Testing approach (honest note):** The project has no test framework installed. Adding vitest just for one animation seam is scope creep. This plan uses **manual visual verification** as the primary checkpoint, plus `console.log` assertions for the one pure helper function (`generateInkPath`). If we later add vitest, the pure helper has an obvious unit-test shape.

---

## File structure

**New files:**
- `components/homepage/transitions/_shared/types.ts` — shared TypeScript types for all seams
- `components/homepage/transitions/_shared/inkPath.ts` — pure function returning an animated wavy polygon clip-path string
- `components/homepage/transitions/Seam4_InkFlood.tsx` — the seam component

**Modified files:**
- `app/page.tsx` — insert `<Seam4InkFlood />` between Testimonials and Contact
- `components/homepage/Testimonials.tsx` — add `data-seam-exit="seam-4"` to section root
- `components/homepage/ProofCard.tsx` — add `data-proof-card` to the motion.div
- `components/Contact.tsx` — add `data-seam-enter="seam-4"` to `<section id="contact-desktop">`; add `data-seam-label` to `DesktopField` labels; modify `DesktopField` underline to be animatable via `scaleX`

---

## Task 1 — Create shared types module

**Files:**
- Create: `components/homepage/transitions/_shared/types.ts`

- [ ] **Step 1: Create the directory and types file**

```bash
mkdir -p "components/homepage/transitions/_shared"
```

Create `components/homepage/transitions/_shared/types.ts`:

```typescript
// Shared types for homepage section transitions (seams).
// Each seam component adheres to this contract so future refactors
// can swap implementations without touching consumers.

export type SeamId = "seam-1" | "seam-2" | "seam-3" | "seam-4" | "seam-5";

/**
 * Every section that participates in a seam tags its root element with
 * `data-seam-exit="<id>"` (if it's the "from" section) and/or
 * `data-seam-enter="<id>"` (if it's the "to" section). Seam components
 * query these at mount time and wire their ScrollTriggers to them.
 */
export interface SeamAnchors {
  exit: HTMLElement;
  enter: HTMLElement;
}

/**
 * Standard shape for a seam component. Seams are pure effects — they render
 * fixed-position overlays and register scroll triggers, but do not hold
 * meaningful props. Left here for future seams that may want config.
 */
export interface SeamProps {
  /** If true, seam is disabled and renders nothing. Used by debug/storybook. */
  disabled?: boolean;
}
```

- [ ] **Step 2: Commit**

```bash
git add components/homepage/transitions/_shared/types.ts
git commit -m "feat(transitions): shared types module for homepage seams"
```

---

## Task 2 — Create `generateInkPath` pure function

**Files:**
- Create: `components/homepage/transitions/_shared/inkPath.ts`

This is the only unit-testable piece of Seam 4. We verify by `console.log` since there's no test runner.

- [ ] **Step 1: Create `inkPath.ts`**

Create `components/homepage/transitions/_shared/inkPath.ts`:

```typescript
/**
 * Generates a `clip-path: polygon(...)` value for the ink flood effect.
 *
 * The returned polygon has:
 *   - A wavy top edge at Y = (100 - progress*100)%, with 12 vertices
 *     offset by sine wobble so the edge feels like liquid, not a ruler line.
 *   - Two anchor vertices at bottom-right and bottom-left so the interior
 *     of the polygon is the "ink" fill below the wavy edge.
 *
 * @param progress  0 → 1. 0 = ink entirely below viewport (invisible),
 *                  1 = ink entirely covers the viewport.
 * @returns a polygon() string suitable for CSS `clip-path`.
 */
export function generateInkPath(progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress));
  const numEdgeVertices = 12;
  // Y position of the wave's base (in % of viewport height).
  // progress 0 → 100% (below viewport). progress 1 → 0% (at top).
  const baseY = 100 - clamped * 100;
  // Wobble amplitude in % — keep subtle so the edge reads as "liquid" not "cartoon".
  const amplitude = 2;
  // Phase shifts with progress so the waves visibly travel, not just rise in place.
  const phase = clamped * Math.PI * 2;

  const vertices: string[] = [];
  for (let i = 0; i <= numEdgeVertices; i++) {
    const x = (i / numEdgeVertices) * 100;
    const wobble = Math.sin(i * 0.8 + phase) * amplitude;
    // Clamp to [0, 100] so we never exit the visible box.
    const y = Math.max(0, Math.min(100, baseY + wobble));
    vertices.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  // Close the polygon via the bottom-right and bottom-left anchors.
  vertices.push("100% 100%", "0% 100%");

  return `polygon(${vertices.join(", ")})`;
}
```

- [ ] **Step 2: Verify by console output**

Create a temporary throwaway verification in your browser devtools — in the running dev server, open the console and paste:

```javascript
// Manual check: progress 0 should place edge at ~100% (below viewport)
// progress 1 should place edge at ~0% (top of viewport)
// edge should have 13 points (0..12 inclusive) plus 2 anchor points = 15 total
```

Alternatively, import and log in any component temporarily:

```typescript
import { generateInkPath } from "@/components/homepage/transitions/_shared/inkPath";
console.log("progress=0:", generateInkPath(0));
console.log("progress=0.5:", generateInkPath(0.5));
console.log("progress=1:", generateInkPath(1));
```

Expected: progress=0 string ends with Y values near 100%; progress=1 string ends with Y values near 0%. Each string has 15 `N% N%` pairs.

Remove the temp console.log before committing.

- [ ] **Step 3: Commit**

```bash
git add components/homepage/transitions/_shared/inkPath.ts
git commit -m "feat(transitions): generateInkPath — wavy-edge polygon for ink flood"
```

---

## Task 3 — Add anchor data-attributes

Seam components query `[data-seam-exit]` and `[data-seam-enter]` at mount time. We add those tags now (invisible no-op change) so future tasks have anchors to bind to.

**Files:**
- Modify: `components/homepage/Testimonials.tsx` (line ~83–88)
- Modify: `components/homepage/ProofCard.tsx` (the motion.div at ~line 58–60)
- Modify: `components/Contact.tsx` (section at line 303)

- [ ] **Step 1: Add `data-seam-exit="seam-4"` to Testimonials root**

In [components/homepage/Testimonials.tsx](components/homepage/Testimonials.tsx) at line 83, change:

```tsx
<section
  ref={sectionRef}
  id="testimonials"
  className="py-32 px-6"
  style={{ backgroundColor: "#e5e1db" }}
>
```

to:

```tsx
<section
  ref={sectionRef}
  id="testimonials"
  data-seam-exit="seam-4"
  className="py-32 px-6"
  style={{ backgroundColor: "#e5e1db" }}
>
```

- [ ] **Step 2: Add `data-proof-card` to ProofCard's motion.div**

In [components/homepage/ProofCard.tsx](components/homepage/ProofCard.tsx) at line 58, change:

```tsx
<motion.div
  ref={ref}
  variants={cardHoverVariants}
```

to:

```tsx
<motion.div
  ref={ref}
  data-proof-card
  variants={cardHoverVariants}
```

- [ ] **Step 3: Add `data-seam-enter="seam-4"` to Contact desktop section**

In [components/Contact.tsx](components/Contact.tsx) at line 303, change:

```tsx
<section ref={sectionRef} id="contact-desktop" className="hidden md:block py-32 px-6" style={{ backgroundColor: "#0a0908", color: "#e5e1db" }}>
```

to:

```tsx
<section ref={sectionRef} id="contact-desktop" data-seam-enter="seam-4" className="hidden md:block py-32 px-6" style={{ backgroundColor: "#0a0908", color: "#e5e1db" }}>
```

- [ ] **Step 4: Manual verification**

Start dev server if not already running:

```bash
npm run dev
```

In browser devtools, run:

```javascript
document.querySelector('[data-seam-exit="seam-4"]')   // returns <section id="testimonials">
document.querySelector('[data-seam-enter="seam-4"]')  // returns <section id="contact-desktop">
document.querySelectorAll('[data-proof-card]')        // returns NodeList of 3
```

Expected: all three queries return the expected elements.

- [ ] **Step 5: Commit**

```bash
git add components/homepage/Testimonials.tsx components/homepage/ProofCard.tsx components/Contact.tsx
git commit -m "feat(transitions): add seam-4 anchor data-attributes to Testimonials/Contact/ProofCard"
```

---

## Task 4 — Scaffold `Seam4InkFlood` with static ink layer only

No animation yet. Goal: get the component mounted, the fixed layer rendering, and verified in the DOM. Wire it into `app/page.tsx`.

**Files:**
- Create: `components/homepage/transitions/Seam4_InkFlood.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create the seam component**

Create `components/homepage/transitions/Seam4_InkFlood.tsx`:

```tsx
"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { generateInkPath } from "./_shared/inkPath";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Seam 4 — Ink Flood.
 *
 * Sits between <Testimonials /> and <Contact /> in the homepage. Renders a
 * single fixed-position ink layer whose `clip-path` animates on scroll to
 * reveal a wavy dark tide rising over the cream page, carrying the user
 * from Testimonials into Contact.
 *
 * See design spec: docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md
 */
export default function Seam4InkFlood() {
  const inkRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    // Intentionally empty — animation wiring lands in Task 5.
  }, []);

  return (
    <div
      ref={inkRef}
      aria-hidden
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0a0908",
        clipPath: generateInkPath(0),
        zIndex: 15,
      }}
    />
  );
}
```

- [ ] **Step 2: Wire into app/page.tsx**

In [app/page.tsx](app/page.tsx), add a dynamic import beside the others and render it between Testimonials and Contact.

Change the imports block (lines 7–24 area) to add:

```tsx
const Seam4InkFlood = dynamic(
  () => import("@/components/homepage/transitions/Seam4_InkFlood"),
  { ssr: false }
);
```

Change the main element (lines 30–37 area) from:

```tsx
<main className="relative" style={{ zIndex: 10 }}>
  <Hero />
  <Work />
  <Capabilities />
  <Manifesto />
  <Testimonials />
  <Contact />
</main>
```

to:

```tsx
<main className="relative" style={{ zIndex: 10 }}>
  <Hero />
  <Work />
  <Capabilities />
  <Manifesto />
  <Testimonials />
  <Seam4InkFlood />
  <Contact />
</main>
```

- [ ] **Step 3: Manual verification**

Load `http://localhost:3000` in browser. Open devtools, Elements panel. Run in console:

```javascript
document.querySelector('[aria-hidden]').style.clipPath
```

Inspect: there's a fixed `<div>` rendered with `clip-path: polygon(...)` and `z-index: 15`. At progress=0, the polygon is below the viewport so **nothing visible changes** on the page. This is correct — no regression, and the element is present ready for animation.

If you want to confirm the layer CAN appear, temporarily change `generateInkPath(0)` to `generateInkPath(1)` in the component — the whole viewport should go dark. Revert to `0` before committing.

- [ ] **Step 4: Commit**

```bash
git add components/homepage/transitions/Seam4_InkFlood.tsx app/page.tsx
git commit -m "feat(transitions): Seam4InkFlood scaffold with static ink layer"
```

---

## Task 5 — Wire ink clip-path scroll animation (beat 2)

Add the ScrollTrigger scrub driving `generateInkPath()` as the user scrolls from the end of Testimonials into Contact.

**Files:**
- Modify: `components/homepage/transitions/Seam4_InkFlood.tsx`

- [ ] **Step 1: Replace the component body with animated version**

Replace the entire contents of `components/homepage/transitions/Seam4_InkFlood.tsx` with:

```tsx
"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";
import { generateInkPath } from "./_shared/inkPath";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Seam 4 — Ink Flood.
 *
 * Scroll-driven transition between <Testimonials /> (cream) and <Contact />
 * (dark). A wavy ink tide rises from the bottom of the viewport via an
 * animated clip-path on a fixed-position layer.
 *
 * Anchors queried at mount:
 *   [data-seam-exit="seam-4"]  — Testimonials section root
 *   [data-seam-enter="seam-4"] — Contact desktop section root
 *
 * See design spec:
 *   docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md
 */
export default function Seam4InkFlood() {
  const inkRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion()) return;

    const exitEl = document.querySelector<HTMLElement>('[data-seam-exit="seam-4"]');
    const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-4"]');
    const inkEl = inkRef.current;
    if (!exitEl || !enterEl || !inkEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: exitEl,
        start: "bottom 80%",
        endTrigger: enterEl,
        end: "top 30%",
        scrub: 0.5,
        onUpdate: (self) => {
          inkEl.style.clipPath = generateInkPath(self.progress);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={inkRef}
      aria-hidden
      className="pointer-events-none"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0a0908",
        clipPath: generateInkPath(0),
        willChange: "clip-path",
        zIndex: 15,
      }}
    />
  );
}
```

- [ ] **Step 2: Manual verification**

Reload the homepage. Scroll to the bottom of Testimonials (3 proof cards visible). Continue scrolling slowly. Expected:

1. As the bottom of Testimonials crosses ~80% of the viewport, a wavy dark edge appears rising from the bottom.
2. The ink rises smoothly as you scroll, reaching ~full coverage by the time Contact's top reaches 30% of the viewport.
3. Scroll back up — the ink recedes equally smoothly.
4. The edge visibly *wobbles* (sine wave), not a straight line.

If the ink snaps instead of scrubbing, `scrub: 0.5` may need adjustment — increase to `scrub: 1` if too fast, decrease to `scrub: 0.2` if too laggy.

- [ ] **Step 3: Commit**

```bash
git add components/homepage/transitions/Seam4_InkFlood.tsx
git commit -m "feat(transitions): Seam 4 ink flood clip-path scroll animation"
```

---

## Task 6 — Add proof card compression (beat 1)

As the ink rises, the proof cards compress vertically as if the ink is squeezing them out. This is beat 1 in the spec's timeline.

**Files:**
- Modify: `components/homepage/transitions/Seam4_InkFlood.tsx`

- [ ] **Step 1: Add the compression tween inside the existing gsap.context**

In `Seam4_InkFlood.tsx`, locate the `gsap.context` block. Inside it, **after** the existing `ScrollTrigger.create` block, add:

```typescript
      // Beat 1 — Proof card compression (0.0–0.15 of timeline).
      // Cards scaleY 1 → 0.6 and skewX 0 → -4 as the ink begins rising.
      const proofCards = exitEl.querySelectorAll<HTMLElement>("[data-proof-card]");
      if (proofCards.length > 0) {
        gsap.to(proofCards, {
          scaleY: 0.6,
          skewX: -4,
          transformOrigin: "center bottom",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: exitEl,
            start: "bottom 80%",
            end: "bottom 50%",
            scrub: 0.5,
          },
        });
      }
```

The complete `gsap.context` callback should now look like:

```typescript
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: exitEl,
        start: "bottom 80%",
        endTrigger: enterEl,
        end: "top 30%",
        scrub: 0.5,
        onUpdate: (self) => {
          inkEl.style.clipPath = generateInkPath(self.progress);
        },
      });

      // Beat 1 — Proof card compression (0.0–0.15 of timeline).
      // Cards scaleY 1 → 0.6 and skewX 0 → -4 as the ink begins rising.
      const proofCards = exitEl.querySelectorAll<HTMLElement>("[data-proof-card]");
      if (proofCards.length > 0) {
        gsap.to(proofCards, {
          scaleY: 0.6,
          skewX: -4,
          transformOrigin: "center bottom",
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: exitEl,
            start: "bottom 80%",
            end: "bottom 50%",
            scrub: 0.5,
          },
        });
      }
    });
```

- [ ] **Step 2: Manual verification**

Reload the homepage. Scroll so Testimonials is fully visible, then continue scrolling down. Expected:

1. As Testimonials' bottom crosses 80% of viewport, the 3 proof cards begin compressing vertically and skewing slightly left.
2. By the time Testimonials' bottom reaches 50% of viewport, the cards are visibly flattened (60% of original height) and leaning.
3. Scrolling back up reverses the compression smoothly.
4. The ink continues rising during and after the compression (both effects coexist).

- [ ] **Step 3: Commit**

```bash
git add components/homepage/transitions/Seam4_InkFlood.tsx
git commit -m "feat(transitions): Seam 4 proof card compression (beat 1)"
```

---

## Task 7 — Form field underline reveal (beat 4)

As the ink clears and Contact's form enters view, each form field's bottom underline draws itself in. Current underlines are CSS `border-b` rules on `<input>` elements — we replace them with a span-based underline that accepts `scaleX` animation.

**Files:**
- Modify: `components/Contact.tsx` (`DesktopField` at lines 398–427)
- Modify: `components/homepage/transitions/Seam4_InkFlood.tsx`

- [ ] **Step 1: Update `DesktopField` to use an animatable underline**

In [components/Contact.tsx](components/Contact.tsx) at lines 398–427, replace the `DesktopField` function with:

```tsx
function DesktopField({
  label,
  name,
  type = "text",
  maxLength,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  maxLength?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        data-seam-label
        className="block text-xs uppercase tracking-[0.2em] mb-2"
        style={{ color: "rgba(229,225,219,0.5)" }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          maxLength={maxLength}
          required={required}
          className="w-full bg-transparent border-0 focus:outline-none py-2 text-sm"
          style={{ color: "#e5e1db" }}
        />
        <span
          aria-hidden
          data-seam-underline
          className="absolute left-0 right-0 bottom-0 block"
          style={{
            height: 1,
            backgroundColor: "rgba(229,225,219,0.2)",
            transformOrigin: "left center",
            transform: "scaleX(0)",
            willChange: "transform",
          }}
        />
      </div>
    </div>
  );
}
```

Key changes:
- Removed the CSS `border-b` and replaced with an absolutely positioned `<span>` underline.
- `<span>` starts at `scaleX(0)` (invisible) with `transformOrigin: "left center"` so it draws left → right.
- Both `<label>` and `<span>` get data attributes so the seam can query them.

- [ ] **Step 2: Add the underline reveal tween to the seam**

In `components/homepage/transitions/Seam4_InkFlood.tsx`, inside the `gsap.context`, **after** the proof card tween, add:

```typescript
      // Beat 4 — Form field underline reveal (0.45–0.7 of timeline).
      // Each <span data-seam-underline> scaleX 0 → 1 so it draws left→right.
      const underlines = enterEl.querySelectorAll<HTMLElement>("[data-seam-underline]");
      if (underlines.length > 0) {
        gsap.to(underlines, {
          scaleX: 1,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: enterEl,
            start: "top 70%",
            end: "top 30%",
            scrub: 0.5,
          },
        });
      }
```

- [ ] **Step 3: Manual verification**

Reload homepage. Scroll all the way through the ink seam until Contact is fully visible. Expected:

1. Each form field shows a label and an empty space where its underline would be — no CSS border visible at rest.
2. As you scroll the Contact section into view (top 70% → top 30%), the underlines draw themselves in from left to right, staggered field by field.
3. When focused (click the input), the existing focus behavior works. The `focus:border-[#e5e1db]` was removed with the old border — verify focus state is acceptable. If the focus affordance is too subtle, ADDING a focus highlight is a follow-up polish task — not part of this plan.

- [ ] **Step 4: Commit**

```bash
git add components/Contact.tsx components/homepage/transitions/Seam4_InkFlood.tsx
git commit -m "feat(transitions): Seam 4 form underline reveal (beat 4)"
```

---

## Task 8 — Form field label SplitText type-in (beat 5)

Each form label's characters type in sequentially as Contact enters the viewport — the visual equivalent of a page being written in real time.

**Files:**
- Modify: `components/homepage/transitions/Seam4_InkFlood.tsx`

- [ ] **Step 1: Add SplitText reveal for form labels**

In `Seam4_InkFlood.tsx`, add `SplitText` to the imports at the top:

```typescript
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
```

Inside the `gsap.context`, **after** the underline tween, add:

```typescript
      // Beat 5 — Form labels type in (0.7–0.9 of timeline).
      // Each <label data-seam-label> has its chars revealed via SplitText mask.
      const labels = enterEl.querySelectorAll<HTMLElement>("[data-seam-label]");
      const labelSplits: InstanceType<typeof SplitText>[] = [];
      labels.forEach((label, i) => {
        const split = SplitText.create(label, { type: "chars", mask: "chars" });
        labelSplits.push(split);
        gsap.set(split.chars, { yPercent: 110 });
        gsap.to(split.chars, {
          yPercent: 0,
          stagger: 0.02,
          ease: "appleOut",
          scrollTrigger: {
            trigger: enterEl,
            start: `top ${60 - i * 4}%`,
            end: `top ${30 - i * 4}%`,
            scrub: 0.5,
          },
        });
      });

      // Cleanup for SplitText — gsap.context handles the tweens, but SplitText
      // DOM wrapping needs explicit revert.
      // Stored outside ctx and reverted in the outer cleanup via the ref below.
      cleanupRef.current = () => labelSplits.forEach((s) => s.revert());
```

- [ ] **Step 2: Add the cleanup ref**

At the top of the `Seam4InkFlood` component body (just after `const inkRef = useRef...`), add:

```typescript
  const cleanupRef = useRef<(() => void) | null>(null);
```

And update the `useIsomorphicLayoutEffect` return statement from:

```typescript
    return () => ctx.revert();
```

to:

```typescript
    return () => {
      cleanupRef.current?.();
      ctx.revert();
    };
```

- [ ] **Step 3: Manual verification**

Reload homepage. Scroll to Contact. Expected:

1. As Contact enters the viewport, each form label's characters rise from below (masked reveal), staggered label-by-label with slightly different scroll ranges.
2. Labels fully settled by the time Contact is fully in view.
3. Hot-reload the page mid-scroll — no console errors, no duplicated character spans.

If you see duplicated `<span>`s in the DOM after HMR, the SplitText cleanup is firing incorrectly. Check that `cleanupRef.current?.()` runs before `ctx.revert()`.

- [ ] **Step 4: Commit**

```bash
git add components/homepage/transitions/Seam4_InkFlood.tsx
git commit -m "feat(transitions): Seam 4 form label type-in via SplitText (beat 5)"
```

---

## Task 9 — Reduced-motion fallback verification

The `prefersReducedMotion()` early return is already in the component from Task 5. This task verifies it works end-to-end.

**Files:** none modified (verification only)

- [ ] **Step 1: Emulate reduced motion in Chrome**

In Chrome DevTools:
1. Open the DevTools command palette with `Cmd+Shift+P`
2. Type "reduced motion"
3. Select "Emulate CSS media feature prefers-reduced-motion: reduce"

Reload the page.

- [ ] **Step 2: Verify seam is entirely skipped**

Scroll through the entire homepage. Expected:

1. No ink flood. No card compression. No label type-in. No underline reveal.
2. Testimonials cards appear in normal static layout.
3. Contact's form fields show their labels at rest with underlines visible at `scaleX(1)` — wait, this is a bug. Underlines start at `scaleX(0)` and only animate to `scaleX(1)` if the seam runs. Under reduced-motion the seam doesn't run, so underlines stay invisible.

Fix: when reduced-motion, still apply the final state. Update the early return in `Seam4_InkFlood.tsx`:

```typescript
    if (prefersReducedMotion()) {
      // Apply final states so the page doesn't appear in a half-assembled state.
      const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-4"]');
      if (enterEl) {
        const underlines = enterEl.querySelectorAll<HTMLElement>("[data-seam-underline]");
        underlines.forEach((u) => {
          u.style.transform = "scaleX(1)";
        });
      }
      return;
    }
```

Re-verify: with reduced-motion emulation on, underlines are visible at rest, labels are visible, no animation occurs during scroll.

- [ ] **Step 3: Turn off emulation and re-verify full animation still works**

In Chrome DevTools, un-select the reduced-motion emulation. Reload. Scroll. Expected: full seam animation plays normally.

- [ ] **Step 4: Commit**

```bash
git add components/homepage/transitions/Seam4_InkFlood.tsx
git commit -m "feat(transitions): Seam 4 reduced-motion applies final states"
```

---

## Task 10 — Manual QA pass

Final verification across browsers, scroll speeds, and device conditions. No code changes expected, but note any bugs and create a follow-up issue/task.

**Files:** none modified

- [ ] **Step 1: Slow-scroll pass**

Reload. Scroll from top of homepage to Footer at normal reading pace. Expected: every beat of Seam 4 triggers smoothly, no stutter.

- [ ] **Step 2: Fast-scroll pass**

Reload. Grab the scrollbar and fling to the bottom quickly. Expected: seam completes with final states in place (cards compressed, ink covering, labels visible, underlines drawn). No missing states, no hung animations.

- [ ] **Step 3: Reverse-scroll pass**

Scroll to Footer. Scroll all the way back to top. Expected: seam reverses smoothly — ink recedes, cards uncompress, labels retreat, underlines retract.

- [ ] **Step 4: Resize mid-seam**

Scroll to the middle of the seam (ink half-risen). Resize the browser window drastically (make it narrow, then tall). Expected: `ScrollTrigger.refresh()` recomputes, no visual glitch beyond a brief recomputation frame.

- [ ] **Step 5: CPU throttle pass**

In Chrome DevTools → Performance tab → CPU throttle "4x slowdown". Reload. Scroll through the seam. Expected: animations may be noticeably slower but the page does not freeze; all final states land.

- [ ] **Step 6: HMR pass**

Edit `components/homepage/transitions/Seam4_InkFlood.tsx` — add a comment, save — and verify the dev server hot-reloads without:
- Duplicated elements in the DOM
- Console errors about SplitText or ScrollTrigger
- Dead pinned sections

- [ ] **Step 7: Mobile check (informational)**

This plan targets desktop only. On mobile, Contact renders `<MobileContact>` which has `data-seam-enter` *not* attached (desktop only). The seam should quietly do nothing on mobile. Verify by resizing to <768px: no ink, no compression. Cards and form still work via their existing independent animations.

If mobile anchoring is desired later, that's a future task — out of scope for this plan.

- [ ] **Step 8: Build check**

```bash
npm run build
```

Expected: Next.js build completes without TypeScript errors, without lint errors. If there are any, address them before calling the plan done.

- [ ] **Step 9: Final commit (if any fixes from Step 8)**

```bash
git status
# If there were fixes:
git add -A
git commit -m "chore(transitions): fix type/lint errors surfaced by production build"
```

---

## Self-review summary

**Spec coverage:**
- Beat 1 (proof card compression) → Task 6 ✓
- Beat 2 (ink flood clip-path) → Task 5 ✓
- Beat 3 (paper curl) → **deferred** (documented in header)
- Beat 4 (form underline reveal) → Task 7 ✓ (implementation changed from DrawSVG to `scaleX` — documented)
- Beat 5 (form label type-in) → Task 8 ✓
- Beat 6 (signature migration) → **deferred** (blocked on SignatureProtagonist; documented)
- Reduced-motion fallback → Task 9 ✓
- Performance degradation guard (spec's error handling section) → **deferred** (documented); the scrub smoothing handles the common case and CPU throttle testing verifies degradation doesn't freeze

**Placeholder scan:** none found. All code blocks are concrete. No "TBD" or "handle edge cases" language.

**Type consistency:** `SeamId`, `SeamAnchors`, `SeamProps` defined in Task 1 are the canonical types; `data-seam-exit`, `data-seam-enter`, `data-proof-card`, `data-seam-label`, `data-seam-underline` are the canonical data attributes. Used consistently in Tasks 3, 6, 7, 8, 9.

**Scope:** single feature (Seam 4), shippable standalone, ~10 tasks of 2–5 minutes each. Appropriate for one plan.
