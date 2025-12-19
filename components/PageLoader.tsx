"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const showcaseProjects = [
  {
    title: "Desert Wings",
    category: "Aviation Academy",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80",
  },
  {
    title: "Meridian",
    category: "Business Consulting",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
  },
  {
    title: "Apex Interiors",
    category: "Interior Design",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80",
  },
  {
    title: "Northside",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80",
  },
];

type Phase = "showcase" | "logo";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("showcase");

  useEffect(() => {
    // Cycle through projects (1.2s per project)
    const projectInterval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= showcaseProjects.length - 1) {
          clearInterval(projectInterval);
          // Move to logo phase
          setTimeout(() => setPhase("logo"), 300);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    // Complete loading after logo reveal
    const finishTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 7500);

    return () => {
      clearInterval(projectInterval);
      clearTimeout(finishTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0f] overflow-hidden"
        >
          {/* Background grid - matches hero */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "100px 100px",
            }}
          />


          {/* Content area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {/* Phase 1: Project Showcase */}
              {phase === "showcase" && (
                <motion.div
                  key={`project-${currentIndex}`}
                  initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-[80vw] md:w-[60vw] lg:w-[50vw] aspect-[16/10] rounded-[2rem] overflow-hidden"
                >
                  {/* Project image */}
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${showcaseProjects[currentIndex].image})`,
                    }}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-[#0a0a0f]/30" />

                  {/* Project info */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <p className="text-sm text-zinc-400 uppercase tracking-wider mb-2">
                        {showcaseProjects[currentIndex].category}
                      </p>
                      <h3 className="text-3xl md:text-5xl font-medium text-white">
                        {showcaseProjects[currentIndex].title}
                      </h3>
                    </motion.div>
                  </div>

                  {/* Corner frame accents */}
                  <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-white/20 rounded-tl-lg" />
                  <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-white/20 rounded-tr-lg" />
                  <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-white/20 rounded-bl-lg" />
                  <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-white/20 rounded-br-lg" />
                </motion.div>
              )}

              {/* Phase 2: Logo Reveal */}
              {phase === "logo" && (
                <motion.div
                  key="logo-reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center relative"
                >
                  {/* Animated rings behind logo */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border border-zinc-800/50"
                        initial={{ width: 0, height: 0, opacity: 0 }}
                        animate={{
                          width: [0, 300 + i * 150],
                          height: [0, 300 + i * 150],
                          opacity: [0, 0.5, 0.2],
                        }}
                        transition={{
                          duration: 2,
                          delay: 0.3 + i * 0.2,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    ))}
                  </div>

                  {/* Logo mark */}
                  <motion.div
                    className="relative z-10 mb-8"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div
                      className="w-24 h-24 md:w-32 md:h-32 mx-auto relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <Image
                        src="/icon.png"
                        alt="Executive AI Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  </motion.div>

                  {/* Brand name with letter animation */}
                  <div className="overflow-hidden mb-4">
                    <motion.h1
                      className="text-5xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Executive AI
                    </motion.h1>
                  </div>

                  {/* Tagline */}
                  <motion.div
                    className="overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <motion.p
                      className="text-xl md:text-2xl text-zinc-500 tracking-wide"
                      initial={{ y: 30 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Web Design Studio
                    </motion.p>
                  </motion.div>

                  {/* Decorative line */}
                  <motion.div
                    className="mt-12 flex items-center justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                  >
                    <motion.div
                      className="h-px bg-zinc-700"
                      initial={{ width: 0 }}
                      animate={{ width: 60 }}
                      transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <motion.span
                      className="text-xs text-zinc-600 uppercase tracking-[0.3em]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.7 }}
                    >
                      Est. 2024
                    </motion.span>
                    <motion.div
                      className="h-px bg-zinc-700"
                      initial={{ width: 0 }}
                      animate={{ width: 60 }}
                      transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Project counter - only show during showcase */}
          {phase === "showcase" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4"
            >
              <div className="flex gap-2">
                {showcaseProjects.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 rounded-full overflow-hidden bg-zinc-800"
                    style={{ width: 40 }}
                  >
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{
                        width: i < currentIndex ? "100%" : i === currentIndex ? "100%" : "0%",
                      }}
                      transition={{
                        duration: i === currentIndex ? 0.6 : 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Corner info - only show during showcase */}
          {phase === "showcase" && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-8 left-8 text-sm text-zinc-600"
              >
                <span className="uppercase tracking-wider">Recent Work</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-8 right-8 text-sm text-zinc-600 font-mono"
              >
                {String(currentIndex + 1).padStart(2, "0")} / {String(showcaseProjects.length).padStart(2, "0")}
              </motion.div>

              {/* Cinematic bars */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 right-0 h-16 bg-[#0a0a0f] origin-top"
                style={{ transformOrigin: "top" }}
              />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 right-0 h-16 bg-[#0a0a0f] origin-bottom"
                style={{ transformOrigin: "bottom" }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
