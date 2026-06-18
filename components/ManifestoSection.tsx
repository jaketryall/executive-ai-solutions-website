"use client";

// Manifesto — a full-bleed rounded dark card with a giant kinetic statement
// over the dimmed reel. zone-dark so the nav colour-splits across its seam.

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import AutoVideo from "./AutoVideo";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const STATEMENT = ["Built", "to be", "Booked."];

export default function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".mani-line", { yPercent: 115 });
        gsap.set("[data-mani-fade]", { opacity: 0, y: 20 });

        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "top 68%" } })
          .to(".mani-line", {
            yPercent: 0,
            duration: 0.95,
            stagger: 0.12,
            ease: "expo.out",
          })
          .to(
            "[data-mani-fade]",
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "expo.out" },
            0.25,
          );

        gsap.to("[data-mani-bg]", {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".mani-line, [data-mani-fade]", { clearProps: "all" });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="px-5 md:px-10 py-6">
      <div className="zone-dark relative flex min-h-[82vh] flex-col items-center justify-center overflow-hidden rounded-[40px] bg-ink-deep px-6 py-24 text-center text-(--fg)">
        {/* dimmed reel backdrop */}
        <div data-mani-bg aria-hidden className="absolute inset-[-8%] z-0">
          <AutoVideo
            src="/final-comp.mp4"
            poster="/video-poster.webp"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-ink-deep/55" />
        </div>

        <p data-mani-fade className="relative z-10 -rotate-2 font-hand text-3xl text-oxblood md:text-4xl">
          The promise
        </p>

        <h2 className="relative z-10 mt-3 font-extrabold uppercase tracking-[-0.03em] leading-[0.9] text-[clamp(3rem,13vw,11rem)]">
          {STATEMENT.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span className="mani-line block">
                {line === "Booked." ? (
                  <>
                    Booked<span className="text-oxblood">.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h2>

        <p
          data-mani-fade
          className="relative z-10 mt-8 max-w-xl text-[15px] leading-relaxed text-(--fg-muted) md:text-lg"
        >
          Strategy, design and motion aimed at one number — the bookings on your
          calendar. Never another forgettable website.
        </p>
      </div>
    </section>
  );
}
