"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { workItems } from "./Hero";

export default function HeroWorkTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transition progress (0 = hero state, 1 = work grid state)
  const transitionProgress = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  // Header opacity (fades in as we transition)
  const headerOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0.2, 0.5], [60, 0]);

  return (
    <div ref={containerRef} className="relative h-[200vh]" id="work">
      {/* Sticky container that holds the transitioning cards */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0a0a0a]">
        {/* Section header - fades in */}
        <motion.div
          className="absolute top-32 left-0 right-0 z-10 px-6 md:px-12 lg:px-16 xl:px-24 max-w-7xl mx-auto"
          style={{ opacity: headerOpacity, y: headerY }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-px bg-zinc-700" />
            <span className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
              Case Studies
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-end">
            <div className="overflow-hidden">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
                Selected{" "}
                <span className="font-serif italic text-[#2563eb]">work</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-lg lg:text-right max-w-md lg:ml-auto">
              Crafting digital experiences that drive real business results.
            </p>
          </div>
        </motion.div>

        {/* Transitioning work cards */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 px-6">
          <div className="w-full max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              style={{
                paddingTop: useTransform(transitionProgress, [0, 1], ["0vh", "35vh"]),
              }}
            >
              {workItems.map((item, index) => (
                <TransitioningCard
                  key={item.title}
                  item={item}
                  index={index}
                  progress={transitionProgress}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransitioningCard({
  item,
  index,
  progress,
}: {
  item: (typeof workItems)[0];
  index: number;
  progress: MotionValue<number>;
}) {
  // Card transforms from small thumbnail to large grid item
  const scale = useTransform(progress, [0, 1], [1, 1]);
  const aspectRatio = useTransform(progress, [0, 1], [1.6, 1.6]); // 16/10 aspect

  // Stagger the transitions slightly
  const delay = index * 0.05;
  const cardProgress = useTransform(
    progress,
    [0 + delay, 0.8 + delay],
    [0, 1]
  );

  // Card height animation
  const height = useTransform(cardProgress, [0, 1], ["120px", "300px"]);

  // Info opacity (shows more details as it expands)
  const detailsOpacity = useTransform(cardProgress, [0.5, 1], [0, 1]);
  const numberOpacity = useTransform(cardProgress, [0.3, 0.6], [0, 1]);

  return (
    <motion.div
      className="relative group cursor-pointer"
      style={{ scale }}
    >
      <Link
        href={item.url}
        target={item.url.startsWith("http") ? "_blank" : undefined}
        rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
      >
        <motion.div
          className="relative rounded-2xl overflow-hidden bg-zinc-900"
          style={{ height }}
        >
          {/* Image */}
          <Image
            src={item.image.replace("w=600", "w=1200")}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Project number - appears during transition */}
          <motion.div
            className="absolute top-4 left-4 z-10"
            style={{ opacity: numberOpacity }}
          >
            <span className="text-sm font-mono text-zinc-400">
              0{index + 1}
            </span>
          </motion.div>

          {/* Category tag - appears during transition */}
          <motion.div
            className="absolute top-4 right-4 z-10"
            style={{ opacity: numberOpacity }}
          >
            <span className="px-3 py-1 text-xs font-medium text-zinc-400 bg-zinc-800/80 backdrop-blur-sm rounded-full">
              {item.category}
            </span>
          </motion.div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-[#2563eb]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="flex items-center gap-2 text-white">
              <span className="text-lg font-medium">View Project</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          </motion.div>

          {/* Content at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-1 group-hover:text-[#2563eb] transition-colors">
              {item.title}
            </h3>
            <motion.p
              className="text-zinc-400 text-sm line-clamp-2"
              style={{ opacity: detailsOpacity }}
            >
              {item.description}
            </motion.p>
          </div>
        </motion.div>

        {/* Results badge - appears during transition */}
        <motion.div
          className="flex items-center gap-2 mt-3"
          style={{ opacity: detailsOpacity }}
        >
          <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
          <span className="text-sm text-[#2563eb] font-medium">
            {item.results}
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
