"use client";

import { ReactNode, useEffect } from "react";
import gsap from "gsap";

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  // Reset scroll on page change
  useEffect(() => {
    window.scrollTo(0, 0);

    // Fade in the page content - wait for DOM to be ready
    const mainEl = document.querySelector("main");
    if (mainEl) {
      gsap.fromTo(
        mainEl,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          delay: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  // Return children directly without wrapper to preserve sticky contexts
  return <>{children}</>;
}
