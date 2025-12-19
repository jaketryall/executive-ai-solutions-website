"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function EteryAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "center 0.3"]
  });

  // Split text into words for animation
  const text = "We help businesses unlock hidden value in their operations by automating expert-level tasks that drain time and resources. Our AI solutions handle the repetitive work so your team can focus on what matters—growing your business.";
  const words = text.split(" ");

  return (
    <section className="pt-24 pb-12 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="text-center">
          {/* Main Heading with Scroll Animation */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-8 max-w-5xl mx-auto">
            {words.map((word, wordIndex) => {
              const start = wordIndex / words.length;
              const end = start + (1 / words.length);
              
              return (
                <span key={wordIndex} className="inline-block mr-[0.25em]">
                  {word.split("").map((char, charIndex) => {
                    const charStart = start + (charIndex / word.length) * (1 / words.length);
                    const charEnd = charStart + (1 / word.length) * (1 / words.length);
                    
                    return (
                      <motion.span
                        key={charIndex}
                        className="inline-block"
                        style={{
                          color: useTransform(
                            scrollYProgress,
                            [charStart, charEnd],
                            ["#71717a", "#ffffff"]
                          )
                        }}
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </span>
              );
            })}
          </h2>

        </div>
      </div>
    </section>
  );
}