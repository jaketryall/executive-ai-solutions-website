# EAS Portfolio Redesign — Design Spec

**Date:** 2026-04-22
**Brand:** Executive AI Solutions (EAS), founder-signed by Jake Ryall
**Branch:** `redesign/hero-v2` (continuing)
**Status:** Design locked, pending user review before implementation plan.

---

## 1. Overview

This is a top-to-bottom redesign of the EAS single-page site from a 2023/2024-era agency template into a 2026-grade design-engineer/studio portfolio. The current site is craft-heavy but executes a dated vocabulary (kinetic marquee hero, pinned belief reveals, paper→ink seams, outlined numerals, custom cursor, Lenis smooth scroll). The redesign keeps what works (Hero video→fan, FeaturedWork bento, scroll progress, navbar/footer behavior), replaces the dated patterns with a single coherent system, and adds two interactive moments that no other agency in the peer set has: a **scope estimator** and a **live embedded slice of a shipped CRM**.

The site serves skeptical operators deciding whether to hire EAS. Every motion choice, every copy line, every micro-detail must reinforce two things simultaneously: **"they'll build something real"** and **"it'll be beautiful."** Beauty is non-negotiable — the user has explicitly traded timeline for craft.

---

## 2. Goals & Non-Goals

### Goals
- Feel like a 2026 design-engineer studio (Paco Coursey / Rauno Freiberg / Basement / Darkroom tier), not a 2023 agency template.
- Reinforce the positioning "we ship working software, not slides" through the interface itself, not just copy.
- Every section applies the motion vocabulary — no section feels templated.
- Beauty-first: each section gets at least one "why did they bother with that" micro-detail.
- Convert skeptical operators. Scope estimator is the highest-leverage conversion element.
- Machine Experience (MX) layer present — `llms.txt`, JSON-LD.

### Non-Goals
- Scroll-hijacking, Lenis smooth scroll, custom cursor tracking ring.
- Dark ↔ light section alternation with seam transitions.
- Separate case study pages (out of scope for this spec — tracked as follow-up).
- Internationalization.
- CMS/content-management layer. Copy is hard-coded in components.

---

## 3. Visual System

### Palette
| Token | Hex | Role |
|---|---|---|
| `--paper` | `#e5e1db` | Primary background (warm cream) |
| `--ink` | `#1a1816` | Primary text |
| `--taupe` | `#78736c` | Secondary text, metadata |
| `--oxblood` | `#7a1e27` | **Single deep accent** — section numbers, status dots, hover states, the one word in the hero |
| `--ox-deep` | `#5a1520` | Oxblood deep (pressed / layered shadow) |
| `--paper-warm` | `#efebe4` | Surface lift (card bg over paper) |

**Dark sections are removed from the homepage.** The site commits to warm paper throughout. The Live CRM embed uses `--ink` as its internal background (appropriate — it's a simulated product interface).

### Typography
- **Display:** Geist (via `next/font/google`), weight 900 primary, 500–700 for body weight where used. Loaded with `variable` option so weight-axis motion is available.
- **Mono:** Geist Mono, weight 500 primary, 700 for emphasis in tags.
- **Hero scale:** `clamp(4rem, 10vw, 11rem)`, tracking `-0.055em`, line-height `0.85`.
- **Section title scale:** `clamp(2.4rem, 5.5vw, 5rem)`, tracking `-0.04em`, line-height `0.96`.
- **Body:** 14–15px base, `leading-[1.55]`, Geist weight 400.
- **Labels/mono:** 10–11px, tracking `0.18em`, uppercase, Geist Mono 500.

Delete Inter. Remove the legacy `.font-display` / `.font-sans` mapping in [app/globals.css](app/globals.css) and replace with `font-geist` / `font-geist-mono` utility classes, driven by the variables injected by `next/font`.

### Motif: B1 Tracking Tag
The recurring header used by every section. A small tracking-tag label, `[02][Selected Work]`, with an oxblood lead block holding the section number and a cream body with the section name. Paired with a small mono SKU and status ("IN TRANSIT"). A progress rule sits below major section headers and fills oxblood as the section passes the viewport center — this is the site's recurring motion signature.

```
[02][Selected Work]    SKU · EAS/2026/Q2                     ● IN TRANSIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        ▲ oxblood fills left-to-right as user scrolls the section
```

As user scrolls past a section, its status transitions: `IN TRANSIT` (oxblood pulsing dot) → `DELIVERED` (check mark, taupe). This creates a meta-narrative: the site literally ships sections as they're consumed.

The motif exists at three scales:
- **Large:** section header (full tracking tag + SKU + status + progress rule)
- **Medium:** project card's category pill + year badge (smaller, same language)
- **Micro:** cursor **Action Tag** on hover (mini lead + body, same oxblood + mono)

---

## 4. Section Architecture

```
01 · Hero                   Monumental type + video→fan with perspective depth
02 · Testimonial Marquee    3 rotating client quotes (not kinetic copy-poetry)
03 · Selected Work          Asymmetric bento (keep 7/5/12), B1 header
04 · Live CRM (Signature C) Working embedded slice of a shipped CRM
05 · Mission                3 beliefs, text-first, unpinned (replaces Promise)
06 · Services               3 outcome-framed offerings
07 · Process                5-step vertical timeline, each step B1 mini-headed
08 · Estimator (Signature B) Pick project + scope → real $$ range + timeline
09 · About                  Founder-led studio voice, 4–5 short paragraphs
10 · Contact                2-field form (name/email) + textarea + Cal.com link
11 · Footer                 Wordmark, © 2026 EAS LLC, 3 links
```

---

## 5. Copy Drafts

### 01 · Hero
```
— Top nav row —
EAS — Executive AI Solutions · Rocklin, CA          ● Available Q3 · 2 slots

— Headline (cream) —
Ship, don't
slide.                                              [slide. is oxblood]

— Subhead (taupe, 18px) —
A two-person studio building the software small operators
actually need — custom CRMs, AI voice receptionists, real
marketing sites. We ship in weeks, not quarters.

— Bottom hint —
↓ Selected work                                     2026
```

### 02 · Testimonial Marquee
Rotating marquee (no fake logos, just text quotes). Three quotes cycle:

```
"They shipped what three agencies said wasn't possible." — Adventure Air
"Built faster than my internal team estimated. Still running two years later." — Wings N Wheels
"The estimator on their site gave me a number in 30 seconds. That's the kind of studio they are." — Riled Up
```

Each quote displayed at `clamp(1.6rem, 3vw, 2.4rem)`, the client attribution in mono at 12px. Skew ±2° based on scroll velocity.

### 03 · Selected Work
Header:
```
Four things we've built
that actually run.
```
Body (14px taupe): *"Not case studies in the past tense — live products still used every day by the people who hired us. Click one to see how it was built, what it solves, and what it cost."*

Cards preserve existing structure ([FeaturedWork.tsx](components/marketing/FeaturedWork.tsx)) but:
- Header restyled to B1 motif
- Category pill restyled to match tracking-tag micro-scale
- Image develop-on-hover treatment added (see §6)

### 04 · Live CRM (Signature C)
Header copy:
```
A working slice of the CRM
we shipped for Adventure Air.
```
Body: *"This is real code from the production build, wired to demo data. Try the keyboard nav. Click a lead. Drag between columns. Same pattern their ops team uses every day."*

Mechanics covered in §7.

### 05 · Mission
Three beliefs, text-first, no pinning. Each belief is a single paragraph block at `clamp(1.8rem, 3.2vw, 2.6rem)`, display weight 700, leading 1.2, tracking `-0.025em`.

```
01 · We ship wet.
Polish is a veil. We'd rather hand off something alive and
half-dry than perfect and brittle. The next fix gets made Monday.

02 · Motion is a feature, not a coat of paint.
Animation carries meaning — hierarchy, causality, feedback.
We design it in from the first sketch, not on top of it at the end.

03 · The hardest skill is deletion.
Good design engineering is knowing what to cut — and having the
spine to cut it, today, before anyone gets attached. Everything
you keep pays rent.
```

The oxblood period at the end of each belief punches in 200ms late (micro-timing detail).

### 06 · Services
Three outcome-framed service cards:

```
01 · Marketing sites that actually convert.
Not a pretty brochure — a tight, fast, measured site that turns
the traffic you're already paying for into booked calls.
— 4–6 weeks · from $12k
— Stack: Next.js · TypeScript · Tailwind · Sanity

02 · Custom CRMs that replace five tabs.
Your ops manager stops juggling Google Sheets, Calendly, and three
inboxes. One tool, built for exactly how you work.
— 6–10 weeks · from $18k
— Stack: Next.js · Postgres · Supabase · Stripe

03 · AI voice receptionists that stop the lead bleed.
Answers every inbound call 24/7, qualifies, books, and hands you
a transcript. Most of our clients recover the cost in 60 days.
— 4–6 weeks · from $15k
— Stack: Vapi · OpenAI · Twilio · Next.js
```

### 07 · Process
Five-step vertical timeline, each step B1 mini-headed. Left side: oxblood vertical rule that fills top-to-bottom scrub-linked to scroll. Right side: copy.

```
[01] Working call
Free, 30 minutes. We talk about the actual problem — what broke,
what's blocking, what "done" looks like.

[02] Scope
You get a written proposal in 48 hours. Fixed price, firm calendar.
No "it depends."

[03] Build
You see it every Friday. No big reveals, no surprises. If something's
going wrong, you know by week two, not week eight.

[04] Launch
We ship it live when it works, not when a document says we should.

[05] Live
Thirty days of free fixes. After that, optional monthly retainer or
we wave. We don't hostage-take.
```

### 08 · Estimator (Signature B)
See §7. Copy keys:
- Heading: `Rough numbers, in 30 seconds.`
- Body: *"Pick what you're building, how tight the timeline is, what's included. You'll get a real range — the same one we'd quote on a call, just faster. Want to book the call? Press the button."*
- Disclaimer below result: *"A real quote requires a call. This is a sanity check — it's within 15% of what we actually propose, 90% of the time."*

### 09 · About
```
EAS is a two-person studio. I design and build. My partner handles ops,
client comms, and edits the copy that would otherwise sound like me at
a dinner party.

We started because every agency quote we saw in 2023 was a slide deck
priced like software. So we started pricing software like software —
and telling operators what it actually costs before they had to book
a call. That transparency is the estimator above.

We use Claude Code and a handful of custom agents as engineering
multipliers, which is how a two-person studio ships at the speed we do.
AI isn't the product. It's the reason we can hit the timelines we quote.

We only take two projects a quarter. The next slot opens in Q3 2026.
If the estimator number fits, send us a note. If it doesn't, we'll
tell you who to call.

— Jake Ryall, founder
```

### 10 · Contact
```
Heading:  Let's make it real.
Subhead:  30-second form. We reply the same day.

Field 1:  Your name
Field 2:  Email
Field 3:  What are you trying to ship? (textarea, 3 rows)
Submit:   Send it →

Below form:  Prefer a call? Grab 30 min on our calendar → [Cal.com]
             Or just email — hello@executiveai.solutions
```

### 11 · Footer
- Giant wordmark watermark: `EAS` (replaces current `jake ryall.`)
- Bottom bar: `© 2026 Executive AI Solutions LLC` · `Built by Jake Ryall` · `Rocklin, California` · `hello@executiveai.solutions`

---

## 6. Motion Architecture

### 6.1 Philosophy
- **Motion reinforces "we ship."** Kinetic, industrial, useful — not decorative.
- **One recurring signature:** the B1 progress rule fills oxblood as each section passes viewport center. The site heartbeat.
- **Scroll-linked by default.** `useScrub` is the first reach, not `whileInView`.
- **No scroll-jacking.** Scroll maps 1:1.

### 6.2 Library split (strict)
| GSAP | Framer Motion |
|---|---|
| Scroll-linked (ScrollTrigger, scrub) | Hover / tap / focus states |
| Character/line splits (SplitText) | `layout` / `layoutId` shared element |
| Sequenced timelines | `AnimatePresence` mount/unmount |
| Pinned sections (only Hero) | Form state, inputs, CTAs |
| Number tweens | `whileInView` for simple reveals |

**Never drive the same property with both libraries on the same element.**

### 6.3 Motion primitives library

Create `lib/motion/primitives.ts`. Every section component imports from here. Sections cannot ship with ad-hoc motion — they must use a primitive or compose primitives.

```ts
useReveal(ref, opts)      // Stagger + y + opacity, scroll-triggered
useScrub(ref, opts)       // Bidirectional scroll-linked progress 0→1
useFan(refs, opts)        // Rotation + translate + z origin spread
useSettle(ref, opts)      // Overshoot micro-bounce after state change
useMorph(fromRef, toRef)  // Flip-style shared element transition
```

**Rule:** No section ships with only `opacity: 0 → 1`. Minimum composition is y + opacity + one more property.

### 6.4 Custom easings

Create `lib/motion/eases.ts`. Hand-tuned CustomEase curves per major moment:
- `heroFan` — front-loads shrink, back-loads spread
- `processRule` — accelerates past terminal with micro-overshoot
- `estimatorCounter` — linear middle, snap finish for slot-machine feel
- `actionTagShuffle` — abrupt start, soft end for character morph
- `sectionDeliver` — slow start, fast finish, then soft settle for section-status transition

Each ease has an inline test case (documented in the file) showing the timing curve.

### 6.5 Per-section choreography

| Section | Primary motion | Key detail |
|---|---|---|
| **01 Hero** | GSAP pinned timeline + SplitText headline | Add 3D `rotationY` + `z` to fan cards. Dynamic shadow responds to rotation. Variable weight breath on headline (880↔900, 3s). |
| **02 Marquee** | Linear infinite + velocity skew | Skew ±2° driven by `ScrollTrigger.getVelocity()`. Pause-on-hover on individual quotes. |
| **03 Work** | `useReveal` + cursor-tilt + scrub progress rule | Image-develop treatment on hover: scale + contrast + saturation + grain, composited. |
| **04 Live CRM** | Framer `layout` + typewriter row reveal | Rows deal in from a stacked state (inverse fan). Keyboard nav ↑↓ uses `layoutId` highlight slide. Enter opens a detail panel via AnimatePresence. LIVE dot pulses 2s loop. |
| **05 Mission** | `useScrub` reveal + oxblood-period settle | Each belief reveals in sync with scroll. The period punches in 200ms late with `useSettle` micro-overshoot. |
| **06 Services** | `useReveal` + `useFan` on stack pills | On hover, tech stack pills fan up from stacked state with stagger. Duration counter animates `0→6` on entry. |
| **07 Process** | `useScrub` for vertical rule + counter tween | Oxblood rule draws top-to-bottom 1:1 scroll-linked. Step numbers count 00→01→02 as they enter viewport. |
| **08 Estimator** | `useMorph` for pill + slot-machine counter | Active pill background slides via `layoutId`. Price digits roll independently (ones first, then tens, then hundreds) on scope change. Dollar sign sways during roll. |
| **09 About** | `useReveal` paragraphs + weight-axis on wordmark | `EAS` wordmark shares the hero's weight-axis flourish on hover. |
| **10 Contact** | `useReveal` fields + oxblood underline focus | Focus: `gsap.quickTo` grows oxblood underline left-to-right. Submit: button morphs to "Sent." via `useMorph` + layoutId. |
| **11 Footer** | Existing hover states | Wordmark watermark keeps existing treatment. |

### 6.6 Craft pass (first-class requirements, not nice-to-haves)

Ten micro-details that must ship. Each has acceptance criteria.

1. **Custom easing per moment** — 5 CustomEase curves hand-tuned (see 6.4). Acceptance: each has a documented curve, each is used by the moment it was designed for, `expoOut` is *never* used where a custom ease was specified.

2. **Hero fan 3D with shadow response** — fan cards have `rotationY`, `z`, and a dynamic box-shadow that grows softer/larger as cards rotate further from viewer. Acceptance: at 0° the shadow is 8px blur, at 40° rotation the shadow is 32px blur with 20% more opacity. Shadow recomputes per-frame during fan animation.

3. **Hero headline weight breath** — during hero scroll (before user scrolls past), the display headline oscillates weight `880 ↔ 900 ↔ 880` on a 3s loop. Killed by `prefers-reduced-motion`. Acceptance: oscillation is imperceptible at a glance but measurable in DevTools; matchMedia disables it cleanly.

4. **Oxblood rule ink-bleed edge** — progress rule fill has a feathered gradient on the advancing edge (~12px feather via `mask-image`), not a hard line. Acceptance: screenshot comparison shows visible feather, rule still reads as oxblood and complete at 100%.

5. **Action Tag character-morph** — when cursor moves between elements with different verbs, the tag label cycles each character through 2–3 random chars over 180ms before landing on the new verb. Acceptance: shuffling duration 180ms ± 10ms, no overlap between consecutive morphs, no placeholder ? or empty state visible.

6. **Estimator slot-machine counter** — price digits roll independently with stagger: ones first, tens 80ms later, hundreds 80ms after that. Dollar sign sways ±2px horizontally during the roll. Acceptance: total roll duration 800ms ± 50ms, no digit jumps more than one step per frame.

7. **Page-load title sequence** — on first load of `/`, the page assembles in this order: SKU tag → mono ticker → navbar → hero headline (SplitText) → video card (mask-image develop) → scroll hint pulse. Total ~2s. Acceptance: Lighthouse LCP within budget (< 2.5s), no visible FOUC, sequence plays once per session (cached flag).

8. **Section-pass meta-narrative** — section's B1 tag transitions `IN TRANSIT` → `DELIVERED` as user scrolls past. Acceptance: transition fires when section's bottom edge exits viewport top. Delivered status uses check mark + taupe, not oxblood. Reversible on scroll-back within 500ms.

9. **Work card image develop** — on hover: scale (1.0 → 1.06, 1.2s), contrast +8%, saturation +6%, grain opacity 3.5% → 5%, composite ease. Acceptance: timing unified; all 4 properties start/end simultaneously; removing any one property visibly breaks the effect.

10. **Scroll-velocity micro-blur** — display-weight text has `filter: blur()` driven by `ScrollTrigger.getVelocity()` via `gsap.quickTo`. Fast scroll → up to 1.2px blur. Still → 0px. Acceptance: blur never exceeds 1.2px; restores to 0 within 100ms of scroll stop.

### 6.7 Global motion systems
- **ScrollProgress top bar** — keep [components/ui/ScrollProgress.tsx](components/ui/ScrollProgress.tsx), swap gradient to `oxblood → ink`.
- **Section reveal hook** — `useSectionReveal(ref)` in `lib/hooks/useSectionReveal.ts`. Wraps B1 header reveal + progress rule fill + content stagger. Every section uses this one implementation.
- **Page transitions** — replace [components/PageTransition.tsx](components/PageTransition.tsx) logo-morph with native **View Transitions API** (`document.startViewTransition`). Graceful degradation on unsupported browsers (simple fade).
- **Reduced motion** — all primitives check `gsap.matchMedia({ reduceMotion })`. Framer Motion uses `MotionConfig reducedMotion="user"` at the root. No per-section boilerplate.

---

## 7. Interactive Moments

### 7.1 Signature B: Estimator

**Component:** `components/marketing/Estimator.tsx`
**API route:** `app/api/estimate/route.ts` (POST, captures lead)

**UI flow:**
1. **Step 1 — Project type** (4 pills, single-select):
   - Marketing site · Custom CRM · AI voice agent · Internal tool
2. **Step 2 — Scope** (3 pills, single-select):
   - Tight (4 wk) · Standard (6–8 wk) · Deep (10+ wk)
3. **Step 3 — Includes** (4 pills, multi-select):
   - Design · Engineering · Copy · SEO
4. **Result panel** (always visible, updates live):
   - Big oxblood price range: `$18k – $24k`
   - Duration: `· 7 weeks`
   - Small text: "Want a real number? Book a call →"

**Pricing logic** (in `lib/estimator.ts`):
```ts
const BASE = {
  'marketing-site': { min: 12, max: 18, weeks: 5 },
  'custom-crm':     { min: 18, max: 32, weeks: 8 },
  'ai-voice':       { min: 15, max: 22, weeks: 5 },
  'internal-tool':  { min: 14, max: 26, weeks: 7 },
};
const SCOPE_MULT = { tight: 0.9, standard: 1.0, deep: 1.25 };
const ADDONS = { design: 0, engineering: 0, copy: 2, seo: 4 };
// Result: base * scope_mult + sum(selected_addons). Always show a range
// that is ±15% of the midpoint to preserve honesty about variance.
```

**On result click (Book a call):** POST to `/api/estimate` with the selection + timestamp + user agent, then redirect to Cal.com booking URL. The POST is non-blocking — redirect fires immediately, capture is fire-and-forget for analytics.

**Motion:**
- Pill selection uses Framer `layoutId="estimator-active"` — oxblood background slides between pills.
- Price digits roll independently (slot-machine, §6.6.6).
- Step progress indicator dots (3 dots below form) fill oxblood as user advances.
- Form appears on scroll with field stagger (y: 20, 0.08s stagger).

### 7.2 Signature C: Live CRM Embed

**Component:** `components/marketing/LiveCRM.tsx`
**Data:** `lib/mock-crm.ts` — 8–12 realistic leads with timestamps, statuses, categories. Names are placeholder-realistic (`Adventure Air — gyro cert`, `Wings N Wheels — detail pkg`), not Lorem Ipsum.

**UI:** A contained panel styled as a CRM inbox. Three tabs: Hot · Warm · Cold. Each row: timestamp, lead name, status chip. Keyboard focusable. ↑↓ moves selection. Enter opens a detail panel via AnimatePresence + layoutId morph.

**Faux-realtime:** Timestamps tick every 15s using `setInterval` (cleared on unmount). "LIVE" status dot pulses on a 2s loop (subtle scale + opacity).

**Accessibility:** All keyboard nav works. Focus ring visible. Respects reduced motion (dot doesn't pulse, no row-deal animation — rows just fade in).

**Out of scope:** No real backend. The component doesn't persist state. On page refresh, it resets.

---

## 8. Cursor — Action Tag

**Component:** rename [components/CustomCursor.tsx](components/CustomCursor.tsx) → `components/ui/ActionTag.tsx`. Refactor to:
- Remove the always-on outer ring
- Keep only the contextual behavior
- Native cursor stays visible everywhere

**Verb dictionary (6 verbs total):**

| Element | Selector/prop | Tag |
|---|---|---|
| Work card | `[data-card]` | `→ VIEW` |
| Service card | `[data-service]` | `→ OPEN` |
| Process step | `[data-step]` | `→ EXPAND` |
| Estimator pill | `[data-pill]` | `→ SELECT` |
| CTA button | `[data-cta]` | `→ BOOK` |
| Email link | `a[href^="mailto:"]` | `→ COPY` |
| External link | `a[target="_blank"]` | `↗ OPEN` |

**Visual:**
- Mini B1 tracking-tag style: oxblood lead block (tag icon or first char) + cream body (verb)
- Geist Mono, 10px, uppercase, `0.18em` tracking
- `mix-blend-mode: difference` for legibility over photos

**Motion:**
- Spring-smoothed follow (stiffness 300, damping 25)
- Fade in 180ms on hover-enter, fade out 120ms on hover-leave
- Character-morph between verbs (§6.6.5)

**Rules:**
- Desktop only (≥1024px). Hidden below.
- Respects `prefers-reduced-motion` → hides entirely.

---

## 9. What Gets Removed

| File | Reason |
|---|---|
| [components/SmoothScroll.tsx](components/SmoothScroll.tsx) | Lenis is aging; native scroll preferred |
| [components/marketing/Promise.tsx](components/marketing/Promise.tsx) | Pinned 320vh belief reveal — dated pattern. Copy migrates to Mission section. |
| [components/marketing/Capabilities.tsx](components/marketing/Capabilities.tsx) | Replaced by Services.tsx with outcome-framed copy |
| [components/marketing/Availability.tsx](components/marketing/Availability.tsx) | Replaced by Contact.tsx with real form |
| [components/marketing/ProofStrip.tsx](components/marketing/ProofStrip.tsx) | Replaced by Testimonial Marquee (02) |
| [components/marketing/seams/PaperToInkSeam.tsx](components/marketing/seams/PaperToInkSeam.tsx) | Dark ↔ light section rhythm removed |
| [components/marketing/seams/InkMarqueeSeam.tsx](components/marketing/seams/InkMarqueeSeam.tsx) | Replaced by Testimonial Marquee |
| [components/PageTransition.tsx](components/PageTransition.tsx) | Replaced by native View Transitions API |
| [components/PageLoader.tsx](components/PageLoader.tsx) | Replaced by page-load title sequence in Hero |
| `public/backups/*` | Already ignored; unchanged |

**Kept & refactored:**
- [Hero.tsx](components/Hero.tsx) — keep video→fan, add perspective depth, swap copy
- [FeaturedWork.tsx](components/marketing/FeaturedWork.tsx) — keep bento, add B1 header, add image-develop hover
- [Navbar.tsx](components/Navbar.tsx) — keep behavior, swap copy
- [Footer.tsx](components/Footer.tsx) — keep behavior, swap watermark to `EAS`
- [ScrollProgress.tsx](components/ui/ScrollProgress.tsx) — keep, swap gradient to oxblood→ink
- [MagneticButton.tsx](components/ui/MagneticButton.tsx) — keep, reuse on Estimator + Contact CTAs
- [CustomCursor.tsx](components/CustomCursor.tsx) — refactor to ActionTag (see §8)
- [Marquee.tsx](components/Marquee.tsx) — keep, reuse for testimonial marquee
- [lib/motion.ts](lib/motion.ts) — keep ease presets, expand with primitives + custom eases

---

## 10. Machine Experience (MX) Layer

### 10.1 `public/llms.txt`
Plain-text description of EAS, ~150–200 words. Format:
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
Calendar: cal.com/eas (30-min intro)
Site: https://executiveaisolutions.com
```

### 10.2 JSON-LD
In [app/layout.tsx](app/layout.tsx), inline `<script type="application/ld+json">` with:
- `Organization` schema (name, url, logo, founder, areaServed)
- `Service` schema × 3 (one per offering — site, CRM, voice)
- `LocalBusiness` schema (geo, address)

### 10.3 Metadata rewrite
```
title:       Executive AI Solutions — We ship software, not slides.
description: A two-person studio building custom CRMs, AI voice
             receptionists, and marketing sites for small operators.
             Weekly ship cadence. Fixed-price proposals. Available Q3 2026.
og:title:    Executive AI Solutions — Ship, don't slide.
og:description: (same as above)
```

---

## 11. Component Tree (final)

```
components/
├── Hero.tsx                          [edit: copy + add perspective depth to fan]
├── Navbar.tsx                        [edit: copy only]
├── Footer.tsx                        [edit: watermark → EAS]
├── Marquee.tsx                       [keep — reused by TestimonialMarquee]
├── ShineButton.tsx                   [keep — reused by CTAs]
├── marketing/
│   ├── FeaturedWork.tsx              [edit: B1 header + image develop]
│   ├── TestimonialMarquee.tsx        [new — 02]
│   ├── LiveCRM.tsx                   [new — 04, signature C]
│   ├── Mission.tsx                   [new — 05, replaces Promise]
│   ├── Services.tsx                  [new — 06, replaces Capabilities]
│   ├── Process.tsx                   [new — 07]
│   ├── Estimator.tsx                 [new — 08, signature B]
│   ├── About.tsx                     [new — 09]
│   ├── Contact.tsx                   [new — 10, replaces Availability]
│   └── [REMOVED] Promise, Capabilities, Availability, ProofStrip, seams/
├── ui/
│   ├── SectionHeader.tsx             [new — B1 tracking-tag motif, reused]
│   ├── ActionTag.tsx                 [new — refactored from CustomCursor.tsx]
│   ├── ScrollProgress.tsx            [edit: oxblood gradient]
│   ├── MagneticButton.tsx            [keep]
│   └── HoverText.tsx                 [keep]
└── [REMOVED] CustomCursor.tsx, SmoothScroll.tsx, PageTransition.tsx, PageLoader.tsx

lib/
├── motion.ts                         [expanded — custom eases + primitives exports]
├── motion/
│   ├── primitives.ts                 [new — useReveal, useScrub, useFan, useSettle, useMorph]
│   └── eases.ts                      [new — 5 custom CustomEase curves]
├── hooks/
│   └── useSectionReveal.ts           [new — B1 header + progress rule unified]
├── estimator.ts                      [new — pricing logic]
├── mock-crm.ts                       [new — LiveCRM demo data]
└── data.ts                           [edit: project data preserved]

app/
├── layout.tsx                        [edit: Geist fonts, JSON-LD, metadata, MotionConfig]
├── globals.css                       [edit: oxblood palette tokens, remove Inter, remove dark tokens]
├── page.tsx                          [edit: new section composition in order]
└── api/
    └── estimate/
        └── route.ts                  [new — POST capture for estimator]

public/
└── llms.txt                          [new]
```

---

## 12. Acceptance Criteria (per section, summary)

Every section must satisfy ALL of:
- [ ] Section uses `SectionHeader` component (B1 tracking-tag motif)
- [ ] Section title follows type scale (`clamp(2.4rem, 5.5vw, 5rem)`, `-0.04em`)
- [ ] Progress rule fills oxblood scrub-linked as section passes viewport
- [ ] Minimum 2 motion primitives used from `lib/motion/primitives.ts`
- [ ] Minimum 3-property composition on every transition (never opacity-only)
- [ ] `prefers-reduced-motion` respected
- [ ] Section-pass status transition `IN TRANSIT` → `DELIVERED` fires on exit

Per-section additionals documented in each component's header comment.

---

## 13. Out of Scope (tracked as follow-up)

- Dedicated `/work/[slug]` case study pages (will need separate spec)
- `/now` or `/changelog` page
- `/experiments` playground
- `⌘K` command palette
- Dark mode toggle
- Internationalization
- A/B testing framework for Estimator variants
- CMS-backed copy
- `/work` index page restyle (currently linked in nav; keep current behavior for this spec)

---

## 14. Assumptions

- The current repo structure under `components/` and `app/` is the source of truth.
- The `redesign/hero-v2` branch is where this work lands.
- Geist + Geist Mono are loaded via `next/font/google` (free, no license concerns).
- The Cal.com URL and contact email are owned by the user and will be provided at implementation time — placeholders in spec.
- All three testimonials in §5.02 are written as placeholders; the user will confirm or replace with real client quotes before launch.
- Pricing figures in Estimator and Services (§5.06, §7.1) are starting points the user will tune based on real project history.
- The Live CRM (§7.2) demo data is fictional but realistic; the user will confirm no real client data is exposed.

---

## 15. Open Questions for the User

None blocking. Items flagged in §14 can be resolved at implementation time, not now.

---

**End of spec.**
