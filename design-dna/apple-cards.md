# Apple cards — the measured system (apple.com/iphone, 2026-07-15)

Jake: "I've always loved their cards" — the whitespace, spacing, sizing.
Measured live: five distinct card systems, every box/gap/type value below
is a real computed number, not an estimate. Companion to apple-grammar.md
(§4 surfaces, §9 columns) and iphone-17-pro.md.

## THE INVARIANTS (the laws that make every card feel Apple)

1. **One gap: 20px.** Between sibling cards, everywhere, at every card
   size. The grid never improvises.
2. **One inset: 90px** at 1440 viewport (= the 1260 content grid).
3. **The radius law: 28px or 0.** A discrete card OBJECT gets 28px and
   clips its media; a full-bleed banner composition gets 0. Radius
   signals "this is a thing you could pick up" — it's semantics, not
   decoration.
4. **The padding band: 5.2–8.6% of card width, never more than 32px
   absolute.** Small 372px cards run 28–32px (7.5–8.6%); big 620px
   banners run 32px (5.2%). One maximum breathing unit page-wide.
   The generosity Jake perceives is NOT huge padding — it's the AIR
   BLOCK (see 6) plus disciplined small gaps.
5. **The internal rhythm (372px card):** eyebrow →13.6px→ headline
   →13.6px→ body. Then the big isolating gaps: 40px before a CTA row,
   85px (≈15% of card height) before a bottom image. Tight family
   spacing, wide stranger spacing.
6. **The whitespace anatomy** (incentive card, the archetype):
   text block 36% of height (top-anchored) / pure air 15% / full-bleed
   image 49% (bottom-anchored, flush to edges). The image never has
   padding; only text does. Air lives BETWEEN text and image, not
   around everything equally.
7. **Type at card scale:** headline 28px/32 · 600; eyebrow+body 17px ·
   600/400. Banner scale: 32px/36. And the TRACKING SIGN FLIP: body and
   eyebrow sit at −0.374px; 600-weight headlines flip POSITIVE
   (+0.196px). Small text tightens, display text opens.
8. **No hover elevation, ever.** Confirmed by computed-style diff: no
   background/transform/shadow/opacity change on any card surface.
   No shadows at rest either — separation is done by SURFACE COLOR
   (white card on gray section, black card on white section — the card
   always inverts its section), never by drop shadow.
9. **The whole card is the button** (Systems 2–3): a full-card overlay
   control, with a "+" affordance 36px visible circle in a 44px hit
   target, inset exactly 16px from bottom-right. Model tiles (System 1)
   instead make only image + CTA clickable — cards that OPEN get the +,
   cards that SELL get a pill.
10. **The carousel peek:** 372px cards on the 1260 grid show ~3.4 per
    viewport — the cut-off card is the scroll affordance (no arrows
    needed at rest).

## The five systems (boxes)

1. **Model tiles** 372×682 (transparentframe, image-only rounded 28,
   28px side pad, headline 28/600, price 17/600, CTA pill 44px tall,
   biggest gap 40px isolates the buy row).
2. **Incentive cards** 372×576, white on gray, radius 28, 32px pad,
   anatomy per invariant 6, + button.
3. **Tour cards** 372×680, BLACK on white, radius 28, same scaffold as
   2 but media as oversized background layer clipped by the radius,
   text overlaid top (eyebrow+headline only — leaner), + button.
4. **Banner cards** 1260×480 full-width or 620×602 paired (620+20+620
   = 1260 exactly), radius 0, no fill — compositions, not objects;
   text 56px from top, links not buttons.
5. (Excluded: the footer index list — rows, not cards.)

## EAS APPLICATIONS

- Our radius tokens already encode the radius law (panel vs frame);
  keep full-bleed moments square.
- Check our cards against the padding band in the polish pass: Apple
  never exceeds 32px card padding — generosity comes from the 15% air
  block and image bleed, not from inflating padding.
- Our dark tiles on light canvas = their inversion logic. Correct.
- The 13.6/40/85 rhythm (tight family, wide strangers) is the
  transplantable spacing idea: group related text tightly, then isolate
  actions and media with one big deliberate gap.
- We already obey no-hover-elevation (apple-micro-interactions §7).
- If we ever build a card carousel: 20px gap, ~3.4 visible, cut-off
  card as the affordance, + only if the card opens something.
