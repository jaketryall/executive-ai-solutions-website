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
import { CTA } from "@/components/ui/cta";
import { Builder } from "@/components/sections/builder";
import { ArtifactFrame } from "@/components/ui/artifact";
import { Monogram } from "@/components/ui/monogram";
import { ProcessCards } from "@/components/ui/process-cards";
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
        <div className="g-ad mt-0! border-t-0! pt-0! p-fib-1">
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
    );
  }
  if (slug === "websites") {
    return (
      <div className="relative md:pb-fib-5 md:pl-fib-4">
        <ArtifactFrame
          variant="chrome"
          tone="paper"
          url="desertwingsflightschool.com/fleet"
          label="The Desert Wings fleet page we designed and built"
          bodyClassName="!p-0"
        >
          <div
            className="overflow-hidden rounded-btn"
            style={{ aspectRatio: "1.55" }}
          >
            <Image
              data-svc-parallax
              src="/work/desert-wings-fleet.png"
              alt="The custom fleet page built for Desert Wings Flight School"
              width={1200}
              height={800}
              sizes="(min-width: 821px) 42vw, 92vw"
              priority
              className="block h-[112%] w-full object-cover object-top"
            />
          </div>
        </ArtifactFrame>
        {/* the same build, in a pocket — proof it holds up at phone size */}
        <div
          data-anim="h-art2"
          className="phone-card absolute -bottom-fib-3 left-0 hidden w-[min(190px,30%)] md:block"
        >
          <Image
            src="/work/desert-wings-mobile.png"
            alt="The same Desert Wings build on a phone"
            width={400}
            height={840}
            sizes="190px"
          />
        </div>
      </div>
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
        <p className="serp-tag t-meta">
          Ask-this-site chat, answering from your pages
        </p>
      </div>
    </ArtifactFrame>
  );
}

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
        tl.fromTo(
          q(".svc-hero .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 0.95, stagger: 0.09 }
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
        if (service.slug === "websites") {
          // the phone pocket slides in under the frame
          tl.fromTo(
            q("[data-anim='h-art2']"),
            { autoAlpha: 0, y: 34 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            "-=0.3"
          );
        }
        if (service.slug === "ai" && chatQEl) {
          // the chat types its one question, then the answer arrives
          const state = { n: 0 };
          tl.to(
            state,
            {
              n: CHAT_Q.length,
              duration: 0.9,
              ease: "none", // diegetic typing, constant rate
              snap: { n: 1 },
              onUpdate: () => {
                chatQEl.textContent = CHAT_Q.slice(0, state.n);
              },
            },
            "+=0.15"
          ).fromTo(
            q(".chat-a"),
            { autoAlpha: 0, y: 10 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            ">-0.05"
          );
        }
      });
      let dead = false;
      whenArrived().then(() => !dead && enter());

      /* hero artifact drift — contained one-plane parallax against the scroll */
      const par = q("[data-svc-parallax]")[0];
      if (par) {
        gsap.fromTo(
          par,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: q(".svc-hero")[0],
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      } else {
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
      gsap.fromTo(
        q("[data-anim='rail']"),
        { autoAlpha: 0, x: -21 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.7,
          ease: EASE_STRUCTURE,
          stagger: 0.08,
          scrollTrigger: { trigger: q(".svc-deliver")[0], start: "top 74%", once: true },
        }
      );
      gsap.fromTo(
        q("[data-anim='d-row']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: EASE_STRUCTURE,
          stagger: 0.09,
          scrollTrigger: { trigger: q(".svc-d-list")[0], start: "top 74%", once: true },
        }
      );

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
      gsap.fromTo(
        q("[data-anim='proc']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: EASE_STRUCTURE,
          stagger: 0.08,
          scrollTrigger: { trigger: q(".svc-process")[0], start: "top 76%", once: true },
        }
      );
      gsap.fromTo(
        q("[data-anim='proc-card']"),
        { autoAlpha: 0, y: 34, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          stagger: 0.1,
          scrollTrigger: { trigger: q(".proc-card")[0], start: "top 82%", once: true },
        }
      );

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

      /* faq rows: quiet rise */
      gsap.fromTo(
        q("[data-anim='faq']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          stagger: 0.07,
          scrollTrigger: { trigger: q(".svc-faq")[0], start: "top 78%", once: true },
        }
      );

      /* funnel cross-links: scale-settle */
      gsap.fromTo(
        q("[data-anim='x-card']"),
        { autoAlpha: 0, y: 21, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          stagger: 0.12,
          scrollTrigger: { trigger: q(".svc-funnel")[0], start: "top 76%", once: true },
        }
      );

      /* the ask panel */
      gsap.fromTo(
        q("[data-anim='ask']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          stagger: 0.09,
          scrollTrigger: { trigger: q(".svc-ask")[0], start: "top 74%", once: true },
        }
      );

      return () => {
        dead = true;
      };
    },
    { scope: root }
  );

  return (
    <article ref={root}>
      {/* ── HERO · split, artifact right, statement leads ── */}
      <section className="svc-hero relative overflow-x-clip">
        <div className="wrap grid items-center gap-fib-5 pb-fib-6 pt-[144px] md:min-h-[82svh] md:grid-cols-[55fr_45fr] md:gap-fib-6 md:pt-[176px]">
          <div>
            <span data-anim="h-sub" className="chip">
              Stage {service.stageIndex} · {service.stage}
            </span>
            <h1 className="t-display-title mt-fib-3">
              {service.title.map((line) => (
                <span key={line} className="mask-line">
                  <span className="mask-inner">{line}</span>
                </span>
              ))}
            </h1>
            <p data-anim="h-sub" className="mt-fib-3 max-w-[46ch] text-ink/70">
              {service.support}
            </p>
            <div data-anim="h-sub" className="mt-fib-4 flex flex-wrap items-center gap-fib-3">
              <CTA href="/pricing#estimate" label="Get an instant estimate" tone="accent" />
              <Link href="/pricing" className="u-link t-meta text-ink/70">
                See the whole pricing sheet
              </Link>
            </div>
          </div>
          <div data-anim="h-art" className="justify-self-center md:justify-self-end">
            <HeroArtifact slug={service.slug} />
          </div>
        </div>
      </section>

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
