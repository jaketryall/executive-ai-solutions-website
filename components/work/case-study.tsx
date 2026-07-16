"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project, WorkFigure } from "@/lib/work";
import { CTA } from "@/components/ui/cta";
import { Monogram } from "@/components/ui/monogram";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
  EASE_UI,
} from "@/components/anim/ease";
import { whenArrived } from "@/components/anim/arrival";
import { revealUp } from "@/components/anim/reveal";

// One case study. Arrivals ride the site-wide sheet transition; the hero
// well paints at its final crop from the first frame (overscan is a CSS
// base state) and simply stands as the sheet lands.


/* one exhibited screenshot: a dark mat, the WHOLE image letterboxed inside
   (uniform wells keep the grid symmetric), the name always on the frame,
   the longer note sliding up over the image on hover (shown statically on
   touch, where hover doesn't exist) */
function Mat({ fig, half = false }: { fig: WorkFigure; half?: boolean }) {
  return (
    <figure
      data-anim="cs-reveal"
      className={`cs-mat ${!half && fig.span === "full" ? "md:col-span-2" : ""}`}
    >
      <div className="cs-mat-well relative overflow-hidden rounded-btn">
        <Image
          src={fig.src}
          alt={fig.alt}
          fill
          sizes={!half && fig.span === "full" ? "96vw" : "(min-width: 821px) 48vw, 96vw"}
          className="cs-mat-img"
        />
        <span className="cs-mat-cap" aria-hidden>
          {fig.caption}
        </span>
      </div>
      <figcaption className="cs-mat-foot">
        <span className="t-meta text-paper/85">{fig.name}</span>
        <span className="cs-mat-cap-touch t-meta text-paper/50">
          {fig.caption}
        </span>
      </figcaption>
    </figure>
  );
}

export function CaseStudy({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (context, contextSafe) => {
      const q = gsap.utils.selector(root);

      // the nav lives OUTSIDE this scope; on a direct load it's still parked
      // at opacity 0 (the homepage hero normally reveals it)
      const navEl = document.querySelector(".site-nav");

      /* the dock bows out as the article ends: at max scroll it otherwise
         parks on the footer wordmark with no scroll left to clear it */
      const dock = q(".cs-onpage")[0] as HTMLElement | undefined;
      if (dock) {
        const dur = reducedMotion() ? 0 : 0.35;
        ScrollTrigger.create({
          trigger: root.current,
          start: "bottom bottom",
          onEnter: () =>
            gsap.to(dock, { autoAlpha: 0, y: 13, duration: dur, ease: EASE_UI }),
          onLeaveBack: () =>
            gsap.to(dock, { autoAlpha: 1, y: 0, duration: dur, ease: EASE_UI }),
        });
      }

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        return;
      }

      // everything holds behind the arrival gate: on a soft nav the sheet is
      // still riding at mount, and an entrance played under it lands mid-flight
      const enter = contextSafe!(() => {
        if (navEl)
          gsap.to(navEl, { autoAlpha: 1, duration: 0.6, ease: EASE_STRUCTURE });

        // ── entrance: the text settles as the sheet lands ──
        gsap
          .timeline({ defaults: { ease: EASE_STRUCTURE } })
          .fromTo(
            q("[data-anim='cs-title']"),
            { yPercent: 118, y: 0, autoAlpha: 1 },
            { yPercent: 0, y: 0, duration: 0.9 },
          )
          .fromTo(
            q("[data-anim='cs-meta']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.55 },
            "-=0.6",
          )
          .fromTo(
            q("[data-anim='cs-chip']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 },
            "-=0.4",
          )
          .fromTo(
            q("[data-anim='cs-onpage']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE_UI },
            "-=0.3",
          );

        // ── body copy reads itself in on scroll — THE fade-up, per element ──
        const reveals = q("[data-anim='cs-reveal']") as HTMLElement[];
        reveals.forEach((el) => revealUp(el, el));

        ScrollTrigger.refresh();
      }); // end enter()

      /* ── on-page nav: highlight the stop you're inside ── */
      ["cs-story", "cs-build", "cs-results", "cs-next"].forEach((id) => {
        const sec = document.getElementById(id);
        const link = q(`.cs-onpage a[href="#${id}"]`)[0];
        if (!sec || !link) return;
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => link.classList.toggle("is-on", self.isActive),
        });
      });

      /* ── the tours: any captured page glides down its well, holds, eases
         back (the services-02 loop) — the hero AND the phone exhibit's
         screen both ride it. Travel is measured well-vs-image, so a short
         capture simply rests. Runs only in view + tab visible. ── */
      if (!reducedMotion()) {
        const tourLoops: gsap.core.Timeline[] = [];
        const tourVis = new Map<gsap.core.Timeline, boolean>();
        const syncTour = () => {
          tourLoops.forEach((l) =>
            tourVis.get(l) && !document.hidden ? l.play() : l.pause()
          );
        };
        (q("[data-cs-tour]") as HTMLElement[]).forEach((tourEl) => {
          const well = tourEl.closest("[data-well]") as HTMLElement | null;
          if (!well) return;
          const travel = () =>
            -Math.max(0, 1 - well.offsetHeight / tourEl.offsetHeight) * 100;
          const loop = gsap.timeline({ repeat: -1, paused: true, repeatRefresh: true });
          loop
            .to({}, { duration: 1.4 })
            .to(tourEl, { yPercent: travel, duration: 18, ease: "none" })
            .to({}, { duration: 0.9 })
            .to(tourEl, { yPercent: 0, duration: 2.6, ease: EASE_STRUCTURE })
            .to({}, { duration: 1.1 });
          tourLoops.push(loop);
          ScrollTrigger.create({
            trigger: well,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              tourVis.set(loop, self.isActive);
              syncTour();
            },
          });
        });
        if (tourLoops.length) {
          document.addEventListener("visibilitychange", syncTour);
          context.add(() => () =>
            document.removeEventListener("visibilitychange", syncTour)
          );
        }
      }

      /* ── the visit pill: rides the pointer over the hero well (the well is
         a real link to the live site; the pill is its label). Pointer-fine
         only — on touch the well is simply a tappable link. ── */
      const visitWell = q("[data-cs-visit]")[0] as HTMLElement | undefined;
      const visitCur = q("[data-cs-visit-cursor]")[0] as HTMLElement | undefined;
      if (visitWell && visitCur && !reducedMotion()) {
        const pill = visitCur.querySelector(".rc-pill") as HTMLElement;
        const mmv = gsap.matchMedia();
        mmv.add("(hover: hover) and (pointer: fine)", () => {
          const mat = visitCur.parentElement as HTMLElement;
          gsap.set(pill, { scale: 0.6, transformOrigin: "50% 50%" });
          const xTo = gsap.quickTo(visitCur, "x", { duration: 0.35, ease: "power3" });
          const yTo = gsap.quickTo(visitCur, "y", { duration: 0.35, ease: "power3" });
          let primed = false;
          const move = (e: MouseEvent) => {
            const r = mat.getBoundingClientRect();
            if (!primed) {
              // first contact: appear AT the pointer, not glide from 0,0
              gsap.set(visitCur, { x: e.clientX - r.left, y: e.clientY - r.top });
              primed = true;
            }
            xTo(e.clientX - r.left);
            yTo(e.clientY - r.top);
          };
          const show = () =>
            gsap.to(pill, { autoAlpha: 1, scale: 1, duration: 0.35, ease: EASE_UI });
          const hide = () => {
            gsap.to(pill, { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: EASE_UI });
            primed = false;
          };
          visitWell.addEventListener("mousemove", move);
          visitWell.addEventListener("mouseenter", show);
          visitWell.addEventListener("mouseleave", hide);
          return () => {
            visitWell.removeEventListener("mousemove", move);
            visitWell.removeEventListener("mouseenter", show);
            visitWell.removeEventListener("mouseleave", hide);
          };
        });
      }

      /* ── figures: contained parallax inside their wells (desktop only).
         Runs at MOUNT, pre-paint — it's scroll-driven positioning, not an
         entrance, and setting it after arrival visibly zoomed the hero.
         The 1.14 overscan itself is a CSS base state (globals). ── */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 821px)", () => {
        const pars = q(".cs-par") as HTMLElement[];
        const tweens = pars.map((par) =>
          gsap.fromTo(
            par,
            { yPercent: -5.5 },
            {
              yPercent: 5.5,
              ease: "none",
              scrollTrigger: {
                trigger: par.closest("[data-well]"),
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          ),
        );
        return () => {
          tweens.forEach((t) => t.kill());
          // tour-carrying projects render no .cs-par — an empty set() here
          // logs GSAP's target-not-found warning under Strict Mode cleanup
          if (pars.length) gsap.set(pars, { clearProps: "transform" });
        };
      });

      let dead = false;
      whenArrived().then(() => !dead && enter());
      return () => {
        dead = true;
      };
    },
    { scope: root },
  );

  return (
    <article ref={root} data-pcta-hide data-nav="light" className="relative">
      {/* ── head ── */}
      <header className="mx-auto max-w-[1280px] px-[21px] pt-[144px] md:px-[55px] md:pt-[178px]">
        <div
          data-anim="cs-meta"
          className="flex flex-wrap items-baseline justify-between gap-[13px]"
        >
          <p className="t-meta text-ink/60">
            Case study · {project.kind} ·{" "}
            <span className="t-num">{project.year}</span>
          </p>
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="u-link t-meta text-ink/70"
            >
              {project.urlLabel} ↗
            </a>
          ) : (
            <p className="t-meta text-ink/60">{project.status}</p>
          )}
        </div>
        <h1 className="t-display-title mt-[21px] max-w-[14ch]">
          <span className="mask-line">
            <span className="mask-inner" data-anim="cs-title">
              {project.client}
            </span>
          </span>
        </h1>
        <div className="mt-[34px] flex flex-wrap gap-[8px]">
          {project.shipped.map((s) => (
            <span key={s} className="chip" data-anim="cs-chip">
              {s}
            </span>
          ))}
        </div>
      </header>

      {/* ── hero media: the one big moment after the title — the work, in a
          card. With a live URL the whole well IS the door: a pill rides the
          pointer saying so, and the click opens the real site. ── */}
      <div className="cs-mat relative mx-[8px] mt-[55px] md:mx-[13px] md:mt-[89px]">
        {(() => {
          const media = project.tour ? (
            /* the page itself, riding: the self-scrolling tour loop */
            <Image
              data-cs-tour
              src={project.tour.src}
              alt={project.tour.alt}
              width={project.tour.width}
              height={project.tour.height}
              sizes="96vw"
              className="block h-auto w-full"
              priority
              fetchPriority="high"
            />
          ) : (
            <div className="cs-par absolute inset-0">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                fill
                sizes="(min-width: 1280px) 1170px, 92vw"
                className="cs-img"
                priority
              />
            </div>
          );
          return project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-hero-well cs-hero-well--live block"
              data-well
              data-cs-visit
              aria-label={`Visit the live site, ${project.urlLabel}`}
            >
              {media}
            </a>
          ) : (
            <div className="cs-hero-well" data-well>
              {media}
            </div>
          );
        })()}
        {project.url && (
          <span className="reel-cursor" data-cs-visit-cursor aria-hidden>
            <span className="rc-center">
              <span className="rc-pill">
                Visit the live site
                <svg viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </span>
        )}
      </div>

      {/* ── the story: ONE big moment in a card, then a short read
          (the awwwards rhythm: statement card → description → images →
          more talk → the rest of the work) ── */}
      <section id="cs-story" className="mx-auto max-w-[1280px] px-[21px] py-[89px] md:px-[55px] md:py-[144px]">
        <p className="t-statement max-w-[30ch]" data-anim="cs-reveal">
          {project.lede}
        </p>
        <p
          data-anim="cs-reveal"
          className="mt-[55px] max-w-[62ch] text-[1.125rem] leading-[1.6] text-ink/80 md:mt-[89px]"
        >
          {project.paras[0]}
        </p>
      </section>

      {/* ── first look: a couple of images ── */}
      <section id="cs-build" className="pb-[89px] md:pb-[144px]">
        <div className="mx-[8px] grid grid-cols-1 gap-[8px] md:mx-[13px] md:grid-cols-2 md:gap-[13px]">
          {project.gallery.slice(0, 2).map((fig) => (
            <Mat key={fig.src} fig={fig} half />
          ))}
        </div>

        {/* ── then THE BIG BOX: ONE phone, done properly (most visitors
            arrive on one) — a solid-color stage, a single premium device,
            the real site riding the screen on the tour loop ── */}
        <div className="mx-[8px] mt-[8px] grid grid-cols-1 gap-[8px] md:mx-[13px] md:mt-[13px] md:grid-cols-2 md:gap-[13px]">
          {project.phoneTour && (
            <figure data-anim="cs-reveal" className="cs-mat md:col-span-2">
              <div className="cs-mat-well cs-mat-well--phone relative overflow-hidden rounded-btn">
                <div className="cs-phone-stage">
                  <div className="dvc">
                    <span className="dvc-island" aria-hidden />
                    <div className="dvc-screen" data-well>
                      <Image
                        data-cs-tour
                        src={project.phoneTour.src}
                        alt={project.phoneTour.alt}
                        width={project.phoneTour.width}
                        height={project.phoneTour.height}
                        sizes="(min-width: 821px) 340px, 64vw"
                        className="block h-auto w-full"
                      />
                    </div>
                  </div>
                </div>
                <span className="cs-mat-cap" aria-hidden>
                  Most visitors arrive on a phone, so the phone view is
                  designed first-class
                </span>
              </div>
              <figcaption className="cs-mat-foot">
                <span className="t-meta text-paper/85">On the phone</span>
                <span className="cs-mat-cap-touch t-meta text-paper/50">
                  Designed phone-first
                </span>
              </figcaption>
            </figure>
          )}
        </div>

        {/* ── the closing read ── */}
        <div className="mx-auto mt-[89px] max-w-[1280px] px-[21px] md:mt-[144px] md:px-[55px]">
          <div className="grid gap-[34px] md:grid-cols-2 md:gap-[55px]">
            {project.paras.slice(1).map((para) => (
              <p
                key={para.slice(0, 24)}
                data-anim="cs-reveal"
                className="max-w-[52ch] text-[1.125rem] leading-[1.6] text-ink/80"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── the numbers: the index card's claim, substantiated where the
          decision happens (a teased stat that never reappears reads as
          invented — the persona audit's #1 trust break) ── */}
      {project.results && (
        <section id="cs-results" className="pb-[89px] md:pb-[144px]">
          <div className="dark-chapter mx-[8px] rounded-panel py-fib-6 md:mx-[13px]">
            <div className="mx-auto max-w-[1280px] px-[21px] md:px-[55px]">
              <div
                data-anim="cs-reveal"
                className="flex flex-col justify-between gap-[13px] md:flex-row md:items-end"
              >
                <h2 className="t-display-lg max-w-[12ch]">The numbers</h2>
                <p className="max-w-[38ch] text-paper/70 md:text-right">
                  Tracked in the client&apos;s own Ads and analytics accounts —
                  not our slides.
                </p>
              </div>
              <div className="mt-fib-5 grid gap-fib-4 sm:grid-cols-3">
                {project.results.metrics.map((m) => (
                  <div key={m.label} data-anim="cs-reveal">
                    <p className="t-display-lg t-num">{m.value}</p>
                    <p className="mt-fib-1 max-w-[24ch] text-paper/70">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
              {project.results.quote && (
                <figure data-anim="cs-reveal" className="mt-fib-5 border-t border-paper/15 pt-fib-4">
                  <blockquote>
                    <p className="t-title--lg max-w-[38ch] font-display">
                      &ldquo;{project.results.quote.text}&rdquo;
                    </p>
                  </blockquote>
                  <figcaption className="t-meta mt-fib-2 text-paper/55">
                    {project.results.quote.name}
                  </figcaption>
                </figure>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── next case + the ask ── */}
      <section id="cs-next" className="mx-auto max-w-[1280px] px-[21px] pb-[144px] md:px-[55px] md:pb-[178px]">
        <p className="t-meta text-ink/55" data-anim="cs-reveal">
          Next case
        </p>
        {/* solid ink, ladder tier — the hollow outline read as EMPTY here
            (Jake, 2026-07-15); the ledger's outline→fill grammar stays on
            /work where "unvisited" is the point */}
        <Link
          href={`/work/${next.slug}`}
          className="cs-next group mt-[13px] inline-flex items-center gap-[21px]"
          data-anim="cs-reveal"
        >
          <span className="t-display-lg">{next.listName}</span>
          <svg
            className="cs-next-arrow"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M3 12h17M13.5 4.5 21 12l-7.5 7.5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
        <div
          className="mt-[55px] flex flex-wrap items-center gap-[21px]"
          data-anim="cs-reveal"
        >
          <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
          <Link href="/work" className="u-link u-link--chev t-meta text-ink/70">
            Back to all work
          </Link>
        </div>
      </section>

      {/* ── the dock (the awwwards case-page pattern, our grammar): the
          mark, the case's stops, and the one highlighted action — fixed
          bottom-center; anchors ride Lenis ── */}
      <nav className="cs-onpage nav-capsule" aria-label="On this case" data-anim="cs-onpage">
        <span className="cs-dock-mark" aria-hidden>
          <Monogram className="h-[15px] w-[15px]" />
        </span>
        <a href="#cs-story">Story</a>
        <a href="#cs-build">Build</a>
        {project.results && <a href="#cs-results">Results</a>}
        <a href="#cs-next">Next</a>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-dock-visit"
            data-no-vt
          >
            Visit site
            <span className="dv-arrow" aria-hidden>
              <svg viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 9.5 9.5 2.5M4 2.5h5.5V8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>
        )}
      </nav>
    </article>
  );
}
