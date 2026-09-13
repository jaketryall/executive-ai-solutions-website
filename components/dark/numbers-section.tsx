"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Odometer } from "@/components/estimator/odometer";
import { RECEIPTS, RECEIPTS_AS_OF } from "@/lib/proof";

/* THE RECEIPTS — the band under the reel.

   acquisition.com puts four numbers under its hero in a white row: a big
   figure, a small caps label, hairlines between. Jake, 2026-09-13: "i
   want to have a similar idea just look significantly better." What
   makes theirs a row of boasts is that nothing under the number says WHEN
   or WHERE it was true. So:

   · every figure carries a WINDOW ("since launch") and a SOURCE that is a
     link to the page that proves it — the number touches the thing it
     validates (uxpeak: trust adjacent, recognition over recall);
   · the figures ROLL IN, mechanically, the moment the band is in the
     reading zone — the estimator's own odometer, one arrival per section
     (apple-grammar: media starting counts as the beat) — and rest;
   · separated by space, never by hairlines (the room's law), the numeral
     on the room's display face, the value outranking its label
     (apple-grammar: scale-jump stat blocks);
   · an "as of" line, because a number with a date is a report.

   The values come from lib/proof.ts and are the site's own — every one is
   already stated on a case page or the pricing page. Nothing here is new. */

export default function NumbersSection() {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* fire once, when the band's top has cleared the bottom 15% of the
       screen — a roll that finishes before the eye arrives is invisible */
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="dr-numbers" aria-labelledby="dr-numbers-h" ref={ref}>
      <div className="wrap">
        <div className="dr-numbers-head">
          <h2 className="t-label dr-numbers-kicker" id="dr-numbers-h" data-wipe>
            By the numbers
          </h2>
          <p className="t-meta dr-numbers-asof">As of {RECEIPTS_AS_OF}</p>
        </div>
        <ul className="dr-receipts">
          {RECEIPTS.map((r) => (
            <li className="dr-receipt" key={r.label}>
              {/* the figure: a reader gets the finished number, the eye
                  gets the roll */}
              <p className="dr-receipt-n">
                <span className="sr-only">
                  {r.prefix}{r.value.toLocaleString()}{r.suffix}
                </span>
                <span aria-hidden className="dr-receipt-fig">
                  {r.prefix && <span className="dr-receipt-fix">{r.prefix}</span>}
                  <Odometer value={live ? r.value : 0} />
                  {r.suffix && (
                    <span
                      className={`dr-receipt-fix${r.suffix.startsWith(" ") ? " dr-receipt-fix--word" : ""}`}
                    >
                      {r.suffix.trim()}
                    </span>
                  )}
                </span>
              </p>
              <p className="dr-receipt-l t-body">{r.label}</p>
              <p className="dr-receipt-s t-meta">
                <span>{r.window}</span>
                <span aria-hidden> · </span>
                <Link href={r.href}>{r.source}</Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
