"use client";

import { ReactNode, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  // Reset scroll and refresh ScrollTrigger on page change
  useEffect(() => {
    // Kill all existing ScrollTriggers to prevent stale state
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Reset scroll position immediately
    window.scrollTo(0, 0);

    // Give the DOM time to update, then refresh ScrollTrigger
    const refreshTimer = requestAnimationFrame(() => {
      // Refresh after a brief delay to ensure DOM is fully rendered
      setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 100);
    });

    // Fade in the page content using the body or a global class
    // This avoids wrapping content in extra divs that break sticky
    gsap.fromTo(
      "main",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        delay: 0.1,
        ease: "power2.out",
      }
    );

    return () => {
      cancelAnimationFrame(refreshTimer);
    };
  }, []);

  // Return children directly without wrapper to preserve sticky contexts
  return <>{children}</>;
}
