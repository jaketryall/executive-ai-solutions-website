"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";

const showcaseProjects = [
  {
    title: "Desert Wings",
    category: "Aviation Academy",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  {
    title: "Meridian",
    category: "Business Consulting",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    title: "Apex Interiors",
    category: "Interior Design",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    title: "Northside",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
  },
];

// Responsive grid positions - calculated based on viewport
const getGridPositions = (isMobile: boolean, isTablet: boolean) => {
  if (isMobile) {
    // Stack vertically on mobile, smaller scale
    return [
      { x: -80, y: -180, rotate: 0, scale: 0.35 },
      { x: 80, y: -180, rotate: 0, scale: 0.35 },
      { x: -100, y: 140, rotate: 0, scale: 0.3 },
      { x: 100, y: 140, rotate: 0, scale: 0.3 },
    ];
  }
  if (isTablet) {
    return [
      { x: -200, y: -140, rotate: 0, scale: 0.4 },
      { x: 200, y: -140, rotate: 0, scale: 0.4 },
      { x: -260, y: 100, rotate: 0, scale: 0.35 },
      { x: 260, y: 100, rotate: 0, scale: 0.35 },
    ];
  }
  // Desktop
  return [
    { x: -350, y: -160, rotate: 0, scale: 0.5 },
    { x: 350, y: -160, rotate: 0, scale: 0.5 },
    { x: -420, y: 120, rotate: 0, scale: 0.45 },
    { x: 420, y: 120, rotate: 0, scale: 0.45 },
  ];
};

type Phase = "intro" | "showcase" | "transition" | "logo";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentShowcaseIndex, setCurrentShowcaseIndex] = useState(0);
  const [settledCards, setSettledCards] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size for responsive positioning
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Memoize grid positions based on screen size
  const gridPositions = useMemo(
    () => getGridPositions(isMobile, isTablet),
    [isMobile, isTablet]
  );

  useEffect(() => {
    // Phase 1: Brief intro pause
    const introTimer = setTimeout(() => {
      setPhase("showcase");
    }, 200);

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (phase !== "showcase") return;

    // Show each card for 1s, then shrink and move to grid
    const showcaseTimer = setTimeout(() => {
      // Add current card to settled
      setSettledCards(prev => [...prev, currentShowcaseIndex]);

      if (currentShowcaseIndex < showcaseProjects.length - 1) {
        // Move to next card
        setTimeout(() => {
          setCurrentShowcaseIndex(prev => prev + 1);
        }, 350); // Wait for shrink animation
      } else {
        // All cards shown, transition to logo
        setTimeout(() => {
          setPhase("transition");
          setTimeout(() => {
            setPhase("logo");
          }, 400);
        }, 350);
      }
    }, 1000);

    return () => clearTimeout(showcaseTimer);
  }, [phase, currentShowcaseIndex]);

  useEffect(() => {
    if (phase !== "logo") return;

    // Complete loading after logo reveal
    const finishTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(finishTimeout);
  }, [phase]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0f] overflow-hidden"
        >
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "100px 100px",
            }}
          />

          {/* Content area - centered */}
          <div className="absolute inset-0 flex items-center justify-center">

            {/* Cards that have settled into the background wall */}
            {settledCards.map((cardIndex) => (
              <motion.div
                key={`settled-${cardIndex}`}
                className="absolute aspect-video rounded-2xl overflow-hidden bg-[#0a0a0f]"
                style={{
                  width: "clamp(180px, 22vw, 280px)",
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0.9,
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  x: gridPositions[cardIndex].x,
                  y: gridPositions[cardIndex].y,
                  scale: gridPositions[cardIndex].scale,
                  rotate: gridPositions[cardIndex].rotate,
                  opacity: phase === "logo" ? 0.15 : 0.4,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${showcaseProjects[cardIndex].image})`,
                  }}
                />
                <div className="absolute inset-0 bg-[#0a0a0f]/40" />
              </motion.div>
            ))}

            {/* Active showcase card */}
            <AnimatePresence mode="wait">
              {phase === "showcase" && !settledCards.includes(currentShowcaseIndex) && (
                <motion.div
                  key={`showcase-${currentShowcaseIndex}`}
                  className="absolute aspect-video rounded-3xl overflow-hidden z-10 bg-[#0a0a0f]"
                  style={{
                    width: "clamp(320px, 70vw, 900px)",
                    boxShadow: "0 50px 100px -20px rgba(0, 0, 0, 0.8)",
                  }}
                  initial={{
                    opacity: 0,
                    scale: 1.05,
                    y: 30,
                    filter: "blur(10px)"
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    filter: "blur(0px)"
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.4,
                    y: 0,
                    filter: "blur(8px)",
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Project image with ken burns */}
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${showcaseProjects[currentShowcaseIndex].image})`,
                    }}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent" />
                  <div className="absolute inset-0 bg-[#0a0a0f]/15" />

                  {/* Project info */}
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{ padding: "clamp(1.25rem, 3vw, 3rem)" }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                    >
                      <motion.p
                        className="text-zinc-400 uppercase tracking-wider"
                        style={{
                          fontSize: "clamp(0.65rem, 1.2vw, 1rem)",
                          marginBottom: "clamp(0.25rem, 0.8vw, 0.5rem)"
                        }}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 }}
                      >
                        {showcaseProjects[currentShowcaseIndex].category}
                      </motion.p>
                      <motion.h3
                        className="font-medium text-white"
                        style={{ fontSize: "clamp(1.5rem, 5vw, 3.75rem)" }}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.2 }}
                      >
                        {showcaseProjects[currentShowcaseIndex].title}
                      </motion.h3>
                    </motion.div>
                  </div>

                  {/* Corner frame accents - hidden on mobile for cleaner look */}
                  <motion.div
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-t-2 border-white/20 rounded-tl-lg hidden sm:block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  />
                  <motion.div
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-t-2 border-white/20 rounded-tr-lg hidden sm:block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-l-2 border-b-2 border-white/20 rounded-bl-lg hidden sm:block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  />
                  <motion.div
                    className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 border-r-2 border-b-2 border-white/20 rounded-br-lg hidden sm:block"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Logo Reveal - on top of the card wall */}
            <AnimatePresence>
              {phase === "logo" && (
                <motion.div
                  key="logo-reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-center relative z-20"
                >
                  {/* Full screen blur backdrop */}
                  <motion.div
                    className="fixed inset-0 bg-[#0a0a0f]/80 backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  />

                  {/* Animated rings behind logo */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full border border-zinc-700/30"
                        initial={{ width: 0, height: 0, opacity: 0 }}
                        animate={{
                          width: [0, 250 + i * 120],
                          height: [0, 250 + i * 120],
                          opacity: [0, 0.4, 0.2],
                        }}
                        transition={{
                          duration: 1.2,
                          delay: 0.1 + i * 0.1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                    ))}
                  </div>

                  {/* Logo mark */}
                  <motion.div
                    className="relative z-10 will-change-transform"
                    style={{ marginBottom: "clamp(1rem, 2vw, 1.5rem)" }}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <motion.div
                      className="mx-auto relative"
                      style={{
                        width: "clamp(5rem, 12vw, 9rem)",
                        height: "clamp(5rem, 12vw, 9rem)"
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
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

                  {/* Brand name */}
                  <div
                    className="overflow-hidden relative z-10"
                    style={{ marginBottom: "clamp(0.5rem, 1vw, 0.75rem)" }}
                  >
                    <motion.h1
                      className="font-medium text-white tracking-tight will-change-transform"
                      style={{ fontSize: "clamp(1.875rem, 6vw, 4.5rem)" }}
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Executive AI
                    </motion.h1>
                  </div>

                  {/* Tagline */}
                  <motion.div
                    className="overflow-hidden relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <motion.p
                      className="text-zinc-400 tracking-wide will-change-transform"
                      style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)" }}
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.4, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      Web Design Studio
                    </motion.p>
                  </motion.div>

                  {/* Decorative line - hidden on very small screens */}
                  <motion.div
                    className="hidden sm:flex items-center justify-center gap-4 relative z-10"
                    style={{ marginTop: "clamp(1.5rem, 3vw, 2rem)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <motion.div
                      className="h-px bg-zinc-600"
                      initial={{ width: 0 }}
                      animate={{ width: 50 }}
                      transition={{ duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    />
                    <motion.span
                      className="text-zinc-500 uppercase"
                      style={{
                        fontSize: "clamp(0.6rem, 1vw, 0.75rem)",
                        letterSpacing: "0.25em"
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.95 }}
                    >
                      Est. 2024
                    </motion.span>
                    <motion.div
                      className="h-px bg-zinc-600"
                      initial={{ width: 0 }}
                      animate={{ width: 50 }}
                      transition={{ duration: 0.5, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ delay: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 flex items-center"
              style={{
                bottom: "clamp(1.5rem, 4vw, 2.5rem)",
                gap: "clamp(0.375rem, 1vw, 0.5rem)"
              }}
            >
              <div className="flex" style={{ gap: "clamp(0.25rem, 0.6vw, 0.5rem)" }}>
                {showcaseProjects.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 rounded-full overflow-hidden bg-zinc-800"
                    style={{ width: "clamp(24px, 4vw, 40px)" }}
                  >
                    <motion.div
                      className="h-full bg-white rounded-full will-change-transform"
                      initial={{ width: "0%" }}
                      animate={{
                        width: i <= currentShowcaseIndex ? "100%" : "0%",
                      }}
                      transition={{
                        duration: i === currentShowcaseIndex ? 0.9 : 0.2,
                        ease: i === currentShowcaseIndex ? "linear" : "easeOut",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Corner info - only show during showcase on larger screens (Apple-style clean mobile) */}
          {phase === "showcase" && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute text-zinc-600 hidden sm:block"
                style={{
                  top: "clamp(1.5rem, 3vw, 2rem)",
                  left: "clamp(1.5rem, 3vw, 2rem)",
                  fontSize: "clamp(0.7rem, 1.2vw, 0.875rem)"
                }}
              >
                <span className="uppercase tracking-wider">Recent Work</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute text-zinc-600 font-mono hidden sm:block"
                style={{
                  top: "clamp(1.5rem, 3vw, 2rem)",
                  right: "clamp(1.5rem, 3vw, 2rem)",
                  fontSize: "clamp(0.7rem, 1.2vw, 0.875rem)"
                }}
              >
                {String(currentShowcaseIndex + 1).padStart(2, "0")} /{" "}
                {String(showcaseProjects.length).padStart(2, "0")}
              </motion.div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
