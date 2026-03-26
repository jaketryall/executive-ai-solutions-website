"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

// Each word fills from dim to bright as you scroll through
function FillWord({
  word,
  index,
  total,
  progress,
  isAccent,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isAccent?: boolean;
}) {
  const start = 0.1 + (index / total) * 0.6;
  const end = start + (1 / total) * 2;
  const opacity = useTransform(progress, [start, end], [0.1, 1]);
  // Each word drifts slightly at different rates — parallax within the text
  const y = useTransform(progress, [start, end], [8, 0]);

  return (
    <motion.span
      className="inline-block mr-[0.3em]"
      style={{
        opacity,
        y,
        color: isAccent ? "rgba(255, 200, 150, 1)" : "#e5e1db",
      }}
    >
      {word}
    </motion.span>
  );
}

export default function KineticTypography() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // The statement split into words, with some marked as accent
  const statement = "I design websites that actually grow businesses.";
  const words = statement.split(" ");
  const accentWords = ["design", "actually", "grow"];

  return (
    <>
      {/* Mobile — simple static version */}
      <section className="min-h-[60vh] flex items-center justify-center px-6 md:hidden">
        <p
          className="text-center"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: "clamp(1.5rem, 6vw, 2.5rem)",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#e5e1db",
          }}
        >
          I design websites that{" "}
          <span style={{ color: "rgba(255, 200, 150, 1)" }}>actually</span>{" "}
          grow businesses.
        </p>
      </section>

      {/* Desktop — pinned scroll-fill statement */}
      <section
        ref={sectionRef}
        className="relative hidden md:block"
        style={{ height: "200vh" }}
      >
        <div className="sticky top-0 h-screen flex items-center justify-center px-10">
          <div className="max-w-[1100px]">
            <p
              className="leading-[1.2]"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(2.5rem, 4.5vw, 5rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {words.map((word, i) => (
                <FillWord
                  key={i}
                  word={word}
                  index={i}
                  total={words.length}
                  progress={scrollYProgress}
                  isAccent={accentWords.includes(word.replace(/[.,]/g, ""))}
                />
              ))}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
