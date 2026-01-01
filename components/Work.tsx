"use client";

import { motion, useScroll, useTransform, MotionValue, useInView } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Smooth easing curve
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const workItems = [
  {
    title: "Desert Wings",
    category: "Aviation",
    description: "A modern, conversion-focused website for Arizona's premier flight training academy.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
    url: "https://www.desertwingsflightschool.com",
  },
  {
    title: "Meridian",
    category: "Consulting",
    description: "Professional consulting firm website emphasizing trust and expertise.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
    url: "#",
  },
  {
    title: "Apex Interiors",
    category: "Design",
    description: "Elegant portfolio showcasing luxury interior design projects.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    url: "#",
  },
  {
    title: "Northside",
    category: "Healthcare",
    description: "Modern healthcare platform focused on patient experience.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
    url: "#",
  },
  {
    title: "Vertex Labs",
    category: "Technology",
    description: "Cutting-edge tech startup showcasing innovation and growth.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    url: "#",
  },
  {
    title: "CloudScale",
    category: "SaaS",
    description: "Enterprise SaaS platform with seamless functionality and intelligent UX.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
    url: "#",
  },
  {
    title: "Elevate Fitness",
    category: "Wellness",
    description: "Premium fitness brand with vibrant design and creative content.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80",
    url: "#",
  },
  {
    title: "Artisan Coffee",
    category: "Hospitality",
    description: "Transforming a local coffee brand with premium design.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    url: "#",
  },
];

// Project card with hover effects and subtle glow
function ProjectCard({
  project,
  index,
  aspectRatio = "4/5"
}: {
  project: typeof workItems[0];
  index: number;
  aspectRatio?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Link
        href={project.url}
        target={project.url.startsWith("http") ? "_blank" : undefined}
        rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
      >
        {/* Image container with glow and border */}
        <div
          className="relative overflow-hidden rounded-xl bg-zinc-900 border border-zinc-700 mb-4"
          style={{
            aspectRatio,
            boxShadow: "0 0 60px 10px rgba(255, 220, 180, 0.09)",
          }}
        >
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
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-blue-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-md text-white text-xs uppercase tracking-wider rounded-full">
              {project.category}
            </span>
          </div>

          {/* View indicator */}
          <motion.div
            className="absolute bottom-4 right-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Title & Description */}
        <motion.h3
          className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors duration-300 mb-2"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {project.title}
        </motion.h3>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          {project.description}
        </p>
      </Link>
    </motion.div>
  );
}

// Parallax column component
function ParallaxColumn({
  items,
  yOffset,
  startIndex = 0
}: {
  items: typeof workItems;
  yOffset: MotionValue<number>;
  startIndex?: number;
}) {
  // Alternate aspect ratios for visual interest
  const aspectRatios = ["4/5", "3/4", "4/5", "3/4"];

  return (
    <motion.div
      className="flex flex-col gap-6 md:gap-8"
      style={{ y: yOffset }}
    >
      {items.map((item, i) => (
        <ProjectCard
          key={item.title}
          project={item}
          index={startIndex + i}
          aspectRatio={aspectRatios[i % aspectRatios.length]}
        />
      ))}
    </motion.div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Section entrance animation
  const { scrollYProgress: entranceProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(entranceProgress, [0, 1], [0.92, 1]);
  const borderRadius = useTransform(entranceProgress, [0, 1], [48, 0]);
  const margin = useTransform(entranceProgress, [0, 1], [32, 0]);

  // Parallax for columns
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Columns scroll in opposite directions at same speed
  const col1Y = useTransform(scrollYProgress, [0, 1], [0, 300]); // moves down
  const col2Y = useTransform(scrollYProgress, [0, 1], [0, -300]); // moves up

  // Split items into two columns
  const column1Items = [workItems[0], workItems[2], workItems[4], workItems[6]];
  const column2Items = [workItems[1], workItems[3], workItems[5], workItems[7]];

  return (
    <div ref={sectionRef} className="relative z-10 bg-[#0a0a0a]">
      <motion.section
        id="work"
        className="relative bg-[#111111] py-24 md:py-32 overflow-hidden"
        style={{
          scale,
          borderRadius,
          marginLeft: margin,
          marginRight: margin,
        }}
      >
        {/* Header */}
        <div className="px-6 md:px-12 lg:px-20 mb-8 md:mb-12">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: smoothEase }}
                  className="text-blue-500 text-sm font-medium tracking-wider uppercase mb-4"
                >
                  Selected Work
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase"
                >
                  Recent
                </motion.h2>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
                  className="text-5xl md:text-6xl lg:text-7xl font-black text-blue-600 tracking-tight uppercase"
                >
                  Projects
                </motion.h2>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3, ease: smoothEase }}
              >
                <Link
                  href="#contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300"
                >
                  Start a project
                  <span>→</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Parallax Grid */}
        <div ref={containerRef} className="px-6 md:px-12 lg:px-20">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
              {/* Column 1 - moves down */}
              <ParallaxColumn
                items={column1Items}
                yOffset={col1Y}
                startIndex={0}
              />

              {/* Column 2 - moves up, starts offset for visual interest */}
              <div className="md:mt-24">
                <ParallaxColumn
                  items={column2Items}
                  yOffset={col2Y}
                  startIndex={4}
                />
              </div>
            </div>
          </div>
        </div>

      </motion.section>
    </div>
  );
}

// Stats section - exported separately
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
