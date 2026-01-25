"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";
import AnimatedLogo from "./AnimatedLogo";
import { useSound } from "./SoundManager";
import { TransitionLink } from "./PageTransition";

// Warm cinematic color palette
const accentColor = "rgba(255, 200, 150, 1)";

// Staggered text hover component - letters animate up on hover
function StaggeredText({ text, isHovered }: { text: string; isHovered: boolean }) {
  const letters = text.split("");

  return (
    <span className="relative inline-flex overflow-hidden">
      {/* Hidden text for sizing */}
      <span className="invisible">{text}</span>

      {/* Primary text - moves up on hover */}
      <span className="absolute inset-0 flex">
        {letters.map((letter, i) => (
          <motion.span
            key={`primary-${i}`}
            initial={{ y: 0 }}
            animate={{ y: isHovered ? "-100%" : "0%" }}
            transition={{
              duration: 0.25,
              delay: i * 0.02,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </span>

      {/* Secondary text - comes up from below */}
      <span className="absolute inset-0 flex">
        {letters.map((letter, i) => (
          <motion.span
            key={`secondary-${i}`}
            initial={{ y: "100%" }}
            animate={{ y: isHovered ? "0%" : "100%" }}
            transition={{
              duration: 0.25,
              delay: i * 0.02,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

// CTA Button with staggered text
function CTAButton() {
  const [isHovered, setIsHovered] = useState(false);
  const { play } = useSound();

  return (
    <TransitionLink
      href="/contact"
      className="group relative h-11 px-6 ml-1 overflow-hidden rounded-full inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white transition-colors duration-300"
      onMouseEnter={() => {
        setIsHovered(true);
        play("hover", { volume: 0.08 });
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => play("click")}
    >
      <span className="relative z-10 text-white group-hover:text-black text-sm uppercase tracking-[0.12em] font-semibold transition-colors duration-300">
        <StaggeredText text="Start Project" isHovered={isHovered} />
      </span>
      {/* Arrow with diagonal slide on hover */}
      <span className="relative w-5 h-5 overflow-hidden">
        <span className="absolute inset-0 flex items-center justify-center text-white/60 group-hover:text-black transition-all duration-300 group-hover:translate-x-full group-hover:-translate-y-full text-sm">→</span>
        <span className="absolute inset-0 flex items-center justify-center -translate-x-full translate-y-full text-white/60 group-hover:text-black transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 text-sm">→</span>
      </span>
    </TransitionLink>
  );
}

// Nav link with staggered hover effect
function NavLink({
  href,
  label,
  isActive,
  onHover,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TransitionLink
      href={href}
      className="relative px-5 py-3"
      style={{ position: 'relative' }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover();
      }}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <span
        className="text-sm font-medium uppercase tracking-[0.15em]"
        style={{ color: isActive ? accentColor : isHovered ? "#fff" : "rgba(255,255,255,0.7)" }}
      >
        <StaggeredText text={label} isHovered={isHovered} />
      </span>
      {isActive && (
        <motion.span
          className="absolute bottom-0 left-5 right-5 h-[2px]"
          style={{ backgroundColor: accentColor }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      )}
    </TransitionLink>
  );
}

// Services dropdown with dynamic reveal
function ServicesDropdown({
  isActive,
  onHover,
  onClick,
}: {
  isActive: boolean;
  onHover: () => void;
  onClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const services = [
    { href: "/services/website-design", label: "Website Design", description: "High-converting sites that grow your business" },
    { href: "/services/seo", label: "SEO", description: "Get found by the people who matter" },
    { href: "/services/custom-solutions", label: "Custom Solutions", description: "Tailored tools built for your workflow" },
  ];

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setIsOpen(true);
        setIsHovered(true);
        onHover();
      }}
      onMouseLeave={() => {
        setIsOpen(false);
        setIsHovered(false);
        setHoveredIndex(null);
      }}
    >
      {/* Trigger */}
      <button className="relative px-5 py-3 flex items-center gap-1.5" style={{ position: 'relative' }}>
        <span
          className="text-sm font-medium uppercase tracking-[0.15em]"
          style={{ color: isActive ? accentColor : isHovered ? "#fff" : "rgba(255,255,255,0.7)" }}
        >
          <StaggeredText text="Services" isHovered={isHovered} />
        </span>
        <motion.svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          style={{ color: isActive ? accentColor : isHovered ? "#fff" : "rgba(255,255,255,0.5)" }}
        >
          <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
        {isActive && (
          <motion.span
            className="absolute bottom-0 left-5 right-5 h-[2px]"
            style={{ backgroundColor: accentColor }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72"
          >
            {/* Glowing border effect */}
            <div
              className="absolute -inset-px rounded-2xl opacity-50"
              style={{
                background: `linear-gradient(135deg, ${accentColor}40, transparent, ${accentColor}20)`,
              }}
            />

            <div className="relative bg-black/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: hoveredIndex !== null
                    ? `radial-gradient(circle at ${50}% ${(hoveredIndex + 0.5) * 33}%, ${accentColor}20, transparent 70%)`
                    : `radial-gradient(circle at 50% 50%, transparent, transparent)`,
                }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative p-2">
                {services.map((service, index) => (
                  <TransitionLink
                    key={service.href}
                    href={service.href}
                    onClick={onClick}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="group relative block"
                  >
                    <motion.div
                      className="relative px-4 py-3 rounded-xl overflow-hidden"
                      initial={false}
                      animate={{
                        backgroundColor: hoveredIndex === index ? "rgba(255, 200, 150, 0.1)" : "rgba(255, 200, 150, 0)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Sliding highlight bar */}
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full"
                        style={{ backgroundColor: accentColor }}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: hoveredIndex === index ? 24 : 0,
                          opacity: hoveredIndex === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
                      />

                      <div className="flex items-center justify-between">
                        <div>
                          <motion.p
                            className="text-sm font-medium"
                            animate={{
                              color: hoveredIndex === index ? "#fff" : "rgba(255,255,255,0.8)",
                              x: hoveredIndex === index ? 8 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            {service.label}
                          </motion.p>
                          <motion.p
                            className="text-xs mt-0.5"
                            animate={{
                              color: hoveredIndex === index ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)",
                              x: hoveredIndex === index ? 8 : 0,
                            }}
                            transition={{ duration: 0.2, delay: 0.02 }}
                          >
                            {service.description}
                          </motion.p>
                        </div>

                        {/* Arrow that slides in */}
                        <motion.span
                          className="text-sm"
                          style={{ color: accentColor }}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{
                            opacity: hoveredIndex === index ? 1 : 0,
                            x: hoveredIndex === index ? 0 : -10,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          →
                        </motion.span>
                      </div>
                    </motion.div>
                  </TransitionLink>
                ))}
              </div>

              {/* Bottom accent line */}
              <motion.div
                className="h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const { scrollY } = useScroll();
  const { play } = useSound();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Navigation links - all dedicated pages now
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/work", label: "Work" },
    { href: "/contact", label: "Contact" },
  ];

  // Check if link is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navbar - Transforms from wide to floating pill */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center pt-8"
      >
        <motion.nav
          className="flex items-center rounded-full"
          animate={{
            backgroundColor: isScrolled ? "rgba(0, 0, 0, 0.85)" : "rgba(0, 0, 0, 0)",
            backdropFilter: isScrolled ? "blur(20px)" : "blur(0px)",
            paddingLeft: isScrolled ? "12px" : "48px",
            paddingRight: isScrolled ? "12px" : "48px",
            paddingTop: isScrolled ? "10px" : "20px",
            paddingBottom: isScrolled ? "10px" : "20px",
            gap: isScrolled ? "8px" : "40px",
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            border: isScrolled ? "1px solid rgba(255,255,255,0.1)" : "1px solid transparent",
          }}
        >
          {/* Logo */}
          <TransitionLink href="/" className="flex items-center gap-3 pl-2 pr-4">
            <AnimatedLogo width={36} height={24} drawDuration={1} delay={0.5} />
            <span className="text-white font-bold text-sm uppercase tracking-[0.1em]">
              Executive AI
            </span>
          </TransitionLink>

          {/* Divider - only visible when scrolled */}
          <motion.div
            className="w-px h-8 bg-white/10"
            animate={{ opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Nav Links */}
          <div className="flex items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isActive(link.href)}
                onHover={() => play("hover")}
                onClick={() => play("click")}
              />
            ))}
            <ServicesDropdown
              isActive={pathname.startsWith("/services")}
              onHover={() => play("hover")}
              onClick={() => play("click")}
            />
          </div>

          {/* Divider - only visible when scrolled */}
          <motion.div
            className="w-px h-8 bg-white/10"
            animate={{ opacity: isScrolled ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* CTA */}
          <CTAButton />
        </motion.nav>
      </motion.header>

      {/* Mobile Navbar */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
      >
        <nav className="mx-4 mt-4 px-5 py-4 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between">
            {/* Logo - icon only on mobile */}
            <TransitionLink href="/" className="flex items-center">
              <AnimatedLogo width={32} height={22} drawDuration={0.8} delay={0.2} />
            </TransitionLink>

            {/* Menu Button */}
            <button
              onClick={() => {
                if (isOpen) {
                  setMobileServicesOpen(false);
                }
                setIsOpen(!isOpen);
              }}
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
                  <TransitionLink
                    href={link.href}
                    onClick={() => {
                      play("click");
                      setIsOpen(false);
                    }}
                    className="block text-5xl font-black py-4 transition-colors uppercase"
                    style={{
                      color: isActive(link.href) ? accentColor : "#fff",
                    }}
                  >
                    {link.label}
                  </TransitionLink>
                </motion.div>
              ))}
              {/* Services Section - Clickable Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <button
                  onClick={() => {
                    play("click");
                    setMobileServicesOpen(!mobileServicesOpen);
                  }}
                  className="flex items-center gap-3 text-5xl font-black py-4 uppercase mx-auto"
                  style={{ color: pathname.startsWith("/services") ? accentColor : "#fff" }}
                >
                  Services
                  <motion.svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    animate={{ rotate: mobileServicesOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                    className="mt-1"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-3 py-4">
                        {[
                          { href: "/services/website-design", label: "Website Design" },
                          { href: "/services/seo", label: "SEO" },
                          { href: "/services/custom-solutions", label: "Custom Solutions" },
                        ].map((service, index) => (
                          <motion.div
                            key={service.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <TransitionLink
                              href={service.href}
                              onClick={() => {
                                play("click");
                                setIsOpen(false);
                                setMobileServicesOpen(false);
                              }}
                              className="text-xl font-medium transition-colors block"
                              style={{
                                color: pathname === service.href ? accentColor : "rgba(255,255,255,0.6)",
                              }}
                            >
                              {service.label}
                            </TransitionLink>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <TransitionLink
                  href="/contact"
                  onClick={() => {
                    play("click");
                    setIsOpen(false);
                  }}
                  className="px-8 py-4 text-black font-bold text-sm uppercase tracking-[0.2em] rounded-full inline-block"
                  style={{ backgroundColor: accentColor }}
                >
                  Start Project
                </TransitionLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
