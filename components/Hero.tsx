"use client";

// ── DROP SET HERO ─────────────────────────────────────────────────────────
// The work RAINS in: four real client device renders free-fall under real
// gravity and SLAM onto a stacked rack — each overshoots + recoils, the heavy
// front laptop lands hardest and shudders the headline while the result stat
// ticks up. The headline payoff ("Booked solid.") arrives pre-exploded and
// SLAMS onto its baseline like metal type. Then it stays alive: the rack tilts
// toward the cursor, breathes on a slow sway, and lifts on hover.
//
// 100% ON-LOAD ENTRANCE + CONTAINED interactions. No ScrollTrigger, no pin, no
// scrolljack, no clip-path die-cut — the fragile family is gone for good.

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import PillCTA from "./PillCTA";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, SplitText, CustomEase, CustomWiggle, ScrambleTextPlugin);
}

// Drop order = array order (index 0 falls first; the heavy laptop is last). cls
// places each in the rack; `rest` is its settled tilt. File-name spaces are
// URL-encoded so the browser fetches the real renders cleanly.
const DEVICES = [
  { src: "/Rubber%20iPhone%20Mockup.webp", client: "Riled Up", rest: -8, cls: "bottom-[1%] left-[1%] w-[25%] z-40" },
  { src: "/Celestial%20iPhone%20Mockup.webp", client: "Wings N Wheels", rest: 7, cls: "bottom-[13%] right-[3%] w-[24%] z-20" },
  { src: "/Celestial%20Laptop%20Mockup.webp", client: "AZ Gyro Tours", rest: -5, cls: "top-[3%] right-0 w-[60%] z-10" },
  { src: "/Elegant%20Black%20Laptop%20Mockup.webp", client: "Desert Wings", rest: 0, cls: "bottom-[5%] left-[9%] w-[74%] z-30" },
];

export default function Hero({ tagline }: { tagline?: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const q = gsap.utils.selector(root);
      const stage = q("[data-stage]")[0] as HTMLElement;
      const rack = q("[data-rack]")[0] as HTMLElement;
      const devices = gsap.utils.toArray<HTMLElement>(q("[data-device]"));
      const wraps = gsap.utils.toArray<HTMLElement>(q("[data-device-wrap]"));
      const num = q("[data-stat-num]")[0] as HTMLElement;

      // Hide the stage synchronously (useGSAP runs pre-paint) so there's no flash
      // of un-split text or stray devices before the timeline is armed.
      gsap.set(stage, { autoAlpha: 0 });

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const reduce = !ctx.conditions!.motion;

          // ── Reduced motion: just show the final, settled composition ──────
          if (reduce) {
            gsap.set(devices, { y: 0, autoAlpha: 1, rotation: (i) => DEVICES[i].rest });
            if (num) num.textContent = "312";
            gsap.set(stage, { autoAlpha: 1 });
            return;
          }

          // Real-g acceleration (asymmetric) — the load-bearing feel. A hard
          // "type-slam" curve for the headline lockup. A shudder wiggle for impact.
          CustomEase.create("gravity", "M0,0 C0.3,0 0.55,0.3 0.72,0.62 0.85,0.85 0.94,1 1,1");
          CustomEase.create("typeSlam", "M0,0 C0.2,0 0.1,1 0.42,1 0.62,1 0.7,1 1,1");
          CustomWiggle.create("shudder", { wiggles: 6, type: "easeOut" });

          let cleanupAsync = () => {};

          // SplitText must measure with the real font loaded, or it reflows.
          document.fonts.ready.then(() => {
            if (!ref.current) return;

            const riseSplit = new SplitText(q("[data-rise]"), { type: "lines", mask: "lines" });
            const lockSplit = new SplitText(q("[data-lock]"), { type: "chars" });

            // Initial states ----------------------------------------------------
            gsap.set(riseSplit.lines, { yPercent: 115 });
            gsap.set(lockSplit.chars, { yPercent: -190, scale: 1.18, filter: "blur(7px)", autoAlpha: 0 });
            gsap.set(devices, { yPercent: -190, autoAlpha: 0, rotation: (i) => DEVICES[i].rest - 8 });
            gsap.set(q("[data-fade]"), { autoAlpha: 0, y: 14 });
            gsap.set(q("[data-statwrap]"), { autoAlpha: 0, y: 16 });
            gsap.set([q("[data-ground]"), q("[data-underline]"), q("[data-reg]")], { scaleX: 0, transformOrigin: "left center" });

            gsap.set(stage, { autoAlpha: 1 }); // reveal the (still-empty) press sheet

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // 1 — headline LINE 1 rises + overshoots: the page declares it has weight
            tl.to(riseSplit.lines, { yPercent: 0, duration: 0.62, stagger: 0.08, ease: "back.out(1.4)" }, 0.15);
            tl.from(q("[data-eyebrow]"), { y: -18, autoAlpha: 0, duration: 0.4, ease: "back.out(2)" }, 0.2);
            tl.to(q("[data-statwrap]"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.4);

            // 2 — TYPE-LOCK: "Booked solid." slams onto its baseline from above
            tl.to(lockSplit.chars, {
              yPercent: 0, scale: 1, filter: "blur(0px)", autoAlpha: 1,
              duration: 0.5, stagger: { each: 0.02, from: "center" }, ease: "typeSlam",
            }, 0.55);
            tl.to(q("[data-underline]"), { scaleX: 1, duration: 0.32, ease: "power3.inOut" }, "-=0.15");

            // 3 — the four real builds RAIN in, one impact at a time
            const land = (el: HTMLElement, i: number, recoil: number, at: number) => {
              tl.to(el, { yPercent: 0, autoAlpha: 1, rotation: DEVICES[i].rest, duration: 0.56, ease: "gravity" }, at)
                .to(rack, { y: recoil * 0.65, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.out" }, ">")
                .to(el, { y: `+=${recoil}`, duration: 0.09, ease: "power1.in" }, "<")
                .to(el, { y: 0, duration: 0.55, ease: "elastic.out(1, 0.45)" }, ">");
            };
            land(devices[0], 0, 8, 0.98);
            land(devices[1], 1, 10, 1.26);
            land(devices[2], 2, 12, 1.54);

            // 4 — HERO SLAM: the heavy laptop lands hardest; the shockwave shudders
            //     the headline, snaps the ground-line, and fires the stat odometer.
            const heavy = devices[3];
            tl.to(heavy, { yPercent: 0, autoAlpha: 1, rotation: 0, duration: 0.6, ease: "gravity" }, 1.86)
              .to(rack, { y: 14, duration: 0.09, yoyo: true, repeat: 1, ease: "power2.out" }, ">")
              .to(heavy, { y: "+=15", duration: 0.1, ease: "power1.in" }, "<")
              .to(heavy, { y: 0, duration: 0.8, ease: "elastic.out(1, 0.32)" }, ">");

            tl.addLabel("slam", 2.46);
            tl.to(q("[data-head]"), { skewX: 2.4, duration: 0.6, ease: "shudder" }, "slam");
            tl.to(q("[data-ground]"), { scaleX: 1, duration: 0.45, ease: "expo.out" }, "slam");
            const counter = { v: 0 };
            tl.to(counter, {
              v: 312, duration: 0.95, ease: "power2.out",
              onUpdate: () => (num.textContent = String(Math.round(counter.v))),
            }, "slam");

            // 5 — value cluster + registration line settle (the "printed" confirm)
            tl.to(q("[data-fade]"), { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.5 }, 2.55);
            tl.to(q("[data-reg]"), { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 2.7);

            // ── IDLE: stays alive, all contained ─────────────────────────────
            const depth = [22, 18, 12, 26]; // px gain per device (front laptop most)
            const xTos = wraps.map((w) => gsap.quickTo(w, "x", { duration: 0.6, ease: "power3" }));
            const yTos = wraps.map((w) => gsap.quickTo(w, "y", { duration: 0.6, ease: "power3" }));
            const rTos = wraps.map((w) => gsap.quickTo(w, "rotation", { duration: 0.7, ease: "power3" }));
            const onMove = (e: PointerEvent) => {
              const r = root.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;
              wraps.forEach((_, i) => {
                xTos[i](nx * depth[i]);
                yTos[i](ny * depth[i] * 0.6);
                rTos[i](nx * (i === 3 ? 2.4 : 1.4));
              });
            };
            const fine = window.matchMedia("(pointer: fine)").matches;
            if (fine) window.addEventListener("pointermove", onMove);

            // slow pendulum sway so the rack looks like it's still settling
            const sway = gsap.to(rack, { rotation: 0.5, y: "+=3", duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 });

            // hover-heft: pick a device up, dim the rest
            const handlers: Array<[HTMLElement, () => void, () => void]> = [];
            devices.forEach((el, i) => {
              const en = () => {
                gsap.to(el, { y: -8, scale: 1.03, duration: 0.4, ease: "back.out(2)" });
                gsap.to(devices.filter((_, j) => j !== i), { autoAlpha: 0.78, duration: 0.3 });
              };
              const lv = () => {
                gsap.to(el, { y: 0, scale: 1, duration: 0.45, ease: "power2.out" });
                gsap.to(devices, { autoAlpha: 1, duration: 0.3 });
              };
              el.addEventListener("pointerenter", en);
              el.addEventListener("pointerleave", lv);
              handlers.push([el, en, lv]);
            });

            cleanupAsync = () => {
              if (fine) window.removeEventListener("pointermove", onMove);
              sway.kill();
              handlers.forEach(([el, en, lv]) => {
                el.removeEventListener("pointerenter", en);
                el.removeEventListener("pointerleave", lv);
              });
              riseSplit.revert();
              lockSplit.revert();
            };
          });

          return () => cleanupAsync();
        },
      );
    },
    { scope: ref },
  );

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] overflow-hidden bg-ink-deep p-2 md:p-4">
      {/* Warm-paper press sheet — a SIMPLE rounded panel (no die-cut clip-path) */}
      <div className="relative h-[calc(100svh-1rem)] overflow-hidden rounded-[26px] bg-paper md:h-[calc(100svh-2rem)] md:rounded-[34px]">
        <div data-stage className="absolute inset-0">
          {/* top row — wordmark (the floating dock handles nav) */}
          <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
            <span data-fade className="text-sm font-black uppercase tracking-tight text-ink">
              Executive&nbsp;AI
            </span>
          </div>

          {/* ── LEFT: the type ─────────────────────────────────────────────── */}
          <div className="absolute bottom-[7%] left-6 z-30 max-w-[min(33rem,46vw)] md:left-10 lg:bottom-[9%]">
            <p data-eyebrow className="micro mb-5 inline-flex items-center gap-2 text-oxblood">
              <span className="h-1.5 w-1.5 rounded-full bg-oxblood" />
              2 build slots left — July
            </p>

            <h1
              data-head
              aria-label="Websites that get you booked solid"
              className="font-black uppercase leading-[0.86] tracking-[-0.04em] text-ink"
            >
              <span data-rise className="block text-[clamp(2.2rem,4.8vw,4.4rem)]" aria-hidden>
                Websites that get you
              </span>
              <span className="relative mt-1 inline-block">
                <span data-lock className="block whitespace-nowrap text-[clamp(2.8rem,6.2vw,5.4rem)] text-oxblood" aria-hidden>
                  Booked solid.
                </span>
                <span data-underline className="absolute -bottom-1 left-0 h-[5px] w-[64%] rounded-full bg-oxblood md:h-[7px]" />
              </span>
            </h1>

            <p data-fade className="mt-6 max-w-md text-[15px] leading-relaxed text-taupe md:text-base">
              {tagline ?? "Design · SEO · Google Ads — built to turn local searches into booked work."}
            </p>

            <div data-statwrap className="mt-6 flex items-baseline gap-3">
              <span className="font-black leading-none tracking-[-0.04em] text-oxblood text-[clamp(1.9rem,3vw,2.7rem)]">
                +<span data-stat-num>0</span>%
              </span>
              <span className="micro max-w-[12rem] text-taupe">more booked work · avg. client, 90 days</span>
            </div>

            <div data-fade className="mt-7 flex flex-wrap items-center gap-5">
              <PillCTA label="Start a project" href="#contact" />
              <a
                href="#work"
                className="group focus-ring inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-tight text-ink/70 transition-colors hover:text-ink"
              >
                See the work
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── RIGHT: the device rack ─────────────────────────────────────── */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[58%] md:w-[56%]">
            <div data-rack className="relative h-full w-full">
              {DEVICES.map((d) => (
                <div key={d.src} data-device-wrap className={`absolute will-change-transform ${d.cls}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    data-device
                    src={d.src}
                    alt={`${d.client} — built by Executive AI`}
                    loading="eager"
                    draggable={false}
                    className="pointer-events-auto block w-full select-none drop-shadow-[0_30px_60px_rgba(14,13,12,0.32)] will-change-transform"
                  />
                </div>
              ))}
              {/* the shared "shelf" the work lands on */}
              <span data-ground className="absolute bottom-[3%] left-[2%] h-px w-[88%] bg-oxblood/35" />
            </div>
          </div>

          {/* full-width registration / trim line — the "printed in register" mark */}
          <span data-reg className="absolute bottom-[5.5%] left-6 z-20 h-px w-[calc(100%-3rem)] bg-ink/12 md:left-10 md:w-[calc(100%-5rem)]" />
        </div>
      </div>
    </section>
  );
}
