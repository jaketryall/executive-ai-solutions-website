"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import { useIsomorphicLayoutEffect } from "@/lib/motion/primitives";

type Quote = { q: string; name: string; role: string };

const QUOTES: Quote[] = [
  {
    q: "They shipped what three agencies said wasn't possible.",
    name: "Adventure Air",
    role: "Aviation · 2024",
  },
  {
    q: "Built faster than my internal team estimated. Still running two years later.",
    name: "Wings N Wheels",
    role: "Automotive · 2022",
  },
  {
    q: "The estimator on their site gave me a number in 30 seconds. That's the kind of studio they are.",
    name: "Riled Up",
    role: "Consumer · 2025",
  },
];

const ROTATE_MS = 8000;

export default function TestimonialMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const attrRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // `idx` is the target quote the rotation wants to show.
  // `displayIdx` is what's actually painted. When they diverge, the exit
  // cascade runs on the current paint, then displayIdx catches up.
  const [idx, setIdx] = useState(0);
  const [displayIdx, setDisplayIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const animatingRef = useRef(false);

  const inView = useInView(sectionRef, { once: true, amount: 0.4 });

  // --- Auto-advance interval ---------------------------------------------
  useEffect(() => {
    if (paused || !inView) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % QUOTES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(t);
  }, [paused, inView]);

  // --- Exit cascade (idx moves ahead of displayIdx) ----------------------
  useIsomorphicLayoutEffect(() => {
    if (idx === displayIdx) return;
    const quoteEl = quoteRef.current;
    const attrEl = attrRef.current;
    if (!quoteEl) {
      setDisplayIdx(idx);
      return;
    }

    // Reduced motion: skip the cascade, snap to next quote.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplayIdx(idx);
      return;
    }

    animatingRef.current = true;
    const split = SplitText.create(quoteEl, { type: "chars", charsClass: "t-char" });
    const tl = gsap.timeline({
      onComplete: () => {
        split.revert();
        setDisplayIdx(idx); // React re-renders with the next quote
      },
    });
    tl.to(split.chars, {
      y: 36,
      opacity: 0,
      duration: 0.4,
      stagger: 0.015,
      ease: "power2.in",
    });
    if (attrEl) {
      tl.to(attrEl, { opacity: 0, y: 12, duration: 0.3, ease: "power2.in" }, 0);
    }
    return () => {
      tl.kill();
      split.revert();
    };
  }, [idx, displayIdx]);

  // --- Enter cascade (runs when the painted quote catches up) -------------
  // Also fires once on initial in-view reveal for displayIdx=0.
  const runEnter = useCallback(() => {
    const quoteEl = quoteRef.current;
    const attrEl = attrRef.current;
    if (!quoteEl) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(quoteEl, { opacity: 1, y: 0 });
      if (attrEl) gsap.set(attrEl, { opacity: 1, y: 0 });
      animatingRef.current = false;
      return;
    }

    const split = SplitText.create(quoteEl, { type: "chars", charsClass: "t-char" });
    gsap.set(split.chars, { y: -36, opacity: 0 });
    if (attrEl) gsap.set(attrEl, { opacity: 0, y: -8 });

    const tl = gsap.timeline({
      onComplete: () => {
        split.revert();
        animatingRef.current = false;
      },
    });
    tl.to(split.chars, {
      y: 0,
      opacity: 1,
      duration: 0.55,
      stagger: 0.015,
      ease: "power2.out",
    });
    if (attrEl) {
      tl.to(
        attrEl,
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        0.15
      );
    }
  }, []);

  // Initial in-view reveal
  useIsomorphicLayoutEffect(() => {
    if (!inView) return;
    runEnter();
  }, [inView, runEnter]);

  // Subsequent enters: fire whenever displayIdx changes (except initial mount,
  // which is handled by the inView effect above).
  const prevDisplayRef = useRef(displayIdx);
  useIsomorphicLayoutEffect(() => {
    if (prevDisplayRef.current === displayIdx) return;
    prevDisplayRef.current = displayIdx;
    runEnter();
  }, [displayIdx, runEnter]);

  // --- Velocity-skew on the marquee (preserved from prior implementation) -
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const marquee = marqueeRef.current;
    if (!section || !marquee) return;

    const ctx = gsap.context(() => {
      const skewTo = gsap.quickTo(marquee, "skewY", {
        duration: 0.4,
        ease: "power3.out",
      });
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          skewTo(gsap.utils.clamp(-4, 4, v / 800));
        },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const current = QUOTES[displayIdx];

  return (
    <section
      ref={sectionRef}
      data-bg="ink-deep"
      data-nav-num="02"
      data-nav-name="TESTIMONIALS"
      className="relative overflow-hidden"
      style={{ background: "var(--ink-deep)" }}
    >
      {/* Top oxblood hairline — "seam in" from the cream hero above */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--oxblood)", opacity: 0.7 }}
      />

      {/* Giant oxblood open quote — left anchor */}
      <span
        aria-hidden
        className="absolute select-none pointer-events-none font-display font-black leading-none"
        style={{
          fontSize: "clamp(16rem, 28vw, 30rem)",
          color: "transparent",
          WebkitTextStroke: "1.5px var(--oxblood)",
          opacity: 0.55,
          top: "42%",
          left: "-2%",
          transform: "translateY(-50%)",
          zIndex: 0,
          letterSpacing: "-0.05em",
        }}
      >
        &ldquo;
      </span>

      {/* Giant oxblood close quote — right anchor */}
      <span
        aria-hidden
        className="absolute select-none pointer-events-none font-display font-black leading-none"
        style={{
          fontSize: "clamp(16rem, 28vw, 30rem)",
          color: "transparent",
          WebkitTextStroke: "1.5px var(--oxblood)",
          opacity: 0.55,
          top: "42%",
          right: "-2%",
          transform: "translateY(-50%)",
          zIndex: 0,
          letterSpacing: "-0.05em",
        }}
      >
        &rdquo;
      </span>

      {/* Pull-quote hero */}
      <div
        className="relative px-6 md:px-12 lg:px-24 pt-32 md:pt-40 pb-20 md:pb-28"
        style={{ zIndex: 2 }}
      >
        <div
          className="mx-auto text-center"
          style={{ maxWidth: "1100px" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <p
            ref={quoteRef}
            aria-live="polite"
            className="font-display font-black"
            style={{
              color: "var(--paper)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              opacity: 0, // hidden until the in-view enter cascade runs
            }}
          >
            {current.q}
          </p>

          <div
            ref={attrRef}
            className="mt-10 md:mt-12 flex items-center justify-center gap-4"
            style={{ opacity: 0 }}
          >
            <span
              className="font-display font-medium"
              style={{
                color: "var(--paper)",
                fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)",
                letterSpacing: "-0.01em",
              }}
            >
              {current.name}
            </span>
            <span
              aria-hidden
              className="h-px w-8"
              style={{ background: "rgba(229,225,219,0.35)" }}
            />
            <span
              className="font-mono uppercase"
              style={{
                color: "rgba(229,225,219,0.6)",
                fontSize: "11px",
                letterSpacing: "0.18em",
              }}
            >
              {current.role}
            </span>
          </div>

          {/* Index pips */}
          <div className="mt-10 flex items-center justify-center gap-2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (animatingRef.current) return;
                  if (i === displayIdx) return;
                  setIdx(i);
                }}
                aria-label={`Show testimonial ${i + 1}`}
                aria-current={i === displayIdx ? "true" : undefined}
                className="transition-all duration-300"
                style={{
                  height: "2px",
                  width: i === displayIdx ? "28px" : "14px",
                  background:
                    i === displayIdx
                      ? "var(--oxblood)"
                      : "rgba(229,225,219,0.25)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Client-names marquee — preserved, paper on ink-deep, velocity-skew */}
      <div
        ref={marqueeRef}
        className="relative overflow-hidden pb-16 md:pb-20"
        style={{ zIndex: 1, willChange: "transform" }}
      >
        <div className="flex gap-16 md:gap-24 marquee-track whitespace-nowrap">
          {[...QUOTES, ...QUOTES, ...QUOTES].map((q, i) => (
            <div key={i} className="flex items-center gap-16 md:gap-24 shrink-0">
              <span
                className="font-display font-black"
                style={{
                  color: "var(--paper)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                }}
              >
                {q.name}
              </span>
              <span
                aria-hidden
                className="inline-block rounded-full"
                style={{
                  width: "10px",
                  height: "10px",
                  background: "var(--oxblood)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
