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

/* The value reframe — REVIVED 2026-07-17 (Jake: "did we ever add the
   manifesto") as the mini-about between Services and Proof: the Lesse
   "approach" composition, a small label holding the left margin while
   the statement reads itself in word by word. The old tool-marquee
   beneath it stays dead (marquees were buried earlier today). The
   closing line carries identity + locality — the page's only
   who-are-these-people beat. */

export function ValueReframe() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (context, contextSafe) => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, y: 0 });
        return; // statement rests full ink, marquee rests static
      }

      gsap.fromTo(
        q("[data-anim='label']"),
        { autoAlpha: 0, y: 13 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 75%", toggleActions: "play none none none" },
        }
      );

      // the whole statement fills word-by-word, scroll as the clock
      let cancelled = false;
      context.add(() => () => {
        cancelled = true;
      });
      const buildFill = contextSafe!(() => {
        if (cancelled) return;
        const line = q(".vr-line")[0];
        if (!line) return;
        const split = SplitText.create(line, { type: "words", wordsClass: "mw", aria: "none" });
        gsap.set(split.words, { opacity: 0.18 });
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "top 40%",
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
    // THE MONUMENT (Jake, 2026-07-18: "more dramatic and meaningful or
    // people will scroll past") — viral's mission catches because it's
    // SHORT at display scale; ours was three sentences at the reading
    // register, a paragraph wearing a statement's badge. Now: the two
    // metaphors set up quietly, and the payoff stands at the hero-claim
    // register (the page's third statement peak) inking itself in
    // word by word. Cathedral air around it.
    <section ref={root} className="relative bg-white">
      <div className="wrap py-fib-7 text-center md:py-fib-8">
        <p data-anim="label" className="t-meta uppercase text-ink/45">
          Our approach
        </p>
        <p
          data-anim="label"
          className="t-lede mx-auto mt-fib-3 max-w-[46ch] text-ink/55"
        >
          Ads without a page that converts is paying rent on strangers. A
          beautiful site nobody finds is a brochure in a drawer.
        </p>
        <p className="t-statement t-statement--hero mx-auto mt-fib-4 max-w-[16ch]">
          <span className="vr-line">You need the whole click.</span>
        </p>
        {/* the mini-about: identity + locality, one breath */}
        <p data-anim="label" className="mx-auto mt-fib-5 max-w-[52ch] text-ink/60">
          We&rsquo;re Executive AI Solutions &mdash; a Mesa team that designs
          the ad, builds the page, and wires the follow-up, end to end. The
          number is on the page before you spend a dollar.
        </p>
      </div>
    </section>
  );
}
