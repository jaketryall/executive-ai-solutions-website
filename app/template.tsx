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
  }, []);

  // Return children directly without wrapper to preserve sticky contexts
  return <>{children}</>;
}
