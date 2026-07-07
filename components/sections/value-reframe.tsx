"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";

/* The value reframe — the page's one centered statement (centering 1/2).
   Three beliefs, three registers: the first lands on enter, the middle one
   reads itself in word by word as you scroll (the fill paces the reading),
   and the conclusion arrives once the middle has been read. */
export function ValueReframe() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (context, contextSafe) => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        q("[data-anim='open']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        }
      );
      gsap.fromTo(
        q("[data-anim='close']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: q(".vr-mid")[0], start: "top 45%", once: true },
        }
      );

      // the middle sentence fills word-by-word, scroll as the clock
      let cancelled = false;
      context.add(() => () => {
        cancelled = true;
      });
      const buildFill = contextSafe!(() => {
        if (cancelled) return;
        const mid = q(".vr-mid")[0];
        if (!mid) return;
        const split = SplitText.create(mid, { type: "words", wordsClass: "mw", aria: "none" });
        gsap.set(split.words, { opacity: 0.22 });
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: mid,
            start: "top 78%",
            end: "top 38%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        ScrollTrigger.refresh();
      });
      document.fonts.ready.then(buildFill);
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative">
      {/* the statement is an OBJECT on the canvas — an ink panel floating at
          the card system's inset, not bare type on the ground */}
      <div className="dark-chapter mx-[8px] rounded-panel md:mx-[13px]">
        <div className="mx-auto flex w-full max-w-[880px] flex-col items-center gap-fib-4 px-fib-3 py-fib-6 text-center md:py-fib-7">
          <p data-anim="open" className="t-display-lg text-balance">
            Ads without a page that converts is paying rent on strangers.
          </p>
          <p className="vr-mid t-display-lg text-balance">
            A beautiful site nobody finds is a brochure in a drawer.
          </p>
          <p data-anim="close" className="t-display-lg text-balance">
            You need the whole click.
          </p>
        </div>
      </div>
    </section>
  );
}
