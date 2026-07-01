"use client";

// About — the person behind the work. Premium services are bought from
// humans; this section puts a face (and a voice) on the build.

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { replayEntrance } from "@/lib/scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// TODO(owner): drop a portrait at public/jake.webp and set "/jake.webp" —
// the placeholder frame swaps for it automatically.
const PORTRAIT: string | null = null;

const CHIPS = ["Jake Ryall — founder", "Arizona, USA", "Design + build + AI"];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        replayEntrance(".hero-line", sectionRef.current!, {
          from: { y: "115%" },
          to: { y: 0, duration: 1.05, stagger: 0.1, ease: "expo.out" },
          start: "top 65%",
        });
        replayEntrance("[data-about-body]", sectionRef.current!, {
          from: { y: 28, opacity: 0 },
          to: { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "expo.out" },
          start: "top 58%",
        });
        replayEntrance("[data-about-card]", sectionRef.current!, {
          from: { y: 70, opacity: 0 },
          to: { y: 0, opacity: 1, duration: 1, ease: "expo.out" },
          start: "top 70%",
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative border-t border-(--line) px-5 md:px-10 pt-24 md:pt-32 pb-24 md:pb-28"
    >
      <div className="mx-auto max-w-[1440px] lg:grid lg:grid-cols-12 lg:gap-14 items-center">
        {/* Portrait card — deck language, one peek behind */}
        <div data-about-card className="lg:col-span-5">
          <div data-lag="0.1" className="relative max-w-md mx-auto lg:mx-0 mb-10 lg:mb-0">
            <div
              className="absolute inset-0 rounded-[40px] border border-(--line) bg-paper-warm origin-bottom rotate-[2deg] translate-y-3 scale-[0.98]"
              aria-hidden
            />
            <div className="relative aspect-4/5 rounded-[40px] overflow-hidden border border-(--line) bg-ink-deep">
              {PORTRAIT ? (
                <Image
                  src={PORTRAIT}
                  alt="Jake Ryall, founder of Executive AI Solutions"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                  <span className="flex items-center justify-center w-20 h-20 rounded-full bg-ink border border-paper/15">
                    <Image
                      src="/Executive Ai Solutions Logo.svg"
                      alt=""
                      width={44}
                      height={44}
                    />
                  </span>
                  <span className="micro text-paper/40">Jake Ryall</span>
                </div>
              )}
              <span className="absolute left-4 bottom-4 inline-flex items-center gap-2.5 h-8 px-3.5 rounded-full bg-ink-deep/70 backdrop-blur-sm text-paper max-w-[calc(100%-2rem)]">
                <span className="w-1.5 h-1.5 rounded-full bg-oxblood text-oxblood pulse-dot" />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] truncate">
                  Founder — builds every project
                </span>
              </span>
            </div>
            <p
              className="font-hand absolute -bottom-6 sm:-bottom-9 right-4 -rotate-4 text-2xl text-(--fg-muted) select-none"
              aria-hidden
            >
              the whole team ↑
            </p>
          </div>
        </div>

        {/* The pitch */}
        <div className="mt-16 lg:mt-0 lg:col-span-6 lg:col-start-7">
          <p className="micro text-(--fg-faint)">About — who you&rsquo;d work with</p>
          <h2 className="mt-5 font-extrabold uppercase tracking-[-0.04em] leading-[0.94] text-[clamp(2.4rem,5.5vw,3.8rem)]">
            <span className="block">
              <span className="hero-line-mask">
                <span className="hero-line">One person,</span>
              </span>
            </span>
            <span className="block">
              <span className="hero-line-mask">
                <span className="hero-line">
                  every pixel<span className="text-oxblood">.</span>
                </span>
              </span>
            </span>
          </h2>

          <p data-about-body className="mt-7 max-w-lg text-[15px] md:text-base leading-relaxed text-(--fg-muted)">
            Hi — I&rsquo;m Jake. Executive AI Solutions is me: strategy,
            design, copy and code from one set of hands. No account managers,
            no hand-offs, nothing lost in translation — you talk directly to
            the person building your site.
          </p>
          <p data-about-body className="mt-4 max-w-lg text-[15px] md:text-base leading-relaxed text-(--fg-muted)">
            That&rsquo;s why the work ships fast and feels considered: the
            person who heard your goals is the same one moving every pixel
            toward them.
          </p>

          <ul data-about-body className="mt-9 flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <li
                key={chip}
                className="micro text-(--fg-muted) inline-flex items-center gap-2.5 h-9 px-4 rounded-full border border-(--line)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-oxblood/60" aria-hidden />
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
