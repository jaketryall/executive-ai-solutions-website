"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";
import { ArtifactFrame } from "@/components/ui/artifact";

/* ═══ PLACEHOLDER TRACKING LIST — swap before launch ═══
   1. METRICS.value ×3 below (obviously-round placeholders, not real data)
   2. QUOTE.text + permission from the owner
   The SERP listing, the browser-frame pages, and the ad card docked above
   are real Desert Wings surfaces from day one. ═══ */

const METRICS = [
  /* PLACEHOLDER — swap with real Desert Wings data */
  { value: "3x", label: "more discovery-flight bookings" },
  { value: "$38", label: "cost per lead" },
  { value: "90", label: "days to get there" },
];

/* PLACEHOLDER — swap with the real owner quote (with permission) */
const QUOTE = {
  text: "The phone started ringing the week the ads went live, and the new site actually books people instead of just looking good.",
  name: "Owner, Desert Wings Flight School",
};

/* The proof — the click, landed. Split/two-zone: the river (left 62) plays
   the funnel top-to-bottom (SERP context → the flagship landing page at 2x →
   supports + numbers), while the right zone (38) anchors under the hero's
   docked ad card — the card physically straddles the hero→proof seam, so the
   ad you watched assemble is the object this case study hangs off. */
export function Proof() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      /* two-mass clip-reveal: the flagship is heavier (starts closer, lands
         slower); the supports snap in faster */
      gsap.fromTo(
        q("[data-anim='flagship']"),
        { autoAlpha: 0, scale: 0.96, y: 34 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 1.15,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
        }
      );
      gsap.fromTo(
        q("[data-anim='support']"),
        { autoAlpha: 0, scale: 0.94, y: 21 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          stagger: 0.12,
          scrollTrigger: { trigger: root.current, start: "top 62%", once: true },
        }
      );
      gsap.fromTo(
        q("[data-anim='zone']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          scrollTrigger: { trigger: root.current, start: "top 68%", once: true },
        }
      );

      /* the river drifts at distinct rates against the sticky zone (the
         flagship slowest — mass); scrubbed, contained by the section */
      (q("[data-drift]") as HTMLElement[]).forEach((el) => {
        gsap.to(el, {
          yPercent: parseFloat(el.dataset.drift || "0"),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="proof" ref={root} className="relative">
      <div className="wrap grid gap-fib-5 pb-fib-6 pt-fib-4 md:grid-cols-[62fr_38fr]">
        {/* ── the river (left 62): the funnel, top to bottom ── */}
        <div className="flex min-w-0 flex-col gap-fib-5">
          <header data-anim="support" className="max-w-[46ch]">
            <h2 className="t-display-lg">The whole click, working</h2>
            <p className="mt-fib-3 text-ink/70">
              Desert Wings Flight School runs on our ads, our site, and our
              tracking. Search for them and you land on work you are looking
              at right now.
            </p>
          </header>

          {/* 1 · the click — their live listing (real) */}
          <div data-anim="support" data-drift="-2" className="w-[min(100%,420px)]">
            <ArtifactFrame
              variant="card"
              tone="paper"
              label="Desert Wings Flight School's live Google listing"
            >
              <div className="g-ad mt-0! border-t-0! pt-0!">
                <p className="g-url">desertwingsflightschool.com</p>
                <p className="g-title">Flight Training in Mesa, AZ | Desert Wings Flight School</p>
                <p className="g-desc">
                  Career-pilot training at Falcon Field, Mesa AZ. PPL through
                  CFI on a single path.
                </p>
                <p className="mt-fib-2 t-meta text-ink/50">Their live listing on Google</p>
              </div>
            </ArtifactFrame>
          </div>

          {/* 2 · the landing — the FLAGSHIP at full river width, bleeding
              fib-34 into the gutter */}
          <div data-anim="flagship" data-drift="-5" className="md:-mr-fib-4">
            <ArtifactFrame
              variant="chrome"
              tone="ink"
              url="desertwingsflightschool.com/fleet"
              label="The Desert Wings fleet page we designed and built"
              bodyClassName="p-0! pt-0!"
            >
              <div className="overflow-hidden rounded-[10px]">
                <Image
                  src="/work/desert-wings-fleet.png"
                  alt="The custom fleet page built for Desert Wings Flight School"
                  width={1440}
                  height={810}
                  sizes="(min-width: 821px) 58vw, 92vw"
                  className="block h-auto w-full"
                />
              </div>
            </ArtifactFrame>
          </div>

          {/* 3 · the results — the tracking report, framed as the artifact it
              is (PLACEHOLDER values, see top) */}
          <div data-anim="support" data-drift="-3" className="md:-mr-fib-4">
            <ArtifactFrame
              variant="card"
              tone="ink"
              label="Results from the ads dashboard (placeholder values)"
              bodyClassName="p-fib-4!"
            >
              <p className="t-meta text-paper/50">From their ads dashboard</p>
              <div className="mt-fib-3 grid gap-fib-3 sm:grid-cols-3">
                {METRICS.map((m) => (
                  <div key={m.label} className="min-w-0">
                    <p className="t-num font-display text-[clamp(2.4rem,4vw,3.6rem)] font-extrabold leading-none tracking-[-0.03em] text-paper">
                      {m.value}
                    </p>
                    <p className="mt-fib-1 text-[0.9375rem] leading-[1.4] text-paper/60">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </ArtifactFrame>
          </div>

          <a
            data-anim="support"
            href="/work"
            className="u-link t-meta self-start"
          >
            See all work
          </a>
        </div>

        {/* ── the anchor zone (right 38, sticky): the docked ad card from the
            hero physically overhangs into this column's top; the meta hangs
            off it. pt reserves the card's landing depth. ── */}
        <aside
          data-anim="zone"
          className="relative md:pt-fib-5"
        >
          <div className="md:sticky md:top-[110px]">
            {/* the case ticket — one grounded surface under the docked card */}
            <div className="rounded-panel bg-panel/70 p-fib-4">
              <div className="flex flex-col gap-fib-1 text-[0.9375rem]">
                <p className="flex justify-between gap-fib-3">
                  <span className="text-ink/50">Client</span>
                  <span className="text-right font-medium">Desert Wings Flight School</span>
                </p>
                <p className="flex justify-between gap-fib-3">
                  <span className="text-ink/50">Sector</span>
                  <span className="text-right font-medium">Flight training, Mesa AZ</span>
                </p>
                <p className="flex justify-between gap-fib-3">
                  <span className="text-ink/50">Engagement</span>
                  <span className="text-right font-medium">Ads, site, tracking</span>
                </p>
              </div>

              {/* PLACEHOLDER quote — swap with the real one before launch */}
              <blockquote className="mt-fib-4">
                <p className="text-[1.125rem] leading-[1.55] text-ink/80">
                  &ldquo;{QUOTE.text}&rdquo;
                </p>
                <cite className="mt-fib-2 block t-meta not-italic text-ink/50">
                  {QUOTE.name}
                </cite>
              </blockquote>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
