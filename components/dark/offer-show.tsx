"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Roll } from "@/components/room/nav";
import { SERVICES } from "@/lib/services";

/* `?v=price` (2026-09-23, layout review #5 — Jake: "whatever you think do
   it all ill look after"): the page never said what anything costs, and
   cost is the buyer's first question (the FAQ's first card, the Ask
   chat's first suggestion). Each service card's line becomes its price —
   the SAME words the service pages already print (lib/services.ts
   heroPrice), so nothing here is a new promise. */
const PRICE: Record<string, string> = Object.fromEntries(
  SERVICES.map((s) => [`/services/${s.slug}`, s.heroPrice])
);

/* §02 · SAY IT, THEN SHOW IT (trial `?v=show`, 2026-09-22 — Jake: "i
   need to find a way to make it beatiful and visual").

   The poster above names three things — Websites, Automation, Ads — and
   until now nothing on the page showed any of them; the next beat was
   more words. These are the three photographs that already exist for
   exactly those three words (service-shots.tsx has how they were made:
   the site's own screens, in real hardware, every word on them real),
   one client end to end: Desert Wings' site on a laptop and a phone,
   the reply that booked a Saturday flight, the search they won.

   NOT the services section that was cut (2026-09-20, "services section
   has to go"): no prices, no deliverable lists, no rows — a word and a
   picture each, the poster's own words as the captions, so the two
   beats read as one statement and its evidence. Websites is the big
   one because websites lead the pitch (positioning, lib/services.ts).

   MOTION: one derived settle per well — the picture arrives 8% large
   and comes to rest as its well rises from the fold to a third of the
   screen (--pp, the engine, chased at .1), then it is still. Scale
   rather than the work's vertical parallax: that needs a 26% surplus
   of height, and cover-cropping a 4:3 laptop into an over-tall box
   eats the laptop's sides. */
const ITEMS = [
  {
    word: "Websites",
    sub: "Designed, built and hosted. Yours the day it ships.",
    href: "/services/websites",
    src: "/services/websites.jpg",
    /* the desktop home at its own 16:10 — the tall tour cropped a half
       card row into the well's bottom (first cut) */
    use: "/work/live/dw-hero.jpg",
    sizes: "(max-width: 900px) 92vw, 880px",
  },
  {
    word: "Automation",
    sub: "Every enquiry answered, and booked.",
    href: "/services/ai",
    src: "/services/follow-up.jpg",
    use: "/work/live/dw-mobile-booking.jpg",
    sizes: "(max-width: 900px) 92vw, 440px",
  },
  {
    word: "Ads",
    sub: "The first result when they search.",
    href: "/services/google-ads",
    src: "/services/ad.jpg",
    use: "/work/live/dw-mobile-hero.jpg",
    sizes: "(max-width: 900px) 92vw, 440px",
  },
];

/* `inUse` (`?v=inuse`, step 5 of design-dna/lando-ground-plan.md —
   Jake: "yea show me step 5"): THE ONE BIG HOVER. Lando's helmet cards,
   measured: the studio photograph is replaced by the same helmet in
   action, wiping up from the card's bottom edge, the card's outline
   lighting at the same moment — declared 0.75s cubic-bezier(.65,.05,0,1),
   ~90% there by 300ms because that curve front-loads. Ours: the photo of
   the device gives way to the real screen itself, flat — the site, the
   advisor page a text leads to, the page the ad lands on. Evidence stays
   still until someone asks (decision 10: a moving picture beside words
   steals the glance; a hover is asking).

   A TRANSFORM SLIT, not a clip-path: the outer box rises from 101% below
   while the inner box counter-moves by the same amount, so the picture
   stands still and only its edge travels — nothing re-rasterises per
   frame (decision 14: a clip-path'd layer inside a moving card
   flickered in Chrome). Armed only once its picture has DECODED, so the
   first hover never wipes up an empty box; pointer:fine only (room.css). */
/* `one` (`?v=one`, 2026-09-23 — Jake: "maybe the services isnt bad, maybe
   its just the effects … i kinda want users to see everything one at a
   time, i dont want them to have to decide where to look"): the bento
   shows three pictures at once, so the eye has to choose. Under `one`
   the three become the SAME sticky stack as the work (`?v=stack`,
   work-stack.tsx — Cosmos's, measured): one service per screen, the next
   dealt over the last, the card settling 1.1 → 1 and the picture 1.2 → 1
   as it lands, the pill carrying the poster's word and its one line.
   Services and proof then move the same way — one system, not two. */
export default function OfferShow({
  inUse = false,
  one = false,
  price = false,
}: {
  inUse?: boolean;
  one?: boolean;
  price?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!inUse) return;
    const imgs = ref.current?.querySelectorAll<HTMLImageElement>(".dr-show-use img");
    imgs?.forEach((img) => {
      const arm = () => img.closest(".dr-show-well")?.setAttribute("data-armed", "");
      img
        .decode()
        .then(arm)
        .catch(() => img.addEventListener("load", arm, { once: true }));
    });
  }, [inUse]);
  if (one)
    return (
      <section className="dr-show dr-show--one" aria-label="What we make" ref={ref}>
        <ol className="dr-stack">
          {ITEMS.map((it) => (
            <li
              className="dr-stack-item"
              key={it.word}
              data-sp
              data-sp-edge="top"
              data-sp-from="1"
              data-sp-to="0"
              data-sp-var="--st"
              data-sp-lerp="0.37"
            >
              {/* the departure's own clock (`?v=flow`): the wrap's top from
                  where it sits centred (.12 of the screen) to mostly gone */}
              <div
                className="dr-stack-wrap"
                data-sp
                data-sp-edge="top"
                data-sp-from="0.12"
                data-sp-to="-0.55"
                data-sp-var="--lv"
              >
                <Link href={it.href} className="dr-stack-card dr-show-link" aria-label={`${it.word} — ${it.sub}`}>
                  {/* NO HOVER on these cards (2026-09-23 — Jake: "since a lot
                      of people leave their cursor in the middle of their
                      screen while scrolling they may trigger an effect they
                      dont mean to"): the `inuse` wipe is not rendered here
                      whatever the token says, and the label does not roll */}
                  <span className="dr-stack-well dr-show-well">
                    <Image src={it.src} alt="" fill sizes="(max-width: 900px) 92vw, 1180px" className="dr-stack-img" />
                  </span>
                  <span className="dr-stack-pill dr-stack-pill--svc" aria-hidden>
                    <span className="dr-stack-word">{it.word}</span>
                    <i className="dr-stack-sep" />
                    {price && PRICE[it.href] ? (
                      <span className="dr-stack-line dr-stack-line--price">{PRICE[it.href]}</span>
                    ) : (
                      <span className="dr-stack-line">{it.sub}</span>
                    )}
                    <i className="dr-stack-sep" />
                    <span className="dr-stack-see">
                      <Roll label="See the service" />
                    </span>
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  return (
    <section className="wrap dr-show" aria-label="What we make" ref={ref}>
      <ul className="dr-show-grid">
        {ITEMS.map((it, i) => (
          <li className={`dr-show-card${i === 0 ? " dr-show-card--big" : ""}`} key={it.word}>
            <Link href={it.href} className="dr-show-link">
              <span
                className="dr-show-well"
                data-sp
                data-sp-edge="top"
                data-sp-from="1"
                data-sp-to="0.35"
                data-sp-var="--pp"
                data-sp-lerp="0.1"
              >
                <Image src={it.src} alt="" fill sizes={it.sizes} className="dr-show-img" />
                {inUse && (
                  <span className="dr-show-use" aria-hidden>
                    <span className="dr-show-use-in">
                      <Image
                        src={it.use}
                        alt=""
                        fill
                        sizes={it.sizes}
                        loading="eager"
                        className="dr-show-use-img"
                        /* the desktop capture's headline starts at its left edge, so
                           the wider-than-the-well picture anchors LEFT (first cut
                           centred it and cut "WHERE" to "HERE") */
                        style={i === 0 ? { objectPosition: "0% 0%" } : undefined}
                      />
                    </span>
                  </span>
                )}
              </span>
              <span className="dr-show-cap">
                <b>{it.word}</b>
                {/* the arrow is glued to the sub's last word — a no-break
                    space is not enough, Chrome still breaks before an
                    inline-block — so a narrow card never leaves it alone */}
                <span className="dr-show-sub">
                  {it.sub.slice(0, it.sub.lastIndexOf(" ") + 1)}
                  <span className="dr-show-last">
                    {it.sub.slice(it.sub.lastIndexOf(" ") + 1)}
                    <i aria-hidden>→</i>
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
