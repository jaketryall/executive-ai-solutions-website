"use client";

// Process — the trust beat. A solo shop has to answer the quiet question
// ("what's it actually like to work with one person?") before the ask. Four
// plain steps, first-call to long-term. The last step is deliberate: it names
// the ongoing work (SEO, ads, edits) so the retainer reads as the natural
// next step, not a surprise — the site is the foot in the door.
//
// Each step lives in a card with a small looping micro-scene up top (pure SVG
// + GSAP) that *demonstrates* the step: a call comes in, a site assembles, a
// launch chart climbs, growth compounds. Scenes loop on staggered durations so
// the row breathes instead of pulsing in unison; prefers-reduced-motion freezes
// every scene on a clean final frame.

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PillCTA from "./PillCTA";
import { replayEntrance } from "@/lib/scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const HEADLINE = ["Easy to start,", "built to grow"];

// Shared scene palette (this is a light zone, so explicit warm-ink values read
// cleaner than inheriting currentColor through nested SVG groups).
const STROKE = "rgba(26,24,22,0.28)";
const FILL = "rgba(26,24,22,0.05)";
const OX = "#7a1e27";

type SceneProps = { className?: string };

// ── 01 · Free strategy call ────────────────────────────────────────────────
// Two chat bubbles type in, a call-ring pulses, then a 3-line plan resolves.
function CallScene({ className }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set([q(".b1"), q(".b2")], { opacity: 0, scale: 0.85, transformOrigin: "left center" });
        gsap.set(q(".plan-row"), { opacity: 0, scaleX: 0, transformOrigin: "left center" });
        gsap.set(q(".ring"), { opacity: 0, scale: 0.4, transformOrigin: "center" });

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.7, defaults: { ease: "power2.out" } });
        tl.to(q(".b1"), { opacity: 1, scale: 1, duration: 0.45 })
          .to(q(".ring"), { opacity: 0.55, scale: 1.5, duration: 0.9, ease: "power2.out" }, "<")
          .to(q(".ring"), { opacity: 0, duration: 0.4 }, "-=0.4")
          .to(q(".b2"), { opacity: 1, scale: 1, duration: 0.45 }, "-=0.5")
          .to(q(".plan-row"), { opacity: 1, scaleX: 1, duration: 0.4, stagger: 0.12 }, "+=0.15")
          .to({}, { duration: 0.9 })
          .to([q(".b1"), q(".b2"), q(".plan-row")], { opacity: 0, duration: 0.5 });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([q(".b1"), q(".b2"), q(".plan-row")], { opacity: 1 });
        gsap.set(q(".ring"), { opacity: 0 });
      });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 200 150" className={className} fill="none" aria-hidden>
      <circle className="ring" cx="48" cy="48" r="20" stroke={OX} strokeWidth="1.5" />
      {/* incoming bubble */}
      <g className="b1">
        <rect x="26" y="38" width="64" height="22" rx="11" fill={FILL} stroke={STROKE} />
        <circle cx="42" cy="49" r="2.2" fill={STROKE} />
        <circle cx="50" cy="49" r="2.2" fill={STROKE} />
        <circle cx="58" cy="49" r="2.2" fill={STROKE} />
      </g>
      {/* reply bubble */}
      <g className="b2">
        <rect x="110" y="66" width="64" height="22" rx="11" fill={OX} opacity="0.12" stroke={OX} strokeWidth="1.2" />
        <line x1="122" y1="77" x2="162" y2="77" stroke={OX} strokeWidth="1.5" strokeLinecap="round" />
      </g>
      {/* the plan */}
      <g transform="translate(26 100)">
        <rect className="plan-row" x="0" y="0" width="120" height="6" rx="3" fill={STROKE} />
        <rect className="plan-row" x="0" y="14" width="148" height="6" rx="3" fill={STROKE} />
        <rect className="plan-row" x="0" y="28" width="92" height="6" rx="3" fill={OX} opacity="0.6" />
      </g>
    </svg>
  );
}

// ── 02 · Design & build ────────────────────────────────────────────────────
// Wireframe blocks snap into a mini layout (header → hero → button), then rebuild.
function BuildScene({ className }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q(".blk-header"), { opacity: 0, y: -14 });
        gsap.set(q(".blk-hero"), { opacity: 0, scale: 0.9, transformOrigin: "center" });
        gsap.set(q(".blk-col"), { opacity: 0, y: 14 });
        gsap.set(q(".blk-btn"), { opacity: 0, scale: 0.6, transformOrigin: "center" });

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.7, defaults: { ease: "back.out(1.6)" } });
        tl.to(q(".blk-header"), { opacity: 1, y: 0, duration: 0.45 })
          .to(q(".blk-hero"), { opacity: 1, scale: 1, duration: 0.45 }, "-=0.15")
          .to(q(".blk-col"), { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, "-=0.1")
          .to(q(".blk-btn"), { opacity: 1, scale: 1, duration: 0.4 }, "-=0.05")
          .to({}, { duration: 0.9 })
          .to(q(".blk"), { opacity: 0, duration: 0.5, ease: "power2.in" });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q(".blk"), { opacity: 1 });
      });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 200 150" className={className} fill="none" aria-hidden>
      {/* browser frame */}
      <rect x="26" y="20" width="148" height="110" rx="10" stroke={STROKE} strokeWidth="1.2" />
      <line x1="26" y1="36" x2="174" y2="36" stroke={STROKE} strokeWidth="1.2" />
      <circle cx="35" cy="28" r="2" fill={STROKE} />
      <circle cx="43" cy="28" r="2" fill={STROKE} />
      <circle cx="51" cy="28" r="2" fill={STROKE} />
      {/* assembling layout */}
      <rect className="blk blk-header" x="36" y="46" width="128" height="14" rx="4" fill={FILL} stroke={STROKE} />
      <rect className="blk blk-hero" x="36" y="66" width="74" height="40" rx="5" fill={OX} opacity="0.12" stroke={OX} strokeWidth="1.2" />
      <rect className="blk blk-col" x="118" y="66" width="46" height="11" rx="3" fill={FILL} stroke={STROKE} />
      <rect className="blk blk-col" x="118" y="82" width="46" height="11" rx="3" fill={FILL} stroke={STROKE} />
      <rect className="blk blk-btn" x="118" y="98" width="30" height="10" rx="5" fill={OX} />
    </svg>
  );
}

// ── 03 · Launch ─────────────────────────────────────────────────────────────
// Cursor taps the button, an analytics line draws upward, a counter ticks.
function LaunchScene({ className }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      const path = ref.current!.querySelector(".chart-line") as SVGPathElement;
      const len = path.getTotalLength();
      const counter = ref.current!.querySelector(".count") as SVGTextElement;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.set(q(".dot"), { opacity: 0 });
        gsap.set(q(".cursor"), { x: 6, y: 6 });
        gsap.set(q(".btn"), { transformOrigin: "center" });

        const num = { v: 0 };
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.7, defaults: { ease: "power2.out" } });
        tl.to(q(".cursor"), { x: 0, y: 0, duration: 0.6, ease: "power3.inOut" })
          .to(q(".btn"), { scale: 0.9, duration: 0.12, ease: "power2.in" })
          .to(q(".btn"), { scale: 1, duration: 0.25, ease: "back.out(2)" })
          .to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, "-=0.1")
          .to(q(".dot"), { opacity: 1, duration: 0.2, stagger: 0.22 }, "<+0.2")
          .to(num, {
            v: 248,
            duration: 1.1,
            ease: "power2.out",
            snap: { v: 1 },
            onUpdate: () => { counter.textContent = String(Math.round(num.v)); },
          }, "<")
          .to({}, { duration: 0.8 })
          .to([path, q(".dot")], { opacity: 0, duration: 0.4 })
          .add(() => { counter.textContent = "0"; gsap.set(path, { opacity: 1, strokeDashoffset: len }); });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: 0 });
        gsap.set(q(".dot"), { opacity: 1 });
        counter.textContent = "248";
      });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 200 150" className={className} fill="none" aria-hidden>
      {/* axis */}
      <line x1="30" y1="28" x2="30" y2="104" stroke={STROKE} strokeWidth="1.2" />
      <line x1="30" y1="104" x2="172" y2="104" stroke={STROKE} strokeWidth="1.2" />
      {/* climbing chart */}
      <path className="chart-line" d="M30 96 L66 84 L100 88 L134 56 L168 36" stroke={OX} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="dot" cx="100" cy="88" r="3" fill={OX} />
      <circle className="dot" cx="134" cy="56" r="3" fill={OX} />
      <circle className="dot" cx="168" cy="36" r="3.4" fill={OX} />
      {/* live counter */}
      <text className="count" x="30" y="20" fill={OX} fontSize="15" fontWeight="700" fontFamily="ui-monospace, monospace">0</text>
      {/* the launch button + cursor */}
      <g className="btn">
        <rect x="112" y="116" width="48" height="18" rx="9" fill={OX} />
        <line x1="124" y1="125" x2="148" y2="125" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <path className="cursor" d="M150 120 L150 134 L154 130 L157 137 L160 135 L157 128 L162 128 Z" fill="#1a1816" stroke="#fff" strokeWidth="0.8" />
    </svg>
  );
}

// ── 04 · Grow, together ──────────────────────────────────────────────────────
// Bars climb in a staggered loop while SEO / Ads / Edits tags cycle beneath.
function GrowScene({ className }: SceneProps) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(q(".bar"), { scaleY: 0, transformOrigin: "bottom center" });
        gsap.set(q(".tag"), { opacity: 0, y: 8 });

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, defaults: { ease: "power3.out" } });
        tl.to(q(".bar"), { scaleY: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.4)" })
          .to(q(".trend"), { opacity: 1, duration: 0.4 }, "-=0.4")
          .to(q(".tag"), { opacity: 1, y: 0, duration: 0.35, stagger: 0.18 }, "-=0.3")
          .to({}, { duration: 0.9 })
          .to([q(".bar"), q(".tag"), q(".trend")], { opacity: 0, duration: 0.5 })
          .add(() => gsap.set(q(".bar"), { scaleY: 0, opacity: 1 }));
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([q(".bar"), q(".tag"), q(".trend")], { opacity: 1 });
        gsap.set(q(".bar"), { scaleY: 1, transformOrigin: "bottom center" });
      });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 200 150" className={className} fill="none" aria-hidden>
      <line x1="28" y1="98" x2="176" y2="98" stroke={STROKE} strokeWidth="1.2" />
      {/* climbing bars */}
      <rect className="bar" x="36" y="62" width="20" height="36" rx="3" fill={FILL} stroke={STROKE} />
      <rect className="bar" x="68" y="48" width="20" height="50" rx="3" fill={FILL} stroke={STROKE} />
      <rect className="bar" x="100" y="34" width="20" height="64" rx="3" fill={OX} opacity="0.18" stroke={OX} strokeWidth="1.2" />
      <rect className="bar" x="132" y="22" width="20" height="76" rx="3" fill={OX} />
      {/* trend arrow */}
      <path className="trend" d="M40 70 L78 56 L110 44 L150 26" stroke={OX} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
      <path className="trend" d="M150 26 L141 27 M150 26 L149 35" stroke={OX} strokeWidth="2" strokeLinecap="round" opacity="0" />
      {/* service tags */}
      <g className="tag"><rect x="30" y="112" width="34" height="16" rx="8" fill={FILL} stroke={STROKE} /><text x="47" y="123" fill={STROKE} fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="ui-monospace, monospace">SEO</text></g>
      <g className="tag"><rect x="70" y="112" width="34" height="16" rx="8" fill={FILL} stroke={STROKE} /><text x="87" y="123" fill={STROKE} fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="ui-monospace, monospace">ADS</text></g>
      <g className="tag"><rect x="110" y="112" width="44" height="16" rx="8" fill={FILL} stroke={STROKE} /><text x="132" y="123" fill={STROKE} fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="ui-monospace, monospace">EDITS</text></g>
    </svg>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Free strategy call",
    body: "Tell me about your business and what more customers would actually look like. You leave with a plan and a clear price — no pressure, no jargon.",
    Scene: CallScene,
  },
  {
    n: "02",
    title: "Design & build",
    body: "I design and build a fast, modern site around one job: turning the people who land on it into calls, bookings, and paying customers.",
    Scene: BuildScene,
  },
  {
    n: "03",
    title: "Launch",
    body: "We go live with tracking wired in, so from day one you can see the clicks, calls, and leads your new site is bringing in.",
    Scene: LaunchScene,
  },
  {
    n: "04",
    title: "Grow, together",
    body: "Then I stick around — SEO, Google Ads, and ongoing edits that keep new customers coming, so your site keeps earning instead of going stale.",
    Scene: GrowScene,
  },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Headline lines rise out of their masks.
        replayEntrance(".hero-line", sectionRef.current!, {
          from: { y: "115%" },
          to: { y: 0, duration: 1.05, stagger: 0.1, ease: "expo.out" },
          start: "top 70%",
        });

        // Cards stagger up as the row arrives.
        replayEntrance("[data-process-step]", sectionRef.current!, {
          from: { y: 48, opacity: 0 },
          to: { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "expo.out" },
          start: "top 75%",
        });

        // The closing call-to-action settles in last.
        replayEntrance("[data-process-cta]", sectionRef.current!, {
          from: { y: 36, opacity: 0 },
          to: { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" },
          start: "top 55%",
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative px-5 md:px-10 pt-24 md:pt-32 pb-28 text-(--fg)"
    >
      {/* Header */}
      <div className="relative mx-auto max-w-[1600px] flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="micro text-(--fg-faint)">
            How it works — first call to long-term growth
          </p>
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
          You work directly with me — no account managers, no hand-offs.
          Here&rsquo;s exactly how a project goes.
        </p>
      </div>

      {/* The steps — each a card with a looping micro-scene up top */}
      <ol className="relative mx-auto max-w-[1600px] mt-16 md:mt-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ n, title, body, Scene }) => (
          <li
            key={n}
            data-process-step
            className="group relative flex flex-col rounded-[28px] border border-(--line) bg-paper-warm p-5 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(26,24,22,0.25)]"
          >
            {/* Visual stage */}
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-[18px] border border-(--line) bg-(--bg)">
              <Scene className="absolute inset-0 h-full w-full" />
            </div>

            <div className="mt-5 flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-oxblood"
                aria-hidden
              />
              <span className="micro tabular-nums text-(--fg-faint) transition-colors duration-300 group-hover:text-oxblood">
                {n}
              </span>
            </div>
            <h3 className="mt-3 text-xl md:text-2xl font-bold tracking-tight">
              {title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-(--fg-muted)">
              {body}
            </p>
          </li>
        ))}
      </ol>

      {/* Low-friction close — the foot in the door is a free call */}
      <div
        data-process-cta
        className="mx-auto max-w-[1600px] mt-16 flex flex-wrap items-center gap-x-6 gap-y-4"
      >
        <PillCTA label="Book the free call" href="#contact" />
        <p className="micro text-(--fg-faint)">
          No cost, no obligation — just a plan.
        </p>
      </div>
    </section>
  );
}
