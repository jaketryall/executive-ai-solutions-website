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
  ScrollTrigger,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";

/* The work index — the six2eight composition (Jake, 2026-07-22: "filter on
   left and the card columns right what do you think") in the house grammar:
   a sticky dark RAIL on the left holding the project INDEX (scrollspy, not a
   filter — a filter over two projects showcases the emptiness; it graduates
   into one when the archive earns it) plus the always-reachable "Have a
   project?" CTA, and the tiles stacked ONE per row on the right so each
   build gets showcase width. The roster still ends on the visitor: the open
   slot is the rail's third entry. Rail is lg+ only; mobile keeps the plain
   stack. */

export function WorkIndex() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const nav = document.querySelector(".site-nav");

      /* scrollspy — functional state, so it runs under reduced motion too.
         onToggle only ever turns a link ON (the last passed card stays lit
         while the header/gaps scroll by), and the first entry starts lit. */
      const links = q(".wk-rail-link") as HTMLAnchorElement[];
      const setActive = (key: string) =>
        links.forEach((l) => l.classList.toggle("is-on", l.dataset.spy === key));
      if (links.length) setActive(links[0].dataset.spy!);
      (q("[data-spy-card]") as HTMLElement[]).forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(card.dataset.spyCard!);
          },
        });
      });

      if (reducedMotion()) {
        if (nav) gsap.set(nav, { autoAlpha: 1 });
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        return;
      }

      /* arrival: the header sets, the rail and first chapter follow */
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
        )
          .fromTo(
            q("[data-anim='head-sub']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
            "-=0.5"
          )
          .fromTo(
            q("[data-anim='rail']"),
            { autoAlpha: 0, y: 21 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            "-=0.45"
          );
      });
      let dead = false;
      whenArrived().then(() => !dead && enter());

      /* chapters: a quiet rise, then the media breathes against the scroll
         (contained parallax — the "expensive" tell, nothing louder) */
      (q("[data-anim='chapter']") as HTMLElement[]).forEach((el) =>
        revealUp(el, el)
      );
      // contained parallax — DESKTOP ONLY (mobile motion diet 2026-08-08):
      // a scrubbed transform every scroll frame is the classic
      // expensive-on-mobile-for-nothing effect; the overscan scale keeps
      // the image looking right static, so touch just loses the drift.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 821px)", () => {
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

      {/* ── the split: rail left (index + CTA), showcase column right ── */}
      <div className="wrap grid items-start gap-fib-3 pb-fib-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside
          data-anim="rail"
          className="wk-rail rounded-panel hidden lg:sticky lg:top-fib-6 lg:flex"
          aria-label="Project index"
        >
          <p className="t-meta px-fib-2 text-paper/50">The roster</p>
          <nav className="wk-rail-list" aria-label="Jump to a project">
            {PROJECTS.map((p) => (
              <a
                key={p.slug}
                href={`#wk-${p.slug}`}
                data-spy={p.slug}
                className="wk-rail-link"
              >
                {p.listName}
                <span className="t-meta text-current/60">{p.sector}</span>
              </a>
            ))}
            {/* the roster ends on the visitor — an index entry, not a filter */}
            <a href="#wk-next" data-spy="next" className="wk-rail-link">
              Your business
              <span className="t-meta text-current/60">Next</span>
            </a>
          </nav>
          {/* the rail's real job: the action never scrolls away */}
          <Link href="/pricing#estimate" className="wk-rail-cta">
            Have a project?
            <svg viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M2 8h11M9 3.5 13.5 8 9 12.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </aside>

        <div className="grid grid-cols-1 gap-fib-3">
          {PROJECTS.map((p, i) => {
            const [hero] = p.results?.metrics ?? [];
            return (
              <Link
                key={p.slug}
                id={`wk-${p.slug}`}
                data-spy-card={p.slug}
                href={`/work/${p.slug}`}
                data-anim="chapter"
                className="wkt dark-chapter rounded-panel p-fib-2"
                aria-label={`${p.client}: open the case study`}
              >
                <div className="wkc-media relative aspect-square overflow-hidden rounded-frame md:aspect-16/10">
                  <div data-wkc-par className="wkc-par">
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt}
                      fill
                      sizes="(min-width: 1024px) 72vw, 96vw"
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
                        className="h-fib-3 w-fib-3 shrink-0 object-contain"
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
                    {hero ? `${hero.value} ${hero.label}` : (p.listLine ?? "")}
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
            id="wk-next"
            data-spy-card="next"
            href="/pricing#estimate"
            data-anim="chapter"
            data-no-vt
            className="wkt wkt--open closer-card rounded-panel"
          >
            <span className="wk-open-face">
              {/* pitched as the treatment every build gets — never as an
                  empty seat asking to be filled (the persona audit read the
                  old "this spot is open" as a thin portfolio begging) */}
              <span className="t-display-lg">The next case study</span>
              <span className="max-w-[38ch] text-paper/85">
                Every build gets this treatment — designed, measured,
                documented, and linked live. Price yours in about sixty
                seconds.
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
      </div>
    </section>
  );
}
