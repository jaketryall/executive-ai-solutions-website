"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.2,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 h-[2px] z-[60] origin-left pointer-events-none"
      style={{
        scaleX,
        background: "linear-gradient(90deg, var(--oxblood), var(--ink))",
      }}
    />
  );
}
