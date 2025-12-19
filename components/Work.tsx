"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "Desert Wings Aviation",
    category: "Flight School",
    description: "A modern, conversion-focused website for Arizona's premier flight training academy featuring seamless booking integration and immersive aerial imagery.",
    url: "https://desert-wings-nextjs.vercel.app/",
    image: "/projects/desert-wings.jpg",
    year: "2024",
    results: "3x increase in student inquiries",
  },
  {
    id: 2,
    title: "Meridian Consulting",
    category: "Business Strategy",
    description: "Professional consulting firm website emphasizing trust, expertise, and measurable client outcomes through sophisticated design.",
    url: "#",
    image: "/projects/meridian.jpg",
    year: "2024",
    results: "40% improvement in lead quality",
  },
  {
    id: 3,
    title: "Apex Interiors",
    category: "Interior Design",
    description: "Elegant portfolio showcasing luxury residential and commercial interior design projects with immersive visual storytelling.",
    url: "#",
    image: "/projects/apex.jpg",
    year: "2024",
    results: "Featured in Design Weekly",
  },
];

function ProjectItem({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className="relative"
    >
      <Link
        href={project.url}
        target={project.url.startsWith("http") ? "_blank" : undefined}
        rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="group block"
      >
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isEven ? "" : "lg:direction-rtl"}`}>
          {/* Image */}
          <motion.div
            className={`relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-900 ${isEven ? "" : "lg:order-2"}`}
            style={{ y }}
          >
            {/* Placeholder gradient - replace with actual images */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />

            {/* Uncomment when you have images */}
            {/* <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            /> */}

            {/* Project number overlay */}
            <div className="absolute top-6 left-6">
              <span className="text-[120px] font-bold text-white/5 leading-none select-none">
                0{index + 1}
              </span>
            </div>

            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-[#2563eb]/90 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 text-lg font-medium"
                >
                  View Project
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className={`${isEven ? "" : "lg:order-1 lg:text-right"}`}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Meta */}
              <div className={`flex items-center gap-4 mb-4 text-sm text-zinc-500 ${isEven ? "" : "lg:justify-end"}`}>
                <span className="uppercase tracking-wider">{project.category}</span>
                <span className="w-1 h-1 rounded-full bg-zinc-600" />
                <span className="font-mono">{project.year}</span>
              </div>

              {/* Title with word-by-word reveal */}
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 group-hover:text-[#2563eb] transition-colors duration-300 overflow-hidden">
                {project.title.split(" ").map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-[0.25em]"
                    initial={{ y: "100%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h3>

              {/* Description */}
              <p className="text-zinc-400 text-lg leading-relaxed mb-6 max-w-lg">
                {project.description}
              </p>

              {/* Results */}
              <div className={`flex items-center gap-3 ${isEven ? "" : "lg:justify-end"}`}>
                <div className="w-8 h-px bg-[#2563eb]" />
                <span className="text-sm text-[#2563eb] font-medium">{project.results}</span>
              </div>

              {/* Arrow link */}
              <motion.div
                className={`mt-8 flex items-center gap-2 text-white ${isEven ? "" : "lg:justify-end"}`}
                initial={{ x: 0 }}
                whileHover={{ x: isEven ? 8 : -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {!isEven && (
                  <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
                <span className="text-sm font-medium uppercase tracking-wider">Explore</span>
                {isEven && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-32 md:py-48 bg-[#0a0a0a]">
      {/* Sticky section label */}
      <div className="hidden xl:block absolute left-8 top-48 h-[calc(100%-24rem)]">
        <div className="sticky top-1/2 -rotate-90 origin-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 whitespace-nowrap">
            Featured Projects
          </span>
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 md:mb-32"
        >
          <div className="flex items-center gap-4 mb-6">
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

          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <div className="overflow-hidden">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight"
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                Recent Projects
              </motion.h2>
            </div>
            <motion.p
              className="text-zinc-400 text-lg lg:text-right"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Crafting digital experiences that drive real business results.
            </motion.p>
          </div>
        </motion.div>

        {/* Projects */}
        <div className="space-y-32 md:space-y-48">
          {projects.map((project, index) => (
            <ProjectItem key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 md:mt-48 text-center"
        >
          <p className="text-zinc-500 mb-6">Have a project in mind?</p>
          <Link href="#contact">
            <motion.span
              className="inline-flex items-center gap-4 text-2xl md:text-3xl font-semibold text-white hover:text-[#2563eb] transition-colors"
              whileHover={{ x: 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              Let&apos;s work together
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
