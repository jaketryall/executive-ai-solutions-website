"use client";

import { Fragment } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { QUOTES } from "@/lib/quotes";
import { PersonIcon } from "@/components/ui/person-icon";
import { SHOTS } from "@/components/dark/service-shots";

/* §02 · THE OFFER — the statement, and the three things under it.

   Jake, 2026-09-14, with danielsnows.framer.website (a centred caps
   headline, a grey line under it, 01—02—03, three columns): "what do
   you think about doing a centered approach thing like this and then
   just having services underneath compared to what we have now" → "go".

   What it replaces: a split statement with a placeholder photograph,
   then a dark card two thousand pixels tall with the three services
   STACKED, one lit at a time as it crossed the reading line (the lens,
   the ride, the phone trays — 2026-09-06). Three viewports of scrolling
   to learn there are three services. This puts the claim and the three
   things in ONE view: the statement's nouns are the columns — websites,
   automation, ads — so the line sets them up and the columns pay them
   off, and 01→02→03 reads as the customer's own path.

   What is kept from the reference: the shape. What is not: the glass
   icons — the columns carry the still photographs of the real screens
   in real hardware (service-shots.tsx), because you see what you buy;
   and the headline is in the HERO's register, condensed caps, so it
   echoes "DESIGN THAT SELLS" rather than introducing a third voice.

   THE HEAD IS OUTSIDE THE CARD, on purpose: the card's climb (--climb,
   page.tsx) is measured on the wrapper's top, which has to stay the
   card's own top — with the statement inside, the card would have been
   full-grown while it was still 350px below the fold.

   Everything is visible at rest — name, one line, and the PRICE. Nothing
   about a service sits behind a hover or a click, because the thing a
   visitor most wants to know is the thing most sites make you dig for. */

/* ⚠ IT NAMES THE LIST, SO IT MOVES WITH THE LIST. The order is
   positioning (lib/services.ts: websites → automation → ads), and the
   statement walks the reader through the columns in that order. */
export const OFFER_SAY = "Websites, automation and ads for owner-run businesses.";
/* the paragraph is where the DECISION happens (2026-09-18): the three
   promises the visitor is actually weighing, said once, plainly, in the
   order they ask them — how fast, how much, when. 27 words. */
export const OFFER_MORE =
  "Built by the person you talk to. No account managers, no handoffs. A fixed quote in two days, a price that never moves, a date that holds.";

/* THE HEAD: rendered by page.tsx before the card's wrapper — see above */
export function OfferHead() {
  return (
    <div className="wrap dr-offer-head">
      {/* THE CURTAIN (2026-09-19) dropped data-wipe from both lines —
          the room's one triggered gesture stands everywhere else. Two
          reasons, not one: (1) a wipe fires when an element's top nears
          the fold, which the sticky pin does almost immediately, well
          before the film has actually left — a wipe under a curtain
          fires unseen. (2) tried anyway, keeping data-wipe and
          neutralising the CSS on desktop only (room.css): the engine's
          own splitLines()/undo() cycle measurably did not survive being
          inside the new sticky pin — it split correctly on mount, then
          silently reverted to plain text ~300ms later, on BOTH desktop
          and phone (a real interaction with the new wrapper, not a CSS
          issue — confirmed live, the same split logic run by hand on
          the same node persisted fine). Rather than ship a page that
          depends on that timing, the attribute is off entirely; THE
          SETTLE (room.css, --cur-driven scale) is the only reveal here,
          on every width. */}
      <span className="t-label dr-offer-kicker">What this is</span>
      <h2 className="dr-offer-say" id="dr-svc-h">
        {OFFER_SAY}
      </h2>
      <p className="dr-offer-more">{OFFER_MORE}</p>
    </div>
  );
}

export default function ServicesSection() {
  /* the exit ramp: 0 when this section's bottom meets the fold, 1 when
     that bottom reaches the top. Measured from the section's own box,
     which never moves — the card inside it is what fades. */
  return (
    <section
      className="dr-svc"
      aria-labelledby="dr-svc-h"
      data-sp
      data-sp-edge="bottom"
      data-sp-from="1"
      data-sp-to="0"
      data-sp-var="--ep"
    >
      {/* the card DECLARES its arrival window; the engine writes --ap and
          the blocks inside read it at their own rates (the lag hierarchy,
          room.css). The exit rides this, never .dr-svc itself — a
          transformed element cannot be its own ruler. */}
      <div
        className="dr-svc-in"
        data-sp
        data-sp-from="1"
        data-sp-to="0.35"
        data-sp-var="--ap"
        data-sp-lerp="0.1"
      >
        <div className="wrap">
          {/* THE PATH: 01 — 02 — 03, one numeral over each column, joined.
              Decoration to a screen reader — the columns carry their
              own numerals in their names. */}
          <ol className="dr-offer-steps" aria-hidden>
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <span>{s.stageIndex}</span>
              </li>
            ))}
          </ol>

          <ul className="dr-offer-grid">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="dr-offer-col">
                  {/* THE SHOT. What this stage looks like in a customer's
                      hand, photographed rather than drawn — still of its
                      own accord. A service without a shot renders without
                      a well; the picture is evidence, and evidence is
                      allowed to be missing. */}
                  {SHOTS[s.slug] && (
                    <span className="dr-offer-well" aria-hidden>
                      {SHOTS[s.slug]}
                    </span>
                  )}
                  <span className="t-label dr-offer-stage">
                    <span className="dr-offer-num">{s.stageIndex}</span>
                    {s.stage}
                  </span>
                  {/* the two lines as AUTHORED: all three titles are two
                      lines, so the three columns stay level whatever the
                      words — joined, the third ran to two lines on its
                      own and the prices under them fell out of line */}
                  <span className="dr-offer-title">
                    {s.title.map((line, i) => (
                      <Fragment key={i}>
                        {i > 0 && <br />}
                        {line}
                      </Fragment>
                    ))}
                  </span>
                  <span className="dr-offer-what">{s.label}</span>
                  <span className="dr-offer-price">{s.heroPrice}</span>
                  {/* SEE WHAT'S IN IT (2026-09-19, Jake: "the services one
                      thing is too short"): the first three deliverables,
                      verbatim from lib/services.ts — not a summary, the
                      actual list the service page itself leads with. */}
                  <ul className="dr-offer-inside">
                    {s.deliverables.slice(0, 3).map((d) => (
                      <li key={d.name} className="t-label">
                        {d.name}
                      </li>
                    ))}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>

          {/* Role-and-sector attribution with the repo's placeholder glyph,
              not a name and a face: lib/quotes.ts carries no real person and
              no exact business, so a photo would invent a customer. The slot
              is shaped for the real thing. */}
          <figure className="dr-vouch dr-offer-vouch">
            <span className="dr-vouch-av" aria-hidden>
              <PersonIcon />
            </span>
            <span className="dr-vouch-body">
              <blockquote>{QUOTES[2].text}</blockquote>
              <figcaption>{QUOTES[2].name}</figcaption>
            </span>
          </figure>
        </div>
      </div>
    </section>
  );
}
