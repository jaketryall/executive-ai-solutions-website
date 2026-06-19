"use client";

// Work — the conversion engine. The bordered frame fills the screen and
// establishes FIRST (a subtle scroll-tied grow), then the content drops into it
// in a timed stagger. Frame and content are separate layers but sequenced so
// they never fight: the content stays hidden until the frame has settled.

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillCTA from "./PillCTA";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// TODO(owner): confirm client names + outcome lines, and swap these stand-in
// device mockups for real per-project screenshots of each client site.
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
    image: "/Elegant Black Laptop Mockup.webp",
  },
  {
    title: "Wings N Wheels",
    outcome: "Premium detailing brand with a quote pipeline that fills itself.",
    category: "Local service · Web design",
    image: "/Celestial Laptop Mockup.webp",
  },
  {
    title: "AZ Gyro Tours",
    outcome: "Tourism site selling the thrill before the booking.",
    category: "Tourism · Web design",
    image: "/Rubber iPhone Mockup.webp",
  },
];

const HEADLINE = ["Proof,", "not promises"];

function WorkCard({ work }: { work: (typeof WORKS)[number] }) {
  return (
    <article data-work-reveal className="group">
      <div className="relative aspect-4/3 overflow-hidden rounded-[28px] border border-(--line) bg-ink">
        <Image
          src={work.image}
          alt={work.title}
          fill
          sizes="(max-width: 1024px) 90vw, 40vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.045]"
          style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
        />
        <span
          className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-(--fg) text-(--bg) opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
          style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
          aria-hidden
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight md:text-2xl">{work.title}</h3>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-(--fg-muted)">{work.outcome}</p>
        </div>
        <p className="micro whitespace-nowrap pt-2.5 text-(--fg-faint)">{work.category}</p>
      </div>
    </article>
  );
}

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hide both layers up front (useGSAP runs in a layout effect, so this
        // lands before first paint — no flash), then PLAY them in ONCE when the
        // section is well in view: the frame fades + grows, then the content
        // staggers in behind it. Using gsap.set + .to() (not .from) and NO
        // invalidateOnRefresh means a ScrollTrigger refresh (fonts/images
        // loading) can't flash the content visible→hidden mid-scroll.
        gsap.set("[data-work-frame]", { scale: 0.9, opacity: 0 });
        gsap.set("[data-work-reveal]", { y: 44, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 76%",
            once: true,
          },
        });

        tl.to(
          "[data-work-frame]",
          { scale: 1, opacity: 1, duration: 0.85, ease: "power3.out" },
          0,
        ).to(
          "[data-work-reveal]",
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: "expo.out" },
          0.45,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="zone-dark relative z-20 -mt-px bg-ink-deep p-2 text-(--fg) md:p-3"
    >
      {/* The bordered frame fills the screen (a thin inset so the border still
          reads), on its own layer so it grows independently of its content. */}
      <div
        data-work-frame
        aria-hidden
        className="absolute inset-2 rounded-[40px] border border-paper bg-ink-deep will-change-transform md:inset-3"
      />

      {/* Content — centred + capped for readability, revealed in timed beats
          inside the settled frame. */}
      <div className="relative mx-auto max-w-[1500px] px-6 pb-14 pt-14 md:px-14 md:pb-20 md:pt-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <header data-work-reveal className="lg:col-span-4">
            <p className="micro text-(--fg-faint)">Selected work — 2024 to now</p>
            <h2 className="mt-5 font-extrabold uppercase leading-[0.94] tracking-[-0.04em] text-[clamp(2.4rem,5.5vw,3.8rem)]">
              {HEADLINE.map((line, i) => (
                <span key={line} className="block">
                  {line}
                  {i === HEADLINE.length - 1 && <span className="text-oxblood">.</span>}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-(--fg-muted)">
              Every build has one job: turn visitors into booked work.
              Here&rsquo;s what that looks like.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <PillCTA label="All work" href="#work" />
              <span className="micro tabular-nums text-(--fg-faint)">
                {String(WORKS.length).padStart(2, "0")}
              </span>
            </div>
          </header>

          <div className="mt-14 lg:col-span-8 lg:mt-0">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-12 lg:order-2">
                <WorkCard work={WORKS[1]} />
                <WorkCard work={WORKS[3]} />
              </div>
              <div className="space-y-12 lg:order-1 lg:pt-20">
                <WorkCard work={WORKS[0]} />
                <WorkCard work={WORKS[2]} />
              </div>
            </div>
          </div>
        </div>

        <div
          data-work-reveal
          className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-(--line) pt-10 lg:mt-16"
        >
          <div>
            <p className="micro text-(--fg-faint)">Next opening — July</p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              Your project could be here.
            </p>
          </div>
          <PillCTA label="Start a project" href="#contact" />
        </div>
      </div>
    </section>
  );
}
