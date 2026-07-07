EAS v3 — "Own the whole click" — HARDENED BUILD PLAN (2026-07-06, post-audit)

Decisions locked with Jake: outcome-led positioning, ads named first · warm-light canvas, Lesse grammar · full structural redesign. All four dimension audits folded in below; nothing left to re-decide at build.

═══ §1 — PAGE BRIEF ═══

AUDIENCE (one avatar). Owner of a local US service business (flight school, trades, restaurant, clinic), $300k–$3M/yr, already paying for Google Ads and suspecting he's being taken. Decides with gut + calculator. PULL: plain numbers, fixed prices, proof with dollar signs, working demos. REPEL (deliberate): brand-studio startups, enterprise RFPs, deck-before-price people.

THE ONE ACTION. Get an instant estimate → book the call. The estimator prefills the contact message; the whole page funnels into it.

CONCEPT. (a) direct · engineered · accountable. (b) "We own the whole click" — the funnel is metaphor AND structure: ad (the click) → site (the landing) → AI (the follow-up); every "image" is a REAL artifact of the funnel. (c) THE unexpected move: the hero enacts a Google search — the query types, the ACTUAL Desert Wings ad (verbatim: real headline, real display URL, real "Sponsored" label — a click EAS genuinely owns, verifiable on Google) assembles beneath it, and that card docks down into the proof section. The typed query is fixed to "flight school near me" so the dock into the Desert Wings proof stays honest; the rolling H1 pairs carry industry breadth, the artifact carries truth.

3-SECOND HOOK (re-choreographed). PARALLEL tracks, not serial: headline mask-rise starts at t~0 (rolling industry pair visible <1s — LCP is this text, unblocked); the search enactment runs concurrently in the right zone with typing compressed to 600–800ms; the sequence RESOLVES on the CTA (last = highest = the one action), with the static ticker chips entering as the final beat. Whole composite ≤2s, then HOLD. Reduced-motion and revisit paths skip the typing and show the assembled ad instantly.

FIRST-SCROLL HOOK. The hero's ad card — already overhanging the hero→proof seam by fib-55 (fib-21 mobile) — scrubs down the RIGHT edge into the proof section's right-zone slot. Near-vertical drop, not a diagonal. Hero is NOT pinned; it exits on parallax while proof rises.

TOOLS (built, staying). Estimator (kills "what will it cost?") + builder toy (kills "what would mine look like?"). v3 adds ads line items to the estimator only.

SIGNATURE SURFACES.
- NAV: three floating ink-glass capsules on a fixed strip — logo left · links center (Work / Services / Pricing) · CTA right ("Get an estimate"). rgba(19,20,19,0.55), backdrop-blur ~28px, r 14px, paper text. Persistent, never hides. Link hover = existing HoverText per-char roll.
- PERSISTENT CTA: bottom-center capsule "Get an instant estimate · $—" ($ ticks via the same count-up mechanic as §7 once the estimator has been touched). Appears after hero settles (rise+fade ~250ms EASE_UI); hides during §7 and footer. env(safe-area-inset-bottom).
- FOOTER: giant EXECUTIVE wordmark rise (the single MEGA type exception); socials as inline SVG.
- PAGE LOAD: arrival gate kept (components/anim/arrival.ts); hero title sequence above.

BUTTONS. Soft rectangles, r 12px (--r-btn), ink fill / paper text (steel for the one accent CTA), trailing arrow. INTERACTION LANGUAGE (mandatory on every interactive element): fill-wipe on EASE_UI (ink fills from bottom, label inverts to paper) + arrow nudge x+3px on hover; 2–3% press-squash active; same wipe at chip scale on chips. Pills survive only as tiny meta chips.

COPY (dash-free, eyebrow cut, periods only in prose):
- NO hero eyebrow. Its jobs live in the support line and ticker. Plan-wide: no eyebrows on any section heading unless carrying a true step/category the title doesn't state (§4's numerals satisfy this).
- H1 rolling pairs, NO terminal period: "More students for flight schools" / "More bookings for restaurants". Support (prose, punctuated): "We run the ads. We build the page they land on. One team, accountable for the whole click."
- TICKER = STATIC row of meta chips, entering last in the title sequence: ADS MANAGED FROM $500/MO · SITES FROM $2.5K · FIXED QUOTE IN 2 DAYS · HAND-CODED, NO TEMPLATES. No marquee, no dot prefixes, no hairline fencing. Prices must be readable in a 1-second glance.
- Services (stage name = display line, support = separate sentences): "01 The click" / "Google Ads, managed. $500/mo + spend." · "02 The landing" / "Websites that convert it. From $2.5k." · "03 The follow-up" / "AI that answers and chases, so no lead goes cold. Quoted per project."
- Value reframe: "Ads without a page that converts is paying rent on strangers. A beautiful site nobody finds is a brochure in a drawer. You need the whole click." (word-fill scrub, middle sentence only)
- NO em dashes anywhere in shipped copy (grep in step 6). Typing/caret effects are diegetic-only (inside the search artifact); every heading enters by mask-rise or its storyboarded entrance, never type-on.

CONTENT GAPS — JAKE OVERRIDE (2026-07-06, supersedes the audit's removal rule): proof
ships NOW with PLACEHOLDER metrics + quote. Every instance is marked
`{/* PLACEHOLDER — swap with real Desert Wings data */}` in code, values are
obviously-round ("3x more discovery-flight bookings", "$38 cost per lead", "90 days")
so nothing reads as a precise fabricated claim, and one tracking list at the top of
the proof component enumerates them all. Jake swaps in the real leads/mo, CPL, period
and the real owner quote before launch. The SERP + browser-frame artifacts and the
hero's Desert Wings ad are real from day one.

═══ §2 — STORYBOARD (no adjacent archetype/entrance/transition repeats) ═══

1 · HERO "the search" · AIR · archetype OVERLAP-AND-BLEED: oversized statement commands the left zone; the real Desert Wings ad artifact right-offset, physically overhanging the hero→proof seam by fib-55 (fib-21 mobile) — the overlap IS the layout. Entrance: parallel tracks (headline mask-rise t~0 → concurrent compressed search enactment right → resolves on CTA → static ticker chips last; ≤2s → HOLD). Caret = diegetic CSS caret inside the artifact. Motion job: enact concept (b); eye to headline, then artifact, resolve on the action.

2 · PROOF (Desert Wings) · DENSE · archetype SPLIT/TWO-ZONE, river LEFT 62 / sticky anchor zone RIGHT 38, media-anchored: the docked ad card IS the right zone's anchor (it earns the width); client/sector/engagement meta hangs off it as small lines (fib-8 within cluster, fib-21 card→cluster). RIVER plays the funnel top-to-bottom: (1) SERP/context card small — the click, echoing the docked card; (2) FLAGSHIP landing-page browser frame at ~2x scale, spanning the full 62%, bleeding fib-34 into the gutter — the named main character; (3) supporting shots + numbers block (when supplied) smaller, offset. Entrance: clip-reveal in two masses — flagship heavier (start scale ~.96, longer duration on EASE_STRUCTURE), supports snap in faster from .94. In-view life: river drifts at 2–3 distinct scroll rates against the sticky zone (flagship slowest), ease:'none'. Transition-in: ELEMENT-DOCK — the hero card scrubs a near-vertical drop down the right edge into the zone slot (ease:'none' scrub, settle-into-slot on EASE_STRUCTURE). Mobile: card is already in-column; travel collapses to a short y-drop + reframe; zone un-sticks to a header.

3 · VALUE REFRAME · AIR · centered statement (centering 1/2), t-display-lg. Entrance: word-fill scrub on the middle sentence only. Transition: continuous ground.

4 · SERVICES "the funnel" · DENSE · oversized-numeral index REWEIGHTED: the ARTIFACT is each row's main character (concept b — medium is the message); numerals demoted to an outline watermark spine bleeding −fib-89 off the left margin, 8–12% ink opacity (giant, structural, deliberately losing the contrast contest). Offset-weight alternation: 01 artifact right/copy left · 02 artifact left/copy right · 03 artifact right — diagonal weight down the section. Choreography: watermark gets NO foreground move (static, or faint slow parallax drift at most); copy fades first; the artifact scales-and-settles LAST, entry vector alternating with the layout. In-view life (viewport-triggered, loop-once, ONE secondary action each): ad mock's extension ticks in / browser card runs 1-plane contained parallax on its screenshot / chat demo types one Q&A exchange. Transition-in: MOTIF-CARRY — the §2 ad artifact recolors into the 01 row.

5 · PROCESS · MEDIUM · split, sticky step index LEFT ~30/70 (index-anchored; v2 dark-room remake kept). Entrance: line mask-rise per step. Transition-in: DARK-CHAPTER RISE (earned bg swap, kept).

6 · BUILDER TOY · DENSE · archetype FULL-BLEED MEDIA + OFFSET CARD: the browser-tab toy is the full-bleed media plate (the artifact-frame motif at its largest); giant name line + dot-dock controls composed as the offset element anchored LOWER-LEFT, explicitly NOT centered (protects the centering budget). Ghost self-demo kept; dies on touch/hover. Transition-in: CANVAS-RISE — canvas rises back over the dark chapter, rounded top.

7 · ESTIMATE + CONTACT · DENSE · split, estimator LEFT ~55/45 (tool-anchored, contact secondary), dark inset panel. Values that define "dead space fixed": panel inset fib-34 from canvas edge · panel internal padding fib-55 · estimator line-item rows gap fib-13 (tight group) · total separated by fib-34 (the 2×+ jump — the page's money number) · estimator↔contact gutter fib-55. Ads line item ADDED; placeholder quote REMOVED. Entrance: scrub counters on the total. Transition-in: PANEL-GROW from inset rounded corners.

8 · FAQ · MEDIUM · single downward column, reserved-height answers (layout-stable). Ads-first answers. The page's ONE plain reveal: quiet fade-up rows. Open/close 150–250ms EASE_UI, chevron/index as anticipation cue. NO per-row borders — rows separate by spacing + type weight. Transition: continuous.

9 · CLOSER · AIR · full-color pinned steel panel (the ONE peak; centering 2/2 internally). Drift-line reads across the frame — fix clip mapping so the full sentence passes legibly at all widths. Transition-in: RECEDE-AND-HANDOFF (the page's one depth seam).

10 · FOOTER · MEDIUM · wordmark-from-under reveal (MEGA exception), socials inline SVG, monogram in a mini artifact chip (motif bookend). Transition: footer-from-under.

Adjacency check: overlap-bleed / split-two-zone / centered / numeral-index / split-sticky / full-bleed-stage / split-dark / column / pinned-panel / footer — §1 no longer mirrors §2 (bleed + right-anchor break the left-left repeat); §2/§5/§7 splits carry three distinct tunings (right 62/38 media-anchored · left 30/70 index-anchored · left 55/45 tool-anchored). ONE peak. Centering = 2. Density: AIR DENSE AIR DENSE MEDIUM DENSE DENSE MEDIUM AIR MEDIUM (double-DENSE 6→7 deliberate: toy hands into estimator).

═══ LOCKED SYSTEMS (all valued — see also lockedSystems list) ═══

• CANVAS: #ebecea whole page; dark chapters = inset rounded panels, earned seams only; steel gradient once (§9). Ink #131413 · steel #4C6B7C (accent = the click: CTAs, live numbers, rolling pair ONLY).
• TYPE TIERS: t-display-xl clamp(5.5rem,9vw,8.5rem)/lh 0.94 → hero H1, §6 name line, §9 closer · t-display-lg clamp(2.6rem,4.5vw,4rem)/lh 1.0 → section headings, §3 · t-title 1.5rem/lh 1.06 · body 1rem/1.5 · t-meta 0.8125rem. Footer wordmark = single MEGA exception. §4 numerals: outline, 8–12% ink opacity, may exceed xl in size only. Bricolage Grotesque 650 display (Jake 2026-07-07: 800 read as shouting next to Lesse; 650 keeps the personality, drops the heft) / Instrument Sans body.
• TRACKING: display −0.03em · body 0 · all-caps meta/ticker/chips +0.06–0.08em · CTA labels +0.02em.
• SPACING: fib 8/13/21/34/55/89/144. Section padding: AIR py-144/89 · MEDIUM 89/55 · DENSE 89/55 + fib-55 internal block gaps. Three role values only.
• GAP LADDER (no deviation): display→support 21 · title→body 13 · body→CTA/chip 21 · sibling groups ≥34 · §2 meta 8 within / 21 card→cluster.
• RADII: buttons 12 · artifact frames 18 · panels 24 · chips 8. No pills except meta chips.
• ARTIFACT FRAMES: chrome bar 34px · inset fib-21 (compact variant fib-13) · river stack gap fib-55 · caption→frame fib-13. Exactly two variants (full chrome / compact card) across all 7 appearances, including the docked card at both scales.
• OFFSETS: hero seam overhang fib-55 (mobile 21) · §4 spine −fib-89 · §2 flagship gutter fib-34.
• EASES: EASE_STRUCTURE + EASE_UI only, ease:'none' scrubs. Grep-parity.
• INTERACTION LANGUAGE: fill-wipe + arrow nudge (CTAs), press-squash 2–3%, HoverText on nav links, CTA capsule rise/fade 250ms + shared count-up, FAQ 150–250ms. Every interactive element covered.
• AMBIENT: budget spent on nothing — ticker static, caret diegetic, micro-demos loop-once. No loops.
• CENTERING: 2 (§3, §9). §6 lower-left.
• TRANSITION MAP: 1→2 element-dock · 2→3 continuous · 3→4 motif-carry · 4→5 dark-rise · 5→6 canvas-rise · 6→7 panel-grow · 7→8 continuous · 8→9 recede-handoff · 9→10 footer-from-under.
• HAIRLINES: only inside artifact chrome (diegetic). Zero on canvas; shadow + radius, never keylines.
• OPTICAL: text-box trim on all labels (−1/−2px fallback) · top padding one fib step tighter under leading display lines · arrow centered on cap-height · optical pass in step 6.
• COPY: no em dashes · no eyebrows (except true step/category) · no H1 terminal period · never fabricate · quote removed until real.
• MOBILE/A11Y: matchMedia branch per pin/scrub/dock (dock → y-drop + reframe; proof un-sticks; closer pin shortens) · min-h-svh · CTA safe-area · ghost dies on touch · reduced-motion = final states (assembled ad instant) · AA on ink-glass · FAQ JSON-LD · poster-backed media · LCP = hero headline text.

═══ BUILD ORDER (one session) ═══
1. TOKENS FIRST: fib-144 + section-padding map + gap ladder + type-tier classes + tracking roles + radius (--r-btn 12) + artifact-frame component (2 variants, tokenized) + the fill-wipe/squash interaction primitives. Then nav capsules + persistent CTA (chrome).
2. Hero: overlap-and-bleed layout, parallel-track title sequence (headline t~0, compressed typing, resolve on CTA, static ticker chips last, ≤2s), real Desert Wings ad artifact, seam overhang fib-55, dock stub → §6 loop.
3. Proof: split/two-zone (river L62 / anchor R38), dock landing in right zone, river hierarchy (context → flagship 2x → supports), two-mass reveals, multi-rate drift → loop.
4. Value reframe + services funnel: watermark spine, artifact-last choreography, R/L/R alternation, loop-once micro-demos, motif-carry seam → loop.
5. Estimate chapter (five locked values, ads line in, quote out) + FAQ copy/interaction + closer drift-clip fix.
6. FULL-PAGE PASS: seams + motif carry + adjacency check · greps: centering ≤2, ease parity, em-dash sweep, stuck-hidden sweep · optical pass on capsules + card tops (screenshot loop) · responsive buckets (mobile + ultrawide after every layout change, per standing rule) via cheap subagent; Fable reviews 1–2 key frames only.