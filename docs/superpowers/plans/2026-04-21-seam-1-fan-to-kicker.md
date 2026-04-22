# Seam 1 — "Fan falls into the rule" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Seam 1 (Fan → Kicker) — the section transition between `<Hero />` (fan of 4 project cards at the end of its sticky sequence) and `<Capabilities />` (the "What I do" / "Three things I ship for clients" opener). The four fan cards un-rotate, converge toward center-bottom, fade, and visually "fall" into Capabilities' horizontal kicker rule as it grows from width 0 to 100%. Headline SplitText-reveals as the rule completes.

**Architecture:** Single new component `Seam1_FanToKicker` inserted between `<Hero />` and `<Capabilities />` in `app/page.tsx`. Queries Hero's fan cards and Capabilities' kicker rule + title via `data-seam-*` attributes. All animation driven by GSAP ScrollTrigger with scrub, set up in `useEffect` (not `useLayoutEffect`) to avoid the concurrent-hydration issues we hit on Seam 4.

**Tech Stack:** React 19, Next.js 16 (Turbopack), TypeScript, GSAP 3.14 + Club plugins (ScrollTrigger, SplitText, CustomEase) already registered in [lib/gsap-setup.ts](lib/gsap-setup.ts).

**Lessons applied from Seam 4 (baked into the plan from day 1):**
- `useEffect`, not `useLayoutEffect` — avoid writing DOM styles during concurrent hydration.
- Mobile gate via `window.innerWidth < 768` — the fan is desktop-only; mobile's `MobileWork` handles projects differently.
- `suppressHydrationWarning` on elements GSAP will mutate pre-hydration.
- Anchor-wait rAF loop for dynamic-import race (Capabilities is dynamically imported).
- Pre-set `aria-label` on any label SplitText will touch.
- Tailwind classes (not inline styles) for initial transform states.

**Scope for this plan (v1):**
- 4 fan cards un-rotate → converge → fade
- Capabilities kicker rule grows from center (scaleX 0 → 1)
- Capabilities headline SplitText mask reveal
- Remove the existing `<BridgeMoment />` component from Capabilities (it's superseded)
- Reduced-motion fallback: final states applied, no animation

**Deferred:**
- Flip-based card → column morph (spec's original idea). Capabilities is chapter-stacked, not columned, so that idea doesn't fit the actual layout. Re-evaluate if Capabilities' layout ever becomes truly columnar.
- Project name "reflow" into kicker text. Too many coupled SplitText instances across components; complexity not worth it for this seam.

**Testing approach:** Manual visual verification (same as Seam 4 — no test framework in the project). Production `npm run build` must pass.

---

## File structure

**New files:**
- `components/homepage/transitions/Seam1_FanToKicker.tsx`

**Modified files:**
- `components/Hero.tsx` — add `data-seam-exit="seam-1"` on the hero section + `data-seam-fan` on the HeroFanCards wrapper
- `components/homepage/Capabilities.tsx` — add `data-seam-enter="seam-1"` on root; add `data-seam-rule` on the kicker's horizontal rule div; add `data-seam-title` on the `.cap-title` h2; remove `<BridgeMoment />` call
- `app/page.tsx` — dynamic-import `<Seam1FanToKicker />`, insert it between `<Hero />` and `<Capabilities />`

---

## Task 1 — Anchor data-attributes on Hero + Capabilities

**Files:**
- Modify: `components/Hero.tsx`
- Modify: `components/homepage/Capabilities.tsx`

### Step 1: Hero — add `data-seam-exit="seam-1"` on the hero section

In [components/Hero.tsx](components/Hero.tsx), locate the `<section ref={sectionRef} className="relative" data-bg="cream">` near line 769. Change it to:

```tsx
<section
  ref={sectionRef}
  className="relative"
  data-bg="cream"
  data-seam-exit="seam-1"
>
```

### Step 2: Hero — tag the HeroFanCards wrapper

In [components/Hero.tsx](components/Hero.tsx) around line 234, the `HeroFanCards` component renders its cards inside a wrapper div. Locate:

```tsx
<div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: -1 }}>
```

Change to:

```tsx
<div
  data-seam-fan
  className="absolute inset-0 flex items-center justify-center pointer-events-none"
  style={{ zIndex: -1 }}
>
```

The individual cards already have the `hero-fan-card` class — we'll query by `[data-seam-fan] .hero-fan-card` in the seam component.

### Step 3: Capabilities — add `data-seam-enter="seam-1"` on root

In [components/homepage/Capabilities.tsx](components/homepage/Capabilities.tsx) at line 1235, change:

```tsx
<section
  id="capabilities"
  data-bg="cream"
  className="relative overflow-hidden"
  style={{ background: CREAM }}
>
```

to:

```tsx
<section
  id="capabilities"
  data-bg="cream"
  data-seam-enter="seam-1"
  className="relative overflow-hidden"
  style={{ background: CREAM }}
>
```

### Step 4: Capabilities — tag the kicker rule + title

In [components/homepage/Capabilities.tsx](components/homepage/Capabilities.tsx) around line 102, change:

```tsx
<div className="h-px w-full mb-10" style={{ background: "rgba(26,24,22,0.12)" }} />
```

to:

```tsx
<div
  data-seam-rule
  className="h-px w-full mb-10 origin-center scale-x-0"
  style={{ background: "rgba(26,24,22,0.12)" }}
/>
```

Note: `scale-x-0` is the initial rest state; Seam 1 animates it to `scaleX(1)` during the seam.

At line 105, change the h2:

```tsx
<h2
  className="cap-title font-black tracking-tight"
  ...
>
```

to:

```tsx
<h2
  data-seam-title
  className="cap-title font-black tracking-tight"
  ...
>
```

### Step 5: Typecheck + commit

```bash
npx tsc --noEmit
git add components/Hero.tsx components/homepage/Capabilities.tsx
git commit -m "feat(transitions): add seam-1 anchor data-attributes"
```

---

## Task 2 — Remove `BridgeMoment` from Capabilities

The existing `BridgeMoment` creates its own scroll-driven vertical line transition between Hero and Capabilities. Seam 1 replaces that moment, so we remove `BridgeMoment` from the tree. Keep the component definition in the file (no dead-code removal in this task) in case it needs to be restored.

**Files:**
- Modify: `components/homepage/Capabilities.tsx`

### Step 1: Remove the `<BridgeMoment />` call from Capabilities' root

In [components/homepage/Capabilities.tsx](components/homepage/Capabilities.tsx) around line 1244, change:

```tsx
<div className="relative z-10">
  <BridgeMoment />
  <SectionHeader />
```

to:

```tsx
<div className="relative z-10">
  <SectionHeader />
```

### Step 2: Typecheck + commit

```bash
npx tsc --noEmit
git add components/homepage/Capabilities.tsx
git commit -m "refactor(capabilities): remove BridgeMoment (superseded by Seam 1)"
```

Do NOT delete the `BridgeMoment` function definition. It stays in the file, unused, so it can be restored trivially.

---

## Task 3 — Scaffold `Seam1FanToKicker` (static, hydration-safe)

Stand up the component with the same hydration-safe scaffolding as Seam 4. No animation yet — this task just gets it mounted.

**Files:**
- Create: `components/homepage/transitions/Seam1_FanToKicker.tsx`
- Modify: `app/page.tsx`

### Step 1: Create the seam component

Create `components/homepage/transitions/Seam1_FanToKicker.tsx` with:

```tsx
"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

// Desktop-only — mobile renders MobileWork, which has no fan.
const DESKTOP_MIN_WIDTH_PX = 768;

// Capabilities is dynamically imported; poll for its anchor up to ~1s.
const ANCHOR_WAIT_MAX_FRAMES = 60;

/**
 * Seam 1 — Fan → Kicker.
 *
 * Scroll-driven transition between <Hero /> (ends with a fan of 4
 * project cards) and <Capabilities /> (opens with a kicker row +
 * horizontal rule + "Three things I ship for clients" headline).
 *
 * Beats:
 *  1. Fan cards un-rotate (rotation → 0) and converge toward center-bottom
 *  2. Fan cards scale down and fade (opacity → 0)
 *  3. Capabilities' horizontal rule grows from scaleX 0 → 1 (center origin)
 *  4. Capabilities' title reveals via SplitText mask
 *
 * Renders nothing itself — this component is a logic-only seam that
 * queries and animates existing DOM elements in Hero and Capabilities.
 *
 * Anchors queried at mount:
 *   [data-seam-exit="seam-1"]            — Hero section root
 *   [data-seam-fan] .hero-fan-card       — fan cards inside Hero
 *   [data-seam-enter="seam-1"]           — Capabilities section root
 *   [data-seam-rule]                     — kicker rule inside Capabilities
 *   [data-seam-title]                    — headline inside Capabilities
 *
 * Desktop only. See design spec:
 *   docs/superpowers/specs/2026-04-21-gsap-section-transitions-design.md
 */
export default function Seam1FanToKicker() {
  useEffect(() => {
    // Animation wiring lands in Task 4.
  }, []);

  // Seam 1 has no visual of its own — it animates existing DOM.
  return null;
}
```

### Step 2: Wire into `app/page.tsx`

In [app/page.tsx](app/page.tsx), add a dynamic import alongside the others:

```tsx
const Seam1FanToKicker = dynamic(
  () => import("@/components/homepage/transitions/Seam1_FanToKicker"),
);
```

And insert it in the `<main>` between `<Hero />` and `<Capabilities />`:

```tsx
<main className="relative" style={{ zIndex: 10 }}>
  <Hero />
  <Seam1FanToKicker />
  <Work />
  <Capabilities />
  <Manifesto />
  <Testimonials />
  <Seam4InkFlood />
  <Contact />
</main>
```

Note: `<Work />` comes AFTER the seam because Work is mobile-only (`md:hidden`) on desktop, so its position in the tree doesn't affect the desktop seam range. Keeping Work where it already is keeps mobile's rendering unchanged.

### Step 3: Typecheck + build + commit

```bash
npx tsc --noEmit
npm run build
git add components/homepage/transitions/Seam1_FanToKicker.tsx app/page.tsx
git commit -m "feat(transitions): Seam1FanToKicker scaffold (logic-only, no animation yet)"
```

### Step 4: Manual verification

Open http://localhost:3000. Scroll from top to bottom. Expected:
- Hero works as before.
- The horizontal rule in Capabilities is currently invisible (scale-x-0 from Task 1). That's correct — Task 5 animates it to scaleX(1). No other visual change.
- No console errors, no hydration warnings.

---

## Task 4 — Fan card fall animation (beats 1 + 2)

Animate the 4 fan cards: un-rotate, converge, fade. Scrub-driven by ScrollTrigger with range spanning from Hero's sticky release to Capabilities' title reaching viewport center.

**Files:**
- Modify: `components/homepage/transitions/Seam1_FanToKicker.tsx`

### Step 1: Replace the component body with the animated version

Replace the contents of `Seam1_FanToKicker.tsx` with:

```tsx
"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

const DESKTOP_MIN_WIDTH_PX = 768;
const ANCHOR_WAIT_MAX_FRAMES = 60;

/**
 * Seam 1 — Fan → Kicker.
 *
 * See previous docblock; full documentation lives there.
 */
export default function Seam1FanToKicker() {
  useEffect(() => {
    // Reduced motion: reveal Capabilities' kicker rule + fade fan cards'
    // rotation to 0. No scroll-driven animation.
    if (prefersReducedMotion()) {
      const rule = document.querySelector<HTMLElement>("[data-seam-rule]");
      if (rule) rule.style.transform = "scaleX(1)";
      return;
    }

    // Mobile: no fan exists, no-op.
    if (window.innerWidth < DESKTOP_MIN_WIDTH_PX) {
      const rule = document.querySelector<HTMLElement>("[data-seam-rule]");
      if (rule) rule.style.transform = "scaleX(1)";
      return;
    }

    let cancelled = false;
    let rafId = 0;
    let frames = 0;
    let ctx: gsap.Context | null = null;

    const tryStart = () => {
      if (cancelled) return;
      const exitEl = document.querySelector<HTMLElement>('[data-seam-exit="seam-1"]');
      const enterEl = document.querySelector<HTMLElement>('[data-seam-enter="seam-1"]');
      const fanCards = document.querySelectorAll<HTMLElement>("[data-seam-fan] .hero-fan-card");
      const rule = document.querySelector<HTMLElement>("[data-seam-rule]");

      if (!exitEl || !enterEl || fanCards.length === 0 || !rule) {
        if (frames++ < ANCHOR_WAIT_MAX_FRAMES) {
          rafId = requestAnimationFrame(tryStart);
        }
        return;
      }

      ctx = gsap.context(() => {
        // Beat 1 — Fan cards un-rotate and converge (0.0–0.5 of seam).
        // Each card animates to rotation: 0, x: 0, y: 150 (fall toward
        // the bottom of viewport), scale: 0.6.
        gsap.to(fanCards, {
          rotation: 0,
          x: 0,
          y: 150,
          scale: 0.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: exitEl,
            start: "bottom 90%",
            endTrigger: enterEl,
            end: "top 70%",
            scrub: 0.5,
          },
        });

        // Beat 2 — Fan cards fade (0.5–1.0 of seam).
        gsap.to(fanCards, {
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: enterEl,
            start: "top 90%",
            end: "top 60%",
            scrub: 0.5,
          },
        });

        // Beat 3 — Kicker rule grows from scaleX 0 to 1 (center origin).
        gsap.to(rule, {
          scaleX: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: enterEl,
            start: "top 70%",
            end: "top 50%",
            scrub: 0.5,
          },
        });
      });
    };

    tryStart();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);

  return null;
}
```

### Step 2: Typecheck + commit

```bash
npx tsc --noEmit
git add components/homepage/transitions/Seam1_FanToKicker.tsx
git commit -m "feat(transitions): Seam 1 fan cards fall + kicker rule grows"
```

### Step 3: Manual verification

Open http://localhost:3000. Scroll through Hero to Capabilities. Expected:
1. At the end of Hero's sticky sequence, the 4 fan cards are visible in their spread positions (unchanged from before).
2. As you scroll into the Hero→Capabilities seam, each fan card un-rotates and translates down+scales down.
3. As you continue scrolling, the cards fade out.
4. The horizontal rule in Capabilities' kicker row grows from an invisible center-point outward to full width.
5. Reverse-scroll smoothly reverses all three beats.
6. No console errors.

If the fan cards behave strangely (e.g., snap instead of scrub), check that the fan cards' inline style hasn't been overridden by Hero's own GSAP animations — the fan cards are positioned by Hero's shrink timeline, so our animation layers on top of that positioning. If there's a conflict, the scroll range of our seam may need to start later (`start: "bottom 70%"`).

---

## Task 5 — Capabilities headline SplitText reveal (beat 4)

Reveal the "Three things I ship for clients." headline via SplitText mask. Triggered by scroll once Capabilities' title enters the viewport.

**Files:**
- Modify: `components/homepage/transitions/Seam1_FanToKicker.tsx`

### Step 1: Add SplitText reveal inside the gsap.context

In `Seam1_FanToKicker.tsx`, inside the `gsap.context` block, **after** the existing three beats, add:

```typescript
        // Beat 4 — Headline SplitText mask reveal.
        // "Three things I ship for clients." chars rise from below via yPercent.
        const title = document.querySelector<HTMLElement>("[data-seam-title]");
        if (title) {
          const split = SplitText.create(title, { type: "chars", mask: "chars" });
          gsap.set(split.chars, { yPercent: 110 });
          gsap.to(split.chars, {
            yPercent: 0,
            stagger: 0.015,
            ease: "appleOut",
            scrollTrigger: {
              trigger: enterEl,
              start: "top 65%",
              end: "top 35%",
              scrub: 0.5,
            },
          });
          // Register split for cleanup (see return statement below).
          splitsToRevert.push(split);
        }
```

### Step 2: Add the SplitText import at the top

Change the import line:

```typescript
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
```

to:

```typescript
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
```

### Step 3: Track splits for cleanup

Near the top of the useEffect, alongside `let ctx: gsap.Context | null = null;`, add:

```typescript
    const splitsToRevert: InstanceType<typeof SplitText>[] = [];
```

### Step 4: Update the cleanup return

Change the cleanup:

```typescript
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      ctx?.revert();
    };
```

to:

```typescript
    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      splitsToRevert.forEach((s) => s.revert());
      ctx?.revert();
    };
```

Order matters: revert SplitText's DOM wrapping BEFORE ctx.revert() kills the tweens, same pattern as Seam 4.

### Step 5: Pre-render `aria-label` on the title

Because SplitText with default `aria: "auto"` will mutate the h2 to add `aria-label="Three things I ship for clients."`, pre-render it in the JSX to prevent hydration mismatches.

In [components/homepage/Capabilities.tsx](components/homepage/Capabilities.tsx) at the h2 where we added `data-seam-title` (line ~105), change:

```tsx
<h2
  data-seam-title
  className="cap-title font-black tracking-tight"
  ...
>
  Three things I ...
```

to:

```tsx
<h2
  data-seam-title
  aria-label="Three things I ship for clients."
  className="cap-title font-black tracking-tight"
  ...
>
  Three things I ...
```

### Step 6: Typecheck + commit

```bash
npx tsc --noEmit
git add components/homepage/transitions/Seam1_FanToKicker.tsx components/homepage/Capabilities.tsx
git commit -m "feat(transitions): Seam 1 headline SplitText reveal (beat 4)"
```

### Step 7: Manual verification

Open http://localhost:3000. Scroll through Hero to Capabilities. Expected:
1. Previous beats still work (fan cards fall, kicker rule grows).
2. As Capabilities' title enters the viewport, its characters rise into place via mask reveal, staggered left-to-right.
3. No console errors, no hydration warnings.

---

## Task 6 — Production build + manual QA

Final verification. No code changes expected unless bugs surface.

### Step 1: Production build

```bash
npm run build
```

Expect: clean compile, no TypeScript errors, no lint errors, all routes prerendered.

### Step 2: Manual visual QA

In Chrome at http://localhost:3000:

1. **Normal scroll through Hero → Capabilities**: fan falls, rule grows, title reveals, all smoothly scrubbed.
2. **Reverse scroll**: same beats run in reverse.
3. **Fast scroll**: beats complete; final states land.
4. **Reduced motion** (DevTools → Emulate prefers-reduced-motion: reduce): no animation; Capabilities' rule is visible (scaleX: 1) at rest; fan cards visible at their static positions; title visible as normal h2.
5. **Mobile viewport** (~390px wide): no seam animation; Hero and Capabilities appear as they normally would on mobile.
6. **HMR sanity**: edit `Seam1_FanToKicker.tsx`, save; no duplicated DOM, no hydration warnings in console.

### Step 3: Commit (if any fixes)

```bash
git status
# If fixes needed:
git add -A
git commit -m "chore(transitions): Seam 1 manual QA fixes"
```

---

## Self-review summary

**Spec coverage:**
- Fan cards un-rotate + converge + fade → Task 4 beats 1 + 2 ✓
- Capabilities kicker rule grows → Task 4 beat 3 ✓
- Capabilities headline SplitText reveal → Task 5 beat 4 ✓
- Reduced-motion fallback → Task 4 (built into the useEffect early returns) ✓
- Mobile gate → Task 4 (built in) ✓

**Placeholder scan:** none. All code blocks are concrete.

**Type consistency:** `data-seam-exit`, `data-seam-enter`, `data-seam-fan`, `data-seam-rule`, `data-seam-title` — used consistently across Tasks 1, 4, 5.

**Scope:** single feature (Seam 1), shippable standalone, 6 tasks each short. Appropriate for one plan.

**Explicit departures from the original spec:** the spec called for a Flip-based "cards → columns" morph, but Capabilities is chapter-stacked (not columnar), so that approach doesn't fit. This plan substitutes a simpler "fan falls into rule" morph that preserves the metamorphic feel using the actual layout.
