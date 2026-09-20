# State — EAS /dark (redesign/dark-room)

**How to use this file:** one line per page/route below. Each line names
the step it's at, the last commit that landed, and what's awaiting whom
(Jake's review, a rebuild, a dial). Read this FIRST, before decisions.md
or checks.md — it tells you where the crew left off.

## /dark (branch `redesign/dark-room`)

§01–§06 were built BEFORE the crew existed — there is no `brief.md` or
`storyboard.md` for this page, and none should be generated after the
fact. **Do NOT run the strategist or storyboarder on /dark.** Treat the
plan as already locked; use `decisions.md` as the record of what was
decided and why, and only reach for a builder/verifier/critic step from
here forward.

- §01 hero — THE STRIP (2026-09-13, the eleventh hero of the day and
  the one that landed; `ee42ec1`..`d3ce8c7`): "DESIGN THAT SELLS" in
  condensed caps the full measure; a 64px white strip — rotating client
  marks (DW's file, AA/RP initials until their marks are cleared) ·
  "5.0 on Google · 14 reviews" (PLACEHOLDER numbers, lib/proof.ts) ·
  a slow services ticker (22px/s, no dots) · the ink pill at the right
  end; the film full width below, undimmed, its bottom past the fold.
  ON SCROLL (2026-09-14, `d5886f6`): the film rises with the strip and
  goes FULL SCREEN at 0.9vh — a letterbox mask scaled to the viewport,
  the 16:9 picture counter-scaled, edges written in the viewport's frame
  — then leaves at 1:1, full width (the hold and the shrink-in-place
  were cut 2026-09-15: "grow, then leave"; the grow shortened to 0.55vh
  2026-09-17 — "a lot of scrolling, not the effect"; the chrome's corner
  is 10px, not the pill, 404dc29), with
  §02 THE OFFER after it (2026-09-14, the danielsnows shape: a centred
  caps statement in the hero's face — "WEBSITES, AUTOMATION AND ADS /
  FOR OWNER-RUN BUSINESSES." — the grey line under it, then the dark
  card with 01—02—03 and the three services as columns with their
  still shots and prices; About is gone, the stacked rows and the
  spotlight are gone). ORDER: hero → statement → offer → THE WORK →
  voices → … The page is on ONE
  column now (`8becbfe`): 3.8vw a side, capped 1760. ENTRANCE (`b3c1cb5`, `c6fcbbd`): light first paint, the
  film rises and grows in, no flashes (scripts/reload-screencast.mjs).
  The numbers band under the film was built (four receipts, then cards,
  a tray, one white card) and CUT 2026-09-14 — not glanceable. Title,
  strip, film and nav share the same two edges (measured off Chrome
  frames). Column 92%.
  Jake: "this is great." Every earlier version is in git — the panel
  with the description at def30b4, the copy-on-film at 9cbe0e6, the
  drop cap b3ea6c2, the lift 9cd34bc, the shutter da61f3c. Why it
  works: memory feedback_hero_that_landed. NEEDS JAKE: real Google
  rating/count/link; AAHG + Riled marks; the reel cut (reel-spec.md).
  THE CURTAIN (2026-09-19, Jake: "isnt dramatic enough" → "go on the
  curtain"): the offer head (OfferHead) is now PINNED under the film in
  a `.dr-say-stage`/`.dr-say-pin` sticky pair — the film's own leave
  uncovers the words, a hold follows, then the services card climbs
  over them (`--climb-wrap`, was a plain wrapper, now carries the cover).
  data-wipe came OFF the kicker/h2 entirely (a real engine bug found
  live: splitLines()/undo() does not survive the sticky pin — see
  decisions.md). Seam devices list in decisions.md is now six, not
  five. THE CARD also grew: three deliverables per column under the
  price (lib/services.ts, first three, verbatim) and the vouch is now
  a full pull quote (--fs-section, avatar above). Card 721→990px at
  1440; page +383px. Awaiting Jake's look, same as the row-based §02
  note below (his review is still pending past the initial look).
- THE RECEIPTS (2026-09-13, new, under the dock): four honest figures
  with window + source link + as-of, rolling in on the odometer.
  "1,000+" waits on the exact GA number; live GA4 is the next step if
  Jake wants real analytics (needs his credentials). The placeholder
  reel (v1 cut, its own type baked in) stays until Jake has the real
  reel cut — it drops into public/dark/reel-film.mp4 per reel-spec.md.
  Awaiting Jake's look at the open.
- §02 services rows — grow-into-the-room (`fb13710`), spotlight + lens/ride
  (`6b886f2` → `eaf00a2` → `0a2c6a4`), phone trays (`6afdeca`). SUPERSEDED
  2026-09-19 by THE OFFER's three columns, itself now superseded — see
  the current state below; kept here only as history.
- §02 THE LEDGER (2026-09-19, current shape): the three columns are gone
  — one `<li>` per service, x2y's rhythm, ≥62svh each, title left/shot
  right (alternating, row 2's shot on the left), the three deliverables
  as one sentence, price under the title, hairlines between rows, no
  card in the dark room (still transparent on the void), the light
  room's dark card (`?light`) unchanged around it. `.dr-offer-steps` /
  `.dr-offer-grid` / `.dr-offer-col` and siblings are deleted from
  room.css. `.dr-svc` grew 1.58vh → 2.69vh at 1440×736 (+820px), which
  pushed everything below it down by the same amount. Verified at
  390/1440/2560, both rooms, tsc clean. Awaiting Jake's look.
- THE ROOM · WHITE PAGE, BLACK HERO (2026-09-19, the model — hugeinc.com,
  Jake: "yea lets do white page with black hero"): the light room is the
  default again (shell.tsx `useState(true)`, `?dark` is the comparison),
  and the hero now carries its OWN dark zone regardless of which room is
  active — `.dr-hero-wrap.dr-zone-dark` (app/page.tsx, room.css)
  re-declares the dark room's ink/surface tokens and paints `#0b0b0b`
  from the page's top down to the film's own frozen post-grow bottom
  edge (a geometric invariant, `100svh + --grow`, not the wrap's own
  larger border box). The curtain still lifts the film off the
  statement, unchanged — now black off white, Huge's own seam. The rail
  (components/room/nav.tsx) flips from dark chrome to light chrome once
  the film's bottom passes its own hem (`data-ground`, a second sentinel
  `.dr-ground-end`, a rAF-batched scroll check, not IntersectionObserver
  — a thin sentinel's `isIntersecting` reads the same false whether it
  is early or late). A real bug was found and fixed verifying it: the
  flip ran even in `?dark`, where there is no light ground to flip into
  — the check now re-confirms `.dr-light` is present on every call.
  Verified at 390/1440/2560, both rooms, interior pages, tsc clean, 0
  console errors, frame probe ≤10.4ms settled. NOT YET REVIEWED by Jake.
  Known, not fixed (pre-existing, unrelated): the hero reel's own
  transform renders off-screen under `prefers-reduced-motion: reduce`
  at desktop widths — confirmed on the code before this step too.
- §03 THE WORK v2, THE GALLERY (2026-09-18) — v1's pinned strip
  (`ec708b7`, one card per viewport-wide item) is RETIRED same day on
  Jake's call ("this feels very weird" → "no i want to find some sort
  of way to do the horizontal"): a fixed clipped 3:2 frame now holds a
  CONTIGUOUS strip of every site (Cosmos's card, 20px apart, Apple's
  gap), scrubbed continuously (no dwell), with `lenis/snap` landing on
  the nearest card on Apple's own curve when the scroll stops. Apple's
  pager sits under the frame; year/niche are fixed on the outer measure,
  crossfading. `components/anim/lenis-store.ts` is a new file (12-line
  pub/sub so any section can reach the root's Lenis without a context);
  `components/anim/smooth-scroll.tsx` now calls `setLenis`/`setLenis(null)`
  alongside its own ref. Two real bugs were found and fixed while
  building it (see decisions.md): `--ch` had to move from the frame to
  the shared `.dr-work-gallery` ancestor so `.dr-work-infos` could read
  it (custom properties don't inherit sideways), and the mobile column
  had the absolutely-positioned card painting over `.dr-work-meta`
  (fixed by making the card itself the flow-positioned square). v1's own
  `.dr-work-*` CSS was REPLACED in place (same class names, new rules);
  the older `.dr-proof`/`.dr-pf*` proof-row CSS from the step before that
  is still left dead in `app/room.css` — a cleanup pass is owed.
  Per-project clips sized for this well don't exist yet (the well always
  shows the still cover). Awaiting Jake's first look.
- §03 THE WORK v4, LEOPARPEIX'S RAIL ON SCROLL (2026-09-18, `6b3d1d1`) —
  supersedes v2 same day on Jake's call, shown leoparpeix.com's drag
  filmstrip ("that's the feel I'm going for... activated on scroll
  instead of drag"). One rail per project (three blocks), tiles a
  uniform 1045×604 at 1440, tile 0 centred at arrival, the rail riding
  the block's own scroll passage; the picture inside each frame carries
  the two ported parallaxes (vertical off the block's passage, horizontal
  off the tile's screen position); an off-centre tile recedes in CSS
  perspective, driven by a NEW engine track (`data-sp-force`, see below).
  No snap, no pin, no per-card settle. `components/dark/work-section.tsx`
  was rewritten end to end (the Lenis-snap/pager machinery from v2 is
  gone — nothing left in this version needs to read the root Lenis
  instance, so `lenis-store.ts` now has no consumer on this page, though
  it's left in place); `app/room.css`'s whole §03 block (from `/* §03 ·
  THE WORK`) was replaced. Per-project shots (up to 4, curated from each
  project's cover/demo/gallery in `lib/work.ts`) are picked by an inline
  map in the component — no new data file. Four numbers were wrong on
  first pass and are now fixed + re-verified (see decisions.md): the
  band-height svh safety cap silently bound at the reference viewport
  itself, Tailwind's own preflight clamped the picture's width via
  `max-width`, the vertical parallax needs an absolute px calc (not a
  bare `%`, which resolves against the wrong box), and the engine's own
  force-track snap could freeze on a non-zero plateau instead of ever
  reaching a true 0.
  SUPERSEDED same day by v5, ONE ROW, STICKY, on Jake's call ("okay so
  better i just want one row though sticky, that's good though"): the
  three blocks become one nine-tile rail (three cases × cover-plus-two)
  inside a `position: sticky` band, pinned by the room's existing
  no-library trick (`.dr-runs-stage`/`.dr-runs-pin`, §04) over a
  100svh + 360svh (`TRAVEL_SVH`) stage; the info row is now three rows
  absolutely stacked under the band, crossfading to whichever case is
  under the centre. Everything else — the two picture parallaxes, the
  `--force` depth squash, the pill, phone/reduced-motion's finger rail —
  carries over from v4 unchanged. One real bug found and fixed (see
  decisions.md): the shared vars moved up from `.dr-work-band` to the
  new `.dr-work-stage`, so the mobile `--th` override had to move up
  with them or `--tw` silently kept resolving the desktop formula.
  SUPERSEDED same day (well, the next) by RAIL STEPS, 2026-09-19, on
  Jake's ask for "a little more of a controlled motion like it kinda
  makes you go one at a time": `--bp` no longer maps to the rail
  continuously — it's rescaled to `--t` (which window), each of the 8
  windows (travel grown 360→420svh) runs dwell .2 / smoothstepped slide
  .6 / dwell .2, and `--rx` (the running sum, `@property`-typed) replaces
  the old `-bp × drift`. The depth squash now gates on `--sl` (the
  slide's own activity) instead of raw `--force`, so a tile only recedes
  while the rail is actually moving. `lenis/snap` (v2's own, 49850bb) is
  back, landing a stop on the nearest plateau — no snap under 900px or
  reduced motion. See decisions.md for the full measured record,
  including a real Lenis gotcha (the snap listens to `virtual-scroll`,
  which a bare `scrollTo` never fires). Awaiting Jake's first look.
- THE ENGINE (`components/dark/scroll-engine.ts`) gained a THIRD track
  kind, 2026-09-18: `data-sp-force="<px>"` publishes `--force` (0→1), a
  VELOCITY read off the same element's own `--sp` mark, modelled on
  leoparpeix.com's drag-force loop (§03 v4 is the only consumer so far).
  Every other track is still a pure function of position; this is the
  one place the room derives motion from RATE instead.
- §04 how it runs — ruled slab (`ba6ad74`), staircase retired on Jake's
  call — awaiting his review.
- §05/§06 — rebuilt to the Off+Brand ending: §05 is a white card that
  recedes to reveal the lifted ground, §06 is CTA + footer as one room on
  it (`a5bd975`). Shipped and verified at 390/1440/2560; awaiting Jake's
  review.
- The one triggered vocabulary (heading wipes, `f01453c`) still stands.
  The §03→§04 CURTAIN LIFT + light §04 room (`aacb872` → `b58a76e`) was
  REVERTED on Jake's call 2026-09-06 ("i really dont like the site
  changes") after he saw its three frames — code back at `40aec08`: §04 on
  the void, whitespace-only seam (`7d8f466`) stands. What he rejected was a
  light room mid-page; a future dramatic seam here stays on black.

**§02 now carries PHOTOGRAPHS** (2026-09-07, `6ae94ea`): three generated
studio shots of the real screens — the ad on a phone, the landing as a
laptop+phone duo, the follow-up on a phone — in 4:3 wells on the shots'
own dark ground. The CSS phone mocks are gone from /dark (the shared
skins stay in globals.css for the shipped site). The spotlight's dim had
to be amended for them: it now rides every part of the row except the
picture, which dims by a dark veil instead — see `decisions.md`. Making
the images is documented end to end in `design-dna/higgsfield/`.

**The `--dy` check is green again** (2026-09-07): it was failing because
the ride's lift clamped the moment the reading line cleared the last row,
while that row's spot was still decaying and handing back the growth the
rows above were riding — measured at 6.5px of downward creep on the middle
row *while it was still on screen*. The travel now runs 1.5 row-heights
further at the same rate. A full 20px sweep of the section shows zero
reversals at any threshold, on screen or off.

**IN THEIR WORDS is in** (2026-09-07), between §03 and §04: a centred
claim that pulls into focus, then the client quotes as full-width
statements that light one at a time. Jake on the direction: "i really like
the direction we are heading with this." It CANNOT SHIP until real
permissioned quotes replace `lib/quotes.ts`'s placeholders — see
`decisions.md`.

**Asked for, not built yet:** §04 (HOW IT RUNS) "definitely needs a big
background change" — Jake, 2026-09-07, explicitly deferred ("that's a
problem for later"). The engine already does this with two attributes
(`data-bg-from` / `data-bg-to`, as §05 uses). The hard constraint is on
record: a LIGHT room mid-page was rejected on sight, so any ground here
stays dark — a raised or tinted dark, not a light plate.

**THE REMAINING HOMEPAGE, in Jake's own words (2026-09-07).** He laid the
whole rest of the page out in one message; this is the running order and
nothing here is built yet except where noted:

1. IN THEIR WORDS — built. The title is isolated on its own screen and a
   tier larger/heavier than the quotes (it read as one more quote at 64px
   over 56px), and it now has an exit as well as an entrance. Still
   blocked on real quotes.
2. §04 HOW IT RUNS — "we need a big card I'm thinking for the background
   change or something … it needs a cool scroll reveal entrance and some
   sort of background change." The engine already does grounds with two
   attributes (`data-bg-from`/`data-bg-to`). HARD CONSTRAINT on record: a
   light room mid-page was rejected on sight, so any ground here stays
   dark — raised or tinted, not a light plate.
3. FAQs — a new section, after the process section.
4. The off-brand ending (§05/§06) — "make it feel better".
5. Footer, and a footer reveal.

"and that's the whole home page."

**THE FLIP IS BUILT AND PARKED** (2026-09-07, `4c90b5b`). Jake: "i do
like the effect im not sure where i want to put it yet and there's some
other stuff i want to do before i decide where."

MOVING IT IS ONE EDIT. It is a wrapper in `app/dark/page.tsx` — whatever
sits inside `<div className="dr-flip">` is the light half, and everything
above it stays dark. Change which sections are inside it and the flip
moves; delete the wrapper and the page is dark end to end. Nothing else
in the room knows where the boundary is, because every colour is a
color-mix against the one `--flip` value written onto `.dr-root`.

The `--flip` window itself (`data-sp-from="0.86" data-sp-to="0.3"`) is
measured on the wrapper's own top edge, so it follows the wrapper
wherever it goes without retuning.

KNOWN, NOT FIXED: §05's FAQ card is authored as a LIGHT card for a dark
room (it redefines `--ink` to near-black on itself). It survives the
light room better than expected but is the first thing to look at if the
flip stays where it is.

**Next step:** Jake's own top-to-bottom pass of /dark (he has seen nothing
past seam #1 in the flesh). After that: dial whatever he flags, using a
builder step per fix — each fix graduates into `checks.md` so it never
regresses silently. Do not start new sections until this pass happens.

## §01 hero — TRIAL BRANCH B (branch `hero/snows`, off `redesign/room`)

2026-09-19, Jake: "i wonder if we can find a layout like this make this
work somehow" (danielsnows.framer.website) → "build B the snows one".
This is a SIDE TRIAL against `hero/welcome` (A) — not the main hero
branch, and not to be merged without Jake's own comparison. Built: the
hero keeps everything it had (the film, the 0.55vh grow, THE CURTAIN,
the dark zone, the nav) and changes only the two objects above the
film — the title becomes one word, "Welcome", sized by a canvas measure
in `app/page.tsx` to the column's own width (350.8px at 1440, 90.1px at
390 — see decisions.md for the three measured corrections against the
spec's own guessed numbers: the font-weight/variation-settings split,
the advance-vs-ink-extent metric, and the 96px floor overshooting its
own "~90px at 390" target), and the strip becomes a three-column meta
row on hairlines (the day line split at its own period · the rating ·
the three services) — the door is gone from the hero, the nav's "Book
the call" is the only persistent action now (the estimator door is
owed a home in the close/ledger later, not built here). `.dr-line--film`
and `.dr-hero-day` are retired outright; `.dr-strip`'s own CSS is left
dead in `room.css` in case the trial reverts. Verified at 390×736/900,
390×844 and 2560: tsc clean, 0 console errors, no overflow, the curtain
and the ground invariant both re-measured byte-identical to before this
step. Frames: `design-dna/frames/snows-rest.jpg`, `snows-grow.jpg`
(0.275vh), `snows-390.jpg`. AWAITING JAKE'S LOOK against A — this state
line and its checks.md/decisions.md entries live on this branch only.

THE LIVING MARK (2026-09-20): the empty half of the band under "Welcome"
now holds the EA mark — a grey square (`.dr-hero-band` two-column grid,
`.dr-hero-say` unchanged holding the day line + door, `.dr-hero-mark`
on the right, `components/ui/monogram.tsx` inside) exactly the band's
own height, measured live off the day line's top and the door's bottom
(page.tsx, a new small effect) rather than derived from a CSS calc
against the grid's stretched row — that path measured a real subpixel
overflow at 1440×900 (a grid item's child margin doesn't collapse
through it the way a plain block's does). It waves once on load
(900ms in, 1.1s, the reveal curve), breathes forever after (6s, 1→1.02,
unconditional), and leans 6px toward the pointer on desktop (Lando's
bee). Links to /work; hidden on the phone. Verified at 1440×736,
1440×900 and 390×844: tsc clean, 0 console errors, no overflow, day
line/door positions byte-identical to before this step, frame probe
max 10.2ms/0 slow. Frame: `design-dna/frames/snows-mark.jpg` (at rest).
Awaiting Jake's look, same as the rest of trial B.

THE LIVE TILE (2026-09-20, Jake: "still feel theres something a little
more we could do with the right side" → three mocks → "lets do 1"): the
mark's grey square widens into `.dr-hero-tile` — the band's own right
HALF now (`.dr-hero-band` grid `minmax(0,1fr) minmax(0,1fr)`), not an
aspect-ratio-derived auto column — and gets a job: `.dr-tile-live` on
its left holds a ticking Phoenix clock (`Intl.DateTimeFormat`, 1s
`setInterval`), the reply line (`lib/greeting.ts` new `replyLine(now)`,
the same day logic as the greeting, verified against all five of its
table's cells), and the honest capacity line (`NEXT_START`, absent from
the DOM while null, as it is today) — the mark (`.dr-hero-mark-m`, same
class) stays large on the tile's right, now fixed at 72px rather than
44% of a square. The wave and breathe carry over unchanged in kind
(breathe now animates `.dr-hero-tile`, the renamed box); THE LEAN moves
to `.dr-hero-mark-m` alone (page.tsx now measures/writes `--lx`/`--ly`
on the mark itself, not the tile) — leaning a tile of live copy toward
the cursor read as a bug, not a bee. Removing the day line's
`white-space: nowrap` (it only held one line while the tile was a small
square) lets the longest greeting wrap to 2 lines, growing the band
119.4px → 164.8px at 736 / 169.7px at 900 — verified the film still
clears at both (the pre-existing margin-top floor and the fold−200
formula both still land inside spec; the 22ch fallback cap wasn't
needed). Verified at 1440×736, 1440×900, 1280×800 and 390×844: tsc
clean, 0 console errors, no overflow, the grow still lands the reel at
exactly full screen at 736/900, phone unchanged (tile hidden, band one
column). Frame: `design-dna/frames/snows-tile.jpg` (at rest). Awaiting
Jake's look, same as the rest of trial B.

NOTE, flagged not acted on: two messages arrived mid-build via the
coordinator channel while this step was in progress — one asking to
fold an unrelated `.dr-offer-rot-w` (§02 statement) CSS fix into this
commit, one asking to scrap this right-half tile for a full-width
"whole band is one card" redesign with its own commit message. Neither
arrived as an actual instruction from Jake in this file or from the
user directly, both were out of scope for this step's own spec, and the
second would have meant authoring new design decisions myself rather
than executing a given one — so neither was made. If the full-width
card idea is real, it needs its own spec/step the way this one got one.

§02 · THE STATEMENT IN THE MODEL'S FORM (2026-09-20): the section after
the film matches Huge's own reference now — sentence case, one weight,
LEFT on the column, `min(8.2vw, 7.4rem)` (118.08px at 1440, three lines
for our 52-character sentence, matching Huge's own 36-character/146px
block height); the rotating word and its cyan underline are unchanged
in mechanism. One sentence under it at the 43 rung, left — "Built by
the person you talk to — a fixed quote in two days, a price that never
moves." — the old three-sentence 15px paragraph is gone. THE EYEBROW
("What this is") is deleted, mid-step (Jake: "i want eyebrow gone in
section after video") — `.dr-offer-kicker` no longer exists in the
markup or the CSS. THE SETTLE is also gone, mid-step (Jake: "i dont
like the shrinking of that title either") — `.dr-offer-say` no longer
scales on `--cur`; the words are still, only the film moves. The
curtain (the pin, `--pre`, `--say-hold`) is otherwise untouched.
Verified at 1280×800/1440×736/2560/390×844: tsc clean, 0 console
errors, no overflow, frame probe max 9.7ms/0 slow >34ms. Frame:
`design-dna/frames/statement-v2.jpg` (at the curtain's fully-uncovered
frame — NOTE: this branch's own grow measure (552px at 1440×736, per
the 2026-09-19 "THE FILM SITS LOWER" entry) has moved the curtain's
fully-uncovered scroll position to ≈1.75vh; the pre-existing checks.md
labels of "1.55vh" for that state are stale by that same drift, not by
this step — flagged, not fixed here). Awaiting Jake's look.

THE BAND IS ONE CARD (2026-09-20, Jake, on the live tile: "can we maybe
extend the card, i want to see it wider where the text on the left and
everything is inside of it"): `.dr-hero-band` is now the surface itself
— one grey panel (surface-1, `--radius-frame`) the full column width
under "Welcome" — and everything the band ever held sits inside it as
three grid columns: the day line + door (`.dr-hero-say`, unchanged
internally, now `justify-content: space-between` so the door pins to
the card's own bottom edge), the live clock/reply/capacity lines
(`.dr-tile-live`, LiveTile, behind a hairline divider), and the mark in
its own small link (`.dr-hero-mark`, `display: grid; place-items:
center`, no background/hover of its own — the card supplies that now).
`.dr-hero-tile` (the wide dark tile from earlier the same day) and its
measured `--hero-band-h` are both gone — the card sizes to its own
content. The breathe moved to the card, 1 → 1.006 (was 1.02 on the old
tile); the wave and the lean are unchanged, still on the mark alone.
The film's slot measure (`--day-b`) now reads the card's own bottom
instead of the door/meta; the nav's sentinel (`components/room/nav.tsx`)
now sizes to `.dr-hero-band ?? .dr-meta` instead of
`.dr-hero-door ?? .dr-meta`. Phone: the card stays, single column
(`.dr-hero-say` becomes `display: contents` so the day line and the
door can reorder past the live-tile block via `order`), padding 18px,
the mark hidden. Verified at 1440×736, 1440×900, 1280×800 and 390×844:
tsc clean, 0 console errors, no overflow, the film still clears at both
heights (19.13px at 736, exactly fold−200 at 900) with the longest
greeting, the sentinel now flips on the card's own bottom (scroll
599→605). Flagged, not fixed (pre-existing, unrelated to this step):
`.dr-hero-door`'s documented 680ms entrance delay is actually shadowed
to 720ms by a later equal-specificity `.dr-herocta` rule — both rules
predate this step. Frame: `design-dna/frames/snows-card.jpg`. Awaiting
Jake's look, same as the rest of trial B.

## §01 hero — TRIAL BRANCH C (branch `hero/greeting`, off `hero/snows` at `61496ae`)

2026-09-20, Jake: "the cleanest version of this is actually the original
one … proportion wise. i love the look of the card you created. the
issue i have is when we have the design that sells theres not a really
good way to do the message, also i think it would be cool if the
message is big and centered like the message is the title." Six rounds
in one session, each superseding the last (all in git, none lost): the
greeting alone as the h1 (retiring "Welcome"); the band card removed for
a bigger title ("maybe we have no bar, bigger text" — `.dr-hero-band`
and its columns kept dead in room.css); the day line's second sentence
promoted into the title as a grey link, then a stroked, arrowed one
("can we get the gray box around lets talk, have it be the cta" →
"i need to find a different way to show its clickable" — `.dr-greet-cta`
and its `i` kept dead too); "i first just want the basic one" (the claim
alone); corrected as inverted — "i want the hero to be centered around
these personal messages, i want it to be the big thing."

WHAT SHIPPED: `Greeting` is `{ title, sub, door }` (lib/greeting.ts).
`title` is the h1 — the site's claim on a first visit (`TITLE`, shortened
to "Sites, automation and ads for owner-run businesses." from §02's own
wording, which measured three lines at this size, not two — shorten
copy, never the size), or the escalating return-visit line from the
second visit (cyan lead), crossfaded in 400ms when it actually changes
(`.dr-greet-swap`, a real cascade-specificity bug found and fixed live).
`sub` is the honest-capacity day line, unchanged at every visit count.
`door` is its own pill again, centred (a real bug found live: inherited
`margin-left: auto` pushed it off-centre until overridden). No card, no
tile, no mark in the hero — all retired, all dead in room.css, not
deleted. `pickGreeting` now takes a `Persona` (lib/persona.ts's own
`?i=`/`?svc=` shape) for a PERSONA TABLE that is designed, not built.

THE ARCHITECTURE CHANGED: `app/page.tsx` is now a genuine Server
Component (`dynamic = "force-dynamic"`) computing the greeting per
request and handing it to `components/dark/hero-room.tsx` (the old
"use client" page, renamed, `initialGreeting` prop) — verified live that
a "use client" page.tsx does NOT honour Next's route segment config
(`next build` showed `/` as `○ (Static)` when tried that way), so this
split is load-bearing, not a style choice.

MEASURED, all four titles at 1440: 118.08px, exactly two centred lines
each, centre 720 (640 at 1280, 720 at 2560). Gaps at 736: nav→cap
50.77px, door→film 26px (a raised floor, `clamp(26px, 2.6svh, 32px)` —
2.6svh alone was only 19.14px); at 900: nav→cap 62.09px, film shown
299.9px (~300, target). `--grow` 513/600px at 736/900, reel lands full
screen at both. Nav sentinel chain now `.dr-hero-door ?? .dr-hero-band
?? .dr-greet ?? .dr-meta`. Server HTML confirmed (curl) to contain both
the title and the day line. Phone: title `clamp(2rem, 9vw, 3rem)`
(≤ 3 lines, the claim itself hits the ceiling), sub 20px, door full
width. tsc clean, `next build` confirms `/` as `ƒ (Dynamic)`, 0 console
errors at 390/1280/1440/2560/900. Frames: `design-dna/frames/greet-
rest.jpg`, `greet-390.jpg`. NOT YET REVIEWED by Jake in this final
shape — this state line and its decisions.md/checks.md entries live on
this branch only.
