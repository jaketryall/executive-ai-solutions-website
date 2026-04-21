"use client";

import { useEffect, useRef } from "react";

// Soft, slowly morphing gradient blobs — warm ambient light behind content
export default function BezierBackground() {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const b1 = blob1Ref.current;
    const b2 = blob2Ref.current;
    const b3 = blob3Ref.current;
    if (!b1 || !b2 || !b3) return;

    let time = 0;

    const animate = () => {
      time += 0.003;

      // Blob 1 — large, slow, top-right area
      const b1x = Math.sin(time * 0.7) * 8;
      const b1y = Math.cos(time * 0.5) * 6;
      const b1scale = 1 + Math.sin(time * 0.3) * 0.08;
      const b1rotate = Math.sin(time * 0.2) * 15;
      b1.style.transform = `translate(${b1x}%, ${b1y}%) scale(${b1scale}) rotate(${b1rotate}deg)`;

      // Blob 2 — medium, center-left
      const b2x = Math.cos(time * 0.6) * 10;
      const b2y = Math.sin(time * 0.8) * 8;
      const b2scale = 1 + Math.cos(time * 0.4) * 0.06;
      const b2rotate = Math.cos(time * 0.25) * 20;
      b2.style.transform = `translate(${b2x}%, ${b2y}%) scale(${b2scale}) rotate(${b2rotate}deg)`;

      // Blob 3 — small, bottom area
      const b3x = Math.sin(time * 0.9) * 12;
      const b3y = Math.cos(time * 0.4) * 7;
      const b3scale = 1 + Math.sin(time * 0.5) * 0.1;
      const b3rotate = Math.sin(time * 0.3) * 25;
      b3.style.transform = `translate(${b3x}%, ${b3y}%) scale(${b3scale}) rotate(${b3rotate}deg)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Blob 1 — warm amber, large, top right */}
      <div
        ref={blob1Ref}
        className="absolute"
        style={{
          width: "clamp(600px, 60vw, 1100px)",
          height: "clamp(600px, 60vw, 1100px)",
          top: "-15%",
          right: "-15%",
          background: "radial-gradient(ellipse at 40% 40%, rgba(255, 190, 130, 0.06) 0%, rgba(255, 160, 100, 0.02) 40%, transparent 70%)",
          borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%",
          filter: "blur(40px)",
        }}
      />

      {/* Blob 2 — softer gold, medium, center left */}
      <div
        ref={blob2Ref}
        className="absolute"
        style={{
          width: "clamp(400px, 45vw, 800px)",
          height: "clamp(400px, 45vw, 800px)",
          top: "30%",
          left: "-10%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(255, 210, 160, 0.05) 0%, rgba(255, 180, 120, 0.015) 45%, transparent 70%)",
          borderRadius: "55% 45% 50% 50% / 45% 55% 45% 55%",
          filter: "blur(50px)",
        }}
      />

      {/* Blob 3 — subtle warm, bottom right */}
      <div
        ref={blob3Ref}
        className="absolute"
        style={{
          width: "clamp(350px, 40vw, 700px)",
          height: "clamp(350px, 40vw, 700px)",
          bottom: "-5%",
          right: "10%",
          background: "radial-gradient(ellipse at 60% 50%, rgba(229, 225, 219, 0.04) 0%, rgba(229, 225, 219, 0.01) 50%, transparent 70%)",
          borderRadius: "45% 55% 60% 40% / 50% 45% 55% 50%",
          filter: "blur(45px)",
        }}
      />
    </div>
  );
}
