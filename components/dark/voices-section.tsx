import { QUOTES } from "@/lib/quotes";
import { STEPS, DemoCall } from "./runs-section";

/* IN THEIR WORDS — the section between §03 and §04
   Between the proof and the process: §03 shows the work, §04 shows the
   method, and this is where somebody who paid says what changed.

   ⚠ THE WORDS ARE STILL PLACEHOLDERS. `lib/quotes.ts` says so at the top
   of that file: de-named, role-only, sentiment invented. Tolerable while
   they sat small under a price beat. HERE they are the section, so this
   cannot ship until real permissioned quotes replace them — with names,
   and ideally the client's live site linked under each, because a quote a
   visitor can go and verify is worth ten they cannot.

   THE LINE IS OURS and is allowed to be: it is the claim the quotes are
   evidence for, in the company's voice, putting no words in any client's
   mouth.

   NOT A GRID — and this is still the whole point of the section (Jake,
   2026-09-07, on the first cut: "it might just be the three cards being
   repeated again too, back to back essentially"). §03 immediately above
   is three cards in a row. Three cards in a row again here read as the
   same section twice, and no amount of drift or ground colour fixes a
   repeated SHAPE. So the axis turns: one centred column, arriving one
   under the other. Horizontal row, then vertical column — the page
   changes gear instead of clearing its throat.

   THE QUOTES ARE ON CARDS AGAIN (Jake, 2026-09-08: "having each quote in
   a card and having micro animations inside of them"), and that does not
   reopen what he rejected: the repeat was the SHAPE — three cards side by
   side under three cards side by side. The column is untouched. One card
   at a time, full width, vertical, still one thing to read per screen.
   What the card adds is a SURFACE, which is his own standing law (content
   lives on panels, never bare on the canvas) and the one thing the bare
   statements were breaking.

   And it does not sit there as a box: it MATERIALISES with the light —
   see the stylesheet, where the card's three beats all read off the same
   --lit the lens already computes.

   BUILT FOR FEW. Three quotes as three cards look like a grid missing its
   fourth. Three quotes as three full-width statements look deliberate,
   and a fourth simply makes the column longer.

   THE LAST ONE HANDS OVER TO §04 (Jake, 2026-09-08: "i want the last
   testimonial card to grow downwards as it moves up, text transforms or
   animates or something and becomes the first card of the horizontal
   scroll"). It does not dim on its way out the way the other two do — it
   CONVERTS: the surface opens downward, the quote lifts out of it, and
   the first step card's face fades into the room the surface just made.
   By the time it leaves the screen it is a process card, and §04 opens
   on the same card a screen later.

   ⚠ WHAT THIS IS NOT: a pixel-continuous morph into §04's own card 01.
   That card lives inside a sticky pinned panel whose own overflow clips
   it, and it is 476px of scroll below the point where this quote has
   already left the top of the screen (measured at 1440) — so a literally
   continuous handoff needs a fixed-position element flown to the pinned
   card's measured rect, re-measured on resize. This carries the seam on
   IDENTITY OF FORM instead: the same header row, the same rail, the same
   waveform in the same well, arriving in the same shape. It survives
   resize, back-scroll and touch, and it costs two transforms. */

export default function VoicesSection() {
  return (
    <section className="dr-voices" aria-labelledby="dr-voices-h">
      <div className="wrap">
        {/* CENTRED, where §04's header is a left/right band — the one
            centre-stage beat in the back half, and the room's second
            overall (§02's statement is the other). The kicker speaks the
            room's standard vocabulary; the line beneath it is the single
            exception, and the comment on it says why. */}
        <header className="dr-voices-head">
          <span className="t-label dr-voices-kicker" data-wipe>
            In their words
          </span>
          {/* THE ONE EXCEPTION to law 11's single triggered vocabulary —
              and now it is not triggered at all, which is a better answer
              to the same law: the kicker above still wipes, and the title
              is SCRUBBED, so the room has one triggered gesture and this
              is simply not one of them.

              It arrives the way Apple lands a title card (design-dna,
              apple-kinetic-type) — out of focus, a little small, and
              below where it belongs — but tied to the scroll rather than
              to a clock: blur 10→0, scale .96→1, up 64px, all pure
              f(scroll), so it runs backwards exactly and lands mid-window
              already correct.

              TWO SPANS, because the copy is two sentences and they arrive
              as two beats: the second's ramp is offset along the SAME
              --in, so the stagger is a function of scroll position rather
              than of milliseconds. The split is authored, not measured off
              rendered lines, so it survives every reflow.

              With no JS, --in defaults to 1 and the line is simply whole
              and sharp. */}
          {/* TWO WINDOWS, TWO BOXES. The engine keeps one track per
              element, so an effect with two ends needs two elements —
              this wrapper carries the ARRIVAL and the h2 inside it
              carries the DEPARTURE. The wrapper hugs the title (no
              padding, no min-height), so both are measured on the same
              rect and both mean what they say. Measuring the <header>
              instead was the earlier bug: its min-height makes it 702px
              tall, and the title was already 37% faded while centred.

              The arrival is SCRUBBED now, not a one-shot (Jake,
              2026-09-07: "i want the title to come up like move up come
              in to view"). It rises with the scroll instead of playing a
              fixed animation at a threshold — so the title is lifted INTO
              place by the same gesture that carries it away, and the two
              ends are made of the same stuff. */}
          <div
            className="dr-voices-lead-w"
            data-sp
            data-sp-from="1"
            data-sp-to="0.45"
            data-sp-var="--in"
            data-sp-lerp="0.1"
          >
          <h2
            className="dr-voices-lead"
            id="dr-voices-h"
            data-sp
            data-sp-from="0.24"
            data-sp-to="-0.35"
            data-sp-var="--out"
            data-sp-lerp="0.1"
          >
            <span style={{ "--l": 0 } as React.CSSProperties}>
              They didn&rsquo;t want a website.
            </span>{" "}
            <span style={{ "--l": 1 } as React.CSSProperties}>
              They wanted the phone to ring.
            </span>
          </h2>
          </div>
        </header>

        <ul className="dr-voices-list">
          {QUOTES.map((q, i) => {
            /* THE LAST ONE HANDS OVER. See the block comment below the
               list and the stylesheet's .dr-voice--hand. */
            const isLast = i === QUOTES.length - 1;
            return (
            /* EACH QUOTE OWNS ITS OWN LIGHT. It declares the window of its
               whole pass across the screen and the engine writes --sp;
               the stylesheet folds that into a peak at the middle of the
               pass (--lit, see the stylesheet), so a quote is brightest
               while it is the thing you are reading and recedes on the way
               in and on the way out.

               It is §02's lens, said in the vocabulary the engine already
               has — the room's through-line, so the back half is
               recognisably the same page as the front. One value, nothing
               triggered, and it scrubs backwards exactly. */
            <li
              key={q.text}
              className={isLast ? "dr-voice dr-voice--hand" : "dr-voice"}
              style={{ "--i": i } as React.CSSProperties}
              data-sp
              data-sp-from="1"
              data-sp-to="0"
              data-sp-lerp="0.1"
            >
              <figure className="dr-voice-card">
                <blockquote>
                  <p>{q.text}</p>
                </blockquote>
                {/* the second of the card's three beats — a rule that
                    opens from its centre as the quote reaches the reading
                    line, and closes again as it leaves. Geometry and the
                    value it rides both live in the stylesheet. */}
                <i className="dr-voice-rule" aria-hidden />
                {/* role and sector only, until real names land — see the
                    warning at the top of this file */}
                <figcaption>
                  <span>{q.name}</span>
                </figcaption>

                {/* THE HANDOFF FACE. It is the FIRST STEP CARD's face,
                    built from the same STEPS entry and the same demo
                    component §04 renders — imported, not copied, because
                    two hand-kept copies of "01 · Day 1 · the waveform"
                    would drift the first time either is edited and the
                    whole point of this seam is that the two are the same
                    object.

                    It lives in the space the card's surface opens up
                    below the quote (see .dr-voice--hand in the
                    stylesheet), and it is aria-hidden: §04 says all of
                    this again, properly, a screen later — to a screen
                    reader this is a decorative preview of a heading that
                    is about to arrive, not a second copy of it. */}
                {isLast && (
                  <span className="dr-voice-hand" aria-hidden>
                    <span className="dr-run-top">
                      <span className="dr-run-n">{STEPS[0].n}</span>
                      <span className="t-label dr-run-meta">
                        {STEPS[0].meta}
                      </span>
                    </span>
                    <i className="dr-run-rail" />
                    <span className="dr-run-well">
                      <DemoCall />
                    </span>
                    {/* the whole face, not a stub of one: a step card is
                        a title and a sentence under its artifact, and
                        without them the conversion lands on something
                        that is recognisably not what §04 opens with */}
                    <span className="dr-voice-hand-h">{STEPS[0].title}</span>
                    <span className="dr-voice-hand-p">{STEPS[0].copy}</span>
                  </span>
                )}
              </figure>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
