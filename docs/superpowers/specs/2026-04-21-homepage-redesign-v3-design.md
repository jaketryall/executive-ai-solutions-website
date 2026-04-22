# Homepage Redesign v3 — Modern Conversion-First

**Date:** 2026-04-21
**Branch:** redesign/hero-v2 (continuing)
**Author:** Jake + Claude (brainstorm)

---

## 1. Goal

Redesign the homepage sections **after** the Hero/Fan to support a dual audience:

- **Hiring managers** evaluating craft, taste, and motion sophistication.
- **Clients (SMB owners)** evaluating "will this person solve my problem and convert my visitors."

Both audiences need to scan in <30 seconds AND have somewhere to go deeper. The current sections (Testimonials with pinned horizontal scroll, ScrollMarquee with cinematic phrases, Manifesto, Contact) over-rotate on motion craft at the expense of clarity, conversion, and identity.

## 2. Aesthetic Direction

**Reference points:** itsjay.us, lokasasmita.com/work, Apple product pages, Framer feature pages.

**In:**
- Modular grids, contained widths, refined cards (rounded-2xl, subtle border, soft shadow)
- Apple-grade motion restraint — every animation has a purpose
- Rich micro-interactions on every interactive element (buttons, tags, cards, links)
- Existing color palette (warm cream `#e5e1db` ish + dark sections + taupe `#78736c` accent + dark text `#1a1816`)
- Existing Inter typography
- Section-level rhythm via alternating cream / dark cream backgrounds (no grain)

**Out:**
- Editorial/magazine aesthetic, drop caps everywhere, full-bleed typographic spreads
- Grain textures (anywhere)
- Scroll-jacking / pinned horizontal scroll for content sections
- Glitch / scramble / hacker-style effects
- Hand-drawn / sketch aesthetics (except the one Manifesto signature)
- Decorative motion that doesn't earn its space

## 3. Section Order Change

**Before:** Hero (with fan on desktop) → Work (mobile-only drift grid) → Testimonials → ScrollMarquee → Manifesto → Contact → Footer

**After:** Hero (with fan on desktop) → Work (mobile-only drift grid) → **Capabilities** → **Manifesto** → **Proof** → **Contact** → **Footer**

Note: the desktop "fan" lives inside Hero — it's the existing video-shrinks-into-card-fan morph. The standalone `Work.tsx` component only renders on mobile (`md:hidden`). Both stay untouched.

Rationale: visitor lands → sees work (the fan inside Hero) → learns what services Jake offers (Capabilities) → who Jake is + how he thinks (Manifesto mantra + About) → proof he delivers (Testimonials) → CTA (Contact). Conversion-funnel rhythm.

## 4. Standard Micro-interaction Library

These interactions are reused across all redesigned sections. Defined once, referenced everywhere.

| Component | Hover/state behavior |
|---|---|
| **Primary button** | StaggerButton pattern — letters slide out upward, replacement letters slide in from below in stagger (`Hero.tsx:58-114`). Already exists. |
| **Secondary button** | Ghost button with directional fill — taupe wash sweeps in left-to-right behind text |
| **Card** | +2px translateY lift, border brightens (`rgba(26,24,22,0.08)` → `0.18`), shadow expands (`0 8px 24px rgba(0,0,0,0.06)` → `0 16px 40px rgba(0,0,0,0.10)`), 400ms `cubic-bezier(0.22,1,0.36,1)` |
| **Tag/pill** | Background fills from transparent to `rgba(120,115,108,0.12)`, 1px lift, micro-tooltip on hover after 300ms delay |
| **Inline link** | Underline draws in via DrawSVG (1px stroke, 200ms left-to-right), arrow `→` slides 4px right and fades from 0.5 to 1.0 opacity |
| **Counter (number)** | GSAP number tween on first scroll-in, easing `power2.out`, duration 1.2s, snap to integer |
| **Image** | Container has `overflow: hidden`; image scales to 1.04 over 600ms on hover with `cubic-bezier(0.22,1,0.36,1)` |
| **Section title** | One-time SplitText word-mask reveal (`type: "words"`, `mask: "words"`) on first viewport entry — yPercent 110 → 0 staggered |
| **Status pill** (`● Available`) | Dot pulses on idle (2s cycle), full pill brightens on hover |

All interactions respect `prefers-reduced-motion: reduce` — collapse to instant or fade-only via `gsap.matchMedia()`.

## 5. Hero Polish (additive — fan + video stay untouched)

### 5.1 Identity kicker (NEW)
Small uppercase line above the headline:
```
JAKE RYALL · DESIGN + DEV · AVAILABLE Q3 2026
```
Tracking 0.28em, font-size 0.65rem, color `rgba(26,24,22,0.5)`. Fades in 200ms before headline starts typing.

### 5.2 Headline copy + strikethrough mechanic (REPLACES existing glitch)

**New copy:**
> I build ~~beautiful~~ → **converting** websites.

**Mechanic — clean modern strikethrough:**
1. Type "I build beautiful websites." at current 35ms/char rate (cursor visible)
2. 400ms beat
3. A thin 1.5px line **draws across "beautiful"** left-to-right via DrawSVG (~350ms, `power2.inOut`)
4. Simultaneously with the strikethrough completion, "beautiful" **fades to 30% opacity**
5. The word "converting" **rises into place** (replacing "beautiful" or appearing before it) via SplitText word-mask: `yPercent: 110 → 0`, ~500ms, staggered chars at 20ms each
6. The struck-through "beautiful" stays visible at 30% opacity for ~600ms then fades to 0 and unmounts; "converting" remains in `#1a1816`
7. Cursor disappears after final word lands

**Final visible state:** `I build converting websites.` (no strikethrough remnant — clean).

`sessionStorage` skip-on-return-visit logic from current implementation is kept (`hero-seen` key).

### 5.3 Subhead + CTA + rating consolidation

**Currently:** subline + CTA button + 5.0 stars + "Read the reviews" + arrow — too many small elements.

**After:**
- Subline: `I'm Jake. I design websites that earn their keep.` (replaces the "turn visitors into customers" line)
- One primary CTA: **`Start a Project`** using StaggerButton pattern (currently it's a static button with arrow)
- One secondary CTA below or beside: **`See my work →`** ghost button linking to `/work`
- Rating row deleted from Hero — moves into Proof section as part of testimonial cards
- "Currently shipping" card stays (loved)

### 5.4 What does NOT change in Hero

- Video sticky element + its 130vh shrink/morph
- Fan card hover/spread interaction
- "Currently shipping" card (cycle, dots, hover pause)
- Client logos marquee
- Splash menu / nav

---

## 6. Section A — Capabilities (replaces ScrollMarquee)

### 6.1 Purpose
Tell both audiences exactly what Jake offers as a service. Three services = three offerings clients can hire him for. Each card shows the service, an interactive demo of what it produces, and the actual stack used.

### 6.2 Layout — Bento grid

Three cards on a contained width (max 1280px), gap 16px:
- **Top row:** two cards, 2:1 width ratio
  - Wider left card: `01 / CONVERSION WEBSITES`
  - Narrower right card: `02 / AI AUTOMATIONS`
- **Bottom row:** one full-width card: `03 / CUSTOM SOFTWARE`

All cards: cream background tint over the section bg, 1px border, rounded-2xl, padding 32px desktop / 20px mobile.

### 6.3 Card content

**Card 01 — Conversion Websites**
- Header: small `01 — CONVERSION WEBSITES` chapter mark
- Title: `Every scroll earns its place.` (existing copy from current Manifesto)
- Body: `Sites built with conversion architecture from the first wireframe. Every section has to defend its spot — or it gets cut.` (existing)
- **Visual:** mini wireframe → hi-fi mockup morph. SVG-based abstract layout: a few rectangles representing wireframe blocks reposition + recolor + add detail into a polished mockup using GSAP Flip. Auto-loops on a 4s pause cycle when in viewport; on hover, restarts immediately.
- Tag pills: `Next.js` · `Sanity CMS` · `Tailwind` · `Analytics`
- Footer line: `Wireframe → design → launch in 4 weeks.`

**Card 02 — AI Automations**
- Header: `02 — AI AUTOMATIONS`
- Title: `Back-office that runs on its own.` (existing)
- Body: `Inbox triage, lead routing, content pipelines. Workflows that do the 10 small things you keep forgetting.` (existing)
- **Visual:** small workflow node diagram — 3-4 connected nodes (Inbox → Classifier → Slack/CRM) with a small data packet animating along the connection paths via MotionPath. Subtle, always-on loop.
- Tag pills: `n8n` · `OpenAI` · `Slack` · `Webhooks`
- Footer line: `Replaces ~8 hrs/week of admin.`

**Card 03 — Custom Software**
- Header: `03 — CUSTOM SOFTWARE`
- Title: `One system instead of twelve tabs.` (existing)
- Body: `Internal tools and dashboards shaped to your operation. One login, one schema, one place your team actually looks.` (existing)
- **Visual:** abstract dashboard preview — a wide card showing a mini chart that draws via DrawSVG + a few KPI tiles where numbers tween in via GSAP counters on viewport entry. One small Lighthouse-style score ring on the right showing performance (e.g., 98) — DrawSVG fill on the ring stroke. Triggers once on entry, re-triggers on hover.
- Tag pills: `Next.js` · `Supabase` · `Role-based auth` · `Owned by you`
- Footer line: `Purpose-built, not SaaS-bent.`

### 6.4 Animations
- Card titles use the standard SplitText word-mask reveal on viewport entry
- Each card stagger-reveals (translateY 24px → 0, opacity 0 → 1, 100ms stagger)
- Visuals trigger their micro-animations on viewport entry (and re-trigger on hover for cards with looping demos)

### 6.5 Tag pill micro-interaction
On hover, pill fills with taupe at 12% opacity, lifts 1px, and a small tooltip appears after 300ms showing one-line context (e.g., hovering `n8n` shows "Custom workflow automation for clients"). Uses Framer Motion `AnimatePresence` for tooltip fade.

### 6.6 Background
Cream (`#e5e1db` or whatever the current cream variable is). No texture, no grain, no gradient.

---

## 7. Section B — Manifesto (mantra + identity, no service duplication)

### 7.1 Purpose
Deliver the personal positioning statement (mantra) + introduce Jake as a person via an About card. This section is no longer a services section (services live in Capabilities now). Editorial touches earn their space here because this section IS about identity and voice.

### 7.2 Layout
Contained width (max 1100px), centered.

**Header block:**
- Kicker: `THE MANIFESTO` (or `HOW I THINK`)
- Mantra (replaces the old "I don't just build websites. I build unfair advantages."):
  - Lead line: `I don't ship pretty.`
  - Punch line: `I ship results.`
- Both lines are large display type. Lead line slightly smaller / lighter weight; punch line larger / black weight. Each line reveals via SplitText word-mask on viewport entry, lead first then punch with a 200ms gap.

**Sub-paragraph (2-3 sentences) below the mantra** — explains what that means in practice. This is where the **drop cap** lives:
- Drop cap on the first letter of this paragraph: `float: left`, `font-size: 3.5em`, `line-height: 0.85`, `padding-right: 0.1em`, color `#78736c`, weight 900. The drop cap is the editorial accent that earns its space by anchoring the prose moment of the page.
- Body color: `#1a1816` at 70% opacity for the prose, full opacity for the drop cap.

**Signature SVG (below the sub-paragraph):**
- A hand-styled "—Jake" signature as an inline SVG path
- Animates on viewport entry via DrawSVG: `drawSVG: 0 → 100%`, duration 1.2s, ease `power2.inOut`
- Stroke 1.5px, color `#1a1816`
- Aligned right, ~140px wide
- Path data lives in a small `signature.svg` file or inline constant in the component

### 7.3 About Jake card (below signature)
A clean horizontal card:
- Left: square avatar/symbol mark (~96px) — could be the `JR` mark or Jake's monogram
- Middle: name `Jake Ryall`, role `Designer & Developer`, location `● Phoenix, AZ`
- Right: status pill `● Available Q3 2026` (dot pulses every 2s) + 2 small social pills (LinkedIn, GitHub)

Card has the standard hover interaction. Status dot uses the standard status-pill micro.

### 7.4 Background
Section sits on dark cream / darker section to provide visual punctuation between Capabilities (cream) and Proof (cream again).

---

## 8. Section C — Proof (replaces pinned horizontal Testimonials)

### 8.1 Purpose
Social proof — quantitative (metrics) + qualitative (quotes) — without scroll-jacking.

### 8.2 Layout
**Kill the horizontal pin entirely.** Standard vertical scroll. 3-card row that stacks to single column on mobile.

Section header:
- Kicker: `PROOF`
- Headline: `What clients say after launch.` (SplitText reveal)
- Sub: small line `Average rating 5.0 across 12 launches.` ← this absorbs the rating row removed from Hero

Three testimonial cards, gap 24px:
- Equal width (or featured middle card slightly taller)
- Each card content:
  - **Top:** large metric numeral (e.g. `+40%` or `2×`) — counts up via GSAP on viewport entry, font-size 4.5rem, weight 900, color `#1a1816`
  - **Below numeral:** small label e.g. `Discovery flights` (color `#78736c`)
  - **Quote:** body text, 0.95rem, leading 1.55, max 4 lines
  - **Attribution row:** small avatar + name + role + company + year
  - **Footer:** `View case study →` inline link with the standard underline-draw + arrow-slide micro

### 8.3 Card hover micro-interaction
- Standard card lift + border brighten + shadow expand
- Metric numeral does a subtle re-tick: shifts +1px down then back over 200ms (gives the number a "noticed you" feel)
- `View case study` arrow slides right per standard inline-link pattern

### 8.4 Background
Cream. Cards have subtle white tint to lift off the cream background (e.g. `rgba(255,255,255,0.4)` over cream).

---

## 9. Section D — Contact (dual-CTA reframe)

### 9.1 Purpose
Two clear paths: (1) clients ready to start a project, (2) hiring managers wanting resume/DM. Capture lead with a low-friction form. Show real availability so the page feels alive.

### 9.2 Layout
Two-column on desktop, stacks on mobile. Contained width (max 1200px).

**Left column:**
- Headline (large but contained, NOT poster-sized): `Let's build something.` — SplitText reveal
- Paragraph: `Tell me about your project — I'll respond within a day.`
- Two CTAs stacked or side-by-side:
  - Primary StaggerButton: `Start a Project` → opens form focus / scroll
  - Secondary ghost button: `Resume + DM →` → opens email + links to PDF resume
- Below CTAs: small dual rationale line — `For founders building. For teams hiring.`

**Right column — availability + form card:**
A single card containing:
- **Top strip:** availability widget — `● Next opening:` + date pill `JULY 14` (date sourced from a config or static for now). Below: three small chip buttons for next 3 dates (`Jul 14` · `Jul 21` · `Jul 28`) — clicking pre-fills the form's "preferred start" field.
- **Form fields:**
  - `Your name`
  - `Email`
  - `Project type` — radio chips: `Website` · `Brand` · `Automation` · `Other`
  - `What are you building?` — single line, max 240 chars
- **Submit button:** StaggerButton `Send →` with loading-to-checkmark micro-interaction on submit (button morphs to a small spinner, then to a check, then collapses to "Got it ✓")

### 9.3 Background
Dark section (deep `#0a0908` per existing dark token) to bookend the page before the footer. Cards on dark = cream-tinted with subtle border.

---

## 10. Section E — Footer (modern sign-off)

### 10.1 Purpose
Clean modern close. No editorial sign-off, no massive logotype.

### 10.2 Layout
- **Top row:** 3-col grid
  - Col 1: `JR` mark + small wordmark "Jake Ryall"
  - Col 2: Sitemap (Home / Work / About / Services / Contact) — each link uses standard inline-link micro
  - Col 3: Socials (LinkedIn / GitHub / Dribbble / Instagram / Email) — same micro
- **Subtle marquee strip** (1 line):
  - `JAKE RYALL · AVAILABLE Q3 2026 · PHOENIX, AZ ·` repeating
  - Slow constant scroll (NOT scroll-velocity-driven), 60s loop, font-size 0.75rem, color `rgba(229,225,219,0.4)` on dark
- **Humanizing row:** `Last shipped: [date] · Currently building: [project]` — pulled from a small JSON config so Jake can update without code changes
- **Copyright:** `© 2026 Jake Ryall · Built in Next.js`

### 10.3 Easter egg
Hovering the JR mark fills it with the taupe color via SVG fill animation (already similar to current HeroLogo behavior).

### 10.4 Background
Continues the dark of the Contact section. No hard divider — Contact bleeds into Footer.

---

## 11. Mobile considerations

Each section's layout collapses cleanly:
- **Capabilities:** Bento grid → single column stack. Card 03 visuals adapt (Lighthouse ring shrinks, metrics stack vertically below)
- **Manifesto:** 2x2 principle grid → single column. Drop cap stays. Signature SVG centers and shrinks.
- **Proof:** 3-card row → vertical scroll-snap carousel (snaps card-to-card horizontally) OR stacked single column — pick whichever scans faster on phones. Default: stacked.
- **Contact:** Two columns stack — form card moves below the headline+CTA block.
- **Footer:** 3-col grid → vertical stack with bigger touch targets.

All micro-interactions that depend on hover (cards, tags, links) have **on-tap equivalents** for touch devices: tap reveals tooltip, tap triggers card lift visual, etc.

## 12. Accessibility

- All interactive elements have visible focus states (2px outline in `#1a1816` or `#e5e1db` depending on background)
- All animations respect `prefers-reduced-motion: reduce` via `gsap.matchMedia()` — collapses motion-heavy reveals to opacity-only
- Color contrast meets WCAG AA on all body copy (verify cream/taupe pairings)
- Form inputs have proper `<label>` associations and live error feedback
- Semantic landmarks: `<section>` for each major section, `<footer>`, `<nav>` in footer

## 13. Performance

- Each section is dynamic-imported (matches current pattern in `app/page.tsx`)
- GSAP plugins lazy-loaded per section that needs them (DrawSVG only for Hero strikethrough + Manifesto signature; Flip only for Capabilities Card 01; SplitText global)
- All SVG demos in Capabilities cards inline (no external requests)
- Avatars in Proof cards: Next/Image with priority on first card only
- Marquee in Footer uses CSS `@keyframes` (not GSAP) — cheaper

## 14. Out of Scope (explicit)

- Hero video element + 130vh sticky behavior (untouched)
- Fan card hover/spread (untouched)
- "Currently shipping" card in Hero (untouched)
- Client logos marquee in Hero (untouched)
- Splash menu / nav (untouched)
- Mobile Work component (mobile 2-row drift grid) — keep as-is for now
- Page transitions (untouched)
- Scroll background system (untouched)
- Custom cursor (untouched)
- Any `/work/[slug]` detail pages (untouched)

## 15. Files Affected

**Replaced/rewritten:**
- `components/homepage/Manifesto.tsx` → rewritten as mantra + drop cap paragraph + signature + About card (no service cards)
- `components/homepage/Testimonials.tsx` → rewritten as Proof section (no horizontal pin)
- `components/Contact.tsx` → rewritten (desktop variant — mobile keeps current MobileContact pattern, lightly polished)
- `components/Footer.tsx` → rewritten

**New:**
- `components/homepage/Capabilities.tsx` — new file (3-card bento with services + interactive demos)
- `lib/microInteractions.ts` — shared helpers (counter tween, card hover Framer variants, button stagger letter helper if needed)
- Possibly `public/signature.svg` (or inline path constant)

**Deleted:**
- `components/homepage/ScrollMarquee.tsx` (replaced by Capabilities)

**Modified (additive only — leave loved parts untouched):**
- `components/Hero.tsx` → identity kicker added + replace `HeroCorrectionText` glitch component with new strikethrough mechanic + new headline copy + subline rewrite + CTA consolidation. Right column (video + sticky shrink + currently-shipping card + fan) is NOT touched.
- `app/page.tsx` → reorder dynamic imports + render order per §3

## 16. Implementation Risks

- **Strikethrough mechanic** — DrawSVG line synced precisely with text rise is fiddly. Allow extra time to nail timing.
- **Capabilities Card 03 Lighthouse ring** — needs a clean SVG ring + DrawSVG + counter sync. Could fall back to a static SVG with counter only if ring proves problematic.
- **Card 01 wireframe → mockup morph** — Flip is well-suited but requires careful state design. Worst case, fall back to a video loop.
- **Availability widget** — date logic should be centralized (single source of truth in a config file) to avoid drift between sections.
- **Cards on dark in Contact section** — need to verify cream-tinted cards don't muddy. May need explicit white tint instead.

## 17. Success Criteria

- All 5 redesigned sections render cleanly on mobile + desktop
- All standard micro-interactions feel snappy and intentional (no jank, 60fps target)
- `prefers-reduced-motion` users get a usable, motion-light experience
- Page Lighthouse score: Performance ≥ 90, Accessibility ≥ 95
- Visual hierarchy lets a 5-second scan answer: WHO is Jake / WHAT does he do / DOES he have proof / HOW do I contact
- No scroll-jacking anywhere except the Hero's existing video-shrink behavior
