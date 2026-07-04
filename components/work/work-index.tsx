"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS, vtName } from "@/lib/work";
import { Monogram } from "@/components/ui/monogram";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";

// The work index as a FILM: no header, no cards — you land inside a
// full-screen chapter per project (full-bleed cover, graded dark, the name
// huge in the lower-left) and each scroll pulls the next chapter up OVER the
// current one, which sinks back and dims. It's the route transition's stack
// gesture at viewport scale, so scrolling the index and opening a case read
// as one physical space. Chapter media carries the view-transition-name and
// morphs down into the case-study hero on click.
//
// Below 821px (or reduced motion / no JS) nothing pins: the chapters stack
// in normal flow, each still full-bleed — the film survives, uncut.

const OPEN_SLOT = {
  listName: "Your business",
  kind: "The next build",
  year: "2026",
  href: "/#estimate",
};

const SLOTS = PROJECTS.length + 1;

export function WorkIndex() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const rail = q(".wf-rail button") as HTMLElement[];
      const count = q(".wf-count")[0];

      const setActive = (idx: number) => {
        rail.forEach((el, i) => el.setAttribute("data-active", String(i === idx)));
        if (count) count.textContent = `0${idx + 1} / 0${SLOTS}`;
      };

      // the nav lives OUTSIDE this scope; on a direct load it's still parked
      // at opacity 0 (the homepage hero normally reveals it)
      const navEl = document.querySelector(".site-nav");

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        return;
      }
      if (navEl) gsap.to(navEl, { autoAlpha: 1, duration: 0.6, ease: EASE_STRUCTURE });

      // ── the establishing shot: chapter 1 settles, chrome fades up ──
      const allChapters = q(".wf-chapter") as HTMLElement[];
      gsap
        .timeline({ defaults: { ease: EASE_STRUCTURE } })
        .fromTo(
          allChapters[0].querySelector(".wf-img"),
          { scale: 1.08 },
          { scale: 1, duration: 1.4 }
        )
        .fromTo(
          allChapters[0].querySelectorAll(".mask-inner"),
          { yPercent: 118, y: 0 },
          { yPercent: 0, y: 0, duration: 0.9, stagger: 0.09 },
          0.15
        )
        .fromTo(
          q("[data-anim='wf-chrome']"),
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_UI },
          0.6
        );

      // later chapters' names: mask-rise as their chapter approaches on
      // mobile flow; instant-visible in film mode (their motion is the rise)
      const laterMasks = allChapters
        .slice(1)
        .flatMap((c) => Array.from(c.querySelectorAll(".mask-inner")));
      const mmNames = gsap.matchMedia();
      mmNames.add("(max-width: 820px)", () => {
        const tweens = laterMasks.map((m) =>
          gsap.fromTo(
            m,
            { yPercent: 118, y: 0 },
            {
              yPercent: 0,
              y: 0,
              duration: 0.9,
              ease: EASE_STRUCTURE,
              scrollTrigger: { trigger: m.closest(".wf-chapter"), start: "top 70%" },
            }
          )
        );
        return () => tweens.forEach((t) => t.kill());
      });
      mmNames.add("(min-width: 821px)", () => {
        gsap.set(laterMasks, { yPercent: 0, y: 0 });
      });

      // ── the projector: sheets rise, the covered chapter sinks ──
      const mm = gsap.matchMedia();
      mm.add("(min-width: 821px)", () => {
        const run = q(".wf-run")[0] as HTMLElement;
        const chapters = q(".wf-chapter") as HTMLElement[];
        const medias = chapters.map((c) => c.querySelector(".wf-media"));
        const contents = chapters.map((c) => c.querySelector(".wf-content"));
        const shades = q(".wf-shade") as HTMLElement[];
        const N = chapters.length;

        run.classList.add("is-film");
        gsap.set(chapters.slice(1), { yPercent: 100 });
        setActive(0);

        const clamp01 = gsap.utils.clamp(0, 1);
        const st = ScrollTrigger.create({
          trigger: run,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / (N - 1),
            duration: { min: 0.25, max: 0.6 },
            ease: EASE_UI,
            delay: 0.08,
            directional: false,
          },
          onUpdate(self) {
            const f = self.progress * (N - 1);
            for (let i = 0; i < N; i++) {
              const tIn = i === 0 ? 1 : clamp01(f - (i - 1)); // risen this far
              const tOut = i === N - 1 ? 0 : clamp01(f - i); // buried this far
              gsap.set(chapters[i], {
                yPercent: 100 * (1 - tIn) - 7 * tOut,
                scale: 1 - 0.04 * tOut,
              });
              // the sheet's inner layers lag it — the media (overscanned 30%
              // below via CSS) reveals against the rise, the title settles
              // last: depth inside the moving chapter
              gsap.set(medias[i], { y: -window.innerHeight * 0.3 * (1 - tIn) });
              gsap.set(contents[i], { yPercent: 26 * (1 - tIn) - 12 * tOut });
              if (shades[i]) shades[i].style.opacity = (0.55 * tOut).toFixed(3);
            }
            setActive(Math.round(f));
          },
        });

        // the rail is functional: a number takes you to its chapter
        const jump = (i: number) => {
          const runTop = run.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({
            top: runTop + ((run.offsetHeight - window.innerHeight) * i) / (N - 1),
            behavior: "smooth",
          });
        };
        const handlers = rail.map((btn, i) => {
          const h = () => jump(i);
          btn.addEventListener("click", h);
          return h;
        });

        ScrollTrigger.refresh();
        return () => {
          st.kill();
          run.classList.remove("is-film");
          rail.forEach((btn, i) => btn.removeEventListener("click", handlers[i]));
          gsap.set(chapters, { clearProps: "transform" });
          medias.forEach((m) => m && gsap.set(m, { clearProps: "transform" }));
          contents.forEach((c) => c && gsap.set(c, { clearProps: "transform" }));
          shades.forEach((s) => (s.style.opacity = ""));
          setActive(0);
        };
      });

      // ── the cursor pill: "Open the case" rides the pointer (reel grammar) ──
      mm.add("(min-width: 821px) and (hover: hover) and (pointer: fine)", () => {
        const cursor = q(".wf-cursor")[0] as HTMLElement;
        const pill = cursor?.querySelector(".rc-pill");
        const stage = q(".wf-stage")[0] as HTMLElement;
        if (!cursor || !pill || !stage) return;

        const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: EASE_UI });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: EASE_UI });
        let shown = false;
        const move = (e: MouseEvent) => {
          const r = stage.getBoundingClientRect();
          xTo(e.clientX - r.left);
          yTo(e.clientY - r.top);
          // only over a project chapter — the open slot has its own pill
          const over = (e.target as HTMLElement).closest?.("a.wf-chapter[data-case]");
          if (!!over !== shown) {
            shown = !!over;
            gsap.to(pill, {
              scale: shown ? 1 : 0.5,
              autoAlpha: shown ? 1 : 0,
              duration: 0.35,
              ease: EASE_UI,
            });
          }
        };
        const leave = () => {
          shown = false;
          gsap.to(pill, { scale: 0.5, autoAlpha: 0, duration: 0.3, ease: EASE_UI });
        };
        gsap.set(pill, { scale: 0.5, autoAlpha: 0 });
        stage.addEventListener("mousemove", move);
        stage.addEventListener("mouseleave", leave);
        return () => {
          stage.removeEventListener("mousemove", move);
          stage.removeEventListener("mouseleave", leave);
        };
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} data-nav="dark" className="wf" aria-label="The work">
      <h1 className="sr-only">The work</h1>

      <div className="wf-run" style={{ ["--wf-steps" as string]: SLOTS - 1 }}>
        <div className="wf-stage">
          {PROJECTS.map((p, i) => {
            const bg = p.backdrop ?? p.cover;
            return (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="wf-chapter"
                data-case
                aria-label={`${p.client}: open the case study`}
                style={{ viewTransitionName: vtName(p.slug) }}
              >
                <span className="wf-media">
                  {/* the crop zoom lives on its own wrapper — GSAP tweens the
                      img and normalizes (wipes) any scale set there */}
                  <span
                    className="wf-zoom"
                    style={
                      p.backdropCrop
                        ? {
                            transform: `scale(${p.backdropCrop.zoom})`,
                            transformOrigin: p.backdropCrop.origin,
                          }
                        : undefined
                    }
                  >
                    <Image
                      src={bg.src}
                      alt={bg.alt}
                      fill
                      sizes="100vw"
                      className="wf-img"
                      priority={i === 0}
                      style={
                        p.backdropCrop
                          ? { objectPosition: p.backdropCrop.origin }
                          : undefined
                      }
                    />
                  </span>
                  <span className="wf-scrim" aria-hidden />
                </span>
                <span className="wf-content">
                  <span className="wf-meta t-meta">
                    <span className="t-num">0{i + 1}</span>
                    <span aria-hidden>·</span>
                    <span>{p.kind}</span>
                    <span aria-hidden>·</span>
                    <span className="t-num">{p.year}</span>
                    <span aria-hidden>·</span>
                    <span>{p.status}</span>
                  </span>
                  <span className="wf-name t-display-hero">
                    <span className="mask-line">
                      <span className="mask-inner">{p.listName}</span>
                    </span>
                  </span>
                  <span className="wf-open t-meta" aria-hidden>
                    Open the case
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M3 13 13 3M5.5 3H13v7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
                <span className="wf-shade" aria-hidden />
              </Link>
            );
          })}

          {/* the final reel: the ask, full screen */}
          <Link
            href={OPEN_SLOT.href}
            className="wf-chapter wf-chapter--open"
            aria-label="Your business could be next: price your project with the instant estimator"
          >
            <span className="wf-media closer-card" aria-hidden />
            <span className="wf-content wf-content--open">
              <Monogram className="h-[34px] w-[34px] opacity-80" />
              <span className="wf-meta t-meta">
                <span className="t-num">0{SLOTS}</span>
                <span aria-hidden>·</span>
                <span>{OPEN_SLOT.kind}</span>
              </span>
              <span className="wf-name t-display-hero">
                <span className="mask-line">
                  <span className="mask-inner">This spot is open</span>
                </span>
              </span>
              <span className="wf-open-sub">
                Price your project in about sixty seconds and see what your
                business looks like on this screen.
              </span>
              <span className="wx-open-pill" aria-hidden>
                Get an estimate
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 13 13 3M5.5 3H13v7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
            <span className="wf-shade" aria-hidden />
          </Link>

          {/* chrome — label, counter, rail (desktop film mode) */}
          <p className="wf-label t-meta" data-anim="wf-chrome">
            The work
          </p>
          <p className="wf-count t-meta t-num" data-anim="wf-chrome" aria-hidden>
            01 / 0{SLOTS}
          </p>
          <nav className="wf-rail" data-anim="wf-chrome" aria-label="Jump to project">
            {[...PROJECTS.map((p) => p.listName), OPEN_SLOT.listName].map((name, i) => (
              <button key={name} type="button" data-active={i === 0 ? "true" : "false"} aria-label={`Go to ${name}`}>
                0{i + 1}
              </button>
            ))}
          </nav>

          {/* the pointer pill (reel-cursor grammar) */}
          <div className="reel-cursor wf-cursor" aria-hidden>
            <span className="rc-center">
              <span className="rc-pill">
                Open the case
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 13 13 3M5.5 3H13v7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
