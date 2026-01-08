"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";
import { projects } from "@/lib/data";

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Project card component
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { play } = useSound();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <TransitionLink href={`/work/${project.slug}`}>
        <motion.article
          className="group relative cursor-pointer"
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.05 });
          }}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4 }}
        >
          {/* Image container */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-6">
            {/* Warm glow on hover */}
            <motion.div
              className="absolute -inset-20 pointer-events-none z-0"
              style={{
                background: `radial-gradient(ellipse at center, ${project.warmColor.replace("0.12", "0.3")} 0%, transparent 60%)`,
                filter: "blur(60px)",
              }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.6 }}
            />

            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-transparent opacity-60" />

            {/* Category badge */}
            <motion.div
              className="absolute top-4 left-4 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm"
              style={{ background: "rgba(0,0,0,0.5)" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white/80 text-xs uppercase tracking-wider">
                {project.category}
              </span>
            </motion.div>

            {/* Year */}
            <div className="absolute top-4 right-4 text-white/40 text-sm tracking-wider">
              {project.year}
            </div>

            {/* View project indicator */}
            <motion.div
              className="absolute bottom-4 right-4 flex items-center gap-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white text-sm">View Project</span>
              <motion.span
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: accentColor }}
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.span>
            </motion.div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            {/* Number and title */}
            <div className="flex items-baseline gap-4">
              <span
                className="text-3xl font-black"
                style={{ color: accentColorMuted, opacity: 0.5 }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-[-0.02em] group-hover:text-white/90 transition-colors">
                {project.title}
              </h2>
            </div>

            {/* Tagline */}
            <p className="text-white/40 italic">{project.tagline}</p>

            {/* Result metric */}
            <div className="flex items-center gap-2 pt-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-white/60 text-sm">{project.result}</span>
            </div>
          </div>

          {/* Bottom accent line on hover */}
          <motion.div
            className="absolute -bottom-4 left-0 right-0 h-px origin-left"
            style={{ backgroundColor: accentColor }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        </motion.article>
      </TransitionLink>
    </motion.div>
  );
}

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <>
      <Navbar />
      <main ref={containerRef} className="relative bg-[#0a0908]" style={{ zIndex: 10 }}>
        {/* Hero Section */}
      <motion.section
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(255, 200, 150, 0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Large background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span
            className="text-[25vw] font-black tracking-[-0.04em] select-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.03)",
              WebkitTextFillColor: "transparent",
            }}
          >
            WORK
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p
            className="text-xs uppercase tracking-[0.4em] mb-6"
            style={{ color: accentColorMuted }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Selected Projects
          </motion.p>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-[-0.03em] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            The proof is in
            <br />
            <span style={{ color: accentColor }}>the work</span>
          </motion.h1>

          <motion.p
            className="text-white/50 text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            A curated selection of projects where strategy, design, and
            development came together to create exceptional results.
          </motion.p>
        </div>
      </motion.section>

      {/* Projects Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/5"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.02em] mb-6">
            Have a project in mind?
          </h2>

          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            We're always excited to work on ambitious projects. Let's discuss
            how we can help bring your vision to life.
          </p>

          <TransitionLink href="/contact">
            <motion.button
              className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 hover:border-white/20 transition-colors"
              style={{ background: "rgba(255,255,255,0.03)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white font-medium">Start a project</span>
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
                style={{ backgroundColor: accentColor }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </motion.button>
          </TransitionLink>
        </div>
      </motion.section>
      </main>
      <Footer />
    </>
  );
}
