"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSound } from "./SoundManager";

// Warm accent color to match the site
const accentColor = "rgba(255, 200, 150, 1)";

// Context for managing page route transitions
interface PageTransitionContextType {
  isPageTransitioning: boolean;
  navigateTo: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isPageTransitioning: false,
  navigateTo: () => {},
});

export const usePageTransition = () => useContext(PageTransitionContext);


// Provider for page route transitions
export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { play } = useSound();

  const navigateTo = useCallback(
    (href: string) => {
      // Don't transition if already on the page
      if (href === pathname) return;

      // Play transition sound and navigate immediately
      // The template.tsx handles the slide-up animation
      play("transition");
      setIsPageTransitioning(true);
      router.push(href);
    },
    [pathname, play, router]
  );

  // Reset transition state when pathname changes
  useEffect(() => {
    setIsPageTransitioning(false);
  }, [pathname]);

  return (
    <PageTransitionContext.Provider value={{ isPageTransitioning, navigateTo }}>
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
  onClick: externalOnClick,
  ...props
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: () => void;
  onClick?: () => void;
  [key: string]: unknown;
}) {
  const { navigateTo, isPageTransitioning } = usePageTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPageTransitioning) return;

    // Call external onClick if provided (for sounds, etc.)
    if (externalOnClick) externalOnClick();

    navigateTo(href);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
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

// Page loader for initial load
export function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "revealing" | "complete">("loading");
  const { play } = useSound();

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Play tick sound at intervals
        if (prev % 20 === 0 && prev > 0) {
          play("tick");
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [play]);

  useEffect(() => {
    if (progress >= 100) {
      setPhase("revealing");
      play("reveal");
      setTimeout(() => {
        setPhase("complete");
        onComplete();
      }, 1000);
    }
  }, [progress, onComplete, play]);

  if (phase === "complete") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "revealing" ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative">
        {/* Logo placeholder */}
        <motion.div
          className="text-4xl font-black text-white tracking-[-0.02em] mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          EXECUTIVE
        </motion.div>

        {/* Progress bar */}
        <div className="w-64 h-px bg-white/10 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00f0ff] to-white"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="absolute inset-0 bg-[#00f0ff]/30 blur-sm"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Progress text */}
        <motion.p
          className="text-white/40 text-xs font-mono mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {Math.floor(Math.min(progress, 100))}%
        </motion.p>

        {/* Decorative rings */}
        <motion.div
          className="absolute -inset-20 border border-white/5 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        <motion.div
          className="absolute -inset-32 border border-white/5 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
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
