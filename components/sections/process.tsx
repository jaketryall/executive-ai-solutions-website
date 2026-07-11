"use client";

import { useRef } from "react";
import {
  gsap,
  ScrollTrigger,
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
      <div className="pd-ticket w-[min(82%,270px)] rounded-[13px] bg-ink p-[21px] text-paper shadow-[0_16px_44px_-16px_rgba(19,20,19,0.45)]">
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

// 02 · the mini page — sketch blocks resolve into the brand
function DemoDesign() {
  return (
    <div className="pd-panel pd-panel--browser" data-built="">
      <span className="browser-chrome">
        <Monogram className="h-[12px] w-[12px] opacity-70" />
        <span className="text-trim">sunlineandco.com</span>
      </span>
      <div className="flex min-h-0 flex-1 flex-col gap-[10px] p-[16px] pt-[4px]">
        <div data-blk className="flex items-center justify-between">
          <span className="st-word px-[2px] text-[11.5px] font-[700]">
            Sunline &amp; Co
          </span>
          <span className="flex items-center gap-[7px]">
            <span className="st-fill h-[6px] w-[20px]" />
            <span className="st-fill h-[6px] w-[20px]" />
            <span className="st-fill h-[6px] w-[20px]" />
          </span>
        </div>
        <div
          data-blk
          className="st-hero flex min-h-0 flex-1 items-center gap-[13px] p-[13px]"
        >
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[8px]">
            <span className="st-word px-[2px] font-display text-[13px] font-[700] leading-[1.2] tracking-[-0.01em]">
              Built to bring in work
            </span>
            <span className="st-fill h-[6px] w-[72%]" />
            <span className="st-btn mt-[3px]">Get a quote</span>
          </div>
          <span className="st-himg h-[74%] w-[30%] rounded-[7px]" />
        </div>
        <div data-blk className="grid grid-cols-2 gap-[10px]">
          {[0, 1].map((c) => (
            <div
              key={c}
              className="st-card flex flex-col gap-[6px] rounded-[7px] p-[8px]"
            >
              <span className="st-thumb h-[26px]" />
              <span className="st-fill h-[5px] w-[75%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 03 · the build report — scores climb to 100
function DemoBuild() {
  return (
    <div className="pd-panel">
      <div className="pd-report w-[min(88%,290px)] rounded-[13px] bg-ink p-[18px] text-paper shadow-[0_16px_44px_-16px_rgba(19,20,19,0.45)]">
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
      <div className="pd-chart w-[min(78%,240px)] rounded-[13px] bg-ink p-[18px] text-paper shadow-[0_16px_44px_-16px_rgba(19,20,19,0.45)]">
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

      /* ── the dark room — the page canvas dips to dark for this chapter
         (Lando-style full-bg swap). No pin anymore, so the section's own
         geometry is honest at both seams. ── */
      const rootStyle = getComputedStyle(document.documentElement);
      const CANVAS = rootStyle.getPropertyValue("--color-canvas").trim();
      const DARK = rootStyle.getPropertyValue("--color-dark").trim();
      const ground = document.querySelector("main");

      if (reducedMotion()) {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 60%",
          end: "bottom 12%",
          onToggle: (self) => {
            if (ground)
              (ground as HTMLElement).style.backgroundColor = self.isActive ? DARK : "";
          },
        });
        // clean end-state: four finished artifacts in one frame
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        return;
      }

      /* ONE writer owns the ground color: thresholds flip a boolean state,
         one 0.8s fade executes it. */
      let roomOn = false;
      const setRoom = (on: boolean, instant = false) => {
        if (roomOn === on) return;
        roomOn = on;
        const backgroundColor = on ? DARK : CANVAS;
        if (instant) gsap.set(ground, { backgroundColor });
        else
          gsap.to(ground, {
            backgroundColor,
            duration: 0.8,
            ease: EASE_UI,
            overwrite: "auto",
          });
      };
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 60%",
        end: "bottom 12%",
        onToggle: (self) => setRoom(self.isActive),
        onRefresh: (self) => setRoom(self.isActive, true),
      });

      /* ── the four demos: each step animates its OWN artifact once, as its
         column lands. Rest states are "finished", so JS rewinds them first. ── */
      const ticket = q(".pd-ticket")[0];
      const browser = q(".pd-panel--browser")[0] as HTMLElement | undefined;
      const blocks = q(".pd-panel--browser [data-blk]");
      const scoreBars = q(".pd-report .sc-fill");
      const perfNum = q(".st-perf")[0];
      const seoNum = q(".st-seo")[0];
      const count = q(".st-count")[0];
      const dot = q(".st-dot")[0];
      const line = q(".st-line")[0] as unknown as SVGPathElement | undefined;
      const lineLen = line ? line.getTotalLength() : 0;

      // rewind to "not yet"
      if (ticket) gsap.set(ticket, { autoAlpha: 0 });
      if (browser) browser.removeAttribute("data-built");
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
        tl.to(
          blocks,
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.09 },
          at
        ).add(() => browser?.setAttribute("data-built", ""), at + 0.85);
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
      const cta = q(".pd-cta")[0];

      const mm = gsap.matchMedia();

      /* ── desktop: the GUIDED build, no pin (Jake: no scroll-jack) — the
         same L→R sequence scrubbed to the section's NATURAL travel through
         the viewport: steps arrive one at a time as the row rises, each
         staying as the next lands, and the scroll never gets captured.
         Scrolling back rewinds the build — guided both ways. ── */
      mm.add("(min-width: 821px)", () => {
        const tl = gsap.timeline({
          defaults: { ease: EASE_STRUCTURE, overwrite: "auto" },
          scrollTrigger: {
            trigger: q(".pd-steps")[0],
            start: "top 94%",
            end: "top 22%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });
        steps.forEach((el, i) => {
          const at = i * 1.9;
          tl.fromTo(
            el,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            at
          );
          const f = fills[i];
          if (f)
            tl.fromTo(
              f,
              { clipPath: "inset(100% 0 0 0)" },
              { clipPath: "inset(0% 0 0 0)", duration: 0.5 },
              at + 0.45
            );
          players[i](tl, at + 0.7);
        });
        if (cta)
          tl.fromTo(
            cta,
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.6 },
            steps.length * 1.9 - 0.4
          );
        tl.to({}, { duration: 0.9 }); // the settle — the full path holds before release
      });

      /* ── narrow screens: steps stack, each reveals + plays on its own ── */
      mm.add("(max-width: 820px)", () => {
        steps.forEach((el, i) => {
          const tl = gsap.timeline({
            defaults: { ease: EASE_STRUCTURE, overwrite: "auto" },
            scrollTrigger: { trigger: el, start: "top 78%", once: true },
          });
          tl.fromTo(el, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0);
          const f = fills[i];
          if (f)
            tl.fromTo(
              f,
              { clipPath: "inset(100% 0 0 0)" },
              { clipPath: "inset(0% 0 0 0)", duration: 0.5 },
              0.2
            );
          players[i](tl, 0.3);
        });
        if (cta)
          gsap.fromTo(
            cta,
            { autoAlpha: 0, y: 13 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: EASE_STRUCTURE,
              scrollTrigger: { trigger: cta, start: "top 88%", once: true },
            }
          );
      });
    },
    { scope: root }
  );

  return (
    <section
      id="process"
      ref={root}
      data-nav="dark"
      className="zone-dark relative z-0 text-paper"
    >
      <div className="wrap py-fib-6">
        <div>
          <h2 className="t-display-lg">How a project runs</h2>
          <p className="mt-[13px] max-w-[44ch] text-paper/70">
            Four steps from first call to a site that earns. Fixed quote up
            front, no surprises after.
          </p>
        </div>

        {/* the whole path, visible at once — four steps, each with its own
            little artifact. The row steps down toward the handoff. */}
        <div className="pd-steps mt-[34px] grid grid-cols-1 gap-y-[55px] md:mt-fib-4 md:grid-cols-2 md:gap-x-[21px] md:gap-y-[68px] lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Demo = DEMOS[i];
            return (
              <div key={s.n} data-pstep data-anim>
                <Demo />
                <div className="mt-[21px]">
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
                  <p className="mt-[13px] max-w-[34ch] text-[1.0625rem] leading-[1.55] text-paper/75">
                    {s.copy}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pd-cta mt-[55px] flex justify-end px-[21px] md:px-[55px]" data-anim>
          <a href="#estimate" className="u-link text-paper/80">
            Start with the call
          </a>
        </div>
      </div>
    </section>
  );
}
