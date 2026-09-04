"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";

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
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".dr-svc-row"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rows.forEach((r) => r.classList.add("is-in"));
      return;
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
    return () => io.disconnect();
  }, []);

  return (
    <section className="dr-svc" ref={ref} aria-labelledby="dr-svc-h">
      <div className="wrap">
        <header className="dr-svc-head">
          <span className="t-label dr-svc-kicker">Services</span>
          <h2 className="dr-svc-lead" id="dr-svc-h">
            The click, the page it lands on, and the follow-up after.
          </h2>
        </header>

        <ul className="dr-svc-list">
          {SERVICES.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="dr-svc-row"
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
    </section>
  );
}
