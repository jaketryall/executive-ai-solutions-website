"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
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


export function Services() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        q("[data-svc-ad]")[0]?.classList.add("is-lit");
        const typing = q("[data-ctyping]")[0];
        if (typing) gsap.set(typing, { display: "none" });
        return; // static: lit ad, tour resting, full chat exchange
      }

      /* per-row choreography: copy first, artifact scales-and-settles LAST
         (animate-last = highest hierarchy), entry vector alternating with the
         layout; the watermark spine stays put (structure, not an actor) */
      (q("[data-svc-row]") as HTMLElement[]).forEach((row, i) => {

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
          { autoAlpha: 0, y: 21, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 },
          "-=0.35"
        );

      });

      /* ── the three stage demos, LOOPING (visibility-governed): each
         artifact runs its stage the way it actually behaves ── */
      const loops: gsap.core.Timeline[] = [];

      // 01 · the promotion cycle: listing lights up as the ad, holds, dims
      const ad = q("[data-svc-ad]")[0] as HTMLElement;
      if (ad) {
        /* lock the artifact to its LIT height (the hero-card fix): force the
           expanded state invisibly, measure, revert — same frame, no paint
           between. The cycle then never changes the section's height. */
        document.fonts.ready.then(() => {
          const expand = ad.querySelector(".g-expand") as HTMLElement;
          const spon = ad.querySelector(".g-sponsored") as HTMLElement;
          if (!expand || !spon || !ad.isConnected) return;
          expand.style.transition = "none";
          spon.style.transition = "none";
          expand.style.gridTemplateRows = "1fr";
          spon.style.maxHeight = "1.6em";
          ad.style.minHeight = `${ad.offsetHeight}px`;
          expand.style.gridTemplateRows = "";
          spon.style.maxHeight = "";
          requestAnimationFrame(() => {
            expand.style.transition = "";
            spon.style.transition = "";
            ScrollTrigger.refresh(); // late layout change: re-measure triggers
          });
        });
        /* the full story: the listing lights up as the ad, the sitelinks
           arrive one by one, then a cursor glides in and CLICKS it (the
           stage's namesake) before everything dims for the next cycle.
           repeatRefresh re-reads the function-based cursor coordinates each
           loop, so late layout shifts can't strand the click off-target. */
        const adTitle = ad.querySelector(".g-title") as HTMLElement;
        const links = ad.querySelectorAll(".g-ext a");
        const cursor = ad.querySelector(".g-cursor") as HTMLElement;
        const ring = ad.querySelector(".g-click-ring") as HTMLElement;
        const clickPt = () => ({
          x: adTitle.offsetLeft + Math.min(64, adTitle.offsetWidth * 0.3),
          y: adTitle.offsetTop + 12,
        });
        gsap.set(ring, { xPercent: -50, yPercent: -50 });
        const c = gsap.timeline({ repeat: -1, paused: true, repeatRefresh: true });
        c.call(() => ad.classList.add("is-lit"))
          // colors turn (CSS), then each sitelink lands on its own beat
          .fromTo(
            links,
            { autoAlpha: 0, y: 5 },
            { autoAlpha: 1, y: 0, duration: 0.35, ease: EASE_UI, stagger: 0.09 },
            0.3
          )
          .to({}, { duration: 1.0 })
          // the click: in from below, press, ripple, gone
          .set(cursor, {
            x: () => ad.offsetWidth - 55,
            y: () => ad.offsetHeight + 4,
            autoAlpha: 0,
            scale: 1,
          })
          .to(cursor, { autoAlpha: 1, duration: 0.25, ease: EASE_UI })
          .to(cursor, {
            x: () => clickPt().x,
            y: () => clickPt().y,
            duration: 0.9,
            ease: EASE_STRUCTURE,
          }, "<")
          .to(cursor, { scale: 0.78, duration: 0.09, ease: EASE_UI })
          // set-then-to, never fromTo: with repeatRefresh, an invalidated
          // fromTo re-renders its FROM state at every cycle START — the ring
          // sat visible as a little accent dot seconds before the click
          .set(
            ring,
            {
              x: () => clickPt().x + 4,
              y: () => clickPt().y + 4,
              autoAlpha: 0.55,
              scale: 0.25,
            },
            "<"
          )
          .to(ring, { autoAlpha: 0, scale: 1, duration: 0.6, ease: EASE_UI }, "<")
          .to(adTitle, { opacity: 0.55, duration: 0.08, yoyo: true, repeat: 1, ease: "none" }, "<")
          .to(cursor, { scale: 1, duration: 0.16, ease: EASE_UI }, "-=0.4")
          .to(cursor, { autoAlpha: 0, duration: 0.35, ease: EASE_UI }, "+=0.5")
          .to({}, { duration: 0.35 })
          .call(() => ad.classList.remove("is-lit"))
          .to({}, { duration: 1.7 });
        loops.push(c);
      }

      // 02 · the site tour, self-scrolling: glide down, settle, ease back up
      const tourImg = q("[data-svc-tour]")[0] as HTMLElement;
      if (tourImg) {
        // visible window = w/1.65 of a 1.544w-tall image → ~61% travel
        const c = gsap.timeline({ repeat: -1, paused: true });
        c.to(tourImg, { yPercent: -60.7, duration: 15, ease: "none" })
          .to({}, { duration: 0.9 })
          .to(tourImg, { yPercent: 0, duration: 2.4, ease: EASE_STRUCTURE })
          .to({}, { duration: 1.1 });
        loops.push(c);
      }

      // 03 · the exchange as it actually feels: sent → typing → answered
      const chat = q("[data-svc-chat]")[0] as HTMLElement;
      if (chat) {
        const cq = chat.querySelector("[data-cq]");
        const typing = chat.querySelector("[data-ctyping]");
        const ca = chat.querySelector("[data-ca]");
        const c = gsap.timeline({ repeat: -1, paused: true });
        c.set(cq, { autoAlpha: 0, y: 8 })
          // the answer must replace the dots IN PLACE — any y motion here
          // reads as the whole exchange shifting when the text arrives
          .set(ca, { autoAlpha: 0 })
          .set(typing, { autoAlpha: 0 })
          .to({}, { duration: 0.5 })
          .to(cq, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE_UI })
          .to(typing, { autoAlpha: 1, duration: 0.25, ease: EASE_UI }, "+=0.55")
          .to(typing, { autoAlpha: 0, duration: 0.2, ease: EASE_UI }, "+=1.5")
          .to(ca, { autoAlpha: 1, duration: 0.45, ease: EASE_UI }, "<0.1")
          .to({}, { duration: 3.4 })
          // the exchange closes softly before the next one begins
          .to([cq, ca], { autoAlpha: 0, duration: 0.4, ease: EASE_UI, stagger: 0.06 })
          .to({}, { duration: 0.4 });
        loops.push(c);
      }

      // the demos run only while the card is on screen and the tab is visible
      let demosInView = false;
      const syncLoops = () => {
        const on = demosInView && !document.hidden;
        loops.forEach((l) => (on ? l.play() : l.pause()));
      };
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          demosInView = self.isActive;
          if (!self.isActive) {
            // leaving resets every demo to its BEGINNING state (unlit ad,
            // site at its top, empty chat) so a return never lands mid-story
            loops.forEach((l) => l.pause(0));
            ad?.classList.remove("is-lit");
          }
          syncLoops();
        },
      });
      document.addEventListener("visibilitychange", syncLoops);
      context.add(() => () =>
        document.removeEventListener("visibilitychange", syncLoops)
      );
    },
    { scope: root }
  );

  return (
    <section id="services" ref={root} className="relative overflow-x-clip">
      {/* the whole funnel is ONE card — a dark panel floating on the canvas
          (the v2 grammar): the rail pins while the stages scroll past it */}
      <div className="dark-chapter mx-[8px] mt-fib-4 rounded-panel py-fib-6 md:mx-[13px]">
        <div className="wrap grid gap-fib-5 md:grid-cols-[minmax(260px,340px)_1fr] md:gap-fib-6">
          <div>
            <div className="md:sticky md:top-[144px]">
              {/* headline sells THEIR change; the funnel mechanics moved
                  down into the paragraph (selling-architecture.md law 6) */}
              <h2 className="t-display-lg">From stranger to booked customer</h2>
              <p className="mt-fib-3 max-w-[30ch] text-paper/70">
                One funnel, three stages: ads bring the click, the site
                converts it, the AI keeps it. Buy the stage you need, or the
                whole path.
              </p>
              <div className="mt-fib-4 hidden md:block">
                <CTA href="#estimate" label="Price my project" tone="paper" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-fib-4">
          {/* ── 01 · THE CLICK — artifact right ── */}
          <article data-svc-row className="rounded-frame bg-paper/[0.05] p-fib-4 md:p-fib-5">
            <div className="flex flex-col gap-fib-4">
              <div>
                <h3 data-anim="copy" className="t-title--lg">
                  The click
                </h3>
                <p data-anim="copy" className="mt-fib-2 max-w-[44ch] text-paper/70">
                  Google Ads, managed. Campaigns built on what your customers
                  actually search, conversion tracking you can read, and a
                  monthly number that says what a lead cost.
                </p>
                <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
                  <span className="chip">$500/mo + ad spend</span>
                  <span className="chip">No lock-in</span>
                </div>
              </div>
              <div data-anim="artifact" className="w-[min(100%,440px)]">
                <ArtifactFrame
                  variant="card"
                  tone="paper"
                  label="The Desert Wings search ad with sitelink extensions"
                >
                  {/* the promotion, looping in miniature: a plain listing
                      lights up as the ad, holds, dims, repeats */}
                  <div className="g-row" data-svc-ad>
                    <p className="g-sponsored">Sponsored</p>
                    <p className="g-url">desertwingsflightschool.com</p>
                    {/* PLACEHOLDER — swap with the real Desert Wings ad, verbatim */}
                    <p className="g-title">
                      Desert Wings Flight School | Learn to Fly at Falcon Field
                    </p>
                    <p className="g-desc">
                      Discovery flights and PPL through CFI training in Mesa, AZ.
                    </p>
                    <div className="g-expand">
                      <div className="g-expand-in">
                        <div className="g-ext" aria-hidden>
                          <a>Discovery flights</a>
                          <a>Fleet and rates</a>
                          <a>Book a tour</a>
                        </div>
                      </div>
                    </div>
                    {/* the stage's namesake, enacted: once the ad is lit, a
                        cursor glides in and clicks it */}
                    <span className="g-click-ring" aria-hidden />
                    <svg
                      className="g-cursor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        d="M5.5 2.2v18.3l4.3-4.1 2.9 6.4 3-1.4-2.9-6.3 5.9-.6L5.5 2.2z"
                        fill="#131413"
                        stroke="#fff"
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </ArtifactFrame>
              </div>
            </div>
          </article>

          {/* ── 02 · THE LANDING — artifact left ── */}
          <article data-svc-row className="rounded-frame bg-paper/[0.05] p-fib-4 md:p-fib-5">
            <div className="flex flex-col gap-fib-4">
              <div>
                <h3 data-anim="copy" className="t-title--lg">
                  The landing
                </h3>
                <p data-anim="copy" className="mt-fib-2 max-w-[44ch] text-paper/70">
                  A website that converts the click. Custom-designed and
                  hand-built from your business, fast enough that nobody
                  leaves while it loads.
                </p>
                <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
                  <span className="chip">From $2.5k, fixed quote</span>
                  <span className="chip">You own everything</span>
                </div>
              </div>
              <div data-anim="artifact">
                <ArtifactFrame
                  variant="chrome"
                  tone="paper"
                  url="desertwingsflightschool.com"
                  label="The Desert Wings site we designed and built, scrolling"
                  bodyClassName="!p-0"
                >
                  <div className="overflow-hidden rounded-btn" style={{ aspectRatio: "1.65" }}>
                    <Image
                      data-svc-tour
                      src="/work/dw-tour.jpg"
                      alt="The Desert Wings site we designed and built, scrolling"
                      width={2880}
                      height={4446}
                      sizes="(min-width: 821px) 46vw, 92vw"
                      className="block h-auto w-full"
                    />
                  </div>
                </ArtifactFrame>
              </div>
            </div>
          </article>

          {/* ── 03 · THE FOLLOW-UP — artifact right ── */}
          <article data-svc-row className="rounded-frame bg-paper/[0.05] p-fib-4 md:p-fib-5">
            <div className="flex flex-col gap-fib-4">
              <div>
                <div className="flex flex-wrap items-center gap-fib-2">
                  <h3 data-anim="copy" className="t-title--lg">
                    The follow-up
                  </h3>
                  <span data-anim="copy" className="chip chip--sm bg-accent/10 text-accent">
                    New for 2026
                  </span>
                </div>
                <p data-anim="copy" className="mt-fib-2 max-w-[44ch] text-paper/70">
                  AI that answers and chases. Chat that answers from your own
                  pages, follow-ups that send themselves. No lead goes cold at
                  9pm on a Sunday.
                </p>
                <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
                  <span className="chip">Quoted per project</span>
                  <span className="chip">Built and managed for you</span>
                </div>
              </div>
              <div data-anim="artifact" className="w-[min(100%,440px)]">
                <ArtifactFrame
                  variant="card"
                  tone="paper"
                  label="Ask-this-site chat answering a visitor"
                >
                  <div className="chat-thread" data-svc-chat>
                    <div className="chat-b chat-b--user" data-cq>
                      <p>Do you offer discovery flights on weekends?</p>
                    </div>
                    {/* the dots and the answer share ONE slot — the answer
                        replaces the typing in place, like a real chat */}
                    <div className="chat-slot">
                      <div className="chat-b chat-b--bot chat-b--typing" data-ctyping aria-hidden>
                        <span className="ct-dot" />
                        <span className="ct-dot" />
                        <span className="ct-dot" />
                      </div>
                      <div className="chat-b chat-b--bot" data-ca>
                        <Monogram className="mt-[3px] h-[15px] w-[15px] shrink-0 opacity-70" />
                        <p>
                          Yes. Saturday and Sunday mornings from Falcon Field.
                          Want me to book you one?
                        </p>
                      </div>
                    </div>
                    <p className="serp-tag t-meta">
                      Ask-this-site chat, answering from your pages
                    </p>
                  </div>
                </ArtifactFrame>
              </div>
            </div>
          </article>

            <div className="md:hidden">
              <CTA href="#estimate" label="Price my project" tone="paper" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
