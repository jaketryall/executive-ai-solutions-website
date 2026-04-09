"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";
import { projects } from "@/lib/data";
import { SplitText, useSplitTextReveal } from "@/lib/hooks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  const heroRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // SplitText reveal for hero headline
  useSplitTextReveal(heroRef);

  // GSAP scroll animations
  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Project cards scrub-stagger in
      const cards = document.querySelectorAll(".work-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 60%",
              scrub: 0.4,
            },
          }
        );
      });

      // CTA section
      const ctaElements = document.querySelectorAll(".work-cta-reveal");
      ctaElements.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 65%",
              scrub: 0.4,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main
        ref={containerRef}
        className="relative bg-[#0a0908] overflow-hidden"
        style={{ zIndex: 10 }}
      >
        {/* Hero */}
        <section ref={heroRef} className="pt-36 pb-20 md:pt-44 md:pb-28 px-6 md:px-12 lg:px-20">
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

            {/* Title — SplitText letter reveal */}
            <SplitText
              text={"Selected\nwork"}
              as="h1"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(4rem, 10vw, 9rem)",
                fontWeight: 900,
                color: "#f5f0e8",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
              }}
            />

            {/* Subtitle */}
            <motion.p
              className="text-white/30 text-lg mt-8 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              A selection of projects crafted with precision and purpose.
            </motion.p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="pb-32 md:pb-40 px-6 md:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {projects.map((project, i) => (
                <div key={project.slug} className="work-card">
                  <ProjectCard project={project} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 md:py-36 px-6 md:px-12 lg:px-20 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="work-cta-reveal text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-[-0.03em] mb-6"
            >
              Have a project in mind?
            </h2>

            <p className="work-cta-reveal text-white/40 text-lg mb-12 max-w-xl mx-auto">
              Let&apos;s talk about what you&apos;re building.
            </p>

            <div className="work-cta-reveal">
              <TransitionLink href="/contact">
                <motion.button
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white font-semibold text-sm uppercase tracking-[0.12em]">Start a project</span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.button>
              </TransitionLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
