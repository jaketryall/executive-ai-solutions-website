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
- THE RECEIPTS (2026-09-13, new, under the dock): four honest figures
  with window + source link + as-of, rolling in on the odometer.
  "1,000+" waits on the exact GA number; live GA4 is the next step if
  Jake wants real analytics (needs his credentials). The placeholder
  reel (v1 cut, its own type baked in) stays until Jake has the real
  reel cut — it drops into public/dark/reel-film.mp4 per reel-spec.md.
  Awaiting Jake's look at the open.
- §02 services rows — grow-into-the-room (`fb13710`), spotlight + lens/ride
  (`6b886f2` → `eaf00a2` → `0a2c6a4`), phone trays (`6afdeca`). Awaiting
  Jake's review — untested past the initial spotlight look.
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
  reaching a true 0. Awaiting Jake's first look.
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
