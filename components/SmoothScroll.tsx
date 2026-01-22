"use client";

import { useEffect, ReactNode, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafCallbackRef = useRef<((time: number) => void) | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Create Lenis instance
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Create a stable reference for the raf callback
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    rafCallbackRef.current = rafCallback;

    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Proper cleanup
      if (rafCallbackRef.current) {
        gsap.ticker.remove(rafCallbackRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Handle route changes - reset Lenis scroll position
  useEffect(() => {
    if (lenisRef.current) {
      // Reset Lenis to top on route change
      lenisRef.current.scrollTo(0, { immediate: true });

      // Refresh ScrollTrigger after route change
      const timer = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <>{children}</>;
}
