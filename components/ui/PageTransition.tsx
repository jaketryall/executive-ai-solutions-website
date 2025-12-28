"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

// Smooth page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      when: "beforeChildren" as const,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// Slide transition for route changes
const slideVariants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Fade transition
const fadeVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Overlay transition for dramatic effect
export function OverlayTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={pathname}>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Overlay panels that slide in/out */}
      <AnimatePresence>
        <motion.div
          key={`overlay-${pathname}`}
          className="fixed inset-0 z-[9999] pointer-events-none"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Top panel */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 bg-[#0a0a0a] origin-top"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Bottom panel */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#0a0a0a] origin-bottom"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Center logo/text during transition */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-2xl font-semibold text-white tracking-tight">
              Executive<span className="text-[#2563eb]">AI</span>
            </span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

// Section reveal animation wrapper
interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SectionReveal({ children, className = "", delay = 0 }: SectionRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// Text reveal animation (word by word)
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className = "", delay = 0 }: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "100%" },
              visible: {
                y: 0,
                transition: {
                  duration: 0.5,
                  delay: delay + i * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// Parallax wrapper
interface ParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export function Parallax({ children, className = "", speed = 0.5 }: ParallaxProps) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: -50 * speed }}
      viewport={{ once: false }}
      transition={{ type: "tween", ease: "linear" }}
    >
      {children}
    </motion.div>
  );
}
