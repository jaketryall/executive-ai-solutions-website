"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";

const STEPS = [
  {
    n: "01",
    title: "The call",
    copy: "Twenty minutes on your business, your customers, and what winning looks like. You get a fixed quote within two days.",
  },
  {
    n: "02",
    title: "The design",
    copy: "You see real pages in your brand, not wireframes. We iterate until you'd happily put it on a billboard.",
  },
  {
    n: "03",
    title: "The build",
    copy: "Hand-coded, fast, and search-ready from day one. No page builders, nothing you'll outgrow.",
  },
  {
    n: "04",
    title: "The growth",
    copy: "Launch is the start. SEO, Google Ads, and AI automation keep the site earning its keep.",
  },
];

export function Process() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-step]"), { autoAlpha: 1 });
        q(".num-fill").forEach((el) => gsap.set(el, { clipPath: "inset(0% 0 0 0)" }));
        return;
      }

      // step cards settle in together
      gsap.fromTo(
        q("[data-step]"),
        { autoAlpha: 0, scale: 0.97 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.9,
          ease: EASE_STRUCTURE,
          stagger: 0.1,
          onComplete() {
            gsap.set(this.targets(), { clearProps: "transform" });
          },
          scrollTrigger: { trigger: q("[data-step]")[0], start: "top 82%" },
        }
      );

      // numerals fill as each card crosses the read band — user-paced, reversible,
      // linear against scroll (scrub smoothing supplies the settle, not a curve)
      q("[data-step]").forEach((row) => {
        const fillEl = row.querySelector(".num-fill");
        if (!fillEl) return;
        gsap.fromTo(
          fillEl,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top 78%",
              end: "top 42%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section id="process" ref={root} data-nav="light" className="relative z-0 pb-[89px] pt-[89px] md:pb-[144px] md:pt-[144px]">
      {/* header rides the open canvas; the steps are the cards */}
      <div className="mx-auto max-w-[1280px] px-[21px] md:px-[55px]">
        <h2 className="t-display-lg max-w-[16ch]">How a project runs</h2>
      </div>

      {/* step cards — gutter-wide grid (media/card content runs wider than prose) */}
      <div className="mt-[55px] px-[21px] md:px-[55px]">
        <div className="grid grid-cols-1 gap-[13px] md:grid-cols-2 md:gap-[21px]">
          {STEPS.map((s) => (
            <div
              key={s.n}
              data-step
              className="rounded-[18px] bg-panel p-[34px] md:p-[42px]"
            >
              <span className="num t-numeral relative block select-none leading-[0.8]" aria-hidden>
                <span className="num-outline">{s.n}</span>
                <span className="num-fill">{s.n}</span>
              </span>
              <h3 className="t-title mt-[34px]">
                <span className="sr-only">{`Step ${s.n}: `}</span>
                {s.title}
              </h3>
              <p className="mt-[13px] max-w-[46ch] text-ink/75">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
