"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Staggered text reveal on hover
function AnimatedNavLink({
  text,
  href,
  onClick,
}: {
  text: string;
  href: string;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  const getDelay = (index: number) => {
    const baseDelay = 0.02;
    const acceleration = 0.88;
    let delay = 0;
    for (let i = 0; i < index; i++) {
      delay += baseDelay * Math.pow(acceleration, i);
    }
    return delay;
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-block text-sm text-zinc-400 hover:text-white transition-colors"
    >
      <span className="inline-flex items-center relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden relative"
            style={{ height: "1.2em", lineHeight: "1.2em" }}
          >
            <motion.span
              className="inline-block"
              animate={{ y: isHovered ? "-110%" : "0%" }}
              transition={{
                duration: 0.2,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{ y: isHovered ? "0%" : "110%" }}
              transition={{
                duration: 0.2,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
    </Link>
  );
}

// CTA Button with staggered text animation
function AnimatedCTAButton({ text, href }: { text: string; href: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  const getDelay = (index: number) => {
    const baseDelay = 0.02;
    const acceleration = 0.88;
    let delay = 0;
    for (let i = 0; i < index; i++) {
      delay += baseDelay * Math.pow(acceleration, i);
    }
    return delay;
  };

  return (
    <motion.a
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="inline-flex items-center justify-center px-5 py-2 bg-white text-[#0a0a0a] rounded-full font-medium text-sm hover:bg-zinc-100 transition-colors"
      whileTap={{ scale: 0.98 }}
    >
      <span className="inline-flex items-center relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden relative"
            style={{ height: "1.2em", lineHeight: "1.2em" }}
          >
            <motion.span
              className="inline-block"
              animate={{ y: isHovered ? "-110%" : "0%" }}
              transition={{
                duration: 0.2,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{ y: isHovered ? "0%" : "110%" }}
              transition={{
                duration: 0.2,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.a>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Binary toggle - shrink immediately on any scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 10);
  });

  const navLinks = [
    { href: "#work", label: "Work" },
    { href: "#services", label: "Services" },
    { href: "#process", label: "Process" },
    { href: "#about", label: "About" },
  ];

  return (
    <>
      {/* Desktop Navbar - Binary shrink on scroll */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center"
      >
        <motion.nav
          className="relative mt-6"
          animate={{
            maxWidth: isScrolled ? "720px" : "900px",
            backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.95)" : "rgba(10, 10, 10, 0)",
            borderColor: isScrolled ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0)",
            boxShadow: isScrolled ? "0 8px 32px rgba(0, 0, 0, 0.4)" : "0 0 0 rgba(0,0,0,0)",
          }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: "100%",
            borderRadius: "9999px",
            borderWidth: "1px",
            borderStyle: "solid",
            backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
            WebkitBackdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
          }}
        >
          <motion.div
            className="flex items-center justify-between"
            animate={{
              padding: isScrolled ? "8px 16px" : "20px 16px",
            }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Logo */}
            <motion.div
              animate={{ x: isScrolled ? 0 : -20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/" className="flex items-center gap-2 px-3">
                <div className="relative w-7 h-7">
                  <Image
                    src="/Executive Ai Solutions Logo.png"
                    alt="Executive AI"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-base font-semibold text-white">
                  exec
                </span>
              </Link>
            </motion.div>

            {/* Center nav links */}
            <div className="flex items-center">
              {/* Divider - appears on scroll */}
              <motion.div
                className="w-px h-6 bg-zinc-700/50 mr-6"
                animate={{
                  opacity: isScrolled ? 1 : 0,
                  scaleY: isScrolled ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />

              {/* Nav Links */}
              <motion.div
                className="flex items-center"
                animate={{ gap: isScrolled ? "24px" : "32px" }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                {navLinks.map((link) => (
                  <AnimatedNavLink key={link.href} href={link.href} text={link.label} />
                ))}
              </motion.div>

              {/* Divider - appears on scroll */}
              <motion.div
                className="w-px h-6 bg-zinc-700/50 ml-6"
                animate={{
                  opacity: isScrolled ? 1 : 0,
                  scaleY: isScrolled ? 1 : 0,
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>

            {/* CTA Button */}
            <motion.div
              animate={{ x: isScrolled ? 0 : 20 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="px-2"
            >
              <AnimatedCTAButton href="#contact" text="Let's Talk" />
            </motion.div>
          </motion.div>
        </motion.nav>
      </motion.header>

      {/* Mobile Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-4 left-4 right-4 z-50 md:hidden"
      >
        <motion.nav
          className="relative rounded-full px-4 py-3"
          animate={{
            backgroundColor: isOpen || isScrolled ? "rgba(10, 10, 10, 0.95)" : "rgba(10, 10, 10, 0.6)",
          }}
          transition={{ duration: 0.2 }}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Image
                  src="/Executive Ai Solutions Logo.png"
                  alt="Executive AI"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-base font-semibold text-white">exec</span>
            </Link>

            {/* Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 relative z-50"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-0.5 bg-white origin-center rounded-full"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-0.5 bg-white rounded-full"
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-0.5 bg-white origin-center rounded-full"
                />
              </div>
            </motion.button>
          </div>
        </motion.nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#0a0a0a]/98 backdrop-blur-xl z-40 md:hidden"
          >
            <div className="flex flex-col justify-center items-center h-full px-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0.05 + index * 0.08, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-4xl font-semibold text-white py-4 hover:text-amber-500 transition-colors"
                  >
                    <motion.span
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="inline-block"
                    >
                      {link.label}
                    </motion.span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="mt-8"
              >
                <Link
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0a0a0a] rounded-full font-medium text-lg"
                >
                  Let's Talk
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
