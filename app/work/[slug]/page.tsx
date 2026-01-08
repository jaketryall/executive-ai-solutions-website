"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";
import { projects, getProjectBySlug, getNextProject } from "@/lib/data";

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Animated counter component
function AnimatedCounter({ value }: { value: string }) {
  // Extract number and suffix
  const match = value.match(/^([+-]?)(\d+)(.*)/);
  if (!match) return <span>{value}</span>;

  const [, prefix, num, suffix] = match;
  const number = parseInt(num);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {number}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

// Section reveal component
function Section({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.section>
  );
}

export default function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const project = getProjectBySlug(slug);
  const nextProject = getNextProject(slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(heroProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(heroProgress, [0, 0.5], [1, 0]);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main ref={containerRef} className="relative bg-[#0a0908]" style={{ zIndex: 10 }}>
        {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-screen overflow-hidden"
      >
        {/* Background image with parallax */}
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908]/80 to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 md:px-12 lg:px-20"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-4xl">
            {/* Category and year */}
            <motion.div
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: accentColor }}
              >
                {project.category}
              </span>
              <span className="text-white/30">—</span>
              <span className="text-white/50 text-sm">{project.year}</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-[-0.03em] mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {project.title}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-xl md:text-2xl text-white/60 italic max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {project.tagline}
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Overview Section */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Description */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
              >
                Overview
              </p>
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-8">
              {project.metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span
                    className="text-4xl md:text-5xl font-black block mb-2"
                    style={{ color: accentColor }}
                  >
                    <AnimatedCounter value={metric.value} />
                  </span>
                  <span className="text-white/40 text-sm uppercase tracking-wider">
                    {metric.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Challenge & Solution */}
      <Section className="py-32 px-6 md:px-12 lg:px-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Challenge */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
              >
                The Challenge
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                {project.challenge}
              </p>
            </div>

            {/* Solution */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
              >
                The Solution
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Gallery */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-12 text-center"
            style={{ color: accentColorMuted }}
          >
            Project Gallery
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {project.gallery.map((image, index) => (
              <motion.div
                key={image}
                className={`relative overflow-hidden rounded-sm ${
                  index === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Image
                  src={image}
                  alt={`${project.title} - Image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonial */}
      <Section className="py-32 px-6 md:px-12 lg:px-20 relative">
        {/* Background accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255, 200, 150, 0.04) 0%, transparent 60%)`,
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            className="w-16 h-px mx-auto mb-12"
            style={{ backgroundColor: accentColorMuted }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
          />

          <motion.blockquote
            className="text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            "{project.testimonial.quote}"
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-white font-medium">
              {project.testimonial.author}
            </p>
            <p className="text-white/40 text-sm">{project.testimonial.role}</p>
          </motion.div>
        </div>
      </Section>

      {/* Results */}
      <Section className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-4"
            style={{ color: accentColorMuted }}
          >
            The Result
          </p>
          <h2
            className="text-6xl md:text-8xl font-black tracking-[-0.03em] mb-4"
            style={{ color: accentColor }}
          >
            {project.result}
          </h2>
          <p className="text-white/40 text-lg">
            {project.metrics[0]?.label || "Key Achievement"}
          </p>
        </div>
      </Section>

      {/* Next Project */}
      {nextProject && (
        <Section className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/5">
          <TransitionLink href={`/work/${nextProject.slug}`}>
            <motion.div
              className="max-w-6xl mx-auto group cursor-pointer"
              whileHover={{ x: 20 }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => play("hover", { volume: 0.05 })}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.3em] mb-4"
                    style={{ color: accentColorMuted }}
                  >
                    Next Project
                  </p>
                  <h3 className="text-4xl md:text-6xl font-black text-white tracking-[-0.03em] group-hover:text-white/80 transition-colors">
                    {nextProject.title}
                  </h3>
                  <p className="text-white/40 italic mt-2">
                    {nextProject.tagline}
                  </p>
                </div>

                <motion.div
                  className="hidden md:flex items-center gap-4"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span
                    className="w-16 h-16 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.div>
              </div>

              {/* Progress line on hover */}
              <motion.div
                className="h-px mt-8 origin-left"
                style={{ backgroundColor: accentColor }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          </TransitionLink>
        </Section>
      )}
      </main>
      <Footer />
    </>
  );
}
