"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/work";

/* §03 · THE GALLERY (trial `?v=gallery`, 2026-09-21 — Jake, on Apple's
   "Get the highlights.": "i really like the motion im wondering if i can
   make the full site feel like that somehow" → "the gallery first").

   Apple's media card gallery, measured (design-dna/decodes/apple-
   highlights.md; the caption law from apple-grammar.md §6):

   THE TRACK is a real horizontal scroller — overflow-x: scroll, scroll-
   snap x mandatory — and the cards never transform. A dot, a key or the
   autoplay writes scrollLeft through a deterministic ease-in-out tween
   (cubic-bezier(.42,0,.58,1), 1000ms, no chase: the value lands exactly
   and stays), with snapping lifted for the tween's duration so the
   browser cannot argue with the intermediate positions. A finger or a
   trackpad scrolls it natively and the snap does the landing.

   THE CAPTION IS GEOMETRY. Every frame, for every card: d = the card's
   centre from the track's centre, in steps (one step = a card + its
   gap). The caption is slid d × 162px (his 1280 × .1266) and its
   opacity is (1 − min(|d|, 1))³ — invisible until the card is most of
   the way in, then up through the back half. No animation of its own;
   direction-aware for free. One thing moves per interaction: the media
   sits at opacity 1, unscaled.

   THE PAGER: 8px dots, the current one a 48px pill whose ::after fills
   with the card's own progress — Stories, not decoration. Autoplay is
   ended-event-driven on Apple (each card's clip); our cards are stills,
   so a card "ends" after DWELL ms, and the next card's clock starts at
   the tween's midpoint, where Apple's next video starts. Manual
   navigation pauses the cycle (his rule); the button resumes; the last
   card is a dead end until Replay. Off-screen and hidden tabs pause.

   Every non-current card is `inert` + aria-hidden — out of hit-testing,
   focus and selection while its geometry stays put — so the peeking
   slivers are not clickable, exactly as his are. */

export type GalleryCard = {
  src: string;
  width: number;
  height: number;
  alt: string;
  project: Project;
  k: number; // case index
};

/* one line per card — what that screen of the site does, in the
   client's own terms (from lib/work.ts's ledes and figure captions) */
const CAPTIONS: Record<string, string> = {
  "/work/desert-wings-tall.png": "A flight school built to win students, not park a brochure.",
  "/work/desert-wings-fleet.png": "The fleet, with the numbers a first-timer weighs.",
  "/work/live/dw-programs.jpg": "Every certificate, with real hours and costs.",
  "/work/aahg-hero.jpg": "Arizona's aviation history, given a permanent home.",
  "/work/aahg-programs.jpg": "What they preserve, what they restore.",
  "/work/aahg-numbers.jpg": "Their history, in figures a visitor can hold.",
  "/work/riled-hero.jpg": "A coach who needs a full calendar, not a brochure.",
  "/work/riled-booking.jpg": "Three packages, checkout on the page.",
  "/work/riled-feature.jpg": "The proof and the process that earn the booking.",
};

const DWELL = 4000; // ms a still holds before the cycle advances (his clips: 2.5–5s)
const MOVE = 1000; // ms, the measured slide
const LAG = 162; // px of caption lag per step (1280 × .1266)

// cubic-bezier(.42, 0, .58, 1) — CSS ease-in-out, the measured curve
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a: number, b: number) => 1 - 3 * b + 3 * a;
  const B = (a: number, b: number) => 3 * b - 6 * a;
  const C = (a: number) => 3 * a;
  const at = (t: number, a: number, b: number) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
  const slope = (t: number, a: number, b: number) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const s = slope(t, x1, x2);
      if (Math.abs(s) < 1e-6) break;
      t -= (at(t, x1, x2) - x) / s;
    }
    return at(t, y1, y2);
  };
}
const EASE = bezier(0.42, 0, 0.58, 1);

type Play = "playing" | "paused" | "ended";

export default function WorkGallery({ cards }: { cards: GalleryCard[] }) {
  const n = cards.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [play, setPlay] = useState<Play>("playing");
  // the live state the rAF loops read — never React state, which is a
  // frame late by construction
  const live = useRef({ current: 0, play: "playing" as Play, inView: false, elapsed: 0, tween: 0, last: 0 });

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || n < 2) return;
    const items = Array.from(track.querySelectorAll<HTMLElement>(".dr-gal-item"));
    const caps = items.map((li) => li.querySelector<HTMLElement>(".dr-gal-cap"));
    const dots = Array.from(root.querySelectorAll<HTMLElement>(".dr-gal-dot"));
    const L = live.current;

    const step = () => items[1].offsetLeft - items[0].offsetLeft;
    const targetLeft = (i: number) => items[i].offsetLeft - (track.clientWidth - items[i].offsetWidth) / 2;

    /* THE CAPTION LAW, per frame of any scroll (native or tweened) */
    const paint = () => {
      const s = step();
      const mid = track.scrollLeft + track.clientWidth / 2;
      items.forEach((li, i) => {
        const d = (li.offsetLeft + li.offsetWidth / 2 - mid) / s;
        const cap = caps[i];
        if (!cap) return;
        const dd = Math.max(-1.5, Math.min(1.5, d));
        cap.style.setProperty("--cx", `${(dd * LAG).toFixed(1)}px`);
        cap.style.setProperty("--co", Math.pow(1 - Math.min(Math.abs(d), 1), 3).toFixed(3));
      });
    };

    const setIndex = (i: number) => {
      if (i === L.current) return;
      L.current = i;
      setCurrent(i);
      items.forEach((li, j) => {
        const off = j !== i;
        li.toggleAttribute("inert", off);
        li.setAttribute("aria-hidden", off ? "true" : "false");
      });
    };

    /* THE MOVE: scrollLeft tweened on the measured curve, snap lifted
       for its duration, landing exactly on the snap point */
    const cancelTween = () => {
      if (L.tween) cancelAnimationFrame(L.tween);
      L.tween = 0;
      track.style.scrollSnapType = "";
    };
    const go = (i: number) => {
      i = Math.max(0, Math.min(n - 1, i));
      cancelTween();
      const from = track.scrollLeft;
      const to = targetLeft(i);
      if (Math.abs(to - from) < 1) {
        setIndex(i);
        return;
      }
      track.style.scrollSnapType = "none";
      const t0 = performance.now();
      const frame = (now: number) => {
        const x = Math.min(1, (now - t0) / MOVE);
        track.scrollLeft = from + (to - from) * EASE(x);
        if (x < 1) L.tween = requestAnimationFrame(frame);
        else {
          L.tween = 0;
          track.style.scrollSnapType = "";
          setIndex(i);
        }
      };
      L.tween = requestAnimationFrame(frame);
      // his next video starts at the move's midpoint — so does our clock
      L.elapsed = -MOVE / 2;
      dots.forEach((d) => d.style.setProperty("--pp", "0"));
      setIndex(i);
    };

    /* THE CYCLE: a still "ends" after DWELL; the pill is its clock */
    const setPlayState = (p: Play) => {
      L.play = p;
      setPlay(p);
    };
    const tick = (now: number) => {
      const dt = L.last ? now - L.last : 0;
      L.last = now;
      if (L.play === "playing" && L.inView && !document.hidden) {
        // the clock runs through the move too, from −MOVE/2: the next
        // pill starts filling at the slide's midpoint, where his next
        // video starts
        L.elapsed += dt;
        const pp = Math.max(0, Math.min(1, L.elapsed / DWELL));
        dots[L.current]?.style.setProperty("--pp", pp.toFixed(3));
        if (pp >= 1 && !L.tween) {
          if (L.current < n - 1) go(L.current + 1);
          else setPlayState("ended");
        }
      }
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    /* manual navigation pauses the cycle (his rule); the button resumes */
    const onDot = (i: number) => {
      setPlayState("paused");
      go(i);
    };
    dots.forEach((d, i) => d.addEventListener("click", () => onDot(i)));
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      const i = Math.max(0, Math.min(n - 1, L.current + (e.key === "ArrowRight" ? 1 : -1)));
      onDot(i);
      dots[i]?.focus();
    };
    root.querySelector(".dr-gal-dots")?.addEventListener("keydown", onKey as EventListener);

    const btn = root.querySelector<HTMLButtonElement>(".dr-gal-play");
    const onBtn = () => {
      if (L.play === "ended") {
        setPlayState("playing");
        go(0);
        L.elapsed = 0;
      } else if (L.play === "playing") setPlayState("paused");
      else {
        setPlayState("playing");
        if (L.elapsed >= DWELL) L.elapsed = 0;
      }
    };
    btn?.addEventListener("click", onBtn);

    /* a finger or a trackpad takes over: drop the tween, let the snap land it */
    const onUser = () => {
      if (L.tween) {
        cancelTween();
        setPlayState("paused");
      }
    };
    track.addEventListener("wheel", onUser, { passive: true });
    track.addEventListener("pointerdown", onUser, { passive: true });
    track.addEventListener("touchstart", onUser, { passive: true });
    const onScroll = () => {
      paint();
      if (!L.tween) setIndex(Math.round(track.scrollLeft / step()));
    };
    track.addEventListener("scroll", onScroll, { passive: true });

    /* autoplay only while the section is mostly on screen */
    const io = new IntersectionObserver(([e]) => (L.inView = e.isIntersecting), { threshold: 0.5 });
    io.observe(root);

    const ro = new ResizeObserver(() => {
      if (!L.tween) track.scrollLeft = targetLeft(L.current);
      paint();
    });
    ro.observe(track);

    items.forEach((li, j) => {
      li.toggleAttribute("inert", j !== 0);
      li.setAttribute("aria-hidden", j !== 0 ? "true" : "false");
    });
    paint();

    return () => {
      cancelAnimationFrame(raf);
      cancelTween();
      io.disconnect();
      ro.disconnect();
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("wheel", onUser);
      track.removeEventListener("pointerdown", onUser);
      track.removeEventListener("touchstart", onUser);
      btn?.removeEventListener("click", onBtn);
      root.querySelector(".dr-gal-dots")?.removeEventListener("keydown", onKey as EventListener);
    };
  }, [n]);

  if (!n) return null;
  const label = play === "playing" ? "Pause the gallery" : play === "ended" ? "Replay the gallery" : "Play the gallery";

  return (
    <div className="dr-gal" ref={rootRef} data-play={play}>
      <div className="dr-gal-track" ref={trackRef}>
        <ul className="dr-gal-set">
          {cards.map((c, i) => (
            <li className="dr-gal-item" key={c.src} data-k={c.k}>
              <a className="dr-gal-card" href={`/work/${c.project.slug}`} tabIndex={i === current ? 0 : -1}>
                <Image
                  className="dr-gal-img"
                  src={c.src}
                  width={c.width}
                  height={c.height}
                  alt={c.alt}
                  sizes="(max-width: 900px) 90vw, min(1760px, 88vw)"
                  quality={82}
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </a>
              <div className="dr-gal-cap">
                <span className="t-label dr-gal-who">
                  {String(c.k + 1).padStart(2, "0")} · {c.project.listName} · {c.project.sector}
                </span>
                <p className="dr-gal-line">{CAPTIONS[c.src] ?? c.alt}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="dr-gal-ctl">
        <div className="dr-gal-dots" role="tablist" aria-label="Sites">
          {cards.map((c, i) => (
            <button
              key={c.src}
              type="button"
              role="tab"
              className="dr-gal-dot"
              aria-selected={i === current}
              aria-label={`${c.project.listName}: ${CAPTIONS[c.src] ?? c.alt}`}
              tabIndex={i === current ? 0 : -1}
            />
          ))}
        </div>
        <button type="button" className="dr-gal-play" aria-label={label}>
          <svg className="dr-gal-ico dr-gal-ico--play" viewBox="0 0 24 24" aria-hidden>
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
          <svg className="dr-gal-ico dr-gal-ico--pause" viewBox="0 0 24 24" aria-hidden>
            <path d="M7 5.5h3.5v13H7zM13.5 5.5H17v13h-3.5z" />
          </svg>
          <svg className="dr-gal-ico dr-gal-ico--replay" viewBox="0 0 24 24" aria-hidden>
            <path d="M12 5a7 7 0 1 1-6.3 4h2.2A5 5 0 1 0 12 7v3L7.5 6 12 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
