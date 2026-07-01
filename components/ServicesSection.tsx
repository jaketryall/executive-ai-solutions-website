"use client";

// Services — stacking cards. Each card docks below the nav, then the next
// slides up over it while the one beneath settles back and dims. The "pin"
// is a counter-translate (y tween at scroll speed), not CSS sticky or
// ScrollTrigger pin — it survives ScrollSmoother's transformed content and
// releases with zero jump because the transform simply stops growing.

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { replayEntrance } from "@/lib/scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const SERVICES = [
  {
    label: "Websites — the flagship",
    title: "Sites that sell the second they load.",
    body: "Strategy, copy, design and build — a site engineered around one job: turning your visitors into booked clients.",
    chips: ["Strategy & copy", "Design", "Next.js build", "SEO", "Analytics"],
    image: "/Celestial Laptop Mockup.webp",
    dark: false,
  },
  {
    label: "Motion & brand",
    title: "Motion you can feel.",
    body: "Signature interactions and scroll choreography that make your brand feel expensive — because it looks alive.",
    chips: ["Scroll choreography", "Micro-interactions", "Brand systems", "Video & 3D"],
    image: "/Elegant Black Laptop Mockup.webp",
    dark: true,
  },
  {
    label: "AI & automation",
    title: "A site that works while you sleep.",
    body: "Booking systems, client portals, dashboards and automations wired into your site — fewer emails, more booked work.",
    chips: ["Bookings", "Client portals", "Dashboards", "Automations"],
    image: "/custom-dashboard-mockup.webp",
    dark: false,
  },
];

const HEADLINE = ["Full stack,", "no hand-offs"];

function ServiceCard({ service }: { service: (typeof SERVICES)[number] }) {
  return (
    <div
      data-service-card
      className={`relative overflow-hidden rounded-[40px] border text-(--fg) ${
        service.dark
          ? "zone-dark bg-ink border-paper/10"
          : "zone-light bg-paper-warm border-ink/10"
      }`}
    >
      <div
        data-card-inner
        className="grid lg:grid-cols-2 items-center gap-7 lg:gap-16 p-6 md:p-12 lg:p-16 lg:min-h-[min(64vh,640px)]"
      >
        <div>
          <p className="micro text-(--fg-faint) flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-oxblood" aria-hidden />
            {service.label}
          </p>
          <h3 className="mt-5 font-bold tracking-[-0.03em] leading-[1.04] text-[clamp(1.9rem,3.6vw,3.4rem)]">
            {service.title}
          </h3>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-(--fg-muted)">
            {service.body}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {service.chips.map((chip) => (
              <li
                key={chip}
                className="micro text-(--fg-muted) inline-flex items-center h-9 px-4 rounded-full border border-(--line)"
              >
                {chip}
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="group mt-8 lg:mt-10 inline-flex items-center gap-2 text-[13px] font-medium tracking-tight focus-ring"
          >
            <span className="slot-link">
              <span className="slot-link-stack">
                <span className="slot-link-inner">Start this project</span>
                <span className="slot-link-clone" aria-hidden>
                  Start this project
                </span>
              </span>
            </span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-1"
              style={{ transitionTimingFunction: "var(--ease-expo-out)" }}
              aria-hidden
            >
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
        </div>

        <div className="relative aspect-video lg:aspect-4/3 rounded-3xl overflow-hidden border border-(--line) bg-ink">
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(min-width: 1600px) 760px, (min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Dims as the next card slides over */}
      <div
        data-card-shade
        aria-hidden
        className="absolute inset-0 bg-ink-deep/30 opacity-0 pointer-events-none"
      />
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks.
        replayEntrance(".hero-line", sectionRef.current!, {
          from: { y: "115%" },
          to: { y: 0, duration: 1.05, stagger: 0.1, ease: "expo.out" },
          start: "top 62%",
        });

        // The card stack.
        const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]");
        const last = cards[cards.length - 1];

        cards.forEach((card, i) => {
          // Content entrance per card (late reset — no pop on scroll-up).
          const inner = card.querySelector("[data-card-inner]");
          if (inner) {
            replayEntrance(inner, card, {
              from: { y: 60, opacity: 0 },
              to: { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
              start: "top 75%",
            });
          }

          if (i === cards.length - 1) return;

          // Fake pin: once the card reaches the stack point it translates
          // down at exactly scroll speed until the last card arrives, then
          // the whole stack scrolls away together holding its offsets.
          const dist = () => last.offsetTop - card.offsetTop;
          // Mobile cards nearly fill the viewport — dock them higher so the
          // bottom of the card stays on screen while stacked.
          const stackStart = () =>
            window.innerWidth < 1024 ? "top 6%" : "top 12%";
          gsap.fromTo(
            card,
            { y: 0 },
            {
              y: dist,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: stackStart,
                end: () => `+=${dist()}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );

          // Settle-under: scale back + dim as the next card covers it.
          const next = cards[i + 1];
          gsap.fromTo(
            card,
            { scale: 1 },
            {
              scale: 0.95,
              transformOrigin: "center top",
              ease: "none",
              scrollTrigger: {
                trigger: next,
                start: "top bottom",
                end: stackStart,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
          const shade = card.querySelector("[data-card-shade]");
          if (shade) {
            gsap.fromTo(
              shade,
              { opacity: 0 },
              {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: next,
                  start: "top 60%",
                  end: stackStart,
                  scrub: true,
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
      id="services"
      className="zone-dark relative -mt-px bg-ink-deep px-5 md:px-10 pt-24 md:pt-32 pb-28 text-(--fg)"
    >

      {/* Header */}
      <div className="relative mx-auto max-w-[1600px] flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="micro text-(--fg-faint)">Services — pick one or take the stack</p>
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
        </div>
        <p className="max-w-xs text-[15px] leading-relaxed text-(--fg-muted) pb-2">
          Strategy, design and build from the same team — every piece made to
          pull in the same direction: booked work.
        </p>
      </div>

      {/* The stack */}
      <div className="relative mx-auto max-w-[1600px] mt-16 md:mt-24 space-y-6">
        {SERVICES.map((service) => (
          <ServiceCard key={service.label} service={service} />
        ))}
      </div>
    </section>
  );
}
