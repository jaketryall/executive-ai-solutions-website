"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";
import { projects } from "@/lib/data";

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Animated border component - accent border by default, glow on hover
function AnimatedBorder({ isHovered }: { isHovered: boolean }) {
  return (
    <>
      {/* Accent color border - always visible */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-30"
        style={{
          border: `1px solid ${accentColorMuted}`,
        }}
      />
      {/* Extra glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          border: `1px solid ${accentColor}`,
          boxShadow: `0 0 20px ${accentColorMuted}, 0 0 40px rgba(255, 200, 150, 0.2)`,
        }}
      />
    </>
  );
}

// Project card component - clean, image-forward design
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
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <TransitionLink href={`/work/${project.slug}`}>
        <motion.article
          className="group relative cursor-pointer"
          onMouseEnter={() => {
            setIsHovered(true);
            play("hover", { volume: 0.05 });
          }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Card container */}
          <div
            className="relative overflow-hidden rounded-xl"
            style={{
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {/* Animated border on hover */}
            <AnimatedBorder isHovered={isHovered} />
            {/* Image container */}
            <div className="relative overflow-hidden aspect-4/3">
              {/* Year badge - top right */}
              <div className="absolute top-5 right-6 z-20">
                <span className="text-white/40 text-sm font-medium tracking-wide">
                  {project.year}
                </span>
              </div>

              {/* Main image */}
              <motion.div
                className="absolute inset-0"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className={project.image.includes("Mockup") ? "object-cover object-top" : "object-cover"}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index < 2}
                />
              </motion.div>

              {/* Gradient overlay - stronger at bottom */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,9,8,0.95) 0%, rgba(10,9,8,0.5) 30%, rgba(10,9,8,0.1) 60%, transparent 100%)",
                }}
              />

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at center bottom, ${project.warmColor.replace("0.12", "0.25")} 0%, transparent 70%)`,
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4 }}
              />

              {/* Content overlay */}
              <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                {/* Title and category */}
                <div>
                  <motion.h2
                    className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1"
                    animate={{ y: isHovered ? -4 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {project.title}
                  </motion.h2>
                  <motion.p
                    className="text-white/50 text-sm uppercase tracking-wider"
                    animate={{ y: isHovered ? -4 : 0 }}
                    transition={{ duration: 0.3, delay: 0.02 }}
                  >
                    {project.category}
                  </motion.p>
                </div>

                {/* View Project button - appears on hover */}
                <motion.div
                  className="absolute bottom-6 right-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <span className="text-white text-sm font-medium tracking-wide">
                      SEE PROJECT
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.article>
      </TransitionLink>
    </motion.div>
  );
}

export default function WorkPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* CSS for floating background animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10%, 5%) rotate(1deg);
          }
          50% {
            transform: translate(5%, 10%) rotate(-1deg);
          }
          75% {
            transform: translate(-5%, 5%) rotate(0.5deg);
          }
        }
      `}</style>

      <Navbar />
      <main ref={containerRef} className="relative bg-[#0a0908] overflow-hidden" style={{ zIndex: 10 }}>
        {/* Moving background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {/* Large gradient orb 1 */}
          <div
            className="absolute w-[800px] h-[800px] rounded-full opacity-30"
            style={{
              background: `radial-gradient(circle, ${accentColorMuted} 0%, transparent 70%)`,
              top: "-20%",
              right: "-10%",
              filter: "blur(80px)",
              animation: "float 20s ease-in-out infinite",
            }}
          />
          {/* Large gradient orb 2 */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, rgba(255, 180, 120, 0.4) 0%, transparent 70%)`,
              bottom: "10%",
              left: "-15%",
              filter: "blur(60px)",
              animation: "float 25s ease-in-out infinite reverse",
            }}
          />
          {/* Smaller accent orb */}
          <div
            className="absolute w-[400px] h-[400px] rounded-full opacity-15"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
              top: "40%",
              left: "60%",
              filter: "blur(100px)",
              animation: "float 18s ease-in-out infinite",
              animationDelay: "-5s",
            }}
          />
        </div>

        {/* Minimal Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            {/* Label */}
            <motion.p
              className="text-xs uppercase tracking-[0.3em] mb-6"
              style={{ color: accentColorMuted }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Projects
            </motion.p>

            {/* Title */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-[-0.03em]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Selected work
            </motion.h1>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="pb-24 md:pb-32 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            {/* 2-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {projects.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Have a project in mind?
            </motion.h2>

            <motion.p
              className="text-white/50 text-lg mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Let's talk about what you're building.
            </motion.p>

            <TransitionLink href="/contact">
              <motion.button
                className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-white font-medium">Contact me</span>
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5"
                  style={{ backgroundColor: accentColor }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.button>
            </TransitionLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
