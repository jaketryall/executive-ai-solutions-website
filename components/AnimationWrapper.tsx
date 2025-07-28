"use client";

import { motion, MotionConfig } from "framer-motion";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useIsMobile";

export function AnimationWrapper({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile(1024);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Reduce animations on mobile or when user prefers reduced motion
  const reducedMotion = isMobile || prefersReducedMotion;

  return (
    <MotionConfig
      reducedMotion={reducedMotion ? "always" : "never"}
      transition={
        reducedMotion
          ? { duration: 0.01 } // Near-instant transitions for reduced motion
          : undefined // Use default transitions
      }
    >
      {children}
    </MotionConfig>
  );
}