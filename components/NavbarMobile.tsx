"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
// import { useReducedMotion } from "@/hooks/useMobile";

const navigation = [
  { name: "Services", href: "#services" },
  { name: "Process", href: "#how-it-works" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function NavbarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  // const prefersReducedMotion = useReducedMotion();
  
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Track active section with throttling
  useEffect(() => {
    // Don't track active section when menu is open
    if (isOpen) return;
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = navigation.map(item => item.href.substring(1));
          const scrollPosition = window.scrollY + 100;
          
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(section);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);
  
  // Remove animation flicker on mobile - commented out as not currently used
  // const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  return (
    <>
      {/* Enhanced fixed header - reduced blur */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-black/80 backdrop-blur-md border-b border-zinc-800/50 shadow-2xl">
        <nav className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo.png" 
              alt="Executive AI Solutions Logo" 
              width={822}
              height={218}
              priority
              className="h-10 w-auto transition-all duration-300 group-hover:scale-105"
            />
          </Link>
          
          {/* Menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 backdrop-blur-md border border-zinc-700/50 shadow-lg hover:shadow-xl transition-all group"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 relative">
              <motion.span
                className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-white to-zinc-300 rounded-full shadow-sm"
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 8 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-white to-zinc-300 rounded-full shadow-sm"
                animate={{
                  opacity: isOpen ? 0 : 1,
                  x: isOpen ? 20 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-white to-zinc-300 rounded-full shadow-sm"
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -8 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </nav>
      </header>
      
      {/* Fullscreen menu */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-gradient-to-br from-black/95 via-zinc-900/95 to-black/95 backdrop-blur-2xl z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu content */}
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-6 top-24 bottom-32 z-50 bg-gradient-to-b from-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-3xl border border-zinc-700/50 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Enhanced drag handle */}
              <div className="flex justify-center py-4">
                <div className="w-16 h-1.5 bg-gradient-to-r from-zinc-600 via-zinc-500 to-zinc-600 rounded-full shadow-sm" />
              </div>
              
              {/* Navigation items */}
              <nav className="px-8 py-4 overflow-y-auto overflow-x-hidden flex-1">
                {navigation.map((item) => {
                  const isActive = activeSection === item.href.substring(1);
                  
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsOpen(false);
                        const element = document.querySelector(item.href);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`block py-5 text-2xl font-medium transition-all relative group ${
                        isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {/* Hover effect */}
                      <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-zinc-600 to-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {isActive && (
                        <div
                          className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-[#0066ff] to-blue-500 rounded-full shadow-lg shadow-blue-500/50"
                        />
                      )}
                    </a>
                  );
                })}
              </nav>
              
              {/* CTA button */}
              <div className="px-8 mt-8 pb-8 flex-shrink-0">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    const element = document.querySelector('#contact');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block w-full py-5 text-center bg-gradient-to-r from-[#0066ff] to-blue-500 text-white rounded-full font-medium text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all relative overflow-hidden group"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#0066ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
              
              {/* Removed orbs for better performance */}
            </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}