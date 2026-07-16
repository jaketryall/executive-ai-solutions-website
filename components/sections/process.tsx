"use client";

import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { Monogram } from "@/components/ui/monogram";

const STEPS = [
  {
    n: "01",
    title: "The call",
    meta: "Day 1",
    copy: "Twenty minutes on your business, your customers, and what winning looks like. You get a fixed quote within two days.",
  },
  {
    n: "02",
    title: "The design",
    meta: "Weeks 1–2",
    copy: "You see real pages in your brand, not wireframes. We iterate until you'd happily put it on a billboard.",
  },
  {
    n: "03",
    title: "The build",
    meta: "Weeks 2–4",
    copy: "Hand-coded, fast, and search-ready from day one. No page builders, nothing you'll outgrow.",
  },
  {
    n: "04",
    title: "The growth",
    meta: "From launch",
    copy: "Launch is the start. SEO, Google Ads, and AI automation keep the site earning its keep.",
  },
];

/* ── each step keeps a little demo, but OWNS it — four artifacts instead of
   one shared morphing stage. All four rest in their FINISHED state so
   no-JS / reduced-motion read the completed story. ── */

// 01 · the quote ticket, landing in your inbox
function DemoCall() {
  return (
    <div className="pd-panel">
      <div className="pd-ticket w-[min(88%,360px)] aspect-[7/5] rounded-btn bg-ink text-paper shadow-[0_16px_44px_-16px_rgba(19,20,19,0.45)] flex flex-col justify-center p-[18px]">
        <Monogram className="h-[14px] w-[14px] opacity-80" />
        <p className="mt-[10px] text-[12.5px] text-paper/60">Your fixed quote</p>
        <p className="t-num mt-[3px] font-display text-[28px] font-[800] leading-none">
          From $2,500
        </p>
        <p className="mt-[8px] text-[12px] leading-[1.45] text-paper/60">
          In your inbox within two days.
        </p>
      </div>
    </div>
  );
}

// 02 · the REAL page resolves out of its wireframe — the copy's exact
// promise ("real pages in your brand, not wireframes"), enacted with the
// real Desert Wings homepage instead of an invented brand
function DemoDesign() {
  return (
    <div className="pd-panel">
      {/* the SAME object language as the other three demos: one small ink
          card on the paper field — here it's a tiny browser, and the
          wireframe→real resolve happens inside its screen */}
      <div className="pd-shot w-[min(88%,360px)] aspect-[7/5] rounded-btn bg-ink text-paper shadow-[0_16px_44px_-16px_rgba(19,20,19,0.45)] flex flex-col overflow-hidden">
        <div className="relative min-h-0 flex-1">
          {/* the wireframe it starts as… */}
          <div
            data-wire
            className="absolute inset-0 flex flex-col gap-[8px] bg-paper p-[11px]"
            aria-hidden
          >
            <div data-blk className="flex items-center justify-between">
              <span className="st-fill h-[7px] w-[44px]" />
              <span className="flex items-center gap-[6px]">
                <span className="st-fill h-[5px] w-[16px]" />
                <span className="st-fill h-[5px] w-[16px]" />
                <span className="st-fill h-[5px] w-[16px]" />
              </span>
            </div>
            <div
              data-blk
              className="st-hero flex min-h-0 flex-1 items-center gap-[10px] p-[10px]"
            >
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[6px]">
                <span className="st-fill h-[8px] w-[86%]" />
                <span className="st-fill h-[8px] w-[58%]" />
                <span className="st-fill mt-[4px] h-[14px] w-[52px] rounded-full" />
              </div>
              <span className="st-himg h-[72%] w-[34%] rounded-chip" />
            </div>
            <div data-blk className="grid grid-cols-3 gap-[6px]">
              {[0, 1, 2].map((c) => (
                <span key={c} className="st-thumb h-[16px] rounded-chip" />
              ))}
            </div>
          </div>
          {/* …and the real page it becomes (the rest state) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            data-real
            src="/work/dw-home.jpg"
            alt="The finished Desert Wings homepage design"
            className="absolute inset-0 h-full w-full object-cover object-top-left"
          />
        </div>
      </div>
    </div>
  );
}

// 03 · the build report — scores climb to 100
function DemoBuild() {
  return (
    <div className="pd-panel">
      <div className="pd-report w-[min(88%,360px)] aspect-[7/5] rounded-btn bg-ink text-paper shadow-[0_16px_44px_-16px_rgba(19,20,19,0.45)] flex flex-col justify-center p-[18px]">
        <p className="t-meta text-[11px] text-paper/55">Build report</p>
        <div className="mt-[13px] flex flex-col gap-[11px]">
          <div className="sc-row">
            <span className="sc-label">Performance</span>
            <span className="sc-track">
              <span className="sc-fill" />
            </span>
            <span className="sc-val st-perf t-num">100</span>
          </div>
          <div className="sc-row">
            <span className="sc-label">SEO</span>
            <span className="sc-track">
              <span className="sc-fill" />
            </span>
            <span className="sc-val st-seo t-num">100</span>
          </div>
          <div className="sc-row">
            <span className="sc-label">Load</span>
            <span className="sc-track">
              <span className="sc-fill sc-fill--load" />
            </span>
            <span className="sc-val t-num">0.4s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 04 · the enquiries chart — the line draws, the number climbs
function DemoGrowth() {
  return (
    <div className="pd-panel">
      <div className="pd-chart w-[min(88%,360px)] aspect-[7/5] rounded-btn bg-ink text-paper shadow-[0_16px_44px_-16px_rgba(19,20,19,0.45)] flex flex-col justify-center p-[18px]">
        <p className="t-meta text-[11px] text-paper/55">Enquiries</p>
        <p className="mt-[3px] font-display text-[30px] font-[800] leading-none">
          <span className="st-count t-num">34</span>
        </p>
        <svg className="mt-[10px] w-full" viewBox="0 0 130 40" fill="none" aria-hidden>
          <path
            className="st-line"
            d="M3 35 L20 30 L37 31.5 L54 24 L71 26 L88 16 L105 18.5 L124 6"
            stroke="var(--color-accent-bright)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            className="st-dot"
            cx="124"
            cy="6"
            r="3.5"
            fill="var(--color-accent-bright)"
          />
        </svg>
      </div>
    </div>
  );
}

const DEMOS = [DemoCall, DemoDesign, DemoBuild, DemoGrowth];

export function Process() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        // clean end-state: four finished artifacts in one frame
        return;
      }

      /* ── the four demos: each step animates its OWN artifact once, as its
         column lands. Rest states are "finished", so JS rewinds them first. ── */
      const ticket = q(".pd-ticket")[0];
      const blocks = q("[data-wire] [data-blk]");
      const realPage = q("[data-real]")[0];
      const scoreBars = q(".pd-report .sc-fill");
      const perfNum = q(".st-perf")[0];
      const seoNum = q(".st-seo")[0];
      const count = q(".st-count")[0];
      const dot = q(".st-dot")[0];
      const line = q(".st-line")[0] as unknown as SVGPathElement | undefined;
      const lineLen = line ? line.getTotalLength() : 0;

      // rewind to "not yet"
      if (ticket) gsap.set(ticket, { autoAlpha: 0 });
      if (realPage) gsap.set(realPage, { autoAlpha: 0, scale: 1.035 });
      gsap.set(blocks, { autoAlpha: 0, y: 8 });
      gsap.set(scoreBars, { scaleX: 0 });
      if (perfNum) perfNum.textContent = "0";
      if (seoNum) seoNum.textContent = "0";
      if (count) count.textContent = "0";
      if (line) gsap.set(line, { strokeDasharray: lineLen, strokeDashoffset: lineLen });
      if (dot) gsap.set(dot, { scale: 0, transformOrigin: "center" });

      const playCall = (tl: gsap.core.Timeline, at: number) => {
        if (!ticket) return;
        tl.fromTo(
          ticket,
          { autoAlpha: 0, y: 21, rotate: -4, scale: 0.95 },
          { autoAlpha: 1, y: 0, rotate: 0, scale: 1, duration: 0.7 },
          at
        );
      };
      const playDesign = (tl: gsap.core.Timeline, at: number) => {
        // the sketch draws itself… then the real page resolves through it
        tl.to(
          blocks,
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.09 },
          at
        );
        if (realPage)
          tl.to(
            realPage,
            { autoAlpha: 1, scale: 1, duration: 0.9, ease: EASE_STRUCTURE },
            at + 1.0
          );
      };
      const playBuild = (tl: gsap.core.Timeline, at: number) => {
        tl.to(scoreBars, { scaleX: 1, duration: 0.8, stagger: 0.08 }, at);
        [perfNum, seoNum].forEach((el, k) => {
          if (!el) return;
          const o = { v: 0 };
          tl.to(
            o,
            {
              v: 100,
              duration: 0.9 + k * 0.05,
              onUpdate: () => (el.textContent = String(Math.round(o.v))),
            },
            at + 0.05 * k
          );
        });
      };
      const playGrowth = (tl: gsap.core.Timeline, at: number) => {
        if (line) tl.fromTo(line, { strokeDashoffset: lineLen }, { strokeDashoffset: 0, duration: 1.0 }, at);
        if (dot) tl.to(dot, { scale: 1, duration: 0.4, ease: EASE_UI }, at + 0.8);
        if (count) {
          const o = { v: 0 };
          tl.to(
            o,
            {
              v: 34,
              duration: 1.1,
              onUpdate: () => (count.textContent = String(Math.round(o.v))),
            },
            at + 0.1
          );
        }
      };
      const players = [playCall, playDesign, playBuild, playGrowth];

      const steps = q("[data-pstep]");
      const fills = steps.map((el) => el.querySelector(".num-fill"));

      /* ── no entrance: the cards are simply THERE (Jake). The life lives
         INSIDE each card — the numeral inks in and the little demo plays
         once as its card is read, without the card itself moving. ── */
      steps.forEach((el, i) => {
        const tl = gsap.timeline({
          defaults: { ease: EASE_STRUCTURE, overwrite: "auto" },
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        });
        const f = fills[i];
        if (f)
          tl.fromTo(
            f,
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 0.5 },
            0
          );
        players[i](tl, 0.15);
      });
    },
    { scope: root }
  );

  return (
    <section
      id="process"
      ref={root}
      className="relative z-0"
    >
      <div className="py-fib-6 md:py-fib-7">
        <div className="wrap">
          <h2 className="t-display-lg">How a project runs</h2>
          <p className="mt-[13px] max-w-[44ch] text-ink/70">
            Four steps from first call to a site that earns. Fixed quote up
            front, no surprises after.
          </p>
        </div>

        {/* the whole path, visible at once — four steps IN A LINE, each
            inside its own card, no entrance: the life plays inside them.
            The row breaks OUT of the wrap (the services-panel move): four
            postage stamps at 277px read small next to the 466px service
            artifacts; edge-to-edge the cards grow with the screen while
            the path still lands in one glance */}
        <div className="pd-steps mx-[8px] mt-[34px] grid grid-cols-1 gap-[13px] md:mx-[13px] md:mt-fib-4 md:grid-cols-2 md:gap-[21px] lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Demo = DEMOS[i];
            return (
              <div key={s.n} data-pstep className="pd-card">
                <Demo />
                <div className="px-fib-1 pb-fib-1 pt-fib-3">
                  <span
                    className="num t-numeral-step relative block select-none"
                    aria-hidden
                  >
                    <span className="num-outline">{s.n}</span>
                    <span className="num-fill">{s.n}</span>
                  </span>
                  <div className="mt-[13px] flex flex-wrap items-center gap-[13px]">
                    <h3 className="t-title t-title--lg">
                      <span className="sr-only">{`Step ${s.n}: `}</span>
                      {s.title}
                    </h3>
                    <span className="chip">{s.meta}</span>
                  </div>
                  <p className="mt-[13px] max-w-[34ch] text-[1.0625rem] leading-[1.55] text-ink/70">
                    {s.copy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="wrap">
          <div className="pd-cta mt-[55px] flex justify-end px-[21px] md:px-[55px]">
            <a href="#estimate" className="u-link text-ink/70">
              Start with the call
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
