import React from "react";
import Image from "next/image";

/* WHO BUILDS IT — the split about beat, after §02 and before the proof.

   THE SHAPE is itsjay's about section, decoded live 2026-09-08: a 12-column
   grid with the copy on the LEFT at col-span-7 and the media on the RIGHT at
   col-span-5, one big display paragraph rather than a stack of small ones.

   ⚠ ONE DELIBERATE DEPARTURE. His media is not parallaxed — it is
   `position: sticky`, holding while the tall text column scrolls past it.
   Jake asked for parallax, so the well here runs §03's own measured rate
   instead (itsjay's, decoded 2026-09-06 off his work cards) rather than a
   second, invented one. Same site, one parallax rate.

   THE TEXT EFFECT IS NOT HIS (Jake, 2026-09-08: "i dont want to copy his
   exact effects, especially the text one but i do want one"). His words slide
   in horizontally on four lanes; ours resolve in INK as they cross the
   reading line, which is the grammar this site already speaks — §02's rows
   and the voices quotes both resolve against a moving light. A fourth,
   unrelated device would make the page less coherent, not more; this is the
   same idea at a new granularity, and the one detail that is ours alone is
   the OVERSHOOT: the word currently resolving goes briefly brighter than its
   settled state, so a soft bright edge travels through the paragraph and
   leaves finished text behind it.

   ⚠ THE IMAGE IS A PLACEHOLDER. There is no photograph in `public/` that
   belongs in an about section — every asset is a client work screenshot, and
   using one here would say "here is our work" in the middle of a beat about
   who does it, one section before §03 says exactly that with better pictures.
   This needs a real photograph (the desk, the room, the person) before it
   ships. */

/* THE SHORT VERSION, AND THE REST (Jake, 2026-09-14: "i dont think people
   will read if its not readable under 3 seconds … we need to have like a
   short sweet version and maybe a little paragraph under that says more").
   The display line is the one claim, seven words — glanced, not read —
   and it answers the kicker directly. The paragraph under it, at body
   size, is the same claim with its consequences for whoever wants them.
   The first draft ran 47 words at display size; the second 27; this is
   7 + 28 at two sizes, which is the reading the section asks for. */
const COPY = "Built by the person who quoted it.";
const MORE =
  "No account managers, no handoffs. The one who quotes the job builds it and launches it — which is why the price is fixed and the date holds.";

/* THE TERMS. Jake: "i'm feeling a marquee under about text."

   A marquee that says nothing is decoration, and this paragraph makes a
   PROMISE — "the price is fixed and the date holds" — so the band under
   it carries the terms that back the promise rather than a restatement of
   it or a row of logos. Every line here is already stated elsewhere on
   the page in the same words (§02's rows carry "From $2.5k · fixed quote
   in 2 days" and "Quoted per project · no retainer"); nothing is invented
   for the band, which is the only reason a claim belongs in a thing that
   repeats forever.

   FIVE, and odd on purpose: with an even count the two halves of the
   track line up and the loop reads as a loop. */
const TERMS = [
  "Fixed quote in two days",
  "No retainers",
  "One builder, start to finish",
  "Sites from $2,500",
  "The date holds",
];

export default function AboutSection() {
  const words = COPY.split(" ");
  return (
    <section className="dr-about" aria-labelledby="dr-about-h">
      <div className="wrap dr-about-grid">
        <div className="dr-about-text">
          {/* the room's one triggered gesture (law 11) — everything else in
              this section is scrubbed */}
          <h2 className="t-label dr-about-kicker" id="dr-about-h" data-wipe>
            Who builds it
          </h2>

          {/* ONE WINDOW FOR THE WHOLE PARAGRAPH. --rp runs 0 as the copy
              enters at .95vh to 1 by .15vh, and each word takes its own slice
              of it off its index — so the resolve rakes down the paragraph
              without anything measuring where the lines actually broke. Index
              stands in for vertical position almost exactly in a single block
              of copy, and it costs nothing: a line-based stagger would have to
              be recomputed on every reflow, and this survives one for free. */}
          <p
            className="dr-about-lead"
            style={{ "--n": words.length } as React.CSSProperties}
            data-sp
            /* THE WINDOW SITS IN THE READING ZONE. At .95 → .15 the resolve
               was measured complete by the time the paragraph's top reached
               .55vh — the whole effect happened while the copy was still in
               the bottom half of the screen, and by the time you could read
               it every word was already at full ink. Which is to say it ran
               perfectly and was invisible. It now starts as the paragraph
               enters at .85 and is still resolving as its top approaches the
               top of the screen. */
            data-sp-from="0.85"
            data-sp-to="0.05"
            data-sp-var="--rp"
            data-sp-lerp="0.1"
            /* NO data-sp-step here, and that is a measured decision rather
               than an omission: quantising at 1/64 was tried and moved the
               frame time 10.8ms → 11.0, i.e. nothing. The flip needed it
               because twelve color-mix tokens were re-rasterising the whole
               document; once these words were on opacity instead of colour
               the paint was already cheap, and stepping only costs smoothness
               for no return. */
          >
            {/* the space is rendered as its own expression, NOT left as
                whitespace between the spans — React strips JSX whitespace
                inside a map, and with inline-block words that silently ran
                the whole paragraph together into one string. */}
            {words.map((w, i) => (
              <React.Fragment key={i}>
                <span style={{ "--i": i } as React.CSSProperties}>{w}</span>
                {i < words.length - 1 ? " " : null}
              </React.Fragment>
            ))}
          </p>
          {/* the rest, for whoever wants it: body size, one short measure */}
          <p className="dr-about-more t-body">{MORE}</p>
        </div>

        {/* THE WELL declares its own window; the engine writes --pp and the
            stylesheet does the rest. No chase — the picture covers only the
            visible part of the well, and a 0.1 lerp trails the target by more
            than the spare it has (the note on §03's well). */}
        <div className="dr-about-media">
          <span
            className="dr-about-well"
            data-sp
            data-sp-from="1"
            data-sp-to="-0.36"
            data-sp-var="--pp"
          >
            <Image
              src="/work/eas-hero.png"
              alt=""
              width={3200}
              height={2000}
              sizes="(max-width: 900px) 92vw, 40vw"
            />
          </span>
        </div>
      </div>

      {/* ⚠ TWO COPIES OF THE TRACK, and the second is aria-hidden. The
          animation translates -50%, so the seam only disappears if the
          second half is identical to the first — but a screen reader
          would otherwise read the terms twice, and a keyboard user would
          tab through them twice. The duplicate is decoration; the first
          copy is the content. */}
      <div className="dr-marq" aria-label="Terms">
        <div className="dr-marq-track">
          <ul className="dr-marq-set">
            {TERMS.map((t) => (
              <li key={t}>{t}<i aria-hidden /></li>
            ))}
          </ul>
          <ul className="dr-marq-set" aria-hidden>
            {TERMS.map((t) => (
              <li key={t}>{t}<i /></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
