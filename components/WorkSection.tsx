"use client";

// Work — the conversion engine. Dark dock over the hero, staggered editorial
// grid, per-card image parallax, entrances that replay on every visit.

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

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks — replay on every entry.
        gsap.fromTo(
          ".hero-line",
          { y: "115%" },
          {
            y: 0,
            duration: 1.05,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 62%",
              toggleActions: "restart none none reset",
            },
          },
        );

        // Cards rise in as they reach the viewport; reset when scrolled back above.
        gsap.utils.toArray<HTMLElement>("[data-work-card]").forEach((card) => {
          gsap.fromTo(
            card,
            { y: 90, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "restart none none reset",
              },
            },
          );

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
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative z-20 -mt-8 rounded-t-[40px] bg-ink-deep text-paper px-5 md:px-10 pt-24 md:pt-32 pb-24 lg:pb-32 shadow-[0_-32px_80px_rgba(14,13,12,0.4)]"
    >
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="micro text-paper/40">Selected work — 2024 to now</p>
          <h2 className="mt-5 font-extrabold uppercase tracking-[-0.04em] leading-[0.94] text-[clamp(2.6rem,7.5vw,6.5rem)]">
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
        </div>
        <p className="max-w-xs text-[15px] leading-relaxed text-paper/50 pb-2">
          Every build has one job: turn visitors into booked work. Here&rsquo;s
          what that looks like.
        </p>
      </div>

      {/* Staggered grid */}
      <div className="mt-16 md:mt-24 grid lg:grid-cols-2 gap-x-6 gap-y-16 lg:gap-y-28">
        {WORKS.map((work, i) => (
          <article
            key={work.title}
            data-work-card
            className={`group ${i % 2 === 1 ? "lg:relative lg:top-24" : ""}`}
          >
            <div className="relative aspect-4/3 rounded-[28px] overflow-hidden border border-paper/10 bg-ink">
              <div data-card-img className="absolute -inset-y-[8%] inset-x-0">
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
                  style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
                />
              </div>
              <span
                className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-paper text-ink opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0"
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
            <div className="mt-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                  {work.title}
                </h3>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-paper/50">
                  {work.outcome}
                </p>
              </div>
              <p className="micro text-paper/40 pt-2.5 whitespace-nowrap">
                {work.category}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Conversion nudge */}
      <div className="mt-20 lg:mt-28 pt-10 border-t border-paper/10 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="micro text-paper/40">Next opening — July</p>
          <p className="mt-2 text-lg font-semibold tracking-tight">
            Your project could be here.
          </p>
        </div>
        <PillCTA label="Start a project" href="#contact" invert />
      </div>
    </section>
  );
}
