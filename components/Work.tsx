"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Animated grid background component
function AnimatedGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });

  const gridX = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.4, 0.4, 0]);

  return (
    <motion.div
      ref={gridRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity }}
    >
      {/* Main grid that moves */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: gridX,
          y: gridY,
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Secondary grid layer moving opposite direction */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: useTransform(gridX, (x) => -x * 0.5),
          y: useTransform(gridY, (y) => -y * 0.5),
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
        }}
      />

      {/* Accent dots at intersections */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: useTransform(gridX, (x) => x * 0.3),
          y: useTransform(gridY, (y) => y * 0.3),
          backgroundImage: `radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient fade at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
    </motion.div>
  );
}

export const workItems = [
  {
    title: "Desert Wings",
    category: "Aviation",
    description: "A modern, conversion-focused website for Arizona's premier flight training academy.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80",
    url: "https://www.desertwingsflightschool.com",
    results: "3x increase in inquiries",
    year: "2024",
  },
  {
    title: "Meridian",
    category: "Consulting",
    description: "Professional consulting firm website emphasizing trust and expertise.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    url: "#",
    results: "40% more leads",
    year: "2024",
  },
  {
    title: "Apex Interiors",
    category: "Design",
    description: "Elegant portfolio showcasing luxury interior design projects.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
    url: "#",
    results: "Featured in Design Weekly",
    year: "2023",
  },
  {
    title: "Northside",
    category: "Healthcare",
    description: "Modern healthcare platform focused on patient experience.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80",
    url: "#",
    results: "50% faster booking",
    year: "2023",
  },
];

function ProjectCard({ project, index }: { project: typeof workItems[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={project.url}
        target={project.url.startsWith("http") ? "_blank" : undefined}
        rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="group block"
      >
        {/* Image */}
        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 mb-6">
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* View button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="px-6 py-3 bg-white text-black font-medium rounded-full"
              initial={{ y: 20 }}
              animate={{ y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              View Project
            </motion.div>
          </motion.div>

          {/* Category tag */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <motion.h3
              className="text-2xl font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors duration-300"
              animate={{ x: isHovered ? 8 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.title}
            </motion.h3>
            <p className="text-zinc-600">{project.description}</p>
          </div>

          <motion.div
            className="mt-1 text-zinc-400 group-hover:text-blue-600 transition-colors"
            animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </motion.div>
        </div>

        {/* Result */}
        <div className="mt-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span className="text-sm text-zinc-500">{project.results}</span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const margin = useTransform(scrollYProgress, [0, 1], [32, 0]);

  return (
    <div ref={sectionRef} className="relative z-10 bg-[#0a0a0a]">
      <motion.section
        id="work"
        className="relative bg-[#f5f5f0] py-32"
        style={{
          scale,
          borderRadius,
          marginLeft: margin,
          marginRight: margin,
        }}
      >

      <div className="relative z-10 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Sticky sidebar layout */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Sticky sidebar */}
            <div className="lg:w-[320px] lg:shrink-0">
              <div className="lg:sticky lg:top-32">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-blue-500 text-sm font-medium tracking-wider uppercase mb-4"
                >
                  Selected Work
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-light text-zinc-900 mb-6 tracking-tight uppercase"
                >
                  Recent Projects
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-zinc-600 mb-8 leading-relaxed"
                >
                  A selection of our favorite projects, crafted with care for clients who demand excellence.
                </motion.p>

                {/* Stats in sidebar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-2 gap-6 mb-8"
                >
                  <div>
                    <p className="text-3xl font-bold text-zinc-900">50+</p>
                    <p className="text-sm text-zinc-500">Projects</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-zinc-900">98%</p>
                    <p className="text-sm text-zinc-500">Satisfaction</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Link
                    href="#contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    Start a project
                    <span>→</span>
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Projects column */}
            <div className="flex-1">
              <div className="flex flex-col gap-12">
                {workItems.map((project, index) => (
                  <ProjectCard key={project.title} project={project} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
    </div>
  );
}

// Stats section
export function WorkStats() {
  const stats = [
    { value: "50+", label: "Projects Delivered" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "2x", label: "Average ROI" },
    { value: "14", label: "Days Avg. Delivery" },
  ];

  return (
    <section className="relative bg-[#0a0a0a] py-20 border-t border-zinc-800">
      <div className="px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-zinc-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
