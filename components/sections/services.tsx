"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";
import { ArtifactFrame } from "@/components/ui/artifact";
import { Monogram } from "@/components/ui/monogram";

/* Services — the funnel, as three stages in order. The ARTIFACT is each
   row's main character (the medium is the message: every stage is proved by
   its real surface — the ad, the landing page, the chat). No numbering —
   the funnel order lives in the copy. Offset-weight alternation runs
   R / L / R down the section. Light canvas — the dark chapter starts at
   Process, one seam later. */

const CHAT_Q = "Do you offer discovery flights on weekends?";

export function Services() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        const chatQ = q(".chat-q")[0] as HTMLElement;
        if (chatQ) chatQ.textContent = CHAT_Q;
        return;
      }

      /* per-row choreography: copy first, artifact scales-and-settles LAST
         (animate-last = highest hierarchy), entry vector alternating with the
         layout; the watermark spine stays put (structure, not an actor) */
      (q("[data-svc-row]") as HTMLElement[]).forEach((row, i) => {
        const fromX = i % 2 === 0 ? 34 : -34; // artifact side: R / L / R
        const tl = gsap.timeline({
          defaults: { ease: EASE_STRUCTURE },
          scrollTrigger: { trigger: row, start: "top 72%", once: true },
        });
        tl.fromTo(
          row.querySelectorAll("[data-anim='copy']"),
          { autoAlpha: 0, y: 21 },
          { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 }
        ).fromTo(
          row.querySelectorAll("[data-anim='artifact']"),
          { autoAlpha: 0, x: fromX, scale: 0.96 },
          { autoAlpha: 1, x: 0, scale: 1, duration: 0.9 },
          "-=0.35"
        );

        /* loop-once micro-demo per artifact (viewport-triggered, one action) */
        if (i === 0) {
          // 01 · the ad's sitelink extension ticks in
          tl.fromTo(
            row.querySelectorAll(".g-ext a"),
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1 },
            "+=0.2"
          );
        }
        if (i === 2) {
          // 03 · the chat types its one question, then the answer arrives
          const chatQ = row.querySelector(".chat-q") as HTMLElement;
          const state = { n: 0 };
          tl.to(
            state,
            {
              n: CHAT_Q.length,
              duration: 0.9,
              ease: "none", // diegetic typing, constant rate
              snap: { n: 1 },
              onUpdate: () => {
                if (chatQ) chatQ.textContent = CHAT_Q.slice(0, state.n);
              },
            },
            "+=0.15"
          ).fromTo(
            row.querySelector(".chat-a"),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            ">-0.05"
          );
        }
      });

      // 02 · contained one-plane parallax on the landing screenshot
      const shot = q("[data-svc-parallax]")[0] as HTMLElement;
      if (shot) {
        gsap.fromTo(
          shot,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: shot.closest("[data-svc-row]"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: root }
  );

  return (
    <section id="services" ref={root} className="relative overflow-x-clip">
      <div className="wrap py-fib-6">
        <header className="max-w-[46ch]">
          <h2 className="t-display-lg">One funnel, three stages</h2>
          <p className="mt-fib-3 text-ink/70">
            Ads bring the click. The site converts it. The AI keeps it. Buy
            the stage you need, or the whole path.
          </p>
        </header>

        <div className="mt-fib-6 flex flex-col gap-fib-6">
          {/* ── 01 · THE CLICK — artifact right ── */}
          <article data-svc-row className="relative">
            <div className="relative z-[1] grid items-center gap-fib-4 rounded-panel bg-panel/60 p-fib-4 md:grid-cols-2 md:gap-fib-5 md:p-fib-5">
              <div>
                <h3 data-anim="copy" className="t-title--lg font-display font-bold">
                  The click
                </h3>
                <p data-anim="copy" className="mt-fib-2 max-w-[44ch] text-ink/75">
                  Google Ads, managed. Campaigns built on what your customers
                  actually search, conversion tracking you can read, and a
                  monthly number that says what a lead cost.
                </p>
                <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
                  <span className="chip">$500/mo + ad spend</span>
                  <span className="chip">No lock-in</span>
                </div>
              </div>
              <div data-anim="artifact" className="w-[min(100%,440px)] justify-self-start md:justify-self-end">
                <ArtifactFrame
                  variant="card"
                  tone="paper"
                  label="The Desert Wings search ad with sitelink extensions"
                >
                  <div className="g-ad mt-0! border-t-0! pt-0!">
                    <p className="g-sponsored">Sponsored</p>
                    <p className="g-url">desertwingsflightschool.com</p>
                    {/* PLACEHOLDER — swap with the real Desert Wings ad, verbatim */}
                    <p className="g-title">
                      Desert Wings Flight School | Learn to Fly at Falcon Field
                    </p>
                    <p className="g-desc">
                      Discovery flights and PPL through CFI training in Mesa, AZ.
                    </p>
                    <div className="g-ext" aria-hidden>
                      <a>Discovery flights</a>
                      <a>Fleet and rates</a>
                      <a>Book a tour</a>
                    </div>
                  </div>
                </ArtifactFrame>
              </div>
            </div>
          </article>

          {/* ── 02 · THE LANDING — artifact left ── */}
          <article data-svc-row className="relative">
            <div className="relative z-[1] grid items-center gap-fib-4 rounded-panel bg-panel/60 p-fib-4 md:grid-cols-2 md:gap-fib-5 md:p-fib-5">
              <div className="md:order-2">
                <h3 data-anim="copy" className="t-title--lg font-display font-bold">
                  The landing
                </h3>
                <p data-anim="copy" className="mt-fib-2 max-w-[44ch] text-ink/75">
                  A website that converts the click. Custom-designed and
                  hand-built from your business, fast enough that nobody
                  leaves while it loads.
                </p>
                <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
                  <span className="chip">From $2.5k, fixed quote</span>
                  <span className="chip">You own everything</span>
                </div>
              </div>
              <div data-anim="artifact" className="md:order-1">
                <ArtifactFrame
                  variant="chrome"
                  tone="ink"
                  url="desertwingsflightschool.com"
                  label="The Desert Wings landing page we built"
                  bodyClassName="!p-0"
                >
                  <div className="overflow-hidden rounded-[10px]" style={{ aspectRatio: "1.65" }}>
                    <Image
                      data-svc-parallax
                      src="/hero/dw-hero.jpg"
                      alt="The Desert Wings Flight School homepage"
                      width={1200}
                      height={800}
                      sizes="(min-width: 821px) 46vw, 92vw"
                      className="block h-[112%] w-full object-cover object-top"
                    />
                  </div>
                </ArtifactFrame>
              </div>
            </div>
          </article>

          {/* ── 03 · THE FOLLOW-UP — artifact right ── */}
          <article data-svc-row className="relative">
            <div className="relative z-[1] grid items-center gap-fib-4 rounded-panel bg-panel/60 p-fib-4 md:grid-cols-2 md:gap-fib-5 md:p-fib-5">
              <div>
                <div className="flex flex-wrap items-center gap-fib-2">
                  <h3 data-anim="copy" className="t-title--lg font-display font-bold">
                    The follow-up
                  </h3>
                  <span data-anim="copy" className="chip chip--sm bg-accent/10 text-accent">
                    New for 2026
                  </span>
                </div>
                <p data-anim="copy" className="mt-fib-2 max-w-[44ch] text-ink/75">
                  AI that answers and chases. Chat that answers from your own
                  pages, follow-ups that send themselves. No lead goes cold at
                  9pm on a Sunday.
                </p>
                <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
                  <span className="chip">Quoted per project</span>
                  <span className="chip">Built and managed for you</span>
                </div>
              </div>
              <div data-anim="artifact" className="w-[min(100%,440px)] justify-self-start md:justify-self-end">
                <ArtifactFrame
                  variant="card"
                  tone="paper"
                  label="Ask-this-site chat answering a visitor"
                >
                  <div className="chat-card mt-0! flex-none! border-0! bg-transparent! p-fib-1!">
                    <p className="chat-q" />
                    <div className="chat-a">
                      <Monogram className="mt-[3px] h-[16px] w-[16px] shrink-0 opacity-70" />
                      <p>
                        Yes. Saturday and Sunday mornings from Falcon Field.
                        Want me to book you one?
                      </p>
                    </div>
                    <p className="serp-tag t-meta">
                      Ask-this-site chat, answering from your pages
                    </p>
                  </div>
                </ArtifactFrame>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-fib-6">
          <CTA href="#estimate" label="Price your project" tone="ink" />
        </div>
      </div>
    </section>
  );
}
