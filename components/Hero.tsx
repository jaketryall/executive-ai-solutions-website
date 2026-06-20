"use client";

// Hero — EXPERIMENT: a LIGHT (paper) background with a centered mockup card on
// it, framed by the DESIGN / STUDIO wordmark in opposite corners (now dark).
// Static — it scrolls away into the work; the layers parallax on scroll. (The
// dark full-bleed cover is the prior version in git if this doesn't land.)

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillCTA from "./PillCTA";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// project mockups the card cross-fades through, each captioned with its client
// (mapping mirrors WorkSection's WORKS; swap for real per-client screenshots)
const COVER = [
  { src: "/Celestial Laptop Mockup.webp", client: "Wings N Wheels", label: "Local detailing" },
  { src: "/Elegant Black Laptop Mockup.webp", client: "Desert Wings", label: "Flight school" },
  { src: "/custom-dashboard-mockup.webp", client: "Riled Up", label: "Coaching platform" },
  { src: "/Rubber iPhone Mockup.webp", client: "AZ Gyro Tours", label: "Tourism" },
];

// client brands — the mini "trusted by" marquee under the statement. Text
// wordmarks for now; swap in real logo SVGs/images here when available.
const CLIENTS = ["Riled Up", "Desert Wings", "Wings N Wheels", "Lando", "AZ Gyro Tours"];

// `tagline` is resolved server-side (ad campaign + geo) and passed in, so the
// matched copy renders with no flicker. See lib/personalize.ts.
export default function Hero({
  tagline = "Websites that get local brands found on Google & booked solid.",
}: {
  tagline?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);
  const [reelOpen, setReelOpen] = useState(false);

  const openMenu = () => window.dispatchEvent(new Event("eas-open-menu"));

  // rotate the card through the project mockups
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % COVER.length), 3800);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = ref.current;

        // Socials/menu fade out over the first stretch of scroll so they don't
        // collide with the nav dock as it reveals.
        gsap.to("[data-hero-chrome]", {
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "+=30%", scrub: true },
        });

        // Parallax — layers drift at different rates as the hero scrolls out:
        // the mockup card lags while the wordmark splits apart.
        const drift = (sel: string, vars: gsap.TweenVars) =>
          gsap.to(sel, {
            ...vars,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
          });
        drift("[data-hero-mockup]", { y: 40 });
        drift("[data-hero-design]", { y: -100 });
        drift("[data-hero-tagline]", { y: -50 });
        // NB: the bottom-right wordmark ([data-morph]) deliberately has NO drift
        // — it moves at pure scroll speed so it stays just ahead of the rising
        // work box (over the light hero) while WorkSection.tsx morphs it to WORK.
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="top"
      className="relative h-svh overflow-hidden bg-paper-warm text-ink"
    >
      {/* centered mockup card sitting on the light background */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          data-hero-mockup
          className="w-[44%] min-w-[280px] max-w-[660px] will-change-transform"
        >
          <div className="relative aspect-16/10 overflow-hidden rounded-[24px] border border-ink/10 bg-ink shadow-[0_40px_90px_-35px_rgba(26,24,22,0.5)]">
            {COVER.map((m, i) => (
              <Image
                key={m.src}
                src={m.src}
                alt=""
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 90vw, 42vw"
                aria-hidden
                className="object-cover transition-opacity duration-1000 ease-out"
                style={{ opacity: i === slide ? 1 : 0 }}
              />
            ))}
          </div>
          {/* caption — which client this mockup belongs to */}
          <div className="mt-4 flex items-center justify-center gap-2.5">
            <span className="text-sm font-semibold tracking-tight text-ink">
              {COVER[slide].client}
            </span>
            <span className="h-1 w-1 rounded-full bg-oxblood/50" aria-hidden />
            <span className="micro text-ink/55">{COVER[slide].label}</span>
          </div>
        </div>
      </div>

      {/* vertical label, left edge */}
      <span className="absolute left-5 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 md:block">
        <span className="micro text-ink/45">/ Portfolio · 2K26</span>
      </span>

      {/* scroll hint, right edge */}
      <span className="absolute right-5 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] md:block">
        <span className="micro text-ink/45">Scroll to see the work ↓</span>
      </span>

      {/* giant DESIGN / STUDIO, opposite corners. STUDIO is built as a per-letter
          masked wordmark so it can morph into WORK on scroll (driver lives in
          WorkSection.tsx). aria-label keeps the heading reading "Design Studio". */}
      <h1 aria-label="Design Studio" className="pointer-events-none absolute inset-0">
        <span
          data-hero-design
          className="absolute left-4 top-[5%] block font-black uppercase leading-[0.82] tracking-[-0.05em] text-ink text-[11vw] will-change-transform md:left-10 md:text-[7vw]"
        >
          Design
        </span>
        {/* bottom-right wordmark: reads STUDIO, morphs to WORK letter-by-letter as
            the work section rises. Two right-aligned words stacked in one box;
            each glyph in its own clip mask. STUDIO shown, WORK clipped below. */}
        <span
          data-morph
          aria-hidden
          className="pointer-events-none absolute bottom-[5%] right-4 z-30 grid items-end justify-items-end font-black uppercase leading-[0.82] tracking-[-0.05em] text-ink text-[11vw] will-change-transform md:right-10 md:text-[7vw]"
        >
          <span className="[grid-area:1/1] whitespace-nowrap">
            {"STUDIO".split("").map((c, i) => (
              <span key={`s${i}`} className="morph-mask">
                <span data-morph-out className="morph-letter">
                  {c}
                </span>
              </span>
            ))}
          </span>
          <span className="[grid-area:1/1] whitespace-nowrap">
            {"WORK".split("").map((c, i) => (
              <span key={`w${i}`} className="morph-mask">
                <span data-morph-in className="morph-letter morph-letter-in">
                  {c}
                </span>
              </span>
            ))}
          </span>
        </span>
      </h1>

      {/* statement + mini "what we do" marquee, bottom-left */}
      <div
        data-hero-tagline
        className="absolute bottom-[8%] left-4 max-w-sm will-change-transform md:left-10"
      >
        <p className="text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-ink md:text-xl">
          {tagline}
        </p>
        <div className="mt-6 flex items-center gap-5">
          <PillCTA label="Start a project" href="#contact" />
          <a
            href="#work"
            className="group focus-ring inline-flex items-center gap-1.5 text-[13px] font-medium tracking-tight text-ink/70 transition-colors hover:text-ink"
          >
            See the work
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-y-0.5"
              aria-hidden
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
        <p className="micro mt-6 text-ink/40">Trusted by</p>
        <div className="marquee-wrap mt-2 max-w-[320px]">
          <div className="mini-marquee flex w-max items-center">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex shrink-0 items-center"
                aria-hidden={copy === 1 || undefined}
              >
                {CLIENTS.map((c) => (
                  <span key={c} className="flex shrink-0 items-center gap-3 pr-3">
                    <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-tight text-ink/60">
                      {c}
                    </span>
                    <span className="h-1 w-1 shrink-0 rounded-full bg-oxblood/50" aria-hidden />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top-right chrome: socials + a menu button (fades out on scroll) ── */}
      <div
        data-hero-chrome
        className="pointer-events-auto absolute right-4 top-5 z-20 flex flex-col items-end gap-3.5 md:right-8 md:top-7"
      >
        <div className="flex items-center gap-4 text-ink">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="opacity-70 transition-opacity hover:opacity-100 focus-ring"
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
            className="opacity-70 transition-opacity hover:opacity-100 focus-ring"
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
            className="opacity-70 transition-opacity hover:opacity-100 focus-ring"
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
          className="press focus-ring flex items-center gap-2 rounded-full border border-ink/20 bg-ink/5 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink backdrop-blur-sm transition-colors hover:bg-ink/10"
        >
          Menu
          <span className="flex flex-col gap-[3px]">
            <span className="block h-[1.5px] w-3.5 rounded-full bg-ink" />
            <span className="block h-[1.5px] w-3.5 rounded-full bg-ink" />
          </span>
        </button>
      </div>

      {/* show reel — a looping preview above STUDIO that opens in a lightbox */}
      <button
        type="button"
        onClick={() => setReelOpen(true)}
        aria-label="Watch the show reel"
        className="group focus-ring pointer-events-auto absolute bottom-[24%] right-5 z-20 hidden items-center gap-3 md:right-8 md:flex"
      >
        <span className="relative block h-16 w-28 overflow-hidden rounded-xl border border-ink/10 shadow-lg shadow-ink/15">
          <video
            src="/final-comp.mp4"
            muted
            loop
            autoPlay
            playsInline
            aria-hidden
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </span>
        <span className="text-left">
          <span className="micro block text-ink/45">Show reel</span>
          <span className="text-sm font-semibold tracking-tight text-ink">Watch ↗</span>
        </span>
      </button>

      {reelOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-ink-deep/92 p-6 backdrop-blur-sm"
            onClick={() => setReelOpen(false)}
          >
            <button
              type="button"
              onClick={() => setReelOpen(false)}
              aria-label="Close show reel"
              className="focus-ring absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 text-paper transition-colors hover:bg-paper/10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <video
              src="/final-comp.mp4"
              autoPlay
              controls
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-auto max-w-[92vw] rounded-2xl shadow-2xl"
            />
          </div>,
          document.body,
        )}
    </section>
  );
}
