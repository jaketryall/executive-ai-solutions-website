"use client";

// Proof strip — infinite marquee of client wordmarks that reacts to scroll:
// scroll down fast and it accelerates, scroll up and it runs backwards,
// settle and it eases back to its cruise speed. Pauses on hover.

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

// TODO(owner): confirm/extend the client list — pulled from visible project work.
const BRANDS = [
  "Riled Up",
  "Desert Wings",
  "Wings N Wheels",
  "Lando",
  "AZ Gyro Tours",
];

function Sequence({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className="marquee-seq" aria-hidden={hidden || undefined}>
      {BRANDS.map((b) => (
        <span key={b} className="flex items-center gap-[inherit]">
          <span className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight text-(--fg-muted) whitespace-nowrap uppercase">
            {b}
          </span>
          <span
            className="w-2 h-2 rounded-full bg-oxblood/40 shrink-0"
            aria-hidden
          />
        </span>
      ))}
    </span>
  );
}

export default function ProofStrip() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(".marquee", {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });

        // Scroll velocity drives the playhead; it eases home to 1× after.
        const proxy = { ts: 1 };
        const apply = () => tween.timeScale(proxy.ts);
        let hovered = false;

        ScrollTrigger.create({
          onUpdate: (self) => {
            if (hovered) return;
            const v = gsap.utils.clamp(-2400, 2400, self.getVelocity());
            gsap.to(proxy, {
              ts: 1 + v / 500,
              duration: 0.2,
              overwrite: true,
              onUpdate: apply,
            });
            gsap.to(proxy, {
              ts: 1,
              duration: 1.4,
              delay: 0.3,
              ease: "power2.out",
              onUpdate: apply,
            });
          },
        });

        const wrap = sectionRef.current!.querySelector(".marquee-wrap")!;
        const onEnter = () => {
          hovered = true;
          gsap.to(proxy, { ts: 0, duration: 0.5, overwrite: true, onUpdate: apply });
        };
        const onLeave = () => {
          hovered = false;
          gsap.to(proxy, { ts: 1, duration: 0.6, overwrite: true, onUpdate: apply });
        };
        wrap.addEventListener("mouseenter", onEnter);
        wrap.addEventListener("mouseleave", onLeave);
        return () => {
          wrap.removeEventListener("mouseenter", onEnter);
          wrap.removeEventListener("mouseleave", onLeave);
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Brands we've worked with"
      // Pull-up under the reel is gated on `html.eas-ready` (set once the hero
      // is pinned) — otherwise the SSR/pre-JS paint, where the hero is a single
      // screen, flashes this strip into the first viewport. -mt-px holds the
      // dark-section seam until then.
      className="zone-dark relative -mt-px bg-ink-deep py-10 text-(--fg) [html.eas-ready_&]:mt-[clamp(-180px,-16vh,-80px)]"
    >
      <p className="micro text-(--fg-faint) text-center">
        Trusted by owners who needed results
      </p>
      <div className="marquee-wrap mt-5">
        <div className="marquee">
          <Sequence />
          <Sequence hidden />
        </div>
      </div>
    </section>
  );
}
