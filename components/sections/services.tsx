"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";
import { Monogram } from "@/components/ui/monogram";

/* Services — the router's core: three physical white tiles on the light
   canvas (the SearchKings resolvedness, parity pass 2026-07-16), each
   selling with the SAME object — a big phone cropped by the card, resting
   on its WIN frame. No loops here: a card must read complete at every
   scroll moment; the performing demos live on the service pages where
   there's time to watch. One line of copy per card — depth is the
   service page's job. */

export function Services() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        return;
      }

      /* per-card choreography, the Apple envelope: the demo lands first,
         the words trail it; desktop's three cards cascade left→right */
      const gridRow = () => window.matchMedia("(min-width: 1280px)").matches;
      (q("[data-svc-row]") as HTMLElement[]).forEach((row, i) => {
        const tl = gsap.timeline({
          delay: gridRow() ? i * 0.14 : 0,
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: row, start: "top 72%", once: true },
        });
        tl.fromTo(
          row.querySelectorAll("[data-anim='artifact']"),
          { autoAlpha: 0, y: 40, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.1 }
        ).fromTo(
          row.querySelectorAll("[data-anim='copy']"),
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 },
          "-=0.7"
        );
      });
      void ScrollTrigger;
    },
    { scope: root }
  );

  return (
    <section
      id="services"
      ref={root}
      data-nav="light"
      className="relative overflow-x-clip py-fib-6 md:py-fib-7"
    >
      <div className="wrap">
        <header className="mx-auto max-w-[680px] text-center">
          <h2 className="t-display-lg">From stranger to booked customer</h2>
          <p className="mx-auto mt-fib-3 max-w-[44ch] text-ink/70">
            One funnel, three stages: ads bring the click, the site converts
            it, the AI keeps it. Buy the stage you need, or the whole path.
          </p>
        </header>

        <div className="mt-fib-5 grid gap-fib-3 xl:grid-cols-3">
          {/* ── 01 · THE CLICK ── */}
          <article data-svc-row className="svc-card p-fib-3 text-ink">
            <div data-anim="artifact" className="svc-card-demo">
              {/* the win frame: the DW ad, on top, on real Google */}
              <div className="dvc" aria-hidden>
                <div className="dvc-screen dvc-screen--ui">
                  <div className="g-m">
                    <div className="g-m-bar">
                      <svg viewBox="0 0 20 20" fill="none">
                        <circle cx="8.6" cy="8.6" r="5.4" stroke="currentColor" strokeWidth="2" />
                        <path d="m13 13 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="g-m-q">flight school near me</span>
                      <svg viewBox="0 0 20 20" fill="none">
                        <rect x="7" y="2.5" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" />
                        <path d="M4.5 10a5.5 5.5 0 0 0 11 0M10 15.5V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </div>
                    <nav className="g-m-tabs">
                      <span>AI Mode</span>
                      <span className="is-on">All</span>
                      <span>Images</span>
                      <span>Maps</span>
                    </nav>
                    <div className="g-m-ad">
                      <p className="g-m-sponsored">Sponsored</p>
                      <div className="g-m-src">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/work/dw-favicon.png" alt="" className="g-m-fav" width={64} height={64} />
                        <span className="g-m-site">
                          <span className="g-m-name">Desert Wings Flight School</span>
                          <span className="g-m-url">https://www.desertwingsflightschool.com</span>
                        </span>
                      </div>
                      {/* PLACEHOLDER — swap with the real DW ad, verbatim */}
                      <p className="g-m-title">
                        Desert Wings Flight School | Learn to Fly at Falcon Field
                      </p>
                      <p className="g-m-desc">
                        Discovery flights and PPL through CFI training in Mesa,
                        AZ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3 data-anim="copy" className="t-title--lg mt-fib-4">
              Google Ads, managed
            </h3>
            <p data-anim="copy" className="mt-fib-2 text-ink/70">
              Campaigns built on what your customers actually search.
            </p>
            <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
              <span className="chip">$500/mo + ad spend</span>
              <span className="chip">No lock-in</span>
            </div>
            <div data-anim="copy" className="mt-auto pt-fib-4">
              <CTA href="/services/google-ads" label="Get found" tone="ink" />
            </div>
          </article>

          {/* ── 02 · THE LANDING ── */}
          <article data-svc-row className="svc-card p-fib-3 text-ink">
            <div data-anim="artifact" className="svc-card-demo">
              {/* the win frame: the site we built, on the phone it's seen on.
                  A photo screen keeps its island (Jake's cutout law) */}
              <div className="dvc" aria-hidden>
                <span className="dvc-island" />
                <div className="dvc-screen">
                  <Image
                    src="/work/dw-phone-tour.jpg"
                    alt="The Desert Wings site we designed and built, on a phone"
                    width={780}
                    height={10128}
                    sizes="(min-width: 1280px) 270px, 70vw"
                    className="block h-auto w-full"
                  />
                </div>
              </div>
            </div>
            <h3 data-anim="copy" className="t-title--lg mt-fib-4">
              Websites that convert
            </h3>
            <p data-anim="copy" className="mt-fib-2 text-ink/70">
              Hand-built pages that turn the click into a call.
            </p>
            <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
              <span className="chip">From $2.5k, fixed quote</span>
              <span className="chip">You own everything</span>
            </div>
            <div data-anim="copy" className="mt-auto pt-fib-4">
              <CTA href="/services/websites" label="Convert the click" tone="ink" />
            </div>
          </article>

          {/* ── 03 · THE FOLLOW-UP ── */}
          <article data-svc-row className="svc-card p-fib-3 text-ink">
            <div data-anim="artifact" className="svc-card-demo">
              {/* the win frame: the exchange ends BOOKED, not just answered */}
              <div className="dvc" aria-hidden>
                <div className="dvc-screen dvc-screen--ui">
                  <div className="chat-thread">
                    <div className="chat-b chat-b--user">
                      <p>Do you offer discovery flights on weekends?</p>
                    </div>
                    <div className="chat-b chat-b--bot">
                      <Monogram className="mt-[3px] h-[15px] w-[15px] shrink-0 opacity-70" />
                      <p>
                        Yes &mdash; weekend mornings from Falcon Field. Want
                        me to book you one?
                      </p>
                    </div>
                    <p className="chat-booked">
                      <svg viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path
                          d="M2 6.4 4.8 9 10 3.4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Discovery flight booked &middot; Sat 9:00 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-fib-4 flex flex-wrap items-center gap-fib-2">
              <h3 data-anim="copy" className="t-title--lg">
                AI follow-up
              </h3>
              <span data-anim="copy" className="chip chip--sm bg-accent/10 text-accent">
                New for 2026
              </span>
            </div>
            <p data-anim="copy" className="mt-fib-2 text-ink/70">
              Answers and follow-ups that never let a lead go cold.
            </p>
            {/* the demo, made falsifiable: the same chat runs live on this
                site — one tap and the visitor is talking to it */}
            <button
              type="button"
              data-anim="copy"
              className="u-link t-meta mt-fib-1 cursor-pointer self-start py-fib-1 text-accent"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("eas:chat-open"))
              }
            >
              This one&rsquo;s real &mdash; ask it something
            </button>
            <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
              <span className="chip">Quoted per project</span>
              <span className="chip">Managed for you</span>
            </div>
            <div data-anim="copy" className="mt-auto pt-fib-4">
              <CTA href="/services/ai" label="Never miss a lead" tone="ink" />
            </div>
          </article>
        </div>

        {/* the one shared ask, centered under the grid — the card CTAs
            route into depth; this one routes to the number */}
        <div className="mt-fib-5 flex justify-center">
          <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
        </div>
      </div>
    </section>
  );
}
