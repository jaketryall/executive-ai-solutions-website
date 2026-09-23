import Image from "next/image";
import Link from "next/link";

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
    sizes: "(max-width: 900px) 92vw, 880px",
  },
  {
    word: "Automation",
    sub: "Every enquiry answered, and booked.",
    href: "/services/ai",
    src: "/services/follow-up.jpg",
    sizes: "(max-width: 900px) 92vw, 440px",
  },
  {
    word: "Ads",
    sub: "The first result when they search.",
    href: "/services/google-ads",
    src: "/services/ad.jpg",
    sizes: "(max-width: 900px) 92vw, 440px",
  },
];

export default function OfferShow() {
  return (
    <section className="wrap dr-show" aria-label="What we make">
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
