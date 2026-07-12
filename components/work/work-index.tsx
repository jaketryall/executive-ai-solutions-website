"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, vtName } from "@/lib/work";
import { whenArrived } from "@/components/anim/arrival";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";

/* The work index — full-bleed CHAPTERS that stay CARDS. Each project is one
   near-viewport inset panel floating on the canvas (the same grammar as the
   dark chapters: rounded, margins, the canvas flowing around it), with the
   build filling the card and the name + the numbers composed over it. One
   glance per project: what it is, what it did, where to go deeper. No ledes,
   the case study is the deep dive. The roster ends on the visitor: the last
   chapter is the open slot. */

export function WorkIndex() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const nav = document.querySelector(".site-nav");

      if (reducedMotion()) {
        if (nav) gsap.set(nav, { autoAlpha: 1 });
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        return;
      }

      /* arrival: the header sets, the first chapter follows */
      const enter = contextSafe!(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE_STRUCTURE } });
        if (nav) tl.to(nav, { autoAlpha: 1, duration: 0.6, ease: EASE_UI }, 0.1);
        tl.fromTo(
          q(".wk-head .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 0.95, stagger: 0.09 }
        ).fromTo(
          q("[data-anim='head-sub']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          "-=0.5"
        );
      });
      let dead = false;
      whenArrived().then(() => !dead && enter());

      /* chapters: a quiet rise, then the media breathes against the scroll
         (contained parallax — the "expensive" tell, nothing louder) */
      (q("[data-anim='chapter']") as HTMLElement[]).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 21 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: EASE_STRUCTURE,
            scrollTrigger: { trigger: el, start: "top 84%", once: true },
          }
        );
      });
      (q("[data-wkc-par]") as HTMLElement[]).forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(".wkc"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => {
        dead = true;
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="overflow-x-clip">
      {/* ── header ── */}
      <div className="wrap pb-fib-5 pt-[144px] md:pt-[176px]">
        <header className="wk-head">
          <h1 className="t-display-title max-w-[12ch]">
            <span className="mask-line">
              <span className="mask-inner">The work,</span>
            </span>
            <span className="mask-line">
              <span className="mask-inner">and the numbers</span>
            </span>
          </h1>
          <p data-anim="head-sub" className="mt-fib-3 max-w-[44ch] text-ink/70">
            Every build live and linked. Open a case and judge the craft up
            close.
          </p>
        </header>
      </div>

      {/* ── the chapters: one commanding card per project ── */}
      <div className="flex flex-col gap-fib-4 pb-fib-6">
        {PROJECTS.map((p) => {
          const [hero, ...rest] = p.results?.metrics ?? [];
          return (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-anim="chapter"
              className="wkc dark-chapter mx-[8px] grid gap-fib-3 rounded-panel p-fib-2 md:mx-[13px] md:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] md:gap-fib-4"
              aria-label={`${p.client}: open the case study`}
            >
              {/* the work — inset, rounded, breathing against the scroll
                  (the homepage project-card object) */}
              <div className="relative min-w-0">
                <div
                  className="wkc-media aspect-square overflow-hidden rounded-frame md:aspect-4/3"
                  data-vt-media
                  style={{ viewTransitionName: vtName(p.slug) }}
                >
                  <div
                    data-wkc-par
                    className="wkc-par"
                    style={{
                      transform: `scale(${Math.max(p.backdropCrop?.zoom ?? 1, 1.08)})`,
                      transformOrigin: p.backdropCrop?.origin,
                    }}
                  >
                    <Image
                      src={(p.backdrop ?? p.cover).src}
                      alt={(p.backdrop ?? p.cover).alt}
                      fill
                      sizes="(min-width: 821px) 60vw, 96vw"
                      className="wkc-img"
                      style={
                        p.backdropCrop
                          ? { objectPosition: p.backdropCrop.origin }
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>

              {/* the receipts — on the card, not on the image */}
              <div className="flex min-h-0 min-w-0 flex-col p-fib-2 md:py-fib-3 md:pl-0 md:pr-fib-3">
                <div className="flex flex-wrap items-center gap-fib-2">
                  <span className="chip">{p.sector}</span>
                  <span className="t-meta text-paper/45">
                    {p.kind} · {p.year} · {p.status}
                  </span>
                </div>
                <h2 className="t-display-lg mt-fib-3 text-paper">
                  {p.listName}
                </h2>

                {hero ? (
                  <>
                    <p className="t-num mt-fib-4 font-display text-[3.2rem] font-extrabold leading-none tracking-[-0.03em] text-paper">
                      {hero.value}
                    </p>
                    <p className="mt-fib-1 text-paper/65">{hero.label}</p>
                    {rest.length > 0 && (
                      <p className="t-meta mt-fib-2 text-paper/45">
                        {rest.map((m) => `${m.value} ${m.label}`).join(" · ")}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="mt-fib-4 max-w-[36ch] text-paper/70">
                    The build you&apos;re inside right now. Every interaction
                    on it is the demo.
                  </p>
                )}

                <span className="wkc-open t-meta mt-auto self-start pt-fib-4" aria-hidden>
                  Open the case
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M2 8h11M9 3.5 13.5 8 9 12.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}

        {/* the open slot — the roster ends on the visitor */}
        <Link
          href="/pricing#estimate"
          data-anim="chapter"
          data-no-vt
          className="wkc wkc--open closer-card mx-[8px] md:mx-[13px]"
        >
          <span className="wk-open-face">
            <span className="t-display-lg">This spot is open</span>
            <span className="max-w-[36ch] text-paper/85">
              Price your project in about sixty seconds and see your business
              on this page.
            </span>
            <span className="wki-open-pill">
              Get an estimate
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
          </span>
        </Link>
      </div>
    </section>
  );
}
