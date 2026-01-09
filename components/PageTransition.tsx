"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSound } from "./SoundManager";
import gsap from "gsap";

// Warm accent color to match the site
const accentColor = "rgba(255, 200, 150, 1)";

// Store the click position for clip-path origin
let clickPosition = { x: 0, y: 0 };

// The actual logo path from the SVG file
const LOGO_PATH = "M397.53,408.07c11.3,0,14.98-9.02,14.98-24.68v-33.53c0-10.6-0.98-24.45-14.7-24.45H297.64c-6.02,0-9.16,5.59-11.2,10.94l-44.77,130.27c-1.61,4.22-5.27,5.67-9.68,5.67H84.69c-39.07,0-71.19-29.76-74.92-67.85V292.38c0-28.65,17.24-53.28,41.92-64.05c-26.54-11.81-42.3-37.84-42.31-65.13V94.93c0-39.03,31.64-70.66,70.66-70.66c0.74,0,1.47,0.01,2.2,0.03h149.44c5.95,0,10.77,4.82,10.77,10.77c0,1.19-0.19,2.33-0.55,3.4c-5.58,16.65-11.23,33.26-16.94,49.82c-1.94,5.62-7.81,6.67-13.69,6.67c-0.03,0-0.06-0.02-0.09-0.03H102.47c-12.16,1.54-20.92,12.25-20.22,24.31v44.57c0,11.21,9.04,20.31,20.22,20.41c31.94,0.29,63.81,0,95.61,0c6.83,0,12.81,5.05,10.87,10.67c-0.73,2.1-1.54,4.09-2.58,7.09l-14.84,42.87c-2.35,6.79-9.81,7.76-16.55,7.76c-0.43,0-0.38,0-0.73,0h-55.72c-18.69,0-33.84,15.15-33.84,33.84c0,2.15,0,4.22,0,5.95v88.25c-0.07,11.28-2.66,23.82,17.78,23.82h72.52c9.14,0,12.45-4.57,16.56-16.56c0.19-0.54,0.36-0.94,0.48-1.28L311.27,38.46c2.07-6.04,4.19-14.17,10.96-14.17h97.09c39.16,0,70.95,31.58,71.29,70.66v119.41c0,5.95-4.82,10.77-10.77,10.77c-0.28,0-0.56-0.01-0.84-0.03h-54.57c-6.22,0-11.34-4.7-12.01-10.73v-95.14c0-15.29-12.4-27.69-27.69-27.69c-4.97,0-13.12,1.99-15.63,9.46c-12.81,37.97-51.25,151.88-51.25,151.88c-0.65,1.93,0.28,4.67,2.31,4.67c0.91,0,1.5,0,2.27,0l89.99,0.03c39.69,0,78.19,29.62,78.19,67.36v79.51c0,39.38-31.92,71.3-71.3,71.3c-0.49,0-0.98,0-1.47-0.02h-95.43c-5.43,0-13.65,0.53-10.66-9.24l15.94-52.18c1.2-3.93,4.9-6.41,8.83-6.23H397.53z";

// Context for managing page route transitions
interface PageTransitionContextType {
  isPageTransitioning: boolean;
  targetPage: string;
  navigateTo: (href: string, e?: React.MouseEvent) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isPageTransitioning: false,
  targetPage: "",
  navigateTo: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);

// Map routes to display names
const pageNames: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/services": "Services",
  "/about": "About",
  "/contact": "Contact",
};

// Logo Portal Transition
// Black panel with logo cutout that scales massively to reveal content
function GSAPTransitionOverlay({ isActive }: { isActive: boolean; targetPage: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskScaleRef = useRef({ value: 1 });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Only start animation when isActive becomes true, ignore when it becomes false
    if (isActive && !isAnimatingRef.current) {
      isAnimatingRef.current = true;

      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Show container immediately
      gsap.set(container, { display: "block", pointerEvents: "auto", opacity: 1 });

      // Reset mask scale
      maskScaleRef.current.value = 1;
      updateMask(container, 1);

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        }
      });
      timelineRef.current = tl;

      // Hold on the logo for a moment, then scale up massively
      tl.to(maskScaleRef.current, {
        value: 500,
        duration: 1.2,
        delay: 0.5, // Hold on initial logo
        ease: "power2.inOut",
        onUpdate: () => {
          updateMask(container, maskScaleRef.current.value);
        },
      });

      // Fade out the overlay at the end
      tl.to(container, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      // Hide container
      tl.set(container, { display: "none", pointerEvents: "none", opacity: 1 });
    }
  }, [isActive]);

  // Update the CSS mask with the scaled logo
  const updateMask = (container: HTMLDivElement, scale: number) => {
    // Calculate the size of the mask based on scale
    // Start with logo at ~150px centered, scale it up
    const baseSize = 150;
    const size = baseSize * scale;
    const halfSize = size / 2;

    // Create an SVG data URL for the mask
    // White = visible (the black panel), Black = transparent (logo cutout)
    const svgMask = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${window.innerWidth} ${window.innerHeight}">
        <defs>
          <mask id="logoMask">
            <rect width="100%" height="100%" fill="white"/>
            <g transform="translate(${window.innerWidth / 2 - halfSize}, ${window.innerHeight / 2 - halfSize}) scale(${size / 500})">
              <path d="${LOGO_PATH}" fill="black"/>
            </g>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="black" mask="url(#logoMask)"/>
      </svg>
    `;

    const encodedSvg = encodeURIComponent(svgMask);
    container.style.backgroundImage = `url("data:image/svg+xml,${encodedSvg}")`;
    container.style.backgroundSize = "100% 100%";
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0"
      style={{
        zIndex: 9999,
        display: "none",
        pointerEvents: "none",
        backgroundColor: "transparent",
      }}
    />
  );
}

// Provider for page route transitions
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [targetPage, setTargetPage] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { play } = useSound();

  const navigateTo = useCallback(
    (href: string, e?: React.MouseEvent) => {
      // Don't transition if already on the page
      if (href === pathname) return;

      // Store click position for clip-path origin
      if (e) {
        clickPosition = { x: e.clientX, y: e.clientY };
      } else {
        // Default to center if no event
        clickPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      }

      // Set target page name for display
      setTargetPage(pageNames[href] || href.replace("/", "") || "Home");

      // Play transition sound and start transition
      play("transition");
      setIsPageTransitioning(true);

      // Navigate during the hold phase (before scale starts)
      // This ensures the new page is visible through the logo cutout when it scales
      setTimeout(() => {
        router.push(href);
      }, 200);
    },
    [pathname, play, router]
  );

  // Reset transition state when pathname changes
  useEffect(() => {
    // Hide overlay shortly after navigation completes
    // The new page content will animate in via template.tsx
    const timer = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <PageTransitionContext.Provider value={{ isPageTransitioning, targetPage, navigateTo }}>
      <GSAPTransitionOverlay isActive={isPageTransitioning} targetPage={targetPage} />
      {children}
    </PageTransitionContext.Provider>
  );
}

// TransitionLink - use this instead of next/link for animated transitions
export function TransitionLink({
  href,
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onClick: externalOnClick,
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  [key: string]: unknown;
}) {
  const { navigateTo, isPageTransitioning } = usePageTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPageTransitioning) return;

    // Call external onClick if provided (for sounds, etc.)
    if (externalOnClick) externalOnClick();

    // Pass the event so we can get click position for clip-path
    navigateTo(href, e);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </a>
  );
}

// Context for managing section transitions (within same page)
interface TransitionContextType {
  isTransitioning: boolean;
  currentSection: string;
  targetSection: string;
  triggerTransition: (to: string) => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

// Clean slide-up transition - new page rises from bottom
function TransitionOverlay({ isActive }: { isActive: boolean; targetLabel: string }) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
        >
          {/* Simple slide-up panel */}
          <motion.div
            className="absolute inset-0 bg-[#0a0908]"
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.6,
              ease: [0.76, 0, 0.24, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Page loader for initial load with logo path reveal
export function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [drawComplete, setDrawComplete] = useState(false);
  const [phase, setPhase] = useState<"drawing" | "revealing" | "complete">("drawing");
  const { play } = useSound();

  useEffect(() => {
    // Play reveal sound when drawing starts
    const revealTimer = setTimeout(() => {
      play("reveal");
    }, 500);

    // Mark drawing complete after path animation
    const drawTimer = setTimeout(() => {
      setDrawComplete(true);
    }, 2000);

    // Start revealing after drawing and fill complete
    const revealPhaseTimer = setTimeout(() => {
      setPhase("revealing");
    }, 2800);

    // Complete the loader
    const completeTimer = setTimeout(() => {
      setPhase("complete");
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(drawTimer);
      clearTimeout(revealPhaseTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, play]);

  if (phase === "complete") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#0a0908] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "revealing" ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(255, 200, 150, 0.06) 0%, transparent 50%)`,
        }}
      />

      <div className="relative flex flex-col items-center">
        {/* Logo with animated path drawing effect */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Soft glow behind logo */}
          <motion.div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, rgba(255, 200, 150, 0.15) 0%, transparent 70%)`,
              filter: "blur(60px)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: drawComplete ? 0.5 : 0.1,
              scale: drawComplete ? 1 : 0.9,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
          />

          {/* The animated SVG logo */}
          <svg
            viewBox="0 0 500 500"
            className="w-[180px] md:w-[220px] h-auto"
            style={{
              filter: drawComplete ? "drop-shadow(0 0 20px rgba(255, 200, 150, 0.15))" : "none",
            }}
          >
            {/* Drawing stroke animation */}
            <motion.path
              d={LOGO_PATH}
              stroke={accentColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 1 }}
              animate={{ pathLength: 1 }}
              transition={{
                pathLength: {
                  duration: 2,
                  ease: [0.65, 0, 0.35, 1],
                },
              }}
            />

            {/* Fill that fades in after stroke completes */}
            <motion.path
              d={LOGO_PATH}
              fill={accentColor}
              stroke="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: drawComplete ? 1 : 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            />
          </svg>
        </motion.div>

        {/* Brand name that fades in after logo draws */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: drawComplete ? 1 : 0, y: drawComplete ? 0 : 10 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-lg md:text-xl font-bold text-white tracking-[0.15em]">
            EXECUTIVE AI
          </span>
          <span className="block text-xs md:text-sm font-medium text-white/40 tracking-[0.2em] mt-1">
            SOLUTIONS
          </span>
        </motion.div>

        {/* Decorative rings */}
        <motion.div
          className="absolute -inset-16 border border-white/5 rounded-full pointer-events-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: drawComplete ? 1 : 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />
        <motion.div
          className="absolute -inset-28 border border-white/[0.03] rounded-full pointer-events-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: drawComplete ? 1 : 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
}

// Section reveal wrapper - wrap sections for entrance animations
interface SectionRevealProps {
  children: ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

export function SectionReveal({ children, id, className = "", delay = 0 }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Section label mapping
const sectionLabels: Record<string, string> = {
  hero: "Home",
  work: "Work",
  services: "Services",
  contact: "Contact",
};

// Provider component
export function TransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentSection, setCurrentSection] = useState("hero");
  const [targetSection, setTargetSection] = useState("");
  const { play } = useSound();
  const { scrollY } = useScroll();
  const lastSectionRef = useRef("hero");

  // Track current section based on scroll position
  useMotionValueEvent(scrollY, "change", () => {
    if (typeof window === "undefined") return;

    const sections = ["hero", "work", "services", "contact"];
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const rect = element.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;

        if (scrollPosition >= top && scrollPosition < bottom) {
          if (sectionId !== lastSectionRef.current) {
            lastSectionRef.current = sectionId;
            setCurrentSection(sectionId);
            // Subtle sound on section change
            play("tick", { volume: 0.03 });
          }
          break;
        }
      }
    }
  });

  const triggerTransition = useCallback((to: string) => {
    // Don't transition to current section
    if (to === lastSectionRef.current) {
      const element = document.getElementById(to);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    setTargetSection(to);
    setIsTransitioning(true);
    play("transition");

    // Scroll to section when panel covers screen
    setTimeout(() => {
      const element = document.getElementById(to);
      if (element) {
        element.scrollIntoView({ behavior: "instant" });
      }
    }, 300); // Midpoint of 0.6s animation

    setTimeout(() => {
      setIsTransitioning(false);
      setTargetSection("");
    }, 600);
  }, [play]);

  return (
    <TransitionContext.Provider value={{ isTransitioning, currentSection, targetSection, triggerTransition }}>
      <TransitionOverlay isActive={isTransitioning} targetLabel={sectionLabels[targetSection] || targetSection} />
      {children}
    </TransitionContext.Provider>
  );
}

// Hook to use transitions
export function useTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    return {
      isTransitioning: false,
      currentSection: "hero",
      targetSection: "",
      triggerTransition: () => {},
    };
  }
  return context;
}

// Animated content wrapper for staggered reveals
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerReveal({ children, className = "", staggerDelay = 0.1 }: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Child item for stagger animations
export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.215, 0.61, 0.355, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export default TransitionProvider;
