"use client";

import { motion, useMotionValue, useSpring, useInView, animate } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

// Animated counter component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2,
        ease: [0.25, 0.46, 0.45, 0.94],
        onUpdate: (latest) => setCount(Math.round(latest)),
      });
      return () => controls.stop();
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Magnetic button component
function MagneticButton({
  children,
  href,
  className
}: {
  children: React.ReactNode;
  href: string;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Link href={href} className={className}>
          {children}
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center pt-32 bg-[#0a0a0a]">
      {/* Main content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
        {/* Overline with line animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 flex items-center gap-4"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-12 h-px bg-zinc-700 origin-left"
          />
          <span className="text-sm text-zinc-500 uppercase tracking-[0.2em]">
            Web Design Studio
          </span>
        </motion.div>

        {/* Main headline with word-by-word stagger */}
        <div className="mb-12">
          <h1 className="text-[clamp(3rem,10vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white">
            <span className="block overflow-hidden">
              {"Crafting Digital".split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.25em]"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.1,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block text-[#2563eb]"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  delay: 0.5,
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                Experiences
              </motion.span>
            </span>
          </h1>
        </div>

        {/* Description and CTAs */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-8"
        >
          Beautiful, high-performance websites that help businesses stand out
          and convert visitors into customers.
        </motion.p>

        {/* CTA buttons with magnetic effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-wrap gap-4"
        >
          <MagneticButton
            href="#work"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#0a0a0a] font-medium rounded-full transition-colors hover:bg-zinc-100"
          >
            <span>View Work</span>
            <motion.span
              className="inline-block"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              →
            </motion.span>
          </MagneticButton>

          <MagneticButton
            href="#contact"
            className="inline-flex items-center gap-3 px-8 py-4 border border-zinc-800 text-white font-medium rounded-full hover:border-zinc-600 hover:bg-zinc-900/50 transition-all"
          >
            Get in Touch
          </MagneticButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap gap-12 md:gap-16 mt-16 pt-12 border-t border-zinc-800"
        >
          {[
            { value: 50, suffix: "+", label: "Projects Delivered" },
            { value: 100, suffix: "%", label: "Client Satisfaction" },
            { value: 2, suffix: " Weeks", label: "Avg. Turnaround" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              className="flex flex-col gap-1"
            >
              <span className="text-2xl md:text-3xl font-semibold text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="text-sm text-zinc-500">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator with pulse */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 lg:hidden"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            className="w-6 h-10 rounded-full border border-zinc-700 flex justify-center pt-2"
            whileHover={{ borderColor: "#2563eb" }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-zinc-500"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
