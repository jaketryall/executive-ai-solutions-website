# THE HYBRID REBUILD — SearchKings × Apple, EAS craft
*Written 2026-07-16, the reset plan. Jake: "we need to start from zero…
the searchkings apple hybrid." This file is the ground truth for the
rebuild; read it FIRST in any session touching site architecture.*

## 0 · Why this plan exists

Jake landed on searchkings.com and knew instantly: "if i was looking for
ads i would go with them." That reaction is the target. The site that
produces it is a hybrid we can now name precisely, because we measured
all three sources this session:

- **SearchKings** supplies the CONVERSION ARCHITECTURE: router homepage,
  services early, one job per section, proof distributed at every depth,
  de-risk chips instead of price theater, verb CTAs, realism in every
  visual. (Full teardowns: homepage, 2 service pages, the ChatGPT page —
  in session history and summarized below.)
- **Apple** supplies the PRESENTATION DISCIPLINE: ground = the argument
  (2–4 flips per page, dark spent only on what glows), whisper-gray
  bands (#f5f5f7 logic), the type ladder, sentence case, one focal per
  viewport, bimodal motion timing.
- **EAS (us)** supplies what neither has: LIVE surfaces (demos that
  perform the service), the free tools (audit, estimator, calculator,
  chat), transparent pricing, and hand-built motion. These are the
  moats; the rebuild must never trade them away.

"Reset" means ZERO-BASED sections: nothing keeps its slot by default —
every section re-earns it against this plan. It does NOT mean deleting
the codebase; most of what shipped 2026-07-16 (light-first tokens, card
grid, phone heroes, audit prime work) IS the hybrid's foundation.

## 1 · The laws (every page, every section)

1. **The homepage is a ROUTER.** Its job is to move the visitor to the
   page that answers THEM (a service page, the audit, /pricing) — not to
   contain everything. Hormozi routes with free stuff; SearchKings
   routes straight to services; Lesse did too. Depth lives on interior
   pages.
2. **Services come EARLY.** Multiple services = the visitor self-selects
   and clicks. The services router sits directly after the hero.
3. **One section, one job** (hook / route / give / prove / explain /
   de-risk / ask). Never two jobs in one section. If a section's job
   can't be named in one word, cut it.
4. **THE REALISM LAW** (Jake, verbatim intent): every demo shows the
   service's REAL surface, unmistakably itself — "if we are mocking
   google it should actually look like google." No generic chat UI, no
   approximate SERP. Skeleton continuation rows signal a live page.
   Real captures over illustrations. Outcome imagery, never tooling.
5. **Give before ask.** The free tools are the personality of the brand
   (seamless-north-star). Audit on the homepage, calculator on ads,
   builder on websites, live chat on ai, estimator on pricing.
6. **Price stays visible.** SearchKings hides it because a sales floor
   catches the phone call. We ARE the transparency brand — the visible
   number is our qualifier and differentiator. Their move we take
   instead: de-risk chips (No lock-in · Fixed quote in 2 days · You own
   everything) answering the objection's *shape* everywhere.
7. **Grounds per Apple:** warm near-white canvas (#f8f6f3), whisper
   band (#eeece7) only as furniture-shelving, dark spent ONCE where the
   content glows (the estimator chapter) + the steel closer. Dark cards
   float as accent objects on light.
8. **Type:** the existing ladder; claims at weight 800; sentence case
   ALWAYS (caps only in meta/eyebrow/chips); headings benefit-led;
   paragraphs 1–2 sentences, hard law (the SearchKings terseness).
9. **Motion:** keep and ration what we have — the Apple envelope
   (power3.out, 30–40px, 0.9–1.1s), play-once stories resting on WIN
   frames, live surfaces performing. Never decorative loops. Their dead
   site is the anti-reference here; our motion is a moat.
10. **Proof is distributed, not dumped:** something trustworthy near
    the open, named quotes at the midpoint, a trust moment before every
    ask. (Today's honest inventory is thin — placeholders are tracked;
    the architecture reserves the slots real proof will fill.)
11. **One action string** ("Price my project") as the loud CTA; verb
    CTAs route into depth; segmented secondary asks ("Not sure? Run the
    free audit") for the undecided.
12. **Never:** copy SearchKings' pixels/copy/gradients (direct
    competitor — the test: their founder sees our site and says "nice
    site," never "that's our site"); all-caps claims; hidden pricing;
    magnetic/cursor gimmicks; scroll-jacking.

## 2 · THE REALISM KIT (build first — everything else consumes it)

> **STATUS 2026-07-16: the SERP half SHIPPED** (42eaa7a + f6538cd).
> `.g-m` = the pixel-true 2026 mobile SERP, values measured off Google's
> LIVE DOM (mobile headline blue #1558d6, Roboto/Google Sans stacks,
> 28px circle ad favicons, stacked sitelinks w/ edge chevrons, AI Mode
> tab, real DW favicon). Sizes in cqw = proportional at any phone width.
> Bezel verdict (Jake): CSS `.dvc` stays, mockup hunt killed — the
> screen sells it, not the rim; islands DROPPED on UI screens (kept on
> photo screens). **THE SEARCH-CYCLE PATTERN** (Jake's "what could even
> be cycled" answer): a phone hero earns its space by PERFORMING the
> craft on its one visible surface — ads = money search → next search
> (retype in place) → junk search with the ad ABSENT (negative keywords
> made visible; local chip leaves too) → tap takes the click, quiet
> caption under the phone naming each beat. Same player later: websites
> (click lands → page persuades → form catches), ai (asks at 9pm →
> answers → books).

The rebuild's phase zero is a small system of reference-grade surfaces:

- **`GoogleSerp` component, pixel-true.** One canonical mobile SERP:
  correct Google metrics (fonts ~Arial/Roboto at Google's sizes, their
  actual grays #202124/#4d5156, link blue, 8px favicon circles, the
  real "Sponsored" placement, correct spacing), search pill with G-glass
  icon, ad block, organic rows, skeleton continuation. Current g-*
  styles get audited against a real Google screenshot and corrected.
  Used by: homepage hero demo, ads phone hero, narrative cards.
- **The bezel decision.** Options, in order of recommendation:
  a. **Photoreal frame asset + live DOM screen** (their trick, upgraded:
     theirs is a baked image; ours stays alive). Acquire a high-quality
     transparent-screen iPhone frame PNG/WebP (Apple Design Resources,
     Meta Devices, or a CC0 set — verify license), absolutely position
     our live screen content in its window. Natural glass/lighting +
     performing UI.
  b. Keep improving the CSS `.dvc` bezel (shipped, decent, free).
  Try (a) on ONE hero; if the license/fit fights back, (b) is already
  good. Jake: "i don't want to hunt for bezels… but we really need to
  figure this out" — so I hunt, he judges the result.
- **Captures library:** dw-phone-tour.jpg (have), dw-tour.jpg (have),
  future clients drop in via lib/work.ts. Capture recipe (the 4-attempt
  lesson): real 390×844 viewport, `prefers-reduced-motion` emulated,
  cookie/fixed chrome hidden, half-viewport sampling keeping top bands,
  ffmpeg vstack, agent-audit the seams.
- **The narrative-card panel system:** rounded-3xl white cards, one
  bold title, ZERO body copy, a tinted mockup panel inside (our steel
  accent as the unifying tint the way they use their blue gradient),
  soft layered shadow. This is the extracted "perfect section" formula
  (ChatGPT page): three cards telling a story — compose → generate →
  convert. Ours per service: **they search → you're the answer → the
  click lands.**

## 3 · The homepage, zero-based (router order)

| # | Section | Job | Spec |
|---|---------|-----|------|
| 1 | Hero | Hook | Centered. Two-tone claim ≤ ~8 words (800): outcome in ink, "We run the whole click." in steel. ONE loud CTA + quiet audit link. De-risk row (quiet meta, replaces the facepile until real clients fill it). **NO mockup (Jake, 2026-07-16, overrides the earlier spec): "searchkings dont have a mockup in the hero because they have one in each service" — demos live on the service cards + service-page phones. The search enactment is archived at commit 6ac2517.** |
| 2 | Services router | Route | The shipped card grid (demo · name · one line · chips · verb CTA). This is the page's core job. |
| 3 | Free audit | Give | Shipped: canvas ground, skeleton report, dark report card. Catches everyone the router didn't route. |
| 4 | Proof | Prove | The dark receipts card (shipped). One named quote joins it when real. |
| 5 | Price beat | De-risk + route | The claim + CTA **routing to /pricing#estimate**. CUT the full estimator embed from home (router law — depth lives on /pricing). 68svh mobile stays. |
| 6 | 3-step strip | Reduce friction | NEW, small: "The call → The build → Live in weeks," one line each, their "Getting started is easy" compressed to one viewport. The full process moves to service pages only. |
| 7 | FAQ | Objections | Top 4–5 questions only. |
| 8 | Closer | Ask | The steel drift closer stays — the one full-color statement. |

**CUT from home:** value reframe (statement + marquee — the marquee's
trust facts fold into the de-risk chips/footer), the full process
section, the estimator embed. Target: ~8 sections, ≤ 11 phone screens
(from 18).

## 4 · The service-page template (the adapted formula)

1. **Hero** — benefit H1 + one sentence + loud CTA + quiet audit link +
   the PHONE showing the real surface (shipped: SERP/tap, site tour,
   chat booking; deliberate off-fold bleed on mobile).
2. **De-risk chip band** — small, quiet: the service's honest facts.
3. **The free tool** — ads: lead-math (shipped in slot 2); websites:
   the Builder toy moves up; ai: "ask it something" live-chat moment.
4. **The 3-card narrative** — the extracted formula, per service.
   NOTE (2026-07-16): on ADS the hero's search cycle now performs this
   exact story — one story, one section, so the ads 3-card slot carries
   something else (deliverables / proof) or is cut:
   - ads: ~~they search → your ad answers → the click lands~~ superseded
     by the hero search cycle
   - websites: *the click arrives → the page persuades → the form
     catches* (real capture crops)
   - ai: *they ask at 9pm → it answers from your pages → it books*
     (our chat surfaces)
5. **Highlights gallery** (ads has it; extend where content exists).
6. **Deliverables** (keep, copy-tightened to fragments).
7. **Proof** — named quotes (real ones when they exist).
8. **Process** (keep — this is where it lives now, not home).
9. **Price peak** (keep, transparent — our divergence).
10. **Ask** — CTA + segmented secondary: "Not sure yet? Run the free
    site audit." Sibling-services funnel carries the motif out.

## 5 · Other pages

- **/pricing** — becomes the estimator's home (the router destination).
  Estimator prime, sheet as appendix (already true). De-risk chips near
  the top.
- **/work + cases** — architecture fine (fresh mobile pass + phone
  exhibit). Copy-tightening only.
- **/contact** — fine (leanest page). Add the audit as secondary path.
- **Site-wide copy pass** — every paragraph to 1–2 sentences,
  benefit-led headings. One dedicated round.

## 6 · What survives untouched (the keep-inventory)

Light-first tokens + Apple bands · type ladder + 800 claims · the
motion system (envelope, play-once, arrival gating, view transitions) ·
nav capsules + identity bar + Ask tile · the audit tool + API · the
estimator · lead-math · the live chat + transcripts · phone shells ·
services card grid · proof receipts card · the closer · footer ·
case-study pages · all the mobile fixes.

## 7 · Build order (page by page, section by section — Jake's process)

- **Phase 0 — Realism kit:** GoogleSerp trued against a real screenshot;
  bezel experiment (one photoreal frame attempt); narrative-panel
  system. *Jake eyeballs the kit before it spreads.*
- **Phase 1 — Homepage restructure:** router order + the cuts (§3).
- **Phase 2 — /services/google-ads to full template** (§4) — the model
  page. Jake approves it, then websites + ai clone the structure.
- **Phase 3 — /pricing + copy-tightening sweep + proof redistribution.**
- **Phase 4 — Full-site verification** (both breakpoints, entrances,
  console, Lighthouse) + Jake's eyeball tour.

Process per section: build → agent-verify (serialized browser) → commit
→ Jake eyeballs. Turbopack stale-CSS: content-nudge + curl the chunk.

## 8 · Open calls (Jake's, standing)

1. **Phone/text channel** — SearchKings converts 100% by phone; do we
   add a real number (nav + mobile bar)? Business decision.
2. **Bezel verdict** — photoreal frame vs CSS bezel, after Phase 0.
3. **Hero demo size** — keep full search-enactment or slim to a still
   that performs on scroll-arrival.
4. A/B later: audit-before-services vs services-before-audit.
