"use client";

import { useRef } from "react";
import Image from "next/image";
import { Monogram } from "@/components/ui/monogram";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  EASE_STRUCTURE,
  reducedMotion,
} from "@/components/anim/ease";

const CHIPS = ["Custom design and build", "Google Ads + conversion tracking", "Local SEO"];

const DW_TAGS = ["Custom design", "Next.js", "Google Ads", "Conversion tracking", "Local SEO"];
const EAS_TAGS = ["Custom design", "Next.js", "GSAP", "Instant estimator", "AI automation"];

// two identical sets → the -50% keyframe wraps seamlessly
function TagMarquee({ tags }: { tags: string[] }) {
  return (
    <span className="wc-marquee" aria-hidden>
      <span className="wc-track">
        {[0, 1].map((set) => (
          <span key={set} className="wc-set">
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </span>
        ))}
      </span>
    </span>
  );
}

export function ManifestoWork() {
  const root = useRef<HTMLElement>(null!);

  useGSAP(
    (context, contextSafe) => {
      const q = gsap.utils.selector(root);
      const chip = q(".ms-chip")[0] as HTMLElement | undefined;

      if (reducedMotion()) {
        // rest states: chip open, work cards visible
        gsap.set(q("[data-anim]"), { autoAlpha: 1 });
        return;
      }

      // ── word-fill + chip-open: the statement reads itself in as you scroll ──
      // (created inside contextSafe so ctx.revert() catches it; cancelled guard
      // protects against StrictMode double-mount double-splitting)
      let cancelled = false;
      context.add(() => () => {
        cancelled = true;
      });
      const buildFill = contextSafe!(() => {
        if (cancelled) return;
        const lines = q(".ms-line");
        const words: Element[] = [];
        lines.forEach((line) => {
          const split = SplitText.create(line, { type: "words", wordsClass: "mw", aria: "none" });
          words.push(...split.words.filter((w) => !w.querySelector(".ms-chip")));
        });
        gsap.set(words, { opacity: 0.25 });
        // scrub rule: scroll is the clock — ease:"none" + scrub smoothing, never
        // a shaped curve on the progress (its steep middle reads as snapping)
        gsap.to(words, {
          opacity: 1,
          stagger: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: q(".manifesto-line")[0],
            start: "top 80%",
            end: "top 28%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        });

        // the chip opens across the latter half of the same window (desktop
        // scrub; mobile rests open via its CSS width:auto default)
        const mmChip = gsap.matchMedia();
        if (chip) {
          mmChip.add("(min-width: 821px)", () => {
            const img = chip.querySelector("img");
            const measure = () =>
              (img?.getBoundingClientRect().width ?? 0) || chip.offsetHeight * 2.1;
            gsap.set(chip, { width: "auto" });
            let chipTarget = measure();
            gsap.set(chip, { width: 0 });
            const onRefresh = () => {
              gsap.set(chip, { width: "auto" });
              chipTarget = measure();
              gsap.set(chip, { width: 0 });
            };
            ScrollTrigger.addEventListener("refreshInit", onRefresh);
            const tw = gsap.fromTo(
              chip,
              { width: 0 },
              {
                width: () => chipTarget,
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: q(".manifesto-line")[0],
                  start: "top 54%",
                  end: "top 28%",
                  scrub: 0.5,
                  invalidateOnRefresh: true,
                },
              }
            );
            return () => {
              ScrollTrigger.removeEventListener("refreshInit", onRefresh);
              tw.kill();
              gsap.set(chip, { width: "auto" });
            };
          });
        }
        ScrollTrigger.refresh();
      });
      document.fonts.ready.then(buildFill);

      // ── card media parallax: the shot drifts inside its overscanned well
      //    (desktop only; contained, so it can never expose a gap) ──
      const mm = gsap.matchMedia();
      mm.add("(min-width: 821px)", () => {
        const pars = gsap.utils.toArray<HTMLElement>(q(".wc-par"));
        // scale supplies the overscan; left-anchored so a UI screenshot never
        // loses its own nav/headline edge (the crop lands on the scenery side).
        // Amplitude tuned to be FELT: ±7.5% drift inside an 18% overscan.
        gsap.set(pars, { scale: 1.18, transformOrigin: "0% 50%" });
        const tweens = pars.map((par) =>
          gsap.fromTo(
            par,
            { yPercent: -7.5 },
            {
              yPercent: 7.5,
              ease: "none",
              scrollTrigger: {
                trigger: par.closest(".work-card"),
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          )
        );
        return () => {
          tweens.forEach((t) => t.kill());
          gsap.set(pars, { clearProps: "transform" });
        };
      });

      // ── work grid entrance: the two cards settle in together ──
      gsap.fromTo(
        q("[data-anim='wcard']"),
        { autoAlpha: 0, scale: 0.96 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.9,
          ease: EASE_STRUCTURE,
          stagger: 0.12,
          onComplete() {
            gsap.set(this.targets(), { clearProps: "transform" });
          },
          scrollTrigger: { trigger: q("[data-anim='wcard']")[0], start: "top 82%" },
        }
      );
    },
    { scope: root }
  );

  return (
    <section
      id="work"
      ref={root}
      data-nav="light"
      className="relative pb-[89px] pt-[144px] md:pb-[144px] md:pt-[233px]"
    >
      {/* THE statement peak — the page's one centered element. Lands right
          after the reel: you just scrolled the proof it's talking about.
          The chip trio (the<chip>proof) is whitespace-free so it can never break. */}
      <div className="mx-auto max-w-[1280px] px-[21px] md:px-[55px]">
        <p className="manifesto-line t-display-xl mx-auto max-w-[19ch] text-center">
          <span className="ms-line block">Most agencies show you a deck.</span>
          <span className="ms-line block">
            You&apos;re scrolling the
            <span className="ms-chip" aria-hidden>
              <Image
                src="/work/desert-wings-hero.png"
                alt=""
                width={340}
                height={158}
                sizes="180px"
              />
            </span>
            proof
          </span>
        </p>

        {/* icomat foot: label + chips hard-left · meta paragraph hard-right · open center */}
        <div className="mt-[clamp(89px,14vh,144px)] flex flex-col gap-[34px] md:flex-row md:items-end md:justify-between">
          <div className="max-w-[420px]">
            <p className="t-meta text-ink/70">The work</p>
            <div className="mt-[13px] flex flex-wrap gap-[8px]">
              {CHIPS.map((c) => (
                <span key={c} className="chip">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <p className="max-w-[38ch] text-[1.0625rem] leading-[1.5] text-ink/75 md:text-right">
            We design, build, and grow websites for serious local businesses.
            Custom design, SEO and Google Ads, and AI automation. No templates,
            no retainers you can&apos;t explain.
          </p>
        </div>
      </div>

      {/* the work grid — two cards: the client's site, and this one.
          Breaks out of the text container to the reel's gutter width —
          media runs wider than prose (the icomat register) */}
      <div className="mt-[89px] px-[21px] md:px-[55px]">
        <div className="grid grid-cols-1 gap-[21px] md:grid-cols-2">
          <a
            data-anim="wcard"
            href="https://www.desertwingsflightschool.com"
            target="_blank"
            rel="noopener noreferrer"
            className="work-card"
            aria-label="Desert Wings Flight School, the live site we designed and built (opens in a new tab)"
          >
            <span className="wc-well block" style={{ height: "clamp(300px, 30vw, 540px)" }}>
              <span className="wc-par block">
                <Image
                  src="/work/desert-wings-tall.png"
                  alt="The Desert Wings Flight School homepage"
                  fill
                  sizes="(min-width: 768px) 48vw, 92vw"
                  className="wc-base"
                />
              </span>
              <span className="wc-veil" aria-hidden />
              <span className="wc-demo" aria-hidden>
                <Image src="/work/desert-wings-fleet.png" alt="" width={1400} height={648} sizes="480px" />
              </span>
            </span>
            <span className="wc-foot">
              <span className="wc-client">
                <span className="wc-avatar">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/work/desert-wings-logo.png" alt="" />
                </span>
                Desert Wings Flight School
              </span>
              <span className="wc-meta">Website · Live</span>
            </span>
            <TagMarquee tags={DW_TAGS} />
          </a>

          <a
            data-anim="wcard"
            href="#estimate"
            className="work-card"
            aria-label="Executive AI Solutions, the site you are on. Price your own project"
          >
            <span className="wc-well block" style={{ height: "clamp(300px, 30vw, 540px)" }}>
              <span className="wc-par block">
                <Image
                  src="/work/eas-hero.png"
                  alt="This site's homepage"
                  fill
                  sizes="(min-width: 768px) 48vw, 92vw"
                  className="wc-base"
                />
              </span>
              <span className="wc-veil" aria-hidden />
              <span className="wc-demo" aria-hidden>
                <Image src="/work/eas-estimator.png" alt="" width={1600} height={1000} sizes="480px" />
              </span>
            </span>
            <span className="wc-foot">
              <span className="wc-client">
                <span className="wc-avatar">
                  <Monogram className="h-[18px] w-[18px]" />
                </span>
                Executive AI Solutions
              </span>
              <span className="wc-meta">Website · You&apos;re on it</span>
            </span>
            <TagMarquee tags={EAS_TAGS} />
          </a>
        </div>
      </div>
    </section>
  );
}
