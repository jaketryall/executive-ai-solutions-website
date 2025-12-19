"use client";

import { motion } from "framer-motion";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

// Reveals text word by word with staggered animation
export function TextRevealByWord({
  children,
  className = "",
  delay = 0,
  staggerChildren = 0.05,
}: TextRevealProps) {
  const words = children.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <span key={index} className="overflow-hidden inline-block">
          <motion.span className="inline-block mr-[0.25em]" variants={child}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

// Reveals text line by line with mask effect
export function TextRevealByLine({
  children,
  className = "",
  delay = 0,
}: TextRevealProps) {
  return (
    <div className="overflow-hidden">
      <motion.div
        className={className}
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Reveals text character by character
export function TextRevealByChar({
  children,
  className = "",
  delay = 0,
  staggerChildren = 0.02,
}: TextRevealProps) {
  const chars = children.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          variants={child}
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Section header with sticky label
interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  dark?: boolean;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  dark = true,
}: SectionHeaderProps) {
  return (
    <div className={`mb-16 md:mb-20 ${align === "center" ? "text-center" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`flex items-center gap-4 mb-6 ${align === "center" ? "justify-center" : ""}`}
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`w-12 h-px ${dark ? "bg-zinc-700" : "bg-zinc-300"} origin-left`}
        />
        <span className={`text-sm uppercase tracking-[0.2em] ${dark ? "text-zinc-500" : "text-zinc-500"}`}>
          {label}
        </span>
        {align === "center" && (
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`w-12 h-px ${dark ? "bg-zinc-700" : "bg-zinc-300"} origin-right`}
          />
        )}
      </motion.div>

      <div className="overflow-hidden">
        <motion.h2
          className={`text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 ${dark ? "text-white" : "text-[#0a0a0a]"}`}
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {title}
        </motion.h2>
      </div>

      {description && (
        <motion.p
          className={`text-xl max-w-2xl ${align === "center" ? "mx-auto" : ""} ${dark ? "text-zinc-400" : "text-zinc-500"}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

// Sticky section label that stays visible while scrolling through content
interface StickySectionProps {
  label: string;
  children: React.ReactNode;
}

export function StickySection({ label, children }: StickySectionProps) {
  return (
    <div className="relative">
      {/* Sticky label */}
      <div className="hidden lg:block absolute left-0 top-0 h-full">
        <div className="sticky top-32 -rotate-90 origin-top-left translate-y-8 -translate-x-4">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-600 whitespace-nowrap">
            {label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="lg:pl-16">
        {children}
      </div>
    </div>
  );
}
