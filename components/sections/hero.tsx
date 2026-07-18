"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";
import { whenArrived } from "@/components/anim/arrival";

/* The hero — the SearchKings shape (Jake, 2026-07-16): NO mockup here.
   The demos live where the choosing happens — one per service card below,
   one per service-page phone — so the hero is just the claim, the one
   action, the quiet audit path, and the de-risk line. (The old search
   enactment lives in git history at 6ac2517 if it's ever wanted back.)

   The statement keeps the rolling industry mirror: it cycles for organic
   visitors and locks to ?i= for labeled traffic (ads + reopened build links —
   same param the builder reads). Outcome leads, industry follows. */
const ROLL_PAIRS = [
  { out: "More customers", who: "for local business" },
  { out: "More students", who: "for flight schools" },
  { out: "More bookings", who: "for restaurants" },
  { out: "More jobs", who: "for the trades" },
];
const ROLL_LOCK: Record<string, number> = {
  flight: 1,
  restaurant: 2,
  trades: 3,
  other: 0,
};

// layout effect so the ?i= lock commits BEFORE first paint
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Hero() {
  const root = useRef<HTMLElement>(null!);
  const [locked, setLocked] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const i = new URLSearchParams(window.location.search).get("i");
    if (i && ROLL_LOCK[i] !== undefined) setLocked(ROLL_LOCK[i]);
  }, []);

  const ariaPair = ROLL_PAIRS[locked ?? 0];

  useGSAP(
    (context) => {
      const q = gsap.utils.selector(root);
      const navEl = document.querySelector(".site-nav");

      if (reducedMotion()) {
        gsap.set([navEl, ...q("[data-anim]")], { autoAlpha: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        return;
      }

      /* ── Title sequence: the statement is the protagonist; the CTA
         resolves it; the de-risk line lands last. ── */
      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE_STRUCTURE } });
      tl.fromTo(
        navEl,
        { autoAlpha: 0, y: -16 },
        { autoAlpha: 1, y: 0, duration: 0.8, clearProps: "transform" },
        0.05
      )
        // track A — trust crowns first (the SK order), the eyebrow sets
        // the category, the statement rises
        .fromTo(
          q("[data-anim='stars']"),
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE_UI },
          0.05
        )
        .fromTo(
          q("[data-anim='eyebrow']"),
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.16
        )
        .fromTo(
          q("[data-anim='statement']"),
          { autoAlpha: 0, y: 34 },
          { autoAlpha: 1, y: 0, duration: 1.0, stagger: 0.12 },
          0.22
        );


      tl
        // the resolve — the sequence lands on the one action
        .fromTo(
          q("[data-anim='ctas']"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE_UI },
          0.8
        )
        // the ambient layer wakes last, already drifting
        .fromTo(
          q("[data-anim='marquee']"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6, ease: EASE_UI },
          1.05
        );

      // fonts measurable AND the route-transition sheet landed
      Promise.all([document.fonts.ready, whenArrived()]).then(() => {
        if (!root.current) return;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            tl.play();
            ScrollTrigger.refresh();
          })
        );
      });

      /* ── the rolling industry mirror — the hero's one living element.
         Organic visitors see the outcome line cycle through industries;
         ?i= traffic stays locked to its own. Governed: in-view + visible
         tab only, and the h1 height is locked to the longest pair so the
         CTA row never jumps. ── */
      if (locked === null) {
        const out = q("[data-roll-out]")[0] as HTMLElement;
        const who = q("[data-roll-who]")[0] as HTMLElement;
        const h1 = q("[data-anim='statement']")[0] as HTMLElement;
        if (out && who && h1) {
          // pair 0 is the longest — lock its height so the CTA never
          // jumps between pairs. Lock AFTER fonts land: measuring the
          // fallback font baked a ~3-line min-height into a 2-line h1
          // and left a phantom gap under the claim (Jake: "spacing in
          // hero looks goofy", 2026-07-17)
          document.fonts.ready.then(() => {
            if (root.current) h1.style.minHeight = `${h1.offsetHeight}px`;
          });
          let idx = 0;
          const roll = gsap.timeline({ repeat: -1, paused: true });
          roll
            .to({}, { duration: 3.8 })
            .to([out, who], {
              yPercent: -55,
              autoAlpha: 0,
              duration: 0.4,
              ease: EASE_UI,
              stagger: 0.06,
            })
            .call(() => {
              idx = (idx + 1) % ROLL_PAIRS.length;
              out.textContent = ROLL_PAIRS[idx].out;
              who.textContent = `${ROLL_PAIRS[idx].who}.`;
            })
            .fromTo(
              [out, who],
              { yPercent: 55, autoAlpha: 0 },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 0.5,
                ease: EASE_UI,
                stagger: 0.06,
                /* THE ROLL BUG (found 2026-07-17): default immediateRender
                   parked the spans at this from-state AT CREATION, the
                   fade-out then captured that as its start, and every
                   repeat-rewind restored it — so the 3.8s hold played
                   INVISIBLE and the pair only flashed ~0.6s per cycle. */
                immediateRender: false,
              }
            );
          const sync = () => {
            const st = ScrollTrigger.getById("hero-roll");
            const on = (st?.isActive ?? true) && !document.hidden;
            (on ? roll.play() : roll.pause());
          };
          ScrollTrigger.create({
            id: "hero-roll",
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            onToggle: sync,
          });
          document.addEventListener("visibilitychange", sync);
          context.add(() => () =>
            document.removeEventListener("visibilitychange", sync)
          );
          sync();
        }
      }

      /* ── exit parallax (not a pin): the statement lifts slightly faster
         than the scroll as the hero leaves ── */
      gsap.to(q(".hero-left"), {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root, dependencies: [locked], revertOnUpdate: true }
  );

  return (
    // WHITE ground (Jake, 2026-07-17): the hero sits on pure white so the
    // audit section's warm-gray band below reads as a visible chapter line
    // right at the fold — the ground change announces "there's more"
    <section id="top" ref={root} className="hero relative bg-white">
      {/* the SearchKings hero: CENTERED — claim, one action, the quiet
          audit path, the de-risk line. No mockup; the services cards
          directly below carry the demos. */}
      {/* TIGHT well (Hormozi shape, Jake 2026-07-17): the hero deliberately
          does NOT fill the viewport — the audit's "free" headline crests
          the fold below it, and curiosity earns the scroll for free */}
      {/* md:pt 144 (was 89): the stars row sat ~15px under the nav capsule
          (Jake: "content is really close to nav bar") — the capsule bottoms
          at ~81, so 144 gives the crown real air */}
      <div className="hero-in wrap relative z-10 flex min-h-[60svh] flex-col items-center justify-center pb-fib-4 pt-[120px] text-center md:pt-fib-7">
        {/* ── the SearchKings stack, our true content (Jake, 2026-07-16):
            trust → outcome → how → incentives. Their stars/badges are
            earned marks we don't hold, so every trust beat here is a
            checkable fact instead: place in the eyebrow, real surfaces
            in the marks row, real terms in the chips. ── */}
        {/* w-full: without it this column sizes to the marquee track's
            max-content width and drags the whole page into horizontal
            overflow — the clamp is what lets .hero-marquee clip */}
        <div className="hero-left flex w-full flex-col items-center">
          {/* the trust crown (Jake's SK decode: stars first) — REAL reviews,
              all five-star; the count is deliberately unstated until it's
              a number worth printing. No volume implied. */}
          <div
            data-anim="stars"
            className="flex items-center gap-fib-1"
            aria-label="Rated 5.0 by our clients"
          >
            {/* the pile — PLACEHOLDER initials until Jake's three real
                client photos land (he's collecting them, 2026-07-17).
                Swap: replace each span with <img src="/work/face-N.jpg">.
                NEVER ship stock faces. */}
            <span className="hero-pile" aria-hidden>
              <span>DW</span>
              <span>MR</span>
              <span>JT</span>
            </span>
            <span className="hero-stars" aria-hidden>
              {[0, 1, 2, 3, 4].map((s) => (
                <svg key={s} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.8L10 1.5z" />
                </svg>
              ))}
            </span>
            <span className="t-meta text-ink/70" aria-hidden>
              5.0 from our clients
            </span>
          </div>
          <p data-anim="eyebrow" className="t-meta mt-fib-2 uppercase text-ink/70">
            Full-funnel ads agency &middot; Mesa, AZ
          </p>
          {/* the two-tone statement (the signature): bright outcome, dim
              continuation IN the same sentence. The dim clause stays five
              words — that's what lets the whole thing hold display size
              without reading as a wall (the eyebrow + the ad demo carry the
              specifics) */}
          <h1
            data-anim="statement"
            className="t-statement t-statement--hero mx-auto mt-fib-2"
            aria-label={`${ariaPair.out} ${ariaPair.who}. We run the whole click.`}
          >
            {/* ALWAYS TWO LINES (Jake, 2026-07-17): the rolling sentence
                owns line one (nowrap from lg — the longest pair clears the
                column there), the accent clause owns line two. Below lg it
                wraps naturally. The visual text swaps on the roll; the
                aria-label is the stable sentence screen readers get. */}
            <span aria-hidden>
              <span className="block text-ink lg:whitespace-nowrap">
                <span data-roll-out className="inline-block">
                  {ariaPair.out}
                </span>{" "}
                <span data-roll-who className="inline-block">
                  {ariaPair.who}.
                </span>
              </span>
              {/* the two-tone goes SearchKings: the second clause wears the
                  click color instead of a dim — accent IS the click */}
              <span className="block text-accent">
                We run the whole click.
              </span>
            </span>
          </h1>

          {/* the one action (the Hormozi shape, Jake 2026-07-17): powerful
              heading, ONE loud CTA, nothing else to read — the audit's
              "free" headline peeks below and earns the scroll. Lede and
              chips cut same day ("i dont think we need the sub heading…
              get rid of the little pills"). */}
          <div data-anim="ctas" className="mt-fib-4">
            <CTA href="/pricing#estimate" label="Price my project" tone="accent" />
          </div>

          {/* the marquee (Jake's logo-marquee instinct, in motion): the
              real surfaces we put clients on, drifting at ambient speed —
              the hero's one perpetual layer. FOUR sets: a -50% loop is
              only seamless when each HALF of the track outspans the
              visible window (1290px) — two 752px sets ran dry on the
              right ("gets smaller", Jake). Edges feathered by mask. */}
          <div data-anim="marquee" className="hero-marquee mt-fib-5" aria-hidden>
            <div className="hero-marquee-track">
              {[0, 1, 2, 3].map((set) => (
                <span key={set} className="hero-marquee-set">
                  {[
                    "Google",
                    "Google Maps",
                    "Google Guaranteed",
                    "ChatGPT",
                    "AI Overviews",
                  ].map((m) => (
                    <span key={m} className="hm-item">
                      {m}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
