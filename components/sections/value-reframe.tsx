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

/* The value reframe (the Lesse "approach" composition, our copy): a small
   label holds the left margin, the statement reads itself in word by word on
   the open canvas, and a calm logo marquee runs beneath — the page's ONE
   perpetual ambient loop (constant velocity, no scroll reactivity: it is a
   trust row, not an energy strip). */

const STACK = [
  "Google Ads",
  "Google Analytics",
  "Tag Manager",
  "Next.js",
  "Vercel",
  "OpenAI",
  "Resend",
];

export function ValueReframe() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (context, contextSafe) => {
      const q = gsap.utils.selector(root);
      const track = q(".lm-track")[0] as HTMLElement;

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
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
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
          stagger: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        ScrollTrigger.refresh();
      });
      document.fonts.ready.then(buildFill);

      // the marquee — constant velocity, pauses off-screen and on hidden tabs
      if (track) {
        const loop = gsap.to(track, {
          xPercent: -50,
          duration: 36,
          repeat: -1,
          ease: "none",
          paused: true,
        });
        let inView = false;
        const sync = () => {
          if (inView && !document.hidden) loop.play();
          else loop.pause();
        };
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            inView = self.isActive;
            sync();
          },
        });
        document.addEventListener("visibilitychange", sync);
        context.add(() => () => document.removeEventListener("visibilitychange", sync));
      }
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative">
      <div className="wrap py-fib-6 md:py-fib-7">
        <div className="grid gap-fib-4 md:grid-cols-[minmax(180px,240px)_1fr] md:gap-fib-5">
          <p data-anim="label" className="t-meta pt-[0.6em] uppercase text-ink/45">
            Our approach
          </p>
          <p className="vr-line t-display-lg max-w-[30ch]">
            Ads without a page that converts is paying rent on strangers. A
            beautiful site nobody finds is a brochure in a drawer. You need
            the whole click.
          </p>
        </div>
      </div>

      {/* the trust row — what the machine runs on. Calm, constant, unfenced. */}
      <div
        className="lm mt-fib-4 pb-fib-6"
        role="list"
        aria-label={`Built on ${STACK.join(", ")}`}
      >
        <div className="lm-track" aria-hidden>
          {[0, 1].map((set) => (
            <div key={set} className="lm-set">
              {STACK.map((name) => (
                <span key={name} className="lm-mark">
                  {name}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
