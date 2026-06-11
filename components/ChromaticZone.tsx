"use client";

// Chromatic zone — the whole page is one surface whose background and text
// tokens morph as you scroll across section boundaries. No card edges, no
// hard color breaks: paper → ink-deep entering #work, back entering #services.

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

const LIGHT = {
  "--bg": "#e5e1db",
  "--fg": "#1a1816",
  "--fg-muted": "#78736c",
  "--fg-faint": "rgba(26, 24, 22, 0.45)",
  "--line": "rgba(26, 24, 22, 0.12)",
  "--surface": "#efebe4",
};

const DARK = {
  "--bg": "#0e0d0c",
  "--fg": "#e5e1db",
  "--fg-muted": "rgba(229, 225, 219, 0.6)",
  "--fg-faint": "rgba(229, 225, 219, 0.4)",
  "--line": "rgba(229, 225, 219, 0.14)",
  "--surface": "#1a1816",
};

export default function ChromaticZone({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const main = ref.current!;
      // Tokens must live on the element being tweened (vars don't scroll-tween
      // through the cascade), so pin the light set here at init.
      gsap.set(main, LIGHT);

      const work = document.getElementById("work");
      const services = document.getElementById("services");

      if (work) {
        gsap.fromTo(main, LIGHT, {
          ...DARK,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: work,
            start: "top 85%",
            end: "top 35%",
            scrub: 0.8,
          },
        });
      }
      if (services) {
        gsap.fromTo(main, DARK, {
          ...LIGHT,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: services,
            start: "top 90%",
            end: "top 40%",
            scrub: 0.8,
          },
        });
      }
    },
    { scope: ref },
  );

  return (
    <main ref={ref} className="min-h-svh">
      {children}
    </main>
  );
}
