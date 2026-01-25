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
// Three-phase: logo scales DOWN, fills white, then scales UP to reveal
function GSAPTransitionOverlay({ isActive }: { isActive: boolean; targetPage: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blackPanelRef = useRef<HTMLDivElement>(null);
  const logoLayerRef = useRef<HTMLDivElement>(null);
  const solidLogoRef = useRef<HTMLDivElement>(null);
  const maskScaleRef = useRef({ value: 1 });
  const logoOpacityRef = useRef({ value: 0 });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);
  // Cache viewport dimensions to prevent jitter from layout changes during navigation
  const viewportRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const blackPanel = blackPanelRef.current;
    const logoLayer = logoLayerRef.current;
    const solidLogo = solidLogoRef.current;
    if (!container || !blackPanel || !logoLayer || !solidLogo) return;

    // Only start animation when isActive becomes true, ignore when it becomes false
    if (isActive && !isAnimatingRef.current) {
      isAnimatingRef.current = true;

      // Cache viewport dimensions at animation start to prevent jitter
      viewportRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Kill any existing timeline
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // Initial state: container visible, logo layer starts visible with large cutout
      gsap.set(container, { display: "block", pointerEvents: "auto" });
      gsap.set(blackPanel, { opacity: 0 });
      gsap.set(logoLayer, { opacity: 1 });
      gsap.set(solidLogo, { opacity: 0 });

      // Start with large scale (logo cutout fills most of screen showing content behind)
      maskScaleRef.current.value = 80;
      logoOpacityRef.current.value = 0;
      updateMask(logoLayer, 80, 0);
      updateSolidLogo(solidLogo, 1); // Solid logo stays at scale 1

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
          document.body.classList.remove("page-transitioning");
        }
      });
      timelineRef.current = tl;

      // Phase 1: Scale logo DOWN from large to small while fading in the glow
      tl.to(maskScaleRef.current, {
        value: 1,
        duration: 1.0,
        ease: "power2.inOut",
        onUpdate: () => {
          // Fade in logo glow as it shrinks
          const progress = 1 - (maskScaleRef.current.value - 1) / 79;
          logoOpacityRef.current.value = progress;
          updateMask(logoLayer, maskScaleRef.current.value, logoOpacityRef.current.value);
        },
      });

      // Phase 2: Fade in solid white logo (fills in the cutout)
      tl.to(solidLogo, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      // Brief hold with solid logo visible
      tl.to({}, { duration: 0.3 });

      // Phase 3: Fade out solid white logo first
      tl.to(solidLogo, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });

      // Brief pause to show transparent cutout before scaling
      tl.to({}, { duration: 0.2 });

      // Phase 4: Scale cutout UP to reveal new page
      tl.to(maskScaleRef.current, {
        value: 500,
        duration: 1.0,
        ease: "power2.inOut",
        onUpdate: () => {
          updateMask(logoLayer, maskScaleRef.current.value, logoOpacityRef.current.value);
        },
      });

      // Fade out glow as it expands
      tl.to(logoOpacityRef.current, {
        value: 0,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          updateMask(logoLayer, maskScaleRef.current.value, logoOpacityRef.current.value);
        },
      }, "<");

      // Fade out the entire overlay
      tl.to(container, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });

      // Hide container
      tl.set(container, { display: "none", pointerEvents: "none", opacity: 1 });
    }
  }, [isActive]);

  // Update the logo layer with scaled logo mask and glow
  const updateMask = (logoLayer: HTMLDivElement, scale: number, glowOpacity: number) => {
    // Calculate the size of the mask based on scale
    // Start with logo at ~150px centered, scale it up
    const baseSize = 150;
    const size = baseSize * scale;
    const halfSize = size / 2;

    // Calculate glow parameters
    const glowBlur = Math.max(2, 15 - scale * 0.3);
    const strokeWidth = Math.max(1, 4 - scale * 0.1);

    // Add padding to ensure full coverage (matches the container's -10px inset)
    const padding = 20;
    // Use cached viewport dimensions to prevent jitter from layout changes
    const cachedWidth = viewportRef.current.width || window.innerWidth;
    const cachedHeight = viewportRef.current.height || window.innerHeight;
    const width = cachedWidth + padding;
    const height = cachedHeight + padding;
    // Round to prevent sub-pixel jitter during animation
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);
    const translateX = Math.round(centerX - halfSize);
    const translateY = Math.round(centerY - halfSize);
    const logoScale = size / 500;

    // Create an SVG with the logo cutout mask and glowing border
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${width} ${height}">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="${glowBlur}" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <mask id="logoMask">
            <rect width="100%" height="100%" fill="white"/>
            <g transform="translate(${translateX}, ${translateY}) scale(${logoScale})">
              <path d="${LOGO_PATH}" fill="black"/>
            </g>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="black" mask="url(#logoMask)"/>
        <g transform="translate(${translateX}, ${translateY}) scale(${logoScale})" filter="url(#glow)" opacity="${glowOpacity}">
          <path d="${LOGO_PATH}" fill="none" stroke="rgba(255, 200, 150, 0.9)" stroke-width="${strokeWidth}"/>
        </g>
      </svg>
    `;

    const encodedSvg = encodeURIComponent(svgContent);
    logoLayer.style.backgroundImage = `url("data:image/svg+xml,${encodedSvg}")`;
    logoLayer.style.backgroundSize = "100% 100%";
  };

  // Update the solid black logo (centered, fixed size)
  const updateSolidLogo = (solidLogo: HTMLDivElement, scale: number) => {
    const baseSize = 150;
    const size = baseSize * scale;
    const halfSize = size / 2;

    // Add padding to match the container's -10px inset
    const padding = 20;
    // Use cached viewport dimensions to prevent jitter from layout changes
    const cachedWidth = viewportRef.current.width || window.innerWidth;
    const cachedHeight = viewportRef.current.height || window.innerHeight;
    const width = cachedWidth + padding;
    const height = cachedHeight + padding;
    // Round to prevent sub-pixel jitter
    const centerX = Math.round(width / 2);
    const centerY = Math.round(height / 2);
    const translateX = Math.round(centerX - halfSize);
    const translateY = Math.round(centerY - halfSize);
    const logoScale = size / 500;

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${width} ${height}">
        <g transform="translate(${translateX}, ${translateY}) scale(${logoScale})">
          <path d="${LOGO_PATH}" fill="black"/>
        </g>
      </svg>
    `;

    const encodedSvg = encodeURIComponent(svgContent);
    solidLogo.style.backgroundImage = `url("data:image/svg+xml,${encodedSvg}")`;
    solidLogo.style.backgroundSize = "100% 100%";
  };

  return (
    <div
      ref={containerRef}
      className="fixed"
      style={{
        zIndex: 9999,
        display: "none",
        pointerEvents: "none",
        top: "-10px",
        left: "-10px",
        right: "-10px",
        bottom: "-10px",
      }}
    >
      {/* Black panel (unused but kept for potential future use) */}
      <div
        ref={blackPanelRef}
        className="absolute"
        style={{
          backgroundColor: "black",
          opacity: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      {/* Logo layer with mask and glow */}
      <div
        ref={logoLayerRef}
        className="absolute"
        style={{
          opacity: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          willChange: "opacity, background-image",
          backfaceVisibility: "hidden",
        }}
      />
      {/* Solid black logo that fills in during hold phase */}
      <div
        ref={solidLogoRef}
        className="absolute"
        style={{
          opacity: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          willChange: "opacity",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
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

      // Add class to body to hide footer via CSS - persists through navigation
      document.body.classList.add("page-transitioning");

      // Play transition sound and start transition
      play("transition");
      setIsPageTransitioning(true);

      // Navigate during the solid logo phase (after scale down, during white fill)
      // Timeline: 1.0s scale down + 0.3s fade in + 0.3s hold = ~1.6s
      setTimeout(() => {
        router.push(href);
      }, 1600);
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

// Page loader for initial load - 3D isometric logo reveal inspired by premium motion graphics
export function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<
    "intro" | "assemble" | "flatten" | "hold" | "transition" | "reveal"
  >("intro");
  const { play } = useSound();

  useEffect(() => {
    // Phase timing
    const introTimer = setTimeout(() => {
      setPhase("assemble");
      play("reveal");
    }, 300);

    // Logo assembles with construction lines
    const flattenTimer = setTimeout(() => {
      setPhase("flatten");
    }, 1400);

    // Hold the flat logo
    const holdTimer = setTimeout(() => {
      setPhase("hold");
    }, 2200);

    // Transition from light to dark
    const transitionTimer = setTimeout(() => {
      setPhase("transition");
    }, 2800);

    // Final reveal
    const revealTimer = setTimeout(() => {
      setPhase("reveal");
    }, 3400);

    // Complete - remove loader from DOM
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(flattenTimer);
      clearTimeout(holdTimer);
      clearTimeout(transitionTimer);
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete, play]);

  const isIntro = phase === "intro";
  const isAssembling = phase === "assemble";
  const isFlattening = phase === "flatten";
  const isHolding = phase === "hold";
  const isTransitioning = phase === "transition";
  const isRevealing = phase === "reveal";

  // Light background color (subtle lavender/blue tint like the reference)
  const lightBg = "#e8eaef";
  const gridDotColor = "rgba(180, 185, 200, 0.4)";
  const constructionLineColor = "rgba(255, 255, 255, 0.8)";

  return (
    <motion.div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Light background - transitions to dark */}
      <motion.div
        className="absolute inset-0"
        initial={{ backgroundColor: lightBg }}
        animate={{
          backgroundColor:
            isTransitioning || isRevealing ? "#000000" : lightBg,
        }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        }}
      />

      {/* Grid dots pattern */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isTransitioning || isRevealing ? 0 : isIntro ? 0 : 0.6,
        }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundImage: `radial-gradient(circle, ${gridDotColor} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* 3D perspective container */}
      <motion.div
        className="relative flex items-center justify-center will-change-transform z-10"
        style={{ perspective: "1000px" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isRevealing ? 0 : isIntro ? 0 : 1,
        }}
        transition={{
          opacity: {
            duration: isRevealing ? 0.4 : 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          },
        }}
      >
        {/* Logo with 3D rotation */}
        <motion.div
          className="relative"
          initial={{ rotateX: 55, rotateY: -25, rotateZ: 0 }}
          animate={{
            rotateX:
              isFlattening || isHolding || isTransitioning || isRevealing
                ? 0
                : isAssembling
                ? 55
                : 55,
            rotateY:
              isFlattening || isHolding || isTransitioning || isRevealing
                ? 0
                : isAssembling
                ? -25
                : -25,
            rotateZ: 0,
            scale:
              isHolding || isTransitioning
                ? 1.05
                : isFlattening
                ? 1
                : isAssembling
                ? 0.9
                : 0.8,
          }}
          transition={{
            duration: 1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Outer construction circle */}
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              width: "calc(20vw + 60px)",
              height: "calc(20vw + 60px)",
              minWidth: "180px",
              minHeight: "180px",
              maxWidth: "360px",
              maxHeight: "360px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              borderColor: constructionLineColor,
            }}
            initial={{ scale: 0.5, opacity: 0, pathLength: 0 }}
            animate={{
              scale:
                isTransitioning || isRevealing
                  ? 1.2
                  : isFlattening || isHolding
                  ? 1
                  : isAssembling
                  ? 1
                  : 0.5,
              opacity:
                isTransitioning || isRevealing
                  ? 0
                  : isFlattening || isHolding
                  ? 0.3
                  : isAssembling
                  ? 0.6
                  : 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />

          {/* Inner construction circle */}
          <motion.div
            className="absolute rounded-full border"
            style={{
              width: "calc(20vw + 20px)",
              height: "calc(20vw + 20px)",
              minWidth: "140px",
              minHeight: "140px",
              maxWidth: "320px",
              maxHeight: "320px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              borderColor: constructionLineColor,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale:
                isTransitioning || isRevealing
                  ? 1.1
                  : isFlattening || isHolding
                  ? 1
                  : isAssembling
                  ? 1
                  : 0.8,
              opacity:
                isTransitioning || isRevealing
                  ? 0
                  : isFlattening || isHolding
                  ? 0.2
                  : isAssembling
                  ? 0.5
                  : 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />

          {/* Soft glow/shadow behind logo */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: "calc(20vw + 100px)",
              height: "calc(20vw + 100px)",
              minWidth: "220px",
              minHeight: "220px",
              maxWidth: "400px",
              maxHeight: "400px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background:
                isTransitioning || isRevealing
                  ? `radial-gradient(ellipse at center, ${accentColor}30 0%, transparent 70%)`
                  : "radial-gradient(ellipse at center, rgba(200, 210, 230, 0.5) 0%, transparent 70%)",
              filter: "blur(30px)",
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity:
                isRevealing
                  ? 0
                  : isTransitioning
                  ? 0.8
                  : isHolding
                  ? 0.6
                  : isFlattening
                  ? 0.5
                  : isAssembling
                  ? 0.3
                  : 0,
            }}
            transition={{ duration: 0.5 }}
          />

          {/* SVG logo */}
          <svg
            viewBox="0 0 500 500"
            className="w-[20vw] h-auto relative z-10"
            style={{
              minWidth: "120px",
              maxWidth: "300px",
            }}
          >
            <defs>
              <filter id="loader-glow-3d">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="loader-shadow">
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="15"
                  floodColor="rgba(0,0,0,0.15)"
                />
              </filter>
            </defs>

            {/* Drawing stroke - white during assembly, accent during transition */}
            <motion.path
              d={LOGO_PATH}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#loader-glow-3d)"
              initial={{ pathLength: 0, opacity: 0, stroke: "#ffffff" }}
              animate={{
                pathLength:
                  isAssembling ||
                  isFlattening ||
                  isHolding ||
                  isTransitioning
                    ? 1
                    : 0,
                opacity:
                  isRevealing
                    ? 0
                    : isTransitioning
                    ? 0.3
                    : isHolding
                    ? 0.5
                    : isFlattening
                    ? 0.8
                    : isAssembling
                    ? 1
                    : 0,
                stroke: isTransitioning ? accentColor : "#ffffff",
              }}
              transition={{
                pathLength: {
                  duration: 0.9,
                  ease: [0.65, 0, 0.35, 1],
                },
                opacity: {
                  duration: 0.3,
                  ease: [0.25, 0.1, 0.25, 1],
                },
                stroke: {
                  duration: 0.5,
                },
              }}
            />

            {/* Filled logo - appears during flatten phase */}
            <motion.path
              d={LOGO_PATH}
              stroke="none"
              filter={
                isTransitioning || isRevealing ? "none" : "url(#loader-shadow)"
              }
              initial={{ opacity: 0, fill: "#ffffff" }}
              animate={{
                opacity:
                  isRevealing
                    ? 0
                    : isTransitioning
                    ? 1
                    : isHolding
                    ? 1
                    : isFlattening
                    ? 0.9
                    : 0,
                fill: isTransitioning || isRevealing ? accentColor : "#ffffff",
              }}
              transition={{
                opacity: {
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                },
                fill: {
                  duration: 0.5,
                },
              }}
              style={{
                filter:
                  isTransitioning || isRevealing
                    ? `drop-shadow(0 0 30px ${accentColor}50)`
                    : undefined,
              }}
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Brand text - appears during hold phase with dark background */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 text-center z-10"
        style={{ top: "calc(50% + 14vw)" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isRevealing ? 0 : isTransitioning ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
          delay: isTransitioning ? 0.2 : 0,
        }}
      >
        <motion.div className="overflow-hidden">
          <motion.span
            className="block text-base md:text-lg font-semibold text-white tracking-[0.25em]"
            initial={{ y: 20, opacity: 0 }}
            animate={{
              y: isTransitioning ? 0 : 20,
              opacity: isTransitioning ? 1 : 0,
            }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            EXECUTIVE AI
          </motion.span>
        </motion.div>

        <motion.div className="overflow-hidden mt-1">
          <motion.span
            className="block text-xs text-white/40 tracking-[0.4em] uppercase font-light"
            initial={{ y: 15, opacity: 0 }}
            animate={{
              y: isTransitioning ? 0 : 15,
              opacity: isTransitioning ? 1 : 0,
            }}
            transition={{
              duration: 0.45,
              delay: 0.08,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            Design Studio
          </motion.span>
        </motion.div>
      </motion.div>
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
