"use client";

// Hero — a bold-type cover laid over a dimmed mockup reel that, on scroll,
// SHRINKS into a centered rounded showreel card while a "SHOW REEL" marquee
// loops right-to-left behind it (the Lando move). The pinned scrub uses
// transform: scale only — no per-frame layout — so it stays cheap and snappy.
// Degrades to a static cover under prefers-reduced-motion. No nav bar at the
// top; the dock fades in once the reel has formed (see Navbar).

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// each half of the seamless marquee repeats the phrase this many times
const REEL_PHRASES = Array.from({ length: 6 });

// project mockups the cover cross-fades through
const COVER_IMAGES = [
  "/Celestial Laptop Mockup.webp",
  "/Elegant Black Laptop Mockup.webp",
  "/custom-dashboard-mockup.webp",
  "/Rubber iPhone Mockup.webp",
];

// client wordmarks for the trust carousel that rises in under the formed reel
const REEL_BRANDS = [
  "Riled Up",
  "Desert Wings",
  "Wings N Wheels",
  "Lando",
  "AZ Gyro Tours",
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);

  const openMenu = () => window.dispatchEvent(new Event("eas-open-menu"));

  // rotate the cover through the project mockups
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % COVER_IMAGES.length), 3800);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const shrink = root.querySelector<HTMLElement>("[data-shrink]");
      const cover = root.querySelector<HTMLElement>("[data-cover]");
      const chrome = root.querySelector<HTMLElement>("[data-hero-chrome]");
      const proof = root.querySelector<HTMLElement>("[data-reel-proof]");
      if (!shrink || !cover) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return; // static cover (carousel shown via CSS) — scrolls away

      // Snappy: short scroll distance + tight scrub + a punchy ease, so the
      // reel forms decisively (Lando completes its shrink in well under a
      // screen of scroll) and holds briefly before the pin releases.
      // Shorter pin distance so it forms decisively without the user feeling
      // stuck scrolling in place.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=52%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // carousel starts low + hidden (CSS holds opacity:0 pre-JS, so no flash)
      if (proof) gsap.set(proof, { y: 20 });

      tl.to(shrink, { scale: 0.6, borderRadius: 30, ease: "power3.inOut", duration: 0.7 }, 0)
        .to(cover, { opacity: 0, ease: "power2.in", duration: 0.46 }, 0)
        .to(chrome, { opacity: 0, ease: "power2.in", duration: 0.38 }, 0);

      // carousel rises in EARLY — overlapping the tail of the shrink — so it
      // reads quickly instead of tacking length onto the pin
      if (proof) {
        tl.to(proof, { opacity: 1, y: 0, ease: "power2.out", duration: 0.32 }, 0.46);
      }

      // brief settle before the pin releases
      tl.to({}, { duration: 0.08 });

      // ── Seamless trust marquee — translate the track by exactly one sequence
      //    width and loop, so the join is invisible. Enough sequences are
      //    rendered to overflow any monitor; re-measure on refresh (resize) and
      //    once fonts load, since the inter-brand gap is viewport-relative. ──
      const track = root.querySelector<HTMLElement>("[data-reel-track]");
      const seq = root.querySelector<HTMLElement>("[data-reel-seq]");
      const relayout = () => {
        if (!track || !seq) return;
        gsap.killTweensOf(track);
        gsap.set(track, { x: 0 });
        const w = seq.getBoundingClientRect().width;
        if (w) {
          gsap.to(track, { x: -w, duration: w / 70, ease: "none", repeat: -1 });
        }
      };
      relayout();
      document.fonts?.ready.then(relayout);
      ScrollTrigger.addEventListener("refreshInit", relayout);

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", relayout);
        if (track) gsap.killTweensOf(track);
      };
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      className="zone-dark relative h-svh overflow-hidden bg-ink-deep text-paper"
    >
      {/* ── Back layer: SHOW REEL marquee looping right-to-left, revealed as the
            cover shrinks ── */}
      <div aria-hidden className="absolute inset-0 flex items-center overflow-hidden">
        <div className="marquee-track flex w-max shrink-0 items-center">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0 items-center">
              {REEL_PHRASES.map((_, i) => (
                <span
                  key={i}
                  className="shrink-0 whitespace-nowrap pr-[0.6em] font-black uppercase leading-none tracking-[-0.02em] text-paper/15 text-[15vw]"
                >
                  Show Reel
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Shrinking layer: the reel video, with the bold cover overlaid on top ── */}
      <div
        data-shrink
        className="absolute inset-0 overflow-hidden will-change-transform"
        style={{ transformOrigin: "center center", borderRadius: 0 }}
      >
        {/* the showreel itself — also serves as the cover's mockup backdrop */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/final-comp.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />

        {/* the bold-type cover — a rotating set of project mockups + a scrim +
            the type; fades into the playing reel on scroll. The dark base keeps
            the reel hidden behind it (incl. during cross-fades). */}
        <div data-cover className="absolute inset-0 bg-ink-deep text-paper">
          {/* rotating project mockups */}
          {COVER_IMAGES.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              aria-hidden
              className="object-cover transition-opacity duration-1000 ease-out"
              style={{ opacity: i === slide ? 1 : 0 }}
            />
          ))}
          {/* diagonal scrim: darker at the DESIGN / STUDIO corners, clearer in
              the middle where the mockup reads */}
          <div
            aria-hidden
            className="absolute inset-0 bg-ink-deep/12 bg-[linear-gradient(135deg,rgba(14,13,12,0.74),rgba(14,13,12,0.08)_38%,rgba(14,13,12,0.08)_62%,rgba(14,13,12,0.74))]"
          />

          {/* vertical label, left edge */}
          <span className="absolute left-5 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 md:block">
            <span className="micro text-paper/70">/ Portfolio · 2K26</span>
          </span>

          {/* scroll hint, right edge */}
          <span className="absolute right-5 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] md:block">
            <span className="micro text-paper/70">Scroll to play reel ↓</span>
          </span>

          {/* giant DESIGN / STUDIO, opposite corners */}
          <h1 className="pointer-events-none absolute inset-0">
            <span className="absolute left-3 top-[4%] block font-black uppercase leading-[0.82] tracking-[-0.05em] text-paper text-[11vw] md:left-6 md:text-[7vw]">
              Design
            </span>
            <span className="absolute bottom-[4%] right-3 block font-black uppercase leading-[0.82] tracking-[-0.05em] text-paper text-[11vw] md:right-6 md:text-[7vw]">
              Studio
            </span>
          </h1>

          {/* tagline, bottom-left */}
          <p className="absolute bottom-[9%] left-4 max-w-xs text-[13px] font-medium uppercase leading-snug tracking-[0.04em] text-paper/90 md:left-10 md:text-sm">
            Websites that get local brands
            <br />
            found on Google &amp; booked solid.
          </p>
        </div>
      </div>

      {/* ── Trust carousel — rises in at the foot of the formed reel ── */}
      <div
        data-reel-proof
        className="pointer-events-none absolute inset-x-0 bottom-[6%]"
      >
        <p className="micro text-center text-paper/45">
          Trusted by owners who needed results
        </p>
        <div className="marquee-wrap mt-3.5">
          {/* Enough identical sequences to overflow any monitor; GSAP loops the
              track by exactly one sequence width, so the join is seamless at
              any screen size (see the marquee loop in useGSAP). */}
          <div data-reel-track className="flex w-max will-change-transform">
            {Array.from({ length: 8 }).map((_, copy) => (
              <div
                key={copy}
                data-reel-seq
                className="flex shrink-0 items-center"
                aria-hidden={copy > 0 || undefined}
              >
                {REEL_BRANDS.map((b) => (
                  <span
                    key={b}
                    className="flex shrink-0 items-center gap-[clamp(1.75rem,4vw,3rem)] pr-[clamp(1.75rem,4vw,3rem)]"
                  >
                    <span className="whitespace-nowrap text-base font-semibold uppercase tracking-tight text-paper/50 md:text-lg">
                      {b}
                    </span>
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-oxblood/40" aria-hidden />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top-right chrome: socials + a menu button (the only nav until scroll) ── */}
      <div
        data-hero-chrome
        className="pointer-events-auto absolute right-4 top-5 z-20 flex flex-col items-end gap-3.5 md:right-8 md:top-7"
      >
        <div className="flex items-center gap-4 text-paper">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="opacity-80 transition-opacity hover:opacity-100 focus-ring"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="opacity-80 transition-opacity hover:opacity-100 focus-ring"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="opacity-80 transition-opacity hover:opacity-100 focus-ring"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          </a>
        </div>
        <button
          type="button"
          onClick={openMenu}
          aria-label="Open menu"
          className="press focus-ring flex items-center gap-2 rounded-full border border-paper/25 bg-paper/5 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-paper backdrop-blur-sm transition-colors hover:bg-paper/15"
        >
          Menu
          <span className="flex flex-col gap-[3px]">
            <span className="block h-[1.5px] w-3.5 rounded-full bg-paper" />
            <span className="block h-[1.5px] w-3.5 rounded-full bg-paper" />
          </span>
        </button>
      </div>
    </section>
  );
}
