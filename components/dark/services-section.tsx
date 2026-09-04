"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SERVICES } from "@/lib/services";
import { QUOTES } from "@/lib/quotes";
import { PersonIcon } from "@/components/ui/person-icon";
import Image from "next/image";

/* §02 · THE FUNNEL
   THE LIGHTS COME ON. The one light section in a black room, and the only
   place the page inverts — which is exactly why it can carry the whole
   claim in one centred line instead of a header and a column.

   Everything is visible at rest — name, statement, and the PRICE. Nothing
   about a service sits behind a hover or a click, because the thing a
   visitor most wants to know is the thing most sites make you dig for.

   THE SIGNATURE (after icomat.co.uk's second section, decoded rather than
   guessed at): the statement arrives a word at a time as you scroll, and a
   scattered field of marks converges onto its grid behind it. Both are
   pure f(scroll) off ONE progress value, so the whole thing scrubs
   backwards exactly. Measured off the source: words ramp from 0.2 to 1
   left-to-right; the marks start ±300px out and settle to 0. */

const SAY = "The click, the page it lands on, and the follow-up after.";

/* One REAL screen per stage, and deliberately not all from one client:
   a services list illustrated three times with the same site is a
   portfolio of one. Kept here rather than in lib/services.ts while the
   design is still moving — it graduates to the data once it settles.
   §03 shows the Desert Wings hero at full size, so none of these is that. */
/* `pos` is the crop point, per image, because a strip this shallow shows
   maybe a third of a 2880x1800 screenshot and the default centre landed on
   the site's nav bar every time — three rows of somebody's header. Each one
   is aimed at the thing that makes the point instead: the estimate, the
   hero, the form. */
const SHOTS: Record<string, { src: string; alt: string; pos: string }> = {
  "google-ads": {
    src: "/work/live/dw-cost-calculator.jpg",
    alt: "A training cost estimator on a client site, totalling $20,000",
    pos: "50% 34%",
  },
  websites: {
    src: "/work/aahg-hero.jpg",
    alt: "The Arizona Aviation Historical Group homepage",
    pos: "50% 46%",
  },
  ai: {
    src: "/work/live/dw-booking.jpg",
    alt: "The enquiry form a new lead lands in",
    pos: "50% 58%",
  },
};

/* five columns of marks at the grid's own positions. The x/y each one
   travels FROM is its own, so the field converges from a scatter rather
   than sliding in as one block. */
const MARKS = [
  { x: -300, dots: [-14, 0, 14] },
  { x: -150, dots: [-10, 0, 10] },
  { x: 0, dots: [-70, 70] },
  { x: 150, dots: [10, 0, -10] },
  { x: 300, dots: [14, 0, -14] },
];

export default function ServicesSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const say = el.querySelector<HTMLElement>(".dr-say");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = Array.from(el.querySelectorAll<HTMLElement>(".dr-reveal"));

    if (still) {
      el.style.setProperty("--sp", "1");
      rows.forEach((r) => r.classList.add("is-in"));
      // the shots are content, not decoration — they rest OPEN
      el.querySelectorAll<HTMLElement>(".dr-svc-shot").forEach((sh) => {
        sh.style.setProperty("--rp", "1");
        sh.style.setProperty("--pp", "0.5");
      });
      el.querySelectorAll(".dr-svc-row").forEach((r) => r.classList.add("is-lit"));
      return;
    }

    /* ONE progress value drives the words and the marks together. Written
       off the statement's own box, so it still resolves if the section
       grows or the copy rewraps. */
    let frame = 0;
    const draw = () => {
      frame = 0;
      if (!say) return;
      const b = say.getBoundingClientRect();
      /* starts when the line is a little under the fold, finishes once it
         has climbed past the third — the source's window, measured */
      const from = innerHeight * 0.92;
      const to = innerHeight * 0.3;
      const raw = (from - b.top) / (from - to);
      el.style.setProperty("--sp", String(Math.max(0, Math.min(1, raw))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    draw();

    /* the funnel draws itself: a light runs the column and each stage takes
       full ink as it passes, so the sequence stops being three numbers and
       becomes one path */
    const list = el.querySelector<HTMLElement>(".dr-svc-list");
    const nums = Array.from(el.querySelectorAll<HTMLElement>(".dr-svc-num"));
    const shots = Array.from(el.querySelectorAll<HTMLElement>(".dr-svc-shot"));
    const lit = () => {
      if (!list) return;
      const b = list.getBoundingClientRect();
      const start = innerHeight * 0.95;
      const p = Math.max(
        0,
        Math.min(1, (start - b.top) / (innerHeight * 0.05 + b.height))
      );
      const y = b.top + b.height * p;
      nums.forEach((n) => {
        const r = n.getBoundingClientRect();
        n.closest(".dr-svc-row")?.classList.toggle("is-lit", y >= r.top);
      });

      /* Each row's own two numbers, from ONE pass over the same rects.
         --rp opens the shot as the row arrives (0 -> 1, and it can run
         back), and --pp is the row's travel through the viewport, which
         is what the image drifts against. Both are pure f(scroll). */
      shots.forEach((sh) => {
        const r = sh.getBoundingClientRect();
        const rp = (innerHeight * 0.86 - r.top) / (innerHeight * 0.3);
        const pp = (innerHeight - r.top) / (innerHeight + r.height);
        sh.style.setProperty("--rp", String(Math.max(0, Math.min(1, rp))));
        sh.style.setProperty("--pp", String(Math.max(0, Math.min(1, pp))));
      });
    };
    let lframe = 0;
    const onLit = () => {
      if (!lframe) lframe = requestAnimationFrame(() => { lframe = 0; lit(); });
    };
    addEventListener("scroll", onLit, { passive: true });
    addEventListener("resize", onLit, { passive: true });
    lit();

    /* THE SAME LAW AS THE HERO SEAM, so the page has one grammar rather
       than two unrelated tricks: the section leaving RECEDES — drifting
       down at 0.4x and shrinking to 0.8 — and §03 arriving at full speed
       reads as rising over it.

       Measured off .dr-svc, which is NOT the element being transformed. A
       transformed element cannot be its own ruler: reading its moved rect
       to decide how far to move it is a feedback loop.

       Everything else this section measures — the word ramp, the lit rows,
       the shot reveals — is clamped at 1 long before the exit begins, so
       the two never contend for the same scroll range. */
    const inner = el.querySelector<HTMLElement>(".dr-svc-in");
    const exit = () => {
      if (!inner) return;
      const b = el.getBoundingClientRect();
      /* Scaled to the VIEWPORT, not the section. The hero is exactly one
         screen tall so its own height was the seam; this section is two,
         and running the recede across all of it lagged the last row and
         the testimonial 700px down into the clip — content nobody would
         ever reach. The recede belongs to the SEAM, so it runs across the
         final screenful: 0 when the section's bottom meets the viewport's,
         1 when that bottom reaches the top. */
      const ep = Math.max(0, Math.min(1, (innerHeight - (b.top + b.height)) / innerHeight));
      inner.style.setProperty("--ey", `${ep * innerHeight * 0.4}px`);
      inner.style.setProperty("--ep", String(ep));
    };
    let eframe = 0;
    const onExit = () => {
      if (!eframe) eframe = requestAnimationFrame(() => { eframe = 0; exit(); });
    };
    addEventListener("scroll", onExit, { passive: true });
    addEventListener("resize", onExit, { passive: true });
    exit();

    // added, never removed: a reveal that un-reveals reads as a bug
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -18% 0px", threshold: 0 }
    );
    rows.forEach((r) => io.observe(r));

    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      removeEventListener("scroll", onLit);
      removeEventListener("resize", onLit);
      removeEventListener("scroll", onExit);
      removeEventListener("resize", onExit);
      if (eframe) cancelAnimationFrame(eframe);
      if (frame) cancelAnimationFrame(frame);
      if (lframe) cancelAnimationFrame(lframe);
    };
  }, []);

  const words = SAY.split(" ");

  return (
    <section className="dr-svc" ref={ref} aria-labelledby="dr-svc-h">
      {/* the exit rides this, never .dr-svc itself — the section's own rect
          is what the exit progress is measured FROM, and a transformed
          element cannot be its own ruler */}
      <div className="dr-svc-in">
      <div className="dr-say">
        <div className="dr-marks" aria-hidden>
          {MARKS.map((m, i) => (
            <span key={i} className="dr-mark-col">
              {m.dots.map((d, j) => (
                <i
                  key={j}
                  style={
                    { "--dx": `${m.x}px`, "--dy": `${d}px` } as React.CSSProperties
                  }
                />
              ))}
            </span>
          ))}
        </div>

        {/* one word per span so each can carry its own place in the ramp.
            The sentence stays one readable string for a screen reader —
            the spans are inline and the spaces are real. */}
        <h2 className="dr-say-h" id="dr-svc-h">
          {words.map((w, i) => (
            <span
              key={i}
              className="dr-word"
              style={{ "--i": i, "--n": words.length } as React.CSSProperties}
            >
              {w}
            </span>
          ))}
        </h2>
      </div>

      <div className="wrap">
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

                {/* the strip ALWAYS holds its height in layout. If it opened
                    by growing, the section would get taller as you scrolled
                    it, which moves the rows, which changes which row the
                    light is on — the reveal would be feeding its own input.
                    The space is reserved; only the image inside moves. */}
                <span
                  className="dr-svc-shot"
                  style={{ "--pos": SHOTS[s.slug].pos } as React.CSSProperties}
                >
                  <Image
                    src={SHOTS[s.slug].src}
                    alt={SHOTS[s.slug].alt}
                    width={2880}
                    height={1800}
                    sizes="(max-width: 900px) 100vw, 1100px"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Role-and-sector attribution with the repo's placeholder glyph,
            not a name and a face: lib/quotes.ts carries no real person and
            no exact business, so a photo would invent a customer. The slot
            is shaped for the real thing. */}
        <figure className="dr-vouch dr-reveal" style={{ "--row": 3 } as React.CSSProperties}>
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
