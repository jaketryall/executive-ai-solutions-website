"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface CardSectionProps {
  children: ReactNode;
  className?: string;
  // Visual variants
  variant?: "dark" | "light" | "glass" | "gradient";
  // Rounded corner options
  rounded?: "top" | "bottom" | "both" | "none";
  // Enable 3D tilt effect on hover
  tiltEffect?: boolean;
  // Enable magnetic effect
  magnetic?: boolean;
  // Custom background
  background?: string;
  // Glow effect
  glow?: boolean;
  glowColor?: string;
  // Inner padding
  noPadding?: boolean;
  // Animation on scroll
  animateOnScroll?: boolean;
}

export function CardSection({
  children,
  className = "",
  variant = "dark",
  rounded = "both",
  tiltEffect = false,
  magnetic = false,
  background,
  glow = false,
  glowColor = "#d4a537",
  noPadding = false,
  animateOnScroll = true,
}: CardSectionProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), {
    stiffness: 200,
    damping: 30,
  });

  // Magnetic effect
  const magneticX = useSpring(0, { stiffness: 150, damping: 15 });
  const magneticY = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (tiltEffect) {
      mouseX.set(x);
      mouseY.set(y);
    }

    if (magnetic) {
      magneticX.set(x * 20);
      magneticY.set(y * 20);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    magneticX.set(0);
    magneticY.set(0);
  };

  // Variant styles
  const variantStyles = {
    dark: "bg-[#0a0a0a] border-zinc-800/50",
    light: "bg-[#fafafa] border-zinc-200/50",
    glass: "bg-white/5 backdrop-blur-xl border-white/10",
    gradient: "bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 border-zinc-800/50",
  };

  // Rounded corner styles
  const roundedStyles = {
    top: "rounded-t-[2rem] md:rounded-t-[3rem]",
    bottom: "rounded-b-[2rem] md:rounded-b-[3rem]",
    both: "rounded-[2rem] md:rounded-[3rem]",
    none: "",
  };

  const baseStyles = `
    relative overflow-hidden border
    ${variantStyles[variant]}
    ${roundedStyles[rounded]}
    ${!noPadding ? "p-8 md:p-12 lg:p-16" : ""}
    ${className}
  `;

  const content = (
    <>
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${variant === "light" ? "#0a0a0a" : "#ffffff"} 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow effect */}
      {glow && (
        <motion.div
          className="absolute -inset-1 rounded-inherit pointer-events-none -z-10"
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor}20 0%, transparent 70%)`,
            filter: "blur(40px)",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Gradient border effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none opacity-0"
        style={{
          background: `linear-gradient(135deg, ${glowColor}20 0%, transparent 50%, ${glowColor}10 100%)`,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </>
  );

  if (tiltEffect || magnetic) {
    return (
      <motion.div
        ref={cardRef}
        className={baseStyles}
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
          rotateX: tiltEffect ? rotateX : 0,
          rotateY: tiltEffect ? rotateY : 0,
          x: magnetic ? magneticX : 0,
          y: magnetic ? magneticY : 0,
          background,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={animateOnScroll ? { opacity: 0, y: 40 } : undefined}
        whileInView={animateOnScroll ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={baseStyles}
      style={{ background }}
      initial={animateOnScroll ? { opacity: 0, y: 40 } : undefined}
      whileInView={animateOnScroll ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {content}
    </motion.div>
  );
}

// Magnetic Button Component
interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
}

export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  strength = 0.3,
}: MagneticButtonProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const ref = href ? anchorRef.current : divRef.current;
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    x.set(distX * strength);
    y.set(distY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (href) {
    return (
      <motion.a
        ref={anchorRef}
        href={href}
        onClick={onClick}
        className={`inline-block cursor-pointer ${className}`}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.div
      ref={divRef}
      onClick={onClick}
      className={`inline-block cursor-pointer ${className}`}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

// Reveal Animation Wrapper
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container for children animations
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
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

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
