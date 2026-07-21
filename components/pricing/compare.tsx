"use client";

import { useRef } from "react";
import { revealUp } from "@/components/anim/reveal";
import { gsap, useGSAP, reducedMotion } from "@/components/anim/ease";

/* The comparison — the burned-owner objection, answered without naming
   anyone (Jake, 2026-07-21: "dont mention specific other companies").
   Every left-column line is a documented industry-wide habit (market
   research 2026-07-21: %-of-spend fees, 6–12-month minimums, blended
   billing, platform lock-in, call-gated pricing); the right column only
   restates what this site already promises elsewhere — nothing new is
   claimed here, it's the same deal laid beside the usual one. Lives
   AFTER the estimator (the prime slot stays the prime slot) and BEFORE
   the sheet appendix. */

const ROWS = [
  {
    usual: "A percentage of your ad spend — the fee grows as your budget does",
    ours: "Flat $500/mo management, whatever you spend",
  },
  {
    usual: "Six- to twelve-month contracts before you've seen a result",
    ours: "Month to month. Leave whenever.",
  },
  {
    usual: "Ad spend and fees blended into one bill",
    ours: "You see every dollar that goes to Google",
  },
  {
    usual: "A website rented on their platform — cancel and it's gone",
    ours: "Your site is yours. Domain, content, code.",
  },
  {
    usual: "Book a call to hear a number",
    ours: "The sheet is on this page, computed live",
  },
];

export function PricingCompare() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      if (reducedMotion()) {
        gsap.set("[data-anim='cmp']", { autoAlpha: 1, y: 0 });
        return;
      }
      revealUp(gsap.utils.selector(root)("[data-anim='cmp']"), root.current);
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-label="How our deal compares to the usual agency deal"
      className="bg-white py-fib-6 text-ink md:py-fib-7"
    >
      <div className="wrap">
        <h2 data-anim="cmp" className="t-display-lg max-w-[16ch]">
          The usual deal, and ours
        </h2>
        <p data-anim="cmp" className="t-lede mt-fib-3 max-w-[46ch] text-ink/70">
          If you&rsquo;ve shopped agencies before, you&rsquo;ve met the fine
          print. Here it is, side by side.
        </p>

        {/* one gray object on the white ground (grounds law) */}
        <div
          data-anim="cmp"
          className="mt-fib-5 rounded-panel bg-panel px-fib-3 py-fib-2 md:px-fib-4"
        >
          {/* column heads — sm+ only; on a phone the marks + weights carry it */}
          <div className="hidden gap-fib-4 border-b border-ink/10 pb-fib-2 pt-fib-2 sm:grid sm:grid-cols-2">
            <span className="t-meta text-ink/45">The usual agency deal</span>
            <span className="t-meta text-ink/70">This one</span>
          </div>
          {ROWS.map((r) => (
            <div
              key={r.ours}
              data-anim="cmp"
              className="grid gap-fib-1 border-b border-ink/10 py-fib-3 last:border-b-0 sm:grid-cols-2 sm:gap-fib-4"
            >
              <p className="flex gap-fib-1 text-[0.9375rem] leading-[1.5] text-ink/50">
                <span aria-hidden className="mt-px shrink-0">
                  ✗
                </span>
                <span>
                  <span className="t-meta mr-fib-1 text-ink/40 sm:hidden">
                    Usual:
                  </span>
                  {r.usual}
                </span>
              </p>
              <p className="flex gap-fib-1 font-semibold leading-[1.5] text-ink">
                <span aria-hidden className="mt-px shrink-0 text-accent">
                  ✓
                </span>
                <span>{r.ours}</span>
              </p>
            </div>
          ))}
        </div>

        <p data-anim="cmp" className="t-meta mt-fib-3 max-w-[52ch] text-ink/45">
          The left column describes common agency practice, not any one
          company. The right column is the deal on this page.
        </p>
      </div>
    </section>
  );
}
