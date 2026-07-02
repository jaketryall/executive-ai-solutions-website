"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";

/* The showreel sits directly under the hero and its top edge PEEKS into the
   first viewport — a moving thing half-seen is the scroll bait. It's a wide
   static card at the same inset as the section panels; the film-dissolve
   cycle is the only motion (no grow, no rise — it scrolls like furniture). */

const DESKTOP_SLIDES = [
  { src: "/work/desert-wings-tall.png", alt: "The Desert Wings Flight School homepage" },
  { src: "/work/desert-wings-proof.png", alt: "The Desert Wings testimonials section" },
  { src: "/work/desert-wings-team.png", alt: "The Desert Wings team section" },
];
const MOBILE_SLIDES = [
  { src: "/work/desert-wings-mobile.png", alt: "The Desert Wings homepage on a phone" },
  { src: "/work/desert-wings-mobile-2.png", alt: "The Desert Wings team section on a phone" },
];

export function Showreel() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);
      const media = q("[data-grow-media]")[0];

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        return;
      }

      // ── entrance: a plain fade with the hero's beat — no travel ──
      const enter = gsap.fromTo(
        q("[data-anim='reel']"),
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.0, ease: EASE_STRUCTURE, paused: true, delay: 0.85 }
      );
      document.fonts.ready.then(() => {
        requestAnimationFrame(() => requestAnimationFrame(() => enter.play()));
      });

      // ── "Play showreel" rides the pointer over the reel (fine-pointer only;
      //    quickTo keeps the follow cheap at pointermove frequency) ──
      const mmCursor = gsap.matchMedia();
      mmCursor.add("(hover: hover) and (pointer: fine)", () => {
        const cursor = q(".reel-cursor")[0];
        const pill = q(".rc-pill")[0];
        if (!cursor || !pill) return;
        gsap.set(pill, { scale: 0.6 });
        const xTo = gsap.quickTo(cursor, "x", { duration: 0.4, ease: EASE_UI });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.4, ease: EASE_UI });
        const onMove = (e: PointerEvent) => {
          const r = media.getBoundingClientRect();
          xTo(e.clientX - r.left);
          yTo(e.clientY - r.top);
        };
        const onEnter = (e: PointerEvent) => {
          const r = media.getBoundingClientRect();
          gsap.set(cursor, { x: e.clientX - r.left, y: e.clientY - r.top });
          gsap.to(pill, { autoAlpha: 1, scale: 1, duration: 0.35, ease: EASE_UI });
        };
        const onLeave = () => {
          gsap.to(pill, { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: EASE_UI });
        };
        media.addEventListener("pointerenter", onEnter);
        media.addEventListener("pointermove", onMove);
        media.addEventListener("pointerleave", onLeave);
        return () => {
          media.removeEventListener("pointerenter", onEnter);
          media.removeEventListener("pointermove", onMove);
          media.removeEventListener("pointerleave", onLeave);
        };
      });

      // ── contained parallax: every slide drifts inside the fixed frame as
      //    the card travels the viewport (desktop only; the overscan scale
      //    means the drift can never expose an edge). All slides share one
      //    tween so the drift stays continuous across crossfades. ──
      const mm = gsap.matchMedia();
      mm.add("(min-width: 821px)", () => {
        const shots = gsap.utils.toArray<HTMLElement>(q("[data-reel] img"));
        gsap.set(shots, { scale: 1.12, willChange: "transform" });
        const tw = gsap.fromTo(
          shots,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: media,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
        return () => {
          tw.kill();
          gsap.set(shots, { clearProps: "transform" });
        };
      });

      // ── the reel cycle: timed z-stack crossfade (film dissolve, one slide
      //    at a time), paused while offscreen or the tab is hidden ──
      let cancelled = false;
      context.add(() => () => {
        cancelled = true;
      });
      const sets = [
        gsap.utils.toArray<HTMLElement>(q("[data-reel='d']")),
        gsap.utils.toArray<HTMLElement>(q("[data-reel='m']")),
      ];
      let reelIdx = 0;
      let inView = false;
      let z = 1;
      const advance = () => {
        if (!inView || document.hidden) return;
        reelIdx += 1;
        sets.forEach((slides) => {
          if (slides.length < 2) return;
          const next = slides[reelIdx % slides.length];
          gsap.set(next, { zIndex: ++z });
          gsap.fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0, ease: EASE_STRUCTURE });
        });
      };
      // recursive delayedCalls escape the context — the cancelled flag (set on
      // cleanup) stops the chain so StrictMode/unmount never double-cycles
      const loop = () => {
        if (cancelled) return;
        advance();
        gsap.delayedCall(4.2, loop);
      };
      gsap.delayedCall(4.2, loop);
      ScrollTrigger.create({
        trigger: media,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          inView = self.isActive;
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} aria-label="Showreel" className="relative">
      {/* the card — a true 16:9 frame at full gutter width on desktop (a real
          showreel video drops in uncropped; on short screens you scroll
          through it). Mobile stage matches the phone captures' aspect. */}
      <div
        data-anim="reel"
        className="mx-[8px] h-[min(86svh,calc((100vw-16px)*1.482))] md:mx-[13px] md:aspect-video md:h-auto"
      >
        <div
          data-grow-media
          data-nav="dark"
          className="relative block h-full w-full overflow-hidden rounded-[24px] bg-dark"
          role="group"
          aria-label="Showreel: pages from live client work"
        >
          {/* art-directed slide sets — a UI screenshot must never cover-crop
              its own nav: desktop cycles 1.6:1 captures, the portrait mobile
              stage cycles their real phone renderings */}
          {DESKTOP_SLIDES.map((s, i) => (
            <div key={s.src} data-reel="d" className="absolute inset-0 hidden md:block" style={{ opacity: i === 0 ? 1 : 0 }}>
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover object-top"
              />
            </div>
          ))}
          {MOBILE_SLIDES.map((s, i) => (
            <div key={s.src} data-reel="m" className="absolute inset-0 md:hidden" style={{ opacity: i === 0 ? 1 : 0 }}>
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                className="object-cover object-top"
              />
            </div>
          ))}

          {/* "Play showreel" pointer chip (fine-pointer only; clipped by the
              card's own overflow so it can never escape the frame) */}
          <div className="reel-cursor" aria-hidden>
            <span className="rc-center">
              <span className="rc-pill">
                <svg viewBox="0 0 12 12" aria-hidden>
                  <path d="M2.5 1.5 10.5 6 2.5 10.5Z" fill="currentColor" />
                </svg>
                Play showreel
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
