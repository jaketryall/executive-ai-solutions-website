"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { whenArrived } from "@/components/anim/arrival";
import { revealUp } from "@/components/anim/reveal";
import { CTA } from "@/components/ui/cta";
import { Builder } from "@/components/sections/builder";
import { ArtifactFrame } from "@/components/ui/artifact";
import { Monogram } from "@/components/ui/monogram";
import { ProcessCards } from "@/components/ui/process-cards";
import { HighlightsGallery, type Highlight } from "@/components/ui/highlights-gallery";
import { SERVICE_META, siblingServices, type ServiceDef } from "@/lib/services";
import { QUOTES, AV_TINTS } from "@/lib/quotes";

function PersonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-[14px] w-[14px]">
      <circle cx="10" cy="6.5" r="3.4" />
      <path d="M10 11.4c-3.6 0-6.1 1.9-6.6 4.8-.1.5.3.9.8.9h11.6c.5 0 .9-.4.8-.9-.5-2.9-3-4.8-6.6-4.8Z" />
    </svg>
  );
}

/* A service page — one funnel stage, up close. The hero puts the stage's REAL
   artifact to work (the ad, the landing page, the chat: medium is the message),
   the deliverables read as an index-sweep (everything visible, a traveling
   accent walks the list), the price is the page's one centered statement peak,
   and the other two stages carry the motif out. */

const CHAT_Q = "Do you offer discovery flights on weekends?";

/* ── the per-stage hero artifact ── */
function HeroArtifact({ slug }: { slug: string }) {
  if (slug === "google-ads") {
    return (
      <ArtifactFrame
        variant="card"
        tone="paper"
        label="The Desert Wings search ad with sitelink extensions"
        className="w-[min(100%,460px)]"
      >
        <div className="g-ad relative mt-0! border-t-0! pt-0! p-fib-1">
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
          {/* the stage's namesake, on loop: a cursor arrives and takes the
              click a real searcher takes — straight onto a sitelink */}
          <span className="g-click-ring" aria-hidden />
          <svg className="g-cursor" viewBox="0 0 24 24" aria-hidden>
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
    );
  }
  if (slug === "websites") {
    /* center-stage: the frame IS the whole show — no pocket overlays
       competing with it (one thing at a time) */
    return (
      <ArtifactFrame
        variant="chrome"
        tone="paper"
        url="desertwingsflightschool.com"
        label="The Desert Wings homepage we designed and built"
        bodyClassName="!p-0"
      >
        <div
          className="overflow-hidden rounded-btn"
          style={{ aspectRatio: "1.55" }}
        >
          {/* the landing, riding: the page the click arrives on scrolls
              itself (the homepage services-02 loop, in the stage's frame) */}
          <Image
            data-svc-tour
            src="/work/dw-tour.jpg"
            alt="Scrolling through the Desert Wings homepage we designed and built"
            width={2880}
            height={4446}
            sizes="(min-width: 821px) 980px, 92vw"
            priority
            className="block h-auto w-full"
          />
        </div>
      </ArtifactFrame>
    );
  }
  // ai — the chat, answering as itself
  return (
    <ArtifactFrame
      variant="card"
      tone="paper"
      label="Ask-this-site chat answering a visitor"
      className="w-[min(100%,460px)]"
    >
      <div className="chat-card mt-0! flex-none! border-0! bg-transparent! p-fib-1!">
        <p className="chat-q">{CHAT_Q}</p>
        <div className="chat-a">
          <Monogram className="mt-[3px] h-[16px] w-[16px] shrink-0 opacity-70" />
          <p>
            Yes. Saturday and Sunday mornings from Falcon Field. Want me to
            book you one?
          </p>
        </div>
        {/* the follow-up actually closing — the loop's last beat */}
        <p className="chat-booked" data-chat-booked aria-hidden>
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
  );
}

/* ── the ads page's highlights (the macbook-neo gallery, our content):
   each card is one thing the service actually produces. Numbers are
   PLACEHOLDER — same swap list as lib/work.ts results. ── */
const ADS_HIGHLIGHTS: Highlight[] = [
  {
    key: "ad",
    caption: "Your ad, live on Google.",
    media: (
      <div className="hlg-float">
        <p className="g-sponsored">Sponsored</p>
        <p className="g-url">desertwingsflightschool.com</p>
        <p className="g-title">
          Desert Wings Flight School | Learn to Fly at Falcon Field
        </p>
        <p className="g-desc">
          Discovery flights and PPL through CFI training in Mesa, AZ.
        </p>
      </div>
    ),
  },
  {
    key: "landing",
    caption: "Every click lands on a page built to convert.",
    fill: true,
    media: (
      <Image
        src="/work/dw-tour.jpg"
        alt="The Desert Wings landing page we designed and built"
        width={2880}
        height={4446}
        sizes="88vw"
      />
    ),
  },
  {
    key: "tracking",
    caption: "Tracked to the dollar, in your own account.",
    media: (
      <div className="text-center">
        <p className="t-num font-display text-[clamp(3.4rem,7vw,6rem)] font-[650] leading-none">
          $38
        </p>
        <p className="t-meta mt-[13px] text-paper/60">
          cost per lead · last 30 days
        </p>
      </div>
    ),
  },
  {
    key: "report",
    caption: "A report you can read in one minute.",
    media: (
      <div className="hlg-float">
        {[
          ["Leads", "26"],
          ["Cost per lead", "$38"],
          ["Search impression share", "74%"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="flex items-baseline justify-between gap-[13px] border-b border-ink/10 py-[9px] text-[0.9375rem] last:border-b-0"
          >
            <span className="text-ink/70">{k}</span>
            <span className="t-num font-[600]">{v}</span>
          </div>
        ))}
        <p className="t-meta mt-[13px] text-ink/50">Sent every Monday</p>
      </div>
    ),
  },
];

export function ServicePage({ service }: { service: ServiceDef }) {
  const root = useRef<HTMLElement>(null!);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const siblings = siblingServices(service.slug);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const nav = document.querySelector(".site-nav");

      if (reducedMotion()) {
        if (nav) gsap.set(nav, { autoAlpha: 1 });
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        gsap.set(q(".g-ext a"), { autoAlpha: 1 });
        const chatQ = q(".chat-q")[0] as HTMLElement | undefined;
        if (chatQ) chatQ.textContent = CHAT_Q;
        // the demo rests as a still: exchange complete, booking confirmed
        gsap.set(q("[data-chat-booked]"), { autoAlpha: 1 });
        return;
      }

      /* ── hero: statement rises first, the artifact settles LAST, then its
         one loop-once micro-demo plays (animate-last = highest hierarchy) ── */
      const chatQEl = q(".chat-q")[0] as HTMLElement | undefined;
      if (chatQEl) chatQEl.textContent = "";
      const enter = contextSafe!(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE_STRUCTURE } });
        // the nav is pre-hidden site-wide; a soft nav arrives with it visible
        // (to() from 1 is a no-op), a hard load fades it in with the statement
        if (nav) tl.to(nav, { autoAlpha: 1, duration: 0.6, ease: EASE_UI }, 0.1);
        // the title rises WITH the nav beat, not after it (the fade is a
        // no-op on soft navs — sequencing behind it just delayed the page)
        tl.fromTo(
          q(".svc-hero .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 0.95, stagger: 0.09 },
          "<"
        )
          .fromTo(
            q("[data-anim='h-sub']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_UI },
            "-=0.5"
          )
          .fromTo(
            q("[data-anim='h-art']"),
            { autoAlpha: 0, y: 21 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
            "-=0.35"
          );

        if (service.slug === "google-ads") {
          // the ad's sitelink extensions tick in
          tl.fromTo(
            q(".g-ext a"),
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.1, ease: EASE_UI },
            "+=0.15"
          );
        }
      });

      /* ── the artifact's ambient demo: each stage enacts its namesake on a
         governed loop (in view + tab visible only). The entrance settles the
         card; the loop is what keeps it ALIVE. ── */
      const loops: gsap.core.Timeline[] = [];

      if (service.slug === "google-ads") {
        // the CLICK, taken: a cursor arrives and presses a sitelink
        const ad = q(".g-ad")[0] as HTMLElement;
        const cursor = q(".g-cursor")[0] as HTMLElement;
        const ring = q(".g-click-ring")[0] as HTMLElement;
        const link = q(".g-ext a")[0] as HTMLElement;
        if (ad && cursor && ring && link) {
          const pt = () => ({
            x: link.offsetLeft + link.offsetWidth * 0.5,
            y: link.offsetTop + link.offsetHeight * 0.55,
          });
          gsap.set(ring, { xPercent: -50, yPercent: -50 });
          const c = gsap.timeline({ repeat: -1, paused: true, repeatRefresh: true });
          c.to({}, { duration: 2.4 })
            .set(cursor, {
              x: () => ad.offsetWidth - 34,
              y: () => ad.offsetHeight - 8,
              autoAlpha: 0,
              scale: 1,
            })
            .to(cursor, { autoAlpha: 1, duration: 0.25, ease: EASE_UI })
            .to(
              cursor,
              { x: () => pt().x, y: () => pt().y, duration: 0.9, ease: EASE_STRUCTURE },
              "<"
            )
            .to(cursor, { scale: 0.78, duration: 0.09, ease: EASE_UI })
            // set-then-to, never fromTo: repeatRefresh re-renders an
            // invalidated fromTo's FROM state at every cycle start
            .set(ring, { x: () => pt().x + 3, y: () => pt().y + 3, autoAlpha: 0.55, scale: 0.25 }, "<")
            .to(ring, { autoAlpha: 0, scale: 1, duration: 0.6, ease: EASE_UI }, "<")
            .to(link, { opacity: 0.5, duration: 0.09, yoyo: true, repeat: 1, ease: "none" }, "<")
            .to(cursor, { scale: 1, duration: 0.16, ease: EASE_UI }, "-=0.4")
            .to(cursor, { autoAlpha: 0, duration: 0.35, ease: EASE_UI }, "+=0.5")
            .to({}, { duration: 3.6 });
          loops.push(c);
        }
      }

      if (service.slug === "websites") {
        // the LANDING, riding: the page the click arrives on scrolls itself
        const tourEl = q("[data-svc-tour]")[0] as HTMLElement | undefined;
        if (tourEl) {
          const well = tourEl.parentElement as HTMLElement;
          const travel = () =>
            -Math.max(0, 1 - well.offsetHeight / tourEl.offsetHeight) * 100;
          const c = gsap.timeline({ repeat: -1, paused: true, repeatRefresh: true });
          c.to({}, { duration: 1.4 })
            .to(tourEl, { yPercent: travel, duration: 14, ease: "none" })
            .to({}, { duration: 0.9 })
            .to(tourEl, { yPercent: 0, duration: 2.4, ease: EASE_STRUCTURE })
            .to({}, { duration: 1.1 });
          loops.push(c);
        }
      }

      if (service.slug === "ai" && chatQEl) {
        // the FOLLOW-UP, closing: question types, answer lands, booking
        // confirms — then the exchange resets and works the next lead
        const chatQ = chatQEl;
        const chatA = q(".chat-a")[0] as HTMLElement;
        const booked = q("[data-chat-booked]")[0] as HTMLElement;
        // pre-arrival state NOW — the paused loop's own set() only renders
        // on play, and the answer must never paint before its question
        gsap.set([chatA, booked], { autoAlpha: 0 });
        const state = { n: 0 };
        const c = gsap.timeline({ repeat: -1, paused: true });
        c.set([chatA, booked], { autoAlpha: 0 })
          .set(chatQ, { autoAlpha: 1 })
          .call(() => {
            state.n = 0;
            chatQ.textContent = "";
          })
          .to({}, { duration: 0.6 })
          .to(state, {
            n: CHAT_Q.length,
            duration: 1.1,
            ease: "none", // diegetic typing, constant rate
            snap: { n: 1 },
            onUpdate: () => {
              chatQ.textContent = CHAT_Q.slice(0, state.n);
            },
          })
          .to(chatA, { autoAlpha: 1, duration: 0.5, ease: EASE_UI }, "+=0.4")
          .to(booked, { autoAlpha: 1, duration: 0.4, ease: EASE_UI }, "+=0.9")
          .to({}, { duration: 3.8 })
          .to([chatQ, chatA, booked], {
            autoAlpha: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: EASE_UI,
          })
          .to({}, { duration: 0.5 });
        loops.push(c);
      }

      // governance: loops run only after arrival, in view, tab visible
      let arrived = false;
      let heroInView = false;
      const syncLoops = () => {
        const on = arrived && heroInView && !document.hidden;
        loops.forEach((l) => (on ? l.play() : l.pause()));
      };
      if (loops.length) {
        ScrollTrigger.create({
          trigger: q(".svc-hero")[0],
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            heroInView = self.isActive;
            syncLoops();
          },
        });
        document.addEventListener("visibilitychange", syncLoops);
      }

      let dead = false;
      whenArrived().then(() => {
        if (dead) return;
        enter();
        arrived = true;
        syncLoops();
      });

      /* hero artifact drift — contained one-plane parallax against the
         scroll. The self-scrolling tour already owns its plane's motion, so
         the websites frame stays put (two movements on one axis double up). */
      if (!q("[data-svc-tour]")[0]) {
        gsap.fromTo(
          q("[data-anim='h-art']"),
          { y: 0 },
          {
            y: -21,
            ease: "none",
            scrollTrigger: {
              trigger: q(".svc-hero")[0],
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      /* ── deliverables: rows enter with a directional stagger; on desktop the
         accent mark then WALKS the list as you read (index-sweep: everything
         stays visible, the sweep only directs the eye) ── */
      // THE fade-up (apple-grammar.md §5) — one recipe, fires on entry
      revealUp(q("[data-anim='rail']"), q(".svc-deliver")[0]);
      revealUp(q("[data-anim='d-row']"), q(".svc-d-list")[0]);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 821px)", () => {
        const list = q(".svc-d-list")[0] as HTMLElement;
        const rows = q(".svc-d") as HTMLElement[];
        const inners = q(".svc-d-in") as HTMLElement[];
        const mark = q(".svc-mark")[0] as HTMLElement;
        if (!list || rows.length < 2 || !mark) return;

        gsap.set(inners, { opacity: 0.6 });
        gsap.set(inners[0], { opacity: 1 });
        gsap.set(mark, { autoAlpha: 1, y: rows[0].offsetTop + 44 });

        let prev = 0;
        const setActive = (i: number) => {
          if (i === prev) return;
          prev = i;
          gsap.to(inners, { opacity: 0.6, duration: 0.4, ease: EASE_UI, overwrite: "auto" });
          gsap.to(inners[i], { opacity: 1, duration: 0.4, ease: EASE_UI, overwrite: "auto" });
          gsap.to(mark, {
            y: rows[i].offsetTop + 44,
            duration: 0.55,
            ease: EASE_STRUCTURE,
            overwrite: "auto",
          });
        };
        const st = ScrollTrigger.create({
          trigger: list,
          start: "top 58%",
          end: "bottom 45%",
          onUpdate: (self) =>
            setActive(Math.round(self.progress * (rows.length - 1))),
        });
        return () => {
          st.kill();
          gsap.set(inners, { opacity: 1 });
        };
      });
      // mobile: no sweep — every row rests fully legible
      mm.add("(max-width: 820px)", () => {
        gsap.set(q(".svc-d-in"), { opacity: 1 });
        gsap.set(q(".svc-mark"), { autoAlpha: 0 });
      });

      /* ── process cards: head, then the row deals in left to right ── */
      revealUp(q("[data-anim='proc']"), q(".svc-process")[0]);
      revealUp(q("[data-anim='proc-card']"), q(".proc-card")[0]);

      /* ── price beat: the peak — lead line, then the number rises ── */
      const priceTl = gsap.timeline({
        defaults: { ease: EASE_STRUCTURE },
        scrollTrigger: { trigger: q(".svc-price")[0], start: "top 72%", once: true },
      });
      priceTl
        .fromTo(
          q("[data-anim='p-lead']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE_UI }
        )
        .fromTo(
          q(".svc-price .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 0.95 },
          "-=0.25"
        )
        .fromTo(
          q("[data-anim='p-out']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_UI },
          "-=0.4"
        );

      // the witnesses join after the claim has landed (home price-beat grammar)
      gsap.fromTo(
        q("[data-anim='quote']"),
        { autoAlpha: 0, y: 21, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.16,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: q(".svc-price")[0], start: "top 45%", once: true },
        }
      );
      // and breathe at their own rates while the section is on screen
      (q("[data-drift]") as HTMLElement[]).forEach((el) => {
        gsap.to(el, {
          yPercent: parseFloat(el.dataset.drift || "0"),
          ease: "none",
          scrollTrigger: {
            trigger: q(".svc-price")[0],
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      revealUp(q("[data-anim='faq']"), q(".svc-faq")[0], { stagger: 0.07 });

      revealUp(q("[data-anim='x-card']"), q(".svc-funnel")[0]);

      revealUp(q("[data-anim='ask']"), q(".svc-ask")[0]);

      return () => {
        dead = true;
        document.removeEventListener("visibilitychange", syncLoops);
      };
    },
    { scope: root }
  );

  return (
    <article ref={root}>
      {/* ── HERO · the Apple center-stage: one thing at a time, stacked —
          statement, one gray sentence, the action, then THE artifact,
          enormous and centered beneath the words (never beside them) ── */}
      <section className="svc-hero relative overflow-x-clip">
        <div className="wrap flex flex-col items-center pb-fib-6 pt-[144px] text-center md:pt-[176px]">
          <p data-anim="h-sub" className="t-meta text-ink/55">
            {service.stage}
          </p>
          <h1 className="t-display-title mt-fib-2">
            {service.title.map((line) => (
              <span key={line} className="mask-line">
                <span className="mask-inner">{line}</span>
              </span>
            ))}
          </h1>
          <p data-anim="h-sub" className="mx-auto mt-fib-3 max-w-[46ch] text-ink/70">
            {service.support}
          </p>
          <div
            data-anim="h-sub"
            className="mt-fib-4 flex flex-wrap items-center justify-center gap-fib-3"
          >
            <CTA href="/pricing#estimate" label="Get an instant estimate" tone="accent" />
            <Link href="/pricing" className="u-link t-meta text-ink/70">
              See the whole pricing sheet
            </Link>
          </div>
          <div
            data-anim="h-art"
            className={`mt-fib-5 w-full md:mt-fib-6 ${
              service.slug === "websites"
                ? "max-w-[980px]"
                : "flex justify-center"
            }`}
          >
            <HeroArtifact slug={service.slug} />
          </div>
        </div>
      </section>

      {/* ── THE HIGHLIGHTS · the swiping gallery (ads page only) ── */}
      {service.slug === "google-ads" && (
        <HighlightsGallery
          label="Google Ads highlights"
          heading="The highlights."
          items={ADS_HIGHLIGHTS}
        />
      )}

      {/* ── WHAT YOU GET · the page's DARK chapter (the homepage funnel-panel
          grammar: the offer lives on the brand's important-objects ground) ── */}
      <section className="svc-deliver py-fib-4 md:py-fib-5">
        <div className="dark-chapter mx-[8px] rounded-panel py-fib-6 md:mx-[13px]">
          <div className="wrap grid gap-fib-5 md:grid-cols-[minmax(260px,340px)_1fr] md:gap-fib-6">
            <div>
              <div className="md:sticky md:top-[144px]">
                <h2 data-anim="rail" className="t-display-lg">
                  What you actually get
                </h2>
                <p data-anim="rail" className="mt-fib-3 max-w-[28ch] text-paper/70">
                  {service.slug === "google-ads" &&
                    "Not impressions. Leads, a cost per lead, and a report you can read in one minute."}
                  {service.slug === "websites" &&
                    "Not a template with your logo on it. A page built from your business, that you own outright."}
                  {service.slug === "ai" &&
                    "Not a chatbot widget. A follow-up system that works your leads while you work."}
                </p>
              </div>
            </div>

            <div className="svc-d-list relative md:pl-fib-5">
              {/* the traveling accent — directs the eye; never gates the content */}
              <span className="svc-mark" aria-hidden />
              <ul className="flex flex-col gap-fib-2 md:gap-fib-3">
                {service.deliverables.map((d) => (
                  <li key={d.name} data-anim="d-row" className="svc-d">
                    <div className="svc-d-in">
                      <h3 className="t-title--lg font-display">{d.name}</h3>
                      <p className="mt-fib-2 max-w-[52ch] text-paper/70">{d.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT RUNS · the Lesse process row, EAS skin ── */}
      <section className="svc-process py-fib-5 md:py-fib-6">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-fib-3 md:flex-row md:items-end">
            <h2 data-anim="proc" className="t-display-lg max-w-[12ch]">
              How it runs
            </h2>
            <p data-anim="proc" className="max-w-[38ch] text-ink/70 md:text-right">
              {service.slug === "google-ads" &&
                "From first call to a report you can hold us to. No setup fees, no lock-in."}
              {service.slug === "websites" &&
                "From first call to launch. The quote is fixed on day two and never moves."}
              {service.slug === "ai" &&
                "Scoped, built, checked and managed. Nothing goes live until you've seen it work."}
            </p>
          </div>
          <div className="mt-fib-4 md:mt-fib-5">
            <ProcessCards steps={service.process} anim="proc-card" />
          </div>
        </div>
      </section>

      {/* ── BUILD YOURS · the toy lives HERE, not on the homepage: on this
          page the visitor has self-selected into website intent, so "what
          would yours look like" closes instead of mispositioning ── */}
      {service.slug === "websites" && <Builder />}

      {/* ── THE PRICE · the one centered statement peak, open on the canvas,
          with the client voices floating around it (the home price-beat
          grammar) ── */}
      <section className="svc-price relative overflow-x-clip" data-pcta-hide>
        <div className="wrap relative flex min-h-[88svh] flex-col items-center justify-center py-fib-6 text-center md:py-fib-7">
          <p data-anim="p-lead" className="t-meta text-ink/60">
            {service.price.lead}
          </p>
          <p className="t-statement t-statement--hero mt-fib-3">
            <span className="mask-line">
              <span className="mask-inner">
                {service.price.big === service.price.accent ? (
                  <span className="text-accent">{service.price.big}</span>
                ) : (
                  <>
                    {service.price.big.slice(
                      0,
                      service.price.big.indexOf(service.price.accent)
                    )}
                    <span className="text-accent">{service.price.accent}</span>
                  </>
                )}
              </span>
            </span>
          </p>
          <p data-anim="p-out" className="mx-auto mt-fib-3 max-w-[44ch] text-ink/70">
            {service.price.note}
          </p>
          <div data-anim="p-out" className="mt-fib-4 flex flex-wrap justify-center gap-fib-1">
            {service.price.chips.map((c) => (
              <span key={c} className="chip">
                {c}
              </span>
            ))}
          </div>
          <div data-anim="p-out" className="mt-fib-4 flex justify-center">
            <CTA href="/pricing#estimate" label="Price your project" tone="ink" />
          </div>

          {/* the witnesses — quieter, floating around the claim (desktop);
              they join AFTER the price lands and drift at their own rates */}
          <div className="hidden lg:block" aria-hidden="false">
            {QUOTES.map((quo, i) => (
              <figure
                key={quo.name}
                data-anim="quote"
                data-drift={i % 2 === 0 ? "-4" : "3"}
                className={`pb-quote ${
                  i === 0 ? "pb-quote--tl" : i === 1 ? "pb-quote--tr" : "pb-quote--bl"
                }`}
              >
                <blockquote>
                  <p className="text-[0.9375rem] leading-[1.5] text-ink/70">
                    &ldquo;{quo.text}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-fib-2 flex items-center gap-[8px]">
                  <span className={`pb-av ${AV_TINTS[i]}`}>
                    <PersonIcon />
                  </span>
                  <span className="t-meta text-ink/45">{quo.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* mobile / tablet: the witnesses stack under the claim */}
        <div className="wrap grid gap-fib-3 pb-fib-6 sm:grid-cols-3 lg:hidden">
          {QUOTES.map((quo, i) => (
            <figure
              key={quo.name}
              data-anim="quote"
              className="rounded-panel bg-panel/60 p-fib-4"
            >
              <blockquote>
                <p className="text-[0.9375rem] leading-[1.5] text-ink/70">
                  &ldquo;{quo.text}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-fib-2 flex items-center gap-[8px]">
                <span className={`pb-av ${AV_TINTS[i]}`}>
                  <PersonIcon />
                </span>
                <span className="t-meta text-ink/45">{quo.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── QUESTIONS · the three that decide this stage ── */}
      <section className="svc-faq py-fib-6">
        <div className="wrap grid gap-fib-4 md:grid-cols-[minmax(260px,340px)_1fr] md:gap-fib-6">
          <div>
            <div className="md:sticky md:top-[144px]">
              <h2 data-anim="faq" className="t-display-lg max-w-[10ch]">
                Asked every week
              </h2>
            </div>
          </div>
          <div className="flex flex-col gap-fib-2">
            {service.faqs.map((f, i) => (
              <div
                key={f.q}
                data-anim="faq"
                className={`faq-card ${openFaq === i ? "is-open" : ""}`}
              >
                <button
                  className="faq-q"
                  aria-expanded={openFaq === i}
                  aria-controls={`svc-faq-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{f.q}</span>
                  <span className="faq-x" aria-hidden />
                </button>
                <div id={`svc-faq-${i}`} className="faq-a" role="region">
                  <div>
                    <p className="max-w-[62ch] text-ink/75">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE REST OF THE FUNNEL · motif carries out ── */}
      <section className="svc-funnel py-fib-6">
        <div className="wrap">
          <div className="flex flex-col justify-between gap-fib-3 md:flex-row md:items-end">
            <h2 data-anim="x-card" className="t-display-lg max-w-[14ch]">
              The rest of the funnel
            </h2>
            <p data-anim="x-card" className="max-w-[38ch] text-ink/70 md:text-right">
              {service.stage} is one of three stages. Buy the stage you need,
              or the whole path.
            </p>
          </div>
          <div className="mt-fib-4 grid gap-fib-3 md:grid-cols-2 md:gap-fib-4">
            {siblings.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                data-anim="x-card"
                className="svc-x"
              >
                <span className="chip chip--sm">
                  Stage {s.stageIndex} · {s.stage}
                </span>
                <span className="t-title--lg mt-fib-3 block font-display">
                  {s.nav}
                </span>
                <span className="mt-fib-2 block max-w-[36ch] text-ink/70">
                  {SERVICE_META[s.slug].line}
                </span>
                <span className="svc-x-foot">
                  <span className="t-meta text-ink/60">
                    {SERVICE_META[s.slug].price}
                  </span>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M2 8h11M9 3.5 13.5 8 9 12.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE ASK · dark panel floating on the canvas ── */}
      <section className="svc-ask" data-pcta-hide>
        <div className="dark-chapter mx-[8px] mb-fib-3 rounded-panel py-fib-6 md:mx-[13px]">
          <div className="wrap flex flex-col items-start justify-between gap-fib-4 md:flex-row md:items-end">
            <div>
              <h2 data-anim="ask" className="t-display-lg max-w-[13ch]">
                Price it in sixty seconds
              </h2>
              <p data-anim="ask" className="mt-fib-3 max-w-[42ch] text-paper/70">
                The estimator computes from the same sheet we quote from. Pick
                what your business needs and watch the number move.
              </p>
            </div>
            <div data-anim="ask" className="flex flex-wrap items-center gap-fib-3">
              <CTA href="/pricing#estimate" label="Get an instant estimate" tone="accent" />
              <Link href="/contact" className="u-link t-meta text-paper/70">
                Or just tell us about your business
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
