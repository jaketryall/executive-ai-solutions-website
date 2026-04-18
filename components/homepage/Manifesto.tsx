"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SIGNATURE_PATH = "M60,160 C65,100 80,60 95,55 C115,48 110,100 108,130 C105,165 90,200 80,210 Q70,220 85,215 C110,205 135,160 155,155 C175,150 170,185 160,200 Q148,218 165,210 C185,200 195,175 210,165 Q230,152 225,180 C220,205 200,225 195,218 Q188,208 210,195 C225,186 250,175 270,200 Q275,208 265,208 C250,208 280,170 310,120 C325,95 340,75 350,70 Q365,64 358,90 C350,120 335,165 340,185 Q345,200 360,185 C375,168 385,145 400,155 Q408,160 400,178 C390,200 365,230 360,248 Q355,265 370,250 C390,228 410,195 430,188 Q445,182 442,200 C438,215 425,225 435,220 Q450,212 460,140 L462,210 Q465,130 475,128 L477,210 C485,205 520,188 560,182 Q600,176 620,190";

const words: Array<{ text: string; accent?: boolean }> = [
  { text: "I" },
  { text: "DON'T" },
  { text: "JUST" },
  { text: "BUILD", accent: true },
  { text: "WEBSITES." },
  { text: "I" },
  { text: "BUILD" },
  { text: "UNFAIR", accent: true },
  { text: "ADVANTAGES.", accent: true },
];

// No serviceWords needed anymore

export default function Manifesto() {
  const desktopRef = useRef<HTMLElement>(null);
  const desktopSigRef = useRef<SVGPathElement>(null);
  const desktopTextRef = useRef<HTMLElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLElement>(null);
  const mobileSigRef = useRef<SVGPathElement>(null);

  // Desktop animations — exact original values
  useIsomorphicLayoutEffect(() => {
    const section = desktopRef.current;
    const sig = desktopSigRef.current;
    if (!section) return;

    const chars = section.querySelectorAll<HTMLSpanElement>("[data-char]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 35%",
            end: "top -20%",
            scrub: 1,
          },
        }
      );

      if (sig) {
        const length = sig.getTotalLength();
        gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(sig, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            end: "top 40%",
            scrub: 1,
          },
        });

        const svgEl = sig.closest("svg");
        if (svgEl) {
          gsap.to(svgEl, {
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          });
        }
        gsap.to(sig, {
          stroke: "rgba(26, 23, 20, 1)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "bottom 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // "BUILD" → "LET'S BUILD" transition to contact
  useIsomorphicLayoutEffect(() => {
    const transitionEl = servicesSectionRef.current;
    const section = desktopRef.current;
    if (!transitionEl || !section) return;

    const allWordSpans = section.querySelectorAll<HTMLElement>(".manifesto-word");
    const iWord = allWordSpans[5];     // "I" from second sentence
    const buildWord = allWordSpans[6]; // "BUILD" from second sentence

    if (!buildWord || !iWord) return;

    const ctx = gsap.context(() => {
      // Phase 1: Fade out ALL words except "I" (5) and "BUILD" (6) — those stay and fly.
      // Ends at "top 50%" to match the fly trigger, so there's no awkward gap where
      // the other words are faded but I/BUILD haven't moved yet.
      allWordSpans.forEach((span, i) => {
        if (i === 5 || i === 6) return;
        gsap.to(span, {
          opacity: 0,
          scale: 0.8,
          filter: "blur(4px)",
          ease: "power2.in",
          scrollTrigger: {
            trigger: transitionEl,
            start: "top 100%",
            end: "top 50%",
            scrub: true,
          },
        });
      });

      // Phase 1b: "BUILD" chars become dark
      const buildChars = Array.from(buildWord.querySelectorAll("[data-char]"));
      buildChars.forEach((char) => {
        gsap.to(char, {
          color: "#1a1816",
          ease: "none",
          scrollTrigger: {
            trigger: transitionEl,
            start: "top 100%",
            end: "top 50%",
            scrub: true,
          },
        });
      });

      // Phase 1c: Pin "I" and "BUILD" and animate to center

      const setFixed = (span: HTMLElement, left: number, top: number) => {
        // Reserve the word's flow slot with an invisible placeholder so neighboring
        // words don't reflow when this one goes position: fixed. Scoped per-word.
        const parent = span.parentNode as HTMLElement | null;
        const key = span.dataset.wordIndex || "";
        if (parent && !parent.querySelector(`[data-placeholder-for="${key}"]`)) {
          const rect = span.getBoundingClientRect();
          const style = window.getComputedStyle(span);
          const placeholder = document.createElement("span");
          placeholder.setAttribute("data-placeholder-for", key);
          placeholder.style.display = "inline-block";
          placeholder.style.width = `${rect.width}px`;
          placeholder.style.height = `${rect.height}px`;
          placeholder.style.marginRight = style.marginRight;
          placeholder.style.marginLeft = style.marginLeft;
          placeholder.style.verticalAlign = style.verticalAlign;
          parent.insertBefore(placeholder, span);
        }

        span.style.position = "fixed";
        span.style.left = `${left}px`;
        span.style.top = `${top}px`;
        span.style.zIndex = "100";
        span.style.margin = "0";
        span.style.overflow = "visible";
      };

      const clearFixed = (span: HTMLElement) => {
        const key = span.dataset.wordIndex || "";
        const placeholder = span.parentNode?.querySelector(`[data-placeholder-for="${key}"]`);
        if (placeholder) placeholder.remove();

        span.style.position = "";
        span.style.left = "";
        span.style.top = "";
        span.style.zIndex = "";
        span.style.margin = "";
        span.style.overflow = "";
      };

      // Generic fly-to-center logic for BOTH "I" and "BUILD" — both take off at the
      // same trigger point; targets are computed so the *phrase* "I BUILD" is centered.
      type FlyState = {
        word: HTMLElement;
        savedRect: { left: number; top: number; width: number; height: number };
        savedGap: number; // natural margin-right captured while in flow
        flyTween: gsap.core.Tween | null;
        returnTween: gsap.core.Tween | null;
      };

      // Headline sits high in the viewport to leave room for big cards.
      const headlineCenterY = () => window.innerHeight * 0.15;

      const buildState: FlyState = {
        word: buildWord,
        savedRect: { left: 0, top: 0, width: 0, height: 0 },
        savedGap: 0,
        flyTween: null,
        returnTween: null,
      };

      const iState: FlyState = {
        word: iWord,
        savedRect: { left: 0, top: 0, width: 0, height: 0 },
        savedGap: 0,
        flyTween: null,
        returnTween: null,
      };

      // Capture natural flow geometry BEFORE setFixed (which zeros margin).
      const captureFlow = (state: FlyState) => {
        const rect = state.word.getBoundingClientRect();
        const gap = parseFloat(window.getComputedStyle(state.word).marginRight) || 0;
        state.savedRect = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
        state.savedGap = gap;
      };

      // Compute phrase-centered targets for both words as a single unit.
      const computePhraseTargets = () => {
        const phraseWidth = iState.savedRect.width + iState.savedGap + buildState.savedRect.width;
        const phraseLeft = (window.innerWidth - phraseWidth) / 2;
        const y = headlineCenterY();
        return {
          i: { left: phraseLeft, top: y - iState.savedRect.height / 2 },
          build: {
            left: phraseLeft + iState.savedRect.width + iState.savedGap,
            top: y - buildState.savedRect.height / 2,
          },
        };
      };

      const flyForward = (state: FlyState, target: { left: number; top: number }) => {
        if (state.returnTween) { state.returnTween.kill(); state.returnTween = null; }
        if (state.flyTween) state.flyTween.kill();

        setFixed(state.word, state.savedRect.left, state.savedRect.top);

        state.flyTween = gsap.to(state.word, {
          left: target.left,
          top: target.top,
          duration: 1,
          ease: "power3.inOut",
        });
      };

      const flyBack = (state: FlyState) => {
        if (state.flyTween) { state.flyTween.kill(); state.flyTween = null; }
        if (state.returnTween) state.returnTween.kill();

        const startLeft = parseFloat(state.word.style.left);
        const startTop = parseFloat(state.word.style.top);
        const scrollAtStart = window.scrollY;

        const proxy = { p: 0 };
        state.returnTween = gsap.to(proxy, {
          p: 1,
          duration: 1,
          ease: "power3.inOut",
          onUpdate: () => {
            const scrollDelta = window.scrollY - scrollAtStart;
            const liveTop = state.savedRect.top - scrollDelta;
            state.word.style.left = `${gsap.utils.interpolate(startLeft, state.savedRect.left, proxy.p)}px`;
            state.word.style.top = `${gsap.utils.interpolate(startTop, liveTop, proxy.p)}px`;
          },
          onComplete: () => {
            clearFixed(state.word);
            state.returnTween = null;
          },
        });
      };

      ScrollTrigger.create({
        trigger: transitionEl,
        start: "top 50%",
        onEnter: () => {
          // Capture both rects BEFORE computing targets — phrase centering needs both widths
          captureFlow(buildState);
          captureFlow(iState);
          const targets = computePhraseTargets();
          flyForward(buildState, targets.build);
          flyForward(iState, targets.i);
        },
        onLeaveBack: () => {
          flyBack(buildState);
          flyBack(iState);
        },
      });

      // Phase 3: Card stack — scroll-linked translateY + per-card "scale punch".
      // Each card scales down and fades as it leaves the viewing zone; the next
      // card scales up and fades in as it enters. Driven off the stack's live
      // viewport position so the effect tracks scroll exactly.
      const cardStack = transitionEl.querySelector<HTMLElement>(".card-stack");
      if (cardStack) {
        const cardElements = Array.from(
          cardStack.querySelectorAll<HTMLElement>(".service-card")
        );
        // Use offsetTop (unaffected by transforms) so per-card position math is stable
        // even as we apply scale/opacity to the cards.
        const cardOffsets = cardElements.map((c) => c.offsetTop);
        const cardHeight =
          cardElements[0]?.offsetHeight || window.innerHeight * 0.78;
        const gapPx =
          parseFloat(window.getComputedStyle(cardStack).rowGap || "0") || 0;
        const cycle = cardHeight + gapPx;
        const totalTravel = cycle * (cardElements.length - 1);

        // Scale punch parameters
        const MIN_SCALE = 0.82;
        const MIN_OPACITY = 0;
        // Distance (in px) from viewport center at which a card is fully "gone"
        const falloff = cardHeight * 0.9;
        // Plateau: within this fraction of `falloff`, a card stays at full scale/opacity
        // so the "active" card never sits at 0.98 — avoids a perceptible pop when the
        // scroll-linked onUpdate first fires.
        const PLATEAU = 0.35;

        gsap.fromTo(
          cardStack,
          { y: 0 },
          {
            y: -totalTravel,
            ease: "none",
            scrollTrigger: {
              trigger: transitionEl,
              start: "top top",
              end: () => `+=${totalTravel}`,
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: () => {
                const stackRect = cardStack.getBoundingClientRect();
                const viewportCenter = window.innerHeight / 2;
                cardElements.forEach((card, i) => {
                  const cardTop = stackRect.top + cardOffsets[i];
                  const cardCenter = cardTop + cardHeight / 2;
                  const distance = Math.abs(cardCenter - viewportCenter);
                  const rawT = Math.min(distance / falloff, 1);
                  // Plateau: below PLATEAU, t = 0 (full presence). Beyond, ramp to 1.
                  const t = Math.max(0, (rawT - PLATEAU) / (1 - PLATEAU));
                  const eased = t * t;
                  const scale = 1 - (1 - MIN_SCALE) * eased;
                  const opacity = 1 - (1 - MIN_OPACITY) * eased;
                  gsap.set(card, { scale, opacity });
                });
              },
            },
          }
        );

        // "I BUILD" exits up-and-fades before the first card settles — starts
        // while the pin is still approaching, gone by the time it locks in.
        gsap.to([iWord, buildWord], {
          y: () => -window.innerHeight * 0.35,
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: transitionEl,
            start: "top 15%",
            end: "top -5%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
      }

      // Release BUILD + "I" from fixed positioning when user scrolls past the pinned range
      ScrollTrigger.create({
        trigger: transitionEl,
        start: "bottom bottom",
        onEnter: () => {
          clearFixed(buildWord);
          clearFixed(iWord);
        },
        onLeaveBack: () => {
          // Re-fix at their last target positions so scrolling back up is seamless
          const targets = computePhraseTargets();
          setFixed(buildWord, targets.build.left, targets.build.top);
          setFixed(iWord, targets.i.left, targets.i.top);
        },
      });

    });

    return () => ctx.revert();
  }, []);

  // Mobile animations
  useIsomorphicLayoutEffect(() => {
    const section = mobileRef.current;
    const sig = mobileSigRef.current;
    if (!section) return;

    const chars = section.querySelectorAll<HTMLSpanElement>("[data-char]");

    const ctx = gsap.context(() => {
      // Text reveals
      gsap.fromTo(
        chars,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            end: "top 45%",
            scrub: 1,
          },
        }
      );

      // Signature draws — starts as section enters viewport, finishes before text
      if (sig) {
        const length = sig.getTotalLength();
        gsap.set(sig, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(sig, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 100%",
            end: "top 65%",
            scrub: 1,
          },
        });

        const svgEl = sig.closest("svg");
        if (svgEl) {
          gsap.to(svgEl, {
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "bottom 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          });
        }
        gsap.to(sig, {
          stroke: "rgba(26, 23, 20, 1)",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "bottom 80%",
            end: "bottom 20%",
            scrub: 1,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const textBlock = (
    <p
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "clamp(2.5rem, 9vw, 8rem)",
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
      }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="manifesto-word inline-flex mr-[0.22em]" data-word-index={wi} style={{ overflow: "hidden" }}>
          {word.text.split("").map((char, ci) => (
            <span
              key={ci}
              data-char
              className="inline-block"
              style={{
                color: word.accent ? "rgba(120, 115, 108, 1)" : "#1a1816",
                willChange: "transform",
                opacity: 0,
              }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </p>
  );

  const signatureSvg = (ref: React.RefObject<SVGPathElement | null>) => (
    <svg
      viewBox="30 30 630 250"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      style={{ height: "auto", opacity: 0.1 }}
    >
      <path
        ref={ref}
        d={SIGNATURE_PATH}
        stroke="rgba(26, 24, 22, 1)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  return (
    <>
      {/* ===== MOBILE ===== */}
      <section
        ref={mobileRef}
        className="relative md:hidden overflow-hidden"
        data-bg="cream"
        style={{ padding: "0 0 10vh", marginTop: "-10vh" }}
      >
        <div className="px-6 text-center">
          {textBlock}
        </div>
      </section>

      {/* ===== DESKTOP — one section, signature draws on cream then bg goes dark ===== */}
      <section
        ref={desktopRef}
        className="relative hidden md:block"
        data-bg="cream"
        style={{ minHeight: "100vh", padding: "15vh 0", paddingBottom: "60vh" }}
      >
        {/* Signature */}
        <div
          className="absolute top-0 left-0 right-0 flex items-start justify-center pointer-events-none pt-[15vh]"
          style={{ zIndex: 2 }}
        >
          <div style={{ width: "clamp(500px, 75vw, 1200px)" }}>
            {signatureSvg(desktopSigRef)}
          </div>
        </div>

        {/* Text — intentionally no explicit z-index so the fixed "I"/"BUILD" words can
             stack at the root level above the services container's stacking context. */}
        <div
          className="relative flex items-start justify-center"
          style={{ minHeight: "100vh", paddingTop: "20vh" }}
        >
          <div className="max-w-[1300px] mx-auto px-8 lg:px-12 text-center">
            {textBlock}
          </div>
        </div>

        {/* Services — "I BUILD" stays pinned at top (real manifesto words), 3 big cards cycle in below */}
        <div
          ref={servicesSectionRef}
          className="relative"
          style={{ zIndex: 1, height: "350vh" }}
        >
          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Card stack — stacked vertically in flow; whole stack translates up on scroll */}
            <div
              className="card-stack absolute left-1/2 -translate-x-1/2"
              style={{
                top: "20%",
                width: "clamp(400px, 85vw, 1500px)",
                display: "flex",
                flexDirection: "column",
                rowGap: "clamp(2rem, 4vh, 4rem)",
                willChange: "transform",
              }}
            >
              {[
                {
                  number: "01",
                  name: "Conversion Websites",
                  desc: "Sites that turn traffic into leads, not just pretty pixels. Built with conversion architecture from the first wireframe — every section earning its scroll.",
                  tag: "Most common starting point",
                },
                {
                  number: "02",
                  name: "AI Automations",
                  desc: "Back-office workflows that run while you sleep. Inbox triage, lead routing, content pipelines, client reporting — wired together with agents that don't miss.",
                  tag: "Where we earn the AI in the name",
                },
                {
                  number: "03",
                  name: "Custom Software",
                  desc: "Internal tools and dashboards built for how your team actually works. No SaaS rental fees, no 12 tabs open — one system shaped to your operation.",
                  tag: "For when off-the-shelf runs out",
                },
              ].map((service) => (
                <div
                  key={service.number}
                  className="service-card relative w-full"
                  style={{
                    backgroundColor: "#141210",
                    borderRadius: "clamp(1.5rem, 2.25vw, 2.25rem)",
                    padding: "clamp(2.5rem, 5vw, 5rem)",
                    border: "1px solid rgba(229, 225, 219, 0.08)",
                    minHeight: "clamp(550px, 78vh, 920px)",
                    overflow: "hidden",
                  }}
                >
                  {/* Giant watermark number — editorial-scale, anchors the card visually */}
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      right: "clamp(-1.5rem, -1.5vw, -0.5rem)",
                      bottom: "clamp(-5rem, -8vw, -3rem)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "clamp(16rem, 32vw, 32rem)",
                      fontWeight: 900,
                      lineHeight: 0.8,
                      letterSpacing: "-0.08em",
                      color: "rgba(255, 200, 150, 0.045)",
                      pointerEvents: "none",
                      userSelect: "none",
                      zIndex: 0,
                    }}
                  >
                    {service.number}
                  </span>

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div className="flex items-start justify-between" style={{ marginBottom: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                      <span
                        style={{
                          color: "rgba(229, 225, 219, 0.35)",
                          fontSize: "clamp(0.7rem, 0.85vw, 0.85rem)",
                          letterSpacing: "0.3em",
                          fontWeight: 600,
                        }}
                      >
                        {service.number} / 03
                      </span>
                      <span
                        style={{
                          color: "rgba(255, 200, 150, 0.6)",
                          fontSize: "clamp(0.65rem, 0.75vw, 0.75rem)",
                          letterSpacing: "0.2em",
                          fontWeight: 500,
                          textTransform: "uppercase",
                        }}
                      >
                        {service.tag}
                      </span>
                    </div>
                    <h3
                      style={{
                        color: "#e5e1db",
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: "clamp(2.5rem, 5.5vw, 5.5rem)",
                        fontWeight: 900,
                        lineHeight: 0.95,
                        letterSpacing: "-0.035em",
                        marginBottom: "clamp(1.25rem, 2.5vw, 2.25rem)",
                      }}
                    >
                      {service.name}
                    </h3>
                    <p
                      style={{
                        color: "rgba(229, 225, 219, 0.55)",
                        fontSize: "clamp(1rem, 1.3vw, 1.35rem)",
                        lineHeight: 1.55,
                        maxWidth: "720px",
                      }}
                    >
                      {service.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
