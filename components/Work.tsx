"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export const workItems = [
  {
    title: "Desert Wings",
    category: "Aviation",
    description:
      "A modern, conversion-focused website for Arizona's premier flight training academy.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80",
    url: "https://desert-wings-nextjs.vercel.app/",
    results: "3x increase in student inquiries",
    year: "2024",
    size: "large",
  },
  {
    title: "Meridian",
    category: "Consulting",
    description:
      "Professional consulting firm website emphasizing trust and expertise.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    url: "#",
    results: "40% improvement in lead quality",
    year: "2024",
    size: "medium",
  },
  {
    title: "Apex Interiors",
    category: "Design",
    description:
      "Elegant portfolio showcasing luxury interior design projects.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
    url: "#",
    results: "Featured in Design Weekly",
    year: "2023",
    size: "medium",
  },
  {
    title: "Northside",
    category: "Healthcare",
    description:
      "Modern healthcare platform focused on patient experience.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80",
    url: "#",
    results: "50% faster booking",
    year: "2023",
    size: "large",
  },
];

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={containerRef}
      id="work"
      className="relative py-32"
    >
      {/* Background - solid to match hero */}
      <div className="absolute inset-0 -z-10 bg-[#0a0a0a]" />
      {/* Section header - sticky */}
      <div className="sticky top-24 z-20 px-6 md:px-12 lg:px-24 mb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-12 h-px bg-zinc-700 origin-left"
                />
                <span className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
                  Selected Work
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight">
                Featured{" "}
                <span className="font-serif italic text-[#2563eb]">projects</span>
              </h2>
            </div>
            <p className="text-zinc-400 text-lg max-w-sm">
              Crafting digital experiences that drive real results.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Row 1: Large + Small stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <BentoCard
              project={workItems[0]}
              index={0}
              className="lg:col-span-8"
              aspectRatio="aspect-[16/10]"
              scrollYProgress={scrollYProgress}
            />
            <div className="lg:col-span-4 flex flex-col gap-6">
              <BentoCard
                project={workItems[1]}
                index={1}
                className="flex-1"
                aspectRatio="aspect-square"
                scrollYProgress={scrollYProgress}
                compact
              />
            </div>
          </div>

          {/* Row 2: Small stack + Large */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="lg:col-span-4 flex flex-col gap-6">
              <BentoCard
                project={workItems[2]}
                index={2}
                className="flex-1"
                aspectRatio="aspect-square"
                scrollYProgress={scrollYProgress}
                compact
              />
            </div>
            <BentoCard
              project={workItems[3]}
              index={3}
              className="lg:col-span-8"
              aspectRatio="aspect-[16/10]"
              scrollYProgress={scrollYProgress}
            />
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-zinc-800"
          >
            {[
              { value: "50+", label: "Projects Delivered" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "2x", label: "Average ROI" },
              { value: "14", label: "Days Avg. Delivery" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-semibold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-12 lg:px-24 mt-20"
      >
        <div className="max-w-7xl mx-auto flex justify-center">
          <Link
            href="#contact"
            className="group inline-flex items-center gap-4 px-8 py-4 bg-white text-[#0a0a0a] font-medium rounded-full hover:bg-zinc-100 transition-colors"
            data-cursor="Let's Talk"
          >
            <span>Start Your Project</span>
            <motion.span
              className="inline-block"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

function BentoCard({
  project,
  index,
  className = "",
  aspectRatio = "aspect-video",
  scrollYProgress,
  compact = false,
}: {
  project: (typeof workItems)[0];
  index: number;
  className?: string;
  aspectRatio?: string;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  compact?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: cardScrollProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  // Parallax for image
  const imageY = useTransform(cardScrollProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(cardScrollProgress, [0, 0.5, 1], [1.2, 1.1, 1.2]);

  // Card reveal animation
  const cardY = useTransform(cardScrollProgress, [0, 0.3], [100, 0]);
  const cardOpacity = useTransform(cardScrollProgress, [0, 0.2], [0, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y: cardY, opacity: cardOpacity }}
      className={`group relative ${className}`}
    >
      <Link
        href={project.url}
        target={project.url.startsWith("http") ? "_blank" : undefined}
        rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
        data-cursor="View Project"
      >
        <div
          className={`relative ${aspectRatio} rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-900`}
        >
          {/* Image with parallax */}
          <motion.div
            className="absolute inset-0"
            style={{ y: imageY, scale: imageScale }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#2563eb]/0 group-hover:bg-[#2563eb]/80 transition-colors duration-500">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 text-white text-lg font-medium"
              >
                <span>View Project</span>
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
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className={`absolute bottom-0 left-0 right-0 ${compact ? "p-5" : "p-6 md:p-8"}`}>
            {/* Category & Year */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono text-zinc-400">0{index + 1}</span>
              <span className="w-4 h-px bg-zinc-600" />
              <span className="text-xs text-zinc-400 uppercase tracking-wider">
                {project.category}
              </span>
            </div>

            {/* Title */}
            <h3
              className={`font-semibold text-white mb-2 group-hover:text-white transition-colors ${
                compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl lg:text-4xl"
              }`}
            >
              {project.title}
            </h3>

            {/* Description - only on large cards */}
            {!compact && (
              <p className="text-zinc-400 text-sm md:text-base max-w-md mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {project.description}
              </p>
            )}

            {/* Result badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-sm rounded-full border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
              <span className="text-xs text-white font-medium">{project.results}</span>
            </div>
          </div>

          {/* Corner decoration */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
