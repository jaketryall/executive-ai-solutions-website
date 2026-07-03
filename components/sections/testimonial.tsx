"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";

/* One real voice, given room — the objection-killer right before the ask.
   REAL QUOTE NEEDED: the text below is a visible placeholder. Swap in the
   actual Desert Wings quote (and the right attribution) before deploying. */
const QUOTE = {
  text: "[ Real Desert Wings quote goes here, two or three sentences from the owner about working with you and what the site did for the business ]",
  name: "Owner, Desert Wings Flight School",
  meta: "Live client · desertwingsflightschool.com",
};

export function Testimonial() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        return;
      }

      gsap.fromTo(
        q("[data-anim='quote']"),
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 74%" },
        }
      );
      gsap.fromTo(
        q("[data-anim='attr']"),
        { autoAlpha: 0, y: 13 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: EASE_STRUCTURE,
          delay: 0.2,
          scrollTrigger: { trigger: root.current, start: "top 74%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="light"
      aria-label="What our client says"
      className="relative pb-[89px] pt-[89px] md:pb-[144px] md:pt-[144px]"
    >
      <div className="mx-auto max-w-[1280px] px-[21px] md:px-[55px]">
        <blockquote data-anim="quote" className="t-display-lg max-w-[26ch]">
          {QUOTE.text}
        </blockquote>
        <div data-anim="attr" className="mt-[34px] flex items-center gap-[13px]">
          <span className="flex h-[44px] w-[44px] items-center justify-center overflow-hidden rounded-full bg-ink/[0.06]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/work/desert-wings-logo.png" alt="" className="h-[26px] w-[26px] object-contain" />
          </span>
          <div>
            <p className="font-[600]">{QUOTE.name}</p>
            <p className="t-meta mt-[2px] text-ink/60">{QUOTE.meta}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
