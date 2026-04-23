"use client";

import { useRef, useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { gsap, SplitText, ScrollTrigger } from "@/lib/gsap-setup";
import { useIsomorphicLayoutEffect } from "@/lib/motion/primitives";

const BELIEFS = [
  {
    num: "01",
    title: "We ship wet",
    body: "Polish is a veil. We'd rather hand off something alive and half-dry than perfect and brittle. The next fix gets made Monday.",
  },
  {
    num: "02",
    title: "Motion is a feature, not a coat of paint",
    body: "Animation carries meaning — hierarchy, causality, feedback. We design it in from the first sketch, not on top of it at the end.",
  },
  {
    num: "03",
    title: "The hardest skill is deletion",
    body: "Good design engineering is knowing what to cut — and having the spine to cut it, today, before anyone gets attached. Everything you keep pays rent.",
  },
];

// ─── progress hook ────────────────────────────────────────────────────────────
// Derives a 0..1 progress value based on how far the section has scrolled
// through its pinned range, using a passive scroll listener — avoids wiring
// state into the scrub timeline's onUpdate which would hammer React renders.
function useScrollProgress(ref: React.RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const scrollable = Math.max(1, el.offsetHeight - window.innerHeight);
      const scrolled = Math.max(0, -rect.top);
      setProgress(Math.min(1, scrolled / scrollable));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [ref]);

  return progress;
}

// ─── component ────────────────────────────────────────────────────────────────
export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(sectionRef);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const ctx = gsap.context(() => {
      const beliefEls = gsap.utils.toArray<HTMLElement>(
        stage.querySelectorAll(".belief")
      );
      if (!beliefEls.length) return;

      // ── initial state: belief 0 visible, rest hidden ─────────────────────
      beliefEls.forEach((el, i) => {
        gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 50 });
      });

      // ── split text ────────────────────────────────────────────────────────
      // Title: words (for per-word stagger); body: lines only (perf)
      const splits = beliefEls.map((el) => {
        const titleEl = el.querySelector<HTMLElement>("[data-belief-title]");
        const bodyEl = el.querySelector<HTMLElement>("[data-belief-body]");
        return {
          title: titleEl
            ? SplitText.create(titleEl, { type: "words, lines", mask: "lines" })
            : null,
          body: bodyEl
            ? SplitText.create(bodyEl, { type: "lines", mask: "lines" })
            : null,
        };
      });

      // Hide all split words/lines except belief 0 (already readable from init)
      splits.forEach((s, i) => {
        if (i !== 0) {
          if (s.title) gsap.set(s.title.words, { yPercent: 110 });
          if (s.body) gsap.set(s.body.lines, { yPercent: 110 });
        }
      });

      // ── master scrub timeline ─────────────────────────────────────────────
      // The section is 300vh tall with a sticky stage — scroll range =
      // section.offsetHeight - window.innerHeight = 200vh of pinned travel.
      // We attach the ScrollTrigger to the section (not the pinned stage)
      // so the progress maps correctly to that 200vh range.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${section.offsetHeight - window.innerHeight}`,
          scrub: 0.8,
          pin: stage,
          pinSpacing: false, // section's own 300vh height provides spacing
          anticipatePin: 1,
        },
      });

      // ── transitions at 1/3 and 2/3 of the timeline ───────────────────────
      // Total timeline duration is 1 (normalised). Each transition happens
      // at t = (i+1) / 3 boundaries.
      const TRANSITION_WINDOW = 0.06; // fraction of total timeline

      for (let i = 0; i < beliefEls.length - 1; i++) {
        const boundary = (i + 1) / beliefEls.length; // 0.333... or 0.666...
        const exitStart = boundary - TRANSITION_WINDOW * 1.5;
        const enterStart = boundary;

        const outWords = [
          ...(splits[i]?.title?.words ?? []),
          ...(splits[i]?.body?.lines ?? []),
        ];
        const inWords = [
          ...(splits[i + 1]?.title?.words ?? []),
          ...(splits[i + 1]?.body?.lines ?? []),
        ];

        // Exit current belief: words rise up + container fades out
        tl.to(
          outWords,
          {
            yPercent: -110,
            opacity: 0,
            stagger: 0.012,
            duration: TRANSITION_WINDOW,
            ease: "expo.inOut",
          },
          exitStart
        );
        tl.to(
          beliefEls[i],
          { opacity: 0, duration: TRANSITION_WINDOW * 0.4, ease: "power2.in" },
          boundary - TRANSITION_WINDOW * 0.5
        );

        // Enter next belief: container fades in, words rise into place
        tl.fromTo(
          beliefEls[i + 1],
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: TRANSITION_WINDOW * 0.5,
            ease: "expo.out",
          },
          enterStart
        );
        tl.fromTo(
          inWords,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.014,
            duration: TRANSITION_WINDOW * 1.2,
            ease: "expo.out",
          },
          enterStart + TRANSITION_WINDOW * 0.1
        );
      }

      // ── cleanup splits in context cleanup ─────────────────────────────────
      return () => {
        splits.forEach((s) => {
          s.title?.revert();
          s.body?.revert();
        });
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{
        background: "var(--paper)",
        // 300vh = 1 viewport pinned + 200vh of scroll travel
        height: "300vh",
      }}
    >
      {/* ── sticky stage ── */}
      <div
        ref={stageRef}
        className="sticky top-0 h-screen flex flex-col overflow-hidden"
        style={{ paddingInline: "clamp(1.5rem, 6vw, 6rem)" }}
      >
        {/* SectionHeader */}
        <div className="max-w-[1400px] mx-auto w-full pt-10 md:pt-14 shrink-0">
          <SectionHeader
            sectionRef={sectionRef}
            number="05"
            name="Mission"
            sku="EAS/2026/Q2"
            progress={progress}
          />
        </div>

        {/* Belief stage */}
        <div className="relative max-w-[1400px] mx-auto w-full flex-1 flex items-center">
          {BELIEFS.map((b) => (
            <article
              key={b.num}
              className="belief absolute inset-0 flex flex-col justify-center"
              style={{ willChange: "opacity, transform" }}
            >
              {/* Giant outlined numeral — ghost anchor behind content */}
              <span
                aria-hidden
                className="absolute font-display font-black leading-none select-none pointer-events-none"
                style={{
                  fontSize: "clamp(14rem, 26vw, 26rem)",
                  letterSpacing: "-0.05em",
                  color: "transparent",
                  WebkitTextStroke: "1.5px var(--oxblood)",
                  opacity: 0.22,
                  zIndex: 0,
                  left: "-4%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  userSelect: "none",
                }}
              >
                {b.num}
              </span>

              {/* Content — sits above the numeral */}
              <div
                className="relative max-w-[72ch]"
                style={{ zIndex: 1 }}
              >
                <div
                  className="font-mono text-[11px] uppercase tracking-[0.22em] mb-5"
                  style={{ color: "var(--taupe)" }}
                >
                  {b.num} ·
                </div>

                <h3
                  data-belief-title
                  className="font-display font-black leading-[1.05] mb-6"
                  style={{
                    color: "var(--ink)",
                    fontSize: "clamp(2.4rem, 5.2vw, 4.6rem)",
                    letterSpacing: "-0.035em",
                  }}
                >
                  {b.title}
                  <span style={{ color: "var(--oxblood)" }}>.</span>
                </h3>

                <p
                  data-belief-body
                  className="leading-normal max-w-[58ch]"
                  style={{
                    color: "var(--ink)",
                    opacity: 0.85,
                    fontSize: "clamp(15px, 1.4vw, 18px)",
                  }}
                >
                  {b.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
