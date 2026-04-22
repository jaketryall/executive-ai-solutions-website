"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import AnimatedLogo from "./AnimatedLogo";
import { TransitionLink } from "./PageTransition";
import { gsap, SplitText } from "@/lib/gsap-setup";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const heroProjects = [
  { slug: "overdue", title: "Overdue", category: "Calendar App", image: "/custom-dashboard-mockup.webp" },
  { slug: "riled-up", title: "Riled Up", category: "Coaching", image: "/Celestial iPhone Mockup.webp" },
  { slug: "wings-n-wheels", title: "Wings N Wheels", category: "Design Showcase", image: "/Rubber iPhone Mockup.webp" },
  { slug: "adventure-air", title: "Adventure Air", category: "Gyrocopter Tours", image: "/Elegant Black Laptop Mockup.webp" },
];

const LOGO_PATH ="M818.41,570.38c15.05,0,19.94-12.01,19.94-32.84v-44.63c0-14.1-1.3-32.55-19.56-32.55H685.46c-8.01,0-12.19,7.43-14.91,14.56l-59.58,173.38c-2.14,5.61-7.02,7.55-12.88,7.55H402.05c-52,0-94.75-39.61-99.71-90.3V416.41c0-38.13,22.95-70.91,55.79-85.25c-35.32-15.72-56.3-50.36-56.31-86.68v-90.87c0-51.94,42.11-94.05,94.05-94.05c0.98,0,1.95,0.01,2.93,0.05h198.9c7.92,0,14.33,6.42,14.33,14.33c0,1.58-0.26,3.1-0.73,4.52c-7.43,22.16-14.95,44.26-22.55,66.31c-2.58,7.48-10.4,8.88-18.22,8.88c-0.04,0-0.08-0.03-0.12-0.04H425.71c-16.19,2.06-27.84,16.3-26.91,32.35v59.32c0,14.92,12.03,27.03,26.91,27.17c42.5,0.39,84.92,0,127.25,0c9.09,0,17.05,6.72,14.46,14.2c-0.97,2.8-2.05,5.45-3.43,9.44l-19.75,57.05c-3.13,9.04-13.06,10.33-22.03,10.33c-0.57,0-0.5,0-0.98,0h-74.16c-24.87,0-45.04,20.16-45.04,45.04c0,2.87,0,5.62,0,7.91v117.45c-0.09,15.01-3.55,31.7,23.66,31.7h96.52c12.17,0,16.56-6.09,22.04-22.04c0.25-0.72,0.48-1.25,0.64-1.71L703.6,78.46c2.76-8.03,5.58-18.86,14.58-18.86h129.22c52.12,0,94.43,42.03,94.88,94.04v158.93c0,7.91-6.42,14.33-14.33,14.33c-0.38,0-0.75-0.01-1.12-0.04h-72.63c-8.28,0-15.09-6.25-15.99-14.29V185.96c0-20.35-16.5-36.86-36.86-36.86c-6.61,0-17.46,2.65-20.81,12.59c-17.05,50.53-68.21,202.14-68.21,202.14c-0.87,2.57,0.37,6.21,3.08,6.21c1.21,0,1.99,0,3.02,0l119.78,0.04c52.82,0,104.07,39.42,104.07,89.65v105.82c0,52.41-42.48,94.89-94.89,94.89c-0.65,0-1.3-0.01-1.95-0.02h-127c-7.23,0-18.16,0.71-14.19-12.3l21.22-69.45c1.6-5.23,6.53-8.53,11.75-8.29";

// Logo with dark outline that fills gold on hover
function HeroLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="cursor-pointer"
      style={{ width: 36, height: 36 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg viewBox="280 40 680 640" className="w-full h-full">
        {/* Fill — fades in on hover */}
        <motion.path
          d={LOGO_PATH}
          animate={{
            fill: hovered ? "rgba(120, 115, 108, 1)" : "rgba(26, 24, 22, 0.15)",
            stroke: hovered ? "rgba(120, 115, 108, 1)" : "rgba(26, 24, 22, 0.4)",
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          strokeWidth="2"
        />
      </svg>
    </motion.div>
  );
}

// Staggered letter hover button — letters slide out upward, new set slides in from below
function StaggerButton({
  text,
  href,
  className = "",
}: {
  text: string;
  href: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const letters = text.split("");

  return (
    <TransitionLink
      href={href}
      className={`relative overflow-hidden inline-flex items-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden className="flex">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="relative inline-block overflow-hidden"
            style={{ lineHeight: 1.2 }}
          >
            {/* Original letter — slides up on hover */}
            <motion.span
              className="inline-block"
              animate={{ y: hovered ? "-100%" : "0%" }}
              transition={{
                duration: 0.3,
                delay: hovered ? i * 0.02 : (letters.length - i) * 0.02,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
            {/* Duplicate letter — slides up from below */}
            <motion.span
              className="absolute left-0 top-0 inline-block"
              animate={{ y: hovered ? "0%" : "100%" }}
              transition={{
                duration: 0.3,
                delay: hovered ? i * 0.02 : (letters.length - i) * 0.02,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          </span>
        ))}
      </span>
    </TransitionLink>
  );
}

// Splash menu nav item with stagger text hover
function SplashNavItem({
  href,
  label,
  index,
  onNavigate,
}: {
  href: string;
  label: string;
  index: number;
  onNavigate: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const letters = label.split("");

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.5, delay: 0.2 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="border-b border-white/5"
    >
      <TransitionLink
        href={href}
        onClick={onNavigate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group flex items-center justify-between py-4"
      >
        <span
          className="relative inline-flex overflow-hidden"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "#f3f1ee",
          }}
        >
          <span className="flex">
            {letters.map((letter, i) => (
              <span key={i} className="relative inline-block overflow-hidden">
                <motion.span
                  className="inline-block"
                  animate={{ y: hovered ? "-100%" : "0%" }}
                  transition={{
                    duration: 0.3,
                    delay: hovered ? i * 0.02 : (letters.length - i) * 0.015,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
                <motion.span
                  className="absolute left-0 top-0 inline-block"
                  style={{ color: "rgba(229, 225, 219, 1)" }}
                  animate={{ y: hovered ? "0%" : "100%" }}
                  transition={{
                    duration: 0.3,
                    delay: hovered ? i * 0.02 : (letters.length - i) * 0.015,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              </span>
            ))}
          </span>
        </span>

        <motion.svg
          width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          animate={{
            color: hovered ? "rgba(229, 225, 219, 1)" : "rgba(255,255,255,0)",
            x: hovered ? 0 : -4,
          }}
          transition={{ duration: 0.3 }}
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </motion.svg>
      </TransitionLink>
    </motion.div>
  );
}

// Work items for mobile hero showcase
const mobileWorkItems = [
  { title: "DESERT WINGS", category: "Flight School", image: "/thumbnails/Celestial Laptop Mockup.webp", slug: "desert-wings" },
  { title: "RILED UP", category: "Coaching", image: "/thumbnails/Celestial iPhone Mockup.webp", slug: "riled-up" },
  { title: "WINGS N WHEELS", category: "Detailing", image: "/thumbnails/Rubber iPhone Mockup.webp", slug: "wings-n-wheels" },
  { title: "ADVENTURE AIR", category: "Tours", image: "/thumbnails/Elegant Black Laptop Mockup.webp", slug: "adventure-air" },
];

/* ─── Fan cards with group hover — all cards react when one is hovered ─── */
// hoveredIndex: -1 = video card, 0/1/2 = fan cards
function HeroFanCards({
  hoveredIndex,
  setHoveredIndex,
}: {
  hoveredIndex: number | null;
  setHoveredIndex: (i: number | null) => void;
  videoCardIndex: number;
}) {
  // totalCards: video card (-1) + 3 fan cards (0, 1, 2) = 4 cards
  // When a card is hovered, others spread away
  const getHoverOffset = (cardIndex: number) => {
    if (hoveredIndex === null) return { x: 0, y: 0, scale: 1 };

    if (cardIndex === hoveredIndex) {
      return { x: 0, y: -25, scale: 1.08 };
    }

    // Push away from hovered card
    const dir = cardIndex < hoveredIndex ? -1 : 1;
    const pushX = dir * 35;
    const pushY = 8;

    return { x: pushX, y: pushY, scale: 0.97 };
  };

  return (
    <div
      data-seam-fan
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: -1 }}
    >
      {heroProjects.map((project, i) => {
        const offset = getHoverOffset(i);
        const isHovered = hoveredIndex === i;

        return (
          <div
            key={project.slug}
            className="hero-fan-card absolute pointer-events-auto will-change-transform"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <TransitionLink href={`/work/${project.slug}`} data-card>
              <div
                className="relative overflow-hidden cursor-pointer"
                style={{
                  width: 300,
                  height: 420,
                  borderRadius: 20,
                  border: "1px solid rgba(26,24,22,0.12)",
                  boxShadow: isHovered
                    ? "0 35px 80px rgba(0,0,0,0.2)"
                    : "0 15px 50px rgba(0,0,0,0.1)",
                  transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease",
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${offset.scale})`,
                  zIndex: isHovered ? 30 : 1,
                }}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-2" style={{ color: "#78736c", opacity: 0.8 }}>
                    {project.category}
                  </p>
                  <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "1.1rem", fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                    {project.title}
                  </h3>
                </div>
              </div>
            </TransitionLink>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Hero correction text — types "I build beautiful websites." then
   strikes through "beautiful" and rises "converting" into its place ─── */
function HeroCorrectionText() {
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [phase, setPhase] = useState<"typing" | "striking" | "rising" | "done">("typing");
  const [typedCount, setTypedCount] = useState(0);
  const beautifulRef = useRef<HTMLSpanElement>(null);
  const strikeLineRef = useRef<SVGLineElement>(null);
  const convertingRef = useRef<HTMLSpanElement>(null);

  const fullSentence = "I design static interfaces.";

  // Skip on return visit
  useEffect(() => {
    if (typeof window !== "undefined") {
      const seen = sessionStorage.getItem("hero-seen");
      if (seen) {
        setSkipAnimation(true);
        setPhase("done");
      }
    }
  }, []);

  // Phase: typing
  useEffect(() => {
    if (phase !== "typing" || skipAnimation) return;
    if (typedCount >= fullSentence.length) {
      const t = setTimeout(() => setPhase("striking"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTypedCount((c) => c + 1), 35);
    return () => clearTimeout(t);
  }, [phase, typedCount, skipAnimation]);

  // Phase: striking — DrawSVG line across "beautiful" + fade word to 30%
  useEffect(() => {
    if (phase !== "striking") return;
    if (typeof window === "undefined") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setPhase("rising") });
      if (strikeLineRef.current) {
        tl.fromTo(
          strikeLineRef.current,
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", duration: 0.35, ease: "power2.inOut" }
        );
      }
      if (beautifulRef.current) {
        tl.to(beautifulRef.current, { opacity: 0.3, duration: 0.3, ease: "power2.out" }, 0.05);
      }
    });
    return () => ctx.revert();
  }, [phase]);

  // Phase: rising — SplitText chars mask reveal for "converting"
  useEffect(() => {
    if (phase !== "rising") return;
    const convEl = convertingRef.current;
    if (!convEl) {
      setPhase("done");
      return;
    }
    let split: InstanceType<typeof SplitText> | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(convEl, { type: "chars", mask: "chars", charsClass: "h-conv-char" });
      gsap.set(split.chars, { yPercent: 110 });
      gsap.set(convEl, { autoAlpha: 1 });
      const tl = gsap.timeline({
        onComplete: () => {
          if (beautifulRef.current) {
            gsap.to(beautifulRef.current, {
              opacity: 0,
              duration: 0.6,
              ease: "power2.out",
              onComplete: () => {
                setPhase("done");
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("hero-seen", "1");
                }
              },
            });
          } else {
            setPhase("done");
            if (typeof window !== "undefined") {
              sessionStorage.setItem("hero-seen", "1");
            }
          }
        },
      });
      tl.to(split.chars, { yPercent: 0, duration: 0.5, stagger: 0.02, ease: "appleOut" });
    });
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [phase]);

  const showCursor = phase === "typing" && !skipAnimation;
  const typed = phase === "typing" ? fullSentence.slice(0, typedCount) : fullSentence;

  return (
    <h1
      aria-label="I design living interfaces."
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
        fontWeight: 900,
        lineHeight: 1.05,
        letterSpacing: "-0.03em",
        color: "#1a1816",
      }}
    >
      {phase === "typing" ? (
        <>
          {typed}
          {showCursor && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
              style={{ color: "#78736c" }}
            >
              |
            </motion.span>
          )}
        </>
      ) : phase === "done" ? (
        <>I design living interfaces.</>
      ) : (
        <>
          <span>I design </span>
          <span style={{ position: "relative", display: "inline-block" }}>
            <span ref={beautifulRef} style={{ display: "inline-block", color: "#1a1816" }}>
              static
            </span>
            {/* Strike line — DrawSVG animates it left→right */}
            <svg
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: "50%",
                width: "100%",
                height: 4,
                overflow: "visible",
                pointerEvents: "none",
              }}
              viewBox="0 0 100 4"
              preserveAspectRatio="none"
            >
              <line
                ref={strikeLineRef}
                x1="0"
                y1="2"
                x2="100"
                y2="2"
                stroke="#1a1816"
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {/* "converting" rises up from below via SplitText chars mask */}
            <span
              ref={convertingRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                color: "#1a1816",
                visibility: phase === "rising" ? "visible" : "hidden",
                opacity: 0,
                whiteSpace: "nowrap",
              }}
            >
              living
            </span>
          </span>
          <span> interfaces.</span>
        </>
      )}
    </h1>
  );
}

// No separate MobileHero — DesktopHero is now responsive for all screen sizes

// Continuous horizontal scroll of client names — "trusted by" strip below the hero CTA
function ClientLogosMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [hovered, setHovered] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(track, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  // Slow (not stop) the marquee on hover so users can read — still subtly moving
  // so the "live" feel doesn't break. 0.15x = 6.6x slower than resting pace.
  useEffect(() => {
    const tween = tweenRef.current;
    if (!tween) return;
    gsap.to(tween, {
      timeScale: hovered ? 0.15 : 1,
      duration: 0.6,
      ease: "power2.out",
    });
  }, [hovered]);

  const clients = [
    "Desert Wings",
    "Riled Up",
    "Wings N Wheels",
    "Adventure Air",
    "Overdue",
  ];

  return (
    <div
      className="overflow-hidden w-full cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        // Fade only the left edge — marquee reads like it's continuously arriving
        // from the left side of the hero, not looped into a tight box.
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 100%)",
      }}
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap"
        style={{ willChange: "transform" }}
      >
        {[...clients, ...clients].map((name, i) => (
          <span
            key={i}
            className="group/client flex items-center transition-colors duration-300 hover:text-[#1a1816]"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(26,24,22,0.42)",
              flexShrink: 0,
              paddingRight: "3rem",
              cursor: "default",
            }}
          >
            {name}
            <span
              aria-hidden="true"
              className="transition-all duration-300 group-hover/client:scale-[2.5] group-hover/client:bg-[#1a1816]!"
              style={{
                marginLeft: "3rem",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "rgba(26,24,22,0.25)",
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}

// Desktop Hero — shrinks on scroll
// Projects currently shipping — cycles in the right-rail micro-card.
// Hardcoded for now; move to Sanity later if we want to edit without redeploys.
const CURRENTLY_SHIPPING = [
  { name: "Desert Wings", category: "Flight School", slug: "desert-wings" },
  { name: "Riled Up", category: "Coaching", slug: "riled-up" },
  { name: "Wings N Wheels", category: "Design Showcase", slug: "wings-n-wheels" },
  { name: "Adventure Air", category: "Gyrocopter Tours", slug: "adventure-air" },
];

// Format elapsed seconds as MM:SS (with leading zeros) for the live session timer.
function formatSession(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function DesktopHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredFanIndex, setHoveredFanIndex] = useState<number | null>(null);
  const [scrollHintHovered, setScrollHintHovered] = useState(false);

  // "Currently shipping" crossfade cycle — advance every 4s, paused while hovered
  // so users can actually read / click whichever project caught their eye.
  const [activeShippingIdx, setActiveShippingIdx] = useState(0);
  const [shippingHovered, setShippingHovered] = useState(false);
  useEffect(() => {
    if (shippingHovered) return;
    const id = window.setInterval(() => {
      setActiveShippingIdx((i) => (i + 1) % CURRENTLY_SHIPPING.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [shippingHovered]);

  // Live MM:SS session timer — counts up from page load. Purely aesthetic,
  // reinforces the "studio is running" feeling of the hero.
  const [sessionSeconds, setSessionSeconds] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Text parallax-fades up + video box drifts up on scroll
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const videoBox = videoBoxRef.current;
    const heroContent = heroContentRef.current;
    if (!section || !videoBox || !heroContent) return;

    const ctx = gsap.context(() => {
      // Hero text moves up faster than scroll + fades out
      gsap.to(heroContent, {
        y: -150,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "30% top",
          scrub: true,
        },
      });

      // Client ticker shrinks in width as the user scrolls into the fan moment,
      // so it reads as a tight byline instead of a wide bar competing with the
      // "Recent Projects" headline once it travels up the viewport.
      const marqueeWrapper = section.querySelector<HTMLElement>(".hero-marquee-wrapper");
      if (marqueeWrapper) {
        gsap.to(marqueeWrapper, {
          maxWidth: 200,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "5% top",
            end: "30% top",
            scrub: true,
          },
        });
      }

      // Video box shrinks into a vertical card
      const shrinkTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "15% top",
          end: "65% top",
          scrub: 0.3,
        },
      });

      // Shrink video frame into a vertical card shape
      const videoFrame = videoBox.querySelector(".video-frame") as HTMLElement;
      if (videoFrame) {
        shrinkTl.to(videoFrame, {
          width: "420px",
          height: "520px",
          aspectRatio: "auto",
          ease: "power2.inOut",
        }, 0);
      }

      // Slide the whole sticky video back toward viewport center as it shrinks —
      // the hero layout places it in the right column (marginLeft: auto inside a
      // 640px max cap), so without this the fan spreads from a right-anchored
      // pivot instead of viewport center. Math: videoBox natural center sits at
      // `viewport_right - pad - maxWidth/2`; we translate left by the delta to
      // viewport center. invalidateOnRefresh re-computes on resize.
      shrinkTl.to(
        videoBox,
        {
          x: () => {
            const pad = 48; // approx lg:px padding
            const maxW = 640; // sticky motion.div maxWidth
            return -(window.innerWidth / 2 - pad - maxW / 2);
          },
          ease: "power2.inOut",
        },
        0
      );

      // "Selected Work" label fades in as card shrinks
      const workLabel = videoBox.querySelector(".work-label");
      if (workLabel) {
        shrinkTl.fromTo(workLabel,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: "power2.out" },
          0.2
        );
      }

      // Fan cards emerge from behind the video card
      const fanCards = gsap.utils.toArray<HTMLElement>(videoBox.querySelectorAll(".hero-fan-card"));
      const fanPositions = [
        { x: -520, y: 90, rotation: -14 },    // Far left
        { x: -320, y: 40, rotation: -8 },     // Left
        { x: 320, y: 40, rotation: 8 },       // Right
        { x: 520, y: 90, rotation: 14 },      // Far right
      ];

      fanCards.forEach((card) => {
        gsap.set(card, { x: 0, y: 0, rotation: 0, opacity: 0, scale: 0.9 });
      });

      // Fan out starts slightly after the shrink begins
      fanCards.forEach((card, i) => {
        shrinkTl.to(card, {
          x: fanPositions[i].x,
          y: fanPositions[i].y,
          rotation: fanPositions[i].rotation,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.4)",
        }, 0.4 + i * 0.1);
      });

      // Fade cream background out so dark shows through
      const creamBg = section.querySelector(".hero-cream-bg");
      if (creamBg) {
        shrinkTl.to(creamBg, {
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.6,
        }, 0.5);
      }

      // Fade video out, reveal project card underneath
      const heroVideo = videoBox.querySelector(".hero-video");
      const cardOverlay = videoBox.querySelector(".card-overlay");
      if (heroVideo) {
        shrinkTl.to(heroVideo, {
          opacity: 0,
          ease: "power2.inOut",
          duration: 0.5,
        }, 0.3);
      }
      if (cardOverlay) {
        shrinkTl.to(cardOverlay, {
          opacity: 1,
          ease: "power2.inOut",
          duration: 0.5,
        }, 0.5);
      }

    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative"
        data-bg="cream"
        data-seam-exit="seam-1"
      >
        <div className="relative min-h-screen w-full">

          {/* Cream background — fades out as cards appear */}
          <div className="hero-cream-bg absolute inset-0" style={{ background: "#f3f1ee" }} />

          {/* NAV BAR — fixed at top */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 md:px-8 pt-14 md:pt-7"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <TransitionLink href="/" className="block" style={{ color: "#1a1816" }}>
              <svg
                viewBox="30 30 600 250"
                fill="none"
                preserveAspectRatio="xMinYMid meet"
                className="w-[100px] md:w-[130px] h-auto"
              >
                <path
                  d="M60,160 C65,100 80,60 95,55 C115,48 110,100 108,130 C105,165 90,200 80,210 Q70,220 85,215 C110,205 135,160 155,155 C175,150 170,185 160,200 Q148,218 165,210 C185,200 195,175 210,165 Q230,152 225,180 C220,205 200,225 195,218 Q188,208 210,195 C225,186 250,175 270,200 Q275,208 265,208 C250,208 280,170 310,120 C325,95 340,75 350,70 Q365,64 358,90 C350,120 335,165 340,185 Q345,200 360,185 C375,168 385,145 400,155 Q408,160 400,178 C390,200 365,230 360,248 Q355,265 370,250 C390,228 410,195 430,188 Q445,182 442,200 C438,215 425,225 435,220 Q450,212 460,140 L462,210 Q465,130 475,128 L477,210 C485,205 520,188 560,182 Q600,176 620,190"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </TransitionLink>
            {/* Corner ghost CTA removed — global nav handles "Start a project". */}
          </motion.div>

          {/* === "Live Studio" corners: masthead TL, availability TR ===
              Masthead is a click target to /about. On hover the underline rule
              expands and a tiny `→ About` wayfinder fades in under Vol./year. */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-20 hidden lg:block"
            style={{
              top: "clamp(12vh, 14vh, 16vh)",
              left: "clamp(1.25rem, 3vw, 3rem)",
            }}
          >
            <TransitionLink
              href="/about"
              className="group flex flex-col"
              style={{ gap: "0.45rem" }}
            >
              <span
                className="transition-colors duration-300 group-hover:text-[#1a1816]"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "rgba(26,24,22,0.7)",
                }}
              >
                Jake Ryall — Design Engineer
              </span>
              <div
                className="transition-all duration-500 ease-out group-hover:w-20 group-hover:bg-[rgba(26,24,22,0.4)]"
                style={{ width: 40, height: 1, backgroundColor: "rgba(26,24,22,0.15)" }}
              />
              <span
                className="flex items-center"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.68rem",
                  fontVariantNumeric: "tabular-nums",
                  color: "rgba(26,24,22,0.4)",
                  letterSpacing: "0.05em",
                  gap: "0.4rem",
                }}
              >
                <span>Vol. 1 · 2026</span>
                <span
                  className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-300"
                  style={{ color: "#1a1816", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}
                >
                  → About
                </span>
              </span>
            </TransitionLink>
          </motion.div>

          {/* Availability chip removed — global nav owns it to avoid duplicate status. */}

          {/* === Main grid: headline left, currently-shipping + video right === */}
          <div
            className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] lg:items-start"
            style={{ paddingTop: "clamp(18vh, 22vh, 26vh)" }}
          >
            {/* LEFT column — kicker + headline + subline + dual CTA */}
            <div
              ref={heroContentRef}
              className="flex flex-col items-start text-left"
              style={{
                paddingLeft: "clamp(1.25rem, 3vw, 3rem)",
                paddingRight: "clamp(1rem, 2vw, 2rem)",
              }}
            >
              {/* Step 1.1 — Identity kicker */}
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(26,24,22,0.5)",
                  marginBottom: "1.5rem",
                }}
              >
                Jake Ryall · Design Engineer · Available Q3 2026
              </motion.p>

              {/* Step 1.2 — Strikethrough headline */}
              <div style={{ maxWidth: 900 }}>
                <HeroCorrectionText />
              </div>

              {/* Step 1.3 — Updated subline */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)",
                  color: "rgba(26,24,22,0.55)",
                  marginTop: "1.5rem",
                  maxWidth: "500px",
                  lineHeight: 1.6,
                }}
              >
                I'm a motion-forward design engineer. Most of my time goes into the 400ms after a click — where trust gets built.
              </motion.p>

              {/* Step 1.4 — Dual CTA: primary dark + ghost secondary */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 3.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginTop: "2rem" }}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <TransitionLink
                    href="/contact"
                    className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full transition-colors duration-300 hover:bg-[#78736c] group"
                    style={{ backgroundColor: "#1a1816", color: "#f3f1ee" }}
                  >
                    <span className="text-sm font-semibold uppercase tracking-widest">
                      Start a Project
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </TransitionLink>

                  <TransitionLink
                    href="/work"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full transition-colors duration-300 hover:border-[rgba(26,24,22,0.45)]"
                    style={{
                      backgroundColor: "transparent",
                      color: "#1a1816",
                      border: "1px solid rgba(26,24,22,0.2)",
                    }}
                  >
                    <span className="text-sm font-semibold uppercase tracking-widest">
                      See my work
                    </span>
                    <span aria-hidden>→</span>
                  </TransitionLink>
                </div>
              </motion.div>
              {/* Rating row removed — moved to Proof section (Task 4) */}
            </div>

            {/* RIGHT column — currently-shipping card + 130vh sticky video */}
            <div
              className="relative"
              style={{
                paddingRight: "clamp(1.25rem, 3vw, 3rem)",
                paddingLeft: "clamp(1rem, 2vw, 2rem)",
              }}
            >
              {/* Currently-shipping card removed — was duplicating FeaturedWork + nav chip. */}
              {false && <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 3.3, ease: [0.22, 1, 0.36, 1] }}
                onMouseEnter={() => setShippingHovered(true)}
                onMouseLeave={() => setShippingHovered(false)}
                className="hidden lg:flex flex-col"
                style={{
                  maxWidth: 260,
                  marginLeft: "auto",
                  marginBottom: "clamp(1.5rem, 3vh, 2.5rem)",
                }}
              >
                <div
                  className="flex items-center"
                  style={{ gap: "0.5rem", marginBottom: "0.55rem" }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "rgba(26,24,22,0.4)",
                    }}
                  >
                    [ Currently shipping ]
                  </span>
                  <motion.span
                    animate={{ opacity: shippingHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      color: "rgba(26,24,22,0.35)",
                    }}
                  >
                    ⏸ PAUSED
                  </motion.span>
                </div>
                <TransitionLink
                  href={`/work/${CURRENTLY_SHIPPING[activeShippingIdx].slug}`}
                  className="group block"
                >
                  <div className="relative" style={{ minHeight: 54 }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={CURRENTLY_SHIPPING[activeShippingIdx].slug}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="flex items-baseline" style={{ gap: "0.45rem" }}>
                          <p
                            style={{
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "1.08rem",
                              fontWeight: 900,
                              color: "#1a1816",
                              letterSpacing: "-0.02em",
                              lineHeight: 1.15,
                            }}
                          >
                            {CURRENTLY_SHIPPING[activeShippingIdx].name}
                          </p>
                          <motion.span
                            animate={{
                              x: shippingHovered ? 4 : 0,
                              opacity: shippingHovered ? 0.75 : 0,
                            }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                              fontSize: "0.85rem",
                              color: "#1a1816",
                              lineHeight: 1,
                            }}
                          >
                            →
                          </motion.span>
                        </div>
                        <div
                          className="flex items-center"
                          style={{ gap: "0.45rem", marginTop: "0.35rem" }}
                        >
                          <motion.span
                            className="inline-block"
                            animate={{
                              backgroundColor: shippingHovered
                                ? "#1a1816"
                                : "#78736c",
                            }}
                            transition={{ duration: 0.3 }}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 1,
                            }}
                          />
                          <span
                            className="transition-colors duration-300 group-hover:text-[rgba(26,24,22,0.8)]"
                            style={{
                              fontFamily: "var(--font-inter), sans-serif",
                              fontSize: "0.72rem",
                              fontWeight: 500,
                              color: "rgba(26,24,22,0.55)",
                            }}
                          >
                            {CURRENTLY_SHIPPING[activeShippingIdx].category}
                          </span>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </TransitionLink>
                {/* Progress segments — click to jump to that project */}
                <div
                  className="flex items-center"
                  style={{ gap: "0.35rem", marginTop: "0.85rem" }}
                >
                  {CURRENTLY_SHIPPING.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show project ${i + 1} of ${CURRENTLY_SHIPPING.length}`}
                      onClick={() => setActiveShippingIdx(i)}
                      className="cursor-pointer transition-all duration-400 ease-out hover:!bg-[rgba(26,24,22,0.7)]"
                      style={{
                        width: i === activeShippingIdx ? 22 : 6,
                        height: 2,
                        borderRadius: 2,
                        backgroundColor:
                          i === activeShippingIdx
                            ? "rgba(26,24,22,0.75)"
                            : "rgba(26,24,22,0.2)",
                        border: "none",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              </motion.div>}

              {/* Video sticky container — same shrink/fan morph; now right-anchored.
                  Sticky + GSAP-animated layer is a plain div (ref=videoBoxRef) so
                  GSAP owns its transform. Framer-motion's load-in animation lives
                  on an inner motion.div so the two don't fight over `transform`. */}
              <div style={{ height: "130vh" }}>
                <div
                  ref={videoBoxRef}
                  className="sticky top-[22vh]"
                  style={{ maxWidth: 640, marginLeft: "auto", zIndex: 5, willChange: "transform" }}
                >
                <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 3.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "relative" }}
                >
              {/* "Selected Work" — fades in above the card as it shrinks */}
              <div
                className="work-label absolute left-0 right-0 text-center"
                style={{ opacity: 0, bottom: "100%", marginBottom: "2rem" }}
              >
                <p
                  className="text-xs font-medium uppercase tracking-[0.3em]"
                  style={{ color: "rgba(26,24,22,0.3)" }}
                >
                  Selected Work
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "clamp(2rem, 4vw, 3.5rem)",
                    fontWeight: 900,
                    color: "#1a1816",
                    letterSpacing: "-0.03em",
                    marginTop: "0.5rem",
                  }}
                >
                  Recent Projects
                </h2>
              </div>
              <TransitionLink href="/work/desert-wings" data-card>
              <div
                className="video-frame relative overflow-hidden mx-auto cursor-pointer"
                onMouseEnter={() => setHoveredFanIndex(-1)}
                onMouseLeave={() => setHoveredFanIndex(null)}
                style={{
                  borderRadius: 24,
                  border: "1px solid rgba(26,24,22,0.18)",
                  boxShadow: hoveredFanIndex === -1
                    ? "0 35px 80px rgba(0,0,0,0.2)"
                    : "0 25px 80px -12px rgba(0,0,0,0.15), 0 10px 30px -5px rgba(0,0,0,0.08)",
                  aspectRatio: "16/10",
                  transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease",
                  transform: (() => {
                    if (hoveredFanIndex === null) return "none";
                    if (hoveredFanIndex === -1) return "scale(1.05) translateY(-15px)";
                    return "scale(0.97) translateY(8px)";
                  })(),
                  zIndex: hoveredFanIndex === -1 ? 30 : 5,
                }}
              >
                {/* Project image underneath — revealed when video fades */}
                <Image
                  src="/Celestial Laptop Mockup.webp"
                  alt="Desert Wings"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                {/* Gradient + project info — hidden initially, shown after video fades */}
                <div className="card-overlay absolute inset-0" style={{ opacity: 0 }}>
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)" }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-2" style={{ color: "#78736c", opacity: 0.8 }}>
                      Flight School
                    </p>
                    <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "1.1rem", fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                      Desert Wings
                    </h3>
                  </div>
                </div>
                {/* Video — on top, fades out on scroll */}
                <video
                  className="hero-video absolute inset-0 w-full h-full object-cover"
                  autoPlay muted loop playsInline preload="auto"
                  poster="/video-poster.webp"
                >
                  <source src="/final-comp.mp4?v=6" type="video/mp4" />
                </video>
              </div>
              </TransitionLink>

              {/* Fan cards — emerge from behind the video card */}
              <HeroFanCards hoveredIndex={hoveredFanIndex} setHoveredIndex={setHoveredFanIndex} videoCardIndex={-1} />
                </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* === "Live Studio" bottom corners: client ticker BL, scroll hint + session timer BR ===
              Absolutely positioned at the bottom of the first viewport screen so they scroll
              with the page. The ticker wrapper uses .hero-marquee-wrapper so GSAP can shrink
              its max-width as the user scrolls into the fan moment — prevents the ticker from
              visually competing with the "Recent Projects" headline once it reaches the top. */}
          <div
            className="hero-bottom-aside hero-marquee-wrapper hidden lg:block absolute z-20"
            style={{
              top: "calc(100vh - 7vh)",
              left: "clamp(1.25rem, 3vw, 3rem)",
              maxWidth: 420,
              width: "calc(40% - 6vw)",
              willChange: "max-width",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <ClientLogosMarquee />
            </motion.div>
          </div>

          {false && <div
            className="hero-bottom-aside hidden lg:flex absolute z-20 flex-col items-end"
            style={{
              top: "calc(100vh - 7vh)",
              right: "clamp(1.25rem, 3vw, 3rem)",
              gap: "0.3rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 3.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-end"
              style={{ gap: "0.3rem" }}
            >
              {/* Scroll hint as a button — jumps past the sticky fan to the Work
                  section. Arrow + label darken in unison on hover to match the
                  "live dashboard" hover language used elsewhere. */}
              <button
                type="button"
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight * 2.3,
                    behavior: "smooth",
                  })
                }
                onMouseEnter={() => setScrollHintHovered(true)}
                onMouseLeave={() => setScrollHintHovered(false)}
                className="flex items-center cursor-pointer"
                style={{
                  gap: "0.55rem",
                  background: "transparent",
                  border: 0,
                  padding: 0,
                }}
              >
                <motion.span
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    fontSize: "0.95rem",
                    color: scrollHintHovered ? "#1a1816" : "rgba(26,24,22,0.5)",
                    lineHeight: 1,
                    transition: "color 0.3s ease",
                  }}
                >
                  ↓
                </motion.span>
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.66rem",
                    fontWeight: 600,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: scrollHintHovered ? "#1a1816" : "rgba(26,24,22,0.55)",
                    transition: "color 0.3s ease",
                  }}
                >
                  Scroll to work
                </span>
              </button>
              {/* Session timer + pulsing "live" dot */}
              <div className="flex items-center" style={{ gap: "0.4rem" }}>
                <motion.span
                  className="inline-block rounded-full"
                  animate={{ opacity: [0.25, 0.65, 0.25] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    width: 4,
                    height: 4,
                    backgroundColor: "rgba(26,24,22,0.55)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: "0.66rem",
                    fontVariantNumeric: "tabular-nums",
                    color: "rgba(26,24,22,0.35)",
                    letterSpacing: "0.08em",
                  }}
                >
                  Session {formatSession(sessionSeconds)}
                </span>
              </div>
            </motion.div>
          </div>}

          {/* View all work — pill link below the fan. Sits in natural flow after
              the sticky 130vh container releases, so it never fights with the
              pinned fan cards' z-index stacking. */}
          <div
            className="flex justify-center relative"
            style={{
              marginTop: "clamp(2rem, 4vh, 4rem)",
              paddingBottom: "clamp(4rem, 8vh, 7rem)",
              zIndex: 30,
            }}
          >
            <TransitionLink
              href="/work"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full transition-all duration-300 text-[#1a1816] hover:bg-[#1a1816] hover:border-[#1a1816] hover:text-[#f3f1ee]"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                border: "1.5px solid rgba(26,24,22,0.25)",
                backgroundColor: "transparent",
              }}
            >
              <span>View all work</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </TransitionLink>
          </div>

        </div>
      </section>

      {/* === SPLASH MENU === */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[100] [--clip-x:calc(100%-40px)] [--clip-y:76px] md:[--clip-x:calc(100%-52px)] md:[--clip-y:48px]"
            style={{ background: "#0a0908" }}
            initial={{ clipPath: "circle(0% at var(--clip-x) var(--clip-y))" }}
            animate={{ clipPath: "circle(150% at var(--clip-x) var(--clip-y))" }}
            exit={{ clipPath: "circle(0% at var(--clip-x) var(--clip-y))" }}
            transition={{ duration: 0.75, ease: [0.65, 0.05, 0, 1] }}
          >

            {/* Close button — lines animate from hamburger to X */}
            <button
              className="absolute top-[56px] right-5 md:top-7 md:right-8 w-9 h-9 rounded-full border border-white/15 flex items-center justify-center transition-all hover:bg-white hover:border-white group z-10"
              onClick={() => setMenuOpen(false)}
            >
              <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                <motion.span
                  className="absolute w-3.5 h-[1.5px] bg-white group-hover:bg-[#0a0908] transition-colors"
                  initial={{ rotate: 0, y: -2.5 }}
                  animate={{ rotate: 45, y: 0 }}
                  exit={{ rotate: 0, y: -2.5 }}
                  transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                />
                <motion.span
                  className="absolute w-3.5 h-[1.5px] bg-white group-hover:bg-[#0a0908] transition-colors"
                  initial={{ rotate: 0, y: 2.5 }}
                  animate={{ rotate: -45, y: 0 }}
                  exit={{ rotate: 0, y: 2.5 }}
                  transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                />
              </div>
            </button>

            {/* Layout — single column mobile, two column desktop */}
            <div className="h-full flex flex-col md:flex-row">
              {/* Left — navigation links */}
              <div className="flex-1 md:w-1/2 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24">
                <motion.p
                  className="text-xs uppercase tracking-[0.3em] mb-8"
                  style={{ color: "rgba(229, 225, 219, 0.4)" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Navigation
                </motion.p>

                {[
                  { href: "/", label: "HOME" },
                  { href: "/work", label: "WORK" },
                  { href: "/about", label: "ABOUT" },
                  { href: "/contact", label: "CONTACT" },
                ].map((link, i) => (
                  <SplashNavItem
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    index={i}
                    onNavigate={() => setMenuOpen(false)}
                  />
                ))}
              </div>

              {/* Right — info panel (hidden on mobile, shown on desktop) */}
              <div className="hidden md:flex w-1/2 h-full flex-col justify-between py-16 px-16 lg:px-24">
                {/* Top right — label */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "rgba(229, 225, 219, 0.4)" }}>
                    Get in Touch
                  </p>
                  <a
                    href="mailto:jake@jakeryall.com"
                    className="text-lg font-medium text-white/60 hover:text-[#78736c] transition-colors mt-2 inline-block"
                  >
                    jake@jakeryall.com
                  </a>
                </motion.div>

                {/* Center — big statement */}
                <motion.p
                  className="text-white/[0.03] font-black leading-[0.85]"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "clamp(6rem, 12vw, 14rem)",
                    letterSpacing: "-0.04em",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  JR
                </motion.p>

                {/* Bottom — socials */}
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <div className="flex items-center gap-6">
                    {[
                      { label: "LinkedIn", href: "https://www.linkedin.com/in/jake-ryall" },
                      { label: "Dribbble", href: "https://dribbble.com/jake-ryall" },
                      { label: "Instagram", href: "https://instagram.com/exec.ai.solutions" },
                      { label: "GitHub", href: "https://github.com/jaketryall" },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/30 hover:text-[#78736c] transition-colors"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/20">
                    &copy; {new Date().getFullYear()}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Main Hero export — single responsive component
export default function Hero() {
  return <DesktopHero />;
}
