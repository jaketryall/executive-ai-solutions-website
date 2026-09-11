# EAS v4 — THE BRIEF
*Written 2026-09-10. Supersedes every prior plan. The first plan this
site has had that was written BEFORE the design instead of after it —
`/dark` has no brief, and "the design isn't landing" is what a page
feels like when it has a look but no argument.*

Sources, all measured this session, none assumed:
`decodes/cosmos.md` · `decodes/itsjay.md` · `dead-code-audit.md` ·
`survivor-review-security.md` · `survivor-review-quality.md`

---

## 0 · WHAT JAKE DECIDED

1. Not the dark direction. Cosmos first, itsjay second.
2. **Light canvas, dark objects.** Locked.
3. Whole site rebuilt — every page, not just the homepage.
4. New route `/v4`, empty stylesheet, nothing inherited by accident.
5. Same repo. `.env.local` untouched.
6. The three service photographs survive. Non-negotiable.
7. The tools come over. Their design does not.
8. "All best practices, incredible performance, crafted beautifully."

---

## 1 · AUDIENCE

**One avatar.** Owner of a local US service business — flight school,
trades, restaurant, clinic. $300k–$3M/yr. Already paying for Google Ads
and half-suspecting he's being taken. Decides with his gut and a
calculator, in that order.

**PULL:** plain numbers. Fixed prices, published. Proof with a dollar
sign in it. Tools that work before he talks to anyone.

**REPEL, deliberately:** brand studios, enterprise RFPs, anyone who
wants a deck before a price.

**What he is actually afraid of:** paying a retainer to someone who
sends a report instead of a customer. Everything on this page either
answers that or is decoration.

---

## 2 · THE ONE ACTION

**Get a real price, then book the call.** The estimator computes it
from real pricing in about sixty seconds and prefills the contact
message. Every section funnels here. One action, repeated — never two
competing asks in a viewport.

---

## 3 · THE CONCEPT

**(a) Three words.** Plain. Engineered. Accountable.

**(b) The metaphor, which is also the layout.**
The light canvas is the studio. **Every dark object on it is a screen
your customer is looking at.** A phone showing the Google result. A
laptop showing the page they land on. A panel showing the message that
chases them. Darkness is never mood on this site — it is always a
device, held up.

This is not a metaphor bolted onto a Cosmos imitation. It is the reason
the Cosmos mechanic fits: Cosmos floats dark cards on light because it
is showing you *other people's work*. EAS floats dark cards on light
because it is showing you *your own customer's screen*.

**(c) The unexpected move.**
The dark objects **stack in the order a customer meets them.** Search →
click → land → get followed up. The page is the customer's journey
rendered as the screens they actually see, in sequence, using Cosmos's
sticky-stack so they physically pile up as you scroll.

The three screens are the three photographs Jake already has and
insists on keeping. **The spine of the page is the asset he named.**

---

## 4 · THE 3-SECOND HOOK

Light room. One line of type at the page's largest size. One dark
object beside it — the phone with the real "flight school near me"
search and Desert Wings' genuine sponsored ad.

**The H1 is the LCP element and nothing blocks it.** No video, no font
swap, no entrance gate on the headline. The object may arrive; the
claim is already there.

---

## 5 · SITE MAP

| route | job | order |
|---|---|---|
| `/` | the whole argument, one scroll | **1 — cuts over alone** |
| `/contact` | the one action, unobstructed | 2 |
| `/pricing` | the numbers + the estimator | 3 |
| `/work`, `/work/[slug]` | three real cases | 4 |
| `/services/[slug]` | three service pages | 5 |
| `/privacy` | plain | last |

Each ships alone. The homepage can cut over before any other page is
touched — that is the property that stops this becoming restart #5.

---

## 6 · HOMEPAGE SECTION MAP

1. **HERO** — light. The claim, the phone, the one CTA.
2. **THE STACK** — the three screens, sticky-stacked in journey order.
   Cosmos's mechanic, built for exactly three, **no padding to reach
   anyone else's length.**
3. **WHO BUILDS IT** — split about. Copy left 7 cols, media right 5.
   ⚠ blocked on a real photograph.
4. **PROOF** — the three case studies. Dark objects, real screens.
5. **IN THEIR WORDS** — client quotes. ⚠ blocked on real quotes.
6. **HOW IT RUNS** — four steps, one flat surface.
7. **THE PRICE** — published numbers, then the estimator. The one
   action, at the point of maximum intent.
8. **CLOSE + FOOTER** — one room, the second and last type peak.

Eight. Cosmos runs nine, itsjay seven.

---

## 7 · LOCKED SYSTEMS

**GROUND.** Canvas `#f5f5f7` end to end (Jake's own Apple-cool value,
not Cosmos's `#f5f5f5`). Dark objects are inset **16px**, radius
**20px**, fill `#0a0a0b`. Four alternations at most. The canvas never
changes colour — objects arrive on it.

**INK.** Reuse `/dark` §02's ladder verbatim — it is a *measurement*,
not an inherited opinion, and every value is contrast-verified:
`#0a0a0b` 18.9:1 · `#35353a` 10.6:1 · `#5c5c63` 6.4:1 · `#6e6e75` 4.8:1
floor. On dark objects: white, rationed.

**ACCENT.** Near-zero. Cosmos uses one red on tiny badges; itsjay uses
none at all. Steel `#4C6B7C` only where a link must read as a link.

**TYPE.** Six rungs. Two peaks only — hero and close (Cosmos's twin-peak
pattern). Peak at **72px** at 1440, not 88: Jake's own ruling from
2026-09-07 was that 88 read "massive," and the lesson recorded then was
to level toward the value already carrying the weight.

**MEASURE.** Text gets a real measure (~70ch). Objects go full-bleed
with fixed gutters. This is the fix for `/dark`'s 2560 problem, where a
shared 1290px column made a section meant to read as ground into a
stripe down the middle of the screen.

**MOTION — the whole vocabulary.**
- Everything scrubbed is **`ease: none`, linear.** Both references,
  measured independently, agree.
- Travel ≈ **0.9 × viewport height.** Cosmos ~900px, itsjay 810px.
- **Transform and opacity only.** Nothing that repaints ships.
- Lenis lerp **0.2** (Cosmos's, double `/dark`'s 0.1).
- One triggered vocabulary at most, and only if a section proves it
  needs one.

**SEAMS — there are none.** Hard cuts, 0px gaps. Both references do
this and `/dark` did the opposite: five bespoke seam devices and a law
forbidding repeats, inherited from Lando, which neither site Jake
actually chose does. This is the single largest reduction in complexity
available and it is evidence, not preference.

---

## 8 · THE TOOLS — logic travels, design does not

| tool | logic | surface |
|---|---|---|
| contact + Resend | **carry** (hardened 2026-09-10) | rebuild |
| site-check | **carry as-is** — best-engineered file in the repo | rebuild |
| ask-this-site chat | **carry** (cached + token-gated) | rebuild |
| estimator | carry `pricing.ts`; **extract** ~230 lines of logic out of the UI file first | rebuild |
| builder toy | **RETIRE — recommendation** | — |

**On retiring the builder toy:** 374 lines whose entire value *is* their
design, plus 40MB in `public/builder` for 8 files. There is no logic
underneath to rescue, so "bring the tool, not the design" doesn't parse
for it. It was already killed once and revived. The three real case
studies answer "what would mine look like?" with actual work, which is
a better answer than a generated mock. **Jake's call, not mine.**

---

## 9 · ASSETS JAKE MUST SUPPLY

Named now, not discovered at the end. Two finished sections have been
blocked on these since July.

1. **A real photograph** — the desk, the room, the person. Blocks §3.
   Every asset in `public/` is a client screenshot; using one says
   "here is our work" one section before the proof says it better.
2. **Three permissioned client quotes, with names** — ideally with the
   client's live site linked so a visitor can verify one. Blocks §5.
   `lib/quotes.ts` is placeholders and cannot ship.
3. **Confirm the pricing bands** in `estimator/pricing.ts` — the file
   has said "Jake: confirm currency + bands before launch" since it was
   written.
4. **Verify the Resend domain.** Mail currently leaves from
   `onboarding@resend.dev`.

Optional: more service photographs. The recipe is documented end to end
in `design-dna/higgsfield/`.

---

## 10 · THE GATES

Not intentions. Gates — the gatekeeper runs them before any section is
called done, and every fix graduates into `checks.md` so it cannot
regress silently.

- **Lighthouse 100 / 100 / 100 / 100**, on the deployment, not localhost.
- **LCP < 1.2s · INP < 200ms · CLS < 0.1.** Better than "good," not
  merely passing.
- **p90 frame time < 10ms** through every scroll effect. Cosmos measures
  8.99ms mean; that is the bar and it is a number.
- **Nothing that repaints.** `/dark` measured 25ms p90 on a colour
  crossfade and 13.8ms on per-word `color-mix` that cost 10.8ms on
  opacity and looked identical. The mechanism loses these fights, never
  the beauty.
- **Server Components by default.** Client JS budgeted per route.
- **Reduced-motion parity and a full keyboard path**, built in, not
  retrofitted.

---

## 11 · THE THREE HABITS THAT DO NOT COME ACROSS

From `survivor-review-quality.md`. Named once so the new build cannot
repeat them:

1. **No untyped global event bus.** `eas:estimate` / `eas:chat-open` /
   `eas:site-check` were re-cast independently in six files with no
   shared type.
2. **No hand-pasted validators.** One email test, one escaper, in `lib/`.
   (Done 2026-09-10.)
3. **No non-null assertions standing in for checks.** `.find(id)!.field`
   at 6 sites and `useRef<T>(null!)` at 25 — sound today only because
   nothing enforces the invariant they assume.

---

## 12 · SEQUENCE

1. Tag the current tree. Branch. Delete in ONE commit — surface and
   `design-dna/`, keeping only what this brief names.
2. Tokens + type scale + the scroll engine (the one piece rated worth
   carrying whole).
3. Homepage, section by section: build → verify → grade → dial.
4. **CUT OVER.** The homepage goes live on its own.
5. Interiors, one at a time, each shippable alone.

`main` serves the shipped site until step 4.

---

## 13 · THE RISK, STATED

Cosmos's surface assumes an endless supply of gorgeous imagery — it is a
visual-discovery product showing off other people's work. **EAS has
three case studies.** Copied at Cosmos's length this reads as a site
padding itself out, and that is the single biggest way this direction
fails.

The defence is in §6.2: build the stack for exactly three, and let it be
short. Three unhurried moments read as considered. Nine stretched ones
read as thin.

The second risk is not in the code. This is restart #4 in four months
and the page has never reached its own footer. §9 and §12.4 exist for
that reason and are the two parts of this brief most worth keeping.
