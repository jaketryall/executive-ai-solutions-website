"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const NavbarMobile = dynamic(() => import("./NavbarMobile"), {
  loading: () => null,
  ssr: false
});

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Services", href: "#services" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];
  
  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);
  
  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      {/* Mobile Navbar - shown below lg breakpoint */}
      <div className="lg:hidden">
        <NavbarMobile />
      </div>

      {/* Desktop Navbar - shown at lg breakpoint and above */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-zinc-800/50 safe-top"
        role="navigation"
        aria-label="Main navigation"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center gap-3 group" aria-label="Executive AI Solutions Home">
              <Image 
                src="/logo.png" 
                alt="Executive AI Solutions Logo" 
                width={822}
                height={218}
                priority
                className="h-8 sm:h-10 w-auto transition-all duration-300 group-hover:scale-105"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-zinc-400 hover:text-white hover:text-glow-blue transition-all duration-300 text-sm font-light touch-target focus-visible"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={handleContactClick}
                className="inline-block bg-gradient-to-r from-[#0066ff] to-blue-600 text-white px-6 py-2.5 rounded-full font-light hover:shadow-lg hover:shadow-[#0066ff]/25 transition-all duration-300 text-sm cursor-pointer touch-target focus-visible"
                aria-label="Get started with AI solutions"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-zinc-300 hover:text-white focus-visible touch-target w-10 h-10 flex items-center justify-center rounded-lg"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-zinc-300 hover:text-white transition-colors duration-200 touch-target focus-visible"
                  aria-label={`Navigate to ${item.label}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  const contactSection = document.querySelector('#contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  setIsMenuOpen(false);
                }}
                className="block w-full mt-4 bg-gradient-to-r from-[#0066ff] to-blue-600 text-white px-6 py-3 rounded-full font-light text-center hover:shadow-lg hover:shadow-[#0066ff]/25 transition-all duration-300 text-sm cursor-pointer touch-target focus-visible"
                aria-label="Get started with AI solutions"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
    </>
  );
}