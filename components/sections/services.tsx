"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_UI,
  EASE_LOOP,
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
         (animate-last = highest hierarchy). THE APPLE ENVELOPE (Jake,
         2026-07-15 "i need that apple motion feel"): their measured moves
         are BIG and SLOW — card reveals travel 148px over a full second;
         6px/0.35s reads as flicker, not motion. So: long durations, real
         travel, and a steep glide (power3.out) instead of the theatrical
         EASE_STRUCTURE wind-up — this section speaks Apple. */
      const gridRow = () => window.matchMedia("(min-width: 1280px)").matches;
      (q("[data-svc-row]") as HTMLElement[]).forEach((row, i) => {
        const tl = gsap.timeline({
          // desktop shows the three cards as ONE row — they land as a
          // left→right cascade, not three identical simultaneous drops
          delay: gridRow() ? i * 0.14 : 0,
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: row, start: "top 72%", once: true },
        });
        // the card reads top-down: the demo lands first, the words trail it
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

      /* ── the three stage demos: PLAY-ONCE stories (iphone-17-pro.md law:
         Apple media plays once on entry and rests on its end frame — it
         never loops like a screensaver). Each story runs as ITS row
         arrives, settles on the WIN frame (the lit ad after the click,
         the toured page home again, the completed exchange) and HOLDS —
         apple-ad-motion.md law 5. Leaving the viewport resets it, so
         every return gets one clean performance. The rest states match
         the reduced-motion stills exactly. ── */
      const stories: {
        tl: gsap.core.Timeline;
        el: HTMLElement;
        reset?: () => void;
      }[] = [];

      // 01 · the promotion: the listing lights up as the ad, takes the
      // click, and rests lit
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
        /* the story, once, in three acts with real mass: the result PAINTS
           (url → title → desc gliding in on the Apple envelope, like a
           SERP rendering), BECOMES the ad (the CSS chain + sitelinks),
           then TAKES the click — and rests LIT. Function-based
           coordinates re-read via invalidate() on every reset. */
        const adUrl = ad.querySelector(".g-url") as HTMLElement;
        const adTitle = ad.querySelector(".g-title") as HTMLElement;
        const adDesc = ad.querySelector(".g-desc") as HTMLElement;
        const links = ad.querySelectorAll(".g-ext span");
        const cursor = ad.querySelector(".g-cursor") as HTMLElement;
        const ring = ad.querySelector(".g-click-ring") as HTMLElement;
        const clickPt = () => ({
          x: adTitle.offsetLeft + Math.min(64, adTitle.offsetWidth * 0.3),
          y: adTitle.offsetTop + 12,
        });
        gsap.set(ring, { xPercent: -50, yPercent: -50 });
        // pre-hide the listing: the story's first act is the SERP painting
        gsap.set([adUrl, adTitle, adDesc], { autoAlpha: 0, y: 18 });
        const c = gsap.timeline({ paused: true });
        c.to(adUrl, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.15)
          .to(adTitle, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "<0.12")
          .to(adDesc, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "<0.12")
          // act two: the listing becomes the ad (CSS follow-through chain)
          .call(() => ad.classList.add("is-lit"), [], "+=0.5")
          // …and each sitelink glides in with real travel and a long brake
          .fromTo(
            links,
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 },
            "+=0.55"
          )
          .to({}, { duration: 0.8 })
          // the click: in from below, press, ripple, gone
          .set(cursor, {
            x: () => ad.offsetWidth - 55,
            y: () => ad.offsetHeight + 4,
            autoAlpha: 0,
            scale: 1,
          })
          .to(cursor, { autoAlpha: 1, duration: 0.25, ease: EASE_UI })
          // diegetic motion wears civilian curves (apple-micro-interactions
          // §10): a depicted cursor travels like a real one — ease-in-out,
          // no theatrical wind-up
          .to(cursor, {
            x: () => clickPt().x,
            y: () => clickPt().y,
            duration: 0.9,
            ease: EASE_LOOP,
          }, "<")
          .to(cursor, { scale: 0.78, duration: 0.09, ease: EASE_UI })
          // set-then-to, never fromTo: after an invalidate() reset, a
          // fromTo re-renders its FROM state at story START — the ring
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
          // the surface acknowledges the press: a quick dip, a long settle
          .to(ad, { scale: 0.985, duration: 0.09, ease: EASE_UI }, "<")
          .to(ad, { scale: 1, duration: 0.6, ease: "power3.out" }, ">")
          .to(cursor, { scale: 1, duration: 0.16, ease: EASE_UI }, "-=0.4")
          .to(cursor, { autoAlpha: 0, duration: 0.35, ease: EASE_UI }, "+=0.5");
        // …and rest: lit, clicked, composed. Reset re-hides the listing
        // (invalidated to()s re-record starts from CURRENT values on the
        // next play — without this, a replay would have nothing to paint)
        stories.push({
          tl: c,
          el: ad,
          reset: () => {
            ad.classList.remove("is-lit");
            gsap.set(ad, { scale: 1 });
            gsap.set([adUrl, adTitle, adDesc], { autoAlpha: 0, y: 18 });
          },
        });
      }

      // 02 · the site tour as real scrolling: nobody reads a page at
      // constant speed — three FLICKS, each decelerating to a stop
      // (scroll physics = civilian ease-out), a beat at the bottom,
      // then home to rest on the page's own hero
      const tourImg = q("[data-svc-tour]")[0] as HTMLElement;
      if (tourImg) {
        // visible window = w/1.65 of a 1.544w-tall image → ~61% travel
        const c = gsap.timeline({ paused: true });
        c.to({}, { duration: 0.9 })
          .to(tourImg, { yPercent: -25.5, duration: 1.5, ease: "power3.out" })
          .to({}, { duration: 1.0 })
          .to(tourImg, { yPercent: -44.9, duration: 1.4, ease: "power3.out" })
          .to({}, { duration: 1.0 })
          .to(tourImg, { yPercent: -60.7, duration: 1.5, ease: "power3.out" })
          .to({}, { duration: 1.4 })
          .to(tourImg, { yPercent: 0, duration: 2.2, ease: EASE_LOOP });
        stories.push({ tl: c, el: tourImg });
      }

      // 03 · the exchange as it actually feels: sent → typing → answered,
      // resting on the completed conversation (the win frame)
      const chat = q("[data-svc-chat]")[0] as HTMLElement;
      if (chat) {
        const cq = chat.querySelector("[data-cq]") as HTMLElement;
        const typing = chat.querySelector("[data-ctyping]");
        const ca = chat.querySelector("[data-ca]") as HTMLElement;
        const booked = chat.querySelector("[data-cbooked]") as HTMLElement;
        // pre-hide NOW — a paused timeline's own set() only renders on
        // play, and with the story armed at 62% the card is on screen
        // BEFORE it starts: nothing may paint ahead of its beat
        gsap.set([cq, ca, typing, booked], { autoAlpha: 0 });
        const c = gsap.timeline({ paused: true });
        /* the iMessage grammar (apple-ad-motion.md law 1): bubbles grow
           from their TAIL — the corner the message came from — never
           center-scale, never a bare fade */
        c.set(cq, { autoAlpha: 0, y: 26, scale: 0.9, transformOrigin: "100% 100%" })
          // the answer must replace the dots IN PLACE — any y motion here
          // reads as the whole exchange shifting when the text arrives
          .set(ca, { autoAlpha: 0, scale: 0.94, transformOrigin: "0% 100%" })
          .set(ca.children, { autoAlpha: 0 })
          .set(typing, { autoAlpha: 0 })
          .set(booked, { autoAlpha: 0, y: 18, scale: 0.94, transformOrigin: "0% 0%" })
          .to({}, { duration: 0.5 })
          // the Apple envelope: real travel (26px), long glide, hard brake
          .to(cq, { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" })
          .to(typing, { autoAlpha: 1, duration: 0.35, ease: EASE_UI }, "+=0.55")
          .to(typing, { autoAlpha: 0, duration: 0.2, ease: EASE_UI }, "+=1.5")
          .to(ca, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "power3.out" }, "<0.1")
          // text after settle (law 4): the monogram + answer trail the
          // bubble's surface — the words land on locked geometry
          .to(ca.children, { autoAlpha: 1, duration: 0.5, ease: EASE_UI }, "<0.15")
          // the closing beat, after the answer has been read: the visitor
          // took the offer — anchored pop from the thread's edge
          .to(
            booked,
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
            "+=1.1"
          );
        // …and rest: booked — the headline, enacted
        stories.push({ tl: c, el: chat });
      }

      /* governance: two triggers per story. The STARTER fires the single
         performance once the row has properly arrived (a beat below the
         entrance trigger, so copy and artifact are settled first). The
         JANITOR resets when the row is fully off screen — so every
         return replays from the top — and pauses/resumes around tab
         visibility for stories caught mid-flight. */
      const inView = new Map<gsap.core.Timeline, boolean>();
      stories.forEach(({ tl, el, reset }, idx) => {
        const row = (el.closest("[data-svc-row]") ?? el) as HTMLElement;
        /* in the desktop grid all three starters fire together — the
           stories cascade left→right (one performance at a time for the
           eye); stacked breakpoints play immediately as before */
        let starter: gsap.core.Tween | null = null;
        const clearStarter = () => {
          starter?.kill();
          starter = null;
        };
        context.add(() => clearStarter);
        const begin = () => {
          clearStarter();
          starter = gsap.delayedCall(gridRow() ? idx * 2.1 : 0, () => {
            if (!document.hidden) tl.play();
          });
        };
        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          onEnter: () => {
            if (!document.hidden) begin();
          },
          onEnterBack: () => {
            if (!document.hidden && tl.progress() < 1) tl.play();
          },
        });
        ScrollTrigger.create({
          trigger: row,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            inView.set(tl, self.isActive);
            if (!self.isActive) {
              clearStarter();
              tl.pause(0).invalidate();
              reset?.();
            } else if (tl.progress() > 0 && tl.progress() < 1 && !document.hidden) {
              tl.play();
            }
          },
        });
      });
      const syncVis = () => {
        stories.forEach(({ tl }) => {
          if (document.hidden) tl.pause();
          else if (inView.get(tl) && tl.progress() > 0 && tl.progress() < 1)
            tl.play();
        });
      };
      document.addEventListener("visibilitychange", syncVis);
      context.add(() => () =>
        document.removeEventListener("visibilitychange", syncVis)
      );
    },
    { scope: root }
  );

  return (
    <section id="services" ref={root} className="relative overflow-x-clip">
      {/* the funnel as a CARD GRID (the SearchKings shape, Jake 2026-07-16:
          "i really like their services cards") — each service is one card:
          the demo on top doing the selling, the name, one honest line, the
          price chips, and a VERB CTA into its service page. Still one dark
          panel, still play-once stories; they cascade left→right on desktop
          so the eye gets one performance at a time. */}
      <div className="dark-chapter mx-[8px] mt-fib-4 rounded-panel py-fib-6 md:mx-[13px] md:py-fib-7">
        <div className="wrap">
          <header className="mx-auto max-w-[640px] text-center">
            <h2 className="t-display-lg">From stranger to booked customer</h2>
            <p className="mx-auto mt-fib-3 max-w-[44ch] text-paper/70">
              One funnel, three stages: ads bring the click, the site
              converts it, the AI keeps it. Buy the stage you need, or the
              whole path.
            </p>
          </header>

          <div className="mt-fib-5 grid gap-fib-2 xl:grid-cols-3">
          {/* ── 01 · THE CLICK ── */}
          <article data-svc-row className="flex flex-col rounded-frame bg-paper/[0.05] p-fib-3">
              <div data-anim="artifact" className="w-full max-w-[480px]">
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
                        {/* spans, not bare <a>s — hrefless anchors still
                            paint a tap cursor and invite dead taps on touch */}
                        <div className="g-ext" aria-hidden>
                          <span>Discovery flights</span>
                          <span>Fleet and rates</span>
                          <span>Book a tour</span>
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
              <h3 data-anim="copy" className="t-title--lg mt-fib-4">
                Google Ads, managed
              </h3>
              <p data-anim="copy" className="mt-fib-2 text-paper/70">
                Campaigns built on what your customers actually search,
                conversion tracking you can read, and a monthly number that
                says what a lead cost.
              </p>
              <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
                <span className="chip">$500/mo + ad spend</span>
                <span className="chip">No lock-in</span>
              </div>
              <div data-anim="copy" className="mt-auto pt-fib-4">
                <CTA href="/services/google-ads" label="Get found" tone="paper" />
              </div>
          </article>

          {/* ── 02 · THE LANDING ── */}
          <article data-svc-row className="flex flex-col rounded-frame bg-paper/[0.05] p-fib-3">
              <div data-anim="artifact" className="w-full max-w-[480px]">
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
              <h3 data-anim="copy" className="t-title--lg mt-fib-4">
                Websites that convert
              </h3>
              <p data-anim="copy" className="mt-fib-2 text-paper/70">
                Custom-designed and hand-built from your business, fast
                enough that nobody leaves while it loads.
              </p>
              <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
                <span className="chip">From $2.5k, fixed quote</span>
                <span className="chip">You own everything</span>
              </div>
              <div data-anim="copy" className="mt-auto pt-fib-4">
                <CTA href="/services/websites" label="Convert the click" tone="paper" />
              </div>
          </article>

          {/* ── 03 · THE FOLLOW-UP ── */}
          <article data-svc-row className="flex flex-col rounded-frame bg-paper/[0.05] p-fib-3">
              <div data-anim="artifact" className="w-full max-w-[480px]">
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
                    {/* the section's headline, paid off: the story ends
                        BOOKED, not merely answered */}
                    <p className="chat-booked" data-cbooked aria-hidden>
                      <svg viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path
                          d="M2 6.4 4.8 9 10 3.4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Discovery flight booked · Sat 9:00 AM
                    </p>
                    <p className="serp-tag t-meta">
                      Ask-this-site chat, answering from your pages
                    </p>
                  </div>
                </ArtifactFrame>
                {/* the demo, made falsifiable: the same chat runs live on
                    this site — one tap and the visitor is talking to it.
                    py pads the hit area to ~44px (touch minimum). */}
                <button
                  type="button"
                  className="u-link t-meta mt-fib-1 cursor-pointer py-fib-2 text-accent"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("eas:chat-open"))
                  }
                >
                  This one&rsquo;s real — ask it something
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-fib-2 mt-fib-4">
                <h3 data-anim="copy" className="t-title--lg">
                  AI follow-up
                </h3>
                <span data-anim="copy" className="chip chip--sm bg-accent/10 text-accent">
                  New for 2026
                </span>
              </div>
              <p data-anim="copy" className="mt-fib-2 text-paper/70">
                Chat that answers from your own pages, follow-ups that send
                themselves. No lead goes cold at 9pm on a Sunday.
              </p>
              <div data-anim="copy" className="mt-fib-3 flex flex-wrap gap-fib-1">
                <span className="chip">Quoted per project</span>
                <span className="chip">Managed for you</span>
              </div>
              <div data-anim="copy" className="mt-auto pt-fib-4">
                <CTA href="/services/ai" label="Never miss a lead" tone="paper" />
              </div>
          </article>
          </div>

          {/* the one shared ask, centered under the grid — the card CTAs
              route into depth; this one routes to the number */}
          <div className="mt-fib-5 flex justify-center">
            <CTA href="#estimate" label="Price my project" tone="paper" />
          </div>
        </div>
      </div>
    </section>
  );
}
