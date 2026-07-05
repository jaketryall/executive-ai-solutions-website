"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  gsap,
  ScrollTrigger,
  useGSAP,
  EASE_STRUCTURE,
  EASE_UI,
  reducedMotion,
} from "@/components/anim/ease";
import { CTA } from "@/components/ui/cta";
import { Monogram } from "@/components/ui/monogram";

const ROWS = ["Websites", "SEO and Google Ads", "AI automation"];

export function Services() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const rows = q("[data-svc-row]");
      const labelStack = q(".rail-label-stack")[0];
      const bar = q(".rail-bar-fill")[0];

      if (reducedMotion()) {
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        if (bar) gsap.set(bar, { scaleX: 1 });
        return;
      }

      // per-row directional stagger (label from left · artifact scales · copy rises)
      rows.forEach((row) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 78%" },
          defaults: { ease: EASE_STRUCTURE },
        });
        tl.fromTo(
          row.querySelectorAll("[data-anim='head']"),
          { autoAlpha: 0, x: -34 },
          { autoAlpha: 1, x: 0, duration: 0.8 }
        )
          .fromTo(
            row.querySelectorAll("[data-anim='artifact']"),
            { autoAlpha: 0, scale: 0.94 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.9,
              onComplete() {
                gsap.set(this.targets(), { clearProps: "transform" });
              },
            },
            "-=0.55"
          )
          .fromTo(
            row.querySelectorAll("[data-anim='copy']"),
            { autoAlpha: 0, y: 21 },
            { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE_UI },
            "-=0.6"
          );
      });

      // live rail label: rolls to the in-view row; progress bar scrubs across the section
      let active = -1;
      const setActive = (i: number) => {
        if (i === active || !labelStack) return;
        active = i;
        const spans = labelStack.children;
        gsap.to(spans, { yPercent: -i * 100, duration: 0.5, ease: EASE_UI });
      };
      rows.forEach((row, i) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      if (bar) {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 55%",
              end: "bottom 80%",
              scrub: true,
            },
          }
        );
      }
      requestAnimationFrame(() => setActive(0));
    },
    { scope: root }
  );

  return (
    <section id="services" ref={root} data-nav="dark" className="relative">
      {/* the section IS a card — a dark panel floating on the canvas, so the
          paper artifact cards inside pop surface-on-surface */}
      <div className="dark-chapter mx-[8px] rounded-[24px] py-[89px] md:mx-[13px] md:py-[144px]">
      <div className="mx-auto grid max-w-[1280px] gap-[55px] px-[21px] md:grid-cols-[minmax(300px,380px)_1fr] md:gap-[89px] md:px-[55px]">
        {/* ── the rail (pins on desktop) ── */}
        <div>
          <div className="md:sticky md:top-[144px]">
            <h2 className="t-display-lg">What we do</h2>
            <div className="mt-[34px] hidden md:block">
              <p className="t-meta mb-[8px] text-paper/65">Reading</p>
              <div className="t-meta overflow-hidden font-[600]" style={{ height: "1.4em", lineHeight: 1.4 }}>
                <div className="rail-label-stack">
                  {ROWS.map((r) => (
                    <span key={r} className="block" style={{ height: "1.4em" }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rail-bar mt-[13px]">
                <span className="rail-bar-fill" />
              </div>
            </div>
            <div className="mt-[34px] hidden md:block">
              <CTA href="#estimate" label="Price your project" tone="paper" />
            </div>
          </div>
        </div>

        {/* ── the roster (all visible, nothing gated) — each service is its
            own paper card on the panel, same register as the step cards ── */}
        {/* gap ≥ card padding so each card reads as its own object on the
            panel, not slices of one surface */}
        <div className="flex flex-col gap-[21px] md:gap-[34px]">
          {/* 01 · flagship — Websites */}
          <article data-svc-row className="svc-row rounded-[18px] bg-paper p-[21px] md:p-[34px]">
            <h3 data-anim="head" className="t-display-lg">
              Websites
            </h3>
            <p data-anim="copy" className="mt-[21px] max-w-[52ch] text-ink/75">
              Custom-designed and hand-built. Your site is drawn from your
              business, not squeezed into a template, and every page is built to
              turn visitors into enquiries.
            </p>
            <div data-anim="copy" className="mt-[13px] flex flex-wrap gap-[8px]">
              <span className="chip">Design + build</span>
              <span className="chip">From $2.5k</span>
            </div>
            <a
              data-anim="artifact"
              href="https://www.desertwingsflightschool.com/fleet"
              target="_blank"
              rel="noopener noreferrer"
              className="browser-card group mt-[34px] block"
              aria-label="desertwingsflightschool.com/fleet, a page we designed for Desert Wings (opens in a new tab)"
            >
              <span className="browser-chrome">
                <Monogram className="h-[13px] w-[13px] opacity-70" />
                <span className="text-trim">desertwingsflightschool.com/fleet</span>
              </span>
              <span className="browser-shot" style={{ maxHeight: 377, aspectRatio: "2.1" }}>
                <Image
                  src="/work/desert-wings-fleet.png"
                  alt="A custom fleet page designed and built for Desert Wings Flight School"
                  width={1400}
                  height={648}
                  sizes="(min-width: 821px) 60vw, 92vw"
                  className="h-full w-full object-cover object-top"
                />
              </span>
            </a>
          </article>

          {/* 02 — SEO and Google Ads */}
          <article data-svc-row className="svc-row rounded-[18px] bg-paper p-[21px] md:p-[34px]">
            {/* full-width title row (same crown as the flagship card), then
                the two columns — the 300px text column can't host big titles */}
            <h3 data-anim="head" className="t-title t-title--lg">
              SEO and Google Ads
            </h3>
            <div className="mt-[21px] grid items-center gap-[34px] md:grid-cols-2">
            <div>
              <p data-anim="copy" className="max-w-[44ch] text-ink/75">
                Get found, get chosen. Local SEO, search-ready builds, and managed
                Google Ads with conversion tracking you can actually read.
              </p>
              <div data-anim="copy" className="mt-[13px] flex flex-wrap gap-[8px]">
                <span className="chip">From $500/mo + ad spend</span>
              </div>
            </div>
            {/* artifact: the client's real search listing, drawn as a card */}
            <div data-anim="artifact" className="serp-card" role="group" aria-label="Example: their live Google listing">
              <p className="serp-url">
                desertwingsflightschool.com
                <span className="serp-path"> › programs</span>
              </p>
              <p className="serp-title">
                Desert Wings Flight School Mesa AZ | Flight Training at Falcon
                Field
              </p>
              <p className="serp-desc">
                Career-pilot training at Falcon Field, Mesa AZ. PPL through CFI on
                a single path, built from the outcomes of every pilot we&apos;ve
                graduated.
              </p>
              <p className="serp-tag t-meta">Their live listing on Google</p>
            </div>
            </div>
          </article>

          {/* 03 — AI automation */}
          <article data-svc-row className="svc-row rounded-[18px] bg-paper p-[21px] md:p-[34px]">
            {/* full-width title row — the badge rides beside the title again */}
            <div className="flex flex-wrap items-center gap-[11px]">
              <h3 data-anim="head" className="t-title t-title--lg">
                AI automation
              </h3>
              <span data-anim="head" className="chip chip--sm bg-accent/10 text-accent">
                New for 2026
              </span>
            </div>
            <div className="mt-[21px] grid items-center gap-[34px] md:grid-cols-2">
            <div>
              <p data-anim="copy" className="max-w-[44ch] text-ink/75">
                Chat that answers from your own site, follow-ups that send
                themselves, and pages that adapt to each visitor. Built and
                managed for you.
              </p>
              <div data-anim="copy" className="mt-[13px] flex flex-wrap gap-[8px]">
                <span className="chip">Quoted per project</span>
              </div>
            </div>
            {/* artifact: the "ask this site" surface we build, shown as itself */}
            <div data-anim="artifact" className="chat-card" role="group" aria-label="Example: ask-this-site chat answering a visitor">
              <p className="chat-q">Do you offer discovery flights on weekends?</p>
              <div className="chat-a">
                <Monogram className="mt-[3px] h-[16px] w-[16px] shrink-0 opacity-70" />
                <p>
                  Yes — Saturday and Sunday mornings from Falcon Field. Want me
                  to book you one?
                </p>
              </div>
              <p className="serp-tag t-meta">Ask-this-site chat, answering from your pages</p>
            </div>
            </div>
          </article>
        </div>
      </div>
      </div>
    </section>
  );
}
