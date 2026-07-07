"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/work";
import { vtName } from "@/lib/work";
import { CTA } from "@/components/ui/cta";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";
import { whenArrived } from "@/components/anim/arrival";

// One case study. The hero well carries the same view-transition-name as its
// index card, so arriving here the card MORPHS into this hero while the page
// sheets up underneath it — which is why the hero itself gets no entrance
// tween (the morph is its entrance; a direct load just shows it standing).

export function CaseStudy({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (_, contextSafe) => {
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

        // ── figures: contained parallax inside their wells (desktop only) ──
        const mm = gsap.matchMedia();
        mm.add("(min-width: 821px)", () => {
          const pars = q(".cs-par") as HTMLElement[];
          gsap.set(pars, { scale: 1.14, transformOrigin: "50% 50%" });
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

        ScrollTrigger.refresh();
      }); // end enter()

      let dead = false;
      whenArrived().then(() => !dead && enter());
      return () => {
        dead = true;
      };
    },
    { scope: root },
  );

  return (
    <article ref={root} data-nav="light" className="relative">
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
        <h1 className="t-display-xl mt-[21px] max-w-[14ch]">
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
      <div className="mx-auto mt-[55px] max-w-[1280px] px-[21px] md:mt-[89px] md:px-[55px]">
        <div
          className="cs-hero-well"
          data-well
          data-vt-media
          style={{ viewTransitionName: vtName(project.slug) }}
        >
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
        </div>
      </div>

      {/* ── the story ── */}
      <section className="mx-auto max-w-[1280px] px-[21px] py-[89px] md:px-[55px] md:py-[144px]">
        <div className="grid gap-[55px] md:grid-cols-[38fr_62fr] md:gap-[89px]">
          <div>
            <p className="t-title max-w-[26ch]" data-anim="cs-reveal">
              {project.lede}
            </p>
          </div>
          <div className="flex flex-col gap-[26px]">
            {project.paras.map((para) => (
              <p
                key={para.slice(0, 24)}
                data-anim="cs-reveal"
                className="max-w-[62ch] text-[1.125rem] leading-[1.6] text-ink/80"
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ── the build, up close ── */}
      <section className="mx-auto max-w-[1280px] px-[21px] pb-[89px] md:px-[55px] md:pb-[144px]">
        <div className="grid grid-cols-1 gap-[21px] md:grid-cols-2">
          {project.gallery.map((fig) => (
            <figure
              key={fig.src}
              data-anim="cs-reveal"
              className={fig.span === "full" ? "md:col-span-2" : ""}
            >
              <div
                className={`cs-fig-well ${fig.span === "full" ? "cs-fig-well--wide" : ""}`}
                data-well
              >
                <div className="cs-par absolute inset-0">
                  <Image
                    src={fig.src}
                    alt={fig.alt}
                    fill
                    sizes={
                      fig.span === "full"
                        ? "(min-width: 1280px) 1170px, 92vw"
                        : "(min-width: 821px) 48vw, 92vw"
                    }
                    className="cs-img"
                  />
                </div>
              </div>
              <figcaption className="t-meta mt-[13px] text-ink/55">
                {fig.caption}
              </figcaption>
            </figure>
          ))}

          {project.phones && (
            <figure data-anim="cs-reveal" className="md:col-span-2">
              <div className="cs-phones">
                {project.phones.map((ph, i) => (
                  <div
                    key={ph.src}
                    className={`phone-card cs-phone cs-phone--${i}`}
                  >
                    <Image
                      src={ph.src}
                      alt={ph.alt}
                      width={ph.width}
                      height={ph.height}
                      sizes="(min-width: 821px) 300px, 44vw"
                    />
                  </div>
                ))}
              </div>
              <figcaption className="t-meta mt-[13px] text-ink/55">
                Most visitors arrive on a phone, so the phone view is designed
                first-class
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {/* ── next case + the ask ── */}
      <section className="mx-auto max-w-[1280px] px-[21px] pb-[144px] md:px-[55px] md:pb-[178px]">
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
    </article>
  );
}
