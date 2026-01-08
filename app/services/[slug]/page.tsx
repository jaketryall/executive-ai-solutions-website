"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, use } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";
import { services, getServiceBySlug, getRelatedProjects } from "@/lib/data";

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

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

export default function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const service = getServiceBySlug(slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  if (!service) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(service.relatedProjects);

  // Get next and prev services
  const currentIndex = services.findIndex((s) => s.slug === slug);
  const prevService = currentIndex > 0 ? services[currentIndex - 1] : null;
  const nextService =
    currentIndex < services.length - 1 ? services[currentIndex + 1] : null;

  return (
    <>
      <Navbar />
      <main ref={containerRef} className="relative bg-[#0a0908]" style={{ zIndex: 10 }}>
        {/* Hero Section */}
      <motion.section
        className="relative h-[80vh] flex items-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(255, 200, 150, 0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Large background number */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none overflow-hidden">
          <motion.span
            className="text-[40vw] font-black leading-none select-none"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.03)",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {service.number}
          </motion.span>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 max-w-4xl">
          {/* Service number */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span
              className="text-6xl font-black"
              style={{ color: accentColor }}
            >
              {service.number}
            </span>
            <div
              className="h-px flex-1 max-w-32"
              style={{
                background: `linear-gradient(to right, ${accentColorMuted}, transparent)`,
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-[-0.03em] mb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {service.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/40 italic mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {service.subtitle}
          </motion.p>

          {/* Short description */}
          <motion.p
            className="text-white/60 text-lg max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {service.description}
          </motion.p>
        </div>
      </motion.section>

      {/* Long Description */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-8"
            style={{ color: accentColorMuted }}
          >
            What We Do
          </p>
          <p className="text-2xl md:text-3xl text-white/80 leading-relaxed">
            {service.longDescription}
          </p>
        </div>
      </Section>

      {/* Benefits */}
      <Section className="py-32 px-6 md:px-12 lg:px-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
              >
                What You Get
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.02em]">
                Benefits
              </h2>
            </div>

            <div className="space-y-6">
              {service.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: accentColor }}
                  />
                  <p className="text-white/70 text-lg">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: accentColorMuted }}
            >
              How We Work
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.03em]">
              The Process
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px hidden md:block"
              style={{
                background: `linear-gradient(to bottom, transparent, ${accentColorMuted}, transparent)`,
              }}
            />

            <div className="space-y-16">
              {service.process.map((step, index) => (
                <motion.div
                  key={step.step}
                  className={`relative grid md:grid-cols-2 gap-8 ${
                    index % 2 === 0 ? "" : "md:direction-rtl"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Step indicator */}
                  <div
                    className="absolute left-8 md:left-1/2 top-0 w-4 h-4 rounded-full -translate-x-1/2 hidden md:block"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 0 20px ${accentColor}`,
                    }}
                  />

                  {/* Content */}
                  <div
                    className={`${
                      index % 2 === 0
                        ? "md:text-right md:pr-16"
                        : "md:col-start-2 md:pl-16"
                    }`}
                  >
                    <span
                      className="text-5xl font-black block mb-2"
                      style={{ color: accentColorMuted, opacity: 0.3 }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {step.step}
                    </h3>
                    <p className="text-white/50 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <Section className="py-32 px-6 md:px-12 lg:px-20 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
              >
                See It In Action
              </p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.02em]">
                Related Work
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {relatedProjects.map((project, index) => (
                <TransitionLink key={project.slug} href={`/work/${project.slug}`}>
                  <motion.div
                    className="group relative aspect-[16/10] overflow-hidden rounded-sm cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onMouseEnter={() => play("hover", { volume: 0.05 })}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/50 to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6">
                      <p
                        className="text-xs uppercase tracking-wider mb-2"
                        style={{ color: accentColor }}
                      >
                        {project.category}
                      </p>
                      <h3 className="text-2xl font-black text-white">
                        {project.title}
                      </h3>
                    </div>
                  </motion.div>
                </TransitionLink>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Service Navigation */}
      <Section className="py-16 px-6 md:px-12 lg:px-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Prev */}
            {prevService ? (
              <TransitionLink href={`/services/${prevService.slug}`}>
                <motion.div
                  className="group flex items-center gap-4"
                  whileHover={{ x: -8 }}
                  onMouseEnter={() => play("hover", { volume: 0.05 })}
                >
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider">
                      Previous
                    </p>
                    <p className="text-white font-medium">
                      {prevService.title}
                    </p>
                  </div>
                </motion.div>
              </TransitionLink>
            ) : (
              <div />
            )}

            {/* Next */}
            {nextService ? (
              <TransitionLink href={`/services/${nextService.slug}`}>
                <motion.div
                  className="group flex items-center gap-4"
                  whileHover={{ x: 8 }}
                  onMouseEnter={() => play("hover", { volume: 0.05 })}
                >
                  <div className="text-right">
                    <p className="text-white/40 text-xs uppercase tracking-wider">
                      Next
                    </p>
                    <p className="text-white font-medium">
                      {nextService.title}
                    </p>
                  </div>
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </motion.div>
              </TransitionLink>
            ) : (
              <div />
            )}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.02em] mb-6">
            Ready to get started?
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Let's discuss how our {service.title.toLowerCase()} services can
            help transform your digital presence.
          </p>

          <TransitionLink href="/contact">
            <motion.button
              className="group inline-flex items-center gap-4 px-8 py-4 rounded-full border border-white/10 hover:border-white/20 transition-colors"
              style={{ background: "rgba(255,255,255,0.03)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => play("hover", { volume: 0.06 })}
              onClick={() => play("click")}
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
      </Section>
      </main>
      <Footer />
    </>
  );
}
