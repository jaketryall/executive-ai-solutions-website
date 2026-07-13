"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { whenArrived } from "@/components/anim/arrival";
import { revealUp } from "@/components/anim/reveal";
import { CTA } from "@/components/ui/cta";
import { ArtifactFrame } from "@/components/ui/artifact";
import { PersonIcon } from "@/components/ui/person-icon";
import { QUOTES, AV_TINTS } from "@/lib/quotes";
import {
  PROJECT_TYPES,
  PAGE_BANDS,
  FEATURES,
  MONTHLY,
  TIERS,
} from "@/components/estimator/pricing";

/* Pricing — the anti-agency move: the ACTUAL sheet, published. Every number
   renders from the same pricing.ts the estimator computes from, so the page
   can never drift from the quote. The sheet is drawn as the document artifact
   it is (hairlines diegetic); the estimator chapter below turns it into the
   visitor's own number. */

const fmt = (n: number) => `$${n.toLocaleString()}`;

/* the hero demo's line items — REAL entries from the sheet, so the demo can
   never drift from what the estimator would actually charge */
const DEMO_ROWS = [
  { label: PROJECT_TYPES[0].label, add: PROJECT_TYPES[0].base },
  { label: PAGE_BANDS[1].label, add: PAGE_BANDS[1].add },
  { label: "Booking or quote forms", add: FEATURES.find((f) => f.id === "booking")!.add },
  { label: "Copywriting", add: FEATURES.find((f) => f.id === "copywriting")!.add },
];
const DEMO_TOTAL = DEMO_ROWS.reduce((s, r) => s + r.add, 0);

export function PricingPage() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (_, contextSafe) => {
      const q = gsap.utils.selector(root);
      const nav = document.querySelector(".site-nav");

      if (reducedMotion()) {
        if (nav) gsap.set(nav, { autoAlpha: 1 });
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        gsap.set(q(".mask-inner"), { yPercent: 0, y: 0 });
        // the demo rests as a still: every line in, the total complete
        gsap.set(q("[data-est-row]"), { autoAlpha: 1, y: 0 });
        const t = q("[data-est-total]")[0];
        if (t) t.textContent = fmt(DEMO_TOTAL);
        return;
      }

      /* hero: statement, then the promise line, then the artifact */
      const enter = contextSafe!(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE_STRUCTURE } });
        // pre-hidden site-wide; no-op on a soft nav, a beat on a hard load
        if (nav) tl.to(nav, { autoAlpha: 1, duration: 0.6, ease: EASE_UI }, 0.1);
        // the title rises WITH the nav beat, not after it (the fade is a
        // no-op on soft navs — sequencing behind it just delayed the page)
        tl.fromTo(
            q(".pr-hero .mask-inner"),
            { yPercent: 118, y: 0 },
            { yPercent: 0, y: 0, duration: 0.95, stagger: 0.09 },
          "<"
          )
          .fromTo(
            q("[data-anim='h-sub']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_UI },
            "-=0.5"
          )
          .fromTo(
            q("[data-anim='h-art']"),
            { autoAlpha: 0, y: 21 },
            { autoAlpha: 1, y: 0, duration: 0.9 },
            "-=0.35"
          );
      });

      /* ── the artifact's ambient demo: line items land one by one and the
         total counts itself up — the sheet becoming a number, on loop
         (governed: runs only after arrival, in view, tab visible) ── */
      const rows = q("[data-est-row]") as HTMLElement[];
      const totalEl = q("[data-est-total]")[0] as HTMLElement | undefined;
      let demoLoop: gsap.core.Timeline | undefined;
      if (rows.length && totalEl) {
        gsap.set(rows, { autoAlpha: 0, y: 8 });
        const val = { v: 0 };
        const render = () => {
          totalEl.textContent = fmt(Math.round(val.v));
        };
        const c = gsap.timeline({ repeat: -1, paused: true });
        c.set(rows, { autoAlpha: 0, y: 8 })
          .call(() => {
            val.v = 0;
            render();
          })
          .to({}, { duration: 0.8 });
        let running = 0;
        DEMO_ROWS.forEach((r, i) => {
          running += r.add;
          const target = running;
          c.to(rows[i], { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE_UI })
            .to(
              val,
              { v: target, duration: 0.55, ease: EASE_UI, snap: { v: 25 }, onUpdate: render },
              "<0.1"
            )
            .to({}, { duration: 0.4 });
        });
        c.to({}, { duration: 3.8 })
          .to(rows, { autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: EASE_UI })
          .to(val, { v: 0, duration: 0.45, ease: EASE_UI, onUpdate: render }, "<")
          .to({}, { duration: 0.6 });
        demoLoop = c;
      }

      let arrived = false;
      let heroInView = false;
      const syncLoop = () => {
        if (!demoLoop) return;
        if (arrived && heroInView && !document.hidden) demoLoop.play();
        else demoLoop.pause();
      };
      if (demoLoop) {
        ScrollTrigger.create({
          trigger: q(".pr-hero")[0],
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            heroInView = self.isActive;
            syncLoop();
          },
        });
        document.addEventListener("visibilitychange", syncLoop);
      }

      let dead = false;
      whenArrived().then(() => {
        if (dead) return;
        enter();
        arrived = true;
        syncLoop();
      });

      /* THE fade-up (apple-grammar.md §5) — one recipe, fires on entry */
      revealUp(q("[data-anim='tier-head']"), q(".pr-tiers")[0]);
      revealUp(q("[data-anim='tier']"), q(".pr-tiers .tier-card")[0]);

      return () => {
        dead = true;
        document.removeEventListener("visibilitychange", syncLoop);
      };
    },
    { scope: root }
  );

  return (
    <article ref={root}>
      {/* ── HERO · the promise, with the estimator computing beside it
          (medium is the message: the page about prices SHOWS one adding
          itself up from the real sheet) ── */}
      <section className="pr-hero relative">
        <div className="wrap grid items-center gap-fib-5 pb-fib-5 pt-[144px] md:grid-cols-[55fr_45fr] md:gap-fib-6 md:pt-[176px]">
          <div>
            <h1 className="t-display-title max-w-[14ch]">
              <span className="mask-line">
                <span className="mask-inner">Prices, on</span>
              </span>
              <span className="mask-line">
                <span className="mask-inner">the page</span>
              </span>
            </h1>
            <div className="mt-fib-3">
              <p data-anim="h-sub" className="max-w-[48ch] text-ink/70">
                Most agencies make you book a call to hear a number. Here is the
                sheet we quote from, the same one the estimator computes with.
                Pick what you need, get a fixed quote in two days, and the price
                never moves after.
              </p>
              <div data-anim="h-sub" className="mt-fib-4">
                <CTA href="#estimate" label="Price your project" tone="ink" />
              </div>
              <div data-anim="h-sub" className="mt-fib-3 flex flex-wrap gap-fib-1">
                <span className="chip">Fixed quote in 2 days</span>
                <span className="chip">No retainers required</span>
              </div>
            </div>
          </div>

          <div data-anim="h-art" className="w-full justify-self-center md:justify-self-end">
            <ArtifactFrame
              variant="card"
              tone="paper"
              label="The estimator pricing a typical Growth build"
              className="w-[min(100%,420px)]"
            >
              <div className="est-demo p-fib-1" aria-hidden>
                <p className="t-meta text-ink/55">
                  A typical Growth build, priced live
                </p>
                <div className="mt-fib-2">
                  {DEMO_ROWS.map((r, i) => (
                    <div key={r.label} className="est-demo-row" data-est-row>
                      <span>{r.label}</span>
                      <span className="t-num">
                        {i === 0 ? fmt(r.add) : `+ ${fmt(r.add)}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="est-demo-total">
                  <span>Your estimate</span>
                  <span className="t-num" data-est-total>
                    $0
                  </span>
                </div>
              </div>
            </ArtifactFrame>
          </div>
        </div>
      </section>

      <section className="pr-tiers py-fib-6 md:py-fib-7">
        <div className="wrap">
          <h2 data-anim="tier-head" className="t-display-lg max-w-[14ch]">
            Where projects land
          </h2>
          <p data-anim="tier-head" className="mt-fib-3 max-w-[46ch] text-ink/70">
            Three honest bands, from the estimator&apos;s own tiers. Most
            projects land in Growth.
          </p>
          <div className="mt-fib-5 grid gap-fib-3 md:grid-cols-3 md:gap-fib-4">
            {TIERS.map((t) => {
              const lead = t.name === "Growth";
              const range =
                t.max === Infinity
                  ? `${fmt(t.min)}+`
                  : t.min === 0
                    ? `${fmt(2500)} to ${fmt(t.max)}`
                    : `${fmt(t.min)} to ${fmt(t.max)}`;
              return (
                <div
                  key={t.name}
                  data-anim="tier"
                  className={`tier-card ${lead ? "tier-card--lead md:-mt-fib-3 md:mb-fib-3" : ""}`}
                >
                  <div className="flex items-center justify-between gap-fib-2">
                    <h3 className="t-title font-display">{t.name}</h3>
                    {lead && <span className="chip chip--sm">Most projects</span>}
                  </div>
                  <p className="tier-range mt-fib-4">{range}</p>
                  <p className={`mt-fib-3 max-w-[32ch] ${lead ? "text-paper/70" : "text-ink/70"}`}>
                    {t.name === "Launch" &&
                      "A focused site that gets a small business found and booked. The fastest way to stop losing clicks."}
                    {t.name === "Growth" &&
                      "More pages, booking or quote forms, copy and photos handled. The band where ads plus landing page pays for itself."}
                    {t.name === "Flagship" &&
                      "Online stores, big builds, and sites doing serious volume. Scoped together, milestone by milestone."}
                  </p>
                  <p className={`t-meta mt-fib-4 ${lead ? "text-paper/55" : "text-ink/55"}`}>
                    {t.blurb}
                  </p>
                </div>
              );
            })}
          </div>
          {/* the witnesses, beside the claim (PLACEHOLDER quotes, lib/quotes) */}
          <div className="mt-fib-4 grid gap-fib-3 sm:grid-cols-3">
            {QUOTES.map((quo, i) => (
              <figure
                key={quo.name}
                data-anim="tier"
                className="rounded-panel bg-panel/60 p-fib-4"
              >
                <blockquote>
                  <p className="text-[0.9375rem] leading-[1.5] text-ink/70">
                    &ldquo;{quo.text}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-fib-2 flex items-center gap-[8px]">
                  <span className={`pb-av ${AV_TINTS[i]}`}>
                    <PersonIcon />
                  </span>
                  <span className="t-meta text-ink/45">{quo.name}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <p data-anim="tier-head" className="mt-fib-4 max-w-[46ch] text-ink/60">
            A realistic range, not a promise. Every project is quoted
            individually.{" "}
            <Link href="/contact" className="u-link text-ink/80">
              Ask us anything first
            </Link>
          </p>
        </div>
      </section>

      {/* ── WHERE PROJECTS LAND · Growth leads ── */}

    </article>
  );
}


/* ── THE SHEET, demoted to the appendix: the estimator answers "what would
   MINE cost"; this answers "are they hiding anything". It renders AFTER the
   estimator (composed in app/pricing/page.tsx) so the path to the action
   never pays the 1,100px line-item tax. ── */
export function PricingSheet() {
  const root = useRef<HTMLDivElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        return;
      }
      gsap
        .timeline({
          defaults: { ease: EASE_STRUCTURE },
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        })
        .fromTo(
          q("[data-anim='sheet']"),
          { autoAlpha: 0, y: 34, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 }
        )
        .fromTo(
          q(".sheet-row"),
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: EASE_UI },
          "-=0.45"
        )
        .fromTo(
          q("[data-anim='sheet-rail']"),
          { autoAlpha: 0, x: 21 },
          { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.09 },
          "<"
        );
    },
    { scope: root }
  );

  return (
    <div ref={root}>
      {/* ── THE SHEET · split: document left, how-to-read rail right ── */}
      <section className="pr-sheet py-fib-5 md:py-fib-6">
        <div className="wrap grid items-start gap-fib-5 md:grid-cols-[62fr_38fr] md:gap-fib-6">
          <div data-anim="sheet">
            <ArtifactFrame
              variant="chrome"
              tone="paper"
              url="the sheet we quote from"
              label="The Executive AI Solutions price sheet"
            >
              <div className="sheet-group">
                <div className="sheet-head">
                  <h2 className="t-title font-display">The build</h2>
                  <span className="t-meta text-ink/55">one-time, fixed quote</span>
                </div>
                {PROJECT_TYPES.map((t) => (
                  <div key={t.id} className="sheet-row">
                    <span className="sheet-name">{t.label}</span>
                    <span className="sheet-price">from {fmt(t.base)}</span>
                  </div>
                ))}
                {PAGE_BANDS.filter((b) => b.add > 0).map((b) => (
                  <div key={b.id} className="sheet-row">
                    <span className="sheet-name">
                      {b.label}
                      <span className="sheet-note">on top of the base build</span>
                    </span>
                    <span className="sheet-price">+ {fmt(b.add)}</span>
                  </div>
                ))}
              </div>

              <div className="sheet-group">
                <div className="sheet-head">
                  <h2 className="t-title font-display">What it needs</h2>
                  <span className="t-meta text-ink/55">add what applies</span>
                </div>
                {FEATURES.map((f) => (
                  <div key={f.id} className="sheet-row">
                    <span className="sheet-name">{f.label}</span>
                    <span className="sheet-price">+ {fmt(f.add)}</span>
                  </div>
                ))}
              </div>

              <div className="sheet-group">
                <div className="sheet-head">
                  <h2 className="t-title font-display">Keep it growing</h2>
                  <span className="t-meta text-ink/55">optional, monthly</span>
                </div>
                {MONTHLY.map((m) => (
                  <div key={m.id} className="sheet-row">
                    <span className="sheet-name">{m.label}</span>
                    <span className="sheet-price">
                      {m.monthly > 0 ? `from ${fmt(m.monthly)}/mo` : "per project"}
                    </span>
                  </div>
                ))}
              </div>
            </ArtifactFrame>
          </div>

          <div className="md:sticky md:top-[144px]">
            <h2 data-anim="sheet-rail" className="t-display-lg max-w-[12ch]">
              How this becomes your price
            </h2>
            <p data-anim="sheet-rail" className="mt-fib-3 max-w-[38ch] text-ink/70">
              The estimator below adds these up live. After a twenty-minute
              call we confirm scope and send a fixed quote within two days.
              The quote is the price: no hourly surprises, no scope creep
              invoices.
            </p>
            <p data-anim="sheet-rail" className="mt-fib-3 max-w-[38ch] text-ink/70">
              Google Ads spend is separate and stays in your account. You
              approve every budget.
            </p>
            <div data-anim="sheet-rail" className="mt-fib-4">
              <CTA href="#estimate" label="Price your project" tone="ink" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
