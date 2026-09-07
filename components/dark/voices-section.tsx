import { QUOTES } from "@/lib/quotes";

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

   NOT A GRID — and this is the whole point of the section (Jake,
   2026-09-07, on the first cut: "it might just be the three cards being
   repeated again too, back to back essentially"). §03 immediately above
   is three cards in a row. Three cards in a row again here read as the
   same section twice, and no amount of drift or ground colour fixes a
   repeated SHAPE. So the axis turns: one centred column, the quotes at
   display scale as statements rather than cards, arriving one under the
   other. Horizontal row, then vertical column — the page changes gear
   instead of clearing its throat.

   BUILT FOR FEW. Three quotes as three cards look like a grid missing its
   fourth. Three quotes as three full-width statements look deliberate,
   and a fourth simply makes the column longer. */

export default function VoicesSection() {
  return (
    <section className="dr-voices" aria-labelledby="dr-voices-h">
      <div className="wrap">
        {/* CENTRED, where §04's header is a left/right band — the one
            centre-stage beat in the back half, and the room's second
            overall (§02's statement is the other). The kicker speaks the
            room's standard vocabulary; the line beneath it is the single
            exception, and the comment on it says why. */}
        {/* THE HEADER DECLARES ITS OWN LEAVING. The entrance is a
            one-shot (the focus pull on the spans below); this is the
            other end of it — a scrubbed window measured off the header's
            top as it climbs out, writing --out, which the stylesheet
            turns back into blur, lift and fade. Two mechanisms on one
            element on purpose: an arrival should happen once and be
            over, a departure should track the scroll, because you can
            scroll back up into it. */}
        <header
          className="dr-voices-head"
          data-sp
          data-sp-from="0.34"
          data-sp-to="-0.28"
          data-sp-var="--out"
          data-sp-lerp="0.1"
        >
          <span className="t-label dr-voices-kicker" data-wipe>
            In their words
          </span>
          {/* THE ONE EXCEPTION to law 11's single triggered vocabulary,
              and it is deliberate (Jake, 2026-09-07: "the centered text
              title needs a cool entrance"). Everything else in this room
              wipes — including the kicker directly above, so the room's
              own language is still being spoken here. This ONE line does
              not, because it is the page's only centre-stage peak, and
              the skill's rule for a signature is restraint everywhere
              except one place.

              It arrives the way Apple lands a title card, measured rather
              than invented (design-dna, apple-kinetic-type): out of focus
              and slightly too large, then resolving — blur 12→0, scale
              1.05→1, up 18px, 850ms on the room's structure curve. It
              reads as the sentence coming INTO focus, which is what a
              claim should do.

              TWO SPANS, because the copy is two sentences and they land as
              two beats 220ms apart: the first takes the website away, the
              second says what they actually wanted. The split is authored,
              not measured off rendered lines, so it survives every reflow.

              Rest state is FINISHED (the room's law for one-shots): with
              no JS the line is simply whole and sharp, and `is-in` only
              ever replays the journey to a frame that is already right. */}
          <h2 className="dr-voices-lead" id="dr-voices-h" data-once data-once-at="0.86">
            <span style={{ "--l": 0 } as React.CSSProperties}>
              They didn&rsquo;t want a website.
            </span>{" "}
            <span style={{ "--l": 1 } as React.CSSProperties}>
              They wanted the phone to ring.
            </span>
          </h2>
        </header>

        <ul className="dr-voices-list">
          {QUOTES.map((q, i) => (
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
              className="dr-voice"
              style={{ "--i": i } as React.CSSProperties}
              data-sp
              data-sp-from="1"
              data-sp-to="0"
              data-sp-lerp="0.1"
            >
              <figure>
                <blockquote>
                  <p>{q.text}</p>
                </blockquote>
                {/* role and sector only, until real names land — see the
                    warning at the top of this file */}
                <figcaption>
                  <span>{q.name}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
