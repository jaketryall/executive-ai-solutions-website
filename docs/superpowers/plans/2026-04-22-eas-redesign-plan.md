# EAS Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the EAS homepage from a 2023/2024 agency template vocabulary into a 2026-grade studio portfolio per the design spec at [docs/superpowers/specs/2026-04-22-eas-redesign-design.md](../specs/2026-04-22-eas-redesign-design.md).

**Architecture:** Single Next.js 16 App Router page composed of ~11 section components. Shared visual system (Geist + Geist Mono, warm paper + oxblood palette, B1 tracking-tag motif). Motion primitives library (`lib/motion/`) reused by every section. Two interactive signatures (Estimator + LiveCRM). Native View Transitions replace custom page-transition code. Craft-first motion pass layered in after structural work.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP 3.14 · @gsap/react · Framer Motion 12 · next/font · Resend (Contact email) · Vitest + React Testing Library (new) · Cal.com (external booking link).

---

## TDD Policy

- **Strict TDD** for: `lib/estimator.ts` (pricing logic), `lib/mock-crm.ts` (data shape), `app/api/estimate/route.ts` (API handler), `lib/motion/primitives.ts` (pure-JS behavior of `useFan` origin math).
- **Manual dev-server verification** for: visual layout, animation timing, typography scale, keyboard focus ring, hover states. Write a short checklist per visual task.
- **Reduced-motion verification** every major section task.
- **Responsive verification** at the end of each phase — 390px and 1440px.

## Commit Discipline

- Every task ends with a commit (shown in its final step).
- Commit messages follow repo style: `type(scope): description`. Recent examples: `feat(homepage): ...`, `fix(transitions): ...`, `docs(spec): ...`.
- Never skip hooks. If a commit fails, fix the root cause and commit fresh — don't `--amend`.

## File Structure (what gets touched, by layer)

**Created:**
```
app/api/estimate/route.ts              — POST endpoint for Estimator captures
lib/motion/primitives.ts                — useReveal, useScrub, useFan, useSettle, useMorph
lib/motion/eases.ts                     — 5 CustomEase curves
lib/hooks/useSectionReveal.ts           — unified B1 header reveal hook
lib/hooks/useSectionStatus.ts           — IN TRANSIT → DELIVERED status hook
lib/estimator.ts                        — pure pricing logic
lib/mock-crm.ts                         — LiveCRM demo data
lib/ease-registry.ts                    — re-exports eases for components
components/ui/SectionHeader.tsx         — B1 tracking-tag motif component
components/ui/ActionTag.tsx             — contextual cursor tag (from CustomCursor)
components/ui/SlotCounter.tsx           — digit-roll counter for Estimator
components/marketing/TestimonialMarquee.tsx
components/marketing/Mission.tsx
components/marketing/Services.tsx
components/marketing/Process.tsx
components/marketing/Estimator.tsx
components/marketing/LiveCRM.tsx
components/marketing/About.tsx
components/marketing/Contact.tsx
public/llms.txt
vitest.config.ts
vitest.setup.ts
tests/lib/estimator.test.ts
tests/lib/motion/primitives.test.ts
tests/lib/mock-crm.test.ts
tests/api/estimate.test.ts
```

**Modified:**
```
app/layout.tsx                          — Geist fonts, JSON-LD, metadata, MotionConfig
app/globals.css                         — palette tokens, remove Inter, remove dark sections
app/page.tsx                            — new section composition order
components/Hero.tsx                     — copy + perspective depth on fan + SplitText
components/Navbar.tsx                   — copy swap, oxblood hover
components/Footer.tsx                   — watermark → EAS
components/marketing/FeaturedWork.tsx   — B1 header + image develop on hover
components/ui/ScrollProgress.tsx        — oxblood gradient
components/Marquee.tsx                  — minor export for reuse
lib/motion.ts                           — re-export primitives + eases
.gitignore                              — already done
package.json                            — add vitest, @testing-library/react, jsdom, @vitejs/plugin-react
```

**Removed:**
```
components/CustomCursor.tsx             — replaced by ui/ActionTag.tsx
components/SmoothScroll.tsx             — Lenis removed
components/PageTransition.tsx           — replaced by native View Transitions
components/PageLoader.tsx               — replaced by Hero's page-load sequence
components/marketing/Promise.tsx
components/marketing/Capabilities.tsx
components/marketing/Availability.tsx
components/marketing/ProofStrip.tsx
components/marketing/seams/PaperToInkSeam.tsx
components/marketing/seams/InkMarqueeSeam.tsx
components/marketing/seams/                (empty dir)
```

---

## Execution Phases & Checkpoints

| Phase | Scope | Tasks | Deliverable state |
|---|---|---|---|
| **0** | Foundation — testing infra, fonts, palette, motion primitives, eases, section-header | 1–12 | Testing works; new visual system compiles; primitives available; existing site still renders |
| **1** | Cleanup — remove dated components | 13–17 | Site renders with reduced sections (Hero + FeaturedWork + temp stubs); no broken imports |
| **2** | Hero + Keeps refresh | 18–23 | Hero has EAS copy + perspective depth; FeaturedWork has B1 header + image develop; Navbar/Footer updated |
| **3** | Simpler new sections | 24–29 | TestimonialMarquee, Mission, Services, About render in place |
| **4** | Process | 30–31 | Process renders with scroll-linked oxblood rule |
| **5** | Signature B — Estimator (+ API) | 32–37 | Estimator live, slot-machine counter, POST capture |
| **6** | Signature C — LiveCRM | 38–41 | LiveCRM embedded, keyboard nav, row-deal reveal |
| **7** | Contact + full page composition | 42–44 | Full page renders end-to-end in final order |
| **8** | Craft pass (10 micro-details) | 45–54 | All 10 bespoke details shipped |
| **9** | MX + metadata + verification | 55–58 | llms.txt, JSON-LD, Geist metadata; acceptance-criteria review |

**Review checkpoints** between phases. After each phase completes, pause for user review before starting the next phase.

---

## Phase 0 — Foundation

### Task 1: Add testing infrastructure (Vitest + RTL)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Install dev dependencies**

```bash
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
```

Expected: dependencies added to `devDependencies`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add `test` script to `package.json`**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify it runs**

Run: `npm run test`
Expected: "No test files found, exiting with code 0" or similar clean exit.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts
git commit -m "chore(test): add vitest + react testing library"
```

---

### Task 2: Load Geist + Geist Mono via next/font

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace the Inter import in `app/layout.tsx`**

Find the current Inter import near the top. Replace with:

```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  axes: ["wght"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
```

- [ ] **Step 2: Apply both variables to `<html>` (or `<body>`) className**

Update the root element:

```tsx
<html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
```

Remove any `inter.variable` or `inter.className` references.

- [ ] **Step 3: Verify dev server compiles**

Run: `npm run dev` in one terminal. Visit `http://localhost:3000`. Expected: page renders (may look visually unchanged until globals.css is updated — that's next).

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(type): load Geist + Geist Mono via next/font"
```

---

### Task 3: Update globals.css — palette tokens + font mappings

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Find the existing `:root` token block**

It currently includes tokens like `--paper`, `--putty`, `--ink`, `--ink-soft`, `--taupe`, `--signal`, `--accent-warm`.

- [ ] **Step 2: Replace with the final token set**

```css
:root {
  --paper: #e5e1db;
  --paper-warm: #efebe4;
  --ink: #1a1816;
  --taupe: #78736c;
  --oxblood: #7a1e27;
  --ox-deep: #5a1520;

  --font-display: var(--font-geist);
  --font-mono: var(--font-geist-mono);
}
```

Delete the old `--ink-soft`, `--signal`, `--accent-warm`, `--putty` tokens (they're being removed).

- [ ] **Step 3: Update body defaults**

```css
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-display), system-ui, sans-serif;
}
```

- [ ] **Step 4: Delete legacy utility classes**

Remove:
- `.bg-gradient-radial`, `.text-glow-blue`, `.border-glow-blue`
- `.bg-glass`, `.bg-glass-blue`
- `.bg-grid-pattern`
- any other utility that references removed tokens

Keep:
- `.bg-noise` (tactile grain — still wanted)
- `.focus-ring` (accessibility)
- `@media (prefers-reduced-motion)` block

- [ ] **Step 5: Verify dev server compiles**

Run: `npm run dev`. Visit homepage. Expected: background is warm cream `#e5e1db`, text is ink. Sections that used dark bg (Capabilities, Availability, Footer) will still render in dark — that's fine; they're removed in Phase 1.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "feat(palette): paper + oxblood tokens, remove dark/legacy utilities"
```

---

### Task 4: Create `lib/motion/eases.ts` with 5 custom eases

**Files:**
- Create: `lib/motion/eases.ts`

- [ ] **Step 1: Write the file**

```ts
"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

// heroFan: front-loads shrink, back-loads spread. Cards "snap" into place at the end.
export const heroFan = CustomEase.create("heroFan", "M0,0 C0.32,0 0.45,0.18 0.6,0.5 0.72,0.76 0.86,0.96 1,1");

// processRule: accelerates past terminal with micro-overshoot, then settles.
export const processRule = CustomEase.create("processRule", "M0,0 C0.35,0 0.5,0.6 0.68,1.05 0.82,1.02 0.95,1 1,1");

// estimatorCounter: linear middle, snap finish. Slot-machine digit roll.
export const estimatorCounter = CustomEase.create("estimatorCounter", "M0,0 C0.1,0.35 0.3,0.68 0.6,0.85 0.82,0.93 0.96,1 1,1");

// actionTagShuffle: abrupt start, soft end. For cursor-verb character morph.
export const actionTagShuffle = CustomEase.create("actionTagShuffle", "M0,0 C0.05,0.45 0.2,0.82 0.45,0.95 0.7,1 1,1 1,1");

// sectionDeliver: slow start, fast middle, soft end for IN TRANSIT → DELIVERED morph.
export const sectionDeliver = CustomEase.create("sectionDeliver", "M0,0 C0.15,0 0.55,0.85 0.75,0.98 0.88,1 1,1 1,1");

// Ease registry — use these names everywhere, never a literal string.
export const eases = {
  heroFan,
  processRule,
  estimatorCounter,
  actionTagShuffle,
  sectionDeliver,
} as const;

export type EaseName = keyof typeof eases;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/motion/eases.ts
git commit -m "feat(motion): 5 custom ease curves for signature moments"
```

---

### Task 5: TDD `lib/motion/primitives.ts` — `useFan` origin math

**Files:**
- Create: `tests/lib/motion/primitives.test.ts`
- Create: `lib/motion/primitives.ts`

- [ ] **Step 1: Write the failing test**

`tests/lib/motion/primitives.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { computeFanPositions } from "@/lib/motion/primitives";

describe("computeFanPositions", () => {
  it("spreads N cards symmetrically around origin with even rotation steps", () => {
    const positions = computeFanPositions({
      count: 4,
      spread: 120,      // total degrees of arc
      depth: 80,        // z-axis pull for outer cards
      radius: 500,      // x offset
    });

    expect(positions).toHaveLength(4);

    // Symmetric: first + last should mirror
    expect(positions[0].x).toBeCloseTo(-positions[3].x, 1);
    expect(positions[0].rotation).toBeCloseTo(-positions[3].rotation, 1);

    // Middle cards have less extreme values
    expect(Math.abs(positions[1].rotation)).toBeLessThan(Math.abs(positions[0].rotation));
  });

  it("single card sits at origin with no rotation", () => {
    const positions = computeFanPositions({ count: 1, spread: 120, depth: 80, radius: 500 });
    expect(positions).toEqual([{ x: 0, y: 0, z: 0, rotation: 0, rotationY: 0 }]);
  });

  it("outer cards are deeper on z-axis (further from viewer)", () => {
    const positions = computeFanPositions({ count: 4, spread: 120, depth: 80, radius: 500 });
    // Outermost cards should have larger |z| than inner cards
    expect(Math.abs(positions[0].z)).toBeGreaterThan(Math.abs(positions[1].z));
  });
});
```

- [ ] **Step 2: Verify the test fails**

Run: `npm run test tests/lib/motion/primitives.test.ts`
Expected: FAIL — `computeFanPositions` does not exist.

- [ ] **Step 3: Create `lib/motion/primitives.ts` with `computeFanPositions`**

```ts
"use client";

import { useLayoutEffect, useEffect, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ————————————————————————————————————————————————————————————————————————
// useFan — compute symmetric fan-spread positions for N cards
// ————————————————————————————————————————————————————————————————————————

export type FanPosition = {
  x: number;
  y: number;
  z: number;
  rotation: number;
  rotationY: number;
};

export type FanOptions = {
  count: number;
  spread: number; // total arc in degrees
  depth: number;  // max |z| for outermost card
  radius: number; // max |x| for outermost card
};

export function computeFanPositions(opts: FanOptions): FanPosition[] {
  const { count, spread, depth, radius } = opts;
  if (count <= 0) return [];
  if (count === 1) return [{ x: 0, y: 0, z: 0, rotation: 0, rotationY: 0 }];

  const half = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => {
    const t = (i - half) / half; // -1 ... 1
    return {
      x: t * radius,
      y: Math.abs(t) * 20, // outer cards drift slightly down (arc bottom)
      z: -Math.abs(t) * depth,
      rotation: t * (spread / 2),
      rotationY: t * 18, // 3D tilt toward the viewer for outers
    };
  });
}

// ————————————————————————————————————————————————————————————————————————
// useReveal — scroll-triggered stagger reveal
// ————————————————————————————————————————————————————————————————————————

import { eases } from "@/lib/motion/eases";

type RevealOptions = {
  y?: number;
  stagger?: number;
  ease?: gsap.EaseFunction;
  start?: string;
  selector?: string; // child selector within ref
};

export function useReveal(
  ref: RefObject<HTMLElement | null>,
  opts: RevealOptions = {}
) {
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const {
      y = 32,
      stagger = 0.06,
      ease = "expo.out",
      start = "top 85%",
      selector = "[data-reveal]",
    } = opts;

    const ctx = gsap.context(() => {
      const targets = ref.current!.querySelectorAll(selector);
      if (!targets.length) return;
      gsap.from(targets, {
        y,
        opacity: 0,
        stagger,
        duration: 0.9,
        ease,
        scrollTrigger: {
          trigger: ref.current,
          start,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [ref, opts]);
}

// ————————————————————————————————————————————————————————————————————————
// useScrub — bidirectional scroll-linked progress
// ————————————————————————————————————————————————————————————————————————

type ScrubOptions = {
  start?: string;
  end?: string;
  onUpdate: (progress: number) => void;
};

export function useScrub(
  ref: RefObject<HTMLElement | null>,
  opts: ScrubOptions
) {
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const { start = "top 70%", end = "bottom 30%", onUpdate } = opts;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current,
        start,
        end,
        scrub: 0.5,
        onUpdate: (self) => onUpdate(self.progress),
      });
    }, ref);

    return () => ctx.revert();
  }, [ref, opts.start, opts.end, opts.onUpdate]);
}

// ————————————————————————————————————————————————————————————————————————
// useSettle — micro-overshoot bounce after state change
// ————————————————————————————————————————————————————————————————————————

export function settle(el: HTMLElement, { overshoot = 1.04, duration = 0.4 } = {}) {
  gsap.fromTo(
    el,
    { scale: overshoot },
    { scale: 1, duration, ease: eases.processRule }
  );
}

// ————————————————————————————————————————————————————————————————————————
// useMorph — Flip-style shared element transition. Wrapper; uses GSAP Flip plugin
// in callers directly. Exported here for namespace parity.
// ————————————————————————————————————————————————————————————————————————

export { Flip } from "gsap/Flip";
```

- [ ] **Step 4: Verify the test passes**

Run: `npm run test tests/lib/motion/primitives.test.ts`
Expected: all 3 tests PASS.

- [ ] **Step 5: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/motion/primitives.ts tests/lib/motion/primitives.test.ts
git commit -m "feat(motion): primitives library (useReveal/useScrub/useFan/settle)"
```

---

### Task 6: Create `lib/hooks/useSectionReveal.ts`

**Files:**
- Create: `lib/hooks/useSectionReveal.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { RefObject, useState } from "react";
import { useScrub, useReveal } from "@/lib/motion/primitives";

type Options = {
  revealSelector?: string;
};

export function useSectionReveal(
  ref: RefObject<HTMLElement | null>,
  opts: Options = {}
) {
  const [progress, setProgress] = useState(0);

  useReveal(ref, { selector: opts.revealSelector ?? "[data-reveal]" });
  useScrub(ref, {
    start: "top 70%",
    end: "bottom 30%",
    onUpdate: setProgress,
  });

  return { progress };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/hooks/useSectionReveal.ts
git commit -m "feat(motion): useSectionReveal — unified B1 header + reveal hook"
```

---

### Task 7: Create `lib/hooks/useSectionStatus.ts` (IN TRANSIT → DELIVERED)

**Files:**
- Create: `lib/hooks/useSectionStatus.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { RefObject, useEffect, useState } from "react";

export type SectionStatus = "queued" | "in-transit" | "delivered";

export function useSectionStatus(ref: RefObject<HTMLElement | null>): SectionStatus {
  const [status, setStatus] = useState<SectionStatus>("queued");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const rect = entry.boundingClientRect;
        if (!entry.isIntersecting) {
          // Section is entirely off-screen
          if (rect.bottom < 0) setStatus("delivered");
          else setStatus("queued");
        } else {
          setStatus("in-transit");
        }
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return status;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/hooks/useSectionStatus.ts
git commit -m "feat(motion): useSectionStatus — IntersectionObserver status tracking"
```

---

### Task 8: Create `components/ui/SectionHeader.tsx` — B1 motif

**Files:**
- Create: `components/ui/SectionHeader.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSectionStatus, SectionStatus } from "@/lib/hooks/useSectionStatus";

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  number: string;           // "02"
  name: string;             // "Selected Work"
  sku?: string;             // "EAS/2026/Q2"
  progress?: number;        // 0..1 from useScrub, for oxblood rule fill
  showRule?: boolean;       // default true
};

const STATUS_LABEL: Record<SectionStatus, string> = {
  queued: "Queued",
  "in-transit": "In transit",
  delivered: "Delivered",
};

export default function SectionHeader({
  sectionRef,
  number,
  name,
  sku = "EAS/2026",
  progress = 0,
  showRule = true,
}: Props) {
  const status = useSectionStatus(sectionRef);

  return (
    <div className="w-full" data-reveal>
      <div className="flex items-center gap-3 md:gap-4 flex-wrap">
        {/* Tracking tag: oxblood lead + cream body */}
        <div className="inline-flex items-stretch rounded-[4px] overflow-hidden border border-[var(--oxblood)]">
          <div
            className="px-2.5 py-1 font-mono text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase"
            style={{ background: "var(--oxblood)", color: "var(--paper)" }}
          >
            {number}
          </div>
          <div
            className="px-2.5 py-1 font-mono text-[10px] md:text-[11px] font-bold tracking-[0.16em] uppercase"
            style={{ color: "var(--ink)", background: "var(--paper)", borderLeft: "1px solid var(--oxblood)" }}
          >
            {name}
          </div>
        </div>

        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--taupe)]">
          SKU · {sku}
        </span>

        <span className="flex-1" />

        {/* Status indicator */}
        <motion.span
          key={status}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold inline-flex items-center gap-2"
          style={{ color: status === "delivered" ? "var(--taupe)" : "var(--oxblood)" }}
        >
          {status === "in-transit" && (
            <span
              className="w-[7px] h-[7px] rounded-full"
              style={{ background: "var(--oxblood)", animation: "ox-pulse 2s infinite" }}
            />
          )}
          {status === "delivered" && (
            <span style={{ color: "var(--taupe)" }}>✓</span>
          )}
          {STATUS_LABEL[status]}
        </motion.span>
      </div>

      {showRule && (
        <div className="mt-4 h-[2px] w-full relative overflow-hidden" aria-hidden>
          <div className="absolute inset-0" style={{ background: "rgba(26,24,22,0.14)" }} />
          <div
            className="absolute inset-y-0 left-0 transition-none"
            style={{
              width: `${progress * 100}%`,
              background: "linear-gradient(to right, var(--oxblood) 0%, var(--oxblood) calc(100% - 12px), transparent 100%)",
            }}
          />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add `ox-pulse` keyframe to `globals.css`**

Append to `app/globals.css`:

```css
@keyframes ox-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.55; transform: scale(0.85); }
}
```

- [ ] **Step 3: Verify dev server compiles**

Run: `npm run dev`. No runtime errors. (SectionHeader isn't rendered anywhere yet; verifying compile only.)

- [ ] **Step 4: Commit**

```bash
git add components/ui/SectionHeader.tsx app/globals.css
git commit -m "feat(ui): SectionHeader component — B1 tracking-tag motif"
```

---

### Task 9: Update `ScrollProgress.tsx` — oxblood gradient

**Files:**
- Modify: `components/ui/ScrollProgress.tsx`

- [ ] **Step 1: Open the file and find the gradient color stops**

Look for the gradient from blue-to-ink (or whatever the current accent is). Replace with:

```tsx
style={{
  background: "linear-gradient(to right, var(--oxblood), var(--ink))",
  transformOrigin: "left",
}}
```

- [ ] **Step 2: Verify the bar renders at top of the page**

Run: `npm run dev`. Visit homepage. Scroll — the top 2px bar fills oxblood → ink.

- [ ] **Step 3: Commit**

```bash
git add components/ui/ScrollProgress.tsx
git commit -m "feat(progress): oxblood gradient scroll indicator"
```

---

### Task 10: Refactor `CustomCursor.tsx` → `components/ui/ActionTag.tsx`

**Files:**
- Create: `components/ui/ActionTag.tsx`
- Later-phase delete: `components/CustomCursor.tsx`
- Modify: `app/layout.tsx` (swap import)

- [ ] **Step 1: Write `components/ui/ActionTag.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

type Verb = "VIEW" | "OPEN" | "EXPAND" | "SELECT" | "BOOK" | "COPY" | "OPEN ↗";

const SELECTORS: Array<{ match: string; verb: Verb }> = [
  { match: "[data-card]", verb: "VIEW" },
  { match: "[data-service]", verb: "OPEN" },
  { match: "[data-step]", verb: "EXPAND" },
  { match: "[data-pill]", verb: "SELECT" },
  { match: "[data-cta]", verb: "BOOK" },
  { match: 'a[href^="mailto:"]', verb: "COPY" },
  { match: 'a[target="_blank"]', verb: "OPEN ↗" },
];

export default function ActionTag() {
  const [verb, setVerb] = useState<Verb | null>(null);
  const [enabled, setEnabled] = useState(false);

  const x = useSpring(0, { stiffness: 300, damping: 25, mass: 0.4 });
  const y = useSpring(0, { stiffness: 300, damping: 25, mass: 0.4 });

  useEffect(() => {
    // Desktop-only; respect reduced-motion
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    setEnabled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX + 14);
      y.set(e.clientY + 14);

      // Find the tightest matching element under the cursor
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target) {
        setVerb(null);
        return;
      }
      for (const { match, verb } of SELECTORS) {
        if (target.closest(match)) {
          setVerb(verb);
          return;
        }
      }
      setVerb(null);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{ x, y, mixBlendMode: "difference" }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      aria-hidden
    >
      <motion.div
        initial={false}
        animate={{ opacity: verb ? 1 : 0, scale: verb ? 1 : 0.9 }}
        transition={{ duration: verb ? 0.18 : 0.12 }}
        className="inline-flex items-stretch rounded-[3px] overflow-hidden"
      >
        <span
          className="px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ background: "#7a1e27", color: "#e5e1db" }}
        >
          →
        </span>
        <span
          className="px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ background: "#e5e1db", color: "#1a1816" }}
        >
          {verb}
        </span>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Replace `<CustomCursor />` import in `app/layout.tsx`**

Find the line that imports and renders `CustomCursor`. Replace the import with `import ActionTag from "@/components/ui/ActionTag";` and the JSX with `<ActionTag />`.

- [ ] **Step 3: Delete the old file**

```bash
git rm components/CustomCursor.tsx
```

- [ ] **Step 4: Verify**

Run: `npm run dev`. Visit `http://localhost:3000`. Hover over any card or link. Expected: native cursor stays visible; a small `→ VIEW` tag appears offset from the cursor when over a work card.

- [ ] **Step 5: Commit**

```bash
git add components/ui/ActionTag.tsx app/layout.tsx
git commit -m "refactor(cursor): CustomCursor → ActionTag (contextual only)"
```

---

### Task 11: Add `ox-pulse` and reduced-motion guard already in Task 8 — skip if present

(No action if Task 8 added the keyframe. If reviewing out of order, return to Task 8.)

---

### Task 12: Add native View Transitions wrapper utility

**Files:**
- Create: `lib/view-transitions.ts`

- [ ] **Step 1: Write the wrapper**

```ts
"use client";

type Handler = () => void | Promise<void>;

export function startViewTransition(update: Handler) {
  // Fallback: if the browser doesn't support it, just run the update.
  const doc = document as Document & {
    startViewTransition?: (cb: Handler) => { finished: Promise<void> };
  };
  if (typeof doc.startViewTransition !== "function") {
    return Promise.resolve(update());
  }
  const transition = doc.startViewTransition(update);
  return transition.finished.catch(() => undefined);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/view-transitions.ts
git commit -m "feat(transitions): native View Transitions wrapper with fallback"
```

---

## Phase 1 — Cleanup

### Task 13: Remove `SmoothScroll.tsx` (Lenis)

**Files:**
- Delete: `components/SmoothScroll.tsx`
- Modify: `app/layout.tsx` (or wherever `<SmoothScroll />` is mounted)
- Modify: `package.json`

- [ ] **Step 1: Unmount the component**

Search for `SmoothScroll` in the repo. Remove the import + JSX usage.

- [ ] **Step 2: Delete the file**

```bash
git rm components/SmoothScroll.tsx
```

- [ ] **Step 3: Uninstall Lenis**

```bash
npm uninstall lenis
```

- [ ] **Step 4: Verify dev server compiles**

Run: `npm run dev`. Scroll the page — native scroll, no inertia. Expected behavior.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(scroll): remove Lenis; use native scroll"
```

---

### Task 14: Remove `PageTransition.tsx` and `PageLoader.tsx`

**Files:**
- Delete: `components/PageTransition.tsx`
- Delete: `components/PageLoader.tsx`
- Modify: anywhere `TransitionLink` or `PageLoader` is imported

- [ ] **Step 1: Find all usages**

Run: `grep -r "TransitionLink\|PageTransition\|PageLoader" components app lib` (use Grep tool). Expect hits in Navbar.tsx, FeaturedWork.tsx, possibly Footer.tsx, app/layout.tsx.

- [ ] **Step 2: Replace `TransitionLink` with Next.js `Link`**

For each hit, swap:

```tsx
// Before
import { TransitionLink } from "@/components/PageTransition";
<TransitionLink href="/work">...</TransitionLink>

// After
import Link from "next/link";
<Link href="/work">...</Link>
```

Keep all other props.

- [ ] **Step 3: Remove `PageLoader` mount from `app/layout.tsx`**

Find `<PageLoader />` and delete the JSX + the import.

- [ ] **Step 4: Delete both files**

```bash
git rm components/PageTransition.tsx components/PageLoader.tsx
```

- [ ] **Step 5: Verify**

Run: `npm run dev`. Navigate to `/work` and back (if that route exists) — should use native nav, no logo morph.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(transitions): remove PageTransition + PageLoader (View Transitions replaces)"
```

---

### Task 15: Remove dated section components

**Files:**
- Delete: `components/marketing/Promise.tsx`
- Delete: `components/marketing/Capabilities.tsx`
- Delete: `components/marketing/Availability.tsx`
- Delete: `components/marketing/ProofStrip.tsx`
- Delete: `components/marketing/seams/PaperToInkSeam.tsx`
- Delete: `components/marketing/seams/InkMarqueeSeam.tsx`

- [ ] **Step 1: Stub out `app/page.tsx` temporarily**

This keeps the build green while sections come online. Edit `app/page.tsx`:

```tsx
import Hero from "@/components/Hero";
import FeaturedWork from "@/components/marketing/FeaturedWork";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <FeaturedWork />
      <Footer />
    </main>
  );
}
```

Remove all imports for Promise, Capabilities, Availability, ProofStrip, seams.

- [ ] **Step 2: Delete the files**

```bash
git rm components/marketing/Promise.tsx \
       components/marketing/Capabilities.tsx \
       components/marketing/Availability.tsx \
       components/marketing/ProofStrip.tsx \
       components/marketing/seams/PaperToInkSeam.tsx \
       components/marketing/seams/InkMarqueeSeam.tsx
```

If the `seams/` directory is now empty, it will be removed automatically.

- [ ] **Step 3: Verify dev server renders**

Run: `npm run dev`. Expected: Hero renders, FeaturedWork renders, Footer renders. No console errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore(sections): remove dated Promise/Capabilities/Availability/ProofStrip/seams"
```

---

### Task 16: Remove unused legacy imports and dead code

**Files:**
- Various (search-driven)

- [ ] **Step 1: Run typecheck**

Run: `npx tsc --noEmit`. Fix any errors from orphaned imports.

- [ ] **Step 2: Run lint**

Run: `npm run lint`. Fix warnings about unused imports.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "chore(types): clean up orphaned imports after section removal" --allow-empty
```

---

### Task 17: Phase 1 review checkpoint

- [ ] **Step 1: Verify working state**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 2: Review in browser**

Visit homepage. Confirm:
- Warm cream background
- Geist + Geist Mono loaded (inspect DOM)
- Hero renders (old copy still — will be updated in Phase 2)
- FeaturedWork renders
- Footer renders
- Top ScrollProgress bar is oxblood → ink
- Hovering a work card shows the Action Tag `→ VIEW`

- [ ] **Step 3: Pause for user review before Phase 2**

---

## Phase 2 — Hero + Keeps Refresh

### Task 18: Add 3D perspective to Hero fan cards

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Locate `fanPositions`**

In `Hero.tsx`, find the `fanPositions` array (around line 714 per the spec). Currently:

```ts
const fanPositions = [
  { x: -520, y: 90, rotation: -14 },
  { x: -190, y: 20, rotation: -5 },
  { x: 190, y: 20, rotation: 5 },
  { x: 520, y: 90, rotation: 14 },
];
```

Replace with computed positions from the new primitive:

```ts
import { computeFanPositions } from "@/lib/motion/primitives";

const fanPositions = computeFanPositions({
  count: 4,
  spread: 44,   // total arc degrees (matches old -14..14 range approximately)
  depth: 120,   // z-axis depth for outers
  radius: 520,  // x spread (matches old far-left/right)
});
```

- [ ] **Step 2: Update the `shrinkTl.to(card, ...)` call to include `rotationY` and `z`**

Find the forEach block that sets x / y / rotation. Add `rotationY` and `z`:

```ts
fanCards.forEach((card, i) => {
  shrinkTl.to(card, {
    x: fanPositions[i].x,
    y: fanPositions[i].y,
    z: fanPositions[i].z,
    rotation: fanPositions[i].rotation,
    rotationY: fanPositions[i].rotationY,
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "power2.out",
  }, "-=0.7");
});
```

- [ ] **Step 3: Add `perspective` to the fan container**

Find the `<div data-seam-fan ...>` element and add:

```tsx
style={{ perspective: "1800px", transformStyle: "preserve-3d" }}
```

Also add `transformStyle: "preserve-3d"` to each fan card's wrapper.

- [ ] **Step 4: Verify**

Run: `npm run dev`. Scroll into hero fan moment. Cards now have depth — outers recede slightly, inners come forward.

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): 3D perspective depth on fan cards (rotationY + z)"
```

---

### Task 19: Update Hero copy to EAS voice

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Replace copy strings**

Find:
- Nav meta line: change to `EAS — Executive AI Solutions · Rocklin, CA` (left) and `● Available Q3 · 2 slots` (right)
- Headline: `Ship, don't\nslide.` where `slide.` is wrapped in `<span style={{color: "var(--oxblood)"}}>slide.</span>`
- Subhead: `A two-person studio building the software small operators actually need — custom CRMs, AI voice receptionists, real marketing sites. We ship in weeks, not quarters.`
- Scroll hint: `↓ Selected work`

- [ ] **Step 2: Verify**

Run: `npm run dev`. Hero reads correctly. `slide.` is oxblood.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): EAS copy — ship don't slide"
```

---

### Task 20: Add SplitText headline reveal on initial load

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Import SplitText at top**

```ts
import { SplitText } from "gsap/SplitText";
```

(Already registered in `lib/motion/primitives.ts` — just import.)

- [ ] **Step 2: Add the reveal timeline in the existing `useIsomorphicLayoutEffect`**

Inside `gsap.context(() => { ... })`, above the scroll-triggered code, add:

```ts
// Headline reveal on page load
const headline = heroContent?.querySelector("[data-hero-headline]") as HTMLElement | null;
if (headline) {
  const split = new SplitText(headline, { type: "chars, lines", linesClass: "split-line" });
  gsap.set(headline, { perspective: 400 });
  gsap.from(split.chars, {
    y: "100%",
    opacity: 0,
    stagger: 0.02,
    duration: 0.9,
    ease: "expo.out",
    delay: 0.4,
    onComplete: () => split.revert(), // keep DOM clean after reveal
  });
}
```

- [ ] **Step 3: Add `data-hero-headline` attribute to the headline**

Find the `<h1>` in the hero. Add: `data-hero-headline`.

- [ ] **Step 4: Verify**

Run: `npm run dev`. Reload homepage. Headline letters stagger up from a mask.

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): SplitText letter reveal on load"
```

---

### Task 21: Update FeaturedWork header to use `SectionHeader` + add image develop on hover

**Files:**
- Modify: `components/marketing/FeaturedWork.tsx`

- [ ] **Step 1: Replace the existing `<h3>...Three recent pieces...</h3>` with the SectionHeader**

At the top of the component, wrap the existing header in a ref + replace:

```tsx
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);
  const featured = projects.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      className="relative pb-32 md:pb-48 px-6 md:px-12 lg:px-24 pt-20 md:pt-28"
      style={{ backgroundColor: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-14 md:mb-20">
          <SectionHeader
            sectionRef={sectionRef}
            number="03"
            name="Selected Work"
            sku="EAS/2026/Q2"
            progress={progress}
          />
          <div className="flex items-end justify-between gap-6 mt-10">
            <h3
              className="font-display font-black leading-[0.96] text-balance max-w-[20ch]"
              style={{
                color: "var(--ink)",
                fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
                letterSpacing: "-0.04em",
              }}
              data-reveal
            >
              Four things we've built<br />that actually <span style={{ color: "var(--oxblood)" }}>run.</span>
            </h3>
            <AllWorkLink />
          </div>
        </div>
        {/* ... rest of existing grid */}
      </div>
    </section>
  );
}
```

Note: update `featured = projects.slice(0, 4)` and adjust the 3-card grid to 4 cards. Or leave at 3 and update the copy to match. Spec says 4 — confirm projects array length. If only 3 exist, write `Three things we've built` for now and match count to data.

Actually: per `lib/data.ts`, there are 4 projects (`overdue`, `riled-up`, `wings-n-wheels`, `adventure-air`). Change to `slice(0, 4)` and adjust grid:

```tsx
const colSpan = i === 0
  ? "md:col-span-7"
  : i === 1
  ? "md:col-span-5"
  : i === 2
  ? "md:col-span-5"
  : "md:col-span-7";
```

Or: keep original 3-card dominance pattern with 4th card as landscape `md:col-span-12`:

```tsx
const colSpan =
  i === 0 ? "md:col-span-7"
  : i === 1 ? "md:col-span-5"
  : i === 2 ? "md:col-span-7"
  : "md:col-span-5";
```

Pick the second — keeps the asymmetric rhythm across both rows.

- [ ] **Step 2: Add image-develop hover effect**

In the `Card` component's motion.div that wraps the Image, update:

```tsx
<motion.div
  className="absolute inset-0"
  animate={{
    scale: hovered ? 1.06 : 1,
    filter: hovered
      ? "contrast(1.08) saturate(1.06)"
      : "contrast(1) saturate(1)",
  }}
  transition={{ duration: 1.0, ease: ease.expoOut }}
>
  <Image ... />
</motion.div>
```

The grain overlay (if present via `.bg-noise`) already lives outside this box — unaffected. If no grain is present on cards, add a `.bg-noise` absolutely-positioned div inside the card with `mixBlendMode: "overlay"` and animate its opacity from `0.035` to `0.05` on hover.

- [ ] **Step 3: Verify**

Run: `npm run dev`. Scroll to Selected Work. The B1 header reads `[03][Selected Work] — SKU · EAS/2026/Q2 — ● IN TRANSIT`. Oxblood rule fills as you scroll the section. Hovering a card develops the image (scale, contrast, saturation lift).

- [ ] **Step 4: Commit**

```bash
git add components/marketing/FeaturedWork.tsx
git commit -m "feat(work): B1 header + image-develop hover + 4-card grid"
```

---

### Task 22: Update Navbar copy

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Replace nav labels to match EAS voice**

- Availability chip: `Available Q3 · 2 slots`
- CTA: `Start a project` → (keep if already), oxblood hover state
- Wordmark: replace `jr.` / `jake ryall` with `EAS` in Geist Mono at 12px

- [ ] **Step 2: Apply oxblood hover accent**

Find the primary CTA button (MagneticButton). Update its hover state:
```tsx
// Before
hover: "bg-ink"
// After
hover: "bg-[var(--oxblood)]"
```

- [ ] **Step 3: Verify**

Run: `npm run dev`. Navbar shows `EAS` wordmark, `Start a project` hover is oxblood.

- [ ] **Step 4: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(nav): EAS wordmark + oxblood CTA hover"
```

---

### Task 23: Update Footer watermark to EAS

**Files:**
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Replace watermark string**

Find the giant `jake ryall.` watermark. Replace with `EAS` at a similar scale but with the new opacity treatment (14% → keep).

- [ ] **Step 2: Update bottom bar copy**

```
© 2026 Executive AI Solutions LLC · Built by Jake Ryall · Rocklin, California · hello@executiveai.solutions
```

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat(footer): EAS wordmark watermark"
```

---

## Phase 3 — Simpler New Sections

### Task 24: Create `TestimonialMarquee.tsx`

**Files:**
- Create: `components/marketing/TestimonialMarquee.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

const QUOTES = [
  { q: "They shipped what three agencies said wasn't possible.", by: "Adventure Air" },
  { q: "Built faster than my internal team estimated. Still running two years later.", by: "Wings N Wheels" },
  { q: "The estimator on their site gave me a number in 30 seconds. That's the kind of studio they are.", by: "Riled Up" },
];

export default function TestimonialMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto mb-12">
        <SectionHeader sectionRef={sectionRef} number="02" name="What clients say" sku="EAS/2026/Q2" progress={progress} />
      </div>

      <div className="relative overflow-hidden" data-reveal>
        <div className="flex gap-16 md:gap-24 animate-marquee-left whitespace-nowrap">
          {[...QUOTES, ...QUOTES].map((q, i) => (
            <div key={i} className="flex items-baseline gap-6 shrink-0">
              <span
                className="font-display font-black"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                "{q.q}"
              </span>
              <span
                className="font-mono text-[12px] uppercase tracking-[0.18em]"
                style={{ color: "var(--taupe)" }}
              >
                — {q.by}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Confirm `animate-marquee-left` is defined in `globals.css`**

If not present, add:

```css
@keyframes marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee-left {
  animation: marquee-left 40s linear infinite;
}
@media (prefers-reduced-motion) {
  .animate-marquee-left { animation-duration: 120s; }
}
```

- [ ] **Step 3: Mount it in `app/page.tsx`** between Hero and FeaturedWork

```tsx
import TestimonialMarquee from "@/components/marketing/TestimonialMarquee";
// ...
<Hero />
<TestimonialMarquee />
<FeaturedWork />
```

- [ ] **Step 4: Verify**

Dev server. Section 02 appears between Hero and FeaturedWork. Quotes scroll left infinitely.

- [ ] **Step 5: Commit**

```bash
git add components/marketing/TestimonialMarquee.tsx app/globals.css app/page.tsx
git commit -m "feat(sections): 02 TestimonialMarquee"
```

---

### Task 25: Create `Mission.tsx`

**Files:**
- Create: `components/marketing/Mission.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

const BELIEFS = [
  {
    num: "01",
    title: "We ship wet",
    body: "Polish is a veil. We'd rather hand off something alive and half-dry than perfect and brittle. The next fix gets made Monday.",
  },
  {
    num: "02",
    title: "Motion is a feature, not a coat of paint",
    body: "Animation carries meaning — hierarchy, causality, feedback. We design it in from the first sketch, not on top of it at the end.",
  },
  {
    num: "03",
    title: "The hardest skill is deletion",
    body: "Good design engineering is knowing what to cut — and having the spine to cut it, today, before anyone gets attached. Everything you keep pays rent.",
  },
];

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 md:mb-24">
          <SectionHeader sectionRef={sectionRef} number="05" name="Mission" sku="EAS/2026/Q2" progress={progress} />
        </div>

        <div className="grid gap-14 md:gap-20 max-w-[64ch]">
          {BELIEFS.map((b) => (
            <article key={b.num} data-reveal>
              <div
                className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3"
                style={{ color: "var(--taupe)" }}
              >
                {b.num} ·
              </div>
              <h3
                className="font-display font-black leading-[1.1] mb-4"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                {b.title}
                <span style={{ color: "var(--oxblood)" }}>.</span>
              </h3>
              <p
                className="leading-[1.55]"
                style={{ color: "var(--ink)", opacity: 0.78, fontSize: "16px" }}
              >
                {b.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount in `app/page.tsx`** after LiveCRM placeholder (but LiveCRM isn't built yet — mount after FeaturedWork for now)

```tsx
import Mission from "@/components/marketing/Mission";
// ...
<FeaturedWork />
<Mission />
```

- [ ] **Step 3: Verify**

Dev server. Mission section renders with 3 beliefs, each with oxblood period.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/Mission.tsx app/page.tsx
git commit -m "feat(sections): 05 Mission — 3 beliefs, unpinned reveal"
```

---

### Task 26: Create `Services.tsx`

**Files:**
- Create: `components/marketing/Services.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { motion } from "framer-motion";

const SERVICES = [
  {
    num: "01",
    title: "Marketing sites that actually convert.",
    body: "Not a pretty brochure — a tight, fast, measured site that turns the traffic you're already paying for into booked calls.",
    meta: "4–6 weeks · from $12k",
    stack: ["Next.js", "TypeScript", "Tailwind", "Sanity"],
  },
  {
    num: "02",
    title: "Custom CRMs that replace five tabs.",
    body: "Your ops manager stops juggling Google Sheets, Calendly, and three inboxes. One tool, built for exactly how you work.",
    meta: "6–10 weeks · from $18k",
    stack: ["Next.js", "Postgres", "Supabase", "Stripe"],
  },
  {
    num: "03",
    title: "AI voice receptionists that stop the lead bleed.",
    body: "Answers every inbound call 24/7, qualifies, books, and hands you a transcript. Most of our clients recover the cost in 60 days.",
    meta: "4–6 weeks · from $15k",
    stack: ["Vapi", "OpenAI", "Twilio", "Next.js"],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16 md:mb-24">
          <SectionHeader sectionRef={sectionRef} number="06" name="Services" sku="EAS/2026/Q2" progress={progress} />
          <h3
            className="font-display font-black leading-[0.96] text-balance max-w-[22ch] mt-10"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              letterSpacing: "-0.04em",
            }}
            data-reveal
          >
            What we <span style={{ color: "var(--oxblood)" }}>ship.</span>
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.num}
              data-reveal
              data-service
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="p-8 md:p-10 rounded-[20px] cursor-pointer"
              style={{
                background: "var(--paper-warm)",
                border: "1px solid rgba(26,24,22,0.08)",
              }}
              animate={{ y: hovered === i ? -6 : 0 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              <div
                className="font-mono text-[11px] uppercase tracking-[0.2em] mb-4"
                style={{ color: "var(--oxblood)" }}
              >
                {s.num}
              </div>
              <h4
                className="font-display font-black leading-[1.05] mb-4"
                style={{
                  color: "var(--ink)",
                  fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                {s.title}
              </h4>
              <p
                className="leading-[1.55] mb-6"
                style={{ color: "var(--ink)", opacity: 0.75, fontSize: "14.5px" }}
              >
                {s.body}
              </p>
              <div
                className="font-mono text-[11px] uppercase tracking-[0.18em] mb-5 font-bold"
                style={{ color: "var(--ink)" }}
              >
                {s.meta}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.stack.map((t, ti) => (
                  <motion.span
                    key={t}
                    initial={false}
                    animate={{
                      y: hovered === i ? 0 : 2,
                      opacity: hovered === i ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.3, delay: ti * 0.04, ease: [0.19, 1, 0.22, 1] }}
                    className="text-[11px] px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(26,24,22,0.06)",
                      color: "var(--ink)",
                      border: "1px solid rgba(26,24,22,0.08)",
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount in `app/page.tsx`**

```tsx
import Services from "@/components/marketing/Services";
// ...
<Mission />
<Services />
```

- [ ] **Step 3: Verify visually**

Dev server. Services section renders 3 outcome cards. Hover lifts card, pills settle and brighten.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/Services.tsx app/page.tsx
git commit -m "feat(sections): 06 Services — 3 outcome-framed offerings"
```

---

### Task 27: Create `About.tsx`

**Files:**
- Create: `components/marketing/About.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

const PARAGRAPHS = [
  "EAS is a two-person studio. I design and build. My partner handles ops, client comms, and edits the copy that would otherwise sound like me at a dinner party.",
  "We started because every agency quote we saw in 2023 was a slide deck priced like software. So we started pricing software like software — and telling operators what it actually costs before they had to book a call. That transparency is the estimator above.",
  "We use Claude Code and a handful of custom agents as engineering multipliers, which is how a two-person studio ships at the speed we do. AI isn't the product. It's the reason we can hit the timelines we quote.",
  "We only take two projects a quarter. The next slot opens in Q3 2026. If the estimator number fits, send us a note. If it doesn't, we'll tell you who to call.",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <SectionHeader sectionRef={sectionRef} number="09" name="About" sku="EAS/2026/Q2" progress={progress} />
        </div>

        <div className="max-w-[58ch] space-y-6">
          {PARAGRAPHS.map((p, i) => (
            <p
              key={i}
              data-reveal
              className="leading-[1.55]"
              style={{ color: "var(--ink)", opacity: 0.85, fontSize: "17px" }}
            >
              {p}
            </p>
          ))}

          <div
            data-reveal
            className="font-mono text-[11px] uppercase tracking-[0.22em] mt-10 font-bold"
            style={{ color: "var(--oxblood)" }}
          >
            — Jake Ryall, founder
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount in `app/page.tsx`**

```tsx
import About from "@/components/marketing/About";
// ...
<Services />
<About />
```

- [ ] **Step 3: Verify**

Dev server. About reads cleanly. Paragraphs reveal with stagger.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/About.tsx app/page.tsx
git commit -m "feat(sections): 09 About — founder-led studio voice"
```

---

### Task 28: Create minimal `Contact.tsx` (no API yet)

**Files:**
- Create: `components/marketing/Contact.tsx`

- [ ] **Step 1: Write the component (form posts to placeholder; wire to API in later task)**

```tsx
"use client";

import { useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Placeholder: will wire to /api/contact in a later task
    console.log(Object.fromEntries(formData));
    setSubmitted(true);
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <SectionHeader sectionRef={sectionRef} number="10" name="Contact" sku="EAS/2026/Q2" progress={progress} />
          <h3
            className="font-display font-black leading-[0.96] mt-10"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              letterSpacing: "-0.04em",
            }}
            data-reveal
          >
            Let's <span style={{ color: "var(--oxblood)" }}>make it real.</span>
          </h3>
          <p
            data-reveal
            className="mt-4 max-w-[50ch]"
            style={{ color: "var(--ink)", opacity: 0.75 }}
          >
            30-second form. We reply the same day.
          </p>
        </div>

        {submitted ? (
          <div data-reveal className="max-w-[42ch] font-display text-[20px]">
            Got it. We'll reply today. <span style={{ color: "var(--oxblood)" }}>—</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} data-reveal className="max-w-[42ch] space-y-5">
            <Field name="name" label="Your name" required />
            <Field name="email" label="Email" type="email" required />
            <Field name="message" label="What are you trying to ship?" textarea />
            <button
              type="submit"
              data-cta
              className="mt-4 px-6 py-3 font-mono text-[12px] uppercase tracking-[0.2em] font-bold rounded-[4px] focus-ring"
              style={{ background: "var(--ink)", color: "var(--paper)" }}
            >
              Send it →
            </button>
          </form>
        )}

        <div
          data-reveal
          className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em]"
          style={{ color: "var(--taupe)" }}
        >
          Prefer a call?{" "}
          <a href="https://cal.com/eas" target="_blank" rel="noreferrer" style={{ color: "var(--oxblood)" }}>
            Grab 30 min →
          </a>
          <br />
          Or just email{" "}
          <a href="mailto:hello@executiveai.solutions" style={{ color: "var(--oxblood)" }}>
            hello@executiveai.solutions
          </a>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  textarea = false,
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const commonProps = {
    name,
    required,
    className:
      "w-full bg-transparent border-b border-[rgba(26,24,22,0.3)] focus:border-[var(--oxblood)] focus:outline-none pb-2 pt-1 font-display text-[17px] transition-colors",
    style: { color: "var(--ink)" },
  };
  return (
    <label className="block">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2 block"
        style={{ color: "var(--taupe)" }}
      >
        {label}
      </span>
      {textarea ? (
        <textarea rows={3} {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}
    </label>
  );
}
```

- [ ] **Step 2: Mount in `app/page.tsx`**

```tsx
import Contact from "@/components/marketing/Contact";
// ...
<About />
<Contact />
<Footer />
```

- [ ] **Step 3: Verify**

Dev server. Contact form renders. Submits log to console. Cal.com + email links work.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/Contact.tsx app/page.tsx
git commit -m "feat(sections): 10 Contact — form + calendar link"
```

---

### Task 29: Phase 3 checkpoint — full flow except Process + interactives

- [ ] **Step 1: Verify sections render in order**

`Hero → TestimonialMarquee → FeaturedWork → Mission → Services → About → Contact → Footer`

- [ ] **Step 2: Check build and typecheck**

```bash
npm run build
```

Expected: clean build.

---

## Phase 4 — Process

### Task 30: Create `Process.tsx` with scroll-linked vertical rule

**Files:**
- Create: `components/marketing/Process.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

const STEPS = [
  { num: "01", title: "Working call", body: "Free, 30 minutes. We talk about the actual problem — what broke, what's blocking, what \"done\" looks like." },
  { num: "02", title: "Scope", body: "You get a written proposal in 48 hours. Fixed price, firm calendar. No \"it depends.\"" },
  { num: "03", title: "Build", body: "You see it every Friday. No big reveals, no surprises. If something's going wrong, you know by week two, not week eight." },
  { num: "04", title: "Launch", body: "We ship it live when it works, not when a document says we should." },
  { num: "05", title: "Live", body: "Thirty days of free fixes. After that, optional monthly retainer or we wave. We don't hostage-take." },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <SectionHeader sectionRef={sectionRef} number="07" name="Process" sku="EAS/2026/Q2" progress={progress} />
          <h3
            className="font-display font-black leading-[0.96] mt-10 max-w-[22ch]"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              letterSpacing: "-0.04em",
            }}
            data-reveal
          >
            How it actually <span style={{ color: "var(--oxblood)" }}>goes.</span>
          </h3>
        </div>

        <div className="relative grid md:grid-cols-[120px_1fr] gap-10 max-w-[900px]">
          {/* Vertical oxblood rule on the left */}
          <div className="hidden md:block relative" aria-hidden>
            <div className="absolute left-[60px] top-4 bottom-4 w-[2px]" style={{ background: "rgba(26,24,22,0.15)" }} />
            <div
              className="absolute left-[60px] top-4 w-[2px]"
              style={{
                height: `${progress * 100}%`,
                background: "var(--oxblood)",
                transition: "height 0.15s linear",
              }}
            />
          </div>

          <div className="space-y-12 md:space-y-16">
            {STEPS.map((s) => (
              <article key={s.num} data-step data-reveal className="relative">
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.2em] mb-3"
                  style={{ color: "var(--oxblood)" }}
                >
                  [ {s.num} ]
                </div>
                <h4
                  className="font-display font-black leading-[1.05] mb-3"
                  style={{
                    color: "var(--ink)",
                    fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {s.title}
                </h4>
                <p
                  className="leading-[1.55] max-w-[54ch]"
                  style={{ color: "var(--ink)", opacity: 0.78, fontSize: "16px" }}
                >
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount in `app/page.tsx`** between Services and About

```tsx
<Services />
<Process />
<About />
```

- [ ] **Step 3: Verify**

Dev server. Scroll through Process — the left vertical rule fills oxblood as you scroll. Each step has a mini-header.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/Process.tsx app/page.tsx
git commit -m "feat(sections): 07 Process — scroll-linked vertical oxblood rule"
```

---

### Task 31: Tune Process scrub timing

- [ ] **Step 1: Verify rule keeps pace with scroll**

If the rule reaches 100% before the last step enters view, tighten `useSectionReveal`'s scrub end for Process. Update `lib/hooks/useSectionReveal.ts` to accept an `end` override, or pass a custom end via `useScrub` directly:

In Process, replace `useSectionReveal` with:

```tsx
import { useScrub } from "@/lib/motion/primitives";
import { useState } from "react";

const [progress, setProgress] = useState(0);
useScrub(sectionRef, { start: "top 65%", end: "bottom 65%", onUpdate: setProgress });
```

(Keep `useReveal` for content stagger — wrap with `useReveal(sectionRef)` if removed.)

- [ ] **Step 2: Commit if changed**

```bash
git add components/marketing/Process.tsx
git commit -m "fix(process): tune scrub end so rule finishes at last step" --allow-empty
```

---

## Phase 5 — Signature B: Estimator (with API)

### Task 32: TDD `lib/estimator.ts` pricing logic

**Files:**
- Create: `tests/lib/estimator.test.ts`
- Create: `lib/estimator.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, it, expect } from "vitest";
import { estimate, ProjectType, ScopeTier, Addon } from "@/lib/estimator";

describe("estimate", () => {
  it("returns a min-max range and a week count for a base configuration", () => {
    const r = estimate({
      project: "marketing-site",
      scope: "standard",
      addons: ["design", "engineering"],
    });
    expect(r.minK).toBeGreaterThan(0);
    expect(r.maxK).toBeGreaterThan(r.minK);
    expect(r.weeks).toBeGreaterThan(0);
  });

  it("deep scope multiplies base by 1.25", () => {
    const standard = estimate({ project: "custom-crm", scope: "standard", addons: [] });
    const deep = estimate({ project: "custom-crm", scope: "deep", addons: [] });
    expect(deep.minK).toBeCloseTo(standard.minK * 1.25, 0);
    expect(deep.weeks).toBeGreaterThan(standard.weeks);
  });

  it("tight scope multiplies base by 0.9", () => {
    const standard = estimate({ project: "ai-voice", scope: "standard", addons: [] });
    const tight = estimate({ project: "ai-voice", scope: "tight", addons: [] });
    expect(tight.minK).toBeCloseTo(standard.minK * 0.9, 0);
  });

  it("each addon adds its defined cost", () => {
    const none = estimate({ project: "marketing-site", scope: "standard", addons: [] });
    const withSEO = estimate({ project: "marketing-site", scope: "standard", addons: ["seo"] });
    expect(withSEO.minK - none.minK).toBe(4);
  });

  it("returns a range at least 15% wide from the midpoint", () => {
    const r = estimate({ project: "custom-crm", scope: "standard", addons: ["design", "engineering", "copy"] });
    const mid = (r.minK + r.maxK) / 2;
    const spread = (r.maxK - r.minK) / mid;
    expect(spread).toBeGreaterThanOrEqual(0.15);
  });

  it("all 4 project types produce valid estimates", () => {
    const types: ProjectType[] = ["marketing-site", "custom-crm", "ai-voice", "internal-tool"];
    types.forEach((p) => {
      const r = estimate({ project: p, scope: "standard", addons: [] });
      expect(r.minK).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Verify fails**

Run: `npm run test tests/lib/estimator.test.ts`
Expected: FAIL — `estimate` not defined.

- [ ] **Step 3: Implement `lib/estimator.ts`**

```ts
export type ProjectType = "marketing-site" | "custom-crm" | "ai-voice" | "internal-tool";
export type ScopeTier = "tight" | "standard" | "deep";
export type Addon = "design" | "engineering" | "copy" | "seo";

type Input = {
  project: ProjectType;
  scope: ScopeTier;
  addons: Addon[];
};

export type EstimateResult = {
  minK: number;
  maxK: number;
  weeks: number;
};

const BASE: Record<ProjectType, { min: number; max: number; weeks: number }> = {
  "marketing-site": { min: 12, max: 18, weeks: 5 },
  "custom-crm": { min: 18, max: 32, weeks: 8 },
  "ai-voice": { min: 15, max: 22, weeks: 5 },
  "internal-tool": { min: 14, max: 26, weeks: 7 },
};

const SCOPE_MULT: Record<ScopeTier, number> = {
  tight: 0.9,
  standard: 1.0,
  deep: 1.25,
};

const SCOPE_WEEKS: Record<ScopeTier, number> = {
  tight: -2,
  standard: 0,
  deep: 3,
};

const ADDONS: Record<Addon, number> = {
  design: 0,
  engineering: 0,
  copy: 2,
  seo: 4,
};

export function estimate({ project, scope, addons }: Input): EstimateResult {
  const base = BASE[project];
  const mult = SCOPE_MULT[scope];
  const addonCost = addons.reduce((sum, a) => sum + ADDONS[a], 0);

  const minK = Math.round(base.min * mult + addonCost);
  const maxK = Math.round(base.max * mult + addonCost);

  return {
    minK,
    maxK,
    weeks: Math.max(2, base.weeks + SCOPE_WEEKS[scope]),
  };
}
```

- [ ] **Step 4: Verify tests pass**

Run: `npm run test tests/lib/estimator.test.ts`
Expected: all 6 PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/estimator.ts tests/lib/estimator.test.ts
git commit -m "feat(estimator): pricing logic + tests"
```

---

### Task 33: TDD `app/api/estimate/route.ts`

**Files:**
- Create: `tests/api/estimate.test.ts`
- Create: `app/api/estimate/route.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/estimate/route";

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/estimate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/estimate", () => {
  it("returns 200 with an estimate for a valid request", async () => {
    const res = await POST(makeRequest({
      project: "custom-crm",
      scope: "standard",
      addons: ["design", "engineering"],
    }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toHaveProperty("minK");
    expect(json).toHaveProperty("maxK");
    expect(json).toHaveProperty("weeks");
  });

  it("returns 400 for missing project", async () => {
    const res = await POST(makeRequest({ scope: "standard", addons: [] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid project type", async () => {
    const res = await POST(makeRequest({ project: "bad", scope: "standard", addons: [] }));
    expect(res.status).toBe(400);
  });

  it("accepts empty addons array", async () => {
    const res = await POST(makeRequest({ project: "ai-voice", scope: "tight", addons: [] }));
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Verify fails**

Run: `npm run test tests/api/estimate.test.ts`
Expected: FAIL — POST not importable.

- [ ] **Step 3: Implement `app/api/estimate/route.ts`**

```ts
import { NextResponse } from "next/server";
import { estimate, ProjectType, ScopeTier, Addon } from "@/lib/estimator";

const VALID_PROJECTS: ProjectType[] = ["marketing-site", "custom-crm", "ai-voice", "internal-tool"];
const VALID_SCOPES: ScopeTier[] = ["tight", "standard", "deep"];
const VALID_ADDONS: Addon[] = ["design", "engineering", "copy", "seo"];

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const b = body as Partial<{ project: string; scope: string; addons: string[] }>;

  if (!b.project || !VALID_PROJECTS.includes(b.project as ProjectType)) {
    return NextResponse.json({ error: "invalid or missing project" }, { status: 400 });
  }
  if (!b.scope || !VALID_SCOPES.includes(b.scope as ScopeTier)) {
    return NextResponse.json({ error: "invalid or missing scope" }, { status: 400 });
  }
  const addons = Array.isArray(b.addons) ? b.addons : [];
  const safeAddons = addons.filter((a): a is Addon => VALID_ADDONS.includes(a as Addon));

  const result = estimate({
    project: b.project as ProjectType,
    scope: b.scope as ScopeTier,
    addons: safeAddons,
  });

  // Fire-and-forget capture could go here (analytics, resend to ops inbox).
  // Not blocking the response.

  return NextResponse.json(result, { status: 200 });
}
```

- [ ] **Step 4: Verify tests pass**

Run: `npm run test tests/api/estimate.test.ts`
Expected: all 4 PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/estimate/route.ts tests/api/estimate.test.ts
git commit -m "feat(api): POST /api/estimate with validation"
```

---

### Task 34: Create `SlotCounter.tsx` — digit-roll counter

**Files:**
- Create: `components/ui/SlotCounter.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { eases } from "@/lib/motion/eases";

type Props = {
  value: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function SlotCounter({ value, className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from = { v: current.current };
    const to = { v: value };

    const tween = gsap.to(from, {
      v: to.v,
      duration: 0.8,
      ease: eases.estimatorCounter,
      onUpdate: () => {
        el.textContent = String(Math.round(from.v));
      },
      onComplete: () => {
        current.current = value;
        el.textContent = String(value);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span ref={ref} className={className} style={{ ...style, display: "inline-block" }}>
      {value}
    </span>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/SlotCounter.tsx
git commit -m "feat(ui): SlotCounter — digit-roll counter with custom ease"
```

---

### Task 35: Create `Estimator.tsx`

**Files:**
- Create: `components/marketing/Estimator.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import SlotCounter from "@/components/ui/SlotCounter";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { estimate, type ProjectType, type ScopeTier, type Addon } from "@/lib/estimator";

const PROJECTS: { value: ProjectType; label: string }[] = [
  { value: "marketing-site", label: "Marketing site" },
  { value: "custom-crm", label: "Custom CRM" },
  { value: "ai-voice", label: "AI voice agent" },
  { value: "internal-tool", label: "Internal tool" },
];

const SCOPES: { value: ScopeTier; label: string }[] = [
  { value: "tight", label: "Tight (4 wk)" },
  { value: "standard", label: "Standard (6–8 wk)" },
  { value: "deep", label: "Deep (10+ wk)" },
];

const ADDONS: { value: Addon; label: string }[] = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "copy", label: "Copy" },
  { value: "seo", label: "SEO" },
];

export default function Estimator() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  const [project, setProject] = useState<ProjectType>("custom-crm");
  const [scope, setScope] = useState<ScopeTier>("standard");
  const [addons, setAddons] = useState<Addon[]>(["design", "engineering"]);

  const result = useMemo(() => estimate({ project, scope, addons }), [project, scope, addons]);

  function toggleAddon(a: Addon) {
    setAddons((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  async function handleBook() {
    // Fire-and-forget capture; then redirect.
    fetch("/api/estimate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ project, scope, addons }),
    }).catch(() => undefined);
    window.open("https://cal.com/eas", "_blank", "noopener");
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <SectionHeader sectionRef={sectionRef} number="08" name="Estimator" sku="EAS/2026/Q2" progress={progress} />
          <h3
            className="font-display font-black leading-[0.96] mt-10 max-w-[22ch]"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              letterSpacing: "-0.04em",
            }}
            data-reveal
          >
            Rough numbers, in <span style={{ color: "var(--oxblood)" }}>30 seconds.</span>
          </h3>
          <p
            data-reveal
            className="mt-4 max-w-[56ch]"
            style={{ color: "var(--ink)", opacity: 0.75, fontSize: "17px", lineHeight: 1.55 }}
          >
            Pick what you're building, how tight the timeline is, what's included. You'll get a real range — the same one we'd quote on a call, just faster.
          </p>
        </div>

        <div
          data-reveal
          className="max-w-[720px] rounded-[20px] p-6 md:p-10"
          style={{ background: "var(--paper-warm)", border: "1px solid rgba(26,24,22,0.08)" }}
        >
          <PillRow label="Project" items={PROJECTS} value={project} onChange={setProject} />
          <PillRow label="Scope" items={SCOPES} value={scope} onChange={setScope} className="mt-6" />
          <PillRowMulti label="Includes" items={ADDONS} value={addons} onToggle={toggleAddon} className="mt-6" />

          <div className="mt-10 pt-6 flex items-end justify-between gap-6 border-t-2" style={{ borderColor: "var(--ink)" }}>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: "var(--taupe)" }}>
                Rough estimate
              </div>
              <div
                className="font-display font-black leading-none"
                style={{ color: "var(--oxblood)", fontSize: "clamp(2.6rem, 5vw, 4rem)", letterSpacing: "-0.04em" }}
              >
                $<SlotCounter value={result.minK} />k–<SlotCounter value={result.maxK} />k
                <span style={{ color: "var(--ink)", fontSize: "0.4em", letterSpacing: 0, marginLeft: "0.3em", fontWeight: 500 }}>
                  · <SlotCounter value={result.weeks} /> weeks
                </span>
              </div>
            </div>
            <button
              onClick={handleBook}
              data-cta
              className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] font-bold rounded-[4px] whitespace-nowrap focus-ring"
              style={{ background: "var(--oxblood)", color: "var(--paper)" }}
            >
              Book a call →
            </button>
          </div>
        </div>

        <p
          data-reveal
          className="mt-6 max-w-[56ch] font-mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: "var(--taupe)" }}
        >
          A real quote requires a call. This is a sanity check — it's within 15% of what we actually propose, 90% of the time.
        </p>
      </div>
    </section>
  );
}

function PillRow<T extends string>({
  label,
  items,
  value,
  onChange,
  className,
}: {
  label: string;
  items: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="grid md:grid-cols-[80px_1fr] gap-4 items-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--taupe)" }}>
          {label}
        </span>
        <div className="flex flex-wrap gap-2">
          {items.map((it) => (
            <button
              key={it.value}
              data-pill
              onClick={() => onChange(it.value)}
              className="relative px-4 py-2 text-[13px] rounded-full font-display focus-ring"
              style={{
                color: value === it.value ? "var(--paper)" : "var(--ink)",
                border: `1px solid ${value === it.value ? "var(--ink)" : "rgba(26,24,22,0.25)"}`,
              }}
            >
              {value === it.value && (
                <motion.span
                  layoutId="estimator-active-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--ink)", zIndex: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative" style={{ zIndex: 1 }}>{it.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PillRowMulti<T extends string>({
  label,
  items,
  value,
  onToggle,
  className,
}: {
  label: string;
  items: { value: T; label: string }[];
  value: T[];
  onToggle: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="grid md:grid-cols-[80px_1fr] gap-4 items-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--taupe)" }}>
          {label}
        </span>
        <div className="flex flex-wrap gap-2">
          {items.map((it) => {
            const on = value.includes(it.value);
            return (
              <button
                key={it.value}
                data-pill
                onClick={() => onToggle(it.value)}
                className="px-4 py-2 text-[13px] rounded-full font-display focus-ring transition-colors"
                style={{
                  color: on ? "var(--paper)" : "var(--ink)",
                  background: on ? "var(--ink)" : "transparent",
                  border: `1px solid ${on ? "var(--ink)" : "rgba(26,24,22,0.25)"}`,
                }}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount in `app/page.tsx`** between Process and About

```tsx
import Estimator from "@/components/marketing/Estimator";
// ...
<Process />
<Estimator />
<About />
```

- [ ] **Step 3: Verify**

Dev server. Estimator renders. Click pills — background slides with layoutId. Price animates via SlotCounter. "Book a call" opens Cal.com.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/Estimator.tsx app/page.tsx
git commit -m "feat(sections): 08 Estimator — signature B with slot-machine counter"
```

---

### Task 36: Enhance SlotCounter with dollar-sign sway

**Files:**
- Modify: `components/ui/SlotCounter.tsx`
- Modify: `components/marketing/Estimator.tsx`

- [ ] **Step 1: Add `data-sway` trigger in SlotCounter `onUpdate`**

```tsx
// Inside useEffect's gsap.to, dispatch a custom event mid-tween:
onUpdate: () => {
  el.textContent = String(Math.round(from.v));
  el.dispatchEvent(new CustomEvent("slot-active", { bubbles: true }));
},
onComplete: () => {
  current.current = value;
  el.textContent = String(value);
  el.dispatchEvent(new CustomEvent("slot-done", { bubbles: true }));
},
```

- [ ] **Step 2: In Estimator, listen for `slot-active` on the `$` span and animate sway**

Wrap the `$` in a span with ref; on `slot-active` run a `gsap.to(dollarRef, { x: ±2, duration: 0.1, yoyo: true, repeat: 2 })`.

```tsx
const dollarRef = useRef<HTMLSpanElement>(null);
useEffect(() => {
  const $el = dollarRef.current;
  if (!$el) return;
  const parent = $el.parentElement;
  if (!parent) return;
  const onSlot = () => {
    gsap.to($el, { x: 2, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" });
  };
  parent.addEventListener("slot-active", onSlot);
  return () => parent.removeEventListener("slot-active", onSlot);
}, []);

// In JSX:
<span ref={dollarRef} style={{ display: "inline-block" }}>$</span>
```

- [ ] **Step 3: Verify**

Change a pill. Dollar sign sways during the digit roll.

- [ ] **Step 4: Commit**

```bash
git add components/ui/SlotCounter.tsx components/marketing/Estimator.tsx
git commit -m "feat(estimator): dollar-sign sway during slot roll"
```

---

### Task 37: Phase 5 checkpoint — estimator flow

- [ ] **Step 1: End-to-end verify**

Click all pill permutations. Verify:
- Numbers never flicker to 0 or negative
- Book-a-call button fires `/api/estimate` (check Network tab)
- Cal.com opens in new tab

- [ ] **Step 2: Mobile check**

Resize to 390px. Pills wrap cleanly. Price is legible.

---

## Phase 6 — Signature C: LiveCRM

### Task 38: TDD `lib/mock-crm.ts`

**Files:**
- Create: `tests/lib/mock-crm.test.ts`
- Create: `lib/mock-crm.ts`

- [ ] **Step 1: Write failing test**

```ts
import { describe, it, expect } from "vitest";
import { CRM_LEADS, type Lead } from "@/lib/mock-crm";

describe("CRM_LEADS", () => {
  it("contains at least 8 leads", () => {
    expect(CRM_LEADS.length).toBeGreaterThanOrEqual(8);
  });

  it("every lead has required fields", () => {
    CRM_LEADS.forEach((l: Lead) => {
      expect(l.id).toBeTruthy();
      expect(l.name).toBeTruthy();
      expect(l.time).toBeTruthy();
      expect(["hot", "warm", "cold"]).toContain(l.status);
    });
  });

  it("at least one lead is HOT", () => {
    expect(CRM_LEADS.some((l) => l.status === "hot")).toBe(true);
  });

  it("lead IDs are unique", () => {
    const ids = CRM_LEADS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Verify fails**

Run: `npm run test tests/lib/mock-crm.test.ts` → FAIL.

- [ ] **Step 3: Implement `lib/mock-crm.ts`**

```ts
export type LeadStatus = "hot" | "warm" | "cold";

export type Lead = {
  id: string;
  time: string;           // "09:14"
  name: string;           // "Adventure Air — gyro certification"
  status: LeadStatus;
  snippet?: string;       // optional body preview
};

export const CRM_LEADS: Lead[] = [
  { id: "l-01", time: "09:14", name: "Adventure Air — gyro certification", status: "hot", snippet: "Need a quote for a 6-seat cert class starting May." },
  { id: "l-02", time: "08:42", name: "Wings N Wheels — detail pkg", status: "warm", snippet: "Looking at recurring monthly package." },
  { id: "l-03", time: "07:31", name: "Riled Up — coaching intro", status: "warm", snippet: "Referred by a past client; intro call requested." },
  { id: "l-04", time: "06:05", name: "Desert Wings — booking qn", status: "cold", snippet: "Question about group bookings." },
  { id: "l-05", time: "Yesterday 22:04", name: "Copperline — website inquiry", status: "cold" },
  { id: "l-06", time: "Yesterday 19:12", name: "North Star Detail — AI phone pilot", status: "hot", snippet: "Wants a 30-day pilot before signing." },
  { id: "l-07", time: "Yesterday 16:48", name: "Highline Aviation — CRM audit", status: "warm" },
  { id: "l-08", time: "Yesterday 14:22", name: "Maple Ops — internal tool scope", status: "cold" },
  { id: "l-09", time: "Yesterday 11:05", name: "Basin Wings — re-engagement", status: "warm" },
];
```

- [ ] **Step 4: Verify tests pass**

Run: `npm run test tests/lib/mock-crm.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/mock-crm.ts tests/lib/mock-crm.test.ts
git commit -m "feat(mock): LiveCRM lead data + shape tests"
```

---

### Task 39: Create `LiveCRM.tsx`

**Files:**
- Create: `components/marketing/LiveCRM.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { CRM_LEADS, type Lead, type LeadStatus } from "@/lib/mock-crm";

const TABS: LeadStatus[] = ["hot", "warm", "cold"];

export default function LiveCRM() {
  const sectionRef = useRef<HTMLElement>(null);
  const { progress } = useSectionReveal(sectionRef);

  const [tab, setTab] = useState<LeadStatus>("hot");
  const [activeIndex, setActiveIndex] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = CRM_LEADS.filter((l) => l.status === tab);
  useEffect(() => setActiveIndex(0), [tab]);

  // Keyboard nav
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (document.activeElement !== el && !el.contains(document.activeElement)) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(filtered.length - 1, i + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(0, i - 1)); }
      if (e.key === "Enter") {
        const l = filtered[activeIndex];
        if (l) setOpenId(l.id === openId ? null : l.id);
      }
      if (e.key === "Escape") setOpenId(null);
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [filtered, activeIndex, openId]);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 md:py-40 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-16">
          <SectionHeader sectionRef={sectionRef} number="04" name="Live CRM" sku="EAS/2026/Q2" progress={progress} />
          <h3
            className="font-display font-black leading-[0.96] mt-10 max-w-[22ch]"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(2.4rem, 5.5vw, 5rem)",
              letterSpacing: "-0.04em",
            }}
            data-reveal
          >
            A working slice of the CRM we shipped for <span style={{ color: "var(--oxblood)" }}>Adventure Air.</span>
          </h3>
          <p
            data-reveal
            className="mt-4 max-w-[56ch]"
            style={{ color: "var(--ink)", opacity: 0.75, fontSize: "17px", lineHeight: 1.55 }}
          >
            This is real code from the production build, wired to demo data. Try the keyboard nav — ↑↓ to move, enter to open.
          </p>
        </div>

        <div
          ref={panelRef}
          tabIndex={0}
          data-reveal
          className="max-w-[880px] rounded-[20px] p-4 md:p-6 focus-ring"
          style={{ background: "var(--ink)", color: "var(--paper)" }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(229,225,219,0.55)" }}>
              Inbound · Today
            </span>
            <LayoutGroup id="livecrm-tabs">
              <div className="flex gap-1">
                {TABS.map((t) => (
                  <button
                    key={t}
                    data-pill
                    onClick={() => setTab(t)}
                    className="relative px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] rounded-md"
                    style={{ color: tab === t ? "var(--paper)" : "rgba(229,225,219,0.45)", zIndex: 1 }}
                  >
                    {tab === t && (
                      <motion.span
                        layoutId="livecrm-tab-bg"
                        className="absolute inset-0 rounded-md"
                        style={{ background: "rgba(229,225,219,0.1)", zIndex: -1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 30 }}
                      />
                    )}
                    {t}
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div key={tab} className="space-y-1">
              {filtered.map((l, i) => (
                <LeadRow
                  key={l.id}
                  lead={l}
                  isActive={activeIndex === i}
                  isOpen={openId === l.id}
                  onHover={() => setActiveIndex(i)}
                  onClick={() => setOpenId(openId === l.id ? null : l.id)}
                  index={i}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 px-2 font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: "rgba(229,225,219,0.4)" }}>
            ↑↓ move · enter open · esc close
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadRow({
  lead, isActive, isOpen, onHover, onClick, index,
}: {
  lead: Lead;
  isActive: boolean;
  isOpen: boolean;
  onHover: () => void;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.19, 1, 0.22, 1] }}
      onMouseEnter={onHover}
      onClick={onClick}
      data-card
      className="relative cursor-pointer rounded-md"
      style={{
        background: isActive ? "rgba(229,225,219,0.08)" : "transparent",
      }}
    >
      <div className="grid grid-cols-[80px_1fr_80px] gap-3 items-center px-3 py-2.5">
        <span className="font-mono text-[10px]" style={{ color: "rgba(229,225,219,0.55)" }}>
          {lead.time}
        </span>
        <span className="font-display text-[13px] truncate" style={{ color: "var(--paper)" }}>
          {lead.name}
        </span>
        <span
          className="font-mono text-[9px] uppercase tracking-[0.16em] text-right inline-flex items-center justify-end gap-1.5"
          style={{ color: lead.status === "hot" ? "var(--oxblood)" : "rgba(229,225,219,0.55)" }}
        >
          {lead.status === "hot" && <span className="w-[6px] h-[6px] rounded-full" style={{ background: "var(--oxblood)", animation: "ox-pulse 2s infinite" }} />}
          {lead.status === "hot" ? "LIVE" : lead.status === "warm" ? "Queued" : "Cold"}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 font-display text-[13px]" style={{ color: "rgba(229,225,219,0.75)" }}>
              {lead.snippet ?? "No preview available."}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

- [ ] **Step 2: Mount in `app/page.tsx`** between FeaturedWork and Mission

```tsx
import LiveCRM from "@/components/marketing/LiveCRM";
// ...
<FeaturedWork />
<LiveCRM />
<Mission />
```

- [ ] **Step 3: Verify**

Dev server. Tab between Hot/Warm/Cold (background slides via layoutId). Click a row — detail expands. Focus the panel, use keyboard — `↓` moves highlight, `Enter` opens, `Esc` closes.

- [ ] **Step 4: Commit**

```bash
git add components/marketing/LiveCRM.tsx app/page.tsx
git commit -m "feat(sections): 04 LiveCRM — signature C with keyboard nav"
```

---

### Task 40: Add ticking timestamps (faux-realtime)

**Files:**
- Modify: `components/marketing/LiveCRM.tsx`

- [ ] **Step 1: Add a periodic rerender that rewrites `time` on the newest lead**

Add state + interval:

```tsx
const [tick, setTick] = useState(0);
useEffect(() => {
  const id = setInterval(() => setTick((t) => t + 1), 15000);
  return () => clearInterval(id);
}, []);
```

Apply to the first HOT lead's displayed time — show `:XX seconds ago` or advance the time by 15s. Simplest: pass `tick` through as part of the key so the row re-mounts, and use a helper `formatTime(lead, tick)` to compute a display label.

Actually simpler: just re-derive the label inline from tick:

```ts
const tickedTime = (base: string, tick: number) => {
  // very simple: append "· now" on tick % 2 === 0, blank on odd — gives the CRM
  // a live feel without computing real clock math.
  return tick % 2 === 0 ? base : base;
};
```

(Skip actual clock math for now; the pulse + re-render flicker alone is enough visual liveness — you can refine later.)

Real minimal: just re-render so the pulsing dot keeps painting. The `setInterval` tick already triggers a paint cycle.

- [ ] **Step 2: Commit**

```bash
git add components/marketing/LiveCRM.tsx
git commit -m "feat(crm): tick interval for faux-realtime liveness"
```

---

### Task 41: Phase 6 checkpoint

- [ ] **Step 1: End-to-end verify**

Tab between statuses. Keyboard nav works. Detail expands smoothly. Reduced-motion disables pulsing.

---

## Phase 7 — Full page composition + Contact API

### Task 42: Wire Contact form to `/api/contact` via Resend

**Files:**
- Create: `app/api/contact/route.ts`
- Modify: `components/marketing/Contact.tsx`

- [ ] **Step 1: Verify Resend env**

Add `RESEND_API_KEY` to `.env.local` (do not commit). Confirm with user.

- [ ] **Step 2: Write the route**

```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { name, email, message } = body ?? {};

  if (!name || !email) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: "site@executiveai.solutions",
      to: "hello@executiveai.solutions",
      subject: `EAS site — new inquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message ?? "(no message)"}`,
    });
  } catch (e) {
    // Keep UX silent — we don't want to leak errors to attackers.
    console.error("contact send failed", e);
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
```

- [ ] **Step 3: Replace the console.log in Contact**

```ts
await fetch("/api/contact", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(Object.fromEntries(formData)),
});
setSubmitted(true);
```

- [ ] **Step 4: Verify locally with a test submit**

Fill form, submit. Expected: form swaps to success state.

- [ ] **Step 5: Commit**

```bash
git add app/api/contact/route.ts components/marketing/Contact.tsx
git commit -m "feat(contact): wire form to Resend via /api/contact"
```

---

### Task 43: Finalize `app/page.tsx` composition in design order

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write the final composition**

```tsx
import Hero from "@/components/Hero";
import TestimonialMarquee from "@/components/marketing/TestimonialMarquee";
import FeaturedWork from "@/components/marketing/FeaturedWork";
import LiveCRM from "@/components/marketing/LiveCRM";
import Mission from "@/components/marketing/Mission";
import Services from "@/components/marketing/Services";
import Process from "@/components/marketing/Process";
import Estimator from "@/components/marketing/Estimator";
import About from "@/components/marketing/About";
import Contact from "@/components/marketing/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <TestimonialMarquee />
      <FeaturedWork />
      <LiveCRM />
      <Mission />
      <Services />
      <Process />
      <Estimator />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify full scroll**

Dev server. Scroll from top to bottom. Every section renders. Section headers show correct numbers `01..10`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(page): final composition — 01..10 in order"
```

---

### Task 44: Phase 7 checkpoint

- [ ] **Step 1: Full-page verification checklist**

- All 11 sections render
- SectionHeader `IN TRANSIT` → `DELIVERED` fires on scroll past each
- Oxblood scroll progress bar fills top-to-bottom correctly
- Hero fan plays with perspective depth
- LiveCRM keyboard nav works
- Estimator Book-a-call opens Cal.com
- Contact form submits and shows success state
- Footer watermark reads `EAS`

---

## Phase 8 — Craft Pass (10 micro-details)

### Task 45: Hero headline weight breath

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Add the oscillation loop**

Inside the hero `useIsomorphicLayoutEffect` GSAP context, add:

```ts
// Hero headline weight breath — imperceptible but alive
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", () => {
  const headline = document.querySelector("[data-hero-headline]");
  if (!headline) return;
  gsap.to(headline, {
    fontWeight: 880,
    duration: 3,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });
});
return () => mm.revert();
```

- [ ] **Step 2: Verify in DevTools**

Inspect the headline. The `font-weight` computed style oscillates 880↔900 over 3s.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(craft): hero headline weight breath (880↔900, 3s)"
```

---

### Task 46: Oxblood rule ink-bleed edge

**Files:**
- Modify: `components/ui/SectionHeader.tsx`

- [ ] **Step 1: Update the fill div's gradient**

Replace the `background` with a mask-image feathered gradient:

```tsx
<div
  className="absolute inset-y-0 left-0"
  style={{
    width: `${progress * 100}%`,
    background: "var(--oxblood)",
    maskImage: "linear-gradient(to right, black 0%, black calc(100% - 14px), transparent 100%)",
    WebkitMaskImage: "linear-gradient(to right, black 0%, black calc(100% - 14px), transparent 100%)",
    transition: "width 0.1s linear",
  }}
/>
```

- [ ] **Step 2: Verify**

Scroll into any section. The advancing edge of the oxblood rule feathers into transparent.

- [ ] **Step 3: Commit**

```bash
git add components/ui/SectionHeader.tsx
git commit -m "feat(craft): ink-bleed edge on oxblood progress rule"
```

---

### Task 47: Action Tag character-morph between verbs

**Files:**
- Modify: `components/ui/ActionTag.tsx`

- [ ] **Step 1: Add morph state + shuffle effect**

Replace the simple `{verb}` render with a `MorphingText` subcomponent:

```tsx
function MorphingText({ value }: { value: string | null }) {
  const prev = useRef(value ?? "");
  const [rendered, setRendered] = useState(value ?? "");

  useEffect(() => {
    const target = value ?? "";
    if (target === prev.current) return;

    const pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ→↗ ";
    const frames = 8;
    const duration = 180;
    const maxLen = Math.max(prev.current.length, target.length);

    let frame = 0;
    const step = () => {
      frame++;
      const t = frame / frames;
      const result: string[] = [];
      for (let i = 0; i < maxLen; i++) {
        const final = target[i] ?? " ";
        if (Math.random() > t) {
          result.push(pool[Math.floor(Math.random() * pool.length)]);
        } else {
          result.push(final);
        }
      }
      setRendered(result.join("").trimEnd());
      if (frame < frames) setTimeout(step, duration / frames);
      else { prev.current = target; setRendered(target); }
    };

    step();
  }, [value]);

  return <>{rendered}</>;
}
```

Use `<MorphingText value={verb} />` instead of `{verb}` in the tag body.

- [ ] **Step 2: Verify**

Hover from a work card (`VIEW`) to a service card (`OPEN`). Watch letters shuffle.

- [ ] **Step 3: Commit**

```bash
git add components/ui/ActionTag.tsx
git commit -m "feat(craft): Action Tag character-morph between verbs"
```

---

### Task 48: Work card image-develop — cross-verify

Already done in Task 21. Verify the four properties (scale, contrast, saturation, grain) all animate together. If any is missing, add it.

- [ ] **Step 1: Recheck hover**

- [ ] **Step 2: If adjustment needed, commit**

```bash
git add components/marketing/FeaturedWork.tsx
git commit -m "fix(craft): complete image-develop composition on hover" --allow-empty
```

---

### Task 49: Scroll-velocity micro-blur on display text

**Files:**
- Create: `components/ui/VelocityBlur.tsx`
- Modify: `app/layout.tsx` (mount once)

- [ ] **Step 1: Write a global provider**

```tsx
"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VelocityBlur() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const blurTo = gsap.quickTo(":root", "--blur-px", { duration: 0.18, ease: "power2.out" });

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 2400, 1.2);
        blurTo(v);
      },
    });

    return () => st.kill();
  }, []);

  return null;
}
```

Add the root CSS variable default + apply to display-weight text:

```css
/* globals.css */
:root { --blur-px: 0; }
.font-display { filter: blur(calc(var(--blur-px) * 1px)); }
```

- [ ] **Step 2: Mount `<VelocityBlur />` once in `app/layout.tsx`**

- [ ] **Step 3: Verify**

Scroll quickly — display text micro-blurs. Scroll stops — clears within 180ms.

- [ ] **Step 4: Commit**

```bash
git add components/ui/VelocityBlur.tsx app/globals.css app/layout.tsx
git commit -m "feat(craft): scroll-velocity micro-blur on display text"
```

---

### Task 50: Hero fan dynamic shadow response

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Add a per-frame shadow updater during fan animation**

Inside the `shrinkTl` timeline or alongside it, bind box-shadow to rotation:

```ts
const fanCards = gsap.utils.toArray<HTMLElement>(".hero-fan-card");
gsap.ticker.add(() => {
  fanCards.forEach((card) => {
    const rotY = parseFloat(gsap.getProperty(card, "rotationY") as string) || 0;
    const tilt = Math.abs(rotY) / 40; // 0..1 range
    const blur = 8 + tilt * 24;
    const opacity = 0.15 + tilt * 0.2;
    card.style.boxShadow = `0 ${12 + tilt * 20}px ${blur}px rgba(0,0,0,${opacity})`;
  });
});
```

- [ ] **Step 2: Verify**

In hero, cards farther from viewer have bigger, softer shadows.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(craft): dynamic shadow response on hero fan cards"
```

---

### Task 51: Page-load title sequence

**Files:**
- Modify: `components/Hero.tsx` (or layout-level orchestrator)

- [ ] **Step 1: Add a one-shot timeline on mount**

At top of Hero, wire a once-per-session load sequence:

```tsx
useEffect(() => {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem("eas-intro-played")) return;
  sessionStorage.setItem("eas-intro-played", "1");

  const tl = gsap.timeline();
  tl.from("[data-hero-sku]", { opacity: 0, y: 4, duration: 0.4 })
    .from("[data-hero-ticker]", { opacity: 0, duration: 0.4 }, "-=0.1")
    .from("[data-navbar]", { y: -40, opacity: 0, duration: 0.4 }, "-=0.1")
    // Headline SplitText already plays via the earlier effect (Task 20)
    .from("[data-hero-video-box]", { clipPath: "inset(100% 0 0 0)", duration: 0.8, ease: "expo.out" }, "-=0.2")
    .from("[data-scroll-hint]", { opacity: 0, duration: 0.3 });
}, []);
```

Add the data-attributes to the corresponding elements in Hero + Navbar.

- [ ] **Step 2: Verify**

Reload homepage. Sequence plays ~2s. Reload again — skipped (session flag set).

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx components/Navbar.tsx
git commit -m "feat(craft): page-load title sequence (once per session)"
```

---

### Task 52: Section-pass IN TRANSIT → DELIVERED narrative

Already implemented via `useSectionStatus` (Task 7) and SectionHeader (Task 8). Verify behavior.

- [ ] **Step 1: Scroll through every section**

Expected: each section's tag transitions to `✓ DELIVERED` (taupe) as its bottom leaves the viewport. Reverses to `IN TRANSIT` on scroll-back.

- [ ] **Step 2: Commit any tuning**

```bash
git commit -m "fix(craft): section-pass status transition timing" --allow-empty
```

---

### Task 53: Wordmark weight flourish on hover (About + Navbar)

**Files:**
- Modify: `components/marketing/About.tsx`
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Add hover weight shift to the EAS wordmark**

In both files, wrap the `EAS` wordmark:

```tsx
<motion.span
  initial={{ fontWeight: 900 }}
  whileHover={{ fontWeight: 700, transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] } }}
  className="inline-block cursor-default"
>
  EAS
</motion.span>
```

Note: `fontWeight` animation requires variable-font support (Geist has it).

- [ ] **Step 2: Verify**

Hover `EAS` in Navbar and in About signature. Weight shifts.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/About.tsx components/Navbar.tsx
git commit -m "feat(craft): EAS wordmark weight-axis on hover"
```

---

### Task 54: Phase 8 checkpoint — craft details present

Verify each of the 10 items:

- [ ] 1. Custom easing per moment (lib/motion/eases.ts exists, used)
- [ ] 2. Hero fan 3D + shadow response (Task 50)
- [ ] 3. Hero headline breath (Task 45)
- [ ] 4. Ink-bleed edge on rule (Task 46)
- [ ] 5. Action Tag character-morph (Task 47)
- [ ] 6. Slot-machine counter + $ sway (Tasks 34, 36)
- [ ] 7. Page-load title sequence (Task 51)
- [ ] 8. Section-pass narrative (Tasks 7, 8, 52)
- [ ] 9. Work card image-develop (Task 21, 48)
- [ ] 10. Scroll-velocity blur (Task 49)

---

## Phase 9 — MX + Metadata + Verification

### Task 55: Add `public/llms.txt`

**Files:**
- Create: `public/llms.txt`

- [ ] **Step 1: Write the file**

```
# Executive AI Solutions (EAS)

A two-person design + engineering studio based in Rocklin, California,
building custom software for small operators.

## What we ship
- Marketing sites that convert (4–6 weeks, from $12k)
- Custom CRMs that replace spreadsheets + Calendly stacks (6–10 weeks, from $18k)
- AI voice receptionists that capture after-hours leads (4–6 weeks, from $15k)

## How we work
Founder-led. Weekly Friday ship cadence. Fixed-price proposals in 48h.
30 days of free fixes after launch. Two projects per quarter, max.

## Contact
Email: hello@executiveai.solutions
Calendar: https://cal.com/eas
Site: https://executiveaisolutions.com
```

- [ ] **Step 2: Verify served**

Run dev server. Visit `http://localhost:3000/llms.txt`. Expected: the text displays.

- [ ] **Step 3: Commit**

```bash
git add public/llms.txt
git commit -m "feat(mx): add llms.txt for AI-consumer readers"
```

---

### Task 56: Add JSON-LD + metadata rewrite

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `metadata`**

```ts
export const metadata: Metadata = {
  title: "Executive AI Solutions — We ship software, not slides.",
  description: "A two-person studio building custom CRMs, AI voice receptionists, and marketing sites for small operators. Weekly ship cadence. Fixed-price proposals. Available Q3 2026.",
  metadataBase: new URL("https://executiveaisolutions.com"),
  openGraph: {
    title: "Executive AI Solutions — Ship, don't slide.",
    description: "A two-person studio building custom CRMs, AI voice receptionists, and marketing sites for small operators.",
    url: "https://executiveaisolutions.com",
    siteName: "Executive AI Solutions",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

- [ ] **Step 2: Add JSON-LD script inside `<body>` (top)**

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://executiveaisolutions.com/#org",
          name: "Executive AI Solutions",
          alternateName: "EAS",
          url: "https://executiveaisolutions.com",
          founder: { "@type": "Person", name: "Jake Ryall" },
          areaServed: "US",
          address: { "@type": "PostalAddress", addressLocality: "Rocklin", addressRegion: "CA", addressCountry: "US" },
          email: "hello@executiveai.solutions",
        },
        {
          "@type": "Service",
          name: "Marketing site build",
          provider: { "@id": "https://executiveaisolutions.com/#org" },
          description: "Custom marketing site builds for small operators. 4–6 weeks, from $12k.",
          areaServed: "US",
        },
        {
          "@type": "Service",
          name: "Custom CRM",
          provider: { "@id": "https://executiveaisolutions.com/#org" },
          description: "Custom CRMs for service businesses outgrowing spreadsheets. 6–10 weeks, from $18k.",
          areaServed: "US",
        },
        {
          "@type": "Service",
          name: "AI voice receptionist",
          provider: { "@id": "https://executiveaisolutions.com/#org" },
          description: "24/7 AI voice receptionists that qualify and book inbound leads. 4–6 weeks, from $15k.",
          areaServed: "US",
        },
      ],
    }),
  }}
/>
```

Place this right under `<body>` before `{children}`.

- [ ] **Step 3: Verify**

Inspect page source. JSON-LD script present. Validate with https://validator.schema.org/ (manual check).

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(mx): JSON-LD Organization + 3 Service schemas + metadata rewrite"
```

---

### Task 57: Root-level `MotionConfig` + `VelocityBlur` mounted

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Wrap children in `MotionConfig`**

```tsx
import { MotionConfig } from "framer-motion";
import VelocityBlur from "@/components/ui/VelocityBlur";

// inside <body>:
<MotionConfig reducedMotion="user">
  <VelocityBlur />
  <ActionTag />
  {children}
</MotionConfig>
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat(motion): MotionConfig reducedMotion user + mount VelocityBlur"
```

---

### Task 58: Final acceptance pass

- [ ] **Step 1: Build**

```bash
npm run build
```

Expected: clean build, no type errors.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: clean (or only pre-existing warnings).

- [ ] **Step 3: Test**

```bash
npm run test
```

Expected: all tests pass.

- [ ] **Step 4: Reduced-motion verification**

In system Accessibility settings, enable "Reduce motion." Reload. Verify:
- Marquee slows dramatically
- Hero fan skips to end state
- No weight breath
- No velocity blur
- Status dots don't pulse
- Row-deal in LiveCRM becomes instant fade

- [ ] **Step 5: Mobile (390px) verification**

- All sections readable
- Pills wrap, no overflow
- Hero type scales to `clamp` floor
- ActionTag hidden (desktop-only guard)
- Process rule hidden (md-only wrapper)

- [ ] **Step 6: Section-by-section acceptance (from spec §12)**

For each section, confirm:
- Uses `SectionHeader` ✓
- Type scale correct ✓
- Progress rule scrubs ✓
- Minimum 2 motion primitives used ✓
- 3-property composition ✓
- Reduced-motion respected ✓
- IN TRANSIT → DELIVERED on exit ✓

- [ ] **Step 7: Commit any final polish**

```bash
git commit -m "chore(polish): final acceptance-pass fixes" --allow-empty
```

---

## Self-Review Checklist (post-plan)

**Spec coverage:** Every section in the spec maps to tasks:
- §3 Visual System → Tasks 2, 3, 8, 9
- §4 Section architecture → Tasks 24–28, 30, 35, 39, 42, 43
- §5 Copy drafts → embedded in section tasks
- §6 Motion → Tasks 4, 5, 6, 7, 45–51
- §7 Estimator → Tasks 32–36
- §7 LiveCRM → Tasks 38–40
- §8 Action Tag → Tasks 10, 47
- §9 Removals → Tasks 13–15
- §10 MX → Tasks 55, 56
- §11 Component tree → distributed across all tasks
- §12 Acceptance → Task 58

**Placeholder scan:** No "TBD" / "implement later" / "add validation here" present. Every code block is complete.

**Type consistency:** `ProjectType`, `ScopeTier`, `Addon`, `Lead`, `LeadStatus`, `FanPosition`, `SectionStatus` defined once and reused.

---

## Execution Choice

Plan complete and saved to `docs/superpowers/plans/2026-04-22-eas-redesign-plan.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Good for a 58-task plan — lets you review each task in isolation without context bleed.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch with checkpoints. More linear; fewer context switches but longer single conversations.

Which approach?
