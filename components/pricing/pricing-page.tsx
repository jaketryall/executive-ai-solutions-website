"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  gsap,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { whenArrived } from "@/components/anim/arrival";
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
        return;
      }

      /* hero: statement, then the promise line */
      const enter = contextSafe!(() => {
        const tl = gsap.timeline({ defaults: { ease: EASE_STRUCTURE } });
        // pre-hidden site-wide; no-op on a soft nav, a beat on a hard load
        if (nav) tl.to(nav, { autoAlpha: 1, duration: 0.6, ease: EASE_UI }, 0.1);
        tl.fromTo(
            q(".pr-hero .mask-inner"),
            { yPercent: 118, y: 0 },
            { yPercent: 0, y: 0, duration: 0.95, stagger: 0.09 }
          )
          .fromTo(
            q("[data-anim='h-sub']"),
            { autoAlpha: 0, y: 13 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: EASE_UI },
            "-=0.5"
          );
      });
      let dead = false;
      whenArrived().then(() => !dead && enter());

      /* the sheet: frame settles, then rows deal themselves in */
      const sheetTl = gsap.timeline({
        defaults: { ease: EASE_STRUCTURE },
        scrollTrigger: { trigger: q(".pr-sheet")[0], start: "top 72%", once: true },
      });
      sheetTl
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

      /* tiers: the lead tile lands last */
      gsap.fromTo(
        q("[data-anim='tier-head']"),
        { autoAlpha: 0, y: 21 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: EASE_STRUCTURE,
          stagger: 0.08,
          scrollTrigger: { trigger: q(".pr-tiers")[0], start: "top 76%", once: true },
        }
      );
      gsap.fromTo(
        q("[data-anim='tier']"),
        { autoAlpha: 0, y: 21, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: EASE_STRUCTURE,
          stagger: 0.12,
          scrollTrigger: { trigger: q(".pr-tiers .tier-card")[0], start: "top 80%", once: true },
        }
      );

      return () => {
        dead = true;
      };
    },
    { scope: root }
  );

  return (
    <article ref={root}>
      {/* ── HERO · the promise ── */}
      <section className="pr-hero relative">
        <div className="wrap pb-fib-5 pt-[144px] md:pt-[176px]">
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

      {/* ── WHERE PROJECTS LAND · Growth leads ── */}

    </article>
  );
}
