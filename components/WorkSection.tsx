"use client";

// Work — the conversion engine. Dark dock over the paper, header pins left
// while two card columns scroll at different speeds.

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillCTA from "./PillCTA";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// TODO(owner): confirm client names + outcome lines.
const WORKS = [
  {
    title: "Riled Up Pickleball",
    outcome: "Coaching platform that books itself — sessions, schedule, client CRM.",
    category: "Web app · Bookings",
    image: "/custom-dashboard-mockup.webp",
  },
  {
    title: "Desert Wings",
    outcome: "A flight school site that turns curiosity into discovery flights.",
    category: "Flight school · Web design",
    image: "/Celestial Laptop Mockup.webp",
  },
  {
    title: "Wings N Wheels",
    outcome: "Premium detailing brand with a quote pipeline that fills itself.",
    category: "Local service · Web design",
    image: "/Rubber iPhone Mockup.webp",
  },
  {
    title: "AZ Gyro Tours",
    outcome: "Tourism site selling the thrill before the booking.",
    category: "Tourism · Web design",
    image: "/Elegant Black Laptop Mockup.webp",
  },
];

const HEADLINE = ["Proof,", "not promises"];

function WorkCard({
  work,
  lag,
}: {
  work: (typeof WORKS)[number];
  lag?: string;
}) {
  return (
    <article data-work-card className="group">
      <div data-lag={lag}>
      <div className="relative aspect-4/3 rounded-[28px] overflow-hidden border border-(--line) bg-ink">
        <div data-card-img className="absolute -inset-y-[8%] inset-x-0">
          <Image
            src={work.image}
            alt={work.title}
            fill
            sizes="(min-width: 1024px) 31vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
            style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
          />
        </div>
        <span
          className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-(--fg) text-(--bg) opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
          style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
          aria-hidden
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </div>
      <CardMeta title={work.title} outcome={work.outcome} category={work.category} />
      </div>
    </article>
  );
}

function CardMeta({
  title,
  outcome,
  category,
}: {
  title: string;
  outcome: string;
  category: string;
}) {
  return (
    <div className="mt-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h3>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-(--fg-muted)">
          {outcome}
        </p>
      </div>
      <p className="micro text-(--fg-faint) pt-2.5 whitespace-nowrap">{category}</p>
    </div>
  );
}

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The dock surface grows into place as the section arrives.
        gsap.fromTo(
          "[data-work-bg]",
          { scale: 0.92, y: 60, transformOrigin: "50% 0%" },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 98%",
              end: "top 45%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );

        // Replay-on-entry pattern with a LATE reset: the entrance replays
        // each time you scroll down to it, but the hidden state is only
        // restored once the element is fully below the viewport — never
        // while it's still visible (no pop-out when scrolling back up).
        const replayEntrance = (
          targets: gsap.TweenTarget,
          trigger: HTMLElement,
          vars: { from: gsap.TweenVars; to: gsap.TweenVars; start: string },
        ) => {
          const tween = gsap.fromTo(targets, vars.from, {
            ...vars.to,
            paused: true,
          });
          ScrollTrigger.create({
            trigger,
            start: vars.start,
            onEnter: () => tween.restart(),
            // If the page loads/refreshes already past the start, show it.
            onRefresh: (self) => {
              if (self.progress > 0) tween.progress(1);
            },
          });
          ScrollTrigger.create({
            trigger,
            start: "top bottom",
            onLeaveBack: () => tween.pause(0),
          });
        };

        // Headline lines rise out of their masks.
        replayEntrance(".hero-line", sectionRef.current!, {
          from: { y: "115%" },
          to: { y: 0, duration: 1.05, stagger: 0.1, ease: "expo.out" },
          start: "top 62%",
        });

        // Cards rise in as they reach the viewport.
        gsap.utils.toArray<HTMLElement>("[data-work-card]").forEach((card) => {
          replayEntrance(card, card, {
            from: { y: 90, opacity: 0 },
            to: { y: 0, opacity: 1, duration: 1, ease: "expo.out" },
            start: "top 85%",
          });

          // Continuous image parallax inside the frame while the card is on screen.
          const img = card.querySelector("[data-card-img]");
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: 5 },
              {
                yPercent: -5,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
        });
      });

      // Dual-speed columns — the left column drifts up faster than the page;
      // the right column is the anchored spine.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            "[data-col-drift]",
            { y: 60 },
            {
              y: -160,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-work-grid]",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );

          // Pin the header while the card columns scroll past (CSS sticky
          // can't engage inside ScrollSmoother's transformed content).
          const headerEl = sectionRef.current!.querySelector<HTMLElement>(
            "[data-work-header]",
          );
          const grid = sectionRef.current!.querySelector<HTMLElement>(
            "[data-work-grid]",
          );
          if (headerEl && grid) {
            ScrollTrigger.create({
              trigger: grid,
              start: "top 112",
              end: () => `bottom ${112 + headerEl.offsetHeight}`,
              pin: headerEl,
              pinSpacing: false,
              invalidateOnRefresh: true,
            });
          }
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="zone-dark relative z-20 -mt-8 px-5 md:px-10 pt-28 md:pt-36 pb-28 text-(--fg)"
    >
      {/* The dock surface — its own layer so the grow-in entrance can scale
          it without transforming the pinned header inside the content. */}
      <div
        data-work-bg
        aria-hidden
        className="absolute inset-0 rounded-t-[40px] bg-ink-deep shadow-[0_-32px_80px_rgba(14,13,12,0.4)]"
      />

      <div className="relative lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Pinned header — sticks while the work scrolls past */}
        <header className="lg:col-span-4">
          {/* lg:sticky is the no-JS/reduced-motion fallback; under
              ScrollSmoother (transformed ancestor) sticky is inert and the
              ScrollTrigger pin below takes over. */}
          <div data-work-header className="lg:sticky lg:top-28 flex flex-col items-start">
            <p className="micro text-(--fg-faint)">Selected work — 2024 to now</p>
            <h2 className="mt-5 font-extrabold uppercase tracking-[-0.04em] leading-[0.94] text-[clamp(2.4rem,5.5vw,3.8rem)]">
              {HEADLINE.map((line, i) => (
                <span key={line} className="block">
                  <span className="hero-line-mask">
                    <span className="hero-line">
                      {line}
                      {i === HEADLINE.length - 1 && (
                        <span className="text-oxblood">.</span>
                      )}
                    </span>
                  </span>
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-(--fg-muted)">
              Every build has one job: turn visitors into booked work.
              Here&rsquo;s what that looks like.
            </p>
            <div className="mt-8 flex items-center gap-4">
              {/* TODO(owner): point at /work once the index page exists */}
              <PillCTA label="All work" href="#work" />
              <span className="micro text-(--fg-faint) tabular-nums">
                {String(WORKS.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </header>

        {/* Dual-speed card columns */}
        <div data-work-grid className="mt-16 lg:mt-0 lg:col-span-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Right column — the anchored spine */}
            <div className="space-y-14 lg:order-2">
              <WorkCard work={WORKS[1]} lag="0.06" />
              <WorkCard work={WORKS[3]} lag="0.1" />
            </div>

            {/* Left column (drifts faster on scroll) */}
            <div data-col-drift className="space-y-14 lg:order-1 lg:pt-36">
              <WorkCard work={WORKS[0]} lag="0.14" />
              <WorkCard work={WORKS[2]} lag="0.18" />
            </div>
          </div>
        </div>
      </div>

      {/* Conversion nudge */}
      <div className="relative mt-24 lg:mt-32 pt-10 border-t border-(--line) flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="micro text-(--fg-faint)">Next opening — July</p>
          <p className="mt-2 text-lg font-semibold tracking-tight">
            Your project could be here.
          </p>
        </div>
        <PillCTA label="Start a project" href="#contact" />
      </div>
    </section>
  );
}
