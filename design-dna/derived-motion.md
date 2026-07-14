# Derived motion — how to INVENT clean effects, not copy them

Written 2026-07-14, distilled from decoding Apple's highlights gallery and
the effects that survived this redesign. This is the generative method: the
apple-* codices record WHAT great sites do; this records how to design NEW
sections from the same physics. Candidate for graduation into the
signature-frontend skill once proven on a few originals.

## The core insight

The cleanest effects contain almost no animation. No timelines, no
"when X happens play Y." The visual state is a PURE FUNCTION of a
continuous input, evaluated every frame:

    output = f(input)          — not: on(event) → tween

A derived effect cannot glitch. It can't be interrupted mid-tween, can't
replay wrong, can't fight a second trigger, can't drift out of sync —
because it is always exactly where the input says it should be. Apple's
gallery captions ("the text coming in in the direction of the swipe") have
zero direction logic: `x = dist × 0.1266` and direction falls out of the
geometry. When a site feels glitchy, it's triggered animations colliding.
When it feels inevitable, it's derivation.

Corollary: **let the platform do the physics.** Native scroll, scroll-snap,
momentum — read their state, never re-simulate it. The browser's physics
are tuned better than anything we'll write.

## The 5-step design chain (run it in order)

1. **The sentence.** What must this section make the visitor understand?
   Write it in words first ("the prices are real", "someone is actually
   there", "every build is live"). Motion that embodies the sentence feels
   clean; motion that decorates feels like slop regardless of tuning. No
   sentence → no effect will save the section.

2. **The input.** A visitor only gives a handful of continuous signals —
   the whole menu:
   - scroll position ....... "how far into the story am I"
   - element's distance from viewport center ... "what am I looking at"
   - cursor position ....... "what am I curious about"
   - time / real data ...... "this is true, not staged"
   Pick the one that MEANS something for the sentence.

3. **The one output.** ONE element responds; everything else holds still.
   The stillness is what makes the motion legible (Apple's gallery media
   never moves during a swipe — only captions do). Write the mapping as
   one line of math.

4. **The curve.** Where taste lives, and it's one number: linear feels
   mechanical, so bend it. Cubing a falloff turns "fades" into "melts."
   Clamps create rest zones; a dead zone near zero reads as deliberate
   instead of jittery. Tune by feel — it's fast because it's one knob.

5. **Subtract.** First drafts have three things moving. Delete until one
   does.

## The mad-lib (fill all four or don't build it)

    "The sentence is ___. The input is ___. The one thing that
     responds is ___. The curve bends like ___."

## Gate 0 — VARIANCE (learned the hard way, 2026-07-14)

Before any of the five steps: **the input must actually vary across what
the visitor sees.** A center-distance mapping over a 2-item grid ignites
and dims both items together — technically perfect, expressively mute,
and the user's verdict was "i dont understand the purpose of it." The
choreography needs a crowd: derived attention effects earn their keep on
MANY items (a long ledger, a list, a rail), never on a pair. If every
element gets the same value of f(input) at the same time, you haven't
designed an effect, you've designed a global dimmer.

Second lesson from the same retirement: **never dim the proof.** On a
portfolio, work imagery IS the argument — no attention scheme is worth
resting it at 72% brightness. When the item count is too small for
choreography, the honest move is to simply STATE the sentence in static,
fully-legible ink (the "Live · domain" line survived the effect that
carried it in).

## House constraints that still apply

- Bimodal timing law for anything that IS triggered (feedback ≤100ms,
  structure 320–400ms) — apple-micro-interactions.md §0.
- Only transforms/opacity/filter per frame; never layout properties.
- rAF loops are IntersectionObserver-governed (dead when offscreen).
- Reduced motion: derived values rest at their "resolved" state (full
  ink, captions visible), never at zero.
- Numbers shown must be TRUE at rest. Never let a derived count sit at a
  wrong value when the user stops mid-scroll — derive the reveal, not the
  arithmetic.

## Worked examples (the chain, applied)

- **Highlights gallery** (shipped): sentence "this responds to you";
  input card-distance-from-center; output captions only;
  curve `opacity = (1−|d|/range)³`, `x = d × 0.1266`.
- **Work-index ignition** (built 2026-07-14, RETIRED same day): sentence
  "every build is real and live"; input tile-distance-from-viewport-center;
  output the tile's ink. The physics ran flawlessly — and failed Gate 0:
  two tiles share one row, so there was nothing to differentiate, and the
  dim shadowed the proof imagery. Kept: the static live-domain line.
  The pattern waits for a section with a crowd.
- **Contact ambience** (unbuilt): sentence "someone is actually there";
  input real local time in Mesa; output the section's light temperature.
  Nothing triggers; the input is the world, so it reads as true.
