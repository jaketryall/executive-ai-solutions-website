"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Staggered text reveal on hover - same style as Hero buttons
function AnimatedNavLink({
  text,
  href,
  className,
}: {
  text: string;
  href: string;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  // Calculate accelerating delay for each character
  const getDelay = (index: number) => {
    const baseDelay = 0.025;
    const acceleration = 0.85;
    let delay = 0;
    for (let i = 0; i < index; i++) {
      delay += baseDelay * Math.pow(acceleration, i);
    }
    return delay;
  };

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-block ${className}`}
    >
      <span className="inline-flex items-center relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden relative"
            style={{
              height: "1.2em",
              lineHeight: "1.2em",
            }}
          >
            {/* Original text - slides up and out */}
            <motion.span
              className="inline-block"
              animate={{
                y: isHovered ? "-110%" : "0%",
              }}
              transition={{
                duration: 0.25,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            {/* Duplicate text - slides up from below */}
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{
                y: isHovered ? "0%" : "110%",
              }}
              transition={{
                duration: 0.25,
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
function AnimatedCTAButton({
  text,
  href,
}: {
  text: string;
  href: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const characters = text.split("");

  const getDelay = (index: number) => {
    const baseDelay = 0.025;
    const acceleration = 0.85;
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
      className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-[#0a0a0a] rounded-full font-medium text-sm hover:bg-zinc-100 transition-colors"
      whileTap={{ scale: 0.98 }}
    >
      <span className="inline-flex items-center relative">
        {characters.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden relative"
            style={{
              height: "1.2em",
              lineHeight: "1.2em",
            }}
          >
            <motion.span
              className="inline-block"
              animate={{
                y: isHovered ? "-110%" : "0%",
              }}
              transition={{
                duration: 0.25,
                delay: getDelay(index),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
            <motion.span
              className="inline-block absolute left-0 top-0"
              animate={{
                y: isHovered ? "0%" : "110%",
              }}
              transition={{
                duration: 0.25,
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
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#work", label: "Case Studies" },
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hasScrolled
          ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-900"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 xl:px-24 py-5">
        <div className="flex items-center justify-between">
          {/* Logo - text based like viral-sma */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-2"
              >
                {/* Logo */}
                <div className="relative w-8 h-8">
                  <Image
                    src="/favicon.png"
                    alt="Executive AI Solutions"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xl font-semibold text-white">exec</span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - centered */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-10"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <AnimatedNavLink
                  href={link.href}
                  text={link.label}
                  className="text-sm text-zinc-400 hover:text-white transition-colors py-2"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="hidden md:block"
          >
            <AnimatedCTAButton href="#contact" text="Book a call" />
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 relative z-50"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.span
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-white origin-center"
              />
              <motion.span
                animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-white"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-0.5 bg-white origin-center"
              />
            </div>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 bg-[#0a0a0a] z-40 md:hidden"
          >
            <div className="flex flex-col justify-center items-center h-full px-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-4xl font-semibold text-white py-4 hover:text-[#2563eb] transition-colors relative group"
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
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-8"
                onClick={() => setIsOpen(false)}
              >
                <AnimatedCTAButton href="#contact" text="Book a call" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
