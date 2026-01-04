"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import AnimatedLogo from "./AnimatedLogo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { href: "#work", label: "Work" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      {/* Desktop Navbar - Transforms from wide to floating pill */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center pt-6"
      >
        <motion.nav
          className="flex items-center rounded-full overflow-hidden"
          animate={{
            backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
            backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
            paddingLeft: isScrolled ? "8px" : "48px",
            paddingRight: isScrolled ? "8px" : "48px",
            paddingTop: isScrolled ? "8px" : "16px",
            paddingBottom: isScrolled ? "8px" : "16px",
            gap: isScrolled ? "4px" : "48px",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            border: isScrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-2 pr-4">
            <AnimatedLogo width={32} height={20} drawDuration={1} delay={0.5} />
            <span className="text-white font-bold text-xs uppercase tracking-[0.1em]">
              Executive
            </span>
          </Link>

          {/* Divider - only visible when scrolled */}
          <motion.div
            className="w-px h-6 bg-white/10"
            animate={{ opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Nav Links */}
          <div className="flex items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-white text-xs uppercase tracking-[0.15em] transition-colors px-4 py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Divider - only visible when scrolled */}
          <motion.div
            className="w-px h-6 bg-white/10"
            animate={{ opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* CTA */}
          <Link
            href="#contact"
            className="group relative h-9 px-5 ml-1 overflow-hidden rounded-full inline-flex items-center justify-center bg-white/10 hover:bg-white transition-colors duration-300"
          >
            <span className="relative z-10 text-white group-hover:text-black text-xs uppercase tracking-[0.15em] font-semibold transition-colors duration-300">
              Start Project
            </span>
          </Link>
        </motion.nav>
      </motion.header>

      {/* Mobile Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
      >
        <nav className="mx-4 mt-4 px-4 py-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-white font-bold text-sm uppercase tracking-[0.1em]">
              Executive
            </Link>

            {/* Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-4 relative flex flex-col justify-between">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-white origin-center"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="w-full h-0.5 bg-white"
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  className="w-full h-0.5 bg-white origin-center"
                />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
          >
            <div className="flex flex-col justify-center items-center h-full">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-5xl font-black text-white py-4 hover:text-[#00f0ff] transition-colors uppercase"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <Link
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="px-8 py-4 bg-[#00f0ff] text-black font-bold text-sm uppercase tracking-[0.2em] rounded-full"
                >
                  Start Project
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
