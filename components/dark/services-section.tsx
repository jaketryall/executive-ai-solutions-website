"use client";

import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { QUOTES } from "@/lib/quotes";
import { PersonIcon } from "@/components/ui/person-icon";
import { SHOTS } from "@/components/dark/service-shots";
import { useEffect, useRef } from "react";
import SayCorners from "@/components/dark/say-corners";

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

   SUPERSEDED 2026-09-19 · THE LEDGER (decisions.md has the full record).
   Jake, on the void: "still not really feeling services section." The
   three columns were nine small things in a grid between two big
   cinematic beats — a pricing-table archetype, and the void made it
   plainer. x2ycreative.com, measured live: six services, ONE PER ROW —
   a condensed title left, one grey paragraph, one big square shot
   right, hairlines, no cards. The markup below is now
   `<ol className="dr-ledger">`, one `<li>` per service; the numeral
   that used to head its own `.dr-offer-steps` row now opens each row's
   own kicker line. Same data (stage, title, label, price, the three
   deliverables, the shot) — a row, not a column.

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
export const OFFER_PREFIX = "Websites, automation and ads for ";
/* §02a (2026-09-20): the statement as THREE centred lines — the prefix
   broken once, the rotating word alone on the third — each line its own
   mask for leoparpeix's rise (OfferHead). OFFER_SAY above is unchanged:
   the one true sentence, for SEO and readers. */
/* one word a line (Jake, 2026-09-20: "I think maybe one word per line"
   — leoparpeix's FRENCH / INTERACTIVE / DESIGNER): the three services
   as three lines, "Ads for" carrying the audience onto the fourth, the
   rotating word alone there so the widest phrase still sets the size */
export const OFFER_LINES = ["Websites", "Automation", "Ads for"];
/* THE ROTATING WORD (2026-09-19, decisions.md · Huge's, decodes/hugeinc.md
   §4: the statement's last word rotates on a timer, seven words, all
   pre-rendered). Ours cycles six real audiences — the three case
   studies' own sectors (lib/work.ts: Desert Wings' Aviation, Riled Up's
   Coaching, AAHG's Nonprofit) plus two more owner-run categories — the
   same ad-audience personalisation the estimator already targets, made
   visible in the room's own claim. Index 0 is the default AND the
   SERVER-RENDERED one: it is what SEO and a no-motion visitor both read
   as the true sentence; see .dr-offer-rot/.dr-offer-rot-w in room.css
   for the CSS-only (no JS timer) mechanism. */
export const OFFER_ROT_WORDS = [
  "owner-run businesses.",
  "flight schools.",
  "coaches.",
  "clinics.",
  "nonprofits.",
  "contractors.",
];
export const OFFER_SAY = OFFER_PREFIX + OFFER_ROT_WORDS[0];
/* THE STATEMENT IN THE MODEL'S FORM (2026-09-20, decisions.md): Huge's
   own paragraph under its statement is ONE sentence — the three-sentence
   27-word version above (2026-09-18) is gone, per the law (one line at
   display size, at most one sentence under it). */
export const OFFER_MORE =
  "Built by the person you talk to. A fixed quote in two days, a price that never moves, and a site that's yours to run the day it ships.";

/* §02b · THE IN-PAGE NAV (2026-09-20 — Huge's six arrow links beside
   their paragraph, decodes/hugeinc.md §15; Jake: "they like have more
   nav inside which i think is genius"). Four doors, the page's own. */
export const OFFER_NAV: { label: string; href: string }[] = [
  { label: "See the work", href: "/work" },
  { label: "What we build", href: "/services/websites" },
  { label: "See your price", href: "/pricing#estimate" },
  { label: "Book the call", href: "/contact" },
];

/* §02b · THE PARAGRAPH AND THE NAV — Huge's second beat (decodes/hugeinc
   §15): one paragraph at 57 on the left, the in-page nav on the right,
   both arriving with the room's one triggered gesture (data-wipe, the
   engine's line wipe, staggered by data-wipe-delay) — theirs is a
   staggered entrance too, measured, not a scrub. */
export function OfferMore() {
  return (
    <section className="wrap dr-more" aria-label="What you get">
      <p className="dr-more-p" data-wipe>
        {OFFER_MORE}
      </p>
      <nav className="dr-more-nav" aria-label="On this site">
        {OFFER_NAV.map((n, i) => (
          <Link
            key={n.href}
            href={n.href}
            className="dr-more-link"
            data-wipe
            data-wipe-delay={String(250 + i * 110)}
          >
            {n.label} <i aria-hidden>→</i>
          </Link>
        ))}
      </nav>
    </section>
  );
}

/* THE HEAD: rendered by page.tsx before the card's wrapper — see above */
export function OfferHead() {
  /* §02a · THE SCREEN (2026-09-20, hero/air — Jake, with leoparpeix's
     FRENCH / INTERACTIVE / DESIGNER: "i really like the entrance
     animation centered big text and the stuff in the top right and left
     corners"). One viewport: the statement centred as three lines at
     138px, the corners (say-corners.tsx) at 14px, nothing else — the
     paragraph (OFFER_MORE) moves to §02b with the in-page nav.

     THE ENTRANCE is theirs exactly (decodes/leoparpeix.md §14): each
     line rests one line below its own mask, shifted +5% / −5% / +5% by
     line, and rises to place over 1s on cubic-bezier(.4,0,0,1) —
     --ease-reveal, the hero's declared exception, now this screen's too
     — 115ms apart, once, when the head's top enters the viewport. The
     corners fade in behind the third line. `data-in` is the trigger;
     the CSS (.dr-say-l / .dr-say-li, room.css) does every frame.
     Reduced motion: the lines are simply there (room.css). */
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-in", "");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.setAttribute("data-in", "");
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="wrap dr-offer-head dr-say-screen" ref={ref}>
      <SayCorners />
      {/* THE ROTATING WORD: index 0 is a plain child alongside the other
          five inside .dr-offer-rot (display: inline-grid, room.css) — all
          six share the one grid cell, so the box's width is always the
          longest word's and the line never reflows as they cycle. Only
          index 0 is exposed to assistive tech: the other five are the
          same "true statement" playing dress-up, not five more facts. */}
      <h2 className="dr-offer-say" id="dr-svc-h">
        {OFFER_LINES.map((line, l) => (
          <span className="dr-say-l" key={line} style={{ "--l": l } as CSSProperties}>
            <span className="dr-say-li">{line}</span>
          </span>
        ))}
        <span className="dr-say-l" style={{ "--l": OFFER_LINES.length } as CSSProperties}>
          <span className="dr-say-li">
            <span className="dr-offer-rot">
              {OFFER_ROT_WORDS.map((word, i) => (
                <span
                  key={word}
                  className="dr-offer-rot-w"
                  aria-hidden={i === 0 ? undefined : true}
                  style={{ "--i": i } as CSSProperties}
                >
                  {word}
                </span>
              ))}
            </span>
          </span>
        </span>
      </h2>
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
          {/* §02 · THE LEDGER (2026-09-19). One `<li>` per service, x2y's
              rhythm — see the file header and decisions.md. */}
          <ol className="dr-ledger">
            {SERVICES.map((s) => (
              <li
                className="dr-ledger-row"
                key={s.slug}
                data-sp
                data-sp-from="1"
                data-sp-to="0.35"
                data-sp-var="--rp"
                data-sp-lerp="0.35"
              >
                <Link
                  href={`/services/${s.slug}`}
                  className="dr-ledger-link"
                  aria-label={`${s.label} — see the service`}
                >
                  <div className="dr-ledger-text">
                    <span className="t-label dr-ledger-stage">
                      <span className="dr-ledger-num">{s.stageIndex}</span>
                      {s.stage}
                    </span>
                    {/* the two lines as AUTHORED, unchanged from the columns */}
                    <h3 className="dr-ledger-title">
                      {s.title.map((line, i) => (
                        <Fragment key={i}>
                          {i > 0 && <br />}
                          {line}
                        </Fragment>
                      ))}
                    </h3>
                    <span className="dr-ledger-what">{s.label}</span>
                    <span className="dr-ledger-price">{s.heroPrice}</span>
                    {/* the three deliverables as ONE SENTENCE — x2y's own
                        grey paragraph, not a bulleted list
                        (`.dr-offer-inside`, retired with the columns) */}
                    <p className="dr-ledger-body">
                      {s.deliverables.slice(0, 3).map((d) => d.name).join(". ")}.
                    </p>
                    <span className="dr-ledger-open">
                      See the service <i aria-hidden>→</i>
                    </span>
                  </div>
                  {/* THE SHOT. What this stage looks like in a customer's
                      hand, photographed rather than drawn — still of its
                      own accord. A service without a shot renders without
                      a well; the picture is evidence, and evidence is
                      allowed to be missing. */}
                  {SHOTS[s.slug] && (
                    <span className="dr-ledger-well" aria-hidden>
                      {SHOTS[s.slug]}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ol>

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
