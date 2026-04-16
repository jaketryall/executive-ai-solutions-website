"use client";

import { useEffect, useCallback, useRef } from "react";

const CREAM = "#f3f1ee";
const DARK = "#0a0908";

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function lerpColor(from: string, to: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(from);
  const [r2, g2, b2] = hexToRgb(to);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function getColor(bg: string | undefined): string {
  if (bg === "cream") return CREAM;
  if (bg === "morph") return DARK; // morph sections handle their own color
  return DARK;
}

export default function ScrollBackground() {
  const divRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastColorRef = useRef(DARK);
  const isMorphRef = useRef(false);

  const handleScroll = useCallback(() => {
    const el = divRef.current;
    if (!el) return;

    const viewportCenter = window.scrollY + window.innerHeight * 0.4;
    const sections = document.querySelectorAll<HTMLElement>("[data-bg]");
    const sectionArray = Array.from(sections);

    let lastSectionBottom = 0;
    let newColor = lastColorRef.current;
    let inMorph = false;

    for (let i = 0; i < sectionArray.length; i++) {
      const section = sectionArray[i];
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionBottom = sectionTop + rect.height;

      if (sectionBottom > lastSectionBottom) {
        lastSectionBottom = sectionBottom;
      }

      if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
        const bg = section.dataset.bg;

        if (bg === "morph") {
          const prevColor = i > 0 ? getColor(sectionArray[i - 1].dataset.bg) : DARK;
          const nextColor = i < sectionArray.length - 1 ? getColor(sectionArray[i + 1].dataset.bg) : DARK;
          const progress = Math.max(0, Math.min(1, (viewportCenter - sectionTop) / (sectionBottom - sectionTop)));
          newColor = lerpColor(prevColor, nextColor, progress);
          inMorph = true;
        } else {
          newColor = getColor(bg);
        }
        break;
      }
    }

    const isInFooter = viewportCenter > lastSectionBottom;

    // Apply directly to DOM for max performance (no React re-render)
    el.style.backgroundColor = newColor;
    el.style.opacity = isInFooter ? "0" : "1";
    el.style.pointerEvents = isInFooter ? "none" : "auto";
    el.style.transition = inMorph
      ? "opacity 0.15s ease"
      : "background-color 0.5s ease, opacity 0.15s ease";

    lastColorRef.current = newColor;
    isMorphRef.current = inMorph;
  }, []);

  useEffect(() => {
    handleScroll();

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div
      ref={divRef}
      className="fixed inset-0"
      style={{
        backgroundColor: DARK,
        zIndex: 5,
      }}
    />
  );
}
