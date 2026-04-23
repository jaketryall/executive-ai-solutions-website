# Scroll Rhythm Redesign — Design Spec

**Date:** 2026-04-22
**Branch:** `redesign/hero-v2`
**Status:** Approved — ready for implementation plan

## Problem

The current homepage operates in one visual register. ~90% of the scroll lives on warm cream (`#f3f1ee`) with ink accents. Every section follows the same recipe: small kicker → huge bold headline → body → content. The craft is strong (polished motion, tight typography, tasteful micro-detail) but the user's feedback is "everything feels the same boring." The site has no dynamic range — no pulse between dense and sparse, light and dark, bold and calm.

Reference sites the user loves (nixtio.com, framer.com) solve this two different ways:

- **Nixtio** pulses light/dark between sections. Uses one gigantic wordmark for brand confidence, outlined/stroke text as a signature motif, and small corner labels as anchors.
- **Framer** stays dark throughout but changes layout register — centered hero, colorful bento showcase, sticky left-rail product tour with live demos.

This redesign borrows both sets of signatures to give the EAS homepage a scroll rhythm of `○ ● ● ○ ● ○ ○` (light, dark, dark, light, dark, light, light) while also shifting the **structural register** of three sections (FeaturedWork → bento grid, Mission → outlined manifesto, Services → sticky-rail product tour).

## Goals

1. Give the scroll a **pulse** — clear alternation between light and dark registers so the eye has rhythm to follow.
2. Break the **structural monotony** — at least two sections should use a fundamentally different layout register from the current kicker-headline-body recipe.
3. Keep the redesign **focused on surface + rhythm**, not typography or brand. Same fonts, same voice, same color tokens (ink, paper, oxblood) — used with more confidence and contrast.
4. Preserve conversion priority — the hero's `Ship, don't slide.` headline, the `Start a project` CTA, and the Services pricing/duration data all remain prominent.
5. Preserve the existing motion language — SplitText reveals, scroll-driven choreography, magnetic hovers. Add to it; don't replace it.

## Non-goals

- Not rewriting Hero, About, or Contact. Those stay (Hero gets a palette token tweak only).
- Not rebuilding the navbar, cursor, or page shell.
- Not changing typography — Inter + Geist stay. No font swaps.
- Not introducing new brand colors — ink, paper, oxblood only. A single new token (`--ink-deep: #0e0d0c`) is added for "cinema black."
- Not changing section order — the existing sequence (Hero → Testimonials → FeaturedWork → Mission → Services → About → Contact) is preserved.

## Design

### Scroll rhythm map

| # | Section | Today | Proposed | Register |
|---|---------|-------|----------|----------|
| 1 | Hero | cream | cream (palette token tweak only) | ○ light |
| 2 | Testimonials | cream marquee, nearly invisible | **dark ink, pull-quote anchor + marquee** | ● dark |
| 3 | FeaturedWork | dark 2×2 grid | dark **bento grid** (Framer) | ● dark |
| 4 | Mission | cream, forgettable | cream, **outlined-stroke manifesto** (Nixtio) | ○ light |
| 5 | Services | cream 3-card fan-out | **dark, sticky-rail product tour** (Framer) | ● dark |
| 6 | About | cream | cream (breather) | ○ light |
| 7 | Contact | cream | cream (breather) | ○ light |

### Palette contract

- `--paper: #f3f1ee` (unchanged, existing)
- `--ink: #1a1816` (unchanged — kept for current usage in Hero/About/Contact)
- `--ink-deep: #0e0d0c` **(new)** — "cinema black" for the dark-flip sections (Testimonials, FeaturedWork, Services). Slightly blacker than existing ink; reads more as a theatrical backdrop.
- `--oxblood: #7a1e27` (unchanged, existing) — used as the single accent. One oxblood moment per dark section, one per light section. No other accent colors.

### Section 1 — Testimonials (dark flip)

**File:** `components/marketing/TestimonialMarquee.tsx` (rewrite)
**Register:** dark, first break after hero.

**Layout:**
- Background: `--ink-deep`.
- Top edge: 1px oxblood hairline (full-width) as the "seam in."
- Centered content column, max-width ~1100px.
- Large pull-quote set in `--paper` typeface color, ~clamp(2.5rem, 5vw, 4.5rem), line-height 1.1.
- Oxblood open/close quote marks set larger than the text (decorative-scale), positioned as typographic anchors, not full quote characters.
- Attribution line below: name (paper, medium weight) · role (paper/60, mono-tracked uppercase tiny).
- Below quote: the existing client-names marquee, paper-text-on-ink variant, velocity-skew motion preserved.

**Rotation logic:**
- Pool of 3–5 testimonials (data constant at top of file; stays in this file for now, not Sanity).
- Auto-advance every ~8s. Pause when the user's cursor is within the quote's bounding box.
- Exit: current quote chars cascade down + fade out via SplitText (stagger 0.015, ease power2.in).
- Enter: next quote chars cascade up from below + fade in (stagger 0.015, ease power2.out).
- On mount: one initial SplitText reveal triggered by `useInView`.

**Motion details:**
- Velocity-skew marquee: retained from current implementation.
- Pull-quote rotation: driven by a simple `useEffect` interval + hover state (no GSAP ScrollTrigger needed for rotation).
- Hover-slow marquee: retained (`timeScale` 0.15 on hover, same as today).

**Oxblood moment:** the quote marks.

### Section 2 — FeaturedWork (bento grid)

**File:** `components/marketing/FeaturedWork.tsx` (rewrite layout, keep project data)
**Register:** dark (continuation from Testimonials).

**Layout:**
- Background: `--ink-deep` (same as Testimonials — the two dark sections form one continuous dark block; seam only at the top of Testimonials and the bottom of FeaturedWork).
- Grid: 5-column bento on desktop (`grid-cols-5`), 2-column on tablet, 1-column on mobile.
- Tile map (6 projects → 6 tiles on desktop):
  - Tile A (hero): `col-span-3 row-span-2` — biggest showcase project.
  - Tile B (hero): `col-span-2 row-span-2` — second showcase.
  - Tiles C/D/E/F (supporting): `col-span-2 / 3 / 2 / 3` in the next row, creating asymmetric breaks.
- Each tile:
  - Background: a per-project colored card (colors pulled from the project's own brand — e.g. Desert Wings = desert orange, Riled Up = lime, Wings N Wheels = warm cream, Adventure Air = cobalt).
  - Full-bleed project screenshot inside, object-cover.
  - Hover: scale 1.03, image darken-overlay fades in 0 → 0.15, chrome bar slides down from top with `<site>.com · 2025 · Next.js, Stripe` in mono tiny, cursor becomes text `→ View`.
  - Category label: tiny paper/60 mono uppercase, top-left corner.
  - Title: bottom-left, paper text, ~1.25rem bold.

**Motion:**
- On scroll-enter: tiles fade + rise 40px in a staircase stagger (0.08s between tiles, 600ms each, ease `expo.out`). Triggered by `ScrollTrigger.batch` so it only fires once when visible.
- Replaces the existing fan entrance — cleaner, faster, less theatrical.

**Oxblood moment:** `View all work` CTA at the bottom uses oxblood on hover.

### Section 3 — Mission (outlined manifesto)

**File:** `components/marketing/Mission.tsx` (rewrite)
**Register:** cream — the calm breather after two dark sections.

**Layout:**
- Background: `--paper`.
- Section height: min 90vh.
- Corner label retained and refined: `05 · MISSION · SKU EAS/2026/Q2 · IN TRANSIT` in tiny mono tracked uppercase, top-left.
- Single manifesto statement occupies ~70% of the section, centered vertically, left-aligned.
- **Statement text:** "Motion is a feature, not decoration." Split into words, roughly half filled ink + half outlined (transparent fill, 1.5px ink stroke). Example allocation: `Motion is a feature, not decoration.` — "Motion", "feature", "decoration" filled; "is", "a", "not" outlined. (Exact allocation tuned at implementation time for visual rhythm.)
- Below manifesto: a 3-column stat row.
  - Each stat: huge numeral (Geist, ~clamp(3rem, 6vw, 5rem), 900 weight) + tiny mono legend below.
  - Proposed content: `3× shipped this quarter / 2-person team / $0 ad spend`.
- Subtle horizontal hairline (ink/15 opacity) separating stats from manifesto.

**Motion:**
- On scroll-enter: each outlined word's stroke "fills in" sequentially — implemented as a clip-path sweep from left to right, animating a duplicate filled copy revealing behind the outlined version. Driven by ScrollTrigger scrub, so the fill progress is tied to scroll position. Total scroll distance for full fill-in: ~40% viewport height.
- Stat numerals count up (existing `CountUp.tsx` component) when section enters view.

**Oxblood moment:** one of the stats (e.g. `$0 ad spend`) uses oxblood for the numeral.

### Section 4 — Services (Framer sticky-rail product tour)

**File:** `components/marketing/Services.tsx` (rewrite — biggest lift)
**Register:** dark, the boldest swing.

**Layout:**
- Background: `--ink-deep`.
- Section total height: ~300vh (three services × one sticky viewport each).
- Inner grid: `grid-cols-[2fr_3fr]` — 40% left, 60% right.
- **Left rail (sticky):** sticks at `top: 0` for the full section duration.
  - Three rail items stacked, each ~8rem tall on desktop.
  - Each item has: `01` / `02` / `03` numeral (huge, paper/30), title (paper, bold, ~1.5rem), short meta line (paper/60 mono, `4–6 weeks · from $12k`).
  - Active item: fills oxblood on the numeral, underline bar extends from 40px → 100% of item width (0.5s ease).
  - Inactive items: numeral paper/30, title paper/60.
- **Right pane (not sticky — each deliverable is one viewport tall):**
  - Full-height browser chrome frame (traffic lights, URL bar) containing the live deliverable mock.
  - Three deliverables, each one viewport tall:
    - **01 Marketing sites** — scrolling preview of a mock client site. Inside the browser frame, the mock page scrolls itself slowly. A floating "Leads booked" counter chip in the corner ticks up 0 → 47 as the user scrolls through this service.
    - **02 Custom CRMs** — starts showing 5 browser tabs (Google Sheets, Calendly, Gmail, Notion, Stripe). As the user progresses through this viewport, the tabs animate-collapse into one unified CRM interface. Uses Framer Motion `layout` animations.
    - **03 AI voice receptionists** — phone UI with an incoming call. As the user scrolls, a transcript streams in line by line (typewriter effect). End state: an `Appointment booked · 9:47 AM` confirmation chip slides in.
- **Below the sticky section:** a tiny tech-stack row per service (pills) — retains current stack data (Next.js, Postgres, Vapi, etc.) but as a single horizontal row at the end of the section, not inside the rail items.

**Scroll logic:**
- Each deliverable viewport triggers `active` state for its rail item when its top reaches 30% of the viewport.
- Transition between deliverables in the right pane: soft crossfade (300ms) + the inactive deliverable's internal motion pauses.
- Optional: scroll-snap-stop on the section so each service "locks" one viewport (behind a media query that disables on touch/mobile to avoid trapping users).

**Motion:**
- Rail item highlight transition: 0.5s ease `power2.out`.
- Inner deliverable motions: each runs its own internal animation loop (counter ticking, tabs collapsing, transcript streaming) — autoplay when that deliverable is active, pause when inactive.

**Oxblood moment:** the active rail item's numeral + underline.

### Shared — Section seams

**File:** `components/ui/SectionSeam.tsx` (new)

A reusable component that sits between a dark and a light section (or vice versa) to soften the transition without erasing the rhythm.

**Anatomy:**
- Height: 80vh on desktop, 40vh on mobile.
- Background: linear gradient between the two surrounding section colors (e.g. `paper → ink-deep`).
- Centered 1px hairline rule across the middle, colored as the "target" section's accent.
- Tiny label on the hairline, centered or right-aligned: `→ 03 / FEATURED WORK · 2025 – PRESENT` in mono tracked uppercase, paper or ink depending on direction.
- Optional: a small oxblood dot at the left edge of the hairline to act as a "you're moving here" indicator.

**Usage:**
- Between Hero (○) and Testimonials (●): seam paper→ink.
- Between FeaturedWork (●) and Mission (○): seam ink→paper.
- Between Mission (○) and Services (●): seam paper→ink.
- Between Services (●) and About (○): seam ink→paper.
- No seam needed between Testimonials (●) and FeaturedWork (●) — continuous dark block.
- No seam needed between About (○) and Contact (○) — continuous light block.

### Files touched

**Rewrites:**
- `components/marketing/TestimonialMarquee.tsx`
- `components/marketing/FeaturedWork.tsx`
- `components/marketing/Mission.tsx`
- `components/marketing/Services.tsx`

**New:**
- `components/ui/SectionSeam.tsx`

**Touched (small edits):**
- `app/globals.css` — add `--ink-deep: #0e0d0c` token, any supporting utilities for stroked text and browser-chrome mocks.
- `app/page.tsx` — drop `<SectionSeam>` instances between sections per the usage table above.

**Unchanged:**
- `components/Hero.tsx` (aside from the `--ink-deep` token if it uses it anywhere, which it currently does not).
- `components/Navbar.tsx`, `components/Footer.tsx`.
- `components/marketing/About.tsx`, `components/marketing/Contact.tsx`.

### Motion discipline

- All new animations registered via `gsap.context()` with proper cleanup in `useLayoutEffect` → return `ctx.revert()`.
- All ScrollTrigger instances include explicit `start`/`end` values. `markers: false` in production.
- `prefers-reduced-motion` respected: `gsap.matchMedia` used to disable scroll-scrubbed animations (outlined text fill, sticky-rail deliverable motions). Static states render the "complete" visual immediately.
- Mobile (<768px): the Services sticky-rail falls back to three stacked dark cards with the deliverable shown inline below each title (no sticky, no scroll-snap). Reason: sticky rails are hostile on mobile.

### Content / data

- Testimonials: 3–5 quotes; content stays hardcoded in `TestimonialMarquee.tsx` for now (Sanity migration is a later pass, out of scope).
- FeaturedWork: existing 6 projects; add a `tileColor` field to the project data. Keep data in `FeaturedWork.tsx`.
- Mission: manifesto copy + 3 stats hardcoded in `Mission.tsx`.
- Services: existing `SERVICES` constant in `Services.tsx` gains a `deliverable: 'site' | 'crm' | 'voice'` discriminator so the right pane knows which mock to render.

### Accessibility

- Dark sections: verify ink-deep (#0e0d0c) + paper (#f3f1ee) hits WCAG AA (ratio ~19:1 — passes AAA).
- Oxblood on ink-deep: verify AA for large text only; avoid oxblood body copy on dark.
- All rail items in Services are keyboard-focusable anchors (`<Link>`) even though they're scroll-driven. Clicking jumps to that service's viewport (smooth scroll).
- Testimonial rotation: include `aria-live="polite"` so screen readers announce quote changes.
- Sticky rail: includes `aria-current` on the active item.

## Open questions / deferred

- Which specific clients to quote in the Testimonials section — TBD during implementation, user will supply final copy.
- Whether to migrate Testimonials + Services data to Sanity — deferred to a future pass.
- Mission stats — the specific numbers (`3× shipped`, etc.) are placeholders; user will confirm actuals before ship.

## Success criteria

1. Scrolling the home page from top to bottom shows clear light/dark alternation — a visitor can describe the "shape" of the page after one pass.
2. At least three sections use visually distinct structural registers (Hero cream editorial, FeaturedWork bento, Services sticky-rail). No two adjacent sections look "the same" at thumbnail scale.
3. Existing conversion mechanics preserved: hero headline + CTA, service pricing/duration, contact form. No hard-to-spot regressions in scroll performance (maintain 60fps on a 2020 MacBook Pro on the redesigned sections).
4. Accessibility: no new WCAG AA failures. `prefers-reduced-motion` delivers a fully usable static experience.
