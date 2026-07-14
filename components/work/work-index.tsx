"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/work";
import { whenArrived } from "@/components/anim/arrival";
import { revealUp } from "@/components/anim/reveal";
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
        // the title rises WITH the nav beat, not after it (the fade is a
        // no-op on soft navs — sequencing behind it just delayed the page)
        tl.fromTo(
          q(".wk-head .mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 0.95, stagger: 0.09 },
          "<"
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
      (q("[data-anim='chapter']") as HTMLElement[]).forEach((el) =>
        revealUp(el, el)
      );
      (q("[data-wkc-par]") as HTMLElement[]).forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest(".wkt"),
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

      {/* ── the grid: itsjay's work grid in the site's card grammar —
          2-up dark tiles, image inset, name + meta on the footer strip ── */}
      <div className="grid grid-cols-1 gap-[8px] px-[8px] pb-fib-6 md:grid-cols-2 md:gap-[13px] md:px-[13px]">
        {PROJECTS.map((p, i) => {
          const [hero] = p.results?.metrics ?? [];
          return (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              data-anim="chapter"
              className="wkt dark-chapter rounded-panel p-fib-2"
              aria-label={`${p.client}: open the case study`}
            >
              <div className="wkc-media relative aspect-square overflow-hidden rounded-frame md:aspect-4/3">
                <div data-wkc-par className="wkc-par">
                  <Image
                    src={p.cover.src}
                    alt={p.cover.alt}
                    fill
                    sizes="(min-width: 821px) 48vw, 96vw"
                    className="wkc-img"
                    priority={i === 0} // the first tile is the page's LCP
                  />
                </div>
              </div>

              {/* the footer strip: name leads, meta answers (itsjay's line,
                  Lesse's restraint) */}
              <div className="mt-fib-2 flex items-center justify-between gap-fib-2 px-fib-1">
                <span className="flex min-w-0 items-center gap-fib-2">
                  {p.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logo}
                      alt=""
                      className="h-[21px] w-[21px] shrink-0 object-contain"
                    />
                  )}
                  <h2 className="t-title truncate text-paper">{p.listName}</h2>
                </span>
                <span className="t-meta shrink-0 text-paper/50">
                  {p.sector} · {p.year}
                </span>
              </div>
              {/* metric + live status. Static and fully legible on purpose:
                  the ignition experiment (derived-motion.md) taught that with
                  two tiles there's no attention to choreograph, and proof
                  imagery must never sit in shadow — so the liveness is simply
                  STATED, in ink that never dims */}
              <p className="t-meta mt-fib-1 flex flex-wrap items-center justify-between gap-x-fib-2 gap-y-1 px-fib-1 pb-fib-1">
                <span className="wk-metric">
                  {hero
                    ? `${hero.value} ${hero.label}`
                    : "The build you're inside right now"}
                </span>
                <span className="wk-live">
                  {p.status === "Live" && p.urlLabel
                    ? `Live · ${p.urlLabel}`
                    : p.status}
                </span>
              </p>
            </Link>
          );
        })}

        {/* the open slot — the roster ends on the visitor */}
        <Link
          href="/pricing#estimate"
          data-anim="chapter"
          data-no-vt
          className="wkt wkt--open closer-card rounded-panel md:col-span-2"
        >
          <span className="wk-open-face">
            {/* pitched as the treatment every build gets — never as an
                empty seat asking to be filled (the persona audit read the
                old "this spot is open" as a thin portfolio begging) */}
            <span className="t-display-lg">The next case study</span>
            <span className="max-w-[38ch] text-paper/85">
              Every build gets this treatment — designed, measured, documented,
              and linked live. Price yours in about sixty seconds.
            </span>
            <span className="wki-open-pill">
              Price my project
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
