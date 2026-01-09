# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Executive AI Solutions is a marketing website built with Next.js 16, TypeScript, Tailwind CSS v4, and Framer Motion. The site features a dark theme with electric blue (#0066ff) accents and modern glassmorphic design elements.

## Development Commands

```bash
# Start development server (uses Turbopack by default in Next.js 16)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture & Key Technical Decisions

### Tailwind CSS v4 with PostCSS
This project uses Tailwind CSS v4 with the official PostCSS integration:
- `app/globals.css` contains Tailwind imports and custom utilities
- PostCSS handles CSS compilation automatically via `postcss.config.mjs`
- NO separate CSS build step needed - Next.js handles it
- NO `tailwind.config.js/ts` needed - Tailwind v4 auto-detects content

**Critical Tailwind v4 Notes:**
- Import syntax is `@import "tailwindcss";` NOT `@tailwind base/components/utilities`
- PostCSS config uses `@tailwindcss/postcss` plugin
- Custom utilities must be defined in `@layer utilities {}` blocks
- CSS custom properties (like `--primary-blue`) work directly without theme config
- Arbitrary values like `bg-[#0066ff]` work without configuration
- Content detection is automatic - no need to configure content paths

### Custom CSS Utilities
The project defines several custom utilities in `app/globals.css`:
- `.bg-gradient-radial` - Radial blue gradient effect
- `.text-glow-blue` - Blue text glow effect
- `.border-glow-blue` - Blue border glow effect
- `.bg-glass` & `.bg-glass-blue` - Glassmorphic effects
- `.bg-grid-pattern` - Blue grid background pattern
- `.bg-noise` - Subtle noise texture overlay

### Component Structure
All components use client-side rendering (`"use client"`) for Framer Motion animations:
- Components are in `/components` directory
- Each section has its own component (Hero, Services, UseCases, etc.)
- Icons are custom SVG components in `Icons.tsx`
- All animations use Framer Motion with `useInView` for scroll triggers

### Design System
- Primary color: Electric blue (#0066ff)
- Dark theme by default
- Inter font from Google Fonts
- Glassmorphic card designs
- Blue glow effects on interactive elements

### Important Files
- `app/globals.css` - Source CSS with Tailwind imports and custom utilities
- `postcss.config.mjs` - PostCSS configuration with @tailwindcss/postcss
- `app/layout.tsx` - Root layout with metadata and font configuration
- `components/Icons.tsx` - Custom SVG icon components

### Next.js 16 Notes
- Turbopack is the default bundler (2-5x faster builds)
- The `next lint` command has been replaced with direct `eslint .`
- Dynamic Request APIs (params, searchParams, cookies, headers) require `await`
- React 19.2 is used

### Common Pitfalls to Avoid
1. Do NOT use `@tailwind base; @tailwind components; @tailwind utilities;` - this is v3 syntax
2. Do NOT create separate CSS build scripts - PostCSS handles everything
3. Do NOT expect `@apply` to work with custom utilities that aren't defined
4. CSS class names cannot start with a number (use `\33xl` escape for `3xl` prefix)
5. When using TypeScript with union types, always add null/undefined checks

---

## GSAP Animation Reference

This project uses GSAP for scroll-driven and complex animations. Always use `gsap.context()` for React cleanup.

### Setup Pattern (React/Next.js)
```typescript
import { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Use this pattern in components
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

useIsomorphicLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP animations here
  }, containerRef); // Optional: scope selectors to container

  return () => ctx.revert(); // Cleanup
}, []);
```

### Core Methods
| Method | Purpose | Example |
|--------|---------|---------|
| `gsap.to()` | Animate TO values | `gsap.to(".box", { x: 100, duration: 1 })` |
| `gsap.from()` | Animate FROM values | `gsap.from(".box", { opacity: 0, y: 50 })` |
| `gsap.fromTo()` | Define start AND end | `gsap.fromTo(".box", { x: 0 }, { x: 100 })` |
| `gsap.set()` | Instant change (no animation) | `gsap.set(".box", { visibility: "visible" })` |
| `gsap.quickTo()` | Optimized for frequent updates | `const xTo = gsap.quickTo("#el", "x", { duration: 0.4 })` |

### Special Properties (Tweens)
```javascript
gsap.to(".box", {
  // Animation properties
  x: 100,              // Transform translateX
  y: 50,               // Transform translateY
  rotation: 45,        // Degrees
  scale: 1.5,
  opacity: 0.5,

  // Timing
  duration: 1,         // Seconds (default: 0.5)
  delay: 0.5,          // Wait before start
  ease: "power2.out",  // Easing curve

  // Repeat
  repeat: -1,          // -1 = infinite
  yoyo: true,          // Reverse on alternate
  repeatDelay: 0.5,

  // Callbacks
  onStart: () => {},
  onUpdate: () => {},
  onComplete: () => {},
  onReverseComplete: () => {},

  // Stagger (multiple targets)
  stagger: 0.1,        // Simple: seconds between each
  stagger: {           // Advanced config
    each: 0.1,
    from: "center",    // "start", "end", "edges", "random", or index
    grid: "auto",      // or [rows, cols]
    axis: "x",         // or "y"
    ease: "power2"
  }
});
```

### Easing Options
- **Power**: `power0` (linear), `power1`, `power2`, `power3`, `power4`
- **Directions**: `.in`, `.out`, `.inOut` (e.g., `"power2.inOut"`)
- **Specialty**: `back`, `bounce`, `circ`, `elastic`, `expo`, `sine`
- **Steps**: `"steps(5)"` for frame-by-frame
- **Default**: `"power1.out"`

### Timeline (Sequencing)
```javascript
const tl = gsap.timeline({
  defaults: { duration: 1, ease: "power2.out" },
  paused: true,           // Start paused
  repeat: -1,
  yoyo: true,
  onComplete: () => {}
});

// Add animations with position parameter
tl.to(".box1", { x: 100 })           // Starts at 0
  .to(".box2", { x: 100 }, "<")      // Same time as previous
  .to(".box3", { x: 100 }, ">")      // After previous ends
  .to(".box4", { x: 100 }, "+=0.5")  // 0.5s gap after previous
  .to(".box5", { x: 100 }, "-=0.5")  // 0.5s overlap with previous
  .to(".box6", { x: 100 }, 2)        // At exactly 2 seconds
  .to(".box7", { x: 100 }, "<0.5")   // 0.5s after previous starts
  .addLabel("middle")
  .to(".box8", { x: 100 }, "middle+=1");

// Control
tl.play();
tl.pause();
tl.reverse();
tl.seek(2);          // Jump to 2 seconds
tl.progress(0.5);    // Jump to 50%
tl.timeScale(2);     // 2x speed
```

### ScrollTrigger
```javascript
// Attached to tween
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",           // Element that triggers
    start: "top center",       // "trigger viewport" (e.g., "top 80%")
    end: "bottom top",         // When animation ends
    scrub: true,               // Link to scrollbar (or number for smoothing)
    pin: true,                 // Pin element during animation
    pinSpacing: true,          // Add spacing for pinned element
    markers: true,             // Debug markers
    toggleActions: "play pause resume reset", // onEnter onLeave onEnterBack onLeaveBack

    // Callbacks
    onEnter: () => {},
    onLeave: () => {},
    onEnterBack: () => {},
    onLeaveBack: () => {},
    onUpdate: (self) => {
      console.log(self.progress, self.direction, self.getVelocity());
    }
  }
});

// Standalone (no animation)
ScrollTrigger.create({
  trigger: ".section",
  start: "top center",
  onEnter: () => console.log("entered"),
  onToggle: (self) => console.log("active:", self.isActive)
});

// Horizontal scroll
gsap.to(container, {
  x: () => -(container.scrollWidth - window.innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: wrapper,
    pin: true,
    scrub: 1,
    end: () => `+=${container.scrollWidth - window.innerWidth}`
  }
});

// Batch animations (staggered on scroll)
ScrollTrigger.batch(".card", {
  onEnter: (elements) => gsap.to(elements, { opacity: 1, y: 0, stagger: 0.1 }),
  onLeave: (elements) => gsap.to(elements, { opacity: 0, y: -50 }),
  start: "top 85%"
});

// Refresh after DOM changes
ScrollTrigger.refresh();
```

### Utility Methods
```javascript
gsap.utils.clamp(0, 100, value)              // Constrain to range
gsap.utils.mapRange(0, 1, 0, 100, 0.5)       // Map 0.5 from 0-1 to 0-100 = 50
gsap.utils.interpolate(0, 100, 0.5)          // Returns 50
gsap.utils.random(-100, 100)                 // Random number
gsap.utils.random([1, 5, 10])                // Random from array
gsap.utils.wrap(0, 100, 150)                 // Returns 50 (wraps around)
gsap.utils.snap(10, 23)                      // Returns 20 (snap to nearest 10)
gsap.utils.toArray(".box")                   // NodeList to array
gsap.utils.distribute({ base: 0, amount: 100, from: "center" })
```

### Responsive Animations
```javascript
const mm = gsap.matchMedia();

mm.add("(min-width: 800px)", () => {
  // Desktop animations
  gsap.to(".box", { x: 500 });
  return () => { /* cleanup */ };
});

mm.add("(max-width: 799px)", () => {
  // Mobile animations
  gsap.to(".box", { x: 100 });
});

mm.add({
  isDesktop: "(min-width: 800px)",
  isMobile: "(max-width: 799px)",
  reduceMotion: "(prefers-reduced-motion: reduce)"
}, (context) => {
  const { isDesktop, reduceMotion } = context.conditions;
  gsap.to(".box", {
    x: isDesktop ? 500 : 100,
    duration: reduceMotion ? 0 : 1
  });
});
```

### Common Patterns

**Reveal on scroll:**
```javascript
gsap.from(".card", {
  y: 50,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".cards-container",
    start: "top 80%"
  }
});
```

**Parallax effect:**
```javascript
gsap.to(".bg-image", {
  y: "30%",
  ease: "none",
  scrollTrigger: {
    trigger: ".section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
```

**Text reveal (with SplitText or manual):**
```javascript
// Manual split
const chars = text.split("").map(char => `<span class="char">${char}</span>`).join("");
element.innerHTML = chars;

gsap.from(".char", {
  y: "100%",
  opacity: 0,
  duration: 0.5,
  stagger: 0.02,
  ease: "power2.out"
});
```

**Pin + horizontal scroll section:**
```javascript
const sections = gsap.utils.toArray(".panel");
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".container").offsetWidth
  }
});
```

### Performance Tips
1. Use `will-change: transform` sparingly
2. Prefer `x`, `y`, `scale`, `rotation` over `left`, `top`, `width`, `height`
3. Use `gsap.quickTo()` for mousemove/high-frequency updates
4. Call `ScrollTrigger.refresh()` after layout changes
5. Use `gsap.ticker.lagSmoothing(0)` to disable if causing issues
6. Batch similar animations with `ScrollTrigger.batch()`

### Debugging
```javascript
// Enable ScrollTrigger markers
scrollTrigger: { markers: true }

// Log timeline state
console.log(tl.progress(), tl.time(), tl.duration());

// GSDevTools (if installed)
GSDevTools.create({ animation: tl });
```
