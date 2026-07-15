# Apple Ad Motion — the choreography codex

Sourced 2026-07-15 from Jake's research: DEmotion's "Apple Style Motion
Graphics in After Effects" (a breakdown of Bart_VFX's tutorial,
trydemotion.com/blog/after-effects-keyword-settings) + its companion
"Apple Style Animation Guide". This is the AD/keynote grammar — how
Apple's product films and UI promos move — distinct from their WEB
grammar (apple-micro-interactions.md, which we measured ourselves).

## THE HEADLINE FINDING
Apple's ad feel is NOT a curve. §10 already proved their curves are
boring (ease-in-out, no springs, no overshoot). The ad magic is
**choreography** — five mechanics about WHERE things grow from and WHEN
they arrive relative to each other. All five are free in CSS/GSAP.

## The five laws (AE technique → web translation)

### 1 · ANCHORED EMERGENCE
Nothing scales from its center, and nothing merely fades. Every element
grows from a MEANINGFUL point — the AE anchor-point tool (Y) moved to
the edge/corner where growth should originate ("the arrow grows from
its upper tip, not its center").
→ Web: `transformOrigin` at the semantic origin + a small scale
(0.85–0.95 → 1). A chat bubble grows from its TAIL (where the send
came from). A dropdown from the button that opened it. A sitelink from
the edge it reads from.

### 2 · THE FOLLOW-THROUGH CHAIN (valueAtTime(time − 0.1))
The signature AE expression: a driven layer reads its driver's value
0.1s in the past, so elements respond to EACH OTHER instead of firing
simultaneously. "That delay is everything" — frame leads, circle
follows, arrow last. Layers behave as a system, not a list.
→ Web: ~0.08–0.12s offsets down a hierarchy chain — container leads,
contents trail, label last. In CSS: `transition-delay` cascade on the
state class (delays live ONLY under the active class so the reverse is
immediate — Apple closes faster than it opens, per their flyout).
In GSAP: position offsets `"<0.1"`.

### 3 · SQUEEZE THE TIMING
Snappiness = compression, not a different path: move the first
keyframe slightly LATER, drag the second CLOSER. Start late, resolve
fast. Individual moves run 300–600ms; timing is RELATIONAL — a move
that looks right alone can be out of sync in the full stack, so always
judge the whole sequence.
→ Web: 0.3–0.45s per move; a beat of stillness BEFORE a move begins
is part of the move.

### 4 · TEXT AFTER SETTLE
Copy never arrives while geometry is in flight. "If everything fires
at once, it looks like a PowerPoint transition. If text arrives a
fraction after shapes lock, it looks designed." Text then enters
word-by-word / element-by-element with a slight stagger.
→ Web: the label/message content fades in ~0.1s after its surface
finishes scaling.

### 5 · SETTLE AND HOLD
Every sequence resolves to complete stillness, and the hold is a BEAT
in the composition, not dead air. (Their films end on a still
endframe; their web galleries hard-stop as "ended".)
→ Web: loops carry explicit hold tweens (`.to({}, {duration})`); a
demo at rest must look composed, not paused mid-thought.

Plus the ambient rule: 60fps buttery = animate transform/opacity only,
which we already live by.

## What this codex does NOT change
- Curves stay boring (§10): diegetic moves = EASE_LOOP/EASE_UI, brand
  entrances = EASE_STRUCTURE. Ad grammar is choreography ON TOP of the
  curve law, never a license for springs/overshoot.
- One entrance beat per section (iphone-17-pro.md) still governs
  page-level motion. Ad grammar lives INSIDE artifacts/demos.

## Applied (2026-07-15) — the services micro-demos
- **Ad demo light-up = a follow-through chain**: Sponsored badge stamps
  first (it's the certificate), title color turns +0.1s, desc +0.18s,
  sitelinks unfold +0.3s, then each link lands squeezed (0.3s, 0.1
  stagger). Dim-out has no delays — closes as a unit, faster.
- **Chat demo = iMessage grammar**: user bubble pops from its bottom-
  right tail (anchored emergence, scale 0.85, origin 100% 100%);
  the answer bubble grows in place from its bottom-left tail; the
  monogram + answer text trail the bubble by 0.12s (text after settle).
- Tour demo untouched — a page scrolling is diegetic footage; law 5
  (hold at top, hold at bottom) was already in place.

## Applied round 2 (2026-07-15, "the inside needs improvement")
The deepest fix was structural: the LOOP itself was the un-Apple part.
- **Play once, rest on the win frame** (law 5 at full strength + the
  iphone-17-pro play-once law): each demo now performs once as its row
  arrives and holds — ad rests lit-and-clicked, tour rests home, chat
  rests BOOKED. Fully off screen resets; a return replays. Rest states
  = the reduced-motion stills (one source of truth for "composed").
- **Scroll physics for depicted scrolling**: constant-speed crawls read
  as screen recordings. Real scrolling is impulsive — flick, decelerate,
  stop, flick (power2.out per flick, ~1s pauses at stops).
- **End on the story's WIN, not its reset**: the chat gained the
  booking-confirmed chip — the section headline ("…to booked customer"),
  enacted. A demo's final frame should be its best sales frame, because
  play-once means visitors LIVE with that frame.
