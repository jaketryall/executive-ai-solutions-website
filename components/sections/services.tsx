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
          delay: gridRow() ? (i % 3) * 0.14 : 0,
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: row, start: "top 72%", toggleActions: "play none none none" },
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
      // WHITE stage (Jake, 2026-07-17): the audit tray floats on white, so
      // the stage must run white on both sides of it — hero, tray section,
      // and services share one continuous ground; card shadows + gray demo
      // wells carry the separation
      className="relative overflow-x-clip bg-white py-fib-6 md:py-fib-7"
    >
      <div className="wrap">
        <header className="mx-auto max-w-[680px] text-center">
          <h2 className="t-display-lg">From stranger to booked customer</h2>
          <p className="t-lede mx-auto mt-fib-3 max-w-[44ch] text-ink/70">
            Six ways in, one funnel: ads bring the click, the site converts
            it, the AI keeps it. Buy the stage you need, or the whole path.
          </p>
        </header>

        <div className="svc-grid mt-fib-5 grid gap-fib-3 xl:grid-cols-3">
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
            <h3 data-anim="copy" className="t-title--lg mt-fib-3 md:mt-fib-4">
              Google Ads, managed
            </h3>
            <p data-anim="copy" className="mt-fib-2 text-ink/70">
              Campaigns built on what your customers actually search.
            </p>
            <div data-anim="copy" className="mt-fib-3 hidden flex-wrap gap-fib-1 sm:flex">
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
              {/* the win frame: the site we built, in a browser window —
                  the one desktop frame among the phones, because a WEBSITE
                  is bought as a big-screen thing (the landing card owns the
                  phone). Hover pans the tall capture: the demo tours it. */}
              <div className="brw" aria-hidden>
                <div className="brw-bar">
                  <span className="brw-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="brw-url">desertwingsflightschool.com</span>
                </div>
                <div className="brw-screen">
                  <Image
                    src="/work/dw-tour.jpg"
                    alt="The Desert Wings site we designed and built, in a desktop browser"
                    width={2880}
                    height={4446}
                    sizes="(min-width: 1280px) 340px, 86vw"
                    className="brw-page"
                  />
                </div>
              </div>
            </div>
            <h3 data-anim="copy" className="t-title--lg mt-fib-3 md:mt-fib-4">
              Websites that convert
            </h3>
            <p data-anim="copy" className="mt-fib-2 text-ink/70">
              Hand-built pages that turn the click into a call.
            </p>
            <div data-anim="copy" className="mt-fib-3 hidden flex-wrap gap-fib-1 sm:flex">
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
            <div data-anim="copy" className="mt-fib-3 hidden flex-wrap gap-fib-1 sm:flex">
              <span className="chip">Quoted per project</span>
              <span className="chip">Managed for you</span>
            </div>
            <div data-anim="copy" className="mt-auto pt-fib-4">
              <CTA href="/services/ai" label="Never miss a lead" tone="ink" />
            </div>
          </article>

          {/* ── row two: the extension doors — same three columns, deeper
              in. Doors, not pages: each routes into its family's page. ── */}

          {/* ── 04 · LOCAL SERVICES ADS ── */}
          <article data-svc-row className="svc-card p-fib-3 text-ink">
            <div data-anim="artifact" className="svc-card-demo">
              {/* the win frame: the Google Guaranteed unit, calls incoming */}
              <div className="dvc" aria-hidden>
                <div className="dvc-screen dvc-screen--ui">
                  <div className="g-m">
                    <div className="g-m-bar">
                      <svg viewBox="0 0 20 20" fill="none">
                        <circle cx="8.6" cy="8.6" r="5.4" stroke="currentColor" strokeWidth="2" />
                        <path d="m13 13 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <span className="g-m-q">emergency plumber mesa</span>
                    </div>
                    <div className="g-lsa">
                      <p className="g-lsa-head">
                        <svg viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 .8 2.7 3v4c0 3.4 2.2 6.5 5.3 7.4 3.1-.9 5.3-4 5.3-7.4V3L8 .8Zm-1 9.9L4.6 8.3l1-1 1.4 1.4 3.4-3.4 1 1-4.4 4.4Z" />
                        </svg>
                        GOOGLE GUARANTEED
                      </p>
                      <div className="g-lsa-row">
                        <span className="g-lsa-av">M</span>
                        <span className="g-lsa-t">
                          <span className="g-lsa-name">Mesa Rapid Plumbing</span>
                          <span className="g-lsa-meta">
                            <span className="g-lsa-star">&#9733;</span> <b>4.9</b> (132) &middot; Open 24/7
                          </span>
                        </span>
                        <span className="g-lsa-call">
                          <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M3.6 1.8 5.8 1c.4-.1.8 0 1 .4l1.1 2.3c.2.4.1.8-.2 1l-1.2 1a10 10 0 0 0 3.8 3.8l1-1.2c.2-.3.6-.4 1-.2l2.3 1.1c.4.2.5.6.4 1l-.8 2.2c-.2.4-.6.7-1 .7C7.2 13 3 8.8 2.9 2.8c0-.4.3-.8.7-1Z" />
                          </svg>
                        </span>
                      </div>
                      <div className="g-lsa-row">
                        <span className="g-lsa-av">C</span>
                        <span className="g-lsa-t">
                          <span className="g-lsa-name">Canyon Plumbing Co.</span>
                          <span className="g-lsa-meta">
                            <span className="g-lsa-star">&#9733;</span> <b>4.8</b> (98) &middot; Mesa, AZ
                          </span>
                        </span>
                        <span className="g-lsa-call">
                          <svg viewBox="0 0 16 16" fill="currentColor">
                            <path d="M3.6 1.8 5.8 1c.4-.1.8 0 1 .4l1.1 2.3c.2.4.1.8-.2 1l-1.2 1a10 10 0 0 0 3.8 3.8l1-1.2c.2-.3.6-.4 1-.2l2.3 1.1c.4.2.5.6.4 1l-.8 2.2c-.2.4-.6.7-1 .7C7.2 13 3 8.8 2.9 2.8c0-.4.3-.8.7-1Z" />
                          </svg>
                        </span>
                      </div>
                      {/* the list continues past the crop — never a dead end */}
                      <div className="g-skel">
                        <span className="g-skel-thumb" />
                        <span className="g-skel-lines">
                          <span className="g-skel-line block w-[76%]" />
                          <span className="g-skel-line block w-[54%]" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* benefit-first title (copy audit 2026-07-21): a plumber
                doesn't know "Local Services Ads"; the description names
                the product for the ones who do */}
            <h3 data-anim="copy" className="t-title--lg mt-fib-3 md:mt-fib-4">
              Pay only when the phone rings
            </h3>
            <p data-anim="copy" className="mt-fib-2 text-ink/70">
              Local Services Ads &mdash; Google Guaranteed leads, billed per
              call, not per click.
            </p>
            <div data-anim="copy" className="mt-fib-3 hidden flex-wrap gap-fib-1 sm:flex">
              <span className="chip">Pay per lead</span>
              <span className="chip">For the trades</span>
            </div>
            <div data-anim="copy" className="mt-auto pt-fib-4">
              <CTA href="/services/google-ads#lsa" label="Get guaranteed" tone="ink" />
            </div>
          </article>

          {/* ── 05 · LANDING PAGES ── */}
          <article data-svc-row className="svc-card p-fib-3 text-ink">
            <div data-anim="artifact" className="svc-card-demo">
              {/* the win frame: the page the ad's click lands on, on the
                  phone the click happens on — the landing card owns the
                  phone now that the websites card went desktop. Photo
                  screen keeps its island (Jake's cutout law) */}
              <div className="dvc" aria-hidden>
                <span className="dvc-island" />
                <div className="dvc-screen">
                  <Image
                    src="/work/live/dw-mobile-hero.jpg"
                    alt="The Desert Wings landing hero the ad's click lands on, on a phone"
                    width={1170}
                    height={2532}
                    sizes="(min-width: 1280px) 310px, 86vw"
                    className="block h-auto w-full"
                  />
                </div>
              </div>
            </div>
            <h3 data-anim="copy" className="t-title--lg mt-fib-3 md:mt-fib-4">
              Landing pages
            </h3>
            <p data-anim="copy" className="mt-fib-2 text-ink/70">
              One fast page, purpose-built to catch your ad&rsquo;s click.
            </p>
            <div data-anim="copy" className="mt-fib-3 hidden flex-wrap gap-fib-1 sm:flex">
              <span className="chip">Days, not weeks</span>
              <span className="chip">Fixed quote</span>
            </div>
            <div data-anim="copy" className="mt-auto pt-fib-4">
              <CTA href="/services/websites#landing" label="Catch the click" tone="ink" />
            </div>
          </article>

          {/* ── 06 · THE ANSWER ON CHATGPT ── */}
          <article data-svc-row className="svc-card p-fib-3 text-ink">
            <div data-anim="artifact" className="svc-card-demo">
              {/* the win frame: the assistant recommending the client — the
                  AEO outcome on the surface it happens on */}
              <div className="dvc" aria-hidden>
                <div className="dvc-screen dvc-screen--ui">
                  <div className="ai-m">
                    <div className="ai-m-top">
                      <svg viewBox="0 0 20 20" fill="none">
                        <path d="M3 5.5h14M3 10h14M3 14.5h9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                      <p className="ai-m-title">
                        ChatGPT <span>5 &rsaquo;</span>
                      </p>
                      <svg viewBox="0 0 20 20" fill="none">
                        <path d="M12.8 3.7 16.3 7.2 7.5 16H4v-3.5l8.8-8.8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="ai-m-q">Best flight school near Mesa?</p>
                    <p className="ai-m-a">
                      <b>Desert Wings Flight School</b>{" "}at Falcon Field
                      comes up most &mdash; strong reviews, discovery
                      flights, and PPL through CFI on one path&hellip;
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <h3 data-anim="copy" className="t-title--lg mt-fib-3 md:mt-fib-4">
              Be the answer on ChatGPT
            </h3>
            <p data-anim="copy" className="mt-fib-2 text-ink/70">
              When customers ask AI who to call, it should say you.
            </p>
            <div data-anim="copy" className="mt-fib-3 hidden flex-wrap gap-fib-1 sm:flex">
              <span className="chip">Search + AI engines</span>
              <span className="chip">Quoted per project</span>
            </div>
            <div data-anim="copy" className="mt-auto pt-fib-4">
              <CTA href="/services/ai#aeo" label="Get recommended" tone="ink" />
            </div>
          </article>
        </div>

      </div>
    </section>
  );
}
