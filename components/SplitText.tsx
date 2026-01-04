"use client";

import { useRef, useEffect, useLayoutEffect, ReactNode } from "react";
import { motion, useInView, Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation preset types
type AnimationType =
  | "fadeUp"
  | "fadeDown"
  | "slideUp"
  | "slideDown"
  | "chars"
  | "words"
  | "lines"
  | "blur"
  | "scale"
  | "rotate"
  | "scramble";

interface SplitTextProps {
  children: string;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  stagger?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  scrub?: boolean | number;
  start?: string;
  end?: string;
}

// Character-by-character animation
function CharacterAnimation({
  children,
  className = "",
  delay = 0,
  stagger = 0.02,
  duration = 0.5,
  once = true,
  threshold = 0.5,
  animation = "fadeUp",
}: Omit<SplitTextProps, "as" | "scrub" | "start" | "end">) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const chars = children.split("");

  const getVariants = (): Variants => {
    switch (animation) {
      case "fadeUp":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
      case "fadeDown":
        return {
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        };
      case "blur":
        return {
          hidden: { opacity: 0, filter: "blur(10px)" },
          visible: { opacity: 1, filter: "blur(0px)" },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0 },
          visible: { opacity: 1, scale: 1 },
        };
      case "rotate":
        return {
          hidden: { opacity: 0, rotateX: 90, y: 20 },
          visible: { opacity: 1, rotateX: 0, y: 0 },
        };
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  const variants = getVariants();

  return (
    <span ref={ref} className={`inline-block ${className}`} style={{ perspective: "1000px" }}>
      {chars.map((char, index) => (
        <motion.span
          key={index}
          className="inline-block"
          style={{
            whiteSpace: char === " " ? "pre" : "normal",
            transformStyle: "preserve-3d",
          }}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={variants}
          transition={{
            duration,
            delay: delay + index * stagger,
            ease: [0.215, 0.61, 0.355, 1],
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// Word-by-word animation
function WordAnimation({
  children,
  className = "",
  delay = 0,
  stagger = 0.08,
  duration = 0.6,
  once = true,
  threshold = 0.5,
  animation = "fadeUp",
}: Omit<SplitTextProps, "as" | "scrub" | "start" | "end">) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const words = children.split(" ");

  const getVariants = (): Variants => {
    switch (animation) {
      case "fadeUp":
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        };
      case "slideUp":
        return {
          hidden: { opacity: 0, y: 60, rotateX: 45 },
          visible: { opacity: 1, y: 0, rotateX: 0 },
        };
      case "blur":
        return {
          hidden: { opacity: 0, filter: "blur(12px)", y: 20 },
          visible: { opacity: 1, filter: "blur(0px)", y: 0 },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0 },
        };
      default:
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  const variants = getVariants();

  return (
    <span ref={ref} className={`inline ${className}`} style={{ perspective: "1000px" }}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            style={{ transformStyle: "preserve-3d" }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            transition={{
              duration,
              delay: delay + index * stagger,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Line-by-line animation (splits at natural breakpoints)
function LineAnimation({
  children,
  className = "",
  delay = 0,
  stagger = 0.15,
  duration = 0.8,
  once = true,
  threshold = 0.3,
  animation = "fadeUp",
}: Omit<SplitTextProps, "as" | "scrub" | "start" | "end">) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  // Split by explicit newlines or treat as single line
  const lines = children.includes("\n") ? children.split("\n") : [children];

  const getVariants = (): Variants => {
    switch (animation) {
      case "fadeUp":
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
      case "slideUp":
        return {
          hidden: { opacity: 0, y: "100%" },
          visible: { opacity: 1, y: 0 },
        };
      case "blur":
        return {
          hidden: { opacity: 0, filter: "blur(20px)", y: 30 },
          visible: { opacity: 1, filter: "blur(0px)", y: 0 },
        };
      default:
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0 },
        };
    }
  };

  const variants = getVariants();

  return (
    <div ref={ref} className={className}>
      {lines.map((line, index) => (
        <div key={index} className="overflow-hidden">
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            transition={{
              duration,
              delay: delay + index * stagger,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// Scramble text effect (like TextScramble but smoother)
function ScrambleAnimation({
  children,
  className = "",
  delay = 0,
  duration = 1.5,
  once = true,
  threshold = 0.5,
}: Omit<SplitTextProps, "as" | "scrub" | "start" | "end" | "stagger" | "animation">) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const element = ref.current;
    const originalText = children;
    let frame = 0;
    const totalFrames = Math.floor(duration * 60);

    const timeout = setTimeout(() => {
      const animate = () => {
        const progress = frame / totalFrames;
        const revealedLength = Math.floor(progress * originalText.length);

        let displayText = "";
        for (let i = 0; i < originalText.length; i++) {
          if (i < revealedLength) {
            displayText += originalText[i];
          } else if (originalText[i] === " ") {
            displayText += " ";
          } else {
            displayText += chars[Math.floor(Math.random() * chars.length)];
          }
        }

        element.textContent = displayText;
        frame++;

        if (frame <= totalFrames) {
          requestAnimationFrame(animate);
        } else {
          element.textContent = originalText;
        }
      };

      animate();
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, children, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {children.split("").map((char, i) => (
        <span key={i} style={{ opacity: 0 }}>
          {char}
        </span>
      ))}
    </span>
  );
}

// GSAP ScrollTrigger-powered animation (for scrub effects)
function GSAPSplitText({
  children,
  className = "",
  delay = 0,
  stagger = 0.02,
  duration = 0.5,
  animation = "fadeUp",
  scrub = 0.5,
  start = "top 80%",
  end = "top 20%",
  as: Component = "div",
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    if (!containerRef.current) return;

    const chars = containerRef.current.querySelectorAll(".split-char");

    const getAnimation = () => {
      switch (animation) {
        case "fadeUp":
          return { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0 } };
        case "blur":
          return { from: { opacity: 0, filter: "blur(10px)" }, to: { opacity: 1, filter: "blur(0px)" } };
        case "scale":
          return { from: { opacity: 0, scale: 0 }, to: { opacity: 1, scale: 1 } };
        case "rotate":
          return { from: { opacity: 0, rotationX: 90, y: 30 }, to: { opacity: 1, rotationX: 0, y: 0 } };
        default:
          return { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0 } };
      }
    };

    const { from, to } = getAnimation();

    gsap.fromTo(
      chars,
      from,
      {
        ...to,
        duration,
        stagger,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub: typeof scrub === "boolean" ? (scrub ? 0.5 : false) : scrub,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [animation, delay, duration, end, scrub, stagger, start]);

  const charElements = children.split("").map((char, index) => (
    <span
      key={index}
      className="split-char inline-block"
      style={{
        whiteSpace: char === " " ? "pre" : "normal",
        transformStyle: "preserve-3d",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <Component ref={containerRef as any} className={className} style={{ perspective: "1000px" }}>
      {charElements}
    </Component>
  );
}

// Main SplitText component - chooses the right implementation
export default function SplitText({
  children,
  className = "",
  animation = "fadeUp",
  delay = 0,
  stagger,
  duration,
  once = true,
  threshold = 0.5,
  as: Component = "div",
  scrub,
  start,
  end,
}: SplitTextProps) {
  // If scrub is enabled, use GSAP version
  if (scrub !== undefined) {
    return (
      <GSAPSplitText
        className={className}
        animation={animation}
        delay={delay}
        stagger={stagger ?? 0.02}
        duration={duration ?? 0.5}
        scrub={scrub}
        start={start ?? "top 80%"}
        end={end ?? "top 20%"}
        as={Component}
      >
        {children}
      </GSAPSplitText>
    );
  }

  // Choose animation based on type
  switch (animation) {
    case "chars":
    case "blur":
    case "scale":
    case "rotate":
      return (
        <CharacterAnimation
          className={className}
          animation={animation === "chars" ? "fadeUp" : animation}
          delay={delay}
          stagger={stagger ?? 0.02}
          duration={duration ?? 0.5}
          once={once}
          threshold={threshold}
        >
          {children}
        </CharacterAnimation>
      );

    case "words":
    case "fadeUp":
    case "fadeDown":
      return (
        <WordAnimation
          className={className}
          animation={animation === "words" ? "fadeUp" : animation}
          delay={delay}
          stagger={stagger ?? 0.08}
          duration={duration ?? 0.6}
          once={once}
          threshold={threshold}
        >
          {children}
        </WordAnimation>
      );

    case "lines":
    case "slideUp":
    case "slideDown":
      return (
        <LineAnimation
          className={className}
          animation={animation === "lines" ? "fadeUp" : animation}
          delay={delay}
          stagger={stagger ?? 0.15}
          duration={duration ?? 0.8}
          once={once}
          threshold={threshold}
        >
          {children}
        </LineAnimation>
      );

    case "scramble":
      return (
        <ScrambleAnimation
          className={className}
          delay={delay}
          duration={duration ?? 1.5}
          once={once}
          threshold={threshold}
        >
          {children}
        </ScrambleAnimation>
      );

    default:
      return (
        <WordAnimation
          className={className}
          animation="fadeUp"
          delay={delay}
          stagger={stagger ?? 0.08}
          duration={duration ?? 0.6}
          once={once}
          threshold={threshold}
        >
          {children}
        </WordAnimation>
      );
  }
}

// Export individual components for direct use
export { CharacterAnimation, WordAnimation, LineAnimation, ScrambleAnimation, GSAPSplitText };
