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

export function Process() {
  const root = useRef<HTMLElement>(null!);
  const state = useRef(-1);
  const stateTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const frame = q(".stage-frame")[0] as HTMLElement | undefined;
      if (!frame) return;

      const mini = q(".st-mini");
      const blocks = q(".st-mini [data-blk]");
      const quote = q(".st-quote");
      const score = q(".st-score");
      const scoreBars = q(".st-score .sc-fill");
      const perfNum = q(".st-perf")[0];
      const seoNum = q(".st-seo")[0];
      const chart = q(".st-chart");
      const count = q(".st-count")[0];
      const dot = q(".st-dot")[0];
      const line = q(".st-line")[0] as unknown as SVGPathElement | undefined;
      const lineLen = line ? line.getTotalLength() : 0;

      if (reducedMotion()) {
        // clean end-state: the finished, earning site in one frame
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        q(".num-fill").forEach((el) => gsap.set(el, { clipPath: "inset(0% 0 0 0)" }));
        frame.setAttribute("data-built", "");
        gsap.set(mini, { autoAlpha: 1, y: 0 });
        gsap.set(blocks, { autoAlpha: 1, y: 0 });
        gsap.set(scoreBars, { scaleX: 1 });
        return; // CSS rests quote+score hidden, chart+chart-line shown
      }

      if (line) gsap.set(line, { strokeDasharray: lineLen, strokeDashoffset: lineLen });

      /* the state machine — each step scrolls the demo to a distinct LENS on
         the same browser: blank+quote · painted design · build report · growth.
         Every state writes ABSOLUTE targets so fast scrolling converges. */
      const setStage = (next: number) => {
        const prev = state.current;
        if (next === prev) return;
        const fwd = next > prev;
        state.current = next;
        stateTl.current?.kill();
        const tl = gsap.timeline({
          defaults: { ease: EASE_STRUCTURE, overwrite: "auto" },
        });
        stateTl.current = tl;

        // the underlying page: sketch (0) vs painted brand (>=1)
        if (next === 0) frame.removeAttribute("data-built");
        else frame.setAttribute("data-built", "");

        // page visibility
        if (next === 0) tl.to(mini, { autoAlpha: 0, y: 13, duration: 0.4 }, 0);
        else tl.set(mini, { autoAlpha: 1, y: 0 }, 0);

        // retract the overlays that don't belong to this state
        if (next !== 0) tl.to(quote, { autoAlpha: 0, y: -13, duration: 0.35 }, 0);
        if (next !== 2)
          tl.to(score, { autoAlpha: 0, y: next < 2 ? 13 : -13, duration: 0.3 }, 0);
        if (next !== 3) tl.to(chart, { autoAlpha: 0, y: 13, duration: 0.3 }, 0);

        // 01 · the call — empty browser, the quote ticket lands
        if (next === 0) {
          tl.fromTo(
            quote,
            { autoAlpha: 0, y: 21, scale: 0.95 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 },
            0.2
          );
          return;
        }

        // 02 · the design — sketch blocks stagger in, then paint into the brand
        if (next === 1) {
          if (fwd) {
            frame.removeAttribute("data-built");
            tl.fromTo(
              blocks,
              { autoAlpha: 0, y: 13 },
              { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.1 },
              0.2
            ).add(() => frame.setAttribute("data-built", ""), "+=0.35");
          } else {
            tl.set(blocks, { autoAlpha: 1, y: 0 }, 0);
          }
          return;
        }

        tl.set(blocks, { autoAlpha: 1, y: 0 }, 0);

        // 03 · the build — a build report: scores climb to 100, bars fill
        if (next === 2) {
          tl.fromTo(
            score,
            { autoAlpha: 0, y: 21, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 },
            0.1
          );
          if (fwd) {
            tl.fromTo(
              scoreBars,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.9, stagger: 0.08 },
              0.25
            );
            if (perfNum) {
              const o = { v: 0 };
              tl.to(
                o,
                {
                  v: 100,
                  duration: 1.0,
                  onUpdate: () => (perfNum.textContent = String(Math.round(o.v))),
                },
                0.25
              );
            }
            if (seoNum) {
              const o = { v: 0 };
              tl.to(
                o,
                {
                  v: 100,
                  duration: 1.05,
                  onUpdate: () => (seoNum.textContent = String(Math.round(o.v))),
                },
                0.3
              );
            }
          } else {
            tl.set(scoreBars, { scaleX: 1 }, 0);
            if (perfNum) perfNum.textContent = "100";
            if (seoNum) seoNum.textContent = "100";
          }
          return;
        }

        // 04 · the growth — the enquiries card, line drawing, number climbing
        tl.fromTo(
          chart,
          { autoAlpha: 0, y: 21, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.6 },
          0
        );
        if (line) {
          tl.fromTo(
            line,
            { strokeDashoffset: lineLen },
            { strokeDashoffset: 0, duration: 1.1 },
            0.25
          );
        }
        if (dot) {
          tl.fromTo(
            dot,
            { scale: 0, transformOrigin: "center" },
            { scale: 1, duration: 0.4, ease: EASE_UI },
            "-=0.2"
          );
        }
        if (count) {
          const o = { v: 0 };
          tl.to(
            o,
            {
              v: 34,
              duration: 1.2,
              onUpdate: () => (count.textContent = String(Math.round(o.v))),
            },
            0.3
          );
        }
      };

      // the stage arrives as a settled panel
      gsap.fromTo(
        frame,
        { autoAlpha: 0, y: 34, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 72%" },
          onComplete() {
            gsap.set(this.targets(), { clearProps: "transform" });
          },
        }
      );

      const steps = q("[data-step]");
      const bodies = q("[data-step-body]");
      gsap.set(bodies, { opacity: 0.45 });

      const activate = (i: number) => {
        setStage(i);
        bodies.forEach((b, j) =>
          gsap.to(b, {
            opacity: j === i ? 1 : 0.45,
            duration: 0.45,
            ease: EASE_UI,
            overwrite: "auto",
          })
        );
      };

      steps.forEach((el, i) => {
        gsap.fromTo(
          el.querySelectorAll("[data-anim]"),
          { autoAlpha: 0, y: 21 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: EASE_STRUCTURE,
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "top 76%" },
          }
        );

        const fillEl = el.querySelector(".num-fill");
        if (fillEl) {
          gsap.fromTo(
            fillEl,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top 70%",
                end: "top 34%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        ScrollTrigger.create({
          trigger: el,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (self) => self.isActive && activate(i),
        });
      });

      requestAnimationFrame(() => {
        if (state.current === -1) activate(0);
      });
    },
    { scope: root }
  );

  return (
    <section
      id="process"
      ref={root}
      data-nav="light"
      className="relative z-0 pb-[89px] pt-[89px] md:pb-[144px] md:pt-[144px]"
    >
      <div className="mx-auto max-w-[1280px] px-[21px] md:px-[55px]">
        <h2 className="t-display-lg max-w-[16ch]">How a project runs</h2>
        <p className="mt-[13px] max-w-[44ch] text-ink/70">
          Four steps from first call to a site that earns. Watch one get built
          as you scroll.
        </p>
      </div>

      {/* stage LEFT, words RIGHT — the demo grabs the eye first, and the LTR
          reading sweep then lands on the step copy instead of fighting it
          (words-left/motion-right made every stage change yank attention away
          from the text) */}
      <div className="mx-auto mt-[34px] max-w-[1280px] px-[21px] md:mt-[55px] md:grid md:grid-cols-[1.15fr_minmax(300px,0.85fr)] md:items-start md:gap-x-[89px] md:px-[55px]">
        {/* ── the stage: a browser that builds itself (sticky both breakpoints) ── */}
        <div className="sticky top-[76px] z-10 md:col-start-1 md:row-start-1 md:top-[121px]">
          <div className="stage-frame" data-built="" data-anim>
            <span className="browser-chrome">
              <Monogram className="h-[13px] w-[13px] opacity-70" />
              <span className="text-trim">sunlineandco.com</span>
            </span>

            <div className="st-canvas">
              {/* the mini client site */}
              <div className="st-mini flex h-full flex-col gap-[10px] md:gap-[16px]">
                <div data-blk className="flex items-center justify-between">
                  <span className="st-word px-[2px] text-[12px] font-[700] md:text-[13px]">
                    Sunline &amp; Co
                  </span>
                  <span className="flex items-center gap-[8px]">
                    <span className="st-fill h-[7px] w-[24px]" />
                    <span className="st-fill h-[7px] w-[24px]" />
                    <span className="st-fill h-[7px] w-[24px]" />
                  </span>
                </div>

                <div
                  data-blk
                  className="st-hero flex flex-1 items-center gap-[13px] p-[13px] md:gap-[21px] md:p-[21px]"
                >
                  <div className="flex flex-1 flex-col items-start gap-[9px] md:gap-[12px]">
                    <span className="st-word px-[2px] font-display text-[15px] font-[700] tracking-[-0.01em] md:text-[19px]">
                      Built to bring in work
                    </span>
                    <span className="st-fill h-[8px] w-[72%]" />
                    <span className="st-btn mt-[4px]">Get a quote</span>
                  </div>
                  <span className="st-himg h-[76%] w-[32%] rounded-[8px]" />
                </div>

                <div data-blk className="grid grid-cols-3 gap-[8px] md:gap-[13px]">
                  {[0, 1, 2].map((c) => (
                    <div
                      key={c}
                      className="st-card flex flex-col gap-[6px] rounded-[8px] p-[8px] md:p-[10px]"
                    >
                      <span className="st-thumb h-[30px] md:h-[44px]" />
                      <span className="st-fill h-[6px] w-[80%]" />
                      <span className="st-fill h-[6px] w-[55%]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 01 · the quote ticket */}
              <div className="st-quote absolute inset-0 z-10 grid place-items-center p-[21px]">
                <div className="w-[min(78%,290px)] rounded-[14px] bg-ink p-[18px] text-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] md:p-[24px]">
                  <Monogram className="h-[14px] w-[14px] opacity-80" />
                  <p className="mt-[10px] text-[12px] text-paper/60 md:text-[13px]">
                    Your fixed quote
                  </p>
                  <p className="t-num mt-[2px] font-display text-[24px] font-[800] leading-none md:text-[30px]">
                    From $2,500
                  </p>
                  <p className="mt-[8px] text-[11px] leading-[1.45] text-paper/60 md:text-[12px]">
                    In your inbox within two days.
                  </p>
                </div>
              </div>

              {/* 03 · the build report */}
              <div className="st-score absolute bottom-[10px] left-[10px] z-20 w-[min(70%,300px)] rounded-[12px] bg-ink p-[14px] text-paper shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)] md:bottom-[13px] md:left-[13px] md:p-[16px]">
                <p className="t-meta text-paper/55">Build report</p>
                <div className="mt-[11px] flex flex-col gap-[9px] md:gap-[11px]">
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

              {/* 04 · the growth card — paper so it pops on both the ink hero
                  and the light cards row it straddles */}
              <div className="st-chart absolute bottom-[10px] right-[10px] z-20 w-[min(48%,205px)] rounded-[12px] bg-paper p-[13px] text-ink shadow-[0_24px_60px_-18px_rgba(19,20,19,0.45)] md:bottom-[13px] md:right-[13px] md:p-[16px]">
                <p className="t-meta text-ink/55">Enquiries</p>
                <p className="mt-[3px] font-display text-[24px] font-[800] leading-none md:text-[28px]">
                  <span className="st-count t-num">34</span>
                </p>
                <svg
                  className="mt-[8px] w-full"
                  viewBox="0 0 130 40"
                  fill="none"
                  aria-hidden
                >
                  <path
                    className="st-line"
                    d="M3 35 L20 30 L37 31.5 L54 24 L71 26 L88 16 L105 18.5 L124 6"
                    stroke="var(--color-accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    className="st-dot"
                    cx="124"
                    cy="6"
                    r="3.5"
                    fill="var(--color-accent)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── the steps (numeral index; the in-view step drives the stage) ── */}
        <div className="mt-[34px] flex flex-col md:col-start-2 md:row-start-1 md:mt-0">
          {STEPS.map((s) => (
            <div
              key={s.n}
              data-step
              className="flex min-h-[52svh] flex-col justify-center py-[34px] md:min-h-[68vh]"
            >
              <span
                className="num t-numeral relative block select-none leading-[0.8]"
                aria-hidden
              >
                <span className="num-outline">{s.n}</span>
                <span className="num-fill">{s.n}</span>
              </span>
              <div data-step-body className="mt-[21px] md:mt-[34px]">
                <div data-anim className="flex flex-wrap items-center gap-[13px]">
                  <h3 className="t-title">
                    <span className="sr-only">{`Step ${s.n}: `}</span>
                    {s.title}
                  </h3>
                  <span className="chip">{s.meta}</span>
                </div>
                <p data-anim className="mt-[13px] max-w-[42ch] text-ink/75">
                  {s.copy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
