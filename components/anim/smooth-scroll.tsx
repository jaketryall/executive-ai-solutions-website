"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "@/components/anim/ease";

// Lenis in its default native-scroll mode (real scrollTop — position:sticky keeps working),
// driving ScrollTrigger so every scrubbed beat carries momentum.
export function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onAnchor = (e: Event) => {
      const a = (e.target as HTMLElement).closest?.(
        'a[href^="#"], a[href^="/#"]'
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href")!;
      // "/#section" links smooth-scroll only when we're already home;
      // elsewhere they're real navigations the router owns
      if (href.startsWith("/#") && location.pathname !== "/") return;
      const el = document.querySelector(href.replace(/^\//, ""));
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72 });
    };
    document.addEventListener("click", onAnchor);

    return () => {
      document.removeEventListener("click", onAnchor);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
