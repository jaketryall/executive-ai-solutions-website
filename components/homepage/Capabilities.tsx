"use client";

import { useRef, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap-setup";
import {
  cardHoverVariants,
  tagHoverVariants,
  tweenCounter,
  prefersReducedMotion,
} from "@/lib/microInteractions";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const services = [
  {
    num: "01",
    name: "Conversion Websites",
    title: "Every scroll earns its place.",
    body: "Sites built with conversion architecture from the first wireframe. Every section has to defend its spot — or it gets cut.",
    tags: ["Next.js", "Sanity CMS", "Tailwind", "Analytics"],
    footer: "Wireframe → design → launch in 4 weeks.",
  },
  {
    num: "02",
    name: "AI Automations",
    title: "Back-office that runs on its own.",
    body: "Inbox triage, lead routing, content pipelines. Workflows that do the 10 small things you keep forgetting.",
    tags: ["n8n", "OpenAI", "Slack", "Webhooks"],
    footer: "Replaces ~8 hrs/week of admin.",
  },
  {
    num: "03",
    name: "Custom Software",
    title: "One system instead of twelve tabs.",
    body: "Internal tools and dashboards shaped to your operation. One login, one schema, one place your team actually looks.",
    tags: ["Next.js", "Supabase", "Role-based auth", "Owned by you"],
    footer: "Purpose-built, not SaaS-bent.",
  },
];

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;
    const reduce = prefersReducedMotion();
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      // Card stagger entry
      gsap.from(".cap-card", {
        opacity: 0,
        y: 24,
        duration: reduce ? 0 : 0.7,
        ease: "appleOut",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Section title word-mask reveal
      const titleEl =
        sectionRef.current!.querySelector<HTMLElement>(".cap-title");
      if (titleEl) {
        const split = SplitText.create(titleEl, {
          type: "words",
          mask: "words",
        });
        splits.push(split);
        gsap.set(split.words, { yPercent: 110 });
        gsap.to(split.words, {
          yPercent: 0,
          duration: reduce ? 0 : 0.7,
          stagger: 0.04,
          ease: "appleOut",
          scrollTrigger: { trigger: titleEl, start: "top 85%" },
        });
      }
    }, sectionRef);

    return () => {
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="py-32 px-6"
      style={{ backgroundColor: "#e5e1db" }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-4"
            style={{ color: "#78736c" }}
          >
            What I do
          </p>
          <h2
            className="cap-title font-black tracking-tight"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              lineHeight: 1.05,
              color: "#1a1816",
            }}
          >
            Three things I ship for clients.
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CapCard
            service={services[0]}
            className="md:col-span-2"
            demo={<DesignDemo />}
          />
          <CapCard
            service={services[1]}
            className="md:col-span-1"
            demo={<AutomationDemo />}
          />
          <CapCard
            service={services[2]}
            className="md:col-span-3"
            demo={<SoftwareDemo />}
          />
        </div>
      </div>
    </section>
  );
}

function CapCard({
  service,
  demo,
  className = "",
}: {
  service: (typeof services)[number];
  demo: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className={`cap-card relative rounded-2xl p-8 md:p-10 ${className}`}
      style={{
        backgroundColor: "rgba(255,255,255,0.4)",
        border: "1px solid rgba(26,23,20,0.08)",
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.22em]"
          style={{ color: "#78736c" }}
        >
          {service.num} — {service.name}
        </p>
      </div>

      <h3
        className="font-black tracking-tight mb-3"
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
          color: "#1a1816",
          lineHeight: 1.15,
        }}
      >
        {service.title}
      </h3>

      <p
        className="mb-6"
        style={{
          color: "rgba(26,24,22,0.7)",
          maxWidth: 520,
          lineHeight: 1.55,
        }}
      >
        {service.body}
      </p>

      {/* Demo area */}
      <div
        className="mb-6 rounded-xl overflow-hidden"
        style={{
          minHeight: 220,
          backgroundColor: "rgba(26,24,22,0.04)",
        }}
      >
        {demo}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {service.tags.map((tag) => (
          <motion.span
            key={tag}
            variants={tagHoverVariants}
            initial="rest"
            whileHover="hover"
            className="text-xs font-medium px-3 py-1.5 rounded-full cursor-default"
            style={{ color: "#1a1816", border: "1px solid rgba(26,24,22,0.12)" }}
          >
            {tag}
          </motion.span>
        ))}
      </div>

      <p className="text-xs" style={{ color: "rgba(26,24,22,0.45)" }}>
        {service.footer}
      </p>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Demo 1: Wireframe → mockup color morph loop
// ─────────────────────────────────────────────
function DesignDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();
    if (reduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3, paused: true });

      // Wireframe → hi-fi: each block gets a distinct accent color
      tl.to(".dd-block", {
        backgroundColor: (i: number) =>
          (["#1a1816", "#78736c", "#c7c2bb", "#e0dbd4"] as const)[i] ?? "#1a1816",
        duration: 0.8,
        stagger: 0.1,
        ease: "appleOut",
      })
        // Hi-fi pause, then revert to wireframe gray
        .to(
          ".dd-block",
          {
            backgroundColor: "#d4d0c9",
            duration: 0.8,
            stagger: 0.1,
            ease: "appleOut",
          },
          "+=1.5"
        );

      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => tl.play(),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(),
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="w-full h-full p-6 flex flex-col gap-2">
      {/* Header bar */}
      <div
        className="dd-block rounded h-8 w-2/5"
        style={{ backgroundColor: "#d4d0c9" }}
      />
      {/* Hero block */}
      <div
        className="dd-block rounded h-24 w-full"
        style={{ backgroundColor: "#d4d0c9" }}
      />
      {/* Three feature columns */}
      <div className="grid grid-cols-3 gap-2 h-12">
        <div
          className="dd-block rounded"
          style={{ backgroundColor: "#d4d0c9" }}
        />
        <div
          className="dd-block rounded"
          style={{ backgroundColor: "#d4d0c9" }}
        />
        <div
          className="dd-block rounded"
          style={{ backgroundColor: "#d4d0c9" }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Demo 2: Automation workflow + MotionPath packet
// ─────────────────────────────────────────────
function AutomationDemo() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();
    if (reduce) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, paused: true });

      // Packet travels the dashed path, looping
      tl.to(".ad-packet", {
        motionPath: {
          path: "#ad-path",
          align: "#ad-path",
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        duration: 3.5,
        ease: "none",
      });

      // Node pulse on each pass — staggered scale bounce (runs in parallel via separate repeating tween)
      gsap.to([".ad-node-inbox", ".ad-node-classify", ".ad-node-slack"], {
        scale: 1.15,
        duration: 0.25,
        ease: "power2.out",
        stagger: 1.05, // ~3.15s apart, node 1 at 0s, node 2 at 1.05s, node 3 at 2.1s
        repeat: -1,
        yoyo: true,
        transformOrigin: "50% 50%",
        paused: true,
        id: "ad-pulse",
      });

      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => {
          tl.play();
          gsap.getById("ad-pulse")?.play();
        },
        onEnterBack: () => {
          tl.play();
          gsap.getById("ad-pulse")?.play();
        },
        onLeave: () => {
          tl.pause();
          gsap.getById("ad-pulse")?.pause();
        },
        onLeaveBack: () => {
          tl.pause();
          gsap.getById("ad-pulse")?.pause();
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full h-full p-6 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 320 180"
        className="w-full h-auto max-w-[320px]"
        aria-hidden="true"
      >
        {/* NOTE: #ad-path is a global ID. This component assumes single instance per page.
            If this section is ever rendered multiple times (A/B, Storybook), unique-ify the id
            via a useId() hook and pass to the motionPath path option. */}
        {/* Dashed connecting path */}
        <path
          id="ad-path"
          d="M 40 90 Q 100 90 160 50 Q 220 90 280 90"
          fill="none"
          stroke="#78736c"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          opacity="0.5"
        />

        {/* Nodes */}
        <circle
          className="ad-node-inbox"
          cx="40"
          cy="90"
          r="14"
          fill="#1a1816"
        />
        <circle
          className="ad-node-classify"
          cx="160"
          cy="50"
          r="14"
          fill="#1a1816"
        />
        <circle
          className="ad-node-slack"
          cx="280"
          cy="90"
          r="14"
          fill="#1a1816"
        />

        {/* Labels */}
        <text
          x="40"
          y="116"
          textAnchor="middle"
          fontSize="9"
          fill="#78736c"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          letterSpacing="0.04em"
        >
          Inbox
        </text>
        <text
          x="160"
          y="30"
          textAnchor="middle"
          fontSize="9"
          fill="#78736c"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          letterSpacing="0.04em"
        >
          Classify
        </text>
        <text
          x="280"
          y="116"
          textAnchor="middle"
          fontSize="9"
          fill="#78736c"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          letterSpacing="0.04em"
        >
          Slack
        </text>

        {/* Animated packet */}
        <circle className="ad-packet" cx="0" cy="0" r="5" fill="#78736c" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// Demo 3: Lighthouse ring + KPI counters
// ─────────────────────────────────────────────
function SoftwareDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const lcpRef = useRef<HTMLSpanElement>(null);
  const clsRef = useRef<HTMLSpanElement>(null);
  const inpRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Establish DrawSVG initial state explicitly so it controls dasharray from the start
      if (ringRef.current) {
        gsap.set(ringRef.current, { drawSVG: "0% 0%" });
      }

      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (reduce) {
            if (scoreRef.current) scoreRef.current.textContent = "98";
            if (lcpRef.current) lcpRef.current.textContent = "1.2";
            if (clsRef.current) clsRef.current.textContent = "0.01";
            if (inpRef.current) inpRef.current.textContent = "110";
            if (ringRef.current)
              gsap.set(ringRef.current, { drawSVG: "0 98%" });
            return;
          }

          // Ring draw
          if (ringRef.current) {
            gsap.fromTo(
              ringRef.current,
              { drawSVG: "0 0%" },
              { drawSVG: "0 98%", duration: 1.4, ease: "appleOut" }
            );
          }

          // Score counter
          if (scoreRef.current)
            tweenCounter(scoreRef.current, 98, { duration: 1.4 });

          // KPI counters
          if (lcpRef.current)
            tweenCounter(lcpRef.current, 1.2, {
              duration: 1.2,
              format: (n) => n.toFixed(1),
            });
          if (clsRef.current)
            tweenCounter(clsRef.current, 0.01, {
              duration: 1.2,
              format: (n) => n.toFixed(2),
            });
          if (inpRef.current)
            tweenCounter(inpRef.current, 110, { duration: 1.2 });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  const kpis = [
    { label: "LCP", elRef: lcpRef, suffix: "s" },
    { label: "CLS", elRef: clsRef, suffix: "" },
    { label: "INP", elRef: inpRef, suffix: "ms" },
  ] as const;

  return (
    <div
      ref={ref}
      className="w-full h-full p-6 flex items-center justify-between gap-6 flex-wrap"
    >
      {/* Circular performance ring */}
      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full -rotate-90"
          aria-hidden="true"
        >
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(26,24,22,0.08)"
            strokeWidth="6"
          />
          {/* Animated fill ring — DrawSVG uses pathLength */}
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#1a1816"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="100"
          />
        </svg>

        {/* Score label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            ref={scoreRef}
            className="font-black"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "2.25rem",
              color: "#1a1816",
              lineHeight: 1,
            }}
          >
            0
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.2em]"
            style={{ color: "#78736c", marginTop: 4 }}
          >
            Performance
          </span>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-3 gap-4 flex-1 min-w-[260px]">
        {kpis.map((m) => (
          <div
            key={m.label}
            className="rounded-lg p-3"
            style={{
              backgroundColor: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(26,24,22,0.08)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-1"
              style={{ color: "#78736c" }}
            >
              {m.label}
            </p>
            <p
              className="font-bold"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "1.25rem",
                color: "#1a1816",
              }}
            >
              <span ref={m.elRef}>0</span>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "#78736c",
                  marginLeft: 2,
                }}
              >
                {m.suffix}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
