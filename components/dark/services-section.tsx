"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { QUOTES } from "@/lib/quotes";
import { PersonIcon } from "@/components/ui/person-icon";

/* §02 · THE FUNNEL
   Type-led on purpose: the hero's right column is card-led, and repeating
   that register here would make the two sections read as one long list.

   Everything is visible at rest — name, statement, and the PRICE. Nothing
   about a service sits behind a hover or a click, because the thing a
   visitor most wants to know is the thing most sites make you dig for. */

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".dr-reveal"));
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) rows.forEach((r) => r.classList.add("is-in"));
    /* THE FUNNEL DRAWS ITSELF. A light runs the column as you scroll and each
       stage takes full ink as it passes — the sequence stops being three
       numbers and becomes one path. Same law as everywhere else in this room:
       the thing that happens to a line is that light travels along it. */
    const list = el.querySelector<HTMLElement>(".dr-svc-list");
    const nums = Array.from(el.querySelectorAll<HTMLElement>(".dr-svc-num"));
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (!list) return;
      const b = list.getBoundingClientRect();
      /* 0 when the list's TOP enters at 95% of the viewport, 1 once its
         BOTTOM has cleared 90%. Anchoring the finish to the bottom is what
         makes it reachable: the first version asked the list's top to climb
         to 42%, which this page is not tall enough to allow, so the light
         stalled at half and the third stage never lit. Written off the
         list's own box, so it still resolves when the page grows. */
      const start = innerHeight * 0.95;
      const p = Math.max(
        0,
        Math.min(1, (start - b.top) / (innerHeight * 0.05 + b.height))
      );
      const y = b.top + b.height * p;
      nums.forEach((n) => {
        const r = n.getBoundingClientRect();
        // the ROW takes ink, not a rule beside it
        n.closest(".dr-svc-row")?.classList.toggle("is-lit", y >= r.top);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    if (!still) {
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll, { passive: true });
      draw();
    } else {
      nums.forEach((n) => n.closest(".dr-svc-row")?.classList.add("is-lit"));
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          // added, never removed: a reveal that can un-reveal on the way back
          // up reads as a bug, not a beat
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -18% 0px", threshold: 0 }
    );
    rows.forEach((r) => io.observe(r));
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="dr-svc" ref={ref} aria-labelledby="dr-svc-h">
      <div className="wrap">
        {/* the whole funnel rides ONE surface — same frosted material as the
            hero's work cards, at the scale of a section rather than a row */}
        <div className="dr-svc-card">
        <header className="dr-svc-head">
          <div className="dr-svc-headline">
            <span className="t-label dr-svc-kicker">Services</span>
            <h2 className="dr-svc-lead" id="dr-svc-h">
              The click, the page it lands on, and the follow-up after.
            </h2>
          </div>

          {/* Role-and-sector attribution with the repo's placeholder glyph,
              not a name and a face: lib/quotes.ts carries no real person and
              no exact business, so a photo would invent a customer. The slot
              is shaped for the real thing. */}
          <figure className="dr-vouch dr-reveal">
            <span className="dr-vouch-av" aria-hidden>
              <PersonIcon />
            </span>
            <span className="dr-vouch-body">
              <blockquote>{QUOTES[2].text}</blockquote>
              <figcaption>{QUOTES[2].name}</figcaption>
            </span>
          </figure>
        </header>

        <ul className="dr-svc-list">
          {SERVICES.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="dr-svc-row dr-reveal"
                style={{ "--row": i } as React.CSSProperties}
              >
                <span className="dr-svc-num" aria-hidden>
                  {s.stageIndex}
                </span>

                <span className="dr-svc-body">
                  <span className="t-label dr-svc-stage">{s.stage}</span>
                  <span className="dr-svc-title">{s.title.join(" ")}</span>
                  <span className="dr-svc-what">{s.label}</span>
                </span>

                <span className="dr-svc-price">{s.heroPrice}</span>

                <i className="dr-svc-arrow" aria-hidden>
                  →
                </i>
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
