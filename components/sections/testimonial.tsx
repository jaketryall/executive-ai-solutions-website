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

/* Client voices on rotation — the objection-killer before the ask. Auto-
   advances on the showreel's rules (only while in view, pauses on hover and
   hidden tabs), swaps with a roll, and shows a progress bar + clickable
   indexes. With a SINGLE quote in the array it renders static: no bar, no
   indexes, no cycle — so it ships honestly until more clients exist.

   REAL QUOTES NEEDED: every entry below is a visible placeholder. Slot the
   hardest-selling clause of each quote into `highlight` (it renders in the
   steel accent). Extra slots are here so the rotator can be felt — trim to
   the real ones before deploying. */
const QUOTES = [
  {
    lead: "[ Real Desert Wings quote goes here — two or three sentences from the owner, ",
    highlight: "with the hardest-selling clause in this span, ",
    tail: "about working with you and what the site did for the business ]",
    name: "Owner, Desert Wings Flight School",
    meta: "Live client · desertwingsflightschool.com",
  },
  {
    lead: "[ Placeholder slot two — a future client on ",
    highlight: "the result that mattered most to them, ",
    tail: "in their own words ]",
    name: "Future client",
    meta: "Placeholder — remove before deploy",
  },
  {
    lead: "[ Placeholder slot three — shorter quotes work too: ",
    highlight: "one strong sentence ",
    tail: "is plenty ]",
    name: "Future client",
    meta: "Placeholder — remove before deploy",
  },
];

const INTERVAL = 6.5; // seconds per quote

export function Testimonial() {
  const root = useRef<HTMLElement>(null!);
  const idxRef = useRef(0);

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);
      const slides = q(".tst-slide");
      const dots = q(".tst-idx");
      const fill = q(".tst-bar-fill")[0];
      const stack = q(".tst-stack")[0];
      const single = slides.length < 2;

      const mark = (i: number) =>
        dots.forEach((d, j) => d.setAttribute("data-active", String(j === i)));

      if (reducedMotion()) {
        // static rest: first quote; index clicks still swap, instantly
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        slides.forEach((s, j) => gsap.set(s, { autoAlpha: j === 0 ? 1 : 0 }));
        if (fill) gsap.set(fill, { scaleX: 1 });
        dots.forEach((d, j) =>
          d.addEventListener("click", () => {
            slides.forEach((s, k) => gsap.set(s, { autoAlpha: k === j ? 1 : 0 }));
            idxRef.current = j;
            mark(j);
          })
        );
        return;
      }

      // section entrance
      gsap.fromTo(
        q("[data-anim]"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: EASE_STRUCTURE,
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 74%" },
        }
      );

      // slide rest states (slides live inside a [data-anim] wrapper, so the
      // entrance above reveals the stack while these set the deck)
      slides.forEach((s, j) => gsap.set(s, { autoAlpha: j === 0 ? 1 : 0, yPercent: 0 }));

      if (single) return; // one voice: no rotation machinery at all

      // ── the swap: outgoing rolls up, incoming rises from below ──
      const swap = (next: number) => {
        const i = idxRef.current;
        if (next === i) return;
        idxRef.current = next;
        mark(next);
        gsap.timeline({ defaults: { ease: EASE_STRUCTURE, overwrite: "auto" } })
          .to(slides[i], { autoAlpha: 0, yPercent: -21, duration: 0.55 }, 0)
          .fromTo(
            slides[next],
            { autoAlpha: 0, yPercent: 21 },
            { autoAlpha: 1, yPercent: 0, duration: 0.75 },
            0.18
          );
      };

      // ── the clock: progress bar fills over the interval, then advances.
      //    Runs only while in view, the tab is visible, and not hovered. ──
      const bar = gsap.fromTo(
        fill,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: INTERVAL,
          ease: "none",
          paused: true,
          onComplete: () => {
            swap((idxRef.current + 1) % slides.length);
            bar.restart();
          },
        }
      );
      let inView = false;
      let hovered = false;
      const sync = () => {
        if (inView && !hovered && !document.hidden) bar.play();
        else bar.pause();
      };
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          inView = self.isActive;
          sync();
        },
      });
      document.addEventListener("visibilitychange", sync);
      const onEnter = () => {
        hovered = true;
        sync();
      };
      const onLeave = () => {
        hovered = false;
        sync();
      };
      stack.addEventListener("pointerenter", onEnter);
      stack.addEventListener("pointerleave", onLeave);
      context.add(() => () => {
        document.removeEventListener("visibilitychange", sync);
        stack.removeEventListener("pointerenter", onEnter);
        stack.removeEventListener("pointerleave", onLeave);
      });

      // manual index: jump, restart the clock
      dots.forEach((d, j) =>
        d.addEventListener("click", () => {
          swap(j);
          bar.restart();
          sync();
        })
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      data-nav="light"
      aria-label="What our clients say"
      className="relative pb-fib-6 pt-fib-6 md:pb-fib-7 md:pt-fib-7"
    >
      <div className="mx-auto max-w-[1280px] px-fib-3 md:px-fib-5">
        <p data-anim className="t-meta text-ink/60">
          What clients say
        </p>

        {/* the deck — slides overlay; height holds at the tallest quote */}
        <div data-anim className="tst-stack mt-fib-4 md:mt-fib-5">
          {QUOTES.map((t, i) => (
            <figure key={i} className="tst-slide">
              <blockquote className="t-display-lg max-w-[28ch]">
                {t.lead}
                <span className="text-accent">{t.highlight}</span>
                {t.tail}
              </blockquote>
              <figcaption className="mt-fib-4 flex items-center gap-fib-2">
                <span className="flex h-[44px] w-[44px] items-center justify-center overflow-hidden rounded-full bg-ink/6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/work/desert-wings-logo.png" alt="" className="h-[26px] w-[26px] object-contain" />
                </span>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="t-meta mt-[2px] text-ink/60">{t.meta}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* the clock + indexes (only rendered when there's something to rotate) */}
        {QUOTES.length > 1 && (
          <div data-anim className="mt-fib-5 flex items-center gap-fib-4">
            <span className="tst-bar" aria-hidden>
              <span className="tst-bar-fill" />
            </span>
            <div className="t-meta flex items-center gap-fib-3">
              {QUOTES.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  className="tst-idx"
                  data-active={i === 0}
                  aria-label={`Show testimonial ${i + 1}: ${t.name}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
