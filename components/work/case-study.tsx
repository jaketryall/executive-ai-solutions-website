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

        // ── body copy reads itself in on scroll ──
        const reveals = q("[data-anim='cs-reveal']") as HTMLElement[];
        reveals.forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 26 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: EASE_STRUCTURE,
              scrollTrigger: { trigger: el, start: "top 85%" },
            },
          );
        });

        ScrollTrigger.refresh();
      }); // end enter()

      /* ── on-page nav: highlight the stop you're inside ── */
      (["cs-story", "cs-build", "cs-next"] as const).forEach((id) => {
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

      /* ── the hero tour: the captured page glides down, holds, eases back
         (the services-02 loop) — runs only in view + tab visible ── */
      const tourEl = q("[data-cs-tour]")[0] as HTMLElement | undefined;
      if (tourEl && !reducedMotion()) {
        const well = tourEl.closest(".cs-hero-well") as HTMLElement;
        const travel = () =>
          -Math.max(0, 1 - well.offsetHeight / tourEl.offsetHeight) * 100;
        const loop = gsap.timeline({ repeat: -1, paused: true, repeatRefresh: true });
        loop
          .to({}, { duration: 1.4 })
          .to(tourEl, { yPercent: travel, duration: 18, ease: "none" })
          .to({}, { duration: 0.9 })
          .to(tourEl, { yPercent: 0, duration: 2.6, ease: EASE_STRUCTURE })
          .to({}, { duration: 1.1 });
        let tourInView = false;
        const syncTour = () => {
          tourInView && !document.hidden ? loop.play() : loop.pause();
        };
        ScrollTrigger.create({
          trigger: well,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            tourInView = self.isActive;
            syncTour();
          },
        });
        document.addEventListener("visibilitychange", syncTour);
        context.add(() => () =>
          document.removeEventListener("visibilitychange", syncTour)
        );
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
          gsap.set(pars, { clearProps: "transform" });
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

      {/* ── hero media: the morph target ── */}
      {/* the one big moment after the title: the work, in a card */}
      <div className="cs-mat mx-[8px] mt-[55px] md:mx-[13px] md:mt-[89px]">
        <div
          className="cs-hero-well"
          data-well
        >
          {project.tour ? (
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
          )}
        </div>
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

        {/* ── then THE BIG BOX: the phones (most visitors arrive on one) ── */}
        <div className="mx-[8px] mt-[8px] grid grid-cols-1 gap-[8px] md:mx-[13px] md:mt-[13px] md:grid-cols-2 md:gap-[13px]">
          {project.phones && (
            <figure data-anim="cs-reveal" className="cs-mat md:col-span-2">
              <div className="cs-mat-well relative overflow-hidden rounded-btn">
                <div className="cs-phones-stage" aria-hidden={false}>
                  {project.phones.map((ph, i) => (
                    <div key={ph.src} className={`cs-device cs-phone--${i}`}>
                      <div className="cs-device-screen">
                        <Image
                          src={ph.src}
                          alt={ph.alt}
                          fill
                          sizes="(min-width: 821px) 320px, 44vw"
                        />
                      </div>
                    </div>
                  ))}
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

      {/* ── next case + the ask ── */}
      <section id="cs-next" className="mx-auto max-w-[1280px] px-[21px] pb-[144px] md:px-[55px] md:pb-[178px]">
        <p className="t-meta text-ink/55" data-anim="cs-reveal">
          Next case
        </p>
        <Link
          href={`/work/${next.slug}`}
          className="cs-next mt-[13px] inline-block"
          data-anim="cs-reveal"
        >
          <span className="wx-name">
            <span className="wx-outline">{next.listName}</span>
            <span className="wx-fill" aria-hidden>
              {next.listName}
            </span>
          </span>
        </Link>
        <div
          className="mt-[55px] flex flex-wrap items-center gap-[21px]"
          data-anim="cs-reveal"
        >
          <CTA href="/#estimate" label="Price a build like this" tone="ink" />
          <Link href="/work" className="u-link t-meta text-ink/70">
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
          </a>
        )}
      </nav>
    </article>
  );
}
