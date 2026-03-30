"use client";

import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TransitionLink } from "@/components/PageTransition";
import { SplitText, useSplitTextReveal } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const accentColor = "rgba(255, 200, 150, 1)";
const accentColorMuted = "rgba(255, 200, 150, 0.6)";
const textColor = "#f5f0e8";
const textMuted = "rgba(245, 240, 232, 0.5)";
const borderColor = "rgba(255, 200, 150, 0.15)";

const services = [
  {
    slug: "website-design",
    number: "01",
    title: "Design & Development",
    description:
      "High-converting websites that turn visitors into customers. We craft digital experiences that captivate and convert.",
    details: [
      "Custom design tailored to your brand",
      "Responsive, mobile-first development",
      "Performance optimized for conversions",
    ],
    image: "/Rubber iPhone Mockup.webp",
  },
  {
    slug: "seo",
    number: "02",
    title: "SEO & Strategy",
    description:
      "Data-driven strategies that drive organic traffic and rankings. Dominate search results and outperform your competition.",
    details: [
      "Comprehensive keyword research",
      "Technical SEO optimization",
      "Content strategy & link building",
    ],
    image: "/Celestial Laptop Mockup.webp",
  },
  {
    slug: "custom-solutions",
    number: "03",
    title: "Custom Solutions",
    description:
      "Tailored systems and software that scale with your business. From automation to AI, we build what you need.",
    details: [
      "Bespoke software development",
      "Seamless system integrations",
      "Scalable cloud architecture",
    ],
    image: "/custom-dashboard-mockup.webp",
  },
];

/* ─────────────── Cursor-following image ─────────────── */

function CursorImage({
  image,
  isVisible,
}: {
  image: string;
  isVisible: boolean;
}) {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);

  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotation = useMotionValue(0);
  const springRotation = useSpring(rotation, {
    stiffness: 200,
    damping: 30,
  });

  const lastX = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 140);
      mouseY.set(e.clientY - 190);

      const deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;
      rotation.set(gsap.utils.clamp(-12, 12, deltaX * 0.5));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, rotation]);

  // Decay rotation back to zero
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      rotation.set(rotation.get() * 0.9);
    }, 50);
    return () => clearInterval(interval);
  }, [isVisible, rotation]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            x,
            y,
            rotate: springRotation,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 280,
              height: 380,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Image
              src={image}
              alt=""
              width={280}
              height={380}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              priority
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────── Desktop Service Row ─────────────── */

function DesktopServiceRow({
  service,
  index,
  isOpen,
  isHovered,
  onToggle,
  onHoverStart,
  onHoverEnd,
}: {
  service: (typeof services)[0];
  index: number;
  isOpen: boolean;
  isHovered: boolean;
  onToggle: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const row = rowRef.current;
    const divider = dividerRef.current;
    const number = numberRef.current;
    const title = titleRef.current;
    if (!row || !divider || !number || !title) return;

    const ctx = gsap.context(() => {
      // 1. Gold divider line draws on scrub
      gsap.fromTo(
        divider,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          },
        }
      );

      // 2. Number fades up on scrub
      gsap.fromTo(
        number,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            end: "top 55%",
            scrub: 1,
          },
        }
      );

      // 3. Title fades up on scrub
      gsap.fromTo(
        title,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      // 4. Row content parallax — each row moves at slightly different speed
      const parallaxAmount = 20 + index * 15;
      gsap.fromTo(
        row,
        { y: parallaxAmount },
        {
          y: -parallaxAmount * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, row);

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={rowRef} className="service-row relative">
      {/* Gold divider line */}
      <div
        ref={dividerRef}
        style={{
          height: 1,
          backgroundColor: "rgba(255, 200, 150, 0.3)",
          transformOrigin: "left",
          transform: "scaleX(0)",
        }}
      />


      {/* Clickable header */}
      <button
        onClick={onToggle}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        className="relative w-full"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2.5rem 0",
          paddingTop: "3.5rem",
          paddingBottom: "3.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          gap: "2rem",
        }}
      >
        {/* Number */}
        <motion.span
          ref={numberRef}
          animate={{ x: isHovered ? 8 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
            fontWeight: 500,
            color: accentColor,
            minWidth: "3rem",
            textAlign: "left",
          }}
        >
          {service.number}
        </motion.span>

        {/* Title */}
        <div style={{ flex: 1, textAlign: "left" }}>
          <motion.span
            ref={titleRef}
            animate={{
              color: isHovered || isOpen ? accentColor : textColor,
              x: isHovered ? 12 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(2rem, 5vw, 5rem)",
              fontWeight: 900,
              lineHeight: 1,
              display: "inline-block",
              letterSpacing: "-0.025em",
            }}
          >
            {service.title}
          </motion.span>

          {/* Gold underline sweep on hover/open */}
          <motion.div
            animate={{ scaleX: isHovered || isOpen ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              height: 2,
              backgroundColor: accentColor,
              transformOrigin: "left",
              marginTop: 8,
              maxWidth: 300,
            }}
          />
        </div>

        {/* Plus / X toggle icon */}
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0, scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            color: accentColor,
            lineHeight: 1,
            fontWeight: 300,
            flexShrink: 0,
          }}
        >
          +
        </motion.span>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3, delay: 0.1 },
            }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingBottom: "2.5rem",
                paddingLeft: "4rem",
                maxWidth: "640px",
              }}
            >
              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "clamp(0.95rem, 1.2vw, 1.125rem)",
                  lineHeight: 1.7,
                  color: textMuted,
                  marginBottom: "1.5rem",
                }}
              >
                {service.description}
              </motion.p>

              {/* Detail bullets — stagger in from left */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {service.details.map((detail, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                      color: textColor,
                      padding: "0.4rem 0",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: accentColor,
                        flexShrink: 0,
                      }}
                    />
                    {detail}
                  </motion.li>
                ))}
              </ul>

              {/* Learn More CTA */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.45 }}
                style={{ marginTop: "1.75rem" }}
              >
                <TransitionLink href={`/services/${service.slug}`}>
                  <motion.span
                    whileHover={{ letterSpacing: "0.12em" }}
                    transition={{ duration: 0.3 }}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: accentColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    Learn More &rarr;
                  </motion.span>
                </TransitionLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── Desktop Services ─────────────── */

function DesktopServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Split text reveal for pinned title
  useSplitTextReveal(headerRef);

  // GSAP: Pin the left column while right column scrolls past
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColumnRef.current;
    if (!section || !leftCol) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: leftCol,
        pinSpacing: false,
      });
    }, section);

    // Refresh ScrollTrigger after layout settles
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="dark"
      className="hidden md:block"
      style={{
        position: "relative",
        padding: "0 clamp(1rem, 3vw, 3rem)",
        paddingBottom: "clamp(1rem, 3vw, 3rem)",
      }}
    >
      <div
        style={{
          backgroundColor: "#141210",
          borderRadius: "clamp(1.5rem, 3vw, 3rem)",
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
        }}
      >
      {/* Cursor-following image */}
      <CursorImage
        image={hoveredIndex !== null ? services[hoveredIndex].image : ""}
        isVisible={hoveredIndex !== null}
      />

      {/* Giant background number — changes per hovered service */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden"
        style={{ width: "50%", height: "100%" }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={hoveredIndex ?? "none"}
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 0.04, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[-10%] top-1/2 -translate-y-1/2 font-black"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(20rem, 40vw, 50rem)",
              lineHeight: 0.8,
              color: accentColor,
            }}
          >
            {hoveredIndex !== null ? services[hoveredIndex].number : ""}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Two-column layout */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(2rem, 5vw, 4rem)",
          display: "flex",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Left column — pinned title (40%) */}
        <div
          ref={leftColumnRef}
          style={{
            width: "40%",
            flexShrink: 0,
            paddingTop: "12rem",
            paddingRight: "3rem",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div ref={headerRef}>
            {/* Label */}
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: accentColorMuted,
                marginBottom: "1rem",
              }}
            >
              What I Do
            </p>

            {/* Pinned big title */}
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(2.5rem, 4vw, 5rem)",
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: textColor,
                marginBottom: "2rem",
              }}
            >
              SERVICES
            </h2>
          </div>

          {/* Dynamic description — changes based on hovered/open service */}
          <div style={{ minHeight: "6rem" }}>
            <AnimatePresence mode="wait">
              {(hoveredIndex !== null || openIndex !== null) && (
                <motion.div
                  key={hoveredIndex ?? openIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
                      lineHeight: 1.7,
                      color: textMuted,
                    }}
                  >
                    {services[hoveredIndex ?? openIndex ?? 0].description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right column — accordion rows (60%) */}
        <div
          style={{
            width: "60%",
            paddingTop: "8rem",
            paddingBottom: "8rem",
          }}
        >
          {services.map((service, i) => (
            <DesktopServiceRow
              key={service.slug}
              service={service}
              index={i}
              isOpen={openIndex === i}
              isHovered={hoveredIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
            />
          ))}

          {/* Bottom divider for the last row */}
          <div
            style={{
              height: 1,
              backgroundColor: borderColor,
            }}
          />
        </div>
      </div>
      </div>
    </section>
  );
}

/* ─────────────── Mobile Services ─────────────── */

function MobileServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rowsContainerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useSplitTextReveal(headerRef);

  // GSAP: Simple stagger reveal for mobile rows
  useIsomorphicLayoutEffect(() => {
    const container = rowsContainerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(
        container.querySelectorAll(".mobile-service-row")
      );

      gsap.set(rows, { y: 40, opacity: 0 });

      gsap.to(rows, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, container);

    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timeout);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg="dark"
      className="md:hidden"
      style={{
        padding: "5rem 0",
        position: "relative",
      }}
    >
      <div style={{ padding: "0 1.25rem" }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: "3rem" }}>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.7rem",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: accentColorMuted,
              marginBottom: "0.75rem",
            }}
          >
            What I Do
          </p>

          <SplitText
            text="SERVICES"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(2.5rem, 12vw, 4rem)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: textColor,
            }}
          />
        </div>

        {/* Accordion */}
        <div
          ref={rowsContainerRef}
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          {services.map((service, i) => (
            <div
              key={service.slug}
              className="mobile-service-row"
              style={{ borderBottom: `1px solid ${borderColor}` }}
            >
              {/* Header */}
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.25rem 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: accentColorMuted,
                    minWidth: "1.75rem",
                  }}
                >
                  {service.number}
                </span>

                <motion.span
                  animate={{
                    color: openIndex === i ? accentColor : textColor,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "clamp(1.25rem, 5vw, 1.75rem)",
                    fontWeight: 900,
                    lineHeight: 1.2,
                    flex: 1,
                    textAlign: "left",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {service.title}
                </motion.span>

                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    fontSize: "1.5rem",
                    color: accentColor,
                    lineHeight: 1,
                    fontWeight: 300,
                    flexShrink: 0,
                  }}
                >
                  +
                </motion.span>
              </button>

              {/* Expandable content */}
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: {
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.25, delay: 0.1 },
                    }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        paddingBottom: "1.75rem",
                        paddingLeft: "2.75rem",
                      }}
                    >
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.9rem",
                          lineHeight: 1.7,
                          color: textMuted,
                          marginBottom: "1.25rem",
                        }}
                      >
                        {service.description}
                      </motion.p>

                      <ul
                        style={{
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        {service.details.map((detail, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.15 + j * 0.07,
                            }}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "0.825rem",
                              color: textColor,
                              padding: "0.35rem 0",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.6rem",
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                backgroundColor: accentColor,
                                flexShrink: 0,
                              }}
                            />
                            {detail}
                          </motion.li>
                        ))}
                      </ul>

                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                        style={{ marginTop: "1.25rem" }}
                      >
                        <TransitionLink href={`/services/${service.slug}`}>
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: accentColor,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Learn More &rarr;
                          </span>
                        </TransitionLink>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Export ─────────────── */

export default function Services() {
  return (
    <>
      <DesktopServices />
      <MobileServices />
    </>
  );
}
