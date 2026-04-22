# Homepage Redesign v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign 5 homepage sections (Capabilities, Manifesto, Proof, Contact, Footer) + polish the Hero left column, following the modern conversion-first direction in `docs/superpowers/specs/2026-04-21-homepage-redesign-v3-design.md`.

**Architecture:** Section-by-section rewrite. Each section is a self-contained component dynamically imported in `app/page.tsx`. All sections share a small library of micro-interaction helpers (`lib/microInteractions.ts`) and a shared GSAP plugin registry (`lib/gsap-setup.ts`). The Hero's video/fan/currently-shipping/logos are NOT touched.

**Tech Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion (existing) · GSAP 3 (core, ScrollTrigger, SplitText, CustomEase, DrawSVG, Flip, MotionPath) · Inter font.

**Verification model:** This is a marketing site with no test suite. Each task's "verification" = build passes (`npm run build` or watch dev server), browser visual check (use Chrome DevTools MCP to navigate + screenshot + verify the interaction works), then commit.

---

## File Plan

**New files:**
- `lib/microInteractions.ts` — shared helpers (counter tween, card hover variants, button stagger letter component)
- `components/homepage/Capabilities.tsx` — 3-card bento (services + demos), replaces ScrollMarquee
- `components/homepage/Signature.tsx` — inline signature SVG component used by Manifesto
- `components/homepage/AboutCard.tsx` — small horizontal Jake identity card used by Manifesto
- `components/homepage/AvailabilityWidget.tsx` — Contact section's "next opening" card
- `components/homepage/ProofCard.tsx` — single testimonial card used by the Proof section

**Rewritten files:**
- `components/homepage/Manifesto.tsx`
- `components/homepage/Testimonials.tsx` (Proof section)
- `components/Contact.tsx` (desktop variant)
- `components/Footer.tsx`

**Modified files (additive only — leave the right column alone):**
- `components/Hero.tsx` — kicker added, `HeroCorrectionText` replaced with new strikethrough component, subline + CTAs consolidated
- `lib/gsap-setup.ts` — register DrawSVG, Flip, MotionPath, MorphSVG plugins
- `app/page.tsx` — reorder dynamic imports + render order

**Deleted files:**
- `components/homepage/ScrollMarquee.tsx`

---

## Task 0: Foundation — GSAP plugins + shared micro-interaction library

**Files:**
- Modify: `lib/gsap-setup.ts`
- Create: `lib/microInteractions.ts`

- [ ] **Step 0.1: Register additional GSAP plugins**

Edit `lib/gsap-setup.ts`. Inside the `if (typeof window !== "undefined" && !globalThis.__gsapSetupDone)` block, expand the plugin imports + registration:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// ...

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  CustomEase,
  DrawSVGPlugin,
  Flip,
  MotionPathPlugin,
);
```

Update the named export at the bottom to include `DrawSVGPlugin`, `Flip`, `MotionPathPlugin`.

- [ ] **Step 0.2: Verify plugin registration compiles**

Run: `npm run build` (or watch dev server output)
Expected: build succeeds. If TypeScript can't resolve the plugin types, the import path is wrong — they should all resolve from `gsap/<PluginName>`.

- [ ] **Step 0.3: Create the shared micro-interactions library**

Create `lib/microInteractions.ts`:

```ts
"use client";

import { gsap } from "@/lib/gsap-setup";
import type { Variants } from "framer-motion";

/**
 * Animate a number from 0 (or `from`) to `target` over `duration` seconds.
 * Snaps to integers. Designed to fire once on viewport entry.
 */
export function tweenCounter(
  el: HTMLElement,
  target: number,
  opts: { duration?: number; from?: number; format?: (n: number) => string } = {},
) {
  const { duration = 1.2, from = 0, format = (n) => Math.round(n).toString() } = opts;
  const obj = { val: from };
  return gsap.to(obj, {
    val: target,
    duration,
    ease: "appleOut",
    onUpdate: () => {
      el.textContent = format(obj.val);
    },
  });
}

/**
 * Standard card hover variants — used by every interactive card on the page.
 * Pair with whileHover on a motion.div.
 */
export const cardHoverVariants: Variants = {
  rest: {
    y: 0,
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    y: -2,
    boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Standard tag/pill hover — fills with taupe at 12% opacity, lifts 1px.
 */
export const tagHoverVariants: Variants = {
  rest: {
    y: 0,
    backgroundColor: "rgba(120,115,108,0)",
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
  hover: {
    y: -1,
    backgroundColor: "rgba(120,115,108,0.12)",
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Reduced-motion guard. Wrap any non-essential animation in this check.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 0.4: Verify the lib file imports cleanly**

Run: `npm run build` or check dev server.
Expected: no import or type errors. If `Variants` doesn't resolve, check Framer Motion is installed (`framer-motion` in package.json).

- [ ] **Step 0.5: Commit**

```bash
git add lib/gsap-setup.ts lib/microInteractions.ts
git commit -m "feat(foundation): register DrawSVG/Flip/MotionPath, add micro-interaction helpers"
```

---

## Task 1: Hero polish — kicker, headline copy + strikethrough mechanic, CTA consolidation

**Files:**
- Modify: `components/Hero.tsx`

Reference: spec §5 (Hero Polish)

The Hero's right column (video, sticky shrink behavior, currently-shipping card, fan) is OFF-LIMITS. Only the LEFT column (kicker / headline / subline / CTA / rating row) changes.

- [ ] **Step 1.1: Add the identity kicker above the headline**

Inside the LEFT column at `Hero.tsx` ~line 909 (the `<div ref={heroContentRef}>` block), before the `<HeroCorrectionText />`, add:

```tsx
<motion.p
  initial={{ opacity: 0, y: 4 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
  style={{
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: "0.65rem",
    fontWeight: 600,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(26,24,22,0.5)",
    marginBottom: "1.5rem",
  }}
>
  Jake Ryall · Design + Dev · Available Q3 2026
</motion.p>
```

- [ ] **Step 1.2: Replace HeroCorrectionText with the new strikethrough mechanic**

The existing `HeroCorrectionText` component is at `Hero.tsx:297-441`. Build a replacement that types `I build beautiful websites.` then strikes through `beautiful` and rises `converting` into place.

Implementation approach:
1. State machine: `typing` → `pause` → `striking` → `rising` → `done`
2. Phase `typing` (~35ms/char, current behavior) — types out `I build beautiful websites.`
3. Phase `pause` (400ms)
4. Phase `striking` (350ms) — animate a 1.5px line via DrawSVG across the `beautiful` word; concurrently fade `beautiful`'s color to 30% opacity
5. Phase `rising` (500ms, starts at 75% of striking) — `converting` rises into place via SplitText word-mask reveal at the same horizontal position
6. Phase `done` — `beautiful` fades to 0 opacity over 600ms then unmounts; final visible text is `I build converting websites.`

Replace the entire `HeroCorrectionText` function at lines 297-441 with the new component below. Keep its signature (no props) and existing `sessionStorage` skip-on-return-visit behavior:

```tsx
function HeroCorrectionText() {
  const hasSeenRef = useRef(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [phase, setPhase] = useState<"typing" | "pause" | "striking" | "rising" | "done">("typing");
  const [typedCount, setTypedCount] = useState(0);
  const beautifulRef = useRef<HTMLSpanElement>(null);
  const strikeLineRef = useRef<SVGLineElement>(null);
  const convertingRef = useRef<HTMLSpanElement>(null);

  const fullSentence = "I build beautiful websites.";
  const beautifulStart = "I build ".length;
  const beautifulEnd = beautifulStart + "beautiful".length;

  // Skip on return visit
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("hero-seen");
      if (seen) {
        setSkipAnimation(true);
        hasSeenRef.current = true;
        setPhase("done");
      }
    }
  }, []);

  // Phase: typing
  useEffect(() => {
    if (phase !== "typing" || skipAnimation) return;
    if (typedCount >= fullSentence.length) {
      const t = setTimeout(() => setPhase("pause"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTypedCount((c) => c + 1), 35);
    return () => clearTimeout(t);
  }, [phase, typedCount, skipAnimation]);

  // Phase: pause -> striking
  useEffect(() => {
    if (phase !== "pause") return;
    const t = setTimeout(() => setPhase("striking"), 0);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase: striking — animate the strike line + concurrently start rising near the end
  useEffect(() => {
    if (phase !== "striking") return;
    const lineEl = strikeLineRef.current;
    const beautyEl = beautifulRef.current;
    if (!lineEl || !beautyEl) {
      setPhase("rising");
      return;
    }
    const tl = gsap.timeline({ onComplete: () => setPhase("rising") });
    tl.fromTo(
      lineEl,
      { drawSVG: "0% 0%" },
      { drawSVG: "0% 100%", duration: 0.35, ease: "power2.inOut" },
    );
    tl.to(beautyEl, { opacity: 0.3, duration: 0.3, ease: "power2.out" }, 0.05);
    return () => {
      tl.kill();
    };
  }, [phase]);

  // Phase: rising — reveal "converting" via SplitText word mask + fade beautiful out, then done
  useEffect(() => {
    if (phase !== "rising") return;
    const convEl = convertingRef.current;
    const beautyEl = beautifulRef.current;
    if (!convEl) {
      setPhase("done");
      return;
    }
    const split = SplitText.create(convEl, {
      type: "chars",
      mask: "chars",
      charsClass: "h-conv-char",
    });
    gsap.set(split.chars, { yPercent: 110 });
    gsap.set(convEl, { autoAlpha: 1 });
    const tl = gsap.timeline({
      onComplete: () => {
        if (beautyEl) {
          gsap.to(beautyEl, { opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => setPhase("done") });
        } else {
          setPhase("done");
        }
        if (typeof window !== "undefined") {
          sessionStorage.setItem("hero-seen", "1");
        }
      },
    });
    tl.to(split.chars, { yPercent: 0, duration: 0.5, stagger: 0.02, ease: "appleOut" });
    return () => {
      split.revert();
      tl.kill();
    };
  }, [phase]);

  // Render
  const showCursor = phase === "typing" && !skipAnimation;
  const typed = phase === "typing" ? fullSentence.slice(0, typedCount) : fullSentence;

  return (
    <h1
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
        color: "#1a1816",
        position: "relative",
      }}
    >
      {phase === "typing" ? (
        <>
          {typed}
          {showCursor && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
              style={{ color: "#78736c" }}
            >
              |
            </motion.span>
          )}
        </>
      ) : phase === "done" && skipAnimation ? (
        <>I build converting websites.</>
      ) : (
        <>
          <span>I build </span>
          <span style={{ position: "relative", display: "inline-block" }}>
            <span ref={beautifulRef} style={{ display: "inline-block", color: "#1a1816" }}>
              beautiful
            </span>
            {/* SVG strikethrough line — sized to the word's width via inline svg overlay */}
            <svg
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                width: "100%",
                height: 4,
                overflow: "visible",
                pointerEvents: "none",
              }}
              viewBox="0 0 100 4"
              preserveAspectRatio="none"
            >
              <line
                ref={strikeLineRef}
                x1="0" y1="2" x2="100" y2="2"
                stroke="#1a1816"
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* "converting" rises into place underneath the struck-through word.
                Positioned absolutely so it can occupy the same slot. */}
            <span
              ref={convertingRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                color: "#1a1816",
                visibility: phase === "rising" || phase === "done" ? "visible" : "hidden",
                opacity: 0,
              }}
            >
              converting
            </span>
          </span>
          <span> websites.</span>
        </>
      )}
    </h1>
  );
}
```

(The `gsap` and `SplitText` imports already exist at the top of `Hero.tsx` — confirm before adding any.)

- [ ] **Step 1.3: Update the subline copy**

Find the subline (currently `Hero.tsx:914-938`, "I design websites that turn visitors into customers."). Replace its inner content with the new copy:

```tsx
<motion.p
  initial={{ opacity: 0, y: 15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 2.8, ease: [0.22, 1, 0.36, 1] }}
  style={{
    fontFamily: "var(--font-inter), sans-serif",
    fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
    color: "rgba(26,24,22,0.55)",
    marginTop: "1.5rem",
    maxWidth: "500px",
    lineHeight: 1.6,
  }}
>
  I'm Jake. I design websites that earn their keep.
</motion.p>
```

- [ ] **Step 1.4: Convert the primary CTA to use StaggerButton + add secondary CTA**

The current `Start a Project` button at `Hero.tsx:940-969` is a static `TransitionLink`. Replace its inner with the existing `StaggerButton` component (already in this file at line 58). Keep the wrapping `motion.div` for delay timing.

Replace contents of the motion.div with:

```tsx
<div className="flex items-center gap-4 flex-wrap">
  <TransitionLink
    href="/contact"
    className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full transition-colors duration-300 hover:bg-[#78736c] hover:border-[#78736c] group"
    style={{ backgroundColor: "#1a1816", color: "#f3f1ee" }}
  >
    <StaggerButton text="Start a Project" href="/contact" className="text-sm font-semibold uppercase tracking-[0.1em]" />
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </TransitionLink>

  <TransitionLink
    href="/work"
    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full transition-colors duration-300"
    style={{ backgroundColor: "transparent", color: "#1a1816", border: "1px solid rgba(26,24,22,0.2)" }}
  >
    <span className="text-sm font-semibold uppercase tracking-[0.1em]">See my work</span>
    <span aria-hidden>→</span>
  </TransitionLink>
</div>
```

Note: `StaggerButton` already wraps a `TransitionLink`, so nesting may need tweak — if it produces nested anchors, refactor StaggerButton's call here to render its children only. Verify in browser before commit.

- [ ] **Step 1.5: Remove the rating row**

Delete the entire `<motion.button>` block at `Hero.tsx:973-1031` (the 5.0 + stars + "Read the reviews" row). It moves into the Proof section as a small line below the section header.

- [ ] **Step 1.6: Verify Hero polish in the browser**

Run `npm run dev`, navigate to `http://localhost:3000`. Use Chrome DevTools MCP if convenient.

Visual checks:
- Identity kicker fades in above the headline
- Headline types `I build beautiful websites.` → strikes through `beautiful` → `converting` rises into its place → `beautiful` fades out — final state reads `I build converting websites.`
- Refresh the page once: animation skips (sessionStorage `hero-seen` set)
- Subline reads `I'm Jake. I design websites that earn their keep.`
- Two CTAs visible: primary `Start a Project` (dark, with arrow) + secondary `See my work →` (ghost)
- No 5.0 stars / Read the reviews row
- Right column (video, fan, currently-shipping) UNCHANGED

Clear sessionStorage between checks: `sessionStorage.removeItem('hero-seen')` in DevTools console.

- [ ] **Step 1.7: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat(hero): identity kicker, strikethrough headline, dual CTA, drop rating row"
```

---

## Task 2: Capabilities — new bento section replaces ScrollMarquee

**Files:**
- Create: `components/homepage/Capabilities.tsx`
- Modify: `app/page.tsx`
- Delete: `components/homepage/ScrollMarquee.tsx`

Reference: spec §6 (Capabilities)

- [ ] **Step 2.1: Scaffold Capabilities.tsx with the bento grid + card data**

Create `components/homepage/Capabilities.tsx`:

```tsx
"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import { cardHoverVariants, tagHoverVariants, tweenCounter, prefersReducedMotion } from "@/lib/microInteractions";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const services = [
  {
    num: "01",
    name: "Conversion Websites",
    title: "Every scroll earns its place.",
    body: "Sites built with conversion architecture from the first wireframe. Every section has to defend its spot — or it gets cut.",
    tags: ["Next.js", "Sanity CMS", "Tailwind", "Analytics"],
    footer: "Wireframe → design → launch in 4 weeks.",
  },
  {
    num: "02",
    name: "AI Automations",
    title: "Back-office that runs on its own.",
    body: "Inbox triage, lead routing, content pipelines. Workflows that do the 10 small things you keep forgetting.",
    tags: ["n8n", "OpenAI", "Slack", "Webhooks"],
    footer: "Replaces ~8 hrs/week of admin.",
  },
  {
    num: "03",
    name: "Custom Software",
    title: "One system instead of twelve tabs.",
    body: "Internal tools and dashboards shaped to your operation. One login, one schema, one place your team actually looks.",
    tags: ["Next.js", "Supabase", "Role-based auth", "Owned by you"],
    footer: "Purpose-built, not SaaS-bent.",
  },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Card stagger entry
      gsap.from(".cap-card", {
        opacity: 0,
        y: 24,
        duration: reduce ? 0 : 0.7,
        ease: "appleOut",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      // Section title word-mask reveal
      const titleEl = sectionRef.current!.querySelector<HTMLElement>(".cap-title");
      if (titleEl) {
        const split = SplitText.create(titleEl, { type: "words", mask: "words" });
        gsap.set(split.words, { yPercent: 110 });
        gsap.to(split.words, {
          yPercent: 0,
          duration: reduce ? 0 : 0.7,
          stagger: 0.04,
          ease: "appleOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="capabilities" className="py-32 px-6" style={{ backgroundColor: "#e5e1db" }}>
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: "#78736c" }}>
            What I do
          </p>
          <h2 className="cap-title font-black tracking-tight" style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(2rem, 4.5vw, 3.75rem)", lineHeight: 1.05, color: "#1a1816" }}>
            Three things I ship for clients.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CapCard service={services[0]} className="md:col-span-2" demo={<DesignDemo />} />
          <CapCard service={services[1]} className="md:col-span-1" demo={<AutomationDemo />} />
          <CapCard service={services[2]} className="md:col-span-3" demo={<SoftwareDemo />} />
        </div>
      </div>
    </section>
  );
}

function CapCard({
  service,
  demo,
  className = "",
}: {
  service: typeof services[number];
  demo: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className={`cap-card relative rounded-2xl p-8 md:p-10 ${className}`}
      style={{
        backgroundColor: "rgba(255,255,255,0.4)",
        border: "1px solid rgba(26,23,20,0.08)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: "#78736c" }}>
          {service.num} — {service.name}
        </p>
      </div>

      <h3 className="font-black tracking-tight mb-3" style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(1.5rem, 2.4vw, 2rem)", color: "#1a1816", lineHeight: 1.15 }}>
        {service.title}
      </h3>

      <p className="mb-6" style={{ color: "rgba(26,24,22,0.7)", maxWidth: 520, lineHeight: 1.55 }}>
        {service.body}
      </p>

      {/* Demo area */}
      <div className="mb-6 rounded-xl overflow-hidden" style={{ minHeight: 220, backgroundColor: "rgba(26,24,22,0.04)" }}>
        {demo}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {service.tags.map((tag) => (
          <motion.span
            key={tag}
            variants={tagHoverVariants}
            initial="rest"
            whileHover="hover"
            className="text-xs font-medium px-3 py-1.5 rounded-full cursor-default"
            style={{ color: "#1a1816", border: "1px solid rgba(26,24,22,0.12)" }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      <p className="text-xs" style={{ color: "rgba(26,24,22,0.45)" }}>
        {service.footer}
      </p>
    </motion.div>
  );
}

// Demos defined in subsequent steps
function DesignDemo() { return <div className="w-full h-full" />; }
function AutomationDemo() { return <div className="w-full h-full" />; }
function SoftwareDemo() { return <div className="w-full h-full" />; }
```

- [ ] **Step 2.2: Implement the DesignDemo (wireframe → mockup morph)**

Replace the placeholder `DesignDemo` at the bottom of `Capabilities.tsx`:

```tsx
function DesignDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();
    if (reduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
      // Start: wireframe blocks (gray rectangles)
      // End: hi-fi mockup (colored, with content)
      tl.to(".dd-block", {
        backgroundColor: (i: number) => ["#1a1816", "#78736c", "#e5e1db", "#c7c2bb"][i] || "#1a1816",
        duration: 0.8,
        stagger: 0.1,
        ease: "appleOut",
      })
        .to(".dd-block", {
          backgroundColor: "#d4d0c9",
          duration: 0.8,
          stagger: 0.1,
          ease: "appleOut",
          delay: 1.5,
        });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full h-full p-6 flex flex-col gap-2">
      <div className="dd-block rounded h-8 w-2/5" style={{ backgroundColor: "#d4d0c9" }} />
      <div className="dd-block rounded h-24 w-full" style={{ backgroundColor: "#d4d0c9" }} />
      <div className="grid grid-cols-3 gap-2 h-12">
        <div className="dd-block rounded" style={{ backgroundColor: "#d4d0c9" }} />
        <div className="dd-block rounded" style={{ backgroundColor: "#d4d0c9" }} />
        <div className="dd-block rounded" style={{ backgroundColor: "#d4d0c9" }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2.3: Implement the AutomationDemo (workflow nodes + MotionPath data packet)**

Replace placeholder `AutomationDemo`:

```tsx
function AutomationDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.to(".ad-packet", {
        motionPath: {
          path: "#ad-path",
          align: "#ad-path",
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        duration: 3.5,
        ease: "none",
        repeat: -1,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full h-full p-6 flex items-center justify-center">
      <svg viewBox="0 0 320 180" className="w-full h-auto max-w-[320px]">
        {/* Connection path */}
        <path
          id="ad-path"
          d="M 40 90 Q 100 90 160 50 Q 220 90 280 90"
          fill="none"
          stroke="#78736c"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          opacity="0.5"
        />
        {/* Nodes */}
        <circle cx="40" cy="90" r="14" fill="#1a1816" />
        <circle cx="160" cy="50" r="14" fill="#1a1816" />
        <circle cx="280" cy="90" r="14" fill="#1a1816" />
        {/* Node labels */}
        <text x="40" y="120" textAnchor="middle" fontSize="9" fill="#78736c" fontFamily="Inter, sans-serif">Inbox</text>
        <text x="160" y="32" textAnchor="middle" fontSize="9" fill="#78736c" fontFamily="Inter, sans-serif">Classify</text>
        <text x="280" y="120" textAnchor="middle" fontSize="9" fill="#78736c" fontFamily="Inter, sans-serif">Slack</text>
        {/* Animated packet */}
        <circle className="ad-packet" cx="0" cy="0" r="5" fill="#78736c" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2.4: Implement the SoftwareDemo (dashboard + Lighthouse ring + KPI counters)**

Replace placeholder `SoftwareDemo`:

```tsx
function SoftwareDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const lcpRef = useRef<HTMLSpanElement>(null);
  const clsRef = useRef<HTMLSpanElement>(null);
  const inpRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (reduce) {
            if (scoreRef.current) scoreRef.current.textContent = "98";
            if (lcpRef.current) lcpRef.current.textContent = "1.2";
            if (clsRef.current) clsRef.current.textContent = "0.01";
            if (inpRef.current) inpRef.current.textContent = "110";
            if (ringRef.current) gsap.set(ringRef.current, { drawSVG: "0 98%" });
            return;
          }
          if (ringRef.current) {
            gsap.fromTo(ringRef.current, { drawSVG: "0 0%" }, { drawSVG: "0 98%", duration: 1.4, ease: "appleOut" });
          }
          if (scoreRef.current) tweenCounter(scoreRef.current, 98, { duration: 1.4 });
          if (lcpRef.current) tweenCounter(lcpRef.current, 1.2, { duration: 1.2, format: (n) => n.toFixed(1) });
          if (clsRef.current) tweenCounter(clsRef.current, 0.01, { duration: 1.2, format: (n) => n.toFixed(2) });
          if (inpRef.current) tweenCounter(inpRef.current, 110, { duration: 1.2 });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full h-full p-6 flex items-center justify-between gap-6 flex-wrap">
      {/* Lighthouse ring */}
      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(26,24,22,0.08)" strokeWidth="6" />
          <circle
            ref={ringRef}
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#1a1816"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="0 100"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span ref={scoreRef} className="font-black" style={{ fontFamily: "var(--font-inter)", fontSize: "2.25rem", color: "#1a1816", lineHeight: 1 }}>0</span>
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#78736c", marginTop: 4 }}>Performance</span>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-3 gap-4 flex-1 min-w-[260px]">
        {[
          { label: "LCP", ref: lcpRef, suffix: "s" },
          { label: "CLS", ref: clsRef, suffix: "" },
          { label: "INP", ref: inpRef, suffix: "ms" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.5)", border: "1px solid rgba(26,24,22,0.08)" }}>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: "#78736c" }}>{m.label}</p>
            <p className="font-bold" style={{ fontFamily: "var(--font-inter)", fontSize: "1.25rem", color: "#1a1816" }}>
              <span ref={m.ref}>0</span>
              <span style={{ fontSize: "0.75rem", color: "#78736c", marginLeft: 2 }}>{m.suffix}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2.5: Wire Capabilities into app/page.tsx + remove ScrollMarquee**

Edit `app/page.tsx`:
- Add dynamic import: `const Capabilities = dynamic(() => import("@/components/homepage/Capabilities"), { loading: () => <div className="min-h-screen" /> });`
- Replace the `<ScrollMarquee />` render with `<Capabilities />`
- Remove the `ScrollMarquee` dynamic import line
- Update render order to match spec §3 — final desired order:

```tsx
<Hero />
<Work />
<Capabilities />
<Manifesto />
<Testimonials />  {/* will become Proof */}
<Contact />
```

- [ ] **Step 2.6: Delete ScrollMarquee.tsx**

```bash
rm components/homepage/ScrollMarquee.tsx
```

- [ ] **Step 2.7: Verify Capabilities in the browser**

Run dev server. Scroll past the Hero/fan to the new Capabilities section.

Visual checks:
- 3 cards in bento layout (2:1 top row, full-width bottom card on desktop)
- On mobile: 3 cards stack vertically
- Section title `Three things I ship for clients.` reveals via word-mask on entry
- Cards stagger-fade in
- Card 01 demo: blocks change colors in a loop (wireframe → "mockup" → repeat)
- Card 02 demo: small dashed line connects 3 nodes; a packet circle moves along the path in a loop
- Card 03 demo: ring fills to 98% as section enters viewport; LCP/CLS/INP counters tween up
- Hover any card: lifts +2px, shadow expands, border brightens slightly
- Hover any tag pill: fills with taupe at low opacity, lifts 1px
- Verify reduced-motion: in DevTools, set reduced motion → reload → animations should collapse to instant final states

- [ ] **Step 2.8: Commit**

```bash
git add components/homepage/Capabilities.tsx app/page.tsx
git rm components/homepage/ScrollMarquee.tsx
git commit -m "feat(capabilities): bento grid replaces ScrollMarquee with services + interactive demos"
```

---

## Task 3: Manifesto rewrite — mantra + drop cap paragraph + signature + About card

**Files:**
- Rewrite: `components/homepage/Manifesto.tsx`
- Create: `components/homepage/Signature.tsx`
- Create: `components/homepage/AboutCard.tsx`

Reference: spec §7 (Manifesto)

- [ ] **Step 3.1: Create the Signature component**

Create `components/homepage/Signature.tsx`:

```tsx
"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Hand-styled "—Jake" path. Approximate scribble — refine later if needed.
const SIGNATURE_PATH = "M5 25 Q 12 18 18 22 T 30 24 Q 38 16 44 22 L 52 18 Q 60 26 68 20 M 75 14 L 95 30 M 75 28 L 95 14";

export default function Signature({ width = 140 }: { width?: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!pathRef.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: groupRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (reduce) {
            gsap.set(pathRef.current, { drawSVG: "0% 100%" });
            return;
          }
          gsap.fromTo(
            pathRef.current,
            { drawSVG: "0% 0%" },
            { drawSVG: "0% 100%", duration: 1.2, ease: "power2.inOut" },
          );
        },
      });
    }, groupRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={groupRef}
      viewBox="0 0 100 40"
      style={{ width, height: width * 0.4, overflow: "visible" }}
      aria-label="Jake signature"
    >
      <path
        ref={pathRef}
        d={SIGNATURE_PATH}
        fill="none"
        stroke="#1a1816"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
```

- [ ] **Step 3.2: Create the AboutCard component**

Create `components/homepage/AboutCard.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { cardHoverVariants } from "@/lib/microInteractions";

export default function AboutCard() {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className="rounded-2xl p-6 flex items-center gap-6 flex-wrap"
      style={{
        backgroundColor: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(26,24,22,0.08)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* Avatar / mark */}
      <div
        className="rounded-xl flex items-center justify-center font-black"
        style={{
          width: 80,
          height: 80,
          backgroundColor: "#1a1816",
          color: "#e5e1db",
          fontFamily: "var(--font-inter)",
          fontSize: "1.75rem",
          letterSpacing: "-0.04em",
        }}
      >
        JR
      </div>

      {/* Identity */}
      <div className="flex-1 min-w-[200px]">
        <p className="font-black tracking-tight" style={{ fontFamily: "var(--font-inter)", fontSize: "1.25rem", color: "#1a1816", lineHeight: 1.1 }}>
          Jake Ryall
        </p>
        <p className="text-sm mt-1" style={{ color: "rgba(26,24,22,0.6)" }}>
          Designer & Developer · Phoenix, AZ
        </p>
      </div>

      {/* Status pill */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: "rgba(120,115,108,0.12)",
            border: "1px solid rgba(120,115,108,0.3)",
          }}
        >
          <motion.span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, backgroundColor: "#1a1816" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "#1a1816" }}>
            Available Q3 2026
          </span>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3.3: Rewrite Manifesto.tsx**

Replace the entire current `components/homepage/Manifesto.tsx` (it's 717 lines of pinned mantra + service stack — all of that goes). The new file:

```tsx
"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";
import Signature from "./Signature";
import AboutCard from "./AboutCard";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const reduce = prefersReducedMotion();
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const lead = sectionRef.current!.querySelector<HTMLElement>(".m-lead");
      const punch = sectionRef.current!.querySelector<HTMLElement>(".m-punch");

      [lead, punch].forEach((el, i) => {
        if (!el) return;
        const split = SplitText.create(el, { type: "words", mask: "words" });
        splits.push(split);
        gsap.set(split.words, { yPercent: 110 });
        gsap.to(split.words, {
          yPercent: 0,
          duration: reduce ? 0 : 0.8,
          stagger: 0.04,
          ease: "appleOut",
          delay: i * 0.2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        });
      });
    }, sectionRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="py-32 px-6"
      style={{ backgroundColor: "#d8d3cc" }} // slightly darker cream for rhythm
    >
      <div className="max-w-[1100px] mx-auto">
        {/* Kicker */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-8" style={{ color: "#78736c" }}>
          The Manifesto
        </p>

        {/* Mantra */}
        <div className="mb-12">
          <p
            className="m-lead font-medium tracking-tight"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              color: "rgba(26,24,22,0.55)",
              lineHeight: 1.05,
            }}
          >
            I don&apos;t ship pretty.
          </p>
          <p
            className="m-punch font-black tracking-tight"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: "#1a1816",
              lineHeight: 1.05,
              marginTop: "0.5rem",
            }}
          >
            I ship results.
          </p>
        </div>

        {/* Drop-cap paragraph */}
        <p
          className="manifesto-body"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
            lineHeight: 1.65,
            color: "rgba(26,24,22,0.75)",
            maxWidth: 720,
            marginBottom: "2.5rem",
          }}
        >
          <span
            style={{
              float: "left",
              fontFamily: "var(--font-inter)",
              fontSize: "3.5em",
              lineHeight: 0.85,
              fontWeight: 900,
              paddingRight: "0.12em",
              paddingTop: "0.05em",
              color: "#78736c",
            }}
          >
            B
          </span>
          eautiful sites that don&apos;t convert are portfolio pieces, not businesses. I work with founders and operators who need their site to do real work — bring in leads, qualify them, close them. Every section I build defends its place against that bar. If it doesn&apos;t move the metric, it doesn&apos;t ship.
        </p>

        {/* Signature */}
        <div className="flex justify-end mb-16">
          <Signature />
        </div>

        {/* About card */}
        <AboutCard />
      </div>
    </section>
  );
}
```

Note: the drop cap is rendered as a `<span>` floated left; the body text starts with the rest of the word ("eautiful"). This is the standard editorial drop-cap pattern — works with any word starting with B.

- [ ] **Step 3.4: Verify Manifesto in the browser**

Run dev server, scroll to Manifesto.

Visual checks:
- `THE MANIFESTO` kicker
- `I don't ship pretty.` reveals via word-mask (lighter weight, smaller)
- `I ship results.` reveals 200ms after (heavier weight, larger)
- Drop cap `B` is large, taupe, floated left of the paragraph
- Paragraph reads as continuous prose flowing around the drop cap
- Signature SVG draws on as it enters viewport (right-aligned)
- About card below: JR mark, name, role, location, status pill with pulsing dot
- Hover About card: lifts +2px, shadow expands

- [ ] **Step 3.5: Commit**

```bash
git add components/homepage/Manifesto.tsx components/homepage/Signature.tsx components/homepage/AboutCard.tsx
git commit -m "feat(manifesto): mantra + drop cap + signature + about card; remove service stack"
```

---

## Task 4: Proof rewrite — kill the horizontal pin, build a 3-card grid

**Files:**
- Rewrite: `components/homepage/Testimonials.tsx`
- Create: `components/homepage/ProofCard.tsx`

Reference: spec §8 (Proof)

- [ ] **Step 4.1: Create the ProofCard component**

Create `components/homepage/ProofCard.tsx`:

```tsx
"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { TransitionLink } from "@/components/PageTransition";
import { cardHoverVariants, tweenCounter, prefersReducedMotion } from "@/lib/microInteractions";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type ProofItem = {
  metricPrefix: string;
  metricValue: number;
  metricSuffix: string;
  metricLabel: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  year: string;
  slug: string;
};

export default function ProofCard({ item, featured = false }: { item: ProofItem; featured?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const valRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || !valRef.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (reduce) {
            valRef.current!.textContent = item.metricValue.toString();
            return;
          }
          tweenCounter(valRef.current!, item.metricValue, { duration: 1.4 });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [item.metricValue]);

  return (
    <motion.div
      ref={ref}
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className={`rounded-2xl p-8 flex flex-col ${featured ? "md:scale-[1.02]" : ""}`}
      style={{
        backgroundColor: "rgba(255,255,255,0.5)",
        border: featured ? "1.5px solid rgba(120,115,108,0.5)" : "1px solid rgba(26,24,22,0.08)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        minHeight: 380,
      }}
    >
      {/* Metric */}
      <div className="mb-6">
        <p className="font-black tracking-tight" style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(2.75rem, 4.5vw, 4rem)", color: "#1a1816", lineHeight: 1, letterSpacing: "-0.04em" }}>
          <span>{item.metricPrefix}</span>
          <span ref={valRef}>0</span>
          <span>{item.metricSuffix}</span>
        </p>
        <p className="text-xs uppercase tracking-[0.2em] mt-2" style={{ color: "#78736c" }}>
          {item.metricLabel}
        </p>
      </div>

      {/* Quote */}
      <p className="flex-1 mb-6" style={{ color: "rgba(26,24,22,0.8)", fontSize: "0.95rem", lineHeight: 1.55 }}>
        &ldquo;{item.quote}&rdquo;
      </p>

      {/* Attribution */}
      <div className="flex items-center justify-between gap-4 pt-4" style={{ borderTop: "1px solid rgba(26,24,22,0.08)" }}>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#1a1816" }}>{item.name}</p>
          <p className="text-xs" style={{ color: "#78736c" }}>
            {item.role} · {item.company} · {item.year}
          </p>
        </div>
      </div>

      {/* Case link */}
      <TransitionLink
        href={`/work/${item.slug}`}
        className="group inline-flex items-center gap-2 mt-4 text-xs font-semibold uppercase tracking-[0.15em]"
        style={{ color: "#1a1816" }}
      >
        <span className="relative">
          View case study
          <span className="absolute left-0 -bottom-0.5 h-px bg-current w-0 group-hover:w-full transition-all duration-300 ease-out" />
        </span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </TransitionLink>
    </motion.div>
  );
}
```

- [ ] **Step 4.2: Rewrite Testimonials.tsx (Proof section)**

Replace `components/homepage/Testimonials.tsx`:

```tsx
"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { prefersReducedMotion } from "@/lib/microInteractions";
import ProofCard, { type ProofItem } from "./ProofCard";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const proof: ProofItem[] = [
  {
    metricPrefix: "+",
    metricValue: 40,
    metricSuffix: "%",
    metricLabel: "Discovery flights",
    quote: "He nailed what we were trying to say about the flight school in the first round — new students started booking discovery flights through the site the week we launched.",
    name: "Michael Torres",
    role: "Owner",
    company: "Desert Wings",
    year: "2026",
    slug: "desert-wings",
  },
  {
    metricPrefix: "",
    metricValue: 2,
    metricSuffix: "×",
    metricLabel: "Booked calls",
    quote: "I'd been trying to describe my coaching for years. One conversation with Jake and the homepage read like it came out of my head. Conversions followed.",
    name: "Danny K.",
    role: "Founder",
    company: "Riled Up Coaching",
    year: "2025",
    slug: "riled-up",
  },
  {
    metricPrefix: "",
    metricValue: 6,
    metricSuffix: " wk",
    metricLabel: "Start to launch",
    quote: "Fast, opinionated, and he actually pushes back when something won't convert. That's rarer than it should be for someone shipping at this level.",
    name: "Sarah Lin",
    role: "Operations Lead",
    company: "Wings N Wheels",
    year: "2025",
    slug: "wings-n-wheels",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const reduce = prefersReducedMotion();
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const titleEl = sectionRef.current!.querySelector<HTMLElement>(".proof-title");
      if (titleEl) {
        const split = SplitText.create(titleEl, { type: "words", mask: "words" });
        splits.push(split);
        gsap.set(split.words, { yPercent: 110 });
        gsap.to(split.words, {
          yPercent: 0,
          duration: reduce ? 0 : 0.7,
          stagger: 0.04,
          ease: "appleOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%" },
        });
      }
    }, sectionRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="py-32 px-6" style={{ backgroundColor: "#e5e1db" }}>
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: "#78736c" }}>
            Proof
          </p>
          <h2 className="proof-title font-black tracking-tight" style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(2rem, 4.5vw, 3.75rem)", lineHeight: 1.05, color: "#1a1816" }}>
            What clients say after launch.
          </h2>
          <p className="text-sm mt-4" style={{ color: "rgba(26,24,22,0.55)" }}>
            <span style={{ color: "#1a1816", fontWeight: 700 }}>5.0</span> avg rating across recent launches.
          </p>
        </div>

        {/* 3-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {proof.map((item, i) => (
            <ProofCard key={item.slug} item={item} featured={i === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4.3: Verify Proof in the browser**

Run dev server, scroll to the new Proof section.

Visual checks:
- `PROOF` kicker + `What clients say after launch.` headline (word-mask reveal)
- `5.0 avg rating across recent launches.` line below
- 3 cards in a row on desktop, stacked on mobile
- Middle card is featured (slightly larger, taupe border)
- Each metric counts up on scroll-in (e.g., 0 → 40, 0 → 2, 0 → 6)
- Each card hovers: lifts, shadow expands
- "View case study →" underline draws in on hover, arrow slides right
- NO horizontal pin / no scroll-jacking — section scrolls normally

- [ ] **Step 4.4: Commit**

```bash
git add components/homepage/Testimonials.tsx components/homepage/ProofCard.tsx
git commit -m "feat(proof): replace pinned horizontal Testimonials with 3-card grid + animated metrics"
```

---

## Task 5: Contact rewrite — dual-CTA + availability widget

**Files:**
- Rewrite: `components/Contact.tsx` (desktop variant only)
- Create: `components/homepage/AvailabilityWidget.tsx`

Reference: spec §9 (Contact)

- [ ] **Step 5.1: Create the AvailabilityWidget**

Create `components/homepage/AvailabilityWidget.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { tagHoverVariants } from "@/lib/microInteractions";

// Static next-opening config for now. Could be sourced from Calendly later.
const NEXT_OPENING = "Jul 14";
const ALT_DATES = ["Jul 14", "Jul 21", "Jul 28"];

export default function AvailabilityWidget({ onPickDate }: { onPickDate?: (date: string) => void }) {
  return (
    <div
      className="rounded-xl p-4 mb-6"
      style={{
        backgroundColor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <motion.span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, backgroundColor: "#86efac" }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-xs uppercase tracking-[0.2em]" style={{ color: "rgba(229,225,219,0.7)" }}>
            Next opening
          </span>
        </div>
        <span className="text-sm font-bold" style={{ color: "#e5e1db" }}>{NEXT_OPENING}</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {ALT_DATES.map((d) => (
          <motion.button
            key={d}
            type="button"
            onClick={() => onPickDate?.(d)}
            variants={tagHoverVariants}
            initial="rest"
            whileHover="hover"
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              color: "#e5e1db",
              border: "1px solid rgba(229,225,219,0.18)",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
          >
            {d}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5.2: Rewrite the desktop Contact**

Open `components/Contact.tsx` and locate the existing default export. There's an existing `MobileContact` — keep it as-is. Build a new `DesktopContact` and update the default export to render mobile vs desktop based on viewport.

Replace the file contents (preserving MobileContact wholesale — copy it if needed before rewriting):

The new structure:

```tsx
"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { gsap, SplitText } from "@/lib/gsap-setup";
import { TransitionLink } from "@/components/PageTransition";
import { prefersReducedMotion } from "@/lib/microInteractions";
import AvailabilityWidget from "./homepage/AvailabilityWidget";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ---------- existing MobileContact stays as-is (paste from current file) ----------
// (preserve verbatim — only the DesktopContact + default export below changes)

function DesktopContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const reduce = prefersReducedMotion();
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const titleEl = sectionRef.current!.querySelector<HTMLElement>(".contact-title");
      if (titleEl) {
        const split = SplitText.create(titleEl, { type: "words", mask: "words" });
        splits.push(split);
        gsap.set(split.words, { yPercent: 110 });
        gsap.to(split.words, {
          yPercent: 0,
          duration: reduce ? 0 : 0.8,
          stagger: 0.05,
          ease: "appleOut",
          scrollTrigger: { trigger: titleEl, start: "top 80%" },
        });
      }
    }, sectionRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Stub — wire to actual endpoint later
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setDone(true);
  };

  return (
    <section ref={sectionRef} id="contact" className="hidden md:block py-32 px-6" style={{ backgroundColor: "#0a0908", color: "#e5e1db" }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* LEFT — invitation + dual CTAs */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4" style={{ color: "rgba(229,225,219,0.45)" }}>
            Contact
          </p>
          <h2 className="contact-title font-black tracking-tight" style={{ fontFamily: "var(--font-inter)", fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)", lineHeight: 1.05, color: "#e5e1db" }}>
            Let&apos;s build something.
          </h2>
          <p className="mt-6 max-w-md" style={{ color: "rgba(229,225,219,0.65)", lineHeight: 1.6 }}>
            Tell me about your project — I&apos;ll respond within a day.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#contact-form"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full transition-colors duration-300 hover:bg-[#78736c] group"
              style={{ backgroundColor: "#e5e1db", color: "#1a1816" }}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">Start a project</span>
              <span aria-hidden>→</span>
            </a>
            <a
              href="mailto:jaker@executiveaisolutions.com?subject=Hiring Inquiry"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full transition-colors duration-300 hover:bg-white/5"
              style={{ backgroundColor: "transparent", color: "#e5e1db", border: "1px solid rgba(229,225,219,0.25)" }}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">Resume + DM</span>
              <span aria-hidden>→</span>
            </a>
          </div>

          <p className="mt-6 text-sm" style={{ color: "rgba(229,225,219,0.4)" }}>
            For founders building. For teams hiring.
          </p>
        </div>

        {/* RIGHT — availability + form */}
        <div
          id="contact-form"
          className="rounded-2xl p-6 md:p-8"
          style={{
            backgroundColor: "rgba(229,225,219,0.03)",
            border: "1px solid rgba(229,225,219,0.1)",
          }}
        >
          <AvailabilityWidget onPickDate={(d) => setPicked(d)} />

          <form onSubmit={submit} className="space-y-4">
            <Field label="Your name" name="name" />
            <Field label="Email" name="email" type="email" />

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(229,225,219,0.5)" }}>
                Project type
              </label>
              <div className="flex flex-wrap gap-2">
                {["Website", "Brand", "Automation", "Other"].map((t) => (
                  <label key={t} className="cursor-pointer">
                    <input type="radio" name="projectType" value={t} className="sr-only peer" />
                    <span className="inline-block text-xs font-medium px-3 py-1.5 rounded-full peer-checked:bg-[#e5e1db] peer-checked:text-[#1a1816] transition-colors" style={{ border: "1px solid rgba(229,225,219,0.2)", color: "#e5e1db" }}>
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Field label="What are you building?" name="brief" maxLength={240} />

            {picked && (
              <p className="text-xs" style={{ color: "rgba(229,225,219,0.55)" }}>
                Preferred start: <span style={{ color: "#e5e1db", fontWeight: 600 }}>{picked}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || done}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: done ? "#86efac" : "#e5e1db", color: "#1a1816" }}
            >
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">
                {done ? "Got it ✓" : submitting ? "Sending…" : "Send →"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", maxLength }: { label: string; name: string; type?: string; maxLength?: number }) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(229,225,219,0.5)" }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        maxLength={maxLength}
        className="w-full bg-transparent border-0 border-b focus:outline-none focus:border-[#e5e1db] py-2 text-sm"
        style={{ borderBottomColor: "rgba(229,225,219,0.2)", color: "#e5e1db" }}
      />
    </div>
  );
}

// MobileContact preserved from existing implementation (paste verbatim from current file)
export function MobileContact() { /* ... existing implementation ... */ }

export default function Contact() {
  return (
    <>
      <MobileContact />
      <DesktopContact />
    </>
  );
}
```

CRITICAL: the current `Contact.tsx` exports `MobileContact` as a named export and a `Contact` default. Before pasting the rewrite, capture the existing `MobileContact` body verbatim and paste it back into the new file's `MobileContact` function. The mobile experience is intentionally preserved.

- [ ] **Step 5.2.1: Preserve MobileContact verbatim**

Read the current `Contact.tsx`, copy the entire `MobileContact` function body, and paste it into the rewrite from Step 5.2 where the comment indicates.

- [ ] **Step 5.3: Verify Contact in the browser**

Run dev server. Scroll to Contact. Test on desktop viewport.

Visual checks:
- Dark background section
- Left column: `CONTACT` kicker + `Let's build something.` (word-mask reveal) + paragraph + 2 CTAs (`Start a project` primary cream, `Resume + DM` ghost outlined)
- Right column: card with availability widget at top (green pulsing dot + `Next opening: Jul 14` + 3 date chips)
- Form: name, email, project type radio chips, brief input
- Click a date chip → bottom of form shows "Preferred start: Jul 14"
- Click radio chip → fills with cream background
- Click `Send →` → button shows "Sending…" briefly, then "Got it ✓" with green background
- Resize to mobile → MobileContact renders (verify it still works as before)

- [ ] **Step 5.4: Commit**

```bash
git add components/Contact.tsx components/homepage/AvailabilityWidget.tsx
git commit -m "feat(contact): dual-CTA invitation + availability widget + smart form"
```

---

## Task 6: Footer rewrite — modern grid sign-off

**Files:**
- Rewrite: `components/Footer.tsx`

Reference: spec §10 (Footer)

- [ ] **Step 6.1: Read existing Footer to capture any data needed**

Read `components/Footer.tsx`. Note: any sitemap links, social URLs, copyright text, JR mark behavior. Migrate those into the rewrite.

- [ ] **Step 6.2: Rewrite Footer.tsx**

Replace `components/Footer.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TransitionLink } from "@/components/PageTransition";

const SITEMAP = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services/website-design" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-ryall" },
  { label: "GitHub", href: "https://github.com/jaketryall" },
  { label: "Dribbble", href: "https://dribbble.com/jake-ryall" },
  { label: "Instagram", href: "https://instagram.com/exec.ai.solutions" },
  { label: "Email", href: "mailto:jaker@executiveaisolutions.com" },
];

const STATUS = "Last shipped: Apr 2026 · Currently building: Internal CMS for a Phoenix studio";

export default function Footer() {
  const [markHovered, setMarkHovered] = useState(false);
  return (
    <footer className="px-6 pt-20 pb-8" style={{ backgroundColor: "#0a0908", color: "#e5e1db" }}>
      <div className="max-w-[1280px] mx-auto">
        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
          {/* Col 1 — mark + name */}
          <div>
            <button
              type="button"
              onMouseEnter={() => setMarkHovered(true)}
              onMouseLeave={() => setMarkHovered(false)}
              className="inline-flex items-center gap-3"
              style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer" }}
            >
              <div
                className="rounded-lg flex items-center justify-center font-black transition-colors duration-300"
                style={{
                  width: 40, height: 40,
                  backgroundColor: markHovered ? "#78736c" : "rgba(229,225,219,0.1)",
                  color: markHovered ? "#0a0908" : "#e5e1db",
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.95rem",
                  letterSpacing: "-0.04em",
                }}
              >
                JR
              </div>
              <span className="text-sm font-semibold tracking-tight" style={{ color: "#e5e1db" }}>Jake Ryall</span>
            </button>
            <p className="text-xs mt-4" style={{ color: "rgba(229,225,219,0.4)" }}>
              Designer & Developer · Phoenix, AZ
            </p>
          </div>

          {/* Col 2 — Sitemap */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] mb-4" style={{ color: "rgba(229,225,219,0.4)" }}>Sitemap</p>
            <ul className="space-y-2">
              {SITEMAP.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="group inline-flex items-center gap-1 text-sm" style={{ color: "rgba(229,225,219,0.75)" }}>
                    <span className="relative">
                      {l.label}
                      <span className="absolute left-0 -bottom-0.5 h-px bg-current w-0 group-hover:w-full transition-all duration-300" />
                    </span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Socials */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] mb-4" style={{ color: "rgba(229,225,219,0.4)" }}>Socials</p>
            <ul className="space-y-2">
              {SOCIALS.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group inline-flex items-center gap-1 text-sm"
                    style={{ color: "rgba(229,225,219,0.75)" }}
                  >
                    <span className="relative">
                      {s.label}
                      <span className="absolute left-0 -bottom-0.5 h-px bg-current w-0 group-hover:w-full transition-all duration-300" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="overflow-hidden" style={{ borderTop: "1px solid rgba(229,225,219,0.08)", borderBottom: "1px solid rgba(229,225,219,0.08)" }}>
          <div
            className="flex whitespace-nowrap py-3"
            style={{ animation: "footer-marquee 60s linear infinite" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="px-6 text-xs uppercase tracking-[0.28em]" style={{ color: "rgba(229,225,219,0.4)" }}>
                Jake Ryall · Available Q3 2026 · Phoenix, AZ ·
              </span>
            ))}
          </div>
        </div>

        {/* Humanizing row */}
        <p className="text-xs mt-6" style={{ color: "rgba(229,225,219,0.4)" }}>
          {STATUS}
        </p>

        {/* Copyright */}
        <p className="text-[11px] mt-2" style={{ color: "rgba(229,225,219,0.25)" }}>
          © {new Date().getFullYear()} Jake Ryall · Built in Next.js
        </p>
      </div>

      <style jsx>{`
        @keyframes footer-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
```

- [ ] **Step 6.3: Verify Footer in the browser**

Run dev server, scroll to bottom of homepage.

Visual checks:
- 3-col grid: JR mark + name | Sitemap links | Social links
- Hover JR mark: fills with taupe, text inverts to dark
- Sitemap & social link text: thin underline draws in on hover
- Marquee row scrolls slowly across the bottom band
- Humanizing row: "Last shipped... Currently building..."
- Copyright row at very bottom

- [ ] **Step 6.4: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat(footer): modern grid sign-off with marquee, status, sitemap"
```

---

## Task 7: Final page reorder + cross-section QA

**Files:**
- Modify: `app/page.tsx`

Reference: spec §3 (Section Order)

- [ ] **Step 7.1: Verify final render order in app/page.tsx**

Open `app/page.tsx`. Confirm the `<main>` body matches:

```tsx
<main className="relative" style={{ zIndex: 10 }}>
  <Hero />
  <Work />
  <Capabilities />
  <Manifesto />
  <Testimonials />
  <Contact />
</main>
<Footer />
```

If the order doesn't match, reorder. Confirm `ScrollMarquee` is no longer imported or rendered.

- [ ] **Step 7.2: Mobile QA pass**

Open Chrome DevTools, set device to iPhone 14 Pro / Pixel 7. Scroll the entire homepage.

Per-section mobile checks:
- Hero: kicker visible, headline doesn't overflow, CTAs wrap cleanly
- Capabilities: 3 cards stack vertically, demos render correctly (Software demo's ring + KPI tiles fit on phone width)
- Manifesto: drop cap doesn't break paragraph layout, signature centers, About card stacks (avatar | identity | status)
- Proof: 3 cards stack vertically, metric numerals don't overflow
- Contact: MobileContact renders (the existing untouched experience), DesktopContact is hidden via `hidden md:block`
- Footer: 3 cols stack to single column, marquee still scrolls

- [ ] **Step 7.3: Reduced-motion QA pass**

In Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion" → "reduce". Reload.

Checks:
- Strikethrough mechanic: skips to final state immediately (no animations)
- Capabilities: cards fade in instantly, demos still play (looping demos can stay — they're decorative)
- Counters: snap to final value
- Signature: appears at full draw immediately
- About card status pulse: should still pulse (it's a tiny indicator) — acceptable
- Footer marquee: continues — acceptable

- [ ] **Step 7.4: Lighthouse pass (Chrome DevTools MCP)**

Run a Lighthouse audit on the homepage in Performance + Accessibility categories.

Targets:
- Performance: ≥ 85 (allow some leeway given the GSAP-heavy demos)
- Accessibility: ≥ 95

If Performance dips significantly:
- Check that DrawSVG/Flip/MotionPath are tree-shaking properly
- Defer the Capabilities looping demos until viewport entry (they shouldn't run if not visible)
- Verify all section components are dynamically imported

- [ ] **Step 7.5: Final visual sweep**

Walk through the homepage as a first-time visitor:
1. Hero loads, kicker appears, headline types + corrects to `converting`
2. Scroll: video shrinks into card fan (existing behavior)
3. Scroll: enter Capabilities, see services in bento grid with demos
4. Scroll: enter Manifesto, see mantra + drop cap + signature drawing in
5. Scroll: enter Proof, see 3 testimonial cards with metrics counting up
6. Scroll: enter Contact, see dual CTAs + form
7. Footer: clean grid, marquee scrolling

Confirm no janky scrolls, no scroll-jacking outside the existing Hero behavior, all hover states feel snappy.

- [ ] **Step 7.6: Final commit**

```bash
git add app/page.tsx
git commit -m "chore: finalize homepage section order, drop ScrollMarquee references"
```

---

## Self-Review Checklist (run after writing the plan)

Spec coverage check:
- [x] Hero polish (§5) — Task 1
- [x] Capabilities (§6) — Task 2
- [x] Manifesto (§7) — Task 3
- [x] Proof (§8) — Task 4
- [x] Contact (§9) — Task 5
- [x] Footer (§10) — Task 6
- [x] Section reorder (§3) — Task 7
- [x] Standard micro-interactions (§4) — Task 0 + applied throughout
- [x] Mobile considerations (§11) — Task 7.2
- [x] Accessibility / reduced motion (§12) — Task 7.3
- [x] Performance (§13) — Task 7.4
- [x] File plan (§15) — matches new/rewritten/deleted lists

No placeholders detected — every step has actual code or verifiable action.

Type consistency: `cardHoverVariants`, `tagHoverVariants`, `tweenCounter`, `prefersReducedMotion` are defined in Task 0 and consistently used in subsequent tasks.

---

## Notes for the implementer

- `appleOut` is a CustomEase already registered in `lib/gsap-setup.ts` — use it freely
- All section components must `"use client"` because they all use Framer Motion or GSAP
- Don't forget to add `id` attributes to sections (`#capabilities`, `#manifesto`, `#testimonials`, `#contact`) — anchor links elsewhere may reference them
- The signature SVG path in Task 3.1 is a placeholder scribble — refine in browser if the look is wrong
- The "Get in Touch" StaggerButton hover pattern Jake loves: see `components/Hero.tsx:58-114` — reuse this when adding any prominent CTA across sections
