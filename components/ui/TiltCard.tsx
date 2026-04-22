"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

// Gentle 3D tilt + parallax spotlight highlight following the cursor.
// Drop around any card. Children render with `perspective` so transforms feel 3D.
export default function TiltCard({
  children,
  className,
  max = 7,
  spotlight = true,
}: {
  children: ReactNode;
  className?: string;
  /** Max rotation in deg. */
  max?: number;
  spotlight?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useMotionValue(50);
  const py = useMotionValue(50);

  const config = { stiffness: 180, damping: 22, mass: 0.3 };
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), config);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), config);
  const spotX = useSpring(px, { stiffness: 160, damping: 28 });
  const spotY = useSpring(py, { stiffness: 160, damping: 28 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    x.set(rx - 0.5);
    y.set(ry - 0.5);
    px.set(rx * 100);
    py.set(ry * 100);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
    px.set(50);
    py.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: "preserve-3d" }}
      className={`relative will-change-transform ${className ?? ""}`}
    >
      {children}
      {spotlight && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: useTransform(
              [spotX, spotY],
              ([sx, sy]) => `radial-gradient(320px circle at ${sx}% ${sy}%, rgba(255,255,255,0.12), transparent 55%)`
            ),
            mixBlendMode: "screen",
          }}
        />
      )}
    </motion.div>
  );
}
