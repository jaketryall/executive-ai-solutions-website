"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function EteryAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "center 0.3"]
  });

  const teamMembers = [
    { initial: "JR", name: "Jake Ryall" },
    { initial: "SM", name: "Sarah Miller" },
    { initial: "TC", name: "Tom Chen" },
    { initial: "EW", name: "Emma Wilson" },
  ];

  // Split text into words for animation
  const text = "We build stunning custom websites that convert visitors into customers. Specializing in modern web technologies and AI integration, we create unique digital experiences that grow your business.";
  const words = text.split(" ");

  return (
    <section className="pt-24 pb-12 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="text-center">
          {/* Team Avatars */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center items-center gap-2 mb-12"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.initial}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066ff] to-cyan-400 flex items-center justify-center text-white font-semibold text-sm">
                  {member.initial}
                </div>
                {/* Tooltip on hover */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  {member.name}
                </div>
              </motion.div>
            ))}
            {/* Plus sign */}
            <motion.div
              initial={{ opacity: 0, rotate: -90 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="ml-2 text-zinc-600 text-2xl"
            >
              +
            </motion.div>
          </motion.div>

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