"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "Desert Wings Aviation",
    category: "Flight School",
    description:
      "A modern, conversion-focused website for Arizona's premier flight training academy featuring seamless booking integration and immersive aerial imagery.",
    url: "https://desert-wings-nextjs.vercel.app/",
    image: "/projects/desert-wings.jpg",
    year: "2024",
    results: "3x increase in student inquiries",
  },
  {
    id: 2,
    title: "Meridian Consulting",
    category: "Business Strategy",
    description:
      "Professional consulting firm website emphasizing trust, expertise, and measurable client outcomes through sophisticated design.",
    url: "#",
    image: "/projects/meridian.jpg",
    year: "2024",
    results: "40% improvement in lead quality",
  },
  {
    id: 3,
    title: "Apex Interiors",
    category: "Interior Design",
    description:
      "Elegant portfolio showcasing luxury residential and commercial interior design projects with immersive visual storytelling.",
    url: "#",
    image: "/projects/apex.jpg",
    year: "2024",
    results: "Featured in Design Weekly",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.8]);

  return (
    <motion.div ref={ref} style={{ opacity }} className="relative group">
      <Link
        href={project.url}
        target={project.url.startsWith("http") ? "_blank" : undefined}
        rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block"
      >
        <motion.div
          style={{ scale }}
          className="relative rounded-2xl overflow-hidden bg-zinc-900 aspect-[16/10]"
        >
          {/* Placeholder gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black"
            style={{ y }}
          />

          {/* Project number */}
          <div className="absolute top-6 left-6 z-10">
            <span className="text-sm font-mono text-zinc-500">
              0{index + 1}
            </span>
          </div>

          {/* Category tag */}
          <div className="absolute top-6 right-6 z-10">
            <motion.span
              className="px-3 py-1 text-xs font-medium text-zinc-400 bg-zinc-800/80 backdrop-blur-sm rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              {project.category}
            </motion.span>
          </div>

          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-[#2563eb]/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileHover={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-white"
            >
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
            </motion.div>
          </motion.div>

          {/* Content overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2 group-hover:text-[#2563eb] transition-colors">
              {project.title}
            </h3>
            <p className="text-zinc-400 text-sm line-clamp-2 max-w-md">
              {project.description}
            </p>
          </div>
        </motion.div>

        {/* Results badge */}
        <motion.div
          className="flex items-center gap-2 mt-4"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
          <span className="text-sm text-[#2563eb] font-medium">
            {project.results}
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function Work() {
  return (
    <section id="work" className="relative py-32 md:py-40 bg-[#0a0a0a]">
      <div className="relative z-10 px-6 md:px-12 lg:px-16 xl:px-24 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24"
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
              Case Studies
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 items-end">
            <div className="overflow-hidden">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight"
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                Selected{" "}
                <span className="font-serif italic text-[#2563eb]">work</span>
              </motion.h2>
            </div>
            <motion.p
              className="text-zinc-400 text-lg lg:text-right max-w-md lg:ml-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Crafting digital experiences that drive real business results.
            </motion.p>
          </div>
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}

          {/* View all card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="#contact"
              className="group flex flex-col justify-between h-full min-h-[300px] rounded-2xl border border-zinc-800 hover:border-[#2563eb] transition-colors p-8"
            >
              <div>
                <span className="text-sm text-zinc-500">Have a project?</span>
              </div>
              <div>
                <motion.h3
                  className="text-3xl md:text-4xl font-semibold text-white mb-4 group-hover:text-[#2563eb] transition-colors"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Let&apos;s work{" "}
                  <span className="font-serif italic">together</span>
                </motion.h3>
                <div className="flex items-center gap-2 text-zinc-400 group-hover:text-[#2563eb] transition-colors">
                  <span>Start a project</span>
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </motion.svg>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
