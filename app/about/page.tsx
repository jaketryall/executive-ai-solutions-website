"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { TransitionLink } from "@/components/PageTransition";
import Footer from "@/components/Footer";
import { useSound } from "@/components/SoundManager";

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";

// Values data
const values = [
  {
    number: "01",
    title: "Craft Over Speed",
    description:
      "We take the time to do things right. Every pixel, every line of code, every interaction is considered and refined.",
  },
  {
    number: "02",
    title: "Strategy First",
    description:
      "Beautiful design without purpose is decoration. We start with understanding before we start creating.",
  },
  {
    number: "03",
    title: "Lasting Impact",
    description:
      "We build for the long term. Our work should still be relevant, performant, and effective years from now.",
  },
  {
    number: "04",
    title: "True Partnership",
    description:
      "We're not vendors. We're collaborators invested in your success, treating your business as our own.",
  },
];

// Stats data
const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "8", label: "Years Experience" },
  { value: "96%", label: "Client Retention" },
  { value: "12", label: "Industry Awards" },
];

// Text reveal animation component
function RevealText({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.span
      className="inline-block"
      initial={{ y: "100%", opacity: 0 }}
      whileInView={{ y: "0%", opacity: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {children}
    </motion.span>
  );
}

// Section component with reveal animation
function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.section>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const { play } = useSound();

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <>
      <Navbar />
      <main ref={containerRef} className="relative bg-[#0a0908]" style={{ zIndex: 10 }}>
        {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(255, 200, 150, 0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.p
            className="text-xs uppercase tracking-[0.4em] mb-8"
            style={{ color: accentColorMuted }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About Us
          </motion.p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-[-0.03em] mb-8">
            <span className="block overflow-hidden">
              <RevealText delay={0.3}>We build digital</RevealText>
            </span>
            <span className="block overflow-hidden">
              <RevealText delay={0.4}>
                experiences that{" "}
                <span style={{ color: accentColor }}>matter</span>
              </RevealText>
            </span>
          </h1>

          <motion.p
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            We're a team of strategists, designers, and developers who believe
            that exceptional digital experiences can transform businesses.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div
                className="w-1 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Story Section */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-sm"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Our team at work"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-transparent" />

              {/* Decorative corner */}
              <div
                className="absolute top-4 left-4 w-12 h-12"
                style={{ borderTop: `1px solid ${accentColorMuted}`, borderLeft: `1px solid ${accentColorMuted}` }}
              />
            </motion.div>

            {/* Text */}
            <div>
              <motion.p
                className="text-xs uppercase tracking-[0.3em] mb-4"
                style={{ color: accentColorMuted }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Our Story
              </motion.p>

              <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.02em] mb-8 leading-tight">
                Started with a simple belief: digital should feel human.
              </h2>

              <div className="space-y-6 text-white/60 leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  In a world of template-driven, cookie-cutter websites, we saw
                  an opportunity to do something different. We believed that
                  digital experiences could be both beautiful and effective,
                  both innovative and accessible.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  Today, we're a team of curious minds who obsess over the
                  details that others overlook. We've helped businesses across
                  industries transform their digital presence and, in doing so,
                  transform their results.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  We're not here to churn out projects. We're here to build
                  digital legacies that stand the test of time.
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Values Section */}
      <Section className="py-32 px-6 md:px-12 lg:px-20 relative">
        {/* Background accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 70% 50%, rgba(255, 200, 150, 0.04) 0%, transparent 60%)`,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.p
              className="text-xs uppercase tracking-[0.3em] mb-4"
              style={{ color: accentColorMuted }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Our Values
            </motion.p>

            <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.03em]">
              What guides us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.number}
                className="group relative p-8 rounded-sm border border-white/5 hover:border-white/10 transition-colors"
                style={{
                  background: "rgba(255,255,255,0.02)",
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => play("hover", { volume: 0.05 })}
              >
                {/* Number */}
                <span
                  className="text-6xl font-black block mb-4"
                  style={{ color: accentColorMuted, opacity: 0.3 }}
                >
                  {value.number}
                </span>

                <h3 className="text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>

                <p className="text-white/50 leading-relaxed">
                  {value.description}
                </p>

                {/* Hover accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-px"
                  style={{ backgroundColor: accentColor }}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="py-32 px-6 md:px-12 lg:px-20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <span
                  className="text-5xl md:text-6xl font-black block mb-2"
                  style={{ color: accentColor }}
                >
                  {stat.value}
                </span>
                <span className="text-white/40 text-sm uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Philosophy Section */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            className="text-xs uppercase tracking-[0.3em] mb-8"
            style={{ color: accentColorMuted }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Our Philosophy
          </motion.p>

          <motion.blockquote
            className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-[-0.02em] mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            "The best digital experiences are the ones that feel{" "}
            <span style={{ color: accentColor }}>inevitable</span>—where every
            element earns its place."
          </motion.blockquote>

          <motion.div
            className="w-16 h-px mx-auto"
            style={{ backgroundColor: accentColorMuted }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
          />
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.03em] mb-6">
            Ready to start your project?
          </h2>

          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            We're always looking for ambitious projects and great people to work
            with. Let's create something remarkable together.
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
              <span className="text-white font-medium">Get in touch</span>
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
