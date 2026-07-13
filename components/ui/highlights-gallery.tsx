"use client";

import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/components/anim/ease";

/* The highlights gallery — the macbook-neo pattern, decoded and rebuilt
   (design-dna/apple-grammar.md §6).

   The genius part, preserved exactly: captions carry NO animation of their
   own. Every frame, each caption's transform/opacity is recomputed as a pure
   function of its card's distance from the viewport center:
     captionX       = dist × 0.1266            (linear parallax lag)
     captionOpacity = (1 − min(|dist|/range,1))³  (cubic falloff)
   Because the function is signed, text always enters in the direction of
   the swipe — no left/right branching exists anywhere.

   The track is a NATIVE scroll-snap container; dot clicks call
   scrollTo({behavior:'smooth'}) and the browser is the tween. The rAF loop
   runs only while the section is on screen. */

export type Highlight = {
  key: string;
  caption: string;
  media: React.ReactNode;
  /** full-bleed image cards get a top scrim so the caption stays legible */
  fill?: boolean;
};

export function HighlightsGallery({
  heading,
  items,
  label,
}: {
  heading: string;
  items: Highlight[];
  label: string;
}) {
  const root = useRef<HTMLElement>(null!);
  const trackRef = useRef<HTMLUListElement>(null!);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = 0; // first paint opens on card 0 (snap can wander pre-layout)
    const cards = Array.from(track.children) as HTMLElement[];
    const captions = cards.map(
      (c) => c.querySelector<HTMLElement>(".hlg-cap")!
    );
    if (reducedMotion()) return; // CSS rests captions fully visible

    let raf = 0;
    let running = false;
    let curr = 0;
    const tick = () => {
      const vp = track.getBoundingClientRect();
      const centerX = vp.left + vp.width / 2;
      const range = (cards[0]?.offsetWidth ?? 1259) + 21; // card + gap
      let nearest = 0;
      let nearestD = Infinity;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const dist = r.left + r.width / 2 - centerX;
        const f = Math.min(Math.abs(dist) / range, 1);
        const cap = captions[i];
        if (cap) {
          cap.style.transform = `translate3d(${dist * 0.1266}px,0,0)`;
          cap.style.opacity = String(Math.pow(1 - f, 3));
        }
        if (Math.abs(dist) < nearestD) {
          nearestD = Math.abs(dist);
          nearest = i;
        }
      });
      if (nearest !== curr) {
        curr = nearest;
        setCurrent(nearest);
      }
      if (running) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      const next = e.isIntersecting;
      if (next && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!next) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(root.current);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const goTo = (i: number) => {
    const track = trackRef.current;
    const card = track.children[i] as HTMLElement;
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <section ref={root} className="hlg" aria-label={label}>
      <div className="wrap">
        <h2 className="t-display-lg text-center">{heading}</h2>
      </div>
      <ul ref={trackRef} className="hlg-track" aria-label={`${label} cards`}>
        {items.map((it) => (
          <li
            key={it.key}
            className={`hlg-card ${it.fill ? "hlg-card--fill" : ""}`}
          >
            {it.fill && <span className="hlg-scrim" aria-hidden />}
            <div className="hlg-cap-wrap">
              <p className="hlg-cap">{it.caption}</p>
            </div>
            <div className="hlg-media">{it.media}</div>
          </li>
        ))}
      </ul>
      <div className="hlg-dots">
        {items.map((it, i) => (
          <button
            key={it.key}
            type="button"
            className={`hlg-dot ${i === current ? "is-on" : ""}`}
            aria-label={`Show highlight ${i + 1} of ${items.length}: ${it.caption}`}
            aria-current={i === current}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
