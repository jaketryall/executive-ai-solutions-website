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
   static card at the same inset as the section panels; on desktop the real
   showreel video plays in the 16:9 frame uncropped (no grow, no rise — it
   scrolls like furniture). The portrait mobile stage keeps its art-directed
   phone captures: a 16:9 reel would cover-crop to a useless center slice. */

const MOBILE_SLIDES = [
  { src: "/work/desert-wings-mobile.png", alt: "The Desert Wings homepage on a phone" },
  { src: "/work/desert-wings-mobile-2.png", alt: "The Desert Wings team section on a phone" },
];

export function Showreel() {
  const root = useRef<HTMLElement>(null!);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);
      const media = q("[data-grow-media]")[0] as HTMLElement;
      const video = videoRef.current;

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        return; // the video stays on its poster (no autoplay attr — we drive play())
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

      // ── the reel itself: plays only while on screen, the tab is visible,
      //    AND the desktop stage is showing — below md the video is
      //    display:none and playing it would just burn bandwidth ──
      let inView = false;
      const desktopStage = window.matchMedia("(min-width: 768px)");
      const syncPlayback = () => {
        if (!video) return;
        if (inView && !document.hidden && desktopStage.matches) video.play().catch(() => {});
        else video.pause();
      };
      desktopStage.addEventListener("change", syncPlayback);
      context.add(() => () => desktopStage.removeEventListener("change", syncPlayback));
      document.addEventListener("visibilitychange", syncPlayback);
      context.add(() => () => document.removeEventListener("visibilitychange", syncPlayback));

      // ── the mobile stage cycle: timed z-stack crossfade (film dissolve),
      //    paused while offscreen or the tab is hidden ──
      let cancelled = false;
      context.add(() => () => {
        cancelled = true;
      });
      const slides = gsap.utils.toArray<HTMLElement>(q("[data-reel='m']"));
      let reelIdx = 0;
      let z = 1;
      const advance = () => {
        if (!inView || document.hidden || slides.length < 2) return;
        reelIdx += 1;
        const next = slides[reelIdx % slides.length];
        gsap.set(next, { zIndex: ++z });
        gsap.fromTo(next, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.0, ease: EASE_STRUCTURE });
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
          syncPlayback();
        },
      });
    },
    { scope: root }
  );

  // the pill's promise: the reel again, but loud and full-screen. Sound is
  // re-muted on exit so the inline card never keeps talking.
  const playLoud = () => {
    const v = videoRef.current;
    if (!v) return;
    const onFsChange = () => {
      if (!document.fullscreenElement) {
        v.muted = true;
        document.removeEventListener("fullscreenchange", onFsChange);
      }
    };
    v.muted = false;
    v.play().catch(() => {});
    if (v.requestFullscreen) {
      document.addEventListener("fullscreenchange", onFsChange);
      v.requestFullscreen().catch(() => {});
    } else {
      // Safari's video-only fullscreen path
      (v as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen?.();
    }
  };

  return (
    <section ref={root} aria-label="Showreel" className="relative">
      {/* the card — a true 16:9 frame at full gutter width on desktop (the
          showreel plays uncropped; on short screens you scroll through it).
          Mobile stage matches the phone captures' aspect. */}
      <div
        data-anim="reel"
        className="mx-fib-1 h-[min(86svh,calc((100vw-16px)*1.482))] md:mx-fib-2 md:aspect-video md:h-auto"
      >
        <div
          data-grow-media
          data-nav="dark"
          className="relative block h-full w-full overflow-hidden rounded-[24px] bg-dark"
          role="group"
          aria-label="Showreel: pages from live client work"
        >
          {/* the reel (desktop) — muted inline, driven by scroll visibility */}
          <video
            ref={videoRef}
            className="absolute inset-0 hidden h-full w-full object-cover md:block"
            src="/showreel.mp4"
            poster="/showreel-poster.jpg"
            muted
            loop
            playsInline
            preload="metadata"
          />

          {/* the portrait mobile stage cycles real phone renderings — a UI
              screenshot must never cover-crop its own nav */}
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

          {/* click target: the whole frame plays the reel loud + fullscreen
              (desktop only — mobile shows captures, not the video) */}
          <button
            type="button"
            onClick={playLoud}
            className="absolute inset-0 z-10 hidden cursor-none md:block"
            aria-label="Play the showreel fullscreen with sound"
          />

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
